import React, { useEffect, useState } from "react";
import { View, TouchableOpacity, Text, TextInput, Linking, ImageBackground } from  'react-native';
import { Avatar } from 'react-native-elements';
import { SuinpacRed } from "../Styles/Color";
import Styles  from '../Styles/styles';
import { StorageBaches } from './controller/storage-controllerBaches';
import { CommonActions } from '@react-navigation/native';

export default function Log(props: any) {
    let storage = new StorageBaches();
    useEffect(
        ()=>{   
            verificandoSession();
        },
    [])
    const verificandoSession = async () =>{
        if( await storage.verificarDatosCiudadano() ){
            props.navigation.dispatch(
                CommonActions.reset({
                  index: 1,
                  routes: [{ name:'Menu'}]
                })
              );
        }
    }
    const RegistrarUsuario = () =>{
        //NOTE: nos vamos al formaulario de registro
        props.navigation.navigate("Personales");
    }
    return(
        <View style = {{ flex:1 }} >
            <ImageBackground source = { require('../assets/Fondo.jpeg') } style = {{ flex:1 }} >
                <View style = {{flex:2}} >
                    <View style = {{flex:2, borderColor:"black", justifyContent:"center" }} >
                        <View style = {{ justifyContent:"center" , alignItems:"center"}}  >
                            <Avatar
                            avatarStyle={{  }}
                                rounded
                                imageProps={ {resizeMode:"contain"} }
                                size = "xlarge"
                                containerStyle = {{height:120,width:220}}
                                source = {require("../assets/banner.png")} 
                            />
                        </View>
                    </View>
                </View>
                <View style = {{flex:5, flexDirection:"column", justifyContent:"center" }}>
                    <Text style = {Styles.TemaLabalCampo} >Usuario</Text>
                    <TextInput style = {Styles.TemaCampo} placeholder = "Ejemplo: Juan Perez" ></TextInput>
                    <Text style = {Styles.TemaLabalCampo} >Contraseña</Text>
                    <TextInput style = {Styles.TemaCampo} secureTextEntry  ></TextInput>
                    <TouchableOpacity style = { [Styles.btnGeneral,{marginTop:20}] } >
                        <Text style = {[Styles.btnTexto,{textAlign:"center"}]} > Ingresar </Text>
                    </TouchableOpacity>
                    <Text style = {[Styles.textoSubrayado ]} onPress = {RegistrarUsuario} > Registrate </Text>
                </View>
                <View style = {{flex:3}} ></View>
                <View style = {{ flex:1, borderColor:"red", justifyContent:"center" }}>
                    <Text style ={{textAlign:"center", color:SuinpacRed,fontWeight:"bold"}}> SUINPAC </Text>
                </View>
            </ImageBackground>
        </View>);
        
}
