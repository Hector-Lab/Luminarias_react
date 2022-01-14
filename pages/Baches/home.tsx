import React,{} from "react";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import NavegacionBaches from '../../navegation/navegacionReporte';
import { NavigationContainer } from "@react-navigation/native";
export default function BachesHome(props:any ){
    
  return (
      <NavigationContainer independent = {true}  >
        <NavegacionBaches/>
      </NavigationContainer>
    );
}
