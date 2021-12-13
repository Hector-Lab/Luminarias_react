import * as React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Home from '../pages/Login';
import BachesHome from '../pages/Baches/home';
import LuminariasHome from '../pages/Luminarias/home';
const Stack = createStackNavigator();

function Nav() {
    return(
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen name='Bienvenido!'>
                    {props => <Home {...props} ></Home>}
                </Stack.Screen>  
                <Stack.Screen name='Reportes'>
                    {props => <BachesHome {...props} ></BachesHome>}
                </Stack.Screen>
                <Stack.Screen name='Luminarias'>
                    {props => <LuminariasHome {...props} ></LuminariasHome>}
                </Stack.Screen> 
            </Stack.Navigator>
        </NavigationContainer>
    )
}


export default Nav;    

