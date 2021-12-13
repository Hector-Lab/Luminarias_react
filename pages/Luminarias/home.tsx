import React,{} from "react";
import { View } from "react-native";
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Luminarias from "./Luminarias";
import LuminariasEstados from "./estado-luminarias";

export default function LuminariasHome(props:any ){
    const Tabs = createBottomTabNavigator();
    return (
        <NavigationContainer independent = {true}>
            <Tabs.Navigator>
                <Tabs.Screen name="Luminaria" component={Luminarias}/>
                <Tabs.Screen name="Estado" component={LuminariasEstados}/>
            </Tabs.Navigator>
    </  NavigationContainer>
    )
}