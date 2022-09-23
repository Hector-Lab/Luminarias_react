import React, { useState, useEffect, useRef } from "react";
import { SafeAreaView, ScrollView, Text, ImageBackground, View, TextInput, TouchableOpacity, StatusBar, Platform, KeyboardAvoidingView } from 'react-native';
import Styles from '../../Styles/styles';
import { Formik, useFormik } from 'formik';
import * as Yup from 'yup';
import { StorageBaches } from '../controller/storage-controllerBaches';
import { obtenerDatosDomicilio, ActualizarDatosDomiclio } from '../controller/api-controller';
import Message from '../components/modal-message';
import Loading from '../components/modal-loading';
import { azulColor, successColor } from "../../Styles/Color";
import { OK, DESCONOCIDO, ERROR } from '../../Styles/Iconos';
import { AVATAR } from "../../utilities/Variables";
import { Image } from "react-native-elements";

const colorEstado = { "ios": "dark-content", "android": "light-content" };
export default function EditarDomicilio(props: any) {
    const [cargando, setCargando] = useState(false);
    const [icono, setIcono] = useState('info');
    const [fuenteIcono, setFuenteIcono] = useState('materior');
    const [mensaje, setMensaje] = useState('Cargando...');
    const [mostrarMensaje, setMostrarMensaje] = useState(false);
    const [titulo, setTittulo] = useState(String);

    useEffect(() => {
        setCargando(true);
        ObtenerDatosDomiclio();
    }, []);
    let validacion = Yup.object().shape({
        Localidad: Yup.string().required(),
        Calle: Yup.string().required(),
        Numero: Yup.number().required(),
        Colonia: Yup.string().required(),
        CodigoPostal: Yup.number().required()
    });
    let formik = useFormik({
        initialValues: {
            Localidad: '',
            Calle: '',
            Numero: '',
            Colonia: '',
            CodigoPostal: ''
        },
        onSubmit: (values => { guardarDatosDomiclio(values) }),
        validationSchema: validacion
    });
    const SiguientePaso = () => {
        props.navigation.navigate("Contactos");
    }
    let Storage = new StorageBaches();
    let valores = {
        Localidad: '',
        Calle: '',
        Numero: '',
        Colonia: '',
        CodigoPostal: ''
    };
    const GuardarDatosLocal = async (datos) => {
        await Storage.datosDomicilioPreRegistro(JSON.stringify(datos)).then(() => { SiguientePaso() })
    }
    const ObtenerDatosDomiclio = async () => {
        obtenerDatosDomicilio()
            .then((datos) => {
                formik.setFieldValue('Localidad', datos.Localidad);
                formik.setFieldValue('Calle', datos.Calle);
                formik.setFieldValue('Numero', datos.Numero);
                formik.setFieldValue('Colonia', datos.Colonia);
                formik.setFieldValue('CodigoPostal', datos.CodigoPostal);
            })
            .catch((error) => {
                console.log(error);
            }).finally(() => {
                setCargando(false);
            })
        console.log()
    }
    const guardarDatosDomiclio = async (domicilio) => {
        let jsonData = JSON.stringify(domicilio);
        await ActualizarDatosDomiclio(jsonData)
            .then((respuesta) => {
                lanzarMensaje("Datos Actualizados", "Mensaje", OK[0], OK[1]);
            })
            .catch((error) => {
                let mensaje = String(error.message);
                lanzarMensaje(mensaje, "Mensaje", mensaje.includes("¡Error al acutlizar el domicilio!") ? ERROR[0] : DESCONOCIDO[0], mensaje.includes("¡Error al acutlizar el domicilio!") ? ERROR[1] : DESCONOCIDO[1]);
            })
    }
    const lanzarMensaje = async (mensaje: string, titulo: string, icono: string, iconoFuente: string) => {
        setMensaje(mensaje);
        setTittulo(titulo);
        setIcono(icono);
        setFuenteIcono(iconoFuente);
        setMostrarMensaje(true);
    }
    const regresarMensaje = async () => {
        props.navigation.navigate("Perfil");
    }
    return (
        <SafeAreaView style={{ flex: 1 }} >
            <StatusBar animated={true} barStyle={colorEstado[Platform.OS]} />
            <ImageBackground source={require('../../assets/Fondo.jpeg')} style={{ flex: 1 }} >
                <KeyboardAvoidingView 
                    behavior = { "padding" }
                    style = {{ flex:1 }}
                    keyboardVerticalOffset = { Platform.OS == "ios" ? 70 : 0 }>
                    <ScrollView style={{ flexGrow: 1 }} >
                    <View style={{ justifyContent: "center", alignItems: "center", padding:20 }}  >
                        <Image 
                            source = {AVATAR} 
                            resizeMode = { "stretch" }  
                            style = {{ height:80,width:220 }}
                            />
                        </View>
                        <Formik
                            initialValues={valores}
                            onSubmit={datos => GuardarDatosLocal(datos)}
                            validationSchema={validacion}
                        >
                            {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => {
                                return <View>
                                    <Text style={Styles.TemaLabalCampo} >Localidad</Text>
                                    <TextInput
                                        style={(formik.errors.Localidad && formik.touched.Localidad) ? Styles.TemaCampoError : Styles.TemaCampo}
                                        placeholder="Ejemplo: Juan Perez"
                                        onChangeText={formik.handleChange('Localidad')}
                                        value={formik.values.Localidad} />
                                    <Text style={Styles.TemaLabalCampo} >Calle</Text>
                                    <TextInput
                                        style={(formik.errors.Calle && formik.touched.Calle) ? Styles.TemaCampoError : Styles.TemaCampo}
                                        placeholder="Ejemplo: Avenida Violetas"
                                        onChangeText={formik.handleChange('Calle')}
                                        value={formik.values.Calle} />
                                    <Text style={Styles.TemaLabalCampo} >Numero {(formik.errors.Numero && formik.touched.Numero && formik.values.Numero != "") ? <Text style={{ color: "red" }} > No valido </Text> : <></>} </Text>
                                    <TextInput
                                        style={(formik.errors.Numero && formik.touched.Numero) ? Styles.TemaCampoError : Styles.TemaCampo}
                                        placeholder="Ejemplo: 20"
                                        onChangeText={formik.handleChange('Numero')}
                                        value={formik.values.Numero} />
                                    <Text style={Styles.TemaLabalCampo} >Colonia</Text>
                                    <TextInput
                                        style={(formik.errors.Colonia && formik.touched.Colonia) ? Styles.TemaCampoError : Styles.TemaCampo}
                                        placeholder="Ejemplo: Colinas del Lago"
                                        onChangeText={formik.handleChange('Colonia')}
                                        value={formik.values.Colonia} />
                                    <Text style={Styles.TemaLabalCampo} >Codigo Postal {(formik.errors.CodigoPostal && formik.touched.CodigoPostal && formik.values.CodigoPostal != "") ? <Text style={{ color: "red" }} > No valido </Text> : <></>} </Text>
                                    <TextInput
                                        style={(formik.errors.CodigoPostal && formik.touched.CodigoPostal) ? Styles.TemaCampoError : Styles.TemaCampo}
                                        placeholder="Ejemplo: 54716"
                                        onChangeText={formik.handleChange('CodigoPostal')}
                                        value={formik.values.CodigoPostal} />
                                </View>
                            }}
                        </Formik>
                        <TouchableOpacity style={[Styles.btnGeneral, { marginTop: 10, flex: 1, marginRight: 25 , marginLeft:25 , backgroundColor: azulColor }]} onPress={formik.handleSubmit}  >
                            <Text style={[Styles.btnTexto, { textAlign: "center" }]} > Guardar </Text>
                        </TouchableOpacity>
                    </ScrollView>
                </KeyboardAvoidingView>
                <Loading
                    loadinColor={azulColor}
                    loading={cargando}
                    message={""}
                    onCancelLoad={() => { }}
                    tittle={"Mensaje"}
                    transparent={true}
                />
                <Message
                    buttonText="Aceptar"
                    color={azulColor}
                    icon={icono}
                    iconsource={fuenteIcono}
                    loadinColor={azulColor}
                    loading={mostrarMensaje}
                    message={mensaje}
                    tittle={titulo == "" ? "Mensaje" : titulo}
                    transparent={true}
                    buttonCancel={false}
                    onCancelLoad={() => { }}
                    onConfirmarLoad={() => { setMostrarMensaje(false) }}

                />
            </ImageBackground>
        </SafeAreaView>
    )
}
