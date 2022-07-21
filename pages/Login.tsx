
import React, { useContext, useEffect, useState } from "react";
import { View, TouchableOpacity, TextInput, Text, Button, Platform} from  'react-native';
import { Avatar } from 'react-native-elements';
import { StatusBar } from  'expo-status-bar';
import { useFormik } from 'formik'
import * as Yup from 'yup';
import Styles from '../Styles/styles'; 
import { INFO } from '../Styles/Iconos';
import { LOGO,MSJCURP } from './controller/Variables';
import { IniciarSesion } from './controller/api-controller';
import { checkConnection,verificarcurp } from '../utilities/utilities'
import Message from './components/modal-message';
import Loading from './components/modal-loading';
import { azulColor } from "../Styles/Color";


const validation = Yup.object().shape(({ Curp: Yup.string().max(18).min(18) }));

export default function Log(props: any) {
    const [ cargando, setCargando ] = React.useState( false );
    const [ mensaje, setMensaje ] = React.useState( String );
    const [ icono, setIcono ] = React.useState( String );
    const [ iconoFuente, setIconoFuente ] = React.useState(String);
    const [ mostrarMensaje, setMostrarMensaje ] = React.useState( false );
    const formik = useFormik({
        initialValues:{
            Curp:''
        },onSubmit: async ( campos ) => {
            iniciarSession(campos);
        },  
        validationSchema:validation
    });
    let registrarUsuario = () => {
        props.navigation.navigate("Personales");
    }
    const iniciarSession = async ( campos: { Curp:string } ) =>{
        let code =  verificarcurp(campos.Curp);
        if ( code != 0 ){
            await IniciarSesion( campos.Curp )
            .then(( result ) => {

            })
            .catch(( error ) => {
                let msj = String(error.message);
                if( msj.includes("Servicio no disponible")){
                    //lanzarMensaje()
                }
            })
        }else{
            lanzarMensaje( MSJCURP[code],INFO[0],INFO[1]);
        }
        //props.navigation.navigate("Perfil");
        
    }
    const lanzarMensaje = ( message:string,icono:string,fuente:string ) => {
        setMensaje(message);
        setIcono(icono);
        setIconoFuente( fuente )
        setMostrarMensaje( true );
    }
    return(
        <View style = {{flexGrow:1, backgroundColor:"white" }} >
            <StatusBar style = { Platform.OS == "ios" ? "dark" : "auto" }  />
            <View style = {{  alignItems:"center" }} >
                <Avatar
                    avatarStyle={{  }}
                    rounded
                    imageProps={ {resizeMode:"contain"} }
                    size = "xlarge"
                    containerStyle = {{height:180,width:300}}
                    source = { LOGO }
                />
            </View>
            <View style = {{flex:8 , borderColor:"green",padding:15, paddingTop:0 }}>
                <TextInput  
                    style = {[ Styles.inputText, { marginTop:50, padding:10, borderRadius:5  }]} 
                    placeholder = { "CURP" }
                    value = { formik.values.Curp }
                    onChangeText = { formik.handleChange("Curp") }
                    autoCapitalize = { "characters" }
                />
                <TouchableOpacity  style = { Styles.btnOpacity } onPress = { formik.handleSubmit } >
                    <Text style ={ Styles.btnTexto } >Iniciar Sesión</Text>
                </TouchableOpacity>
                <View style = { Styles.contenedorRegistrar } >
                    <TouchableOpacity style = { Styles.btnRegistrar } onPress = { registrarUsuario } >
                        <Text style = { Styles.txtRegistrar } > Registrar </Text>
                    </TouchableOpacity>
                </View>
            </View>
            <View style = {{flex:1 , borderColor:"green", justifyContent:"center"}}>
                <Text style = {{color:"#C10D17", textAlign:"center", fontWeight:"bold"}} >  SUINPAC </Text>
            </View>
            <Message
                loadinColor = { azulColor }
                buttonText = { "Aceptar" }
                color = { azulColor }
                icon = { icono }
                iconsource = { iconoFuente }
                loading = { mostrarMensaje }
                message = { mensaje }
                onCancelLoad = { ()=>{ setMostrarMensaje( false ) } }
                tittle = { "Mensaje" }
                transparent = { true }
            />
            <Loading 
                loading = { cargando }
                loadinColor = { azulColor }
                message = { "Cargando..." }
                onCancelLoad = { ()=>{ setCargando( false ); } }
                tittle = { "Mensaje" }
                transparent = { true }
            />
        </View>);
}