import 'react-native-gesture-handler'
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Icon } from 'react-native-elements';
import Home from '../pages/Login';
import { SafeAreaView } from 'react-native-safe-area-context';
import { azulColor } from '../Styles/Color';
import Personales from '../pages/Atencion/Registrar-personales';
import Domicilio from '../pages/Atencion/Registrar-direccion';
import Perfil from '../pages/Reportes/Perfil';
import Historial from '../pages/Reportes/Historial';
import Reportar from '../pages/Reportes/Reportar';
import MenuUsuario from '../pages/Reportes/menu-usuario';
import { BACK,ACCOUNT } from '../Styles/Iconos';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { ScaleFromCenterAndroid } from '@react-navigation/stack/lib/typescript/src/TransitionConfigs/TransitionPresets';

const Stack = createStackNavigator();
function Nav() {
    return (
        <SafeAreaView style={{ flexGrow: 1 }} >
            <NavigationContainer independent={true} >
                <Stack.Navigator screenOptions={
                    { headerTintColor: "white" }} >
                    <Stack.Screen name='Bienvenido'
                        options={({ navigation, route }) => ({
                            title: "Atención Ciudadana",
                            headerTitleAlign: "center",
                            headerTintColor: "#000000",
                            headerStyle: { shadowColor: azulColor, backgroundColor: azulColor },
                            headerTitleStyle: { color: "white" }
                        })}>
                        {props => <Home {...props} ></Home>}
                    </Stack.Screen>
                    <Stack.Screen name="Personales" options={({ navigation, route }) => ({
                        title: "Registro",
                        headerTitleAlign: "center",
                        headerTintColor: "#000000",
                        headerStyle: { shadowColor: azulColor, backgroundColor: azulColor },
                        headerTitleStyle: { color: "white" },
                        headerLeft: () => {
                            return <TouchableOpacity onPress={() => { navigation.pop(); }} ><Icon style={{ marginLeft: 10 }} color={"white"} name={BACK[0]} type={BACK[1]} tvParallaxProperties  ></Icon></TouchableOpacity>
                        }
                    })} >
                        {props => <Personales {...props} ></Personales>}
                    </Stack.Screen>
                    <Stack.Screen name="Domicilio" options={({ navigation, route }) => ({
                        title: "Registro",
                        headerTitleAlign: "center",
                        headerTintColor: "#000000",
                        headerStyle: { shadowColor: azulColor, backgroundColor: azulColor },
                        headerTitleStyle: { color: "white" },
                        headerLeft: () => {
                            return <TouchableOpacity onPress={() => { navigation.pop(); }} ><Icon style={{ marginLeft: 10 }} color={"white"} name={BACK[0]} type={BACK[1]} ></Icon></TouchableOpacity>
                        }
                    })}>
                        {props => <Domicilio {...props} > </Domicilio>}
                    </Stack.Screen>
                    <Stack.Screen name = "Perfil" options = {({ navigation, route })=> ({
                        title: "Menu",
                        headerTitleAlign:"center",
                        headerTintColor: "#000000",
                        headerStyle: { shadowColor: azulColor, backgroundColor: azulColor },
                        headerTitleStyle: { color: "white" },
                        headerLeft: () => {
                            return <TouchableOpacity onPress={() => { navigation.pop(); }} ><Icon style={{ marginLeft: 10 }} color={"white"} name={BACK[0]} type={BACK[1]} ></Icon></TouchableOpacity>
                        }
                    }) } > 
                        {props => <MenuUsuario {...props} > </MenuUsuario>}
                    </Stack.Screen>
                    { /** NOTE: apartado de reportes */  }
                    <Stack.Screen name="Reportar" options={({ navigation, route }) => ({
                        title: "Reportar",
                        headerTitleAlign: "center",
                        headerTintColor: "#000000",
                        headerStyle: { shadowColor: azulColor, backgroundColor: azulColor },
                        headerTitleStyle: { color: "white" },
                        headerLeft: () => {
                            return <TouchableOpacity onPress={() => { navigation.pop(); }} ><Icon style={{ marginLeft: 10 }} color={"white"} name={BACK[0]} type={BACK[1]} ></Icon></TouchableOpacity>
                        }
                    })}>
                        {props => <Reportar {...props} > </Reportar>}
                    </Stack.Screen>
                    <Stack.Screen name="Historial" options={({ navigation, route }) => ({
                        title: "Reportar",
                        headerTitleAlign: "center",
                        headerTintColor: "#000000",
                        headerStyle: { shadowColor: azulColor, backgroundColor: azulColor },
                        headerTitleStyle: { color: "white" },
                        headerLeft: () => {
                            return <TouchableOpacity onPress={() => { navigation.pop(); }} ><Icon style={{ marginLeft: 10 }} color={"white"} name={BACK[0]} type={BACK[1]} ></Icon></TouchableOpacity>
                        }
                    })}>
                        {props => <Historial {...props} > </Historial>}
                    </Stack.Screen >
                    <Stack.Screen name = "Datos" options = {({ navigation, route })=>({
                        title: "Mis datos",
                        headerTitleAlign:"center",
                        headerTintColor:"#000000",
                        headerStyle: { shadowColor:azulColor,backgroundColor:azulColor },
                        headerTitleStyle: { color:"white" },
                        headerLeft: () => {
                            return <TouchableOpacity onPress={() => { navigation.pop(); }} ><Icon style={{ marginLeft: 10 }} color={"white"} name={BACK[0]} type={BACK[1]} ></Icon></TouchableOpacity>
                        }
                    })} >
                     { props => <Perfil {...props} ></Perfil> }    
                    </Stack.Screen>    
                    
                </Stack.Navigator>
            </NavigationContainer>
        </SafeAreaView>
    )
}
export default Nav;

