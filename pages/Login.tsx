import { KeyboardAvoidingView, Platform, TouchableOpacity, View, ScrollView} from "react-native";
import { Text, Input} from "react-native-elements";
import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import Styles from "../Styles/styles";
import { Avatar } from "react-native-elements/dist/avatar/Avatar";
import { Auth, CatalogoLuminarias, ClavesLuminarias, ClavesMedidor } from './controller/api-controller';
import Loading from './components/modal-loading';
import Message from './components/modal-message';
import { BackgrounBlue, iconColorBlue, SuinpacRed } from "../Styles/Color";
import { StorageService } from './controller/storage-controller';
export default function Log(props: any) {
    const [user,setUser] = useState(String);
    const [password,setPassword] = useState(String);
    const [loading,setLoading] = useState(false);
    //NOTE: manejador del modal de avisos
    const [showMessage, setShowMessage] = useState(false);
    const [message,setMessage] = useState(String);
    const [tittle,setTittle] = useState(String);
    const [ iconMessega, setIconMessega] = useState("info");
    const [ color, setColor ] = useState(String);
    let storage = new StorageService();
    useEffect(()=>{
        storage.createOpenDB();
        storage.createTables();
        //storage.borrarDatos("EstadoFisico");
        //storage.borrarDatos("TipoLuminaria");
        //storage.borrarDatos("CatalogoLuminaria");
        //storage.borrarDatos("CatalogoMedidores");
    })
    const login = async ()=>{
        setLoading(true);
       let validDatos = true;
       if(user == "" || password == ""){
            validDatos = false;
            setLoading(false);
            setMessage("Favor de ingresar sus credenciales");
            setColor(BackgrounBlue);
            setIconMessega("info");
            setTittle("Mensaje");
       }
        setShowMessage(!validDatos);
        if(validDatos){
            await Auth(user,password)
            .then( async (result)=>{
                if(result == 0){ 
                    await CatalogoLuminarias();
                    await ClavesLuminarias();
                    await ClavesMedidor();
                    setLoading(false);
                    props.navigation.navigate("Menu");
                }else if(result = 1){
                    //NOTE: al menu de baches
                    setLoading(false);
                    props.navigation.navigate("Reportes");
                }else{
                    setColor(iconColorBlue);
                    setMessage("No se encontro el usuario");
                    setIconMessega("user-x");
                    setTittle("Mensaje");
                    setLoading(false);
                }
            })
            .catch((error)=>{
                setLoading(false);
                let message = error.message+"";
                setShowMessage(true);
                setColor(SuinpacRed);
                setMessage(message);
                setIconMessega(message.includes("Usuario o Contraseña Incorrectos") ? "user-x" : "wifi-off");
                setTittle("Mensaje");
                //NOTE: manejo de errores
            })
        }
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
                message = {""}
                tittle = {""}
            />
         <Message
            transparent = {true}
            loading = {showMessage}
            onCancelLoad = {()=>{ setShowMessage(false) }}
            color = {color}
            icon = {iconMessega}
            iconsource = "feather"
            loadinColor = {SuinpacRed}
            message = {message}
            tittle = {tittle}
            buttonText = {"Aceptar"}
         />
        </KeyboardAvoidingView>
      );
}
