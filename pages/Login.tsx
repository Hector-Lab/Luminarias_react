
import React, { useContext, useEffect, useState } from "react";
import { View, TouchableOpacity, TextInput, Text, Button, Platform} from  'react-native';
import { Avatar } from 'react-native-elements';
import { StatusBar } from  'expo-status-bar';
import { azulColor } from '../Styles/Color';
import { LOGO } from './controller/Variables';
import Styles from '../Styles/styles'; 


export default function Log(props: any) {
    let registrarUsuario = () => {
        props.navigation.navigate("Personales");
    }
    const iniciarSession = () =>{
        props.navigation.navigate("Perfil");
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
                <TextInput style = {[ Styles.inputText, { marginTop:50, padding:10, borderRadius:5  }]} placeholder = { "CURP" }/>
                <TouchableOpacity style = { Styles.btnOpacity } onPress = {iniciarSession} >
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
        </View>);
}