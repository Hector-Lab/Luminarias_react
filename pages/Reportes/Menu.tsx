import React,{ useEffect, useState } from  'react';
import { View, Text, ImageBackground, Settings } from "react-native";
import { Avatar } from 'react-native-elements';
import  Styles from  '../../Styles/styles';
import MenuItem from '../components/ItemMenuReporte';
import * as Location from 'expo-location';
import { IniciarTarea,detenerServicionUbicacion } from '../../utilities/BotonRosa';
import Loading from '../../pages/components/modal-loading';
import Message from  '../../pages/components/modal-message';
import { SuinpacRed } from '../../Styles/Color';
import { BlueColor } from '../../Styles/BachesColor';
import { PERSONPIN, DESCONOCIDO } from '../../Styles/Iconos';

export default function MenuReportes(props: any) {
    //Solicitamos los permisos del telefono
    const [ permisos, setPermisos ] = useState(Boolean);
    //NOTE: manejador de mensajes 
    const [ mensaje, setMensaje ] = useState(String);
    const [ tituloMensaje, setTituloMensaje ] = useState(String);
    const [ MostrarMendaje, setMostrarMensaje ] = useState(false);
    const [ cargando, setCargando ] = useState( false );
    const [ mensajeIcon, setMensajeIcon ] = useState( String );
    const [ mensajeIconFuente, setMensajeIconFuente ] = useState( String );

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestBackgroundPermissionsAsync();
            setPermisos(status !== 'granted');
            await Location.enableNetworkProviderAsync()
        })();
      }, []);
    const ReporteTerceros = () =>{
        props.navigation.navigate("Terceros");
    }
    const BotonRosa = async () =>{
        setCargando( true );
        //INDEV: verificamos el servicio de ubicacion
        await IniciarTarea().then((result)=>{
            lanzarMensaje("Mensaje","Reporte Enviado\nIniciando Rastreo",PERSONPIN[0],PERSONPIN[1]);
        }).catch((error)=>{
            lanzarMensaje("Mensaje",error.message,DESCONOCIDO[0],DESCONOCIDO[1]);
        }).finally(()=>{
            setCargando( false );
        });
    }
    const deteneServicio = () => {
        detenerServicionUbicacion();
    }
    const lanzarMensaje = ( mensaje: string , Titulo: string, Icono: string, FuenteIcono: string ) => {
        setTituloMensaje(Titulo);
        setMensaje(mensaje);
        setMensajeIcon(Icono);
        setMensajeIconFuente(FuenteIcono);
        setMostrarMensaje(true);
    }

    return(
        <View style = {{ flex:1 }} >
            <ImageBackground source = { require('../../assets/Fondo.jpeg') } style = {{ flex:1 }} >
                <View style = {{flex:2, borderRadius:1, borderColor:"black", justifyContent:"center" }} >
                    <View style = {{ justifyContent:"center" , alignItems:"center"}}  >
                        <Avatar
                        avatarStyle={{  }}
                            rounded
                            imageProps={ {resizeMode:"contain"} }
                            size = "xlarge"
                            containerStyle = {{height:120,width:220}}
                            source = {require("../../assets/banner.png")} 
                        />
                    </View>
                </View>
                {/*INDEV: */ }
                <View style = { [Styles.ContenedorElemento,{borderColor:"green"} ] } >
                    <MenuItem
                        TextoArriba='Empatía'
                        TextoAbajo ='Ciudadana'
                        colorBoton ='#003356'
                        colorSombraBoton='rgba(158, 150, 150, .3)'
                        marginBotton={ 0 }
                        marginLeft = { 7 }
                        onPress = { deteneServicio }
                        fondo = {require('../../assets/Botones/BtnRedonda.png')}
                    />
                </View>
                <View style = { [Styles.ContenedorElemento,{borderColor:"cyan"}] } >
                <MenuItem
                        TextoArriba='Boton'
                        TextoAbajo ='Rosa'
                        colorBoton ='#e6acdd'
                        marginBotton={ 13 }
                        marginLeft = { 4 }
                        onPress= { BotonRosa  }
                        colorSombraBoton='rgba(230, 172, 221, .3)'
                        fondo = {require('../../assets/Botones/btnRosa.png')}
                    />
                </View>
                <View style = { [Styles.ContenedorElemento,{borderColor:"black"}] } >
                <MenuItem
                        TextoArriba='Reporte a'
                        TextoAbajo ='Terceros'
                        colorBoton ='#39b54a'
                        marginBotton={ 12 }
                        marginLeft = { 5 }
                        onPress = { ReporteTerceros }
                        colorSombraBoton='rgba(57, 181, 74, .3)'
                        fondo = {require('../../assets/Botones/btnTeerceros.png')}
                    />
                </View>
                <View style = {{flex:2, borderRadius:1, borderColor:"black" }} >
                    
                </View>
            </ImageBackground>
            <Message
                tittle = {tituloMensaje}
                transparent = {false}
                buttonText = {"Aceptar"}
                color = {SuinpacRed}
                icon = {mensajeIcon}
                iconsource = {mensajeIcon}
                loadinColor = {BlueColor}
                loading = {MostrarMendaje}
                message = {mensaje}
                onCancelLoad = {()=>{setMostrarMensaje(false)}
            }
            />
            <Loading
                loadinColor = { SuinpacRed } 
                loading = { cargando }
                message = { "Cargando" }
                onCancelLoad = {()=>{setCargando( false )}}
                tittle = { "Mensaje" }
                transparent = {false}
            />
        </View>
    );
}