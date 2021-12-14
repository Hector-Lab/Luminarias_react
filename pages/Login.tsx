import { KeyboardAvoidingView, Platform, TouchableOpacity, View, ScrollView} from "react-native";
import React, { useState } from "react";
import { Text, Input} from "react-native-elements";
import { StatusBar } from "expo-status-bar";
import Styles from "../Styles/styles";
import { Avatar } from "react-native-elements/dist/avatar/Avatar";
import { Auth } from './controller/api-controller';
import Loading from './components/modal-loading';
export default function Log(props: any) {
    const [user,setUser] = useState(String);
    const [password,setPassword] = useState(String);
    const [loading,setLoading] = useState(false);
    const login = async ()=>{
        setLoading(true);
        await Auth(user,password);
        //props.navigation.navigate("Menu");
    }

    return (    
        <KeyboardAvoidingView
        style={Styles.container}
         >
            <ScrollView>
            <View style={Styles.container}>
            <StatusBar style="auto" />
            <View style={Styles.avatarView}>
                <View style={Styles.avatarElement}>
                    <Avatar 
                        rounded
                        size = "xlarge"
                        containerStyle = {{height:100,width:200}}
                        source = {require("../resources/suinpac.png")} //FIXME: se puede cambiar por el logo de mexico
                    />
                </View>
            </View>
            <View style = {Styles.inputButtons} >

                <Input 
                    autoCompleteType = {"username"}
                    placeholder = "Nombre de usuario"
                    onChangeText = {text => ("")}
                    leftIcon = {{type:'font-awesome', name: 'user'}}
                />
                <Input 
                    autoCompleteType = {"password"}
                    placeholder = "Contraseña"
                    onChangeText = {pass =>("")}
                    leftIcon = {{type:'font-awesome', name: 'lock'}}/>
                <TouchableOpacity style={Styles.btnButton} onPress={login}>
                    <Text style = {Styles.btnTexto} >Acceder</Text>
                </TouchableOpacity>
            </View>
        </View>
            </ScrollView>
            <Loading 
          transparent = {true}
          loading = {loading}
          loadinColor = {"#0000ff"}
          onCancelLoad = {()=>{}}
         />
        </KeyboardAvoidingView>
      );
}
