import React, { useCallback, useEffect, useState } from "react";
import { View,ImageBackground, TouchableOpacity } from "react-native";
import { Text } from 'react-native-elements';
import Styles from "../../Styles/BachesStyles";
import { TextInput, Button } from 'react-native-paper';
import { cardColor,PrimaryColor } from '../../Styles/BachesColor';
import { ScrollView } from "react-native-gesture-handler";
import { StorageBaches } from '../controller/storage-controllerBaches';
export default function CustomMapBaches(props:any){
    const [ CURP, setCURP ] = useState(String);
    const [ nombres, setNombres ] = useState(String);
    const [ materno,setMaterno ] = useState(String);
    const [ paterno,setPaterno ] = useState(String);
    const [ telefono, setTelefono ] = useState(String);
    const [ email,setEmail ] = useState(String);
    const [ errorUI, setErrorUI] = useState(String);
    const storage = new StorageBaches();
    useEffect(() => {
        //NOTE:


      },[]);
      const GuardarDatos = () =>{
        let error = "";
        if(CURP == "" ){
            error += "C,";
        }
        if(nombres == "" ){
            error += "N,";
        }
        if(materno == "" ){
            error += "M,";
        }
        if(paterno == "" ){
            error += "P,";
        }
        if(telefono == "" ){
            error += "T,";
        }
        if(email == "" ){
            error += "E,";
        }
        setErrorUI(error);
        console.log(error);
        if(error == ""){
            let data = {
                Curp:CURP,
                Nombres:nombres,
                Paterno:paterno,
                Materno: materno,
                Telefono:telefono,
                Email: email
            }
            //storage.GuardarDatosPersona(data);
        }
      }


    return(
        <View style = {[Styles.TabContainer]} >
                <View style = {{flex:1, flexDirection:"column"}}>
                <ScrollView>
                    <View style = {{flex: 5, padding:20}}>
                        <TextInput
                        style = { {borderWidth: String(errorUI).includes("C,") ? 1 : 0 ,borderColor:"red"}} 
                        keyboardType="default"
                        value= { CURP}
                        label={ "CURP" }
                        activeOutlineColor= {'red'}
                        activeUnderlineColor = {PrimaryColor}
                        onChangeText={ text => { setCURP(text); }}
                        />
                        <TextInput 
                        keyboardType="twitter"
                        value = { nombres }
                        style = {[Styles.inputs,{borderWidth: String(errorUI).includes("N,") ? 1 : 0 ,borderColor:"red"}]}
                        label={ "Nombres" }
                        activeOutlineColor= {'red'}
                        activeUnderlineColor = {PrimaryColor}
                        onChangeText={text => setNombres(text)}
                        />
                        <TextInput 
                        value = { paterno }
                        keyboardType="twitter"
                        style = {[Styles.inputs,{borderWidth: String(errorUI).includes("M,") ? 1 : 0 ,borderColor:"red"}]}
                        label={ "Apellido Paterno" }
                        activeOutlineColor= {'red'}
                        activeUnderlineColor = {PrimaryColor}
                        onChangeText={text => setPaterno(text)}
                        />
                        <TextInput
                        value = { materno }
                        keyboardType="twitter"
                        style = {[Styles.inputs,{borderWidth: String(errorUI).includes("P,") ? 1 : 0 ,borderColor:"red"}]}
                        label={ "Apellido Materno" }
                        activeOutlineColor= {'red'}
                        activeUnderlineColor = {PrimaryColor}
                        onChangeText={ text => setMaterno(text)}
                        />
                        <TextInput 
                        value = {telefono}
                        keyboardType="number-pad"
                        style = {[Styles.inputs,{borderWidth: String(errorUI).includes("T,") ? 1 : 0 ,borderColor:"red"}]}
                        label={ "Telefono" }
                        activeOutlineColor= {'red'}
                        activeUnderlineColor = {PrimaryColor}
                        onChangeText={ text => setTelefono(text)}
                        />
                        <TextInput 
                        keyboardType="email-address"
                        value = {email}
                        style = {[Styles.inputs,{borderWidth: String(errorUI).includes("E,") ? 1 : 0 ,borderColor:"red"}]}
                        label={ "Emial" }
                        activeOutlineColor= {'red'}
                        activeUnderlineColor = {PrimaryColor}
                        onChangeText={ text => setEmail(text)}
                        />
                    </View>
                    <View style = {{flex: 1, padding:20}} >
                    <TouchableOpacity style = {Styles.btnButtonSuccess} onPress={ GuardarDatos }>
                        <Text style = {{color:"white"}} > Guardar </Text>
                    </TouchableOpacity>
                </View>
                </ScrollView>
                </View>
        </View>
    );
}