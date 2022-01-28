import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Luminarias from '../pages/Luminarias/Luminarias-pages/Luminarias';
import LuminariasEstados from '../pages/Luminarias/Luminarias-pages/estado-luminarias';
import HistorialUsuario from '../pages/Luminarias/Luminarias-pages/map';
const Stack = createStackNavigator();

const StackLuminarias = () =>{
    return(
        //INDEV: esta interfaz se muestran los campos de incersion de las luminarias
        <Stack.Navigator headerMode="none" >
            <Stack.Screen name="Agregar" component = {Luminarias} ></Stack.Screen>
        </Stack.Navigator>
    );
}
const StackEstadoLuminra = () =>{
    return (
        //INDEV: en esta parte se ingresan las historias de las luminarias
        <Stack.Navigator headerMode="none" >
            <Stack.Screen name = "Capturar" component = {LuminariasEstados}></Stack.Screen> 
        </Stack.Navigator>
    );
}
const StackHistorialUsuario = () =>{
    return(
        //INDEV: en esta parte se muestra el historial de las luminarias insertadas por el usuario
        <Stack.Navigator headerMode ="none" >
            <Stack.Screen name = "Historial" component = {HistorialUsuario} ></Stack.Screen>
        </Stack.Navigator>
    )
}

export {StackLuminarias, StackEstadoLuminra, StackHistorialUsuario };