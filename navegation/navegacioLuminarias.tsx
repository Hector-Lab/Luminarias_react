
import React,{} from "react";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {StackEstadoLuminra,StackLuminarias} from '../navegation/stackNavigatorLuminaria' 
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
            <Tab.Screen name = "Registrar" component = { StackLuminarias } ></Tab.Screen>
            <Tab.Screen name = "Historial" component = { StackEstadoLuminra }></Tab.Screen>
        </Tab.Navigator>
    )
}
export default NavegacionLuminarias;