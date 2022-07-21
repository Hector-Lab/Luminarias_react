import * as React from 'react';
import { View, Text, SafeAreaView, Platform, ScrollView } from 'react-native';
import { Avatar, Icon } from 'react-native-elements';
import { StatusBar } from 'expo-status-bar';
import { LOGO } from '../controller/Variables';
import Styles from '../../Styles/styles';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { VERSION } from '../controller/Variables'; 
import { SuinpacRed } from '../../Styles/Color';

export default function MenuUsuario( props ){
    const reportar = () => {
        props.navigation.navigate("Reportar");
    }
    const Historial = () =>{
        props.navigation.navigate("Historial");
    }
    const MisDatos = () =>{
        props.navigation.navigate("Datos");
    }
    return(
        <SafeAreaView style = {{ flexGrow:1, backgroundColor:"white"}} >
            <StatusBar style = { Platform.OS == "ios" ? "dark" : "auto" }  />
            <ScrollView style = {{flexGrow:1}} >
                <View style = {{ alignItems:"center", marginTop:50 }} >
                    <Avatar
                        avatarStyle={{ }}
                        rounded
                        imageProps={ {resizeMode:"contain"} }
                        size = "xlarge"
                        containerStyle = {{height:180,width:300}}
                        source = { LOGO }
                    />
                </View>
                <View style = { [Styles.itemPerfil,{ marginTop:60, flexDirection:"column" }]} >
                    <TouchableOpacity style = {{ flex:1,flexDirection:"row" }} onPress = {reportar} >
                        <Text style = {{textAlign:"left",flex:10,fontWeight:"bold" }}> Reportar </Text>
                        <Icon name = "arrow-forward-ios" type = "material" style = {{ flex:2 }} > </Icon>
                    </TouchableOpacity>
                </View>
                <View style = { [Styles.itemPerfil,{ flexDirection:"column" }]} >
                    <TouchableOpacity style = {{ flex:1,flexDirection:"row" }} onPress = { Historial } >
                        <Text style = {{textAlign:"left",flex:10,fontWeight:"bold" }}>Historial de reportes</Text>
                        <Icon name = "arrow-forward-ios" type = "material" style = {{ flex:2 }} > </Icon>
                    </TouchableOpacity>
                </View>
                <View style = { [Styles.itemPerfil,{ flexDirection:"column" }]} >
                    <TouchableOpacity style = {{ flex:1,flexDirection:"row" }} onPress = { MisDatos } >
                        <Text style = {{textAlign:"left",flex:10,fontWeight:"bold" }}> Mis Datos </Text>
                        <Icon name = "arrow-forward-ios" type = "material" style = {{ flex:2 }} > </Icon>
                    </TouchableOpacity>
                </View>
                <View style = { [Styles.itemPerfil,{ flexDirection:"column" }]} >
                    <TouchableOpacity style = {{ flex:1,flexDirection:"row" }} >
                        <Text style = {{textAlign:"left",flex:10,fontWeight:"bold" }}> Salir </Text>
                        <Icon name = "arrow-forward-ios" type = "material" style = {{ flex:2 }} > </Icon>
                    </TouchableOpacity>
                </View>
            </ScrollView>
            <Text style = {{ textAlign:"center", color:SuinpacRed }} > Atención Ciudadana - V{ VERSION } </Text>
        </SafeAreaView>
    ); 
}
