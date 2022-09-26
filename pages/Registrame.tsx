import { useState } from "react";
import { View,Text, TextInput, SafeAreaView, ScrollView, Modal, StatusBar } from "react-native";
import { Divider } from 'react-native-elements';
import { TouchableOpacity } from "react-native-gesture-handler";
import { BlueColor, DarkPrimaryColor } from "../Styles/BachesColor";

export default function Registro(props: any) {
    const [ activarModal , setActivarModal ] = useState( true );
    const generarModal = () =>{
        return (
            
            <Modal>
                <Text style= {{marginBottom: 5, marginTop: 10, marginLeft: 15, marginRight: 15, color:"black", fontWeight:"bold", justifyContent: "center", alignItems: "center"}}>Nombre</Text>
                <TextInput
                    placeholder="Nombre: Juan Perez"
                    //maxLength={ 50 }
                    keyboardType="number-pad"
                    autoCapitalize = {"characters"}
                    style = {[ false ? { borderColor: "red" } : { borderColor: "black" } , { borderWidth: 1, padding: 3, marginLeft: 15, marginRight: 15, marginBottom: 10, borderRadius: 5 }]}
                />
                <Text style= {{marginBottom: 5, marginTop: 10, marginLeft: 15, marginRight: 15, color:"black", fontWeight:"bold", justifyContent: "center", alignItems: "center"}}>Telefono</Text>
                <TextInput
                    placeholder="Ejemplo: 7472123212"
                    //maxLength={ 50 }
                    keyboardType="number-pad"
                    autoCapitalize = {"characters"}
                    style = {[ false ? { borderColor: "red" } : { borderColor: "black" } , { borderWidth: 1, padding: 3, marginLeft: 15, marginRight: 15, marginBottom: 10, borderRadius: 5 }]}
                />
                <Text style= {{marginBottom: 5, marginTop: 10, marginLeft: 15, marginRight: 15, color:"black", fontWeight:"bold", justifyContent: "center", alignItems: "center"}}>Direccion</Text>
                <TextInput
                    placeholder="Ejemplo: Av. Insurgentes #5"
                    //maxLength={ 50 }
                    keyboardType="number-pad"
                    autoCapitalize = {"characters"}
                    style = {[ false ? { borderColor: "red" } : { borderColor: "black" } , { borderWidth: 1, padding: 3, marginLeft: 15, marginRight: 15, marginBottom: 10, borderRadius: 5 }]}
                />
                <Text style= {{marginBottom: 5, marginTop: 10, marginLeft: 15, marginRight: 15, color:"black", fontWeight:"bold", justifyContent: "center", alignItems: "center"}}>Email</Text>
                <TextInput
                    placeholder="Ejemplo: Mi_correo@email.com"
                    //maxLength={ 50 }
                    keyboardType="number-pad"
                    autoCapitalize = {"characters"}
                    style = {[ false ? { borderColor: "red" } : { borderColor: "black" } , { borderWidth: 1, padding: 3, marginLeft: 15, marginRight: 15, marginBottom: 10, borderRadius: 5 }]}
                />
            </Modal>
        )
    }

    return(
        <SafeAreaView>
            <StatusBar animated={true} barStyle = {"dark-content"}/>
               {
                   activarModal ? generarModal() :                 
                   <ScrollView style = {{flexGrow:1}} >
                       
                   <Text style= {{marginBottom: 5, marginTop: 10, marginLeft: 15, marginRight: 15, color:"black", fontWeight:"bold", justifyContent: "center", alignItems: "center"}}>Nombre</Text>
                   <TextInput
                       placeholder="Ejemplo: Juan"
                       //maxLength={ 50 }
                       keyboardType="number-pad"
                       autoCapitalize = {"characters"}
                       style = {[ false ? { borderColor: "red" } : { borderColor: "black" } , { borderWidth: 1, padding: 3, marginLeft: 15, marginRight: 15, marginBottom: 10, borderRadius: 5 }]}
                   />
                   <Text style= {{marginBottom: 5, marginTop: 10, marginLeft: 15, marginRight: 15, color:"black", fontWeight:"bold", justifyContent: "center", alignItems: "center"}}>Apellido Paterno</Text>
                   <TextInput
                       placeholder="Ejemplo: Perez"
                       //maxLength={ 50 }
                       keyboardType="number-pad"
                       autoCapitalize = {"characters"}
                       style = {[ false ? { borderColor: "red" } : { borderColor: "black" } , { borderWidth: 1, padding: 3, marginLeft: 15, marginRight: 15, marginBottom: 10, borderRadius: 5 }]}
                   />
                   <Text style= {{marginBottom: 5, marginTop: 10, marginLeft: 15, marginRight: 15, color:"black", fontWeight:"bold", justifyContent: "center", alignItems: "center"}}>Apellido Materno</Text>
                   <TextInput
                       placeholder="Ejemplo: Juarez"
                       //maxLength={ 50 }
                       keyboardType="number-pad"
                       autoCapitalize = {"characters"}
                       style = {[ false ? { borderColor: "red" } : { borderColor: "black" } , { borderWidth: 1, padding: 3, marginLeft: 15, marginRight: 15, marginBottom: 10, borderRadius: 5 }]}
                   /> 
                   <Text style= {{marginBottom: 5, marginTop: 10, marginLeft: 15, marginRight: 15, color:"black", fontWeight:"bold", justifyContent: "center", alignItems: "center"}}>CURP</Text>
                   <TextInput
                       placeholder="Ejemplo: XAXX010101000"
                       //maxLength={ 50 }
                       keyboardType="number-pad"
                       autoCapitalize = {"characters"}
                       style = {[ false ? { borderColor: "red" } : { borderColor: "black" } , { borderWidth: 1, padding: 3, marginLeft: 15, marginRight: 15, marginBottom: 10, borderRadius: 5 }]}
                   />                
                   <Text style= {{marginBottom: 5, marginTop: 10, marginLeft: 15, marginRight: 15, color:"black", fontWeight:"bold", justifyContent: "center", alignItems: "center"}}>Telefono</Text>
                   <TextInput
                       placeholder="Ejemplo: 7472123221"
                       //maxLength={ 50 }
                       keyboardType="number-pad"
                       autoCapitalize = {"characters"}
                       style = {[ false ? { borderColor: "red" } : { borderColor: "black" } , { borderWidth: 1, padding: 3, marginLeft: 15, marginRight: 15, marginBottom: 10, borderRadius: 5 }]}
                   />
                   <Text style= {{marginBottom: 5, marginTop: 10, marginLeft: 15, marginRight: 15, color:"black", fontWeight:"bold", justifyContent: "center", alignItems: "center"}}>Email</Text>
                   <TextInput
                       placeholder="Ejemplo: Mi_correo@email.com"
                       //maxLength={ 50 }
                       keyboardType="number-pad"
                       autoCapitalize = {"characters"}
                       style = {[ false ? { borderColor: "red" } : { borderColor: "black" } , { borderWidth: 1, padding: 3, marginLeft: 15, marginRight: 15, marginBottom: 10, borderRadius: 5 }]}
                   />
                   <TouchableOpacity style = {{padding:10, backgroundColor: BlueColor , borderRadius:10, margin:15, alignItems:"center"}} >
                       <Text style = {{color:"white"}} > Aregar Contacto </Text>
                   </TouchableOpacity>
               </ScrollView>
               }
        </SafeAreaView>
    );
}