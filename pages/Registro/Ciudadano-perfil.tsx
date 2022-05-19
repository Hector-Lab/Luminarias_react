import React, { useState, useEffect, useRef } from "react";
import { SafeAreaView,ScrollView, Text, ImageBackground, View, TextInput, TouchableOpacity, Pressable} from 'react-native';
import { Avatar, Divider, Icon} from 'react-native-elements';
import Styles  from '../../Styles/styles';
import { StorageBaches } from '../controller/storage-controllerBaches';
import { CommonActions } from '@react-navigation/native';

export default function Contactos(props: any) {
    let [ nombre,setNombre ] =  useState();
    let [ email,setEmail ] = useState();
    let storage = new StorageBaches();
    useEffect(()=>{
        obtenerDatosCiudadano();
    },[]);

    const CerrarSession = async () =>{    
        await storage.cerrarSsesion()
        .then(()=>{
             //NOTE: guardamos los datos 
             props.navigation.dispatch(
                CommonActions.reset({
                  index: 1,
                  routes: [{ name:'Bienvenido'}]
                })
              );
        });

    }
    const obtenerDatosCiudadano = async () =>{
        let datos = await storage.ObtenerPerfilCiudadano();
        setNombre(datos[0]);
        setEmail(datos[1]);
    }

    return(
        <SafeAreaView style = {{flex:1}} >
            <ImageBackground source = { require('../../assets/Fondo.jpeg') } style = {{ flex:1 }} >
                <ScrollView style = {{flexGrow:1}} >
                    <View style = {{ justifyContent:"center" , alignItems:"center"}}  >
                        <Avatar
                        avatarStyle={{  }}
                            rounded
                            imageProps={ {resizeMode:"contain"} }
                            size = "xlarge"
                            containerStyle = {{ borderColor:"black", borderWidth:1, marginTop:50}}
                            source = {require("../../assets/user.png")} 
                        />
                        <View>
                            <TouchableOpacity style = {[Styles.btnGeneral,{marginTop:10}]} > 
                                <Text style = {[Styles.btnTexto,{marginLeft:10,marginRight:10}]} > Editar </Text>
                            </TouchableOpacity>
                        </View>
                        <Text style = {{marginTop:20,marginBottom:5, fontWeight:"bold", fontSize:18}} > {nombre} </Text>
                        <Text> { email } </Text>
                        <View style = { [Styles.itemPerfil,{marginTop:100}]}>
                            <TouchableOpacity style ={{flex:1, flexDirection:"row"}} >
                                <Text style = {{textAlign:"left",flex:10,fontWeight:"bold" }} > Editar Datos Personales </Text>
                                <Icon name="arrow-forward-ios" type="material" tvParallaxProperties style = {{textAlign:"left",flex:2,fontWeight:"bold"}} > Domicilio </Icon>
                            </TouchableOpacity>
                        </View>
                        <View style = {Styles.itemPerfil} >
                            <TouchableOpacity style ={{flex:1, flexDirection:"row"}} > 
                                <Text style = {{textAlign:"left",flex:10,fontWeight:"bold" }} > Editar Domicilio </Text>
                                <Icon name="arrow-forward-ios" type="material" tvParallaxProperties style = {{textAlign:"left",flex:2,fontWeight:"bold"}} > Domicilio </Icon>
                            </TouchableOpacity>
                        </View>
                        <View style = {Styles.itemPerfil} >
                            <TouchableOpacity style ={{flex:1, flexDirection:"row"}}  >
                                <Text style = {{textAlign:"left",flex:10,fontWeight:"bold" }} > Editar Contactos </Text>
                                <Icon name="arrow-forward-ios" type="material" tvParallaxProperties style = {{textAlign:"left",flex:2,fontWeight:"bold"}} > Domicilio </Icon>
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity style = { [Styles.btnGeneral,{marginTop:50}]} onPress = { CerrarSession } >
                            <Text style = {[Styles.btnTexto,{textAlign:"center"}]}  > Cerrar Sesion </Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </ImageBackground> 
        </SafeAreaView>
    )
}
