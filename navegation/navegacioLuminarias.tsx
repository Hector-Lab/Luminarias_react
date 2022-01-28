
import React,{} from "react";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {StackEstadoLuminra,StackLuminarias, StackHistorialUsuario } from '../navegation/stackNavigatorLuminaria' 
import Ionicons from 'react-native-vector-icons/Ionicons';
import {PrimaryColor, cardColor } from '../Styles/BachesColor';
const Tab = createBottomTabNavigator();
const NavegacionLuminarias = () =>{
    return (
        <Tab.Navigator 
        screenOptions = {({route})=>({
            tabBarIcon:({ focused, color, size }) =>{
                let iconName;
                if (route.name === 'Registrar') {
                  iconName = focused
                    ? "cloud-upload"
                    : 'cloud-upload';
                } else if (route.name === 'Capturar') {
                  iconName = 'clipboard';
                }if (route.name === 'Historial') {
                    iconName = 'book';
                }
                return <Ionicons name={iconName} size={size} color={color} />;
            }
        })}
        tabBarOptions={{
            activeTintColor: "#f8bb68",
            inactiveTintColor: cardColor,
            tabStyle: {backgroundColor:PrimaryColor}
          }}>
            <Tab.Screen name = "Registrar" component = { StackLuminarias } ></Tab.Screen>
            <Tab.Screen name = "Capturar" component = { StackEstadoLuminra }></Tab.Screen>
            <Tab.Screen name = "Historial" component = { StackHistorialUsuario } ></Tab.Screen>
        </Tab.Navigator>
    )
}
export default NavegacionLuminarias;