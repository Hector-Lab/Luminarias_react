import React,{ useEffect, useState } from "react";
import { View, ImageBackground, TouchableOpacity, Text} from "react-native";
import Styles from "../../Styles/styles";
import { Avatar, Input, Button, Icon } from 'react-native-elements';
import { BlueColor, DarkPrimaryColor, errorColor } from "../../Styles/BachesColor";
import { StorageService } from '../controller/storage-controller';
import { ClavesLuminarias, Auth, CatalogoLuminarias } from '../controller/api-controller';
import Message from '../components/modal-message';
import Loading from '../components/modal-loading';
import { USER_COG } from '../../Styles/Iconos'; 

export default function MenuLuminarias(props:any ){
    const [ contrasenia, setContrasenia ] = useState(String);
    const [ usuario, setUsuarios ] = useState(String);
    const [ errorUI, setErrorUI ] = useState(String);
    const [ loading, setLoading ] =  useState(false);
    const [ mostrarMensaje, setMostrarMensaje ] = useState(false);
    const [ icono, setIcono ] = useState("info");
    const [ fuenteIcono, setIconoFuente ] = useState("font-awesome-5");
    const [ mensajeError, setMensajeError ] = useState("");
    const [ mensajeTitulo, setMensajeTitulo ] =  useState("Mensaje");
    let storage = new StorageService(); 
    useEffect(()=>{
        storage.createOpenDB();
        storage.createTables();
    },[]);
    const ObtenerPadronLuminarias = async () =>{
        //NOTE: Primero descargamos los catalogos de la base de datos
        await CatalogoLuminarias()
        .then( async ()=>{
            //NOTE: Descargamos las luminarias de la base de datos
            await ClavesLuminarias()
            .then(()=>{
                //NOTE: descpues de descargar nos pasamos a la pantalla luminarias 
                setLoading(false);
                props.navigation.navigate("Luminarias");
            })
            .catch(error=>{
                console.log(error.message);
            });
        })
        .catch((error)=>{
            console.log(error.message);
        })
    }
    const Login = async () =>{
        setLoading(true);
        let error = "";
        if( contrasenia == "" ){
            error += "C,";
        }
        if( usuario == "" ) {
            error += "U,";
        }
        if( error != "" ){
            lanzarMensaje("Favor de llenar los campos vacios", "Mensaje",USER_COG[0],USER_COG[1]);
            setErrorUI(error);
        }else{
            //NOTE: Hacemos el login
            await Auth( usuario, contrasenia )
            .then( async ( result ) =>{
                console.log("Usuario correcto");
                await ObtenerPadronLuminarias();
            })
            .catch((error)=>{
                lanzarMensaje(error.message, "Error");
            })
        }
    }
    const lanzarMensaje = (Mensaje: string,Titulo:string, Icono:string = "info" , IconoFuente: string = "font-awesome-5" ) =>{
        
        setMensajeTitulo(Titulo);
        setMensajeError(Mensaje);
        setIcono(Icono);
        setIconoFuente(IconoFuente);
        setLoading(false);
        setMostrarMensaje(true);
    }
    return(
        <View style = {[Styles.container]}>
            <View style = {{flex:1,  borderColor:"res", justifyContent:"center"}}>
                <View style = {{flex:3, borderColor:"green"}} >
                    <View style={[Styles.avatarView,{flex:3}]}>
                        <View style={Styles.avatarElement}>
                            <Avatar  //FIXME:  se pude cambiar el logo del cliente
                                rounded
                                size = "xlarge"
                                containerStyle = {{height:100,width:200}}
                                source = {require("../../resources/suinpac.png")} //FIXME: se puede cambiar por el logo de mexico
                            />
                        </View>
                    </View>
                </View>
                <View style = {{ flex:5, flexDirection:"column" , padding:10 }} >
                    <Input 
                        placeholder = "Usuario" 
                        autoCompleteType = {undefined} 
                        style = { [ errorUI == "" ?  Styles.inputBachees : Styles.inputBacheesError ] }  
                        onChangeText = {( usuario )=>{ setUsuarios( usuario )}}
                        />
                    <Input placeholder = "Contraseña" autoCompleteType = {undefined} style = {[errorUI == "" ? Styles.inputBachees : Styles.inputBacheesError ]} onChangeText = { ( password )=>{setContrasenia( password )} } />
                    <TouchableOpacity style = {Styles.btnButtonSuccess} onPress={ Login } >
                        <Text style = {{color:"white", fontWeight:"bold"}} > {`Iniciar Sesión`} </Text>
                    </TouchableOpacity>
                </View>
                <View style = {{flex:2, flexDirection:"column-reverse"}} >  
                    <Text style = {{textAlign:"center", marginBottom:20, color: DarkPrimaryColor, fontWeight:"bold", fontSize:16 }} > {`Suinpac`} </Text>
                </View>
            </View> 
            <Message
                transparent = {true}
                loading = { mostrarMensaje }
                message = {mensajeError}
                icon = { icono }
                iconsource = {fuenteIcono}
                buttonText = {"Aceptar"}
                color = {BlueColor}
                loadinColor = { BlueColor }
                tittle = {mensajeTitulo}
                onCancelLoad = {()=>{ setMostrarMensaje(false) }}
            />
            <Loading
                loading = {loading}
                message = {"Verificando Credenciales..."}
                loadinColor = {BlueColor}
                onCancelLoad = { ()=>{}}
                tittle = {"Mensaje"}
                transparent = {true}

            />
        </View>
    );
}