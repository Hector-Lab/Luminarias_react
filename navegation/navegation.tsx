import * as React from 'react';
import { View, Text, StatusBar } from 'react-native';
import { NavigationContainer ,DefaultTheme} from '@react-navigation/native';
import { createStackNavigator, HeaderBackButton } from '@react-navigation/stack';
import Home from '../pages/Login';
import BachesHome from '../pages/Baches/home';
import { PrimaryColor } from '../Styles/BachesColor';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
const Stack = createStackNavigator();
function Nav() {
    return(
        <SafeAreaView style = {{flex:1}} >
            <StatusBar barStyle = {"light-content"} animated = {true} />
            <NavigationContainer independent = {true}  >
                <Stack.Navigator  screenOptions ={ 
                    { headerTintColor:"white" } } >
                    <Stack.Screen name='Bienvenido!'
                                        options={({navigation, route}) => ({
                            title: "Bienvenido!",
                            headerTitleAlign:"center",
                            headerTintColor:"#000000",
                    })}>
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
                </Stack.Navigator>
            </NavigationContainer>
        </SafeAreaView>
    )
}
export default Nav;    

