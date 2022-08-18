import React, { useState, useEffect, useRef } from "react";
import { Avatar, Divider, Icon } from 'react-native-elements';
import { SafeAreaView, ScrollView, Text, ImageBackground, View, TextInput, TouchableOpacity, Pressable, StatusBar, Platform, ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Styles from '../../Styles/styles';
import { StorageBaches } from '../controller/storage-controllerBaches';
import { CommonActions } from '@react-navigation/native';
import Loading from "../components/modal-loading";
import { azulColor, azulColorDisabled } from "../../Styles/Color";
import { RETURN } from '../../Styles/Iconos';
import { BlueColor } from "../../Styles/BachesColor";
import * as ImagePicker from 'expo-image-picker';
const colorEstado = { "ios": "dark-content", "android": "light-content" };
export default function Contactos(props: any) {
    let [nombre, setNombre] = useState();
    let [email, setEmail] = useState();
    let [cargando, setCargando] = useState(false);
    let [cerrando, setCerrando] = useState(false);
    let storage = new StorageBaches();
    useFocusEffect(() => {
        if (!cerrando)
            obtenerDatosCiudadano();
    });
    const CerrarSession = async () => {
        setCargando(true)
        setCerrando(true);
        setTimeout(async () => {
            await storage.cerrarSsesion()
                .then(() => {
                    //NOTE: guardamos los datos 
                    setCargando(false);
                    props.navigation.dispatch(
                        CommonActions.reset({
                            index: 1,
                            routes: [{ name: 'Bienvenido' }]
                        })
                    );
                });
        }, 500)
    }
    const obtenerDatosCiudadano = async () => {
        let datos = await storage.ObtenerPerfilCiudadano();
        setNombre(datos[0]);
        setEmail(datos[1]);
    }
    const EditarDatosPersonales = () => {
        props.navigation.navigate("EditarPersonales");
    }
    const EditatDatosDomicilio = () => {
        props.navigation.navigate("EditarDomicilio");
    }
    const EditarDatosContacto = () => {
        props.navigation.navigate("EditarContacto");
    }
    const HistorialReportes = () => {
        props.navigation.navigate("HistorialReportes");
    }
    const Menu = () => {
        props.navigation.navigate("Menu");
    }
    const EditarFotoCiudadano = async () => {


    }

    return (
        <SafeAreaView style={{ flex: 1 }} >
            <StatusBar animated={true} barStyle={ colorEstado[Platform.OS]} />
            <ImageBackground source={require('../../assets/Fondo.jpeg')} style={{ flex: 1 }} >
                <ScrollView style={{ flexGrow: 1 }} >
                    <View style={{ justifyContent: "center", alignItems: "center" }}  >
                        <Avatar
                            avatarStyle={{}}
                            rounded
                            imageProps={{ resizeMode: "contain" }}
                            size="xlarge"
                            containerStyle={{ borderColor: "black", borderWidth: 1, marginTop: 50 }}
                            source={require("../../assets/user.png")}
                            //source={{ uri: "https://img.freepik.com/vector-gratis/fondo-pantalla-paisaje-paisaje-minimalista-puesta-sol-montana-full-hd-4k-8k-imagenes-fondo_538866-33.jpg?w=2000"}}
                            renderPlaceholderContent = {<ActivityIndicator size="large" color={BlueColor} style={{ flex: 1 }} />}
                        />
                        <View>
                            <TouchableOpacity onPress = { EditarFotoCiudadano } style={[Styles.btnGeneral, { marginTop: 10, backgroundColor: azulColorDisabled }]} disabled={false} >
                                <Text style={[Styles.btnTexto, { marginLeft: 10, marginRight: 10, color: "lightgray" }]} > Editar </Text>
                            </TouchableOpacity>
                        </View>
                        <Text style={{ marginTop: 20, marginBottom: 5, fontWeight: "bold", fontSize: 18 }} > {nombre} </Text>
                        <Text> {email} </Text>
                        <View style={[Styles.itemPerfil, { marginTop: 100 }]} >
                            <TouchableOpacity style={{ flex: 1, flexDirection: "row" }} onPress={HistorialReportes} >
                                <Text style={{ textAlign: "left", flex: 10, fontWeight: "bold" }} > Historial Reportes </Text>
                                <Icon name="arrow-forward-ios" type="material" tvParallaxProperties style={{ textAlign: "left", flex: 2, fontWeight: "bold" }} />
                            </TouchableOpacity>
                        </View>
                        <View style={[Styles.itemPerfil]}>
                            <TouchableOpacity style={{ flex: 1, flexDirection: "row" }} onPress={EditarDatosPersonales} >
                                <Text style={{ textAlign: "left", flex: 10, fontWeight: "bold" }} > Editar Datos Personales </Text>
                                <Icon name="arrow-forward-ios" type="material" tvParallaxProperties style={{ textAlign: "left", flex: 2, fontWeight: "bold" }} />
                            </TouchableOpacity>
                        </View>
                        <View style={Styles.itemPerfil} >
                            <TouchableOpacity style={{ flex: 1, flexDirection: "row" }} onPress={EditatDatosDomicilio} >
                                <Text style={{ textAlign: "left", flex: 10, fontWeight: "bold" }} > Editar Domicilio </Text>
                                <Icon name="arrow-forward-ios" type="material" tvParallaxProperties style={{ textAlign: "left", flex: 2, fontWeight: "bold" }} />
                            </TouchableOpacity>
                        </View>
                        <View style={Styles.itemPerfil} >
                            <TouchableOpacity style={{ flex: 1, flexDirection: "row" }} onPress={EditarDatosContacto} >
                                <Text style={{ textAlign: "left", flex: 10, fontWeight: "bold" }} > Editar Contactos </Text>
                                <Icon name="arrow-forward-ios" type="material" tvParallaxProperties style={{ textAlign: "left", flex: 2, fontWeight: "bold" }} />
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity style={[Styles.btnGeneral, { marginTop: 50 }]} onPress={CerrarSession} >
                            <Text style={[Styles.btnTexto, { textAlign: "center" }]}  > Cerrar Sesion </Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
                <Loading
                    transparent={true}
                    loadinColor={azulColor}
                    loading={cargando}
                    onCancelLoad={() => { setCargando(false) }}
                    message="Cargando..."
                    tittle="Mensaje"
                />
            </ImageBackground>
        </SafeAreaView>
    )
}