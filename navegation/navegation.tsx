import * as React from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, HeaderBackButton } from '@react-navigation/stack';
import Home from '../pages/Login';
import BachesHome from '../pages/Baches/home';
import { SafeAreaView } from 'react-native-safe-area-context';
import ReporteC4 from '../pages/Baches/ReporteC4';
import MenuReportes from '../pages/Reportes/Menu';

const Stack = createStackNavigator();
function Nav() {
    return( 
        <SafeAreaView style = {{flex:1}} >
            <StatusBar barStyle = {"light-content"} />
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
                            title: "Atención Ciudadana",
                             headerLeft: (props) => null, //(<HeaderBackButton {...props} onPress={() => navigation.navigate("Reportes") } />),
                            headerTitleAlign:"center",
                            headerTintColor:"#000000",
                    })} >
                        {props => <BachesHome  {...props} ></BachesHome>}
                    </Stack.Screen>
                    <Stack.Screen name='Menu'
                    options={({navigation, route}) => ({
                            headerShown: true,
                            headerTintColor:'rgba(0,0,0,1)',
                            headerStyle: { elevation:5 }
                    })} >
                        {props => <MenuReportes  {...props} ></MenuReportes>}
                    </Stack.Screen>
                    <Stack.Screen name='Terceros'
                        options={({navigation, route}) => ({
                                title: "Reporte a Terceros",
                                headerTitle:"Reporte a Terceros",
                                headerTintColor:"#000000",
                    })} >
                        {props => <ReporteC4  {...props} ></ReporteC4>}
                    </Stack.Screen>

                </Stack.Navigator>
            </NavigationContainer>
        </SafeAreaView>
    )
}
export default Nav;    

