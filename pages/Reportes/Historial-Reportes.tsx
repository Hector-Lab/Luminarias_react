import React, { useState, useEffect, useRef, Component } from "react";
import { ScrollView, View, SafeAreaView, ImageBackground,Text, FlatList, StatusBar, Platform, TouchableOpacity, ViewPropTypes } from "react-native";
import Loading  from '../components/modal-loading';
import { Avatar } from 'react-native-elements';
import { azulColor } from "../../Styles/Color";
import { ObtenerMisReportes } from '../controller/api-controller';
import ItemReporte  from '../components/item-reportes';
import ReporteDetalle from '../components/modal-detalles-reporte';
import Reportar from "../Baches/CiudadanoReporte";

const colorEstado = {"ios":"dark-content","android":"light-content"};
const item = () =>{

}

export default function HistorialReportes(props: any) {
    //NOTE: estados del mensaje
    const [ mensaje, setMensaje ] = useState(String);
    const [ icono, setIcono ] = useState(String);
    const [ iconoFuente, setIconoFuente ] = useState(String);
    const [ mostrarMnesje, setMostrarMensaje ] = useState( false );
    //NOTE: estados del modal cargado
    const [ cargando, setCargando ] = useState( false );
    const [ listaReporte, setListaReporte ] = useState([]);
    const [ indiceReporte, setIndiceReporte ] = useState(0);
    const [ mostrarDetalle, setMostrarDetalle ] = useState( false );
    const [ reporte, setReporte ] = useState( "" );
    
    
    useEffect(()=>{
        obtenerListaReportes();
    },[]);
    const obtenerListaReportes = async () =>{

        await ObtenerMisReportes()
        .then(( data )=>{
            console.log(data);
            setListaReporte(data);
        })
        .catch(( error )=>{
            console.log( error );
        });
    }
    const lanzarMensaje = () => {
    }
    const renderItem = ({ item }) =>{
        return (
            <ItemReporte
                Descripcion = {item.Area}
                Area = { item.Descripci_on }
                FechaAlta = { item.FechaTupla } 
                Estado = { item.Estatus }
                OnPressItem = { ()=>{ setReporte(item == "" ? null : item ); setMostrarDetalle(true); console.log(item); } }
            />
        );
    }
    return (
        <SafeAreaView style={{ flex: 1 }} >
            <StatusBar animated={true} barStyle = {colorEstado[Platform.OS]}/>
            <ImageBackground source={require('../../assets/Fondo.jpeg')} style={{ flex: 1 }} >
                <View style={{ flex: 2 }} >
                    <View style={{ flex: 2, borderRadius: 1, borderColor: "black", justifyContent: "center" }} >
                        <View style={{ justifyContent: "center", alignItems: "center" }}  >
                            <Avatar
                                avatarStyle={{}}
                                rounded
                                imageProps={{ resizeMode: "contain" }}
                                size="xlarge"
                                containerStyle={{ height: 120, width: 220 }}
                                source={require("../../assets/banner.png")} />
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
            </ImageBackground>
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
            />
        </SafeAreaView>
    );
}