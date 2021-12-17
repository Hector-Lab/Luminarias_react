

import React,{} from "react";
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MedidorRegistry from './MedidorRegistrar';
import MedidorEdit from "./MedidorEdit";
import CustomMapMedidores from './map';
import { iconColorBlue, SuinpacRed } from "../../../Styles/Color";
export default function MedidoresHome(props:any ){
    const Tabs = createBottomTabNavigator();
    return (
        <NavigationContainer independent = {true}>
            <Tabs.Navigator
            
                screenOptions = {({route})=>({
                    tabBarIcon:({ focused, color, size }) =>{
                        let iconName;

                        if (route.name === 'Home') {
                          iconName = focused
                            ? "home"
                            : 'home';
                        } else if (route.name === 'Registrar') {
                          
                          iconName = focused ? 'add-circle-outline' : 'add-circle-outline';
                        }if (route.name === 'Editar') {
                          iconName = focused ? 'create-outline' : 'create-outline';
                          }
                        return <Ionicons name={iconName} size={size} color={color} />;
                    }
                })}
                tabBarOptions={{
                    activeTintColor: SuinpacRed,
                    inactiveTintColor: iconColorBlue,
                  }}
            >
                <Tabs.Screen name="Home" component={CustomMapMedidores} />
                <Tabs.Screen name="Registrar" component={MedidorRegistry}/>
                <Tabs.Screen name="Editar" component={MedidorEdit}/>
                
                
            </Tabs.Navigator>
    </  NavigationContainer>
    )
}