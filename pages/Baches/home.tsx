import React,{} from "react";
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import BachesRegistry from './Baches';
import CustomMapBaches from './map';
import BachesList from './ListaBaches';

import { iconColorBlue, SuinpacRed } from "../../Styles/Color";
export default function BachesHome(props:any ){
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
                        }if (route.name === 'Historial') {
                            iconName = focused ? 'list' : 'list';
                          }
                        return <Ionicons name={iconName} size={size} color={color} />;
                    }
                })}
                tabBarOptions={{
                    activeTintColor: SuinpacRed,
                    inactiveTintColor: iconColorBlue,
                  }}
            >
                <Tabs.Screen name="Home" component={CustomMapBaches} />
                <Tabs.Screen name="Historial" component={BachesList}/>
                <Tabs.Screen name="Luminaria" component={BachesRegistry}/>
                
            </Tabs.Navigator>
    </  NavigationContainer>
    )
}