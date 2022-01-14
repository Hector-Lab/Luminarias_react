import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import DatosCiudadano from '../pages/Baches/DatosCiudadano';
import Reportar from '../pages/Baches/CiudadanoReporte';
import HistorialReporte from '../pages/Baches/HistorialReportes';
import DetallesReporte from  '../pages/Baches/ReporteDetalle';
import DetalleMapa from '../pages/Baches/ReporteMapa';
const Stack = createStackNavigator();

const StackCiudadano = () =>{
    return(
        <Stack.Navigator headerMode="none" >
            <Stack.Screen name = "Mis datos" component = {DatosCiudadano} ></Stack.Screen>
        </Stack.Navigator>
    );
}
const StackReporte = () =>{
    return (
        <Stack.Navigator headerMode="none" >
            <Stack.Screen name = "Reportar" component = {Reportar} ></Stack.Screen>
        </Stack.Navigator>
    );
}
const StackHistorial = () =>{
    return (
        <Stack.Navigator headerMode="none" >
            <Stack.Screen name = "Historial" component = {HistorialReporte} ></Stack.Screen>
            <Stack.Screen name = "Detalles" component = {DetallesReporte}></Stack.Screen>
            <Stack.Screen name = "Mapa" component = {DetalleMapa}></Stack.Screen>
        </Stack.Navigator>
    );
}

export {StackCiudadano,StackReporte,StackHistorial}