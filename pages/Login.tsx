import React, { Component,useEffect, useState } from "react";
import { View, TouchableOpacity, Text,Image, ImageBackground ,StyleSheet,
  
    Dimensions} from  'react-native';
import { Card, Icon } from 'react-native-elements';
import { BlueColor, DarkPrimaryColor } from "../Styles/BachesColor";
import Styles from "../Styles/BachesStyles";
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
        
        
        <View style = {{flex:1, backgroundColor:'#FFFF'}} >
         
                <View style = {{flex:1, marginTop:12, justifyContent:"center" , alignItems:"center", marginLeft:0}} > 
       
       

             <Image
              source={imagenRequiered}
              style={{ 
                resizeMode: 'center', marginTop:15}}
          
            />
                </View>
                <View style = {{flex:7}} >
                
              

                <TouchableOpacity
                                onPress={ AplicacionReportes } >        
                  
                <Card containerStyle={{backgroundColor:'#045688',borderRadius:10,marginLeft:2,marginBottom:0,marginTop:40,marginRight:2}}>                  
                        <View  style={{   flexDirection: 'row',marginBottom: 6,}}>               
                            <Text style={{color:('#FFFF'),fontSize:18,marginTop:30, marginRight:20, marginLeft:20}}> Atención Ciudadana</Text>
                            <Icon
                                        color = {'#FFFF'}
                                        name = { ENGINNERMENU[0] } 
                                        type = {ENGINNERMENU[1]} 
                                        size = {70}
                                        tvParallaxProperties></Icon>
                        </View>                                             
                </Card>
                </TouchableOpacity>
                <TouchableOpacity>

                
                <Card containerStyle={{backgroundColor:'#912307',borderRadius:10,marginBottom:0,marginTop:0,marginLeft:2,marginRight:2}}>                  
                        <View  style={{   flexDirection: 'row',marginBottom: 6,}}>               
                        <Icon style={{marginLeft:20}}
                                        color = {"#FFFF"}
                                        name = { ALERTMENU[0] } 
                                        type = {ALERTMENU[1]} 
                                        size = {70}
                                        tvParallaxProperties></Icon>
                            <Text style={{color:('#FFFF'),fontSize:18,marginTop:30, marginRight:20, marginLeft:20}}> Luminaria</Text>
                       
                        </View>                                             
                </Card>
                </TouchableOpacity>
                <Card containerStyle={{backgroundColor:'#f4542c',borderRadius:10,marginBottom:0,marginTop:0,marginLeft:2,marginRight:2}}>                  
                        <View  style={{   flexDirection: 'row',marginBottom: 6,}}>               
                            <Text style={{color:('#FFFF'),fontSize:18,marginTop:30, marginRight:50, marginLeft:30}}> Agua Potable </Text>
                            <Icon 
                                    color = {"#FFFF"}
                                        name = { PERSONPINMENU[0] } 
                                        type = {PERSONPINMENU[1]} 
                                        size = {70}
                                        tvParallaxProperties></Icon>
                        </View>                                             
                </Card>
                <TouchableOpacity
                                onPress={ AplicacionLuminaria }
                            >
                <Card containerStyle={{backgroundColor:'#e61723',borderRadius:10,marginLeft:2,marginBottom:0,marginTop:0,marginRight:2}}>                  
                        
                        <View  style={{   flexDirection: 'row',marginBottom: 6,}}>               
                        
                        <Icon style={{marginLeft:20}}
                                        color = {"#FFFF"}
                                        name = { SETTINGMENU[0] } 
                                        type = {SETTINGMENU[1]} 
                                        size = {70}
                                        tvParallaxProperties></Icon>
                            <Text style={{color:('#FFFF'),fontSize:18,marginTop:30, marginRight:20, marginLeft:20}}> Botón de pánico </Text>
                         
                        </View>                                             
                </Card>
                </TouchableOpacity>
                        
                        
                    
                </View>
                <View style = {{flex:1,  justifyContent:"center", alignItems:"center"}} >
                    <Text style = {{color: DarkPrimaryColor}} >
                        Suinpac
                    </Text>
                </View>
             

        </View>
    );
}
