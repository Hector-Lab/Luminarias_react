import React, { useState, useEffect, useRef, Component } from "react";
import { Keyboard,Modal, View, SafeAreaView, ImageBackground,Text, FlatList, StatusBar, Platform, TouchableOpacity, TextInput, KeyboardAvoidingView, TouchableWithoutFeedback  } from "react-native";
import Loading  from '../components/modal-loading';
import { Image, Card } from 'react-native-elements';
import { azulColor, SuinpacRed } from "../../Styles/Color";
import { ObtenerMisReportes } from '../controller/api-controller';
import ItemReporte  from '../components/item-reportes';
import ReporteDetalle from '../components/modal-detalles-reporte';
import Message from  '../components/modal-message';
import { DESCONOCIDO,ALERTMENU, INFO, CLOSE } from '../../Styles/Iconos';
import { AVATAR } from "../../utilities/Variables";
import { ObtenerListaObservaciones, enviarRepuestaObservacion } from '../controller/api-controller';
import { OK } from '../../Styles/Iconos';
import { Icon } from "react-native-elements/dist/icons/Icon";
 
const colorEstado = {"ios":"dark-content","android":"light-content"};
export default function HistorialReportes(props: any) {
    //NOTE: estados del mensaje
    const [ mensaje, setMensaje ] = useState(String);
    const [ icono, setIcono ] = useState(String);
    const [ iconoFuente, setIconoFuente ] = useState(String);
    const [ mostrarMensaje, setMostrarMensaje ] = useState( false );
    //NOTE: estados del modal cargado
    const [ cargando, setCargando ] = useState( false );
    const [ listaReporte, setListaReporte ] = useState([]);
    const [ mostrarDetalle, setMostrarDetalle ] = useState( false );
    const [ reporte, setReporte ] = useState( Object );
    const [ mostrarEvidencias, setMostrarEvidencias ] = useState( false ); 
    const [ listaObservaciones, setListaObservaciones ] = useState(null);
    const [ modalRespuesta, setModalRepuesta ] = useState(false);
    const [ respuestaObservacion, setRespuestaObservacion ] = useState(String);
    const [ idSelecionRespuesta, setIdSelecionRespuesta ] = useState(String);
    useEffect(()=>{
        setCargando(true);
        obtenerListaReportes();
    },[]);
    const obtenerListaReportes = async () =>{
        await ObtenerMisReportes()
        .then(( data )=>{
            setListaReporte(data);
        })
        .catch(( error )=>{
            let mensajeError = String(error.message);
            lanzarMensaje( mensajeError ,(error.message == "¡Servicio no disponible!" ) ? DESCONOCIDO[0] : ALERTMENU[0] , (error.message == "¡Servicio no disponible!" ) ? DESCONOCIDO[1] : ALERTMENU[1] );
        })
        .finally(()=>{
            setCargando(false);
        });
    }
    const lanzarMensaje = ( mensaje:string, icono:string, fuente:string ) => {
        setMensaje( mensaje );
        setIcono( icono );
        setIconoFuente( fuente );
        setMostrarMensaje( true );
    }
    const renderItem = ({ item }) =>{
        return (
            <ItemReporte
                Descripcion = {item.Area}
                Area = { item.Descripci_on }
                FechaAlta = { item.FechaTupla } 
                Estado = { item.Estatus }
                OnPressItem = { ()=>{ mostrarReporte(item) } }
            />
        );
    }
    const regresar = () =>{
        props.navigation.pop();
    }
    const mostrarReporte = async ( item:any ) => {
        setCargando(true);
        await ObtenerListaObservaciones(item.id)
        .then((listaObservaciones)=>{
            //NOTE: Cargando las observaciones del reportes
            setListaObservaciones(listaObservaciones);
        })
        .catch(( error:Error )=>{
            console.log( error.message );
        })
        setCargando(false);
        setReporte( item ); 
        setMostrarDetalle(true);
    }
    const enviarReporte = async () =>{
        setModalRepuesta(false);
        setMostrarEvidencias(false);
        setMostrarDetalle(true);
        setRespuestaObservacion("");
        //NOTE: forma no recomendable de enviar respuestas
        let idObservacion = -1;
        let idReporte = -1;
        listaObservaciones.map(( observacion, index )=>{
            if(observacion.FechaRespuesta == null){
                idObservacion = observacion.id;
                idReporte = observacion.idReporte
            }
        });
        await enviarRepuestaObservacion(idObservacion,respuestaObservacion)
        .then( async ( result )=>{
            lanzarMensaje("Respuesta enviada",OK[0],OK[1]);
                //NOTE: volvemos a cargar los datos del reporte
                await ObtenerListaObservaciones(idReporte)
                .then((listaObservaciones)=>{
                    //NOTE: Cargando las observaciones del reportes
                    setModalRepuesta(false);
                    setListaObservaciones(listaObservaciones);
                })
                .catch(( error:Error )=>{
                    console.log( error.message );
                })
        })
        .catch(( error:Error )=>{
            setModalRepuesta(false);
            lanzarMensaje(error.message,INFO[0],INFO[1]);
        })
    }
    
    return (
        <SafeAreaView style={{ flex: 1 }} >
            <StatusBar animated={true} barStyle = {colorEstado[Platform.OS]}/>
            <ImageBackground source={require('../../assets/Fondo.jpeg')} style={{ flex: 1 }} >
                <View style={{ flex: 2 }} >
                    <View style={{ flex: 2, borderRadius: 1, borderColor: "black", justifyContent: "center" }} >
                    <View style={{ justifyContent: "center", alignItems: "center", padding:20 }} >
                            <Image 
                                source = {AVATAR} 
                                resizeMode = { "stretch" }  
                                style = {{ height:80,width:220 }}
                            />
                        </View>
                    </View>
                </View>
                <View style = {{ flex:8 }} >
                    <View>
                        <FlatList
                            data = { listaReporte }
                            renderItem = { renderItem }
                            keyExtractor = { item => item.id }
                        />
                    </View>
                </View>
                <TouchableOpacity 
                    style = {{ backgroundColor: azulColor, marginLeft:25, marginRight:25, marginBottom:10, marginTop:10, borderRadius:10 }}
                    onPress = {regresar}>
                    <Text style = {{ padding:10, textAlign:"center",color:"white", fontWeight:"bold",  }} > Regresar </Text>
                </TouchableOpacity>
            </ImageBackground>
            <Modal visible= { modalRespuesta} transparent = { true } >
                    <View style = {{flex:1, justifyContent:"center"}}>
                        <KeyboardAvoidingView behavior = { Platform.OS == "ios" ? "padding" : "height" } 
                            keyboardVerticalOffset = { Platform.OS == "ios" ? 70 : 0 }>
                            <TouchableWithoutFeedback onPress = { Keyboard.dismiss } >
                                <Card containerStyle = {{ elevation:10, borderRadius:5 }} >
                                        <Card.Title>Responder Observación</Card.Title>
                                    <Card.Divider></Card.Divider>
                                        <TextInput 
                                            style = {[{borderWidth:1, borderRadius:3},(Platform.OS == "ios" ? { height:100 }:{ textAlignVertical:"top" })]} 
                                            placeholder = "Escriba la respuesta a la observació de su reporte" 
                                            multiline = { true } 
                                            numberOfLines = { 8 }
                                            onChangeText = { setRespuestaObservacion }
                                            />
                                    <View style = {{flexDirection:"row", marginTop:10}} >
                                        <TouchableOpacity onPress = { enviarReporte  } style = {{backgroundColor:azulColor, borderRadius:7, flex:1, marginRight:5 }} >
                                            <Text style = {{ color:"white", textAlign:"center", fontWeight:"bold", padding:7 }} > Enviar </Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress = { ()=>{ setModalRepuesta(false); setMostrarDetalle(true) } } style = {{backgroundColor:SuinpacRed, borderRadius:7, flex:1, marginLeft:5 }} >
                                            <Text style = {{ color:"white", textAlign:"center", fontWeight:"bold", padding:7 }} > Cerrar </Text>
                                        </TouchableOpacity>
                                    </View>
                                </Card>
                            </TouchableWithoutFeedback>
                        </KeyboardAvoidingView>
                    </View>
            </Modal>
            <Loading 
                transparent = { true }
                loadinColor = { azulColor }
                loading = { cargando }
                message = {"Cargando..."} 
                tittle = { "Mensaje" }
                onCancelLoad = { () => { } }
            />
            <ReporteDetalle
                Reporte  = { reporte }
                Visible = { mostrarDetalle }
                Plataform = {  Platform.OS }
                onClose = {() => { setMostrarDetalle( !mostrarDetalle ) }}
                onMostrarEvidencia = {()=>{ setMostrarEvidencias( !mostrarEvidencias ) }}
                onMostrarRespuesta = { ()=>{ setModalRepuesta(!modalRespuesta) } }
                mostrarEvidencia = { mostrarEvidencias }
                Observaciones = { listaObservaciones }
                mostrarRepuesta = { modalRespuesta }
                onEnviarReporte = { enviarReporte }
            />
            <Message
                buttonText = { "Aceptar" }
                color = { azulColor }
                icon = { icono }
                iconsource = { iconoFuente }
                loadinColor = { azulColor }
                loading = { mostrarMensaje }
                message = { mensaje }
                tittle = { "Mensaje" }
                transparent = { true }
                onConfirmarLoad = {()=>{ setMostrarMensaje(false)  } }
                onCancelLoad = {()=>{ setMostrarMensaje(false) }}
            />
        </SafeAreaView>
    );
}