import React,{} from "react";
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import NavegacionLuminarias from '../../../navegation/navegacioLuminarias';

export default function MainLuminaria(props:any ){
    return (
        <NavigationContainer independent = {true}  >
        <NavegacionLuminarias/>
      </NavigationContainer>
    )
}