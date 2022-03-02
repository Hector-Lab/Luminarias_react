import React, { useEffect, useState } from "react";
import { View, TouchableOpacity, Modal, TextInput } from "react-native";
import { Text } from 'react-native-elements';
import Styles from "../../Styles/BachesStyles";
import { Avatar, Icon } from 'react-native-elements'
import { BlueColor, DarkPrimaryColor, cardColor, buttonSuccess } from '../../Styles/BachesColor';
import { ScrollView } from "react-native-gesture-handler";
import { StorageBaches } from '../controller/storage-controllerBaches';
import { Picker } from "@react-native-picker/picker";
import DropDownPicker from 'react-native-dropdown-picker';
import { ObtenerMunicipios, RegistrarCiudadano, RecuperarDatos, editarDatosCiudadano } from '../controller/api-controller';
import { checkConnection, CordenadasActualesNumerico,ObtenerDireccionActual, verificarcurp , rfcValido } from '../../utilities/utilities';
import  * as Location from 'expo-location';
import { WIFI_OFF,USER_COG,DESCONOCIDO, WIFI, OK, ERROR} from '../../Styles/Iconos'; 
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
    const [ loading, setLoading ] = useState(false);
    const [ iconModal, setIconModal ] = useState("info");
    const [ tipoBoton , setTipoBoton ] = useState(true); // NOTE: true - Agregar, false - Editar
    const [ iconSource, setIconSource ] = useState("");
    const [ mostrarPicker, setMostrarPicker ] = useState(true);
    //NOTE: manejador del picker agregar
    const [ mostrarPickerAgregar , setMostrarPickerAgregar ] = useState( false );
    const curpError = ["","!CURP no válida¡","!Formato de CURP no válido¡"];
    const storage = new StorageBaches();
    const [ messageTittle, setMessageTittle ] = useState(String);

    useEffect(() => {
        (async () => {
            //NOTE: verificamos si ingreso desde la interfaz principa
            if( await storage.getModoPantallaDatos() == "1" ){
                setSolicitarDatos(false); //Ingreso de la pantalla principa
            }
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
                    console.log(jsonUbicacion);
                    let ubicacionActual = JSON.parse(jsonUbicacion);
                    let indicioFormato = "";
                    if(!String(ubicacionActual.isoCountryCode).includes("MX")){
                        indicioFormato = "Estado de Mexico";
                    }else{
                        indicioFormato = String(ubicacionActual.region).normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                        if(indicioFormato.includes("Estado de Mexico") || indicioFormato.includes("Guerrero")){
                            indicioFormato = "Estado de Mexico";
                        }
                    }
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
                    if(Codificacion.Code != 200){
                        setIconModal( USER_COG[0] );
                        setIconSource( USER_COG[1] );                        
                        if(Codificacion.Code == 423){
                            errorMensaje = "La CURP ingresada ya está en uso";
                        }
                        if(Codificacion.Code == 403){
                            errorMensaje = "Hubo un problema al registrar el usuario\n Favor de reintentar más tarde";
                        }else if(Codificacion.Code == 500){
                            setIconModal(DESCONOCIDO[0]);
                            setIconSource(DESCONOCIDO[1]);
                        }
                        setShowMessage(true);
                        setErrorMsg(errorMensaje);
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
                        RestaurarDatos();

                    }
                    setLoading(false);
                }else{
                    setIconModal(WIFI_OFF[0]);
                    setIconSource(WIFI_OFF[1]);
                    setErrorMsg("Sin acceso a internet");
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
                        await storage.GuardarDatosPersona(estructuraCiudadano);
                        RestaurarDatosModal();
                        setErrorMsg("Datos actualizados");
                        setIconModal(OK[0]);
                        setIconSource(OK[1]);
                        setShowMessage(true);
                    })
                    .catch(( error )=>{
                        let mensaje = String(error.message);
                        if(mensaje == "OK"){
                            setErrorMsg("Datos actualizados");
                            setIconModal(OK[0]);
                            setIconSource(OK[1]);
                            setShowMessage(true);
                        }else{
                            //NOTE: manejador de errores
                            setIconModal(WIFI_OFF[0]);
                            setIconSource(WIFI_OFF[1]);
                            setShowMessage(true);
                            setErrorMsg("Sin acceso a internet");
                        }
                    })
                    .finally(()=>{
                        setLoading(false);
                    })
                    
                }else{                    
                    setIconModal(WIFI_OFF[0]);
                    setIconSource(WIFI_OFF[1]);
                    setShowMessage(true);
                    setErrorMsg("Sin acceso a internet");
                    setLoading(false);
                }
            }

        }else{
            errorCURP != "" ? setErrorMsg(errorCURP + "\n\n- Favor de revisar los datos requeridos") : setErrorMsg("Favor de revisar los datos requeridos");
            setIconModal(USER_COG[0]);
            setIconSource(USER_COG[1]);
            setShowMessage(true);
            setLoading(false);
        }
    }
    const Municipios = async ( indicio:string ) =>{
        let internetAviable = await checkConnection();
        if(internetAviable){
            storage.LimpiarTabla("CatalogoClientes");
            //NOTE: Obtenemos los datos desde la API, limpiamoa la tabla e insertamos los datos
            await ObtenerMunicipios().then( async ( listaMunicipio )=>{
                let municipiosAuxiliar = [];
                listaMunicipio.map((item,index)=>{
                    let municipioFormato = String(item.Municipio).normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                    if(municipioFormato.includes(indicio) || indicio.includes(String(item.Nombre))){
                        let itemPicker = { 
                            label: item.Municipio , 
                            value: item.id,
                        };
                        municipiosAuxiliar.push(itemPicker);
                    }
                });
                setArregloMunicipios(municipiosAuxiliar);
                await storage.InsertarMunicipios(listaMunicipio);
            }).catch((error)=>{
                if( String(error.message).includes("Sin acceso a internet") ){
                    setIconModal(WIFI[0]);
                    setIconSource(WIFI[1]);
                    setErrorMsg(String(error.message));
                    setMessageTittle("Error");
                }else{
                    setIconModal(DESCONOCIDO[0]);
                    setIconSource(DESCONOCIDO[1]);
                    setErrorMsg(String(error.message));
                    setMessageTittle("Error");
                }
            });
           
        }else{
            //NOTE: Obtenemos los desde la db
            let listaMunicipio = await storage.ObtenerMunicipiosDB();
            let municipiosAuxiliar = [];
            listaMunicipio.map((item,index)=>{
                let municipioFormato = String(item.Municipio).normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                if(municipioFormato.includes(indicio) || indicio.includes(String(item.Nombre))){
                    let itemPicker = { 
                        label: item.Municipio , 
                        value: item.id,
                    };
                    municipiosAuxiliar.push(itemPicker);
                }
            });
            setArregloMunicipios(municipiosAuxiliar);
        }
    } 
    //NOTE: este metodo es para recuperarlo desde el storage
    const RestaurarDatos = async () =>{
        //NOTE: Obtenemos el cartalogo de temas
        try{
            setLoading(true);
            let persona = await storage.obtenerDatosPersona();
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
                setMostrarPicker(false);
                //INDEV:
                
            }else{
                setTipoBoton(true);
                setLoading(false);
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
        
        if(CURP == "ccL9LxgzD8&!09%ks"){
            //INDEV: guardamos los datos del usuario de pruebas
            let estructuraCiudadano = {
                curp: "RACH950920HGRMNC05",
                Nombres:"Hector",
                Paterno: "Ramirez",
                Materno: "Contreras",
                Telefono:"6824478158",
                Email: "AtencionPrueba@gmail.com",
                Cliente: "56",
                rfc:"XAXX010101000"
            };
            await storage.GuardarDatosPersona(estructuraCiudadano);
            await storage.guardarIdCiudadano("16");
            RestaurarDatos();
        }else{
            setErrorUI("");
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
            if( error != "" ){
                setIconModal(USER_COG[0]);
                setIconSource(USER_COG[1]);
                setErrorMsg("Favor de revisar los datos requeridos");
                setShowMessage(true);
            }
            error == "" ? RestaurarDatosModal() : setErrorUI(error);
        }

    }
    const handleRegistrar = async () => {
        setErrorUI("");
        setSolicitarDatos(false); 
        setLoading(false);
        setMostrarPicker(true);
        setTipoBoton(true);
    }
    const limpiarDatosPantalla = async() =>{
        //NOTE: Limpiando pantallas
        setErrorUI("");
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
        <ScrollView contentContainerStyle = {{flexGrow:1, flex:1}} >
            {
                !solicitarDatos ? 
                <View style = {[Styles.cardContainer]} >
                    {
                        mostrarPicker ? 
                        <View >
                        <DropDownPicker
                            language="ES"
                            placeholder = {"Seleccione un municipio"}
                            items = { arregloMunicipios }
                            open = { mostrarPickerAgregar }
                            setOpen = { setMostrarPickerAgregar }
                            setValue = { setCliente }
                            value = {cliente}
                            min =  {10}
                            max = {15}
                            listMode = {"MODAL"}
                            listItemContainerStyle = {{padding:10}}
                            itemSeparator = {true}
                            selectedItemContainerStyle = { {backgroundColor:BlueColor + 45 } }
                            selectedItemLabelStyle = {{ fontWeight:"bold" }}
                            containerStyle = {{ borderWidth: errorUI.includes("CL,") ? 3 : 0, borderColor:"red", borderRadius:10 }}
                            ></DropDownPicker>
                        </View> : <></>
                    }
                    <View style = {{flex: 5, marginRight:20, marginLeft:20}}>
                            <Text style = {{marginBottom:-5, color:"gray", fontWeight:"bold"}} > CURP </Text>
                            <TextInput
                                maxLength={ 18 }
                                style = {[Styles.inputBachees,{padding:5 ,borderWidth: 1 ,borderColor: String(errorUI).includes("C,") ? "red" : "black" }]} 
                                keyboardType="default"
                                value= { CURP }
                                editable={tipoBoton}
                                onChangeText={ text => { setCURP(text); }}
                                autoCapitalize = {"characters"}
                            />
                            <Text style = {{marginBottom:-5, color:"gray", fontWeight:"bold",}} > RFC: XAXX010101000 </Text>
                            <TextInput
                                maxLength={ 13 }
                                style = { [Styles.inputBachees,{padding:5} ]} 
                                keyboardType="default"
                                value= { RFC }
                                editable={tipoBoton}
                                onChangeText={ text => { setRFC(text); }}
                            />
                            <Text style = {{marginBottom:-5, color:"gray", fontWeight:"bold"}} > Nombres </Text>
                            <TextInput
                                keyboardType="twitter"
                                value={nombres}
                                style={[Styles.inputBachees, {padding:5 ,borderWidth: 1 ,borderColor: String(errorUI).includes("N,") ? "red" : "black" }]}
                                onChangeText={text => setNombres(text)} 
                                editable={tipoBoton}/>
                                <Text style = {{marginBottom:-5, color:"gray", fontWeight:"bold"}} > Apellido Paterno </Text>
                            <TextInput
                                value = { paterno }
                                keyboardType="twitter"
                                style = {[Styles.inputBachees, {padding:5 ,borderWidth: 1 ,borderColor: String(errorUI).includes("P,") ? "red" : "black" }]}
                                editable={tipoBoton}
                                onChangeText={text => setPaterno(text)}
                            />
                            <Text style = {{marginBottom:-5, color:"gray", fontWeight:"bold"}} > Apellido Materno </Text>
                            <TextInput
                                value = { materno }
                                keyboardType="twitter"
                                style = {[Styles.inputBachees,{padding:5 ,borderWidth: 1 ,borderColor: String(errorUI).includes("M,") ? "red" : "black" }]}
                                editable={tipoBoton}
                                onChangeText={ text => setMaterno(text)}
                            />
                            <Text style = {{marginBottom:-5, color:"gray", fontWeight:"bold"}} > Teléfono </Text>
                            <TextInput
                                value = {telefono}
                                keyboardType="number-pad"
                                style = {[Styles.inputBachees,{padding:5 , borderWidth: 1 ,borderColor: String(errorUI).includes("T,") ? "red" : "black" }]}
                                onChangeText={ text => setTelefono(text)}
                            />
                            <Text style = {{marginBottom:-5, color:"gray", fontWeight:"bold"}} > Email </Text>
                            <TextInput
                                keyboardType="email-address"
                                value = {email}
                                style = {[Styles.inputBachees, {padding:5 , borderWidth: 1 ,borderColor: String(errorUI).includes("E,") ? "red" : "black" } ]}
                                onChangeText={ text => setEmail(text)}
                            />
                        </View>
                    <View style = {{flex: 1, marginLeft:20,marginRight:20}} >
                        
                        {/*NOTE: cerramos la cesion*/}
                        {
                            <View style = {{flex:1, flexDirection:"row" }}>
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
            <Modal style = {{flex:1 }}  visible = {solicitarDatos} animationType = {"fade"} >
                <ScrollView style = {{flexGrow:1, marginTop:50}} >
                    <View style = {{ flexDirection:"column"}} >
                        {/**NOTE: cabecera de la pagina logo de suinpac o del municipio */}
                        <View style={[Styles.avatarView,{flex:3}]}>
                        <View style={Styles.avatarElement}>
                            <Avatar 
                                rounded
                                imageProps={ {resizeMode:"contain"} }
                                size = "xlarge"
                                containerStyle = {{height:120,width:220}}
                                source = {require("../../assets/banner.png")} //FIXME: se puede cambiar por el logo de mexico
                            />
                        </View>
                    </View>
                        {/**NOTE: contenido prinpal de la pagina */}
                        <View style = {[{flex:8}]} >
                            <View style = {{marginTop:50, padding:20}} >
                                <TextInput
                                    placeholder = {"CURP"} 
                                    autoCapitalize="characters"
                                    onChangeText = {text =>{setCURP(text)}}
                                    maxLength={ 18 }
                                    style = {[Styles.inputBachees, {padding: 5 ,borderWidth: 1 ,borderColor: String(errorUI).includes("C,") ? "red" : "black" }] } />
                                <View >
                                    <DropDownPicker
                                        language="ES"
                                        placeholder = {"Seleccione un municipio"}
                                        items = { arregloMunicipios }
                                        open = { mostrarPickerAgregar }
                                        setOpen = { setMostrarPickerAgregar }
                                        setValue = { setCliente }
                                        value = {cliente}
                                        min =  {10}
                                        max = {15}
                                        listMode = {"MODAL"}
                                        listItemContainerStyle = {{padding:10}}
                                        itemSeparator = {true}
                                        selectedItemContainerStyle = { {backgroundColor:BlueColor + 45 } }
                                        containerStyle = {{ borderWidth: errorUI.includes("CL,") ? 3 : 0, borderColor:"red", borderRadius:10 }}
                                        selectedItemLabelStyle = {{ fontWeight:"bold" }}
                                        ></DropDownPicker>
                                </View>
                            </View>
                            <View style = {{flex: 1, padding:20  }} >
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
                    </View>
                </ScrollView>
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
                message = { errorMsg }
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