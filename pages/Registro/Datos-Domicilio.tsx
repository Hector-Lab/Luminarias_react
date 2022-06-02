import React, { useState, useEffect, useRef } from "react";
import { SafeAreaView,ScrollView, Text, ImageBackground, View, TextInput, TouchableOpacity, ViewBase} from 'react-native';
import { Avatar } from 'react-native-elements';
import Styles  from '../../Styles/styles';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { StorageBaches } from '../controller/storage-controllerBaches';

export default function Domicilio(props: any) {
    
    const SiguientePaso = () =>{
        props.navigation.navigate("Contactos");
    }
    let Storage = new StorageBaches();
    let valores = {
        Localidad:'',
        Calle:'',
        Numero:'',
        Colonia:'',
        CodigoPostal: ''
    };
    let validacion = Yup.object().shape({
        Localidad: Yup.string().required(),
        Calle: Yup.string().required(),
        Numero: Yup.number().required() ,
        Colonia:Yup.string().required(),
        CodigoPostal: Yup.number().required()
    }); 
    const GuardarDatosLocal = async ( datos ) =>{
        await Storage.datosDomicilioPreRegistro(JSON.stringify(datos)).then(()=>{SiguientePaso()})
    }
    return(
        <SafeAreaView style = {{flex:1}} >
            <ImageBackground source = { require('../../assets/Fondo.jpeg') } style = {{ flex:1 }} >
                <ScrollView style = {{flexGrow:1}} >
                    <View style = {{ justifyContent:"center" , alignItems:"center"}}  >
                        <Avatar
                        avatarStyle={{  }}
                            rounded
                            imageProps={{resizeMode:"contain"}}
                            size = "xlarge"
                            containerStyle = {{height:120,width:220}}
                            source = {require("../../assets/banner.png")} 
                        />
                    </View>
                    <View style = {{flexDirection:"row",marginBottom:20}} >
                        <Text style = {{textAlign:"left",flex:1, marginLeft:16,fontWeight:"bold" }} > Paso 2 de 3 </Text>
                        <Text style = {{textAlign:"left",flex:2,fontWeight:"bold"}} > Domicilio </Text>
                    </View>
                    <Formik
                        initialValues={ valores }
                        onSubmit = {datos => GuardarDatosLocal( datos )}
                        validationSchema = { validacion }
                    >
                        {({ handleChange, handleBlur, handleSubmit, values,errors, touched })=>{
                            return <View>
                                <Text style = {Styles.TemaLabalCampo} >Localidad</Text>
                                <TextInput 
                                    style = { ( errors.Localidad && touched.Localidad ) ? Styles.TemaCampoError : Styles.TemaCampo } 
                                    placeholder = "Ejemplo: Ciatitlan Izcalli"
                                    onChangeText={handleChange('Localidad')}
                                    value = {values.Localidad} />
                                <Text style = {Styles.TemaLabalCampo} >Calle</Text>
                                <TextInput 
                                    style = { ( errors.Calle && touched.Calle ) ? Styles.TemaCampoError : Styles.TemaCampo } 
                                    placeholder = "Ejemplo: Avenida Violetas"
                                    onChangeText={handleChange('Calle')}
                                    value = {values.Calle} />
                                <Text style = {Styles.TemaLabalCampo} >Numero {( errors.Numero && touched.Numero && values.Numero != "" ) ? <Text style = {{ color:"red" }} > No valido </Text>: <></>} </Text>
                                <TextInput 
                                    style = { ( errors.Numero && touched.Numero ) ? Styles.TemaCampoError : Styles.TemaCampo } 
                                    placeholder = "Ejemplo: 20"
                                    onChangeText={handleChange('Numero')}
                                    value = {values.Numero} />
                                <Text style = {Styles.TemaLabalCampo} >Colonia</Text>
                                <TextInput 
                                    style = { ( errors.Colonia && touched.Colonia ) ? Styles.TemaCampoError : Styles.TemaCampo } 
                                    placeholder = "Ejemplo: Colinas del Lago"
                                    onChangeText={handleChange('Colonia')}
                                    value = {values.Colonia} />
                                <Text style = {Styles.TemaLabalCampo} >Codigo Postal {( errors.CodigoPostal && touched.CodigoPostal && values.CodigoPostal != "" ) ? <Text style = {{ color:"red" }} > No valido </Text>: <></>} </Text>
                                <TextInput 
                                    keyboardType="numeric"
                                    style = { ( errors.CodigoPostal && touched.CodigoPostal) ? Styles.TemaCampoError : Styles.TemaCampo } 
                                    placeholder = "Ejemplo: 54716"
                                    onChangeText={handleChange('CodigoPostal')}
                                    value = {values.CodigoPostal } />
                                <TouchableOpacity style = { [Styles.btnGeneral,{marginTop:20,borderWidth:1}]} onPress = {handleSubmit}  >
                                    <Text style = {[Styles.btnTexto,{textAlign:"center"}]} > Siguiente Paso </Text>
                                </TouchableOpacity>
                            </View>
                        }}
                    </Formik>
                </ScrollView>
            </ImageBackground> 
        </SafeAreaView>
    )
}
