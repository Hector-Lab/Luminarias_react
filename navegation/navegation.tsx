import * as React from 'react';
import { Icon, ThemeConsumer } from 'react-native-elements';
import { StatusBar, Text, Touchable } from 'react-native';
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
import EditarPersonales from '../pages/Editar/DatosPersonales';
import EditarDomicilio from '../pages/Editar/DatosDomicilio';
import EditarContacto from '../pages/Editar/DatosContacto';
import AtencionReporte from '../pages/Baches/CiudadanoReporte';
import HistorialReportes from '../pages/Reportes/Historial-Reportes';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { PROFILE, RETURN } from '../Styles/Iconos';
import { azulColor, SuinpacRed } from '../Styles/Color';
import Styles from '../Styles/styles';

const Stack = createStackNavigator();

function Nav() {
    return (
        <SafeAreaView style={{ flex: 1 }} >
            <StatusBar barStyle={"light-content"} />
            <NavigationContainer >
                <Stack.Navigator screenOptions={{ headerTintColor: "white" }} >
                    { /*NOTE: Seccion de interfaces para el registro del ciudadano */}
                    <Stack.Screen name='Bienvenido' options={({ navigation, route }) => ({  headerTitle: "Bienvenido",headerTintColor: "rgba(0,0,0,1 )" })} >
                        {props => <Home {...props} ></Home>}
                    </Stack.Screen>
                    <Stack.Screen name='Personales' options={({ navigation, route }) => ({
                            headerTitle: "Registro",
                            headerTintColor: "rgba(0,0,0,1 )",
                            headerLeft: () => {
                                return (
                                    <TouchableOpacity style ={{ marginLeft:20, shadowOpacity:.5 ,shadowColor:azulColor }} onPress = { ()=>{ navigation.navigate("Bienvenido")}} >
                                        <Icon size = { 30 } color = { azulColor } name={RETURN[0]} type={RETURN[1]} tvParallaxProperties ></Icon>
                                    </TouchableOpacity>);
                            }
                        })} >
                        {props => <Personales {...props} ></Personales>}
                    </Stack.Screen>
                    <Stack.Screen name='Domicilio' options={({ navigation, route }) => ({
                            headerTitle: "Registro",
                            headerTintColor: "rgba(0,0,0,1 )",
                            headerLeft: () => {
                                return (
                                    <TouchableOpacity style ={{marginLeft:20, shadowOpacity:.5 ,shadowColor:azulColor}} onPress = { ()=>{ navigation.navigate("Bienvenido")}} >
                                        <Icon size = { 30 } color = { azulColor } name={RETURN[0]} type={RETURN[1]} tvParallaxProperties ></Icon>
                                    </TouchableOpacity>);
                            }
                        })} >
                        {props => <Domicilio {...props} ></Domicilio>}
                    </Stack.Screen>
                    <Stack.Screen name='Contactos' options={({ navigation, route }) => ({
                            headerTitle: "Registro",
                            headerTintColor: "rgba(0,0,0,1 )",
                            headerLeft: () => {
                                return (
                                    <TouchableOpacity style ={{marginLeft:20, shadowOpacity:.5 ,shadowColor:azulColor}} onPress = { ()=>{ navigation.navigate("Bienvenido")}} >
                                        <Icon size = { 30 } color = { azulColor } name={RETURN[0]} type={RETURN[1]} tvParallaxProperties ></Icon>
                                    </TouchableOpacity>);
                            }
                        })} >
                        {props => <Contactos {...props} ></Contactos>}
                    </Stack.Screen>
                    <Stack.Screen name='Perfil' options={({ navigation, route }) => ({
                            headerTitle: "Perfil",
                            headerTintColor: "rgba(0,0,0,1 )",
                            headerLeft: () => {
                                return (
                                    <TouchableOpacity style ={{marginLeft:20, shadowOpacity:.5 ,shadowColor:azulColor}} onPress = { ()=>{ navigation.navigate("Menu")}} >
                                        <Icon size = { 30 } color = { azulColor } name={RETURN[0]} type={RETURN[1]} tvParallaxProperties ></Icon>
                                    </TouchableOpacity>);
                            }
                        })} >
                        {props => <Perfil {...props} ></Perfil>}
                    </Stack.Screen>
                    <Stack.Screen name='EditarPersonales' options={({ navigation, route }) => ({
                            headerTitle: "Datos Personales",
                            headerTintColor: "rgba(0,0,0,1 )",
                            headerLeft: () => {
                                return (
                                    <TouchableOpacity style ={{marginLeft:20, shadowOpacity:.5 ,shadowColor:azulColor}} onPress = { ()=>{ navigation.navigate("Perfil")}} >
                                        <Icon size = { 30 } color = { azulColor } name={RETURN[0]} type={RETURN[1]} tvParallaxProperties ></Icon>
                                    </TouchableOpacity>);
                            }
                        })} >
                        {props => < EditarPersonales {...props} ></ EditarPersonales>}
                    </Stack.Screen>
                    <Stack.Screen name='EditarDomicilio' options={({ navigation, route }) => ({
                            headerTitle: "Domicilio",
                            headerTintColor: "rgba(0,0,0,1 )",
                            headerLeft: () => {
                                return (
                                    <TouchableOpacity style ={{marginLeft:20, shadowOpacity:.5 ,shadowColor:azulColor}} onPress = { ()=>{ navigation.navigate("Perfil")}} >
                                        <Icon size = { 30 } color = { azulColor } name={RETURN[0]} type={RETURN[1]} tvParallaxProperties ></Icon>
                                    </TouchableOpacity>);
                            }
                        })} >
                        {props => < EditarDomicilio {...props} ></ EditarDomicilio>}
                    </Stack.Screen>
                    <Stack.Screen name='EditarContacto' options={({ navigation, route }) => ({
                            headerTitle: "Contactos",
                            headerTintColor: "rgba(0,0,0,1 )",
                            headerLeft: () => {
                                return (
                                    <TouchableOpacity style ={{marginLeft:20, shadowOpacity:.5 ,shadowColor:azulColor}} onPress = { ()=>{ navigation.navigate("Perfil")}} >
                                        <Icon size = { 30 } color = { azulColor } name={RETURN[0]} type={RETURN[1]} tvParallaxProperties ></Icon>
                                    </TouchableOpacity>);
                            }
                        })} >
                        {props => < EditarContacto {...props} ></ EditarContacto>}
                    </Stack.Screen>
                    <Stack.Screen name='AtencionReporte' options={({ navigation, route }) => ({
                            headerTitle: "Reportar",
                            headerTintColor: "rgba(0,0,0,1 )",
                            headerLeft: () => {
                                return (
                                    <TouchableOpacity style ={{marginLeft:20, shadowOpacity:.5 ,shadowColor:azulColor}} onPress = { ()=>{ navigation.navigate("Menu")}} >
                                        <Icon size = { 30 } color = { azulColor } name={RETURN[0]} type={RETURN[1]} tvParallaxProperties ></Icon>
                                    </TouchableOpacity>);
                            }
                        })} >
                        {props => <AtencionReporte {...props} ></AtencionReporte>}
                    </Stack.Screen>
                    <Stack.Screen name="HistorialReportes" options={({ navigation, route }) => ({
                            headerTitle: "Mis Reportes",
                            headerTintColor: "rgba(0,0,0,1 )",
                            headerLeft: () => {
                                return (
                                    <TouchableOpacity style ={{marginLeft:20, shadowOpacity:.5 ,shadowColor:azulColor}} onPress = { ()=>{ navigation.navigate("Perfil")}} >
                                        <Icon size = { 30 } color = { azulColor } name={RETURN[0]} type={RETURN[1]} tvParallaxProperties ></Icon>
                                    </TouchableOpacity>);
                            }
                        })} >
                        {props => <HistorialReportes {...props} ></HistorialReportes>}
                    </Stack.Screen>
                    { /*NOTE: Final de seccion */}
                    <Stack.Screen name='Menu'
                        options={({ navigation, route }) => ({
                            headerTitle: "Menu",
                            headerTintColor: "rgba(0,0,0,1 )",
                            headerRight: () => {
                                return (
                                    <TouchableOpacity style ={{marginRight:20}} onPress = { ()=>{ navigation.navigate("Perfil") } } >
                                        <Icon size = { 30 } color = { azulColor } name={PROFILE[0]} type={PROFILE[1]} tvParallaxProperties ></Icon>
                                    </TouchableOpacity>);
                            }
                        })} >
                        {props => <MenuReportes  {...props} ></MenuReportes>}
                    </Stack.Screen>
                    <Stack.Screen name='Terceros'
                        options={({ navigation, route }) => ({
                            headerTitle: "Reporte anonimo",
                            headerTintColor: "rgba(0,0,0,1 )",
                            headerLeft: () => {
                                return (
                                    <TouchableOpacity style ={{marginLeft:20, shadowOpacity:.5 ,shadowColor:azulColor}} onPress = { ()=>{ navigation.navigate("Menu")}} >
                                        <Icon size = { 30 } color = { azulColor } name={RETURN[0]} type={RETURN[1]} tvParallaxProperties ></Icon>
                                    </TouchableOpacity>);
                            }
                        })} >
                        {props => <ReporteC4  {...props} ></ReporteC4>}
                    </Stack.Screen>
                    <Stack.Screen name='btnRosa'
                        options={({ navigation, route }) => ({
                            headerTitle: "Reporte a Terceros",
                            headerTintColor: "rgba(0,0,0,1 )",
                        })} >
                        {props => <ReporteC4  {...props} ></ReporteC4>}
                    </Stack.Screen>
                    <Stack.Screen name='Registrame'
                        options={({ navigation, route }) => ({
                            headerTitle: "Registrar",
                            headerTintColor: "rgba(0,0,0,1 )",
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

