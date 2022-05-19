import React, { useState, useEffect, useRef } from "react";
import { SafeAreaView,ScrollView, Text, ImageBackground, View, TextInput, TouchableOpacity} from 'react-native';
import { Avatar } from 'react-native-elements';
import Styles  from '../../Styles/styles';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { verificarcurp } from '../../utilities/utilities';
import Message  from '../components/modal-message';
import { azulColor, SuinpacRed } from "../../Styles/Color";
import { StorageBaches } from '../controller/storage-controllerBaches';

export default function Personales(props: any) {
    let [ curpValida, sertCurpValida ] = useState( false );
    let [ mensaje, setMensaje ] = useState( "" );
    let [ titulo, setTitulo ] = useState( "Mensaje" );
    let [ icono, setIcono ] = useState( "info" );
    let [ fuenteIcono, setFuenteIcono ] = useState("material");
    let [ mostrarMensaje, setMostrarMensaje ] = useState(false);
    let storage = new StorageBaches();
    let errorMensajeCurp = ['','CURP no Valida','Formato no Valido'];
    //NOTE: Lista de datos
    let valores = {
        Nombre:'',
        ApellidoP:'',
        ApellidoM:'',
        CURP:'',
        Email:'',
        Telefono:''
    }
    let validacion = Yup.object().shape({
        Nombre: Yup.string().required('Requerido'),
        ApellidoP:Yup.string().required('Requerido'),
        ApellidoM:Yup.string().required('Requerido'),
        CURP:Yup.string().min(18).max(18).required('Requerido'),
        Email:Yup.string().required('Requerido').email(),
        Telefono:Yup.number().required('Requerido')
    });
    const SiguientePaso = () =>{
        props.navigation.navigate("Domicilio");
    }
    const ValidarDatosEspeciales = async ( datos ) =>{
        //NOTE: validamos la curp
        let mensajeError = errorMensajeCurp[verificarcurp(datos.CURP)] ;
        if( mensajeError.length != 0 ){
            setMensaje(mensajeError);
            setMostrarMensaje( mensajeError.length != 0);
            setIcono('info');
            setFuenteIcono('material');
        }else{
            //NOTE: guardamos los datos en la base de datos
            await storage.datosPersonalesPreRegistro(JSON.stringify(datos))
            .then(()=>{
                SiguientePaso();
            });
        }
    }
    return(
        <SafeAreaView style = {{flex:1}} >
            <ImageBackground source = { require('../../assets/Fondo.jpeg') } style = {{ flex:1 }} >
                <ScrollView style = {{flexGrow:1}} >
                    <View style = {{ justifyContent:"center" , alignItems:"center"}}  >
                        <Avatar
                        avatarStyle={{  }}
                            rounded
                            imageProps={ {resizeMode:"contain"} }
                            size = "xlarge"
                            containerStyle = {{height:120,width:220}}
                            source = {require("../../assets/banner.png")} 
                        />
                    </View>
                    <View style = {{flexDirection:"row",marginBottom:20}} >
                        <Text style = {{textAlign:"left",flex:1, marginLeft:16,fontWeight:"bold" }} > Paso 1 de 3 </Text>
                        <Text style = {{textAlign:"left",flex:2,fontWeight:"bold"}} > Datos Personales </Text>
                    </View>
                    <Formik 
                        initialValues={ valores }
                        onSubmit = {datos => ValidarDatosEspeciales( datos )}
                        validationSchema = { validacion }
                        >
                        {({ handleChange, handleBlur, handleSubmit, values,errors, touched })=>{
                            return <View>
                                <Text style = {Styles.TemaLabalCampo} >Nombre</Text>
                                <TextInput 
                                    style = { ( errors.Nombre && touched.Nombre ) ? Styles.TemaCampoError : Styles.TemaCampo } 
                                    placeholder = "Ejemplo: Juan Perez"
                                    onChangeText={handleChange('Nombre')}
                                    value = {values.Nombre}
                                    />

                                <Text style = {Styles.TemaLabalCampo} >Apellido Paterno</Text>
                                <TextInput 
                                    style = { ( errors.ApellidoP && touched.ApellidoP ) ? Styles.TemaCampoError : Styles.TemaCampo } 
                                    placeholder = "Ejemplo: Juan Perez"
                                    onChangeText={handleChange('ApellidoP')}
                                    value = { values.ApellidoP } />

                                <Text style = {Styles.TemaLabalCampo} >Apellido Materno</Text>
                                <TextInput 
                                    style = { ( errors.ApellidoM && touched.ApellidoM ) ? Styles.TemaCampoError : Styles.TemaCampo } 
                                    placeholder = "Ejemplo: Juan Perez"
                                    onChangeText={handleChange('ApellidoM')}
                                    value = {values.ApellidoM} />

                                <Text style = {Styles.TemaLabalCampo} >CURP</Text>
                                <TextInput 
                                    style = { ( errors.CURP && touched.CURP ) ? Styles.TemaCampoError : Styles.TemaCampo } 
                                    placeholder = "Ejemplo: Juan Perez"
                                    onChangeText={handleChange('CURP')}
                                    value = {values.CURP} />
                                <Text style = {Styles.TemaLabalCampo} >Correo Electrónico</Text>
                                <TextInput 
                                    style = { ( errors.Email && touched.Email ) ? Styles.TemaCampoError : Styles.TemaCampo } 
                                    placeholder = "Ejemplo: Juan Perez"
                                    onChangeText={handleChange('Email')}
                                    value = {values.Email} />
                                <Text style = {Styles.TemaLabalCampo} >Telefono</Text>
                                <TextInput 
                                    style = { ( errors.Telefono && touched.Telefono ) ? Styles.TemaCampoError : Styles.TemaCampo } 
                                    placeholder = "Ejemplo: Juan Perez"
                                    onChangeText={handleChange('Telefono')}
                                    value = {values.Telefono} />
                                <TouchableOpacity style = { [Styles.btnGeneral,{marginTop:20}] } onPress = { handleSubmit }>
                                    <Text style = {[Styles.btnTexto,{textAlign:"center"}]} > Siguiente Paso </Text>
                                </TouchableOpacity>
                            </View>
                        }}
                    </Formik>
                </ScrollView>
                <Message
                    transparent = {true}
                    loading = { mostrarMensaje }
                    loadinColor = { azulColor }
                    icon = { icono }
                    iconsource = { fuenteIcono }
                    message = { mensaje }
                    tittle = { titulo }
                    buttonText = { 'Aceptar' }
                    color = { azulColor }
                    onCancelLoad = {()=>{ setMostrarMensaje( false ) }}
                />
            </ImageBackground> 
        </SafeAreaView>
    )
}
