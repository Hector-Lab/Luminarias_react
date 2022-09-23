import React, { useEffect, useState } from 'react';
import { View, Text, ImageBackground, Settings, SafeAreaView, StatusBar, Platform, TouchableOpacity, ScrollView, Image } from "react-native";
import { Avatar, Icon } from 'react-native-elements';
import Styles from '../../Styles/styles';
import MenuItem from '../components/ItemMenuReporte';
import * as Location from 'expo-location';
import { IniciarTarea, detenerServicionUbicacion } from '../../utilities/BotonRosa';
import Loading from '../../pages/components/modal-loading';
import Message from '../../pages/components/modal-message';
import { azulClaro, azulColor, SuinpacRed } from '../../Styles/Color';
import { BlueColor } from '../../Styles/BachesColor';
import { PERSONPIN, DESCONOCIDO } from '../../Styles/Iconos';
import { AVATAR,FONDO } from '../../utilities/Variables';
import { StorageBaches } from '../controller/storage-controllerBaches';


export default function MenuReportes(props: any) {
    //Solicitamos los permisos del telefono
    const [permisos, setPermisos] = useState(Boolean);
    //NOTE: manejador de mensajes 
    const [mensaje, setMensaje] = useState(String);
    const [tituloMensaje, setTituloMensaje] = useState(String);
    const [MostrarMendaje, setMostrarMensaje] = useState(false);
    const [cargando, setCargando] = useState(false);
    const [mensajeIcon, setMensajeIcon] = useState(String);
    const [mensajeIconFuente, setMensajeIconFuente] = useState(String);

    const colorEstado = { "ios": "dark-content", "android": "light-content" };
    const storage = new StorageBaches();
    useEffect(() => {
        (async () => {
            //NOTE: vericamos los permisos para ios 
            let permisosIF = await Location.getForegroundPermissionsAsync();
            if( permisosIF.status == "granted" ){
                let { status } = await Location.requestForegroundPermissionsAsync();
                //NOTE: aqui enviamos al link de ios
            }
            //NOTE: verificamos si es android
            if( Platform.OS == "android" ){
                //Solicitamos el permisos de rastreo para android
                let estadoGB = await Location.getBackgroundPermissionsAsync();
                if(estadoGB.status != "granted"){
                    let resultPB = await Location.requestBackgroundPermissionsAsync();
                    await Location.hasServicesEnabledAsync().then(async (status) => {
                        if (!status) {
                            await Location.enableNetworkProviderAsync();
                        }
                    }).catch((error) => {
                        console.log(error);
                    });
                }
            }
        })();
    }, []);
    const ReporteTerceros = () => {
        props.navigation.navigate("Terceros");
    }
    const BotonRosa = async () => {
        setCargando(true);
        //INDEV: verificamos el servicio de ubicacion
        await IniciarTarea().then((result) => {
            lanzarMensaje("¡Alerta Enviada!", "Reporte Enviado\nIniciando Rastreo", PERSONPIN[0], PERSONPIN[1]);
        }).catch((error) => {
            lanzarMensaje("Mensaje", error.message, DESCONOCIDO[0], DESCONOCIDO[1]);
        }).finally(() => {
            setCargando(false);
        });
    }
    const lanzarMensaje = (mensaje: string, Titulo: string, Icono: string, FuenteIcono: string) => {
        setTituloMensaje(Titulo);
        setMensaje(mensaje);
        setMensajeIcon(Icono);
        setMensajeIconFuente(FuenteIcono);
        setMostrarMensaje(true);
    }
    const PerfilCiudadano = () => {
        console.log("Ir a perfil");
        //props.navigation.navigate("Perfil");
    }
    const AtencionCiudadana = () => {
        props.navigation.navigate("AtencionReporte");
    }
    const HistorialReportes = () => {
        storage.asignarRegresoHistorial("1"); //NOTE: 1 Menu->Perfil->Historial<-perfil<-Menu   
        props.navigation.navigate("HistorialReportes");
    }

    return (
        <SafeAreaView style={{ flex: 1 }} >
            <StatusBar animated={true} barStyle={colorEstado[Platform.OS]} />
            <ImageBackground source={ FONDO } style={{ flex: 1 }} resizeMode = "stretch" >
                <View style={{ flex: 2, borderRadius: 1, borderColor: "black", justifyContent: "center", padding:20 }} >
                    <View style={{ justifyContent: "center", alignItems: "center" }}  >
                        <Image 
                            source = {AVATAR} 
                            resizeMode = { "stretch" }  
                            style = {{ height:80,width:220 }}
                        />
                    </View>
                </View>
                {/*INDEV: */}
                <View style={[Styles.ContenedorElemento, { borderColor: "green" }]} >
                    <MenuItem
                        TextoArriba='Atenci&oacute;n'
                        TextoAbajo='Ciudadana'
                        colorBoton='#003356'
                        colorSombraBoton='rgba(158, 150, 150, .3)'
                        marginBotton={0}
                        marginLeft={7}
                        onPress={AtencionCiudadana}
                        fondo={require('../../assets/Botones/BtnRedonda.png')}
                    />
                </View>
                <View style={[Styles.ContenedorElemento, { borderColor: "cyan" }]} >
                    <MenuItem
                        TextoArriba='Bot&oacute;n'
                        TextoAbajo='Rosa'
                        colorBoton='#e6acdd'
                        marginBotton={13}
                        marginLeft={4}
                        onPress={BotonRosa}
                        colorSombraBoton='rgba(230, 172, 221, .3)'
                        fondo={require('../../assets/Botones/btnRosa.png')}
                    />
                </View>
                <View style={[Styles.ContenedorElemento, { borderColor: "black" }]} >
                    <MenuItem
                        TextoArriba='Reporte'
                        TextoAbajo='An&oacute;nimo'
                        colorBoton='#39b54a'
                        marginBotton={12}
                        marginLeft={5}
                        onPress={ReporteTerceros}
                        colorSombraBoton='rgba(57, 181, 74, .3)'
                        fondo={require('../../assets/Botones/btnTeerceros.png')}
                    />
                </View>
                <TouchableOpacity style={[Styles.btnSeguirReportes, {borderWidth:1}, { marginTop: 15, marginBottom: -3 }]} onPress={HistorialReportes} >
                    <Text style={[Styles.btnTexto, { textAlign: "center" }]} > Segumiento de Mis Reportes </Text>
                </TouchableOpacity>
                <View style={{ flex: 2, borderRadius: 1, borderColor: "black" }} ></View>
                
            </ImageBackground>
            <Message
                tittle={tituloMensaje}
                transparent={true}
                buttonText={"Aceptar"}
                color={SuinpacRed}
                icon={mensajeIcon}
                iconsource={mensajeIcon}
                loadinColor={BlueColor}
                loading={MostrarMendaje}
                message={mensaje}
                onConfirmarLoad={() => { setMostrarMensaje(false) }}
                onCancelLoad={() => { setMostrarMensaje(false) }
                }
            />
            <Loading
                loadinColor={SuinpacRed}
                loading={cargando}
                message={"Cargando"}
                onCancelLoad={() => { setCargando(false) }}
                tittle={"Mensaje"}
                transparent={true}
            />
        </SafeAreaView>
    );
}