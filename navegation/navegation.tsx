import * as React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer ,DefaultTheme} from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Home from '../pages/Login';
import BachesHome from '../pages/Baches/home';
import MenuLuminarias from '../pages/Luminarias/home';
import MainLuminaria from '../pages/Luminarias/Luminarias-pages/home';
import HomeBaches from '../pages/Baches/home';
import MedidoresHome from '../pages/Luminarias/Medidores-pages/home';
const Stack = createStackNavigator();


function Nav() {
    return(
        <NavigationContainer independent = {true}  >
            <Stack.Navigator >
                <Stack.Screen name='Bienvenido!'  >
                    {props => <Home {...props} ></Home>}
                </Stack.Screen>  
                <Stack.Screen name='Reportes' >
                    {props => <BachesHome {...props} ></BachesHome>}
                </Stack.Screen>
                <Stack.Screen name='Menu'>
                    {props => <MenuLuminarias {...props} ></MenuLuminarias>}
                </Stack.Screen> 
                <Stack.Screen name='Luminarias'>
                    {props => <MainLuminaria {...props} ></MainLuminaria>}
                </Stack.Screen> 
                <Stack.Screen name='Medidores'>
                    {props => <MedidoresHome {...props} ></MedidoresHome>}
                </Stack.Screen> 
        
            </Stack.Navigator>
        </NavigationContainer>
    )
}


export default Nav;    

