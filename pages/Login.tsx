import { Picker } from "@react-native-picker/picker";
import DropDownPicker from 'react-native-dropdown-picker';
import React, { useEffect, useState } from "react";
import { View, TouchableOpacity, Text, TextInput } from  'react-native';
import {  Input, Avatar } from 'react-native-elements';
import { ScrollView } from "react-native-gesture-handler";
import { BlueColor, cardColor, DarkPrimaryColor, errorColor } from "../Styles/BachesColor";
import Styles from "../Styles/BachesStyles";
import { DESCONOCIDO, USER_COG, WIFI_OFF,LOGINEXIT } from '../Styles/Iconos';
import { checkConnection, CordenadasActualesNumerico, ObtenerDireccionActual, verificarcurp } from "../utilities/utilities";
import Loading from "./components/modal-loading";
import Message from "./components/modal-message";
import { ObtenerMunicipios, RecuperarDatos, VerificarSession } from "./controller/api-controller";
import { StorageBaches } from './controller/storage-controllerBaches';
import * as Location from 'expo-location';
import { BackgrounBlue } from "../Styles/Color";
import { SafeAreaView } from "react-native-safe-area-context";
export default function Log(props: any) {

    const storage = new StorageBaches();
    const [CURP, setCURP ] = useState(String);
    const imagenRequiered = require("../resources/logo.png");
    const [arregloMunicipios,setArregloMunicipios ] = useState<any[]>([]);
    const [errorUI,  setErrorUI ] = useState("");
    const curpError = ["","CURP no valida","Formato de CURP no valido"];
    const [ errorMsg, setErrorMsg] = useState(String);
    const [cliente, setCliente ] = useState( -1 );
    const [ iconModal, setIconModal ] = useState(String);
    const [ iconSource, setIconSource ] = useState(String);
    const [ showMessage, setShowMessage ] = useState(false);
    const [loading, setLoading ] = useState(true); 
    const [ tittleMesage, setTittleMesaje ] = useState("Mensaje");
    //INDEV: manejadores del modal
    const [ pickerAbierto, setPickerAbierto ] = useState(false);
    //INDEV: verificamos las session y la validez del token
    useEffect(()=>{
        (async ()=>{
            //NOTE: creando las tablas
            storage.createOpenDB();
            storage.createTablasBaches();
            setTimeout( async ()=>{
            //INDEV: obtenemos la lista de los municipios
            let ciudadano = await storage.obtenerDatosPersona(); //NOTE: la aplicacion no tiene sessiones, solo necetia la curp de ciudadano
            if(ciudadano != null){
                setLoading(false);
                await storage.setModoPantallaDatos("1");
                props.navigation.navigate("Reportes");
            }else{
                //NOTE: pedimos permisos 
                let { status } = await Location.requestForegroundPermissionsAsync();
                if (status !== 'granted') {
                    setErrorMsg('Permisos no concedidos por el usuario');
                    return;
                }

                let coords = await CordenadasActualesNumerico();
                let jsonUbicacion = await ObtenerDireccionActual(coords);
                if(jsonUbicacion != null && jsonUbicacion != undefined )
                {
                    let ubicacionActual = JSON.parse(jsonUbicacion);
                    let indicioFormato = "";// String(ubicacionActual.region).normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                    Municipios(indicioFormato);
                }else{
                    Municipios("");
                }
                setLoading(false);
            }
            },500);
        })();
    },[]);
    
    const Municipios = async ( indicio:string ) =>{
        let internetAviable = await checkConnection();
        if(internetAviable){
            await storage.LimpiarTabla("CatalogoClientes");
            //NOTE: Obtenemos los datos desde la API, limpiamoa la tabla e insertamos los datos
            let listaMunicipio = await ObtenerMunicipios();
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
    const validarDato = async () =>{
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
        error == "" ? AutentificarUsuario() : setErrorUI(error);
    }
    const AutentificarUsuario = async () =>{
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
            await storage.setModoPantallaDatos("1")
            .then(()=>{
                props.navigation.navigate("Reportes");
            }).catch(( error )=>{
                console.log(error);
            })
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
    const RegistrarUsuario = async () =>{
        storage.setModoPantallaDatos("1")
        .then(()=>{
            props.navigation.navigate("Reportes");
        }).catch((erro)=>{
            console.log("Error en el storage");
        })
    }
    const lanzarMensaje =  ( mensaje:string, titulo:string , fuenteIconos: string, nombreIcono:string )=>{
        setErrorMsg(mensaje);
        setIconSource(fuenteIconos);
        setIconModal(nombreIcono);
        setTittleMesaje(titulo)
        setShowMessage(true);
    }
    return(
        <View style = {{flex:1 , flexDirection:"column", backgroundColor:"#ffffff"}} >
            <View style = {{flex:1, justifyContent:"center",  alignItems:"center"}} >
                <Avatar
                avatarStyle={{ }}
                    rounded
                    imageProps={ {resizeMode:"contain"} }
                    size = "xlarge"
                    containerStyle = {{height:120,width:220}}
                    source = {require("../assets/splash.png")} //FIXME: se puede cambiar por el logo de mexico
                />
            </View>
            {/** Datos de entrada */}
            <View style = {{flex:1, paddingLeft:20, paddingRight:20, justifyContent:"flex-end", marginBottom:20 }} >
                <TextInput
                    placeholder = {"CURP"} 
                    autoCapitalize="characters"
                    maxLength={ 18 }
                    onChangeText = { ( text ) => {setCURP( text );}}
                    style = {[Styles.inputBachees,{borderWidth: String(errorUI).includes("C,") ? 1 : 0 ,borderColor:"red", padding:10, marginBottom:20 }]} />
                <DropDownPicker
                    placeholder = {"Seleccione un municipio"}
                    items = { arregloMunicipios }
                    open = { pickerAbierto }
                    setOpen = {setPickerAbierto}
                    setValue = { setCliente }
                    value = {cliente}
                    min =  {10}
                    max = {15}
                    listMode = {"MODAL"}
                    listItemContainerStyle = {{padding:10}}
                    itemSeparator = {true}
                    selectedItemContainerStyle = { {backgroundColor:BlueColor + 45 } }
                    selectedItemLabelStyle = {{ fontWeight:"bold" }}
                    ></DropDownPicker>
                </View>
                <View style = {{ flex:1, paddingLeft:20, paddingRight:20 }} >
                    <TouchableOpacity style = {Styles.btnButtonLoginSuccess} onPress = {validarDato} >
                        <Text style = {{color:"white"}}> Iniciar Sesión </Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style = {{ alignItems: "center", marginTop:30 }} onPress = { RegistrarUsuario }  >
                        <Text style = {{color: DarkPrimaryColor , fontWeight:"bold",  }}> Regístrame </Text>
                    </TouchableOpacity>
                </View>
                <View style = {{flex:1, justifyContent:"flex-end", alignItems:"center"}} >
                    <Text style = {{color: DarkPrimaryColor , fontWeight:"bold", marginBottom:35 }}> Suinpac </Text>
                </View>
                <Loading 
                transparent = {true}
                loading = {loading}
                message = ""
                loadinColor = {BlueColor}
                onCancelLoad={()=>{}}
                tittle="Mensaje"
                />
            <Message
                tittle="Mensaje"
                transparent = {true}
                buttonText = {"Aceptar"}
                color = {BlueColor}
                icon = {iconModal}
                iconsource = {iconSource}
                loadinColor = {BlueColor}
                loading = {showMessage} //NOTE: lo mostramos cuando 
                message = {errorMsg}
                onCancelLoad={()=>{ setShowMessage(false)}}
            />
        </View>);
}
