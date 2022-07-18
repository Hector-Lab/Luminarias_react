
import React, { useEffect, useState } from "react";
import { View, TouchableOpacity, TextInput, Text, Platform, ScrollView } from  'react-native';
import { StatusBar } from  'expo-status-bar';
import Styles from "../../Styles/styles";
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { verificarcurp } from '../../utilities/utilities';
import { USER_COG } from  '../../Styles/Iconos';
import  Message  from '../components/modal-message';
import Loading from '../components/modal-loading';
import { azulColor } from "../../Styles/Color";
import { StorageBaches } from '../controller/storage-controllerBaches';

const storage = new StorageBaches();
const validacion = Yup.object().shape({
    Nombre:Yup.string().min(2).required("Nombre requerido"),
    ApellidoM: Yup.string().required("Apellido Materno es requerido"),
    ApellidoP: Yup.string().required("Apellido Paterno es requerido"),
    CURP: Yup.string().required("CURP requerida").min(18),
    Telefono: Yup.number().required("Telefono requerido"),
    Email: Yup.string().email().required("Email Requerido")
});
export default function Personales(props: any) {
    const [ cargando, setCargando  ] = useState( false );
    const [ mostrarMensaje, setMostrarMensaje ] = useState( false );
    const [ mensaje, setMensaje ] = useState( String );
    const [ icono, setIcono ] = useState(String);
    const [ iconoFuente, setIconoFuente ] = useState(String);
    const [ tipoMensaje, setTipoMensaje ] = useState( String );
    const curpMensajes = [ "", "La CURP ingresada no es valida" , "El formato de la CURP no valida"];
    const siguientePaso = () =>{
        setCargando(false);
        props.navigation.navigate("Domicilio");
    }
    //NOTE: validacione del formik
    let formik = useFormik({
        initialValues:{
            Nombre:"",
            ApellidoM:"",
            ApellidoP:"",
            CURP:"",
            Telefono:"",
            Email:""
        },
        onSubmit: async (values) => {
            setCargando( true );
            let codigo = verificarcurp(formik.values.CURP);
            if(codigo != 0){
                lanzarMensaje( curpMensajes[codigo],"Mensaje",USER_COG[0],USER_COG[1]);
                setCargando( false );
                return;
            }
            console.log(values);
            await storage.guardarPersonalesPreregistro( JSON.stringify(values) );
            siguientePaso();
            //NOTE: lo mandamos al storage
            //storage.guardarPersonalesPreregistro();  
        },
        validationSchema:validacion
    });
    const lanzarMensaje = ( mensaje:string, tipo:string,nombreIcono:string, fuenteIcono:string ) => {
        setMensaje(mensaje);
        setTipoMensaje(tipo);
        setIcono(nombreIcono);
        setIconoFuente(fuenteIcono);
        setMostrarMensaje(true);
    }
    return(
        <View style = {{flexGrow:1, backgroundColor:"white" }} >
            <StatusBar style = { Platform.OS == "ios" ? "dark" : "auto" }/>
            <View style = {{ flex:1 ,marginTop:10, padding:15 }} >
                <ScrollView style = {{flexGrow:1}} >
                    <View>
                        <Text style = { Styles.txtSubtitulo } > Paso 1: Datos Personales</Text>
                        {/**NOTE: Seccion de  formulario para el registro  */}
                        <Text style = { [Styles.txtLabel,{marginTop:20}] } >Nombre</Text>
                        <TextInput style = {( formik.errors.Nombre && formik.touched.Nombre ) ? Styles.errorCampo : Styles.campo } 
                            placeholder = "Juan"
                            value = { formik.values.Nombre }
                            onChangeText = { formik.handleChange("Nombre") }
                            />

                        <Text style = { Styles.txtLabel } >Apellido Paterno</Text>
                        <TextInput style = { ( formik.errors.ApellidoP && formik.touched.ApellidoP ) ? Styles.errorCampo : Styles.campo } 
                            placeholder = "Perez"
                            value = { formik.values.ApellidoP }
                            onChangeText = { formik.handleChange("ApellidoP") }
                            />
                        
                        <Text style = { Styles.txtLabel } >Apellido Materno</Text>
                        <TextInput style = { ( formik.errors.ApellidoM && formik.touched.ApellidoM ) ? Styles.errorCampo : Styles.campo } 
                            placeholder = "Perez"
                            value = { formik.values.ApellidoM }
                            onChangeText = { formik.handleChange("ApellidoM") }
                            />

                        <Text style = { Styles.txtLabel } >CURP</Text>
                        <TextInput style = { ( formik.errors.CURP && formik.touched.CURP ) ? Styles.errorCampo : Styles.campo } 
                            placeholder = "PEPJ970717HTCRRN07"
                            autoCapitalize = {"characters"}
                            value = { formik.values.CURP }
                            onChangeText = { formik.handleChange("CURP") }
                            />

                        <Text style = { Styles.txtLabel } >Telefono</Text>
                        <TextInput style = { ( formik.errors.Telefono && formik.touched.Telefono ) ? Styles.errorCampo : Styles.campo } 
                            placeholder = "+52..."
                            value = { formik.values.Telefono }
                            onChangeText = { formik.handleChange("Telefono") }
                            />

                        <Text style = { Styles.txtLabel } >Correo Electronico</Text>
                        <TextInput style = { ( formik.errors.Email && formik.touched.Email ) ? Styles.errorCampo : Styles.campo } 
                            placeholder = "juan.prueba@gmail.com"
                            autoCapitalize = { "none" } 
                            value = { formik.values.Email }
                            onChangeText = { formik.handleChange("Email") }
                            />
                    </View>
                </ScrollView>
                <TouchableOpacity onPress = { formik.handleSubmit } style = { [ Styles.btnOpacity,{ marginBottom:15, marginLeft:10, marginRight:10 } ] } >
                    <Text style = { Styles.btnTexto } > Siguiente </Text>
                </TouchableOpacity>
                <Message
                    loading = { mostrarMensaje }
                    buttonText = { "Aceptar" }
                    icon =  { icono }
                    iconsource = { iconoFuente }
                    color = { azulColor }
                    loadinColor = { azulColor }
                    message = { mensaje }
                    onCancelLoad = {()=>{ setMostrarMensaje( false )}}
                    tittle = { tipoMensaje } 
                    transparent = { true }
                />
                <Loading
                    loading = { cargando }
                    loadinColor = { azulColor }
                    message = { "" }
                    onCancelLoad = {()=>{  }}
                    tittle = { "Mensaje" }
                    transparent = { true }
                />
            </View>
        </View>);
}