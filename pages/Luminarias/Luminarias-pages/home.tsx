import React,{} from "react";
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Luminarias from "./Luminarias";
import LuminariasEstados from "./estado-luminarias";
import CustomMap from './map';
import { iconColorBlue, SuinpacRed } from "../../../Styles/Color";
export default function MainLuminaria(props:any ){
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
                        } else if (route.name === 'Luminaria') {
                          iconName = focused ? 'bulb' : 'bulb';
                        }else if (route.name === 'Historia'){
                            iconName = focused ? 'time' : 'time';
                        }
                        return <Ionicons name={iconName} size={size} color={color} />;
                    }
                })}
                tabBarOptions={{
                    activeTintColor: SuinpacRed,
                    inactiveTintColor: iconColorBlue,
                  }}
            >
                <Tabs.Screen name="Home" component={CustomMap} />
                <Tabs.Screen name="Luminaria" component={Luminarias}/>
                <Tabs.Screen name="Historia" component={LuminariasEstados}/>
            </Tabs.Navigator>
    </  NavigationContainer>
    )
}