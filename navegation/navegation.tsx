import * as React from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, HeaderBackButton } from '@react-navigation/stack';
import Home from '../pages/Login';
import BachesHome from '../pages/Baches/home';
import { SafeAreaView } from 'react-native-safe-area-context';
import ReporteC4 from '../pages/Baches/ReporteC4';
import MenuReportes from '../pages/Reportes/Menu';
import Registro from '../pages/Registrame';
import Personales from '../pages/Registro/Datos-Personales';
import Domicilio from '../pages/Registro/Datos-Domicilio';
import Contactos from '../pages/Registro/Datos-Contacto';
import Perfil from '../pages/Registro/Ciudadano-perfil';

const Stack = createStackNavigator();
function Nav() {
    return( 
        <SafeAreaView style = {{flex:1}} >
            <StatusBar barStyle = {"light-content"} />
            <NavigationContainer independent = {true}  >
                <Stack.Navigator  screenOptions = {{ headerTintColor:"white" }} headerMode = "none" >
                    { /*NOTE: Seccion de interfaces para el registro del ciudadano */ }
                    <Stack.Screen name='Bienvenido' >
                        {props => <Home {...props} ></Home>}
                    </Stack.Screen>
                    <Stack.Screen name='Personales'>
                        {props => <Personales {...props} ></Personales>}
                    </Stack.Screen>
                    <Stack.Screen name='Domicilio'>
                        {props => <Domicilio {...props} ></Domicilio>}
                    </Stack.Screen>
                    <Stack.Screen name='Contactos'>
                        {props => <Contactos {...props} ></Contactos>}
                    </Stack.Screen>
                    <Stack.Screen name='Perfil'>
                        {props => <Perfil {...props} ></Perfil>}
                    </Stack.Screen>
                    { /*NOTE: Final de seccion */ }
                    <Stack.Screen name='Reportes'
                    options={({navigation, route}) => ({
                            title: "Atención Ciudadana",
                             headerLeft: (props) => null, //(<HeaderBackButton {...props} onPress={() => navigation.navigate("Reportes") } />),
                            headerTitleAlign:"center",
                            headerTintColor:"#000000",
                    })} >
                        {props => <BachesHome  {...props} ></BachesHome>}
                    </Stack.Screen>
                    <Stack.Screen name='Menu'
                    options={({navigation, route}) => ({
                            headerTitle:"Menu",
                            headerTintColor:"rgba(0,0,0,1 )",
                    })} >
                        {props => <MenuReportes  {...props} ></MenuReportes>}
                    </Stack.Screen>
                    <Stack.Screen name='Terceros'
                        options={({navigation, route}) => ({
                                headerTitle:"Reporte a Terceros",
                                headerTintColor:"rgba(0,0,0,1 )",
                        })} >
                        {props => <ReporteC4  {...props} ></ReporteC4>}
                    </Stack.Screen>
                    <Stack.Screen name='btnRosa'
                        options={({navigation, route}) => ({
                                headerTitle:"Reporte a Terceros",
                                headerTintColor:"rgba(0,0,0,1 )",
                        })} >
                        {props => <ReporteC4  {...props} ></ReporteC4>}
                    </Stack.Screen>
                    <Stack.Screen name='Registrame'
                        options={({navigation, route}) => ({
                            headerTitle:"Registrar",
                            headerTintColor:"rgba(0,0,0,1 )",
                    })}
                    >
                        {props => <Registro  {...props} ></Registro>}
                    </Stack.Screen>
                </Stack.Navigator>
            </NavigationContainer>
        </SafeAreaView>
    )
}
export default Nav;    

