
import React, { useEffect, useState } from "react";
import { View, TouchableOpacity, TextInput, Text, Platform, ScrollView, Pressable } from  'react-native';
import { StatusBar } from  'expo-status-bar';
import Styles from "../../Styles/styles";
import { Icon,Tooltip } from "react-native-elements";
import { LOCATION,LOCATIONOFF } from '../../Styles/Iconos';
import { azulColor } from "../../Styles/Color";
import { useFormik } from 'formik';
import { CordenadasActualesNumerico, ObtenerDireccionActual } from '../../utilities/utilities';
import { RegistrarCiudadano } from '../controller/api-controller';
import * as Location from  'expo-location';
import * as Yup from 'yup';
import Message from '../components/modal-message';
import Loading from  '../components/modal-loading';


const validacion  = Yup.object().shape({
    Localidad: Yup.string().required("Localidad Requerido"),
    Calle: Yup.string().required("Calle Requerido"),
    Numero: Yup.string().required("Numero Requerido"),
    Colonia: Yup.string().required("Colonia Requerido"),
    CodigoPostal: Yup.string().required("Codigo Postal Requerido")
});

export default function Domicilio(props: any) {    
    const [ cargando, setCargando ] = useState( false );
    const [ mostrarMensaje, setMostrarMensaje ] = useState( false );
    const [ mensaje, setMensaje ] = useState(String);
    const [ icono, setIcono ] = useState(String);
    const [ iconoFuente, setIconoFuente ] = useState(String);
    const [ tipoMensaje, setTipoMensaje ] = useState(String);
    const formik = useFormik({
        initialValues:{
            Localidad: "",
            Calle: "",
            Numero: "",
            Colonia: "",
            CodigoPostal: "",
        },
        onSubmit: (values)=>{
            enviarDatos( values );
        },
        validationSchema: validacion
    });
    const [ mostrarTooltip, setMostrarTooltip ] = useState(false);
    const calcularUbicacionActual = async () =>{
        //NOTE: obtenemos las coordenadas
        setCargando( true );
        let { status } = await Location.getForegroundPermissionsAsync();
        if( status != "granted" ){
            //NOTE: Solicitamos los permisos de ubicacion
            await solicitarPermisos();
        }else{
            let coords = await CordenadasActualesNumerico();
            let direccion = await ObtenerDireccionActual(coords);
            AsignarDatos(direccion);
        }
        //console.log(await solicitarPermisosUbicacion());
    }
    const solicitarPermisos = async (  ) =>{
        let { status } = await Location.requestForegroundPermissionsAsync();
        if( status == "granted"){
            //NOTE: solicitamos obtenemos las coordenadas 
            let coords = await CordenadasActualesNumerico();
            let direccion = await ObtenerDireccionActual(coords);
            AsignarDatos(direccion);
        }else{
            lanzarMensaje("Permisos denegados",LOCATIONOFF[0],LOCATIONOFF[1]);
        }
    }
    const AsignarDatos = async( direccion:{Calle:string,Codigo:string,Colonia:string,Localidad:string,Numero:string}) =>{
        console.log(direccion);
        formik.setFieldValue("Calle",direccion.Calle);
        formik.setFieldValue("CodigoPostal",direccion.Codigo);
        formik.setFieldValue("Colonia",direccion.Colonia);
        formik.setFieldValue("Localidad",direccion.Localidad);
        formik.setFieldValue("Numero",direccion.Numero);
        setCargando( false );
    }
    const lanzarMensaje = ( mensaje: string, icon:string, fuente:string,tipo ="Mensaje" ) =>{
        setMensaje(mensaje);
        setIcono(icon);
        setIconoFuente( fuente );
        setTipoMensaje( tipo );
        setMostrarMensaje(true);
    }
    const enviarDatos = async ( direccion ) =>{
        await RegistrarCiudadano(JSON.stringify(direccion))
        .then(( result )=>{
            //console.log(result)
        })
        .catch(( error )=>{
            //console.log( error );
        })
    }
    return(
        <View style = {{ flex:1 }} >
            <StatusBar style = { Platform.OS == "ios" ? "dark" : "auto" }/>
            <View style = {{ flex:1 ,marginTop:10, padding:15 }} >
                <ScrollView style = {{flexGrow:1}}>
                    <View style = {{flexDirection:"row",flex:1}} >
                        <Text style = { [Styles.txtSubtitulo,{flex:5}] } > Paso 1: Datos Personales</Text>
                        <Tooltip overlayColor = {azulColor+"34"} visible = { mostrarTooltip } onClose = { () =>{ setMostrarTooltip(false) } }  popover = {<Pressable ><Text>Obtener Ubicación</Text></Pressable>} withPointer = { true }  >
                            <Icon onPress = { calcularUbicacionActual } onLongPress = { ()=>{ setMostrarTooltip(true) } } color = "gray" name = { LOCATION[0] } type = { LOCATION[1]} ></Icon>
                        </Tooltip>
                    </View>
                    {/**NOTE: Seccion de  formulario para el registro  */}
                    <Text style = { [Styles.txtLabel,{marginTop:20}] } >Localidad</Text>
                    <TextInput style = { ( formik.errors.Localidad && formik.touched.Localidad  ) ? Styles.errorCampo : Styles.campo } 
                        placeholder = "Zihuatanejo"
                        value = { formik.values.Localidad }
                        onChangeText = { formik.handleChange("Localidad") }
                        />

                    <Text style = { Styles.txtLabel } >Calle</Text>
                    <TextInput style = { ( formik.errors.Localidad  && formik.touched.Localidad ) ? Styles.errorCampo : Styles.campo } 
                        placeholder = "C. Mar Rojo"
                        value = { formik.values.Calle }
                        onChangeText = { formik.handleChange("Calle") }
                        />

                    <Text style = { Styles.txtLabel } >Numero</Text>
                    <TextInput style = { ( formik.errors.Numero && formik.touched.Numero ) ? Styles.errorCampo : Styles.campo } 
                        placeholder = "16"
                        value = { formik.values.Numero }
                        onChangeText = { formik.handleChange("Numero") }
                        />

                    <Text style = { Styles.txtLabel } >Colonia</Text>
                    <TextInput style = { ( formik.errors.Colonia && formik.touched.Colonia ) ? Styles.errorCampo : Styles.campo } 
                        placeholder = "El Hujal"
                        value = { formik.values.Colonia }
                        onChangeText = { formik.handleChange("Colonia") }
                    />

                    <Text style = { Styles.txtLabel } >Codigo Postal</Text>
                    <TextInput style = { ( formik.errors.CodigoPostal && formik.touched.CodigoPostal ) ? Styles.errorCampo : Styles.campo } 
                        placeholder = "40897"
                        value = { formik.values.CodigoPostal }
                        onChangeText = { formik.handleChange("CodigoPostal") }
                        />
                </ScrollView>
            </View>
            <TouchableOpacity onPress = { formik.handleSubmit } style = { [ Styles.btnOpacity,{ marginBottom:15, marginLeft:10, marginRight:10 } ] } >
                <Text style = { Styles.btnTexto } > Registrar </Text>
            </TouchableOpacity>
            <Message
                loading = { mostrarMensaje } 
                buttonText = { "Aceptar" }
                color = { azulColor }
                icon = { icono }
                iconsource = { iconoFuente }
                loadinColor = { azulColor }
                message = { mensaje }
                onCancelLoad = { () =>{ setMostrarMensaje( false ) } }
                tittle = { "Mensaje" }
                transparent = { true }
            />
            <Loading 
                loading = { cargando }
                loadinColor = { azulColor }
                message = { "Cargando..." }
                onCancelLoad = { () => { setCargando( false ) }}
                tittle = { "Cargando" }
                transparent = { true }
            />
        </View>
    );
}