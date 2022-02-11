import * as React from 'react';
import { View, Text, StatusBar } from 'react-native';
import { NavigationContainer ,DefaultTheme} from '@react-navigation/native';
import { createStackNavigator, HeaderBackButton } from '@react-navigation/stack';
import Home from '../pages/Login';
import BachesHome from '../pages/Baches/home';
import MenuLuminarias from '../pages/Luminarias/home';
import MainLuminaria from '../pages/Luminarias/Luminarias-pages/home';
import HomeBaches from '../pages/Baches/home';
import MedidoresHome from '../pages/Luminarias/Medidores-pages/home';
import { PrimaryColor } from '../Styles/BachesColor';
const Stack = createStackNavigator();


function Nav() {
    
    return(
        <View style = {{flex:1}} >
            <StatusBar barStyle = {"light-content"} animated = {true} />
            <NavigationContainer independent = {true}  >
                <Stack.Navigator  screenOptions ={ 
                    { headerTintColor:"white" } } >
                    <Stack.Screen name='Bienvenido!'>
                        {props => <Home {...props} ></Home>}
                    </Stack.Screen>  
                    <Stack.Screen name='Reportes'
                    options={({navigation, route}) => ({
                            title: "Atencion Ciudadana",
                            headerLeft: (props) => (<HeaderBackButton {...props} onPress={() => navigation.navigate("Reportes") }  />),
                            headerTitleAlign:"center",
                            headerTintColor:"#000000",
                    })} >
                        {props => <BachesHome  {...props} ></BachesHome>}
                    </Stack.Screen>
                    <Stack.Screen name='Menu'>
                        {props => <MenuLuminarias {...props} ></MenuLuminarias>}
                    </Stack.Screen> 
                </Stack.Navigator>
            </NavigationContainer>
        </View>
    )
}


export default Nav;    

