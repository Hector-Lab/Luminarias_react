
import React,{} from "react";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StackCiudadano, StackHistorial,StackReporte } from './stacknavigator';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {PrimaryColor, cardColor } from '../Styles/BachesColor';
const Tab = createBottomTabNavigator();

const NavegacionBaches = () =>{
    return (
        <Tab.Navigator 
        screenOptions = {({route})=>({
            tabBarIcon:({ focused, color, size }) =>{
                let iconName;

                if (route.name === 'Mis Datos') {
                  iconName = focused
                    ? "person"
                    : 'person';
                } else if (route.name === 'Reportar') {
                  iconName = focused ? 'clipboard' : 'clipboard';
                }if (route.name === 'Historial') {
                    iconName = focused ? 'book' : 'book';
                  }
                return <Ionicons name={iconName} size={size} color={color} />;
            }
        })}
        tabBarOptions={{
            activeTintColor: "#f8bb68",
            inactiveTintColor: cardColor,
            tabStyle: {backgroundColor:PrimaryColor}
          }}
        
        >
            <Tab.Screen name = "Mis Datos" component = {StackCiudadano} ></Tab.Screen>
            <Tab.Screen name = "Reportar" component = { StackReporte }></Tab.Screen>
            <Tab.Screen name = "Historial" component = { StackHistorial }></Tab.Screen>
        </Tab.Navigator>
    )
}
export default NavegacionBaches;