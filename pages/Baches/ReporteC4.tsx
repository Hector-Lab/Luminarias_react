import React, { useState, useEffect } from "react";
import { 
  ScrollView, 
  TextInput, 
  TouchableOpacity, 
  View, 
  SafeAreaView, 
  Linking, 
  ActivityIndicator, 
  StatusBar, 
  Platform, 
  ImageBackground,
  Image,
  KeyboardAvoidingView
} from "react-native";
import { Icon, Text } from "react-native-elements";
import MapView from "react-native-maps";
import * as Location from 'expo-location';
import { Marker } from 'react-native-maps';
import { ObtenerDireccionActual, CordenadasActualesNumerico } from "../../utilities/utilities";
import { Camera } from "expo-camera";
//NOTE:  ccomponentes importados desde la carpeta components
import { CAMERA, ERROR, OK, PREVIEW } from '../../Styles/Iconos';
import Loading from '../components/modal-loading';
import Message from '../components/modal-message';
import { BlueColor, DarkPrimaryColor } from "../../Styles/BachesColor";
import { azulColor, iconColorBlue, SuinpacRed, torchButton } from "../../Styles/Color";
import ImageView from "react-native-image-viewing";
import { GuardarReporteC4 } from "../controller/api-controller";
import { CLIENTE,AVATAR,FONDO } from '../../utilities/Variables';
import * as ImagePicker from 'expo-image-picker';
import Style from '../../Styles/styles';
const colorEstado = { "ios": "dark-content", "android": "light-content" };

