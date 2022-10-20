import React, { useEffect, useRef, useState } from "react";
import { 
        View, 
        TouchableOpacity, 
        Text, 
        TextInput, 
        ImageBackground, 
        StatusBar, 
        Platform,
        Image,
        TouchableWithoutFeedback,
        Keyboard,
    } from 'react-native';
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
import { FONDO, AVATAR } from '../utilities/Variables';
import { enviarTokenSuinpac } from './controller/api-controller';
import * as Notificacion from 'expo-notifications';
import * as Device from 'expo-device';
const colorEstado = { "ios": "dark-content", "android": "light-content" };
export default function Log(props: any) {
    const [cargando, setCargando] = useState(false);
    const [mensaje, setMensaje] = useState("");
    const [icono, setIcono] = useState(USER_COG[0]);
    const [fuenteIcono, setFuenteIcono] = useState(USER_COG[1]);
    const [titulo, setTitilo] = useState('Mensaje');
    const [mostrarMensaje, setMostrarMensaje] = useState(false);
    const [mostrarPrivacidad, setMostrarPrivacidad] = useState(false);
    //NOTE: para menejo de las notificaciones
    const [ FMCToken, setFMCToken ] = useState();
    const [ notificacion, setNotificacion ] = useState(false);
    const listenerNotificacion = useRef();
    const respuestaNoticicacion = useRef();
    let storage = new StorageBaches();
    let valores = {
        Curp: '',
        Password: ''
    }
    let validacion = Yup.object().shape({
        Curp: Yup.string().min(18).required('Requerido'),
        Password: Yup.string().min(4).required('Requerido')
    });
    Notificacion.setNotificationHandler({
        handleNotification: async () => ({
          shouldShowAlert: true,
          shouldPlaySound: false,
          shouldSetBadge: false,
        }),
      });
    //FIXED: verificar los permisos en app.json para ios
    useEffect(
        () => {
            (async () => {
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
                    //NOTE: Codigo que deveria funcionar con ios y android
                    let estadoGF = await Location.getForegroundPermissionsAsync();
                    //NOTE: VErificamos que el de arriba tenga permisos, si no lo solicitamos
                    if( estadoGF.status != "granted" ){
                        let { granted } =  await Location.requestForegroundPermissionsAsync();
                        setCargando(false);
                    }
                    if(Platform.OS == "android"){
                        //Solicitamos el permisos de rastreo para android
                        let estadoGB = await Location.getBackgroundPermissionsAsync();
                        if(estadoGB.status != "granted"){
                            setCargando(false);
                            let resultPB = await Location.requestBackgroundPermissionsAsync();
                            await Location.hasServicesEnabledAsync().then(async (status) => {
                                if (!status) {
                                    await Location.enableNetworkProviderAsync();
                                }
                            }).catch((error) => {
                                lanzarMensaje(error.message,"Mensaje","info","material");
                            });
                        }
                    }
   
                }
            })();
        }, []);
    
    useEffect(()=>{
        //NOTE: aqui registramos el dispositivo en FCM
            registrarParaNotificaciones();
        listenerNotificacion.current = Notificacion.addNotificationReceivedListener(nft => {setNotificacion(true)});
        respuestaNoticicacion.current = Notificacion.addNotificationResponseReceivedListener(response => {});
    },[]);

    const registrarParaNotificaciones = async () =>{
        if(! await storage.tokenDispositivoValido() ){
            if (Platform.OS === 'android') {
                await Notificacion.setNotificationChannelAsync('default', {
                  name: 'default',
                  importance: Notificacion.AndroidImportance.MAX,
                  vibrationPattern: [0, 250, 250, 250],
                  lightColor: '#FF231F7C',
                });
              }
            //Obtenemos los permisos de notificaciones
            if(Device.isDevice){
                let result =  await Notificacion.getPermissionsAsync();
                let request = Notificacion.requestPermissionsAsync();
                if(result.status == "granted"){
                    let token = (await Notificacion.getExpoPushTokenAsync()).data;
                    await enviarTokenSuinpac( token,Platform.OS ).then((data)=>{}).catch(( error )=>{});
                }
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
            <ImageBackground source={ FONDO } style={{ flex: 1 }} >
                <Formik
                    initialValues={valores}
                    validationSchema={validacion}
                    onSubmit={datos => iniciarSession(datos)}
                >
                    {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => { 
                        return <TouchableWithoutFeedback style = {{flex:1}} onPress = { Keyboard.dismiss } accessible = { false } >
                        <View style={{ flex: 1 }} >
                            <View style={{ flex: 2, padding:20 }} >
                                <View style={{ flex: 2, borderColor: "black", justifyContent: "center" }} >
                                    <View style={{ justifyContent: "center", alignItems: "center" }}  >
                                        <Image 
                                            source = {AVATAR} 
                                            resizeMode = { "stretch" }  
                                            style = {{ height:80,width:220 }}
                                        />
                                    </View>
                                </View>
                            </View>
                            <View style={{ flex: 5, flexDirection: "column",justifyContent: "center" }}>
                                <Text style={Styles.TemaLabalCampo} >CURP</Text>
                                <TextInput
                                    autoCapitalize="characters"
                                    style={(errors.Curp && touched.Curp) ? Styles.TemaCampoError : Styles.TemaCampo}
                                    placeholder="Ejemplo: XAXX010101000"
                                    onChangeText={handleChange('Curp')}
                                    value={values.Curp}
                                ></TextInput>

                                <Text style={Styles.TemaLabalCampo} >Contraseña</Text>
                                <TextInput
                                    textContentType="password"
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
                                <Text style={{ textAlign: "center", color: SuinpacRed, fontWeight: "bold" }}> SUINPAC - GRP </Text>
                            </View>
                        </View>
                        </TouchableWithoutFeedback>
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
