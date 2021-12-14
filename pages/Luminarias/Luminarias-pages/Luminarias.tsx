import React,{} from "react";
import { View, StyleSheet, ScrollView, KeyboardAvoidingView } from "react-native";
import { Text } from 'react-native-elements'
import Styles from "../../../Styles/styles";
import { Input } from "react-native-elements/dist/input/Input";
import { Picker } from '@react-native-picker/picker';
import { TouchableOpacity } from "react-native-gesture-handler";

export default function Luminarias(props:any ){
    const luminariaList = [
        {
            "id": 1,
            "lavel": "Semaforo",
        },
        {
            "id": "2",
            "lavel": "Luminaria"
        }
    ];
    const estados = [
        {
            "id": "4",
            "lavel": "Bueno",
        },
        {
            "id": "6",
            "lavel": "Regular"
        },
        {
            "id": "6",
            "lavel": "malo"
        }
    ]
    return(
        <View style = {Styles.TabContainer}>
            <View style = {Styles.inputButtons}>
            <KeyboardAvoidingView>
                <ScrollView>
                    <Input placeholder = "Contrato" label = "Contrato" ></Input>
                    <Input placeholder = "Clave de indentificacion" label = "Clave" ></Input>
                    <Input placeholder = "Ejemplo: Luz L.E.D" label = "Clasificacion" ></Input>
                    <Input placeholder = "Voltaje" label = "Voltaje" ></Input>
                    <Picker>
                        {
                            luminariaList.map((item)=>{
                            return  <Picker.Item label = {item.lavel} value = {item.id} key = {item.id} ></Picker.Item>
                            })
                        }
                    </Picker>

                    <Picker >
                        {
                            estados.map((item)=>{
                            return  <Picker.Item label = {item.lavel} value = {item.id} key = {item.id} ></Picker.Item>
                            })
                        }
                    </Picker>
                    <TouchableOpacity style = {Styles.btnButton} >
                        <Text>Tomar Fotografia</Text>
                    </TouchableOpacity>
                </ScrollView>
            </KeyboardAvoidingView>
                
            </View>
        </View>
    );
}