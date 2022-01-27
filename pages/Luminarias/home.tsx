import React,{ useEffect, useState } from "react";
import { View, ImageBackground, TouchableOpacity, Text} from "react-native";
import Styles from "../../Styles/styles";
import { Avatar, Input, Button } from 'react-native-elements';
import { DarkPrimaryColor } from "../../Styles/BachesColor";

export default function MenuLuminarias(props:any ){
    const LoginBaches = () =>{
        props.navigation.navigate("Luminarias");
    }
    return(
        <View style = {[Styles.container]}>
            <View style = {{flex:1,  borderColor:"res", justifyContent:"center"}}>
                <View style = {{flex:3, borderColor:"green"}} >
                    <View style={[Styles.avatarView,{flex:3}]}>
                        <View style={Styles.avatarElement}>
                            <Avatar  //FIXME:  se pude cambiar el logo del cliente
                                rounded
                                size = "xlarge"
                                containerStyle = {{height:100,width:200}}
                                source = {require("../../resources/suinpac.png")} //FIXME: se puede cambiar por el logo de mexico
                            />
                        </View>
                    </View>
                </View>
                <View style = {{ flex:5, flexDirection:"column" , padding:10 }} >
                    <Input placeholder = "Usuario" autoCompleteType = {undefined} style = {Styles.inputBachees} />
                    <Input placeholder = "Contraseña" autoCompleteType = {undefined} style = {Styles.inputBachees} />
                    <TouchableOpacity style = {Styles.btnButtonSuccess} onPress={ LoginBaches } >
                        <Text style = {{color:"white", fontWeight:"bold"}} > {`Iniciar Sesión`} </Text>
                    </TouchableOpacity>
                </View>
                <View style = {{flex:2, flexDirection:"column-reverse"}} >  
                    <Text style = {{textAlign:"center", marginBottom:20, color: DarkPrimaryColor, fontWeight:"bold", fontSize:16 }} > {`Suinpac`} </Text>
                </View>
            </View> 
        </View>
    );
}