import React, { useEffect, useState } from "react";
import { View, TouchableOpacity, Text, ImageBackground } from  'react-native';
import { Card, Icon } from 'react-native-elements';
import { BlueColor, DarkPrimaryColor } from "../Styles/BachesColor";
import { ALERTMENU, ENGINNERMENU, PERSONPINMENU, SETTINGMENU } from '../Styles/Iconos';


export default function Log(props: any) {
    const imagenRequiered = require("../resources/logo.png");
    const AplicacionReportes = () => {
        props.navigation.navigate("Reportes");
    }
    const AplicacionLuminaria = () =>{
        props.navigation.navigate("Menu");
    }
    return(
        <View style = {{flex:1, marginLeft:20,marginRight:20}} >
            <ImageBackground   
                source={imagenRequiered} 
                resizeMode = "contain" 
                style = {{justifyContent:"center",flex:1}}
                imageStyle = {{opacity:.1}} >
                <View style = {{flex:1, justifyContent:"center" , alignItems:"center"}} > 
                    <Text style = {{color: BlueColor, fontSize:32 }} >
                        Atención Ciudadana
                    </Text>
                </View>
                <View style = {{flex:7 }} >
                    <View style = {{flex:1, flexDirection:"column", justifyContent:"center",alignItems:"center"}} >
                        <View style = {{flex:1,flexDirection:"row",  justifyContent:"center", alignItems:"center"}} >
                            <TouchableOpacity
                                onPress={ AplicacionReportes }
                            >
                                <Card>
                                    <Icon 
                                        color = {DarkPrimaryColor}
                                        name = { ENGINNERMENU[0] } 
                                        type = {ENGINNERMENU[1]} 
                                        size = {100}
                                        tvParallaxProperties></Icon>
                                </Card>
                            </TouchableOpacity>
                            <TouchableOpacity>
                                <Card>
                                    <Icon 
                                        color = {"#f38b1e"}
                                        name = { ALERTMENU[0] } 
                                        type = {ALERTMENU[1]} 
                                        size = {100}
                                        tvParallaxProperties></Icon>
                                </Card>
                            </TouchableOpacity>
                        </View>
                        <View style = {{flex:1,flexDirection:"row",  justifyContent:"center", alignItems:"center"}} >
                            <TouchableOpacity>
                                <Card>
                                    <Icon 
                                    color = {"#4c2eb4"}
                                        name = { PERSONPINMENU[0] } 
                                        type = {PERSONPINMENU[1]} 
                                        size = {100}
                                        tvParallaxProperties></Icon>
                                </Card>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={ AplicacionLuminaria }
                            >
                                <Card>
                                    <Icon 
                                        color = {"#9e9e9e"}
                                        name = { SETTINGMENU[0] } 
                                        type = {SETTINGMENU[1]} 
                                        size = {100}
                                        tvParallaxProperties></Icon>
                                </Card>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                <View style = {{flex:1,  justifyContent:"center", alignItems:"center"}} >
                    <Text style = {{color: DarkPrimaryColor}} >
                        Suinpac
                    </Text>
                </View>
            </ImageBackground>
        </View>
    );
}
