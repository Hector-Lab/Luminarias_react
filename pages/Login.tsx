import React, { useEffect, useState } from "react";
import { View, TouchableOpacity, Text, TextInput, Linking, ImageBackground, StatusBar, Platform, Pressable } from 'react-native';
import { Avatar } from 'react-native-elements';
import { azulColor, SuinpacRed } from "../Styles/Color";
import Styles from '../Styles/styles';
import { StorageBaches } from './controller/storage-controllerBaches';
import { CommonActions } from '@react-navigation/native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { IniciarSession } from './controller/api-controller';
import Loading from './components/modal-loading';
import Message from './components/modal-message';
import { USER_COG, WIFI_OFF, DESCONOCIDO, APPSETTINGS } from '../Styles/Iconos';
import * as Location from 'expo-location';
import Privacidad from './components/modal-privacidad';
import { Camera } from 'expo-camera';
const colorEstado = { "ios": "dark-content", "android": "light-content" };
export default function Log(props: any) {
    const [cargando, setCargando] = useState(false);
    const [mensaje, setMensaje] = useState("");
    const [icono, setIcono] = useState(USER_COG[0]);
    const [fuenteIcono, setFuenteIcono] = useState(USER_COG[1]);
    const [titulo, setTitilo] = useState('Mensaje');
    const [mostrarMensaje, setMostrarMensaje] = useState(false);
    const [mostrarPrivacidad, setMostrarPrivacidad] = useState(false);
    let storage = new StorageBaches();
    let valores = {
        Curp: '',
        Password: ''
    }
    let validacion = Yup.object().shape({
        Curp: Yup.string().min(18).required('Requerido'),
        Password: Yup.string().min(8).required('Requerido')
    });
    useEffect(
        () => {
            (async () => {
                //NOTE:  Preguntamos por los permisos de la app
                let { granted } = await Location.requestForegroundPermissionsAsync();
                //NOTE: Pedimos permisos de uso en el fondo
                if (granted) {
                    let { status } = await Location.requestBackgroundPermissionsAsync();
                    if (status == "granted") {
                        //NOTE: intentamos encender la localizacion del dispositivo
                    }
                }
                await Location.hasServicesEnabledAsync().then(async (status) => {
                    if (!status) {
                        await Location.enableNetworkProviderAsync();
                    }
                }).catch((error) => {
                    console.log(error);
                });
                //NOTE: pedimos permisos de la camara
                let { status } = await Camera.requestCameraPermissionsAsync();
                verificandoSession();
            })();
        }, [])
    const verificandoSession = async () => {
        //Antes de todo esto se revisa si acepto los terminos y condiciones
        let acepto = await storage.getCondicionesPrivacidad();
        if ((acepto == null) || (!acepto)) {            
            setMostrarPrivacidad(true);
        } else {
            if (await storage.verificarDatosCiudadano()) {
                setCargando(false);
                props.navigation.dispatch(
                    CommonActions.reset({
                        index: 1,
                        routes: [{ name: 'Menu' }]
                    })
                );
            } else {
                setCargando(false);
            }
        }
    }
    const RegistrarUsuario = () => {
        //NOTE: nos vamos al formaulario de registro
        props.navigation.navigate("Personales");
    }
    const iniciarSession = async (datos) => {
        setCargando(true);
        await IniciarSession(datos)
            .then(() => {
                setTimeout(()=>{
                    setCargando(false);
                },400);
                props.navigation.dispatch(
                    CommonActions.reset({
                        index: 1,
                        routes: [{ name: 'Menu' }]
                    })
                );
            }).catch((error) => {
                //lanzarMensaje("Mensaje", error.message, APPSETTINGS[0], APPSETTINGS[1]);
                if(String(error).includes("!Sin acceso a internet¡")){
                    lanzarMensaje("Mensaje",error.message,WIFI_OFF[0],WIFI_OFF[1]);
                }else if (String(error).includes("¡Error desconocido!")){
                    lanzarMensaje("Mensaje",error.message,DESCONOCIDO[0],DESCONOCIDO[1]);
                }else if(String(error).includes("Servicio en Mantenimiento")){
                    lanzarMensaje("Mensaje",error.message,APPSETTINGS[0],APPSETTINGS[1]);
                }else{
                    lanzarMensaje("Mensaje","CURP y/o contraseña incorrecta\nFavor de revisar sus credenciales",USER_COG[0],USER_COG[1]);
                }
                setCargando(false);
            })
    }
    const lanzarMensaje = (titulo, mensaje, icono, fuenteIcono) => {
        setTitilo(titulo);
        setMensaje(mensaje);
        setIcono(icono);
        setFuenteIcono(fuenteIcono);
        setMostrarMensaje(true);
    }
    const guardarProvacidad = () => {
        storage.setCondicionesPrivacidad("1");
        setMostrarPrivacidad(false);
    }
    return (
        <View style={{ flex: 1 }} >
            <StatusBar animated={true} barStyle={colorEstado[Platform.OS]} />
            <ImageBackground source={require('../assets/Fondo.jpeg')} style={{ flex: 1 }} >
                <Formik
                    initialValues={valores}
                    validationSchema={validacion}
                    onSubmit={datos => iniciarSession(datos)}
                >
                    {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => {
                        return <View style={{ flex: 1 }} >
                            <View style={{ flex: 2 }} >
                                <View style={{ flex: 2, borderColor: "black", justifyContent: "center" }} >
                                    <View style={{ justifyContent: "center", alignItems: "center" }}  >
                                        <Avatar
                                            avatarStyle={{}}
                                            rounded
                                            imageProps={{ resizeMode: "contain" }}
                                            size="xlarge"
                                            containerStyle={{ height: 120, width: 220 }}
                                            source={require("../assets/banner.png")}
                                        />
                                    </View>
                                </View>
                            </View>
                            <View style={{ flex: 5, flexDirection: "column", justifyContent: "center" }}>
                                <Text style={Styles.TemaLabalCampo} >CURP</Text>
                                <TextInput
                                    autoCapitalize="characters"
                                    style={(errors.Curp && touched.Curp) ? Styles.TemaCampoError : Styles.TemaCampo}
                                    placeholder="Ejemplo: Juan Perez"
                                    onChangeText={handleChange('Curp')}
                                    value={values.Curp}
                                ></TextInput>

                                <Text style={Styles.TemaLabalCampo} >Contraseña</Text>
                                <TextInput
                                    textContentType="password"
                                    keyboardAppearance="dark"
                                    style={(errors.Password && touched.Password) ? Styles.TemaCampoError : Styles.TemaCampo}
                                    secureTextEntry={true}
                                    placeholder="*********"
                                    onChangeText={handleChange('Password')}
                                    value={values.Password}
                                ></TextInput>

                                <TouchableOpacity style={[Styles.btnGeneral, { marginTop: 20 }]} onPress={handleSubmit} >
                                    <Text style={[Styles.btnTexto, { textAlign: "center" }]} > Ingresar </Text>
                                </TouchableOpacity>
                                <Text style={[Styles.textoSubrayado]} onPress={RegistrarUsuario} > Registrate </Text>
                            </View>
                            <View style={{ flex: 3 }} ></View>
                            <View style={{ flex: 1, borderColor: "red", justifyContent: "center" }}>
                                <Text style={{ textAlign: "center", color: SuinpacRed, fontWeight: "bold" }}> SUINPAC </Text>
                            </View>
                        </View>
                    }}
                </Formik>
                <Loading
                    loading={cargando}
                    message={""}
                    loadinColor={azulColor}
                    onCancelLoad={() => { setCargando(false) }}
                    tittle={""}
                    transparent={true}
                />
                <Message
                    loading={mostrarMensaje}
                    tittle={titulo}
                    buttonText={"Aceptar"}
                    color={azulColor}
                    icon={icono}
                    iconsource={fuenteIcono}
                    loadinColor={azulColor}
                    message={mensaje}
                    onCancelLoad={() => { setMostrarMensaje(false) }}
                    onConfirmarLoad={() => { setMostrarMensaje(false) }}
                    transparent={true}
                />
                <Privacidad
                    visible={mostrarPrivacidad}
                    onAccept={guardarProvacidad}
                    plataforma={Platform.OS}
                />
            </ImageBackground>
        </View>);

}
