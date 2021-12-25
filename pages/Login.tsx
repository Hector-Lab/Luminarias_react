import { TouchableOpacity, View, StyleSheet } from "react-native";
import React from "react";
import { Text } from "react-native-elements";
import { StatusBar } from "expo-status-bar";
import Styles from "../Styles/styles";
import { Avatar } from "react-native-elements/dist/avatar/Avatar";
import { Input } from "react-native-elements/dist/input/Input";

export default function Log(props: any) {
    const login = ()=>{
        props.navigation.navigate("Luminarias");
    }

    return (
        <View style={Styles.container}>
            <StatusBar style="auto" />
            <View style={[Styles.avatarView]}>
                <View style={Styles.avatarElement}>
                    <Avatar 
                        rounded
                        size = "xlarge"
                        containerStyle = {{height:100,width:200}}
                        source = {require("../resources/suinpac.png")} //FIXME: se puede cambiar por el logo de mexico
                    />
                </View>
            </View>
            <View style = {[Styles.inputButtons]} >
                <Input 
                    placeholder = "Nombre de usuario"
                    onChangeText = {text => ("")}
                    leftIcon = {{type:'font-awesome', name: 'user'}}
                />
                <Input 
                    placeholder = "Contraseña"
                    onChangeText = {pass =>("")}
                    leftIcon = {{type:'font-awesome', name: 'lock'}}/>
                <TouchableOpacity style={Styles.btnButton} onPress={login}>
                    <Text style = {Styles.btnTexto} >Acceder</Text>
                </TouchableOpacity>
            </View>
            <View style = {Styles.FooterConteiner}>
                <Text style = {Styles.FooterText} >SUINPAC</Text>
            </View>
        </View>
      );
}
