import React,{ useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import { Button, getIconType, Icon, Text } from 'react-native-elements';
import { TouchableOpacity } from "react-native-gesture-handler";
import MapView,{ Marker } from 'react-native-maps';
import { DarkPrimaryColor } from "../../Styles/BachesColor";
import Styles from '../../Styles/styles';
import Loading from '../components/modal-loading';

export default function MyLocation(props:any ){
    const estatusLetra = [{"Nombre":"Pendiente"},{"Nombre":"Proceso"},{"Nombre":"Atendida"},{"Nombre":"Rechazada"}];
    return(
        <View style = {{...StyleSheet.absoluteFillObject}} >

                <MapView 
                    initialRegion={ props.initialRegion }
                    region={ props.region }
                    style = { StyleSheet.absoluteFillObject} >
                        {
                            props.region != null ? (
                                <View>
                                    <Marker
                                        
                                        title = { "Codigo: " + props.Reporte.Codigo}
                                        description = {` Estado:  ${estatusLetra[parseInt(props.Reporte.Estatus) - 1].Nombre}`}
                                        coordinate={{"latitude":props.region.latitude,"longitude":props.region.longitude}}/>
                                </View>
                            ) : <></>
                        }
                        {/**NOTE: solo funciona con un child */}
                </MapView>
                <View style = {{flex:1,flexDirection:"row"}} >
                    <TouchableOpacity 
                    onPress = {props.return}
                    style = {{backgroundColor:DarkPrimaryColor+75, padding:10, marginTop:10, marginLeft:10}} >
                        {/*<Text > Regresar </Text>*/}
                        <Icon name = "keyboard-return" type = "material" color = {"white"} style = { {fontWeight:"bold"}} tvParallaxProperties  />
                    </TouchableOpacity>
                </View>
        </View>
    );
}