export default function ReporteC4(props: any) {
  const [Nombre, setNombre] = useState(String);
  const [Telefono, setTelefono] = useState(String);
  const [Problema, setProblema] = useState(String);
  const [Locacion, setLocacion] = useState(Object);
  const [mapaCargado, SetMapaCargado] = useState(Boolean);
  const [direccion, setDireccion] = useState(Object);
  //INDEV: parte para el arreglo de fotos
  const [arregloFotos, setArregloFotos] = useState([]);
  //NOTE:  mmanejador de la camara
  const [cameraPermissions, setCameraPermision] = useState(false);
  const [flashOn, setFlashOn] = useState(false);
  const [indiceGaleria, setIndiceGaleria] = useState(0);
  //NOTE: manejador de mensajes para la aplicacion
  const [mensaje, setMensaje] = useState(String);
  const [tipoMensaje, setTipoMensaje] = useState(String);
  const [iconoMensaje, setIconoMensaje] = useState(String);
  const [iconoFuente, setIconoFuente] = useState(String);
  const [mostraMensaje, setMonstrarMensaje] = useState(Boolean);
  const [InterfazError, setInterfazError] = useState(String);
  //NOTE: modal de evidencias
  const [mostraModalEvidencia, setMostraModalEvidencia] = useState(Boolean);
  const [cargando, setCargando] = useState(true);
  //NOTE: verificacion de permisos
  const [ permisoUbicacion, setPermisoUbicacion ] = useState(false);
  const [ permisoCamara, setPermisoCarama ] = useState(true);

  let camera: Camera;
  useEffect(() => {
    (async () => {
      //NOTE: veririficamos los permisos para obtener la localizacion de la app ( con soporte para ios )
      let requestPerm = await Location.getForegroundPermissionsAsync();
      setPermisoUbicacion(requestPerm.status == "granted");
      if( requestPerm.status != "granted" ){
        let { status } = await Location.requestForegroundPermissionsAsync(); //NOTE: en caso de que lleguen aqui son acceso
        if( status == "denied"){  
          lanzarMensaje("MAC - Z requiere el uso de su ubicación","Mensaje","info","material",azulColor);
          setCargando(false);
        }else{
          setPermisoUbicacion(true);
          obtenerCoordenadasActuales();
        }
      }else{
        obtenerCoordenadasActuales();
      }
    })();
  }, []);
  useEffect(() => {
    (async () => {
      SetMapaCargado(true);
    });

  }, [Locacion]);
  const obtenerCoordenadasActuales = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setMensaje('Permission to access location was denied');
      return;
    }
    let location = await Location.getCurrentPositionAsync();
    setLocacion(location);
    let DireccionActual = JSON.parse(await ObtenerDireccionActual(location.coords));
    let formatoDireccion = {
      Estado: DireccionActual.region,
      Ciudad: DireccionActual.city,
      Colonia: DireccionActual.district,
      Calle: DireccionActual.street,
      CodigoPostal: DireccionActual.postalCode
    };
    setDireccion(formatoDireccion);
    setCargando(false);
  }
  //INDEV: metodos para la nuefa funcion de la camara
  const obtenerPermisosCamara = async () => {
    let cameraPermiso = await ImagePicker.getCameraPermissionsAsync();
    setPermisoCarama(cameraPermiso.status == "granted");
    if( cameraPermiso.status != "granted" ){
      let { status } = await ImagePicker.requestCameraPermissionsAsync();
      if( status == "denied" ){
        lanzarMensaje("MAC - Z requiere permisos para usar la cámara","Mensaje","info","material",azulColor);
        setCargando(false);
      }else{
        setPermisoCarama(true);
        capturarImagen();
      }
    }else{
      capturarImagen();
    }
  }
  const capturarImagen = async () => {
    let imageResult = await ImagePicker.launchCameraAsync({
      presentationStyle:0,
      base64:true,
      quality:.5,
      allowsEditing:false
    });
    if(!imageResult.cancelled){
      setArregloFotos((arregloFotos) => [...arregloFotos, imageResult]);
    }
  }
  const existeEvidencia = async () => {
    if (arregloFotos.length > 0) {
      setMostraModalEvidencia(true);
    } else {
      setMensaje("No se encontraron evidencias");
      setTipoMensaje("Mensaje");
      setIconoMensaje(CAMERA[0]);
      setIconoFuente(CAMERA[1]);
      setMonstrarMensaje(true);
    }
  }
  const verificarDatosReporte = () => {
    setCargando(true);
    if (validarEspeciales()) {
      let errores = "";
      Locacion != null ? "" : errores += "L,";
      arregloFotos.length >= 0 ? GuardarReporte() : lanzarMensaje("¡Favor de verificar los campos requeridos!", "Mensaje de Error", PREVIEW[0], PREVIEW[1]);
    }else{
      setMensaje("Caracteres no validos\n^+=-[]\\\'/{}|\"<>");
      setIconoFuente(ERROR[1]);
      setIconoMensaje(ERROR[0]);
      setTipoMensaje("Mensaje");
      setMonstrarMensaje(true);
      setCargando(false)
    }
  }
  const GuardarReporte = async () => {
    //INDEV: reunimos los datos del reporte
    //NOTE: recorremos el reporte 
    let encodeFotos = new Array();
    arregloFotos.map((imagen) => {encodeFotos.push("data:image/jpeg;base64," + imagen.base64);});
    let datosReposte = {
      'Cliente': CLIENTE,
      'Nombre': Nombre,
      'Telefono': Telefono,
      'Problema': Problema,
      'Evidencia': encodeFotos,
      'Locacion': JSON.stringify(Locacion.coords),
      'Direccion': JSON.stringify(direccion)
    }
    await GuardarReporteC4(datosReposte).
      then((MensajeGuardado) => {
        
        if (!permisoUbicacion)
          console.log( "Permiso de ubicacion" );
        if(!permisoCamara)
          console.log( "Permiso de camara" );

        lanzarMensaje(MensajeGuardado, "Mensaje Exitoso", OK[0], OK[1]);
        limpiarPantalla();
      }).
      catch((MensajeError) => {
        lanzarMensaje(MensajeError, "Mensaje de Error", ERROR[0], ERROR[1])
      }).finally(() => {
        setCargando(false);
      })
  }
  const lanzarMensaje = (msj: string, tMensaje: string, mIcono: string, mFuenteIcono: string, colorIcono = BlueColor) => {
    setTipoMensaje(tMensaje);
    setMensaje(msj);
    setIconoMensaje(mIcono);
    setIconoFuente(mFuenteIcono);
    setMonstrarMensaje(true);
  }
  const limpiarPantalla = () => {
    setNombre("");
    setTelefono("");
    setProblema("");
    setArregloFotos([]);
  }
  const validarEspeciales = () => {
    var iChars = "^+=-[]\\\'/{}|\"<>";
    let valido = true;
    //Validamos los datos de la referencia
    for (let indexEspeciales = 0; indexEspeciales < iChars.length; indexEspeciales++) {
      for (let indexTexto = 0; indexTexto < Nombre.length; indexTexto++) {
        if (iChars[indexEspeciales] == Nombre[indexTexto]) {
          valido = false;
          break;
        }
      }
    }
    for (let indexEspeciales = 0; indexEspeciales < iChars.length; indexEspeciales++) {
      for (let indexTexto = 0; indexTexto < Telefono.length; indexTexto++) {
        if (iChars[indexEspeciales] == Telefono[indexTexto]) {
          valido = false;
          break;
        }
      }
    }
    for (let indexEspeciales = 0; indexEspeciales < iChars.length; indexEspeciales++) {
      for (let indexTexto = 0; indexTexto < Problema.length; indexTexto++) {
        if (iChars[indexEspeciales] == Problema[indexTexto]) {
          valido = false;
          break;
        }
      }
    }
    return valido;
  }
  return (
    <SafeAreaView style={{ flex: 1 }} >
      <StatusBar animated={true} barStyle={colorEstado[Platform.OS]} />
      <ImageBackground source={ FONDO } style={{ flex: 1, padding:5 }} >
        <KeyboardAvoidingView 
          behavior = {Platform.OS == "ios" ? "height" : "height"}
          style = {{ flex:1 }}
          >
          <ScrollView contentContainerStyle={{ flexGrow: 1 }} >
              <View style={{ justifyContent: "center", alignItems: "center", padding:20 }}  >
                <Image 
                  source = {AVATAR} 
                  resizeMode = { "stretch" }  
                  style = {{ height:80,width:220 }}
                />
              </View>
              <View style={{ flex: 6 }}>
                <View>
                  <Text style={{ marginBottom: 5, marginTop: 10, marginLeft: 15, marginRight: 15, color: "black", fontWeight: "bold", justifyContent: "center", alignItems: "center" }}>Nombre</Text>
                  <TextInput
                    placeholder="Ejemplo: Juan Perez"
                    keyboardType="default"
                    value={Nombre}
                    onChangeText={text => { setNombre(text); }}
                    style={[Style.TemaCampo, InterfazError.includes('N,') ? { borderColor: "red" } : { borderColor: "black" }]}
                  />
                </View>
                <View>
                  <Text style={{ marginBottom: 5, marginTop: 10, marginLeft: 15, marginRight: 15, color: "black", fontWeight: "bold", justifyContent: "center", alignItems: "center" }}>Teléfono</Text>
                  <TextInput
                    placeholder="Ejemplo: 7474879912"
                    //maxLength={ 50 }
                    keyboardType="number-pad"
                    value={Telefono}
                    onChangeText={text => { setTelefono(text); }}
                    style={[Style.TemaCampo, InterfazError.includes('T,') ? { borderColor: "red" } : { borderColor: "black" }]}
                  />
                </View>
                <View>
                  <Text style={{ marginBottom: 5, marginTop: 10, marginLeft: 15, marginRight: 15, color: "black", fontWeight: "bold", justifyContent: "center", alignItems: "center" }}>Problema</Text>
                  <TextInput
                    numberOfLines={5}
                    placeholder="Sea Breve en su Descripción"
                    //maxLength={ 50 }
                    keyboardType="default"
                    value={Problema}
                    onChangeText={text => { setProblema(text); }}

                    style={[Style.TemaCampo, InterfazError.includes('P,') ? { borderColor: "red" } : { borderColor: "black" }]}
                  />
                </View>
                <View style={{ paddingLeft: 20, paddingRight: 20 }} >
                  {/* INDEV: mostramos un boton para las evidencias */}
                  <Text style={{ marginBottom: 10, marginTop: 10, marginLeft: -5, marginRight: 15, color: "black", fontWeight: "bold", justifyContent: "center", alignItems: "center" }}>Foto Evidencia (Opcional)</Text>
                  <View style={{ flex: 1, flexDirection: "row" }} >
                    <TouchableOpacity style={[InterfazError.includes('G,') ? { borderColor: "red", borderWidth: 1 } : { borderColor: "black", borderWidth: 0 }, { flex: 4, backgroundColor: "#104971", borderRadius: 5, padding: 10, marginBottom: 10 }]} onPress = { obtenerPermisosCamara }>
                      <Text style={{ color: "white", textAlign: "center" }}> Capturar Evidencia  </Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ flex: 1, borderRadius: 5, padding: 10, marginBottom: 10, marginLeft: 20, borderWidth: 1, borderColor: BlueColor }} onPress={existeEvidencia}>
                      <Icon name={PREVIEW[0]} tvParallaxProperties color={BlueColor} type={PREVIEW[1]}></Icon>
                    </TouchableOpacity>
                  </View>
                </View>
                <View>
                  <Text style={{ color: "black", fontWeight: "bold", marginLeft: 15 }}>Ubicación</Text>
                  <View style={[InterfazError.includes("L,") ? { borderColor: "red" } : { borderColor: "black" }, { margin: 15, borderWidth: 1, elevation: 7, marginTop: 5, marginRight: 25, marginLeft: 25 }]} >
                    <View style={{ backgroundColor: "lightgray", height: 200 }} >
                      {
                        (Locacion.coords != undefined) ?
                          <MapView style={{ height: 200 }}
                            initialRegion={{
                              latitude: Locacion.coords.latitude,
                              longitude: Locacion.coords.longitude,
                              latitudeDelta: Locacion.coords.latitudeDelta == null ? 0 : Locacion.coords.latitudeDelta,
                              longitudeDelta: Locacion.coords.longitudeDelta == null ? 0 : Locacion.coords.longitudeDelta
                            }}
                            region={{
                              latitude: Locacion.coords.latitude,
                              longitude: Locacion.coords.longitude,
                              latitudeDelta: 0.0020,
                              longitudeDelta: 0.0071
                            }}
                          >
                            <Marker
                              title={"¡Estoy aquí!"}
                              description={` Calle: ` + direccion.Calle + ` Codigo Postal: ` + direccion.CodigoPostal}
                              coordinate={{ "latitude": Locacion.coords.latitude, "longitude": Locacion.coords.longitude }}
                            ></Marker>
                          </MapView> : <ActivityIndicator size="large" color={BlueColor} style={{ flex: 1 }} />}
                    </View>
                  </View>
                </View>
              </View>
              <View style={{ paddingLeft: 20, paddingRight: 20, marginBottom: 20 }} >
                <TouchableOpacity style={{ backgroundColor: "#104971", borderRadius: 5, padding: 10, marginBottom: 10 }} onPress={verificarDatosReporte} >
                  <Text style={{ color: "white", textAlign: "center" }}> Enviar </Text>
                </TouchableOpacity>
              </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </ImageBackground>
      <Message
        transparent={true}
        loading={mostraMensaje}
        loadinColor={BlueColor}
        onConfirmarLoad={() => {
          setMonstrarMensaje(false);
          if (!permisoUbicacion)
            Linking.openSettings();
          if(!permisoCamara)
            Linking.openSettings();
        }}
        onCancelLoad={() => {
          setMonstrarMensaje(false);
          if (!permisoUbicacion)
            Linking.openSettings();
          if(!permisoCamara)
            Linking.openSettings();
        }}
        icon={iconoMensaje}
        iconsource={iconoFuente}
        color={BlueColor}
        message={mensaje}
        tittle={tipoMensaje}
        buttonText={"Aceptar"}

      />
      <ImageView
        images={arregloFotos}
        imageIndex={indiceGaleria}
        visible={mostraModalEvidencia}
        onRequestClose={() => {
          setMostraModalEvidencia(false);
        }}
        swipeToCloseEnabled={false}
        FooterComponent={({ imageIndex }) => (
          <View style={{ flex: 1, alignItems: "center", marginBottom: "5%" }} >
            <View >
              <Text style={{ color: "white", fontWeight: "bold", fontSize: 16 }} >{`${imageIndex + 1}/${arregloFotos.length}`}</Text>
            </View>
          </View>
        )}
        animationType="fade"
      />
      <Loading
        loading={cargando}
        loadinColor={DarkPrimaryColor}
        message={"Enviando Reporte"}
        onCancelLoad={() => {
          setCargando(false);
        }}
        tittle={"Cargando"}
        transparent={true}
      />
    </SafeAreaView>
  )

}