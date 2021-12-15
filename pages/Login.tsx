import { KeyboardAvoidingView, Platform, TouchableOpacity, View, ScrollView} from "react-native";
import React, { useState } from "react";
import { Text, Input} from "react-native-elements";
import { StatusBar } from "expo-status-bar";
import Styles from "../Styles/styles";
import { Avatar } from "react-native-elements/dist/avatar/Avatar";
import { Auth } from './controller/api-controller';
import Loading from './components/modal-loading';
import Message from './components/modal-message';
import { SuinpacRed } from "../Styles/Color";

export default function Log(props: any) {
    const [user,setUser] = useState(String);
    const [password,setPassword] = useState(String);
    const [loading,setLoading] = useState(false);
    const [showMessage, setShowMessage] = useState(false);
    const [message,setMessage] = useState(String);
    const [tittle,setTittle] = useState(String);
    const login = async ()=>{
       /* let validDatos = true;
        if( user == "" ){
            setTittle("Mensaje");
            setMessage("Favor de ingresar su nombre de usuario");
            validDatos = false;
        }
        if (password == ""){
            setTittle("Mensaje");
            setMessage("Favor de ingresar su contraseña");
            validDatos = false;
        }
        setShowMessage(!validDatos);
        console.log("Valid datos" + validDatos);
        if(validDatos){
            await Auth(user,password)
            .then((result)=>{
                console.log(result);
            })
            .catch(()=>{
                console.log("Error");
                //NOTE: manejo de errores
            })
        }*/
        //setLoading(true);
        
        props.navigation.navigate("Reportes");

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
                    onChangeText = {text => (setUser(text))}
                    leftIcon = {{type:'font-awesome', name: 'user'}}
                />
                <Input 
                    secureTextEntry = {true} 
                    autoCompleteType = {"password"}
                    placeholder = "Contraseña"
                    onChangeText = {pass =>(setPassword(pass))}
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
         <Message
            transparent = {true}
            loading = {showMessage}
            onCancelLoad = {()=>{ setShowMessage(false) }}
            color = {SuinpacRed}
            icon = {"alert-triangle"}
            iconsource = "feather"
            loadinColor = {SuinpacRed}
            message = {"Campos Vacios!!"}
            tittle = {"Mensaje"}
            buttonText = {"Aceptar"}
         />
        </KeyboardAvoidingView>
      );
}
