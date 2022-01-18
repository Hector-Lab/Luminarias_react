import React, { useEffect, useState } from "react";
import { View, TouchableOpacity, Modal } from "react-native";
import { Text } from 'react-native-elements';
import Styles from "../../Styles/BachesStyles";
import { Input, Avatar, Icon } from 'react-native-elements'
import { BlueColor, DarkPrimaryColor, cardColor, buttonSuccess } from '../../Styles/BachesColor';
import { ScrollView } from "react-native-gesture-handler";
import { StorageBaches } from '../controller/storage-controllerBaches';
import { Picker } from "@react-native-picker/picker";
import { ObtenerMunicipios, RegistrarCiudadano, RecuperarDatos, editarDatosCiudadano } from '../controller/api-controller';
import { checkConnection, CordenadasActualesNumerico,ObtenerDireccionActual, verificarcurp , rfcValido } from '../../utilities/utilities';
import  * as Location from 'expo-location';
import { WIFI_OFF,USER_COG,DESCONOCIDO, WIFI, OK} from '../../Styles/Iconos'; 
import Message from '../components/modal-message';
import Loading from '../components/modal-loading';

export default function CustomMapBaches(props:any){
    const [ RFC, setRFC ] = useState("");
    const [ CURP, setCURP ] = useState(String);
    const [ nombres, setNombres ] = useState(String);
    const [ materno,setMaterno ] = useState(String);
    const [ paterno,setPaterno ] = useState(String);
    const [ telefono, setTelefono ] = useState(String);
    const [ email,setEmail ] = useState(String);
    const [ errorUI, setErrorUI] = useState(String);
    const [ errorMsg,setErrorMsg ] = useState(String);
    const [ arregloMunicipios, setArregloMunicipios ] = useState([]);
    const [ cliente, setCliente ] = useState(-1);
    const [ showMessage, setShowMessage ] = useState(false);
    const [ solicitarDatos, setSolicitarDatos ] = useState(false);
    const [ loading, setLoading ] = useState(true);
    const [ iconModal, setIconModal ] = useState("info");
    const [ tipoBoton , setTipoBoton ] = useState(true); // NOTE: true - Agregar, false - Editar
    const [iconSource, setIconSource ] = useState("");
    const [mostrarPicker, setMostrarPicker ] = useState(true);
    const curpError = ["","Favor de revisar la CURP ingresada","Formato de CURP no valido"];
    const storage = new StorageBaches();
    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            await RestaurarDatos();
            storage.createTablasBaches();
            if (status !== 'granted') {
                setErrorMsg('Permisos negados');
                await Municipios("");
              return;
            }else{
                let coords = await CordenadasActualesNumerico();
                let jsonUbicacion = await ObtenerDireccionActual(coords);
                if(jsonUbicacion != null && jsonUbicacion != undefined )
                {
                    let ubicacionActual = JSON.parse(jsonUbicacion);
                    let indicioFormato ="";//String(ubicacionActual.region).normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                    Municipios(indicioFormato);
                }else{
                    Municipios("");
                }
            }
          })();
      },[]);
      
    const GuardarDatos = async () =>{
        setLoading(true);
        let errorCURP = ""; 
        let error = "";
        if(CURP == "" ){
            error += "C,";
        }else{
            let validcurp = verificarcurp(CURP);
            if(validcurp != 0){
                error += "C,";
                errorCURP = " - "+curpError[validcurp];
            }
        }
        if(nombres == "" ){
            error += "N,";
        }
        if(materno == "" ){
            error += "M,";
        }
        if(paterno == "" ){
            error += "P,";
        }
        if(telefono == "" ){
            error += "T,";
        }
        if(email == "" ){
            error += "E,";
        }
        if(RFC == ""){
            setRFC("XAXX010101000");
        }
        //NOTE: Verificamos la seleccion del cliente
        if(String(cliente).includes("-1")){
            error += "CL,";
        }
        setErrorUI(error);
        if(error == ""){
            let data = {
                curp:CURP,
                Nombres:nombres,
                Paterno:paterno,
                Materno: materno,
                Telefono:telefono,
                Email: email,
                Cliente: String(cliente),
                rfc:RFC == "" ? "XAXX010101000" : RFC
            }
            //NOTE: Verificamos el tipo de procedimiento
            if(tipoBoton){
                if(checkConnection()){
                    //NOTE: Lo guardamos en la base de datos
                    let errorMensaje = "";
                    let Codificacion = await RegistrarCiudadano(data);
                    console.log(Codificacion);
                    if(Codificacion.Code != 200){
                        if(Codificacion.Code == 423){
                            errorMensaje = "La CURP ingresada ya esta en uso";
                        }
                        if(Codificacion.Code == 403){
                            errorMensaje = "Hubo un problema al registrar el usuario, Favor de reintentar mas tarde";
                        }
                        setErrorMsg(errorMensaje);
                        setIconModal( USER_COG[0] );
                        setIconSource( USER_COG[1] );
                        setShowMessage(true);
                    }else{
                        //NOTE: Guardamos los datos de los usuarios
                        await storage.GuardarDatosPersona(data);
                        await storage.guardarIdCiudadano(Codificacion.Mensaje[0].id);
                        setErrorMsg("Registro exitoso");
                        setIconModal(OK[0]);
                        setIconSource(OK[1]);
                        setShowMessage(true);
                        //NOTE: mostramos los datos
                        setMostrarPicker(false);
                    }
                    setLoading(false);
                }else{
                    setIconModal(WIFI_OFF[0]);
                    setIconSource(WIFI_OFF[1]);
                    setErrorMsg("Sin conexion a interner");
                    setLoading(false);
                }
            }else{
                if(checkConnection()){
                    let errorMensaje = "";
                    await editarDatosCiudadano(CURP,telefono,email)
                    .then( async (result)=>{
                        //NOTE: notas
                        let ciudadano = JSON.parse(result);
                        let estructuraCiudadano = {
                            curp:ciudadano.Curp,
                            Nombres:ciudadano.Nombre,
                            Paterno:ciudadano.ApellidoPaterno,
                            Materno: ciudadano.ApellidoMaterno,
                            Telefono:ciudadano.Telefono,
                            Email: ciudadano.CorreoElectronico,
                            Cliente: String(cliente),
                            rfc:ciudadano.rfc
                        };
                        console.log(estructuraCiudadano);
                        await storage.GuardarDatosPersona(estructuraCiudadano);
                        await RestaurarDatos();
                        setErrorMsg("Datos Actualizados");
                        setIconModal(OK[0]);
                        setIconSource(OK[1]);
                        setShowMessage(true);
                    })
                    .catch(( error )=>{
                        let mensaje = String(error.message);
                        if(mensaje == "OK"){
                            setErrorMsg("Datos Actualizados");
                            setIconModal(OK[0]);
                            setIconSource(OK[1]);
                            setShowMessage(true);
                        }else{
                            //NOTE: manejador de errores
                            setIconModal(WIFI_OFF[0]);
                            setIconSource(WIFI_OFF[1]);
                            setErrorMsg("Sin conexion a interner");
                        }
                    })
                    .finally(()=>{
                        setLoading(false);
                    })
                    
                }else{                    
                    setIconModal(WIFI_OFF[0]);
                    setIconSource(WIFI_OFF[1]);
                    setErrorMsg("Sin conexion a interner");
                    setLoading(false);
                }
            }

        }else{
            errorCURP != "" ? setErrorMsg(errorCURP + "\n\n- Favor de ingresar los datos requeridos") : setErrorMsg("Favor de ingresar los datos requeridos");
            setIconModal(USER_COG[0]);
            setIconSource(USER_COG[1]);
            setShowMessage(true);
            setLoading(false);
        }
    }
    const Municipios = async ( indicio:string ) =>{
        let internetAviable = await checkConnection();
        if(internetAviable){
            //NOTE: Obtenemos los datos desde la API, limpiamoa la tabla e insertamos los datos
            let listaMunicipio = await ObtenerMunicipios();
            let municipiosAuxiliar = [];
            listaMunicipio.map((item,index)=>{
                let municipioFormato = String(item.Municipio).normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                if(municipioFormato.includes(indicio) || indicio.includes(String(item.Nombre))){
                    municipiosAuxiliar.push(item);
                }
            });
            setArregloMunicipios(municipiosAuxiliar);
            storage.LimpiarTabla("CatalogoClientes");
            await storage.InsertarMunicipios(listaMunicipio);
        }else{
            //NOTE: Obtenemos los desde la db
            let listaMunicipio = await storage.ObtenerMunicipiosDB();
            let municipiosAuxiliar = [];
            listaMunicipio.map((item,index)=>{
                let municipioFormato = String(item.Municipio).normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                if(municipioFormato.includes(indicio) || indicio.includes(String(item.Nombre))){
                    municipiosAuxiliar.push(item);
                }
            });
            setArregloMunicipios(municipiosAuxiliar);
        }
    } 
    //NOTE: este metodo es para recuperarlo desde el storage
    const RestaurarDatos = async () =>{
        try{
            console.log("Es al cargar los datos del empleado");
            let persona = await storage.obtenerDatosPersona();
            console.log(persona);
            if(persona != null ){
                setTipoBoton(false);
                let datos = JSON.parse(persona);                
                setCliente(datos['Cliente']);
                setCURP(datos['curp']);
                setRFC(String(datos['rfc']).includes("XAXX010101000") ? "" : datos['rfc']);
                setNombres(datos['Nombres']);
                setMaterno(datos['Materno']);
                setPaterno(datos['Paterno']);
                setTelefono(datos['Telefono']);
                setEmail(datos['Email']);
                setSolicitarDatos(false);
                setLoading(false);
                //NOTE: mostramos un mensaje de ok
                setErrorMsg("Datos Recuperados");
                setIconModal(OK[0]);
                setIconSource(OK[1]);
                setShowMessage(true);
                setMostrarPicker(false);
            }else{
                setTipoBoton(true);
                setSolicitarDatos(true);
            }
        }catch(error){
            //NOTE: captura la expecion al convertir el json ( no se por que lo lanza )
            console.log(error);
        }
    }
    const RestaurarDatosModal = async () =>{
        //FIXME: validar los campos 
        setLoading(true);
        await RecuperarDatos(String(cliente),CURP)
        .then( async (rawCiudadano)=>{
            let ciudadano = JSON.parse(rawCiudadano);//FIXME: aqui es el error
            let estructuraCiudadano = {
                curp:ciudadano.Curp,
                Nombres:ciudadano.Nombre,
                Paterno:ciudadano.ApellidoPaterno,
                Materno: ciudadano.ApellidoMaterno,
                Telefono:ciudadano.Telefono,
                Email: ciudadano.CorreoElectronico,
                Cliente: String(cliente),
                rfc:ciudadano.rfc
            };
            await storage.GuardarDatosPersona(estructuraCiudadano);
            await storage.guardarIdCiudadano(ciudadano.id);
            await RestaurarDatos();
        })
        .catch((error)=>{
            let apiError = String(error.message);
            setErrorMsg(apiError);
            if(apiError.includes("500")){ //NOTE: Error desconocido
                setErrorMsg("Error desconocido");
                setIconModal(DESCONOCIDO[0]);
                setIconSource(DESCONOCIDO[1]);
            }else if(apiError.includes("interner")){
                setIconModal(WIFI_OFF[0]);
                setIconSource(WIFI_OFF[1]);
            }else {
                setIconModal(USER_COG[0]);
                setIconSource(USER_COG[1]);
            }
            setShowMessage(true);
        }).finally(()=>{
            setLoading(false);
        })
    }
    const EliminarDatosPrueba = async () =>{
        //NOTE: metodo de prueba para el modal
        await storage.borrarDatosCiudadano();
        limpiarDatosPantalla();
        setLoading(true);
        setTimeout(()=>{
            setLoading(false);
            setSolicitarDatos(true);
            setMostrarPicker(true);
        },500);
    }
    const validarDato = async () =>{
        let error = "";
        if( CURP == "" ){
            error += "C,";
        }else{
            let curpValida = verificarcurp( CURP );
            if( curpValida != 0 ){
                setErrorMsg(curpError[curpValida]);
                error +="C,"
            }
        }
        if(cliente == -1 ){
            error += "CL,"
        }
        console.log(error + "Errores en los campos");
        if( error != "" ){
            setIconModal(USER_COG[0]);
            setIconSource(USER_COG[1]);
            setErrorMsg("Favor de ingresar los datos requeridos");
            setShowMessage(true);
        }
        error == "" ? RestaurarDatosModal() : setErrorUI(error);

    }
    const handleRegistrar = async () => {
        setSolicitarDatos(false); 
        setLoading(false);
        setMostrarPicker(true);
        setTipoBoton(true);
    }
    const limpiarDatosPantalla = async() =>{
        //NOTE: Limpiando pantallas
        setRFC("");
        setCURP("");
        setNombres("");
        setMaterno("");
        setPaterno("");
        setTelefono("");
        setEmail("");
        setCliente(-1);

    }
    const mostrarModalSolicitar = () =>{
        setSolicitarDatos(true);
    }
    return(
        <ScrollView contentContainerStyle = {{flexGrow:1}} >
            {
                !solicitarDatos ? 
                <View style = {Styles.cardContainer} >
                    {
                        mostrarPicker ? 
                        <View style = {{borderColor:"red",borderWidth: String(errorUI).includes("CL,") ? 2 : 0 }} >
                        <Picker
                        selectedValue={cliente} 
                        onValueChange = {(itemValue, itemIndex)=>{setCliente(itemValue)}}
                        style = {[{backgroundColor:cardColor+55}]}
                        >
                            <Picker.Item  label="Seleccione el municipio al que pertenece" value={-1} ></Picker.Item>
                            {
                                arregloMunicipios.map((item,index)=>{
                                    return <Picker.Item key={ item.id } label = { item.Municipio } value={ item.id } ></Picker.Item>
                                })
                            }
                        </Picker></View> : <></>
                    }

                    <View style = {{flex: 5, padding:20}}>
                            <Input
                                maxLength={ 18 }
                                style = {[Styles.inputs,{borderWidth: String(errorUI).includes("C,") ? 1 : 0 ,borderColor:"red"}]} 
                                keyboardType="default"
                                value= { CURP}
                                label={ "CURP"}
                                editable={false}
                                onChangeText={ text => { setCURP(text);}}
                                autoCapitalize = {"characters"}

                                autoCompleteType={undefined}
                            />
                            <Input
                                maxLength={ 13 }
                                style = { [Styles.inputs]} 
                                keyboardType="default"
                                value= { RFC }
                                editable={false}
                                label={ "RFC: XAXX010101000" }
                                onChangeText={ text => { setRFC(text); }}
                                autoCompleteType={undefined}
                            />
                            <Input
                                keyboardType="twitter"
                                value={nombres}
                                style={[Styles.inputs, { borderWidth: String(errorUI).includes("N,") ? 1 : 0, borderColor: "red" }]}
                                label={"Nombres"}
                                onChangeText={text => setNombres(text)} 
                                editable={false}
                                autoCompleteType={undefined}                        />
                            <Input
                                value = { paterno }
                                keyboardType="twitter"
                                style = {[Styles.inputs,{borderWidth: String(errorUI).includes("M,") ? 1 : 0 ,borderColor:"red"}]}
                                label={ "Apellido Paterno" }
                                editable={false}
                                onChangeText={text => setPaterno(text)}
                                autoCompleteType={undefined}
                            />
                            <Input
                                value = { materno }
                                keyboardType="twitter"
                                style = {[Styles.inputs,{borderWidth: String(errorUI).includes("P,") ? 1 : 0 ,borderColor:"red"}]}
                                label={ "Apellido Materno" }
                                editable={false}
                                onChangeText={ text => setMaterno(text)}
                                autoCompleteType={undefined}
                            />
                            <Input
                                value = {telefono}
                                keyboardType="number-pad"
                                style = {[Styles.inputs,{borderWidth: String(errorUI).includes("T,") ? 1 : 0 ,borderColor:"red"}]}
                                label={ "Telefono" }
                                onChangeText={ text => setTelefono(text)}
                                autoCompleteType={undefined}
                            />
                            <Input
                                keyboardType="email-address"
                                value = {email}
                                style = {[Styles.inputs,{borderWidth: String(errorUI).includes("E,") ? 1 : 0 ,borderColor:"red"}]}
                                label={ "Email " }
                                onChangeText={ text => setEmail(text)}
                                autoCompleteType={undefined}
                            />
                        </View>
                    <View style = {{flex: 1, padding:20}} >
                        
                        {/*NOTE: cerramos la cesion*/}
                        {
                            <View style = {{flex:1, flexDirection:"row"}}>
                                <View style = {{flex:1, marginRight:5}} >
                                    <TouchableOpacity style = {[Styles.btnButtonSuccess,{ backgroundColor:  tipoBoton ? buttonSuccess : BlueColor }]} onPress={ GuardarDatos }>                                    
                                        <Icon name = {  tipoBoton ? "save" :"edit" } tvParallaxProperties color = {"white"} > </Icon>
                                        <Text style = {{color:"white"}} > { tipoBoton ? "Guardar" : "Editar" } </Text>
                                    </TouchableOpacity>
                                </View>
                                <View style = {{flex:1, marginLeft:5}} >
                                    <TouchableOpacity style = {[Styles.btnButtonSuccess,{ backgroundColor: BlueColor }]} onPress={ tipoBoton ?  mostrarModalSolicitar : EliminarDatosPrueba }>
                                        <Icon name = { tipoBoton ? "reply" :"logout"} type = { "material" }  tvParallaxProperties color = {"white"} />
                                        <Text style = {{color:"white"}} > { tipoBoton ? " Regresar " : "Cerrar sesión" } </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        }
                    </View>
            </View>
            :
            <Modal style = {{flex:1}}  visible = {solicitarDatos} >
                <View style = {{flex:1, flexDirection:"column"}} >
                    {/**NOTE: cabecera de la pagina logo de suinpac o del municipio */}
                    <View style={[Styles.avatarView,{flex:3}]}>
                    <View style={Styles.avatarElement}>
                        <Avatar 
                            rounded
                            size = "xlarge"
                            containerStyle = {{height:100,width:200}}
                            source = {require("../../resources/suinpac.png")} //FIXME: se puede cambiar por el logo de mexico
                        />
                    </View>
                </View>
                    {/**NOTE: contenido prinpal de la pagina */}
                    <View style = {[{flex:8}]} >
                        <View style = {{marginTop:50, padding:20}} >
                            <Input
                                label = "CURP"
                                autoCompleteType={undefined}
                                placeholder = {"CURP"} 
                                autoCapitalize="characters"
                                onChangeText = {text =>{setCURP(text)}}
                                maxLength={ 18 }
                                style = {[Styles.inputBachees,{borderWidth: String(errorUI).includes("C,") ? 1 : 0 ,borderColor:"red"}]} />
                            <View style = {{borderWidth: String(errorUI).includes("CL,") ? 1 : 0, borderColor:'red' }} >
                                <Picker
                                    selectedValue={cliente} 
                                    onValueChange = {(itemValue, itemIndex)=>{setCliente(itemValue)}}
                                    style = {{backgroundColor:cardColor+55,}}
                                    >
                                        <Picker.Item  label="Seleccione el municipio al que pertenece" value={-1} ></Picker.Item>
                                        {
                                            arregloMunicipios.map((item,index)=>{
                                                return <Picker.Item key={ item.id } label = { item.Municipio } value={ item.id } ></Picker.Item>
                                            })
                                        }
                                </Picker>
                            </View>
                        </View>
                        <View style = {{flex: 1, padding:20}} >
                            <TouchableOpacity style = {Styles.btnButtonLoginSuccess} onPress={ validarDato } >
                                <Text style = {{color:"white"}}> Iniciar Sesión </Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style = {{ alignItems: "center", marginTop:30 }} 
                                onPress={ handleRegistrar } >
                                <Text style = {{color: DarkPrimaryColor , fontWeight:"bold",  }}> Regístrame </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    {/**NOTE: Pie de pagina marca de suinpac */}
                    <View style = {{flex:1}}>
                        <View style = {{ alignItems: "center" }} >
                            <Text 
                            style = {{color: DarkPrimaryColor , fontWeight:"bold",  }}
                            onPress={ EliminarDatosPrueba }
                            > Suinpac </Text>
                        </View>
                    </View>
                </View>
            </Modal>
            }
            <Message
                transparent = {true}
                loading = {showMessage} //NOTE: con esta propiedad se mustra el componente
                buttonText="Aceptar"
                onCancelLoad={()=>{ setErrorMsg(""); setShowMessage(false);}}
                color={BlueColor}
                loadinColor = {BlueColor}
                iconsource = {iconSource}
                icon = { iconModal /*"user-cog"*/}
                message = {errorMsg}
                tittle="Mensaje"
            />
            <Loading 
                transparent = {true}
                loading = {loading}
                loadinColor = {DarkPrimaryColor}
                message="Cargando..."
                tittle="Mensaje"
                onCancelLoad={()=>{}} //NOTE: Eliminar el boton de cancelar
            />

        </ScrollView>
    );
}