import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Luminarias from '../pages/Luminarias/Luminarias-pages/Luminarias';
import LuminariasEstados from '../pages/Luminarias/Luminarias-pages/estado-luminarias';
const Stack = createStackNavigator();

const StackLuminarias = () =>{
    return(
        <Stack.Navigator headerMode="none" >
            <Stack.Screen name="Agregar" component = {Luminarias} ></Stack.Screen>
        </Stack.Navigator>
    );
}

const StackEstadoLuminra = () =>{
    //INDEV: en esta parte se deben mostrar la lista de las luminarias
    return (
        <Stack.Navigator headerMode="none" >
            <Stack.Screen name = "Historia" component = {LuminariasEstados}></Stack.Screen> 
        </Stack.Navigator>
    );
}

export {StackLuminarias, StackEstadoLuminra };