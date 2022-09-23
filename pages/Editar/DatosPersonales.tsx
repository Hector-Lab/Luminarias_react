import React, { useState, useEffect, useRef } from "react";
import { SafeAreaView, ScrollView, Text, ImageBackground, View, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, StatusBar } from 'react-native';
import { Avatar, Image } from 'react-native-elements';
import Styles from '../../Styles/styles';
import { Formik, useFormik, useFormikContext, validateYupSchema } from 'formik';
import * as Yup from 'yup';
import Message from '../components/modal-message';
import { azulClaro, azulColor, successColor, SuinpacRed } from "../../Styles/Color";
import { StorageBaches } from '../controller/storage-controllerBaches';
import { actualiarDatosPersonales } from '../controller/api-controller';
import Loading from "../components/modal-loading";
import { DESCONOCIDO, ERROR, OK } from "../../Styles/Iconos";
import { AVATAR } from "../../utilities/Variables";
const colorEstado = { "ios": "dark-content", "android": "light-content" };

export default function Personales(props: any) {
    let [curpValida, sertCurpValida] = useState(false);
    let [passValida, setPassValido] = useState(false);
    let [mensaje, setMensaje] = useState("");
    let [titulo, setTitulo] = useState("Mensaje");
    let [icono, setIcono] = useState("info");
    let [fuenteIcono, setFuenteIcono] = useState("material");
    let [mostrarMensaje, setMostrarMensaje] = useState(false);
    let [cargando, setCargando] = useState(true);

    let storage = new StorageBaches();
    let validacion = Yup.object().shape({
        Nombre: Yup.string().required('Requerido'),
        ApellidoP: Yup.string().required('Requerido'),
        ApellidoM: Yup.string().required('Requerido'),
        CURP: Yup.string().min(18).max(18).required('Requerido'),
        Email: Yup.string().required('Requerido').email(),
        Telefono: Yup.number().required('Requerido'),
    });
    let formik = useFormik({
        initialValues: {
            Nombre: '',
            ApellidoP: '',
            ApellidoM: '',
            CURP: '',
            Email: '',
            Telefono: '',
            Password: ''
        },
        onSubmit: (values => {
            setCargando(true);
            ActualizarDatos(values);
        }),
        validationSchema: validacion
    })
    useEffect(() => {
        //NOTE: lo cambiam
        obtenerDatosPersonales();
    }, [])
    const obtenerDatosPersonales = async () => {
        let personales = await storage.obtenerDatosPersonalesCiudadano();
        if (personales != undefined) {
            let datosPersonales = JSON.parse(personales);
            formik.setFieldValue("Nombre", datosPersonales.Nombre);
            formik.setFieldValue("ApellidoP", datosPersonales.ApellidoP);
            formik.setFieldValue("ApellidoM", datosPersonales.ApellidoM);
            formik.setFieldValue("CURP", datosPersonales.CURP);
            formik.setFieldValue("Email", datosPersonales.Email);
            formik.setFieldValue("Telefono", datosPersonales.Telefono);
        }
        setCargando(false);
    }
    let values = {}
    const ActualizarDatos = async (value: { Nombre: String, ApellidoP: String, ApellidoM: String, CURP: String, Email: String, Telefono: String, Password: String }) => {
        setPassValido(!(value.Password != "" && value.Password.length < 4));
        if (!(value.Password != "" && value.Password.length < 4)) {
            //NOTE: Enviamos los datos a la api para su actualizacion
            await actualiarDatosPersonales(value)
                .then((result) => {
                    obtenerDatosPersonales();
                    lanzarMensaje("Datos Actualizados", "Mensaje", OK[0], OK[1]);
                })
                .catch((error) => {
                    lanzarMensaje(mensaje, "Mensaje", mensaje.includes("¡Error al actualizar personales!") ? ERROR[0] : DESCONOCIDO[0], mensaje.includes("¡Error al actualizar personales!") ? ERROR[1] : DESCONOCIDO[1]);
                }).finally(() => {
                    setCargando(false);
                })
        } else {
            formik.setFieldError("Password", "Minimo 8 Caracteres");
        }
    }
    const lanzarMensaje = async (mensaje: string, titulo: string, icono: string, iconoFuente: string) => {
        setMensaje(mensaje);
        setTitulo(titulo);
        setIcono(icono);
        setFuenteIcono(iconoFuente);
        setMostrarMensaje(true);
    }
    const regresarPantalla = async () => {
        props.navigation.navigate("Perfil");
    }
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <StatusBar animated={true} barStyle={colorEstado[Platform.OS]} />
            <ImageBackground source={require('../../assets/Fondo.jpeg')} style={{ flex: 1 }} >
                <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "position" : "height"} 
                    keyboardVerticalOffset = {( Platform.OS == "ios" ? 75 :1 )} >
                    <ScrollView style={{ flexGrow: 1 }} >
                        <View style={{ justifyContent: "center", alignItems: "center", padding:20 }} >
                            <Image 
                                source = {AVATAR} 
                                resizeMode = { "stretch" }  
                                style = {{ height:80,width:220 }}
                            />
                        </View>
                        <Formik
                            initialValues={values}
                            onSubmit={formik.handleSubmit}>
                            {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => {
                                return <View>
                                    <Text style={Styles.TemaLabalCampo} >Nombre</Text>
                                    <TextInput
                                        style={(formik.errors.Nombre && formik.touched.Nombre) ? Styles.TemaCampoError : Styles.TemaCampo}
                                        placeholder="Ejemplo: Juan Perez"
                                        onChangeText={formik.handleChange("Nombre")}
                                        value={formik.values.Nombre}
                                    />

                                    <Text style={Styles.TemaLabalCampo} >Apellido Paterno</Text>
                                    <TextInput
                                        style={(formik.errors.ApellidoP && formik.touched.ApellidoP) ? Styles.TemaCampoError : Styles.TemaCampo}
                                        placeholder="Ejemplo: Juan Perez"
                                        onChangeText={formik.handleChange("ApellidoP")}
                                        value={formik.values.ApellidoP} />

                                    <Text style={Styles.TemaLabalCampo} >Apellido Materno</Text>
                                    <TextInput
                                        style={(formik.errors.ApellidoM && formik.touched.ApellidoM) ? Styles.TemaCampoError : Styles.TemaCampo}
                                        placeholder="Ejemplo: Juan Perez"
                                        onChangeText={formik.handleChange("ApellidoM")}
                                        value={formik.values.ApellidoM} />

                                    <Text style={Styles.TemaLabalCampo} >CURP</Text>
                                    <TextInput
                                        editable={false}
                                        style={(formik.errors.CURP && formik.touched.CURP) ? Styles.TemaCampoError : Styles.TemaCampo}
                                        placeholder="Ejemplo: Juan Perez"
                                        onChangeText={formik.handleChange("CURP")}
                                        value={formik.values.CURP} />
                                    <Text style={Styles.TemaLabalCampo} >Correo Electrónico</Text>
                                    <TextInput
                                        style={(formik.errors.Email && formik.touched.Email) ? Styles.TemaCampoError : Styles.TemaCampo}
                                        placeholder="Ejemplo: Juan Perez"
                                        onChangeText={formik.handleChange("Email")}
                                        value={formik.values.Email} />
                                    <Text style={Styles.TemaLabalCampo} >Telefono</Text>
                                    <TextInput
                                        style={(formik.errors.Telefono && formik.touched.Telefono) ? Styles.TemaCampoError : Styles.TemaCampo}
                                        placeholder="Ejemplo: Juan Perez"
                                        onChangeText={formik.handleChange("Telefono")}
                                        value={formik.values.Telefono} />
                                    <Text style={Styles.TemaLabalCampo} >Contraseña {!(passValida && formik.touched.Password) ? <Text style={{ color: "red" }} > { "Mínimo 4 caracteres" } </Text> : <></>} </Text>
                                    <TextInput
                                        style={(formik.errors.Password && formik.touched.Password) ? Styles.TemaCampoError : Styles.TemaCampo}
                                        placeholder="Contraseña"
                                        secureTextEntry={true}
                                        onChangeText={formik.handleChange("Password")}
                                        value={formik.values.Password} />
                                    <TouchableOpacity style={[Styles.btnGeneral, { marginTop: 10, flex: 1, marginLeft: 25, marginRight:25, backgroundColor: azulColor }]} onPress={formik.handleSubmit}>
                                        <Text style={[Styles.btnTexto, { textAlign: "center" }]} > Guardar </Text>
                                    </TouchableOpacity>
                                </View>
                            }}
                        </Formik>
                    </ScrollView>
                </KeyboardAvoidingView>
                <Message
                    transparent={true}
                    loading={mostrarMensaje}
                    loadinColor={azulColor}
                    icon={icono}
                    iconsource={fuenteIcono}
                    message={mensaje}
                    tittle={titulo}
                    buttonText={'Aceptar'}
                    color={azulColor}
                    onCancelLoad={() => { }}
                    onConfirmarLoad={() => { setMostrarMensaje(false) }}
                />
                <Loading
                    transparent={true}
                    loading={cargando}
                    tittle={"Mensaje"}
                    loadinColor={azulColor}
                    onCancelLoad={() => { setCargando(false) }}
                    message={""}
                />
            </ImageBackground>
        </SafeAreaView>
    )
}
