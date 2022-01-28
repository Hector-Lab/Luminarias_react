import React,{ useEffect, useState } from "react";
import { View, ImageBackground, TouchableOpacity, Text} from "react-native";
import Styles from "../../Styles/styles";
import { Avatar, Input, Button } from 'react-native-elements';
import { DarkPrimaryColor } from "../../Styles/BachesColor";
import { StorageService } from '../controller/storage-controller';
import { ClavesLuminarias, Auth } from '../controller/api-controller';
export default function MenuLuminarias(props:any ){
    const [ contrasenia, setContrasenia ] = useState(String);
    const [ usuario, setUsuarios ] = useState(String);
    const [ errorUI, setErrorUI ] = useState(String);
    let storage = new StorageService(); 
    useEffect(()=>{
        storage.createOpenDB();
        storage.createTables();
    },[]);

    const ObtenerPadronLuminarias = async () =>{
        await ClavesLuminarias()
        .then(()=>{
            //NOTE: descpues de descargar nos pasamos a la pantalla luminarias 
            //props.navigation.navigate("Luminarias");
        })
        .catch(error=>{
            console.log(error);
        })
    }
    const Login = async () =>{
        let error = "";
        if( contrasenia == "" ){
            error += "C,";
        }
        if( usuario == "" ) {
            error += "U,";
        }
        if( error != "" ){
            setErrorUI(error);
        }else{
            //NOTE: Hacemos el login
            await Auth( usuario, contrasenia ).then(( result ) =>{
                console.log();
            });
        }

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
                    <Input placeholder = "Usuario" autoCompleteType = {undefined} style = {Styles.inputBachees} onChangeText = {( usuario )=>{ setUsuarios( usuario )}} />
                    <Input placeholder = "Contraseña" autoCompleteType = {undefined} style = {Styles.inputBachees} onChangeText = { ( password )=>{setContrasenia( password )} } />
                    <TouchableOpacity style = {Styles.btnButtonSuccess} onPress={ Login } >
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