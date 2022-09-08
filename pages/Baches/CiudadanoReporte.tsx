import React, { useState, useEffect, useRef, Component } from "react";
import {
  TouchableOpacity,
  View,
  ImageBackground,
  Text,
  TextInput,
  Linking,
  StatusBar,
  Platform,
  ActivityIndicator,
  KeyboardAvoidingView
} from "react-native";
import { useFormik } from 'formik';
import Style from '../../Styles/styles';
import * as Yup from 'yup';
import { CordenadasActualesNumerico, ObtenerDireccionActual } from '../../utilities/utilities';
import { CatalogoSolicitud, EnviarReportes,CancelarPeticion } from "../controller/api-controller";
import { StorageBaches } from "../controller/storage-controllerBaches";
import Loading from "../components/modal-loading";
import Message from "../components/modal-message";
import { BlueColor } from '../../Styles/BachesColor';
import { CAMERA, DESCONOCIDO, WIFI_OFF, OK, ERROR } from "../../Styles/Iconos";
import DropDownPicker from 'react-native-dropdown-picker';
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native-gesture-handler";
import { Icon, Image  } from "react-native-elements";
import { azulColor, SuinpacRed } from "../../Styles/Color";
import { obtenerBase64 } from '../../utilities/utilities';
import ImageView from "react-native-image-viewing";
import { FONDO,AVATAR } from '../../utilities/Variables';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
const colorEstado = { "ios": "dark-content", "android": "light-content" };
let validacion = Yup.object().shape({
  Referencia: Yup.string().required(),
  Descripcion: Yup.string().required()
});

export default function Reportar(props: any) {
  const storage = new StorageBaches();
  const [ cameraPermissions, setCameraPermision ] = useState(true);
  const [ ubicacionPermiso, setUbicacionPermiso ] = useState(true);
  //NOTE: message title
  const [showMessage, setSHowMessage] = useState(false);
  const [mensaje, setMensaje] = useState(String);
  const [icono, setIcono] = useState(String);
  //NOTE: modal loading
  const [cargando, setCargando] = useState(false);
  //NOTE: manejadores del picker
  const [pickerAbierto, setPikcerAbierto] = useState(false);
  const [FuenteIcono, setFuenteIcono] = useState(String);
  const [catalogoSolicitud, setCatalogoSolicitud] = useState([]);
  const [seleccionSolicitud, setSeleccionSolicitud] = useState(String);
  const [errorPicker, setErrorPicker] = useState(false);
  //NOTE: Controladores de la camara
  const [listaImagenes, setListaImagenes] = useState([]);
  const [direccion, setDireccion] = useState(String);
  const [coordenadas, setCoordenadas] = useState(String);
  //NOTE: controlador de la galerai
  const [indiceGaleria, setIndiceGaleria] = useState(0);
  const [mostrarGalera, setMostrarGaleria] = useState(false);
  //NOTE: separamos por imagen las evidencias
  const [EvidenciaUno, setEvidenciaUno] = useState(String);
  const [evidenciaUnoCodificada, setEvidenciaUnoCodificada] = useState(String);
  const [EvidenciaDos, setEvidenciaDos] = useState(String);
  const [evidenciaDosCodificada, setEvidenciaDosCodificada] = useState(String);
  const [EvidenciaTres, setEvidenciaTres] = useState(String);
  const [evidenciaTresCodificada, setEvidenciaTresCodificada] = useState(String);
  //Manejadir de imagenes
  const [indiceCapturaImagen, setIndiceCapturaImagen] = useState(0);

  let formik = useFormik({
    initialValues: {
      Referencia: '',
      Descripcion: ''
    },
    onSubmit: (values) => {
      if (validarEspeciales()) {
        if(seleccionSolicitud == ""){
          setCameraPermision(true);
          setUbicacionPermiso(true);
          setMensaje("Favor de seleccionar el tema relacionado con el problema descrito");
          setIcono(ERROR[0]);
          setFuenteIcono(ERROR[1]);
          setSHowMessage(true);          
        }else{
          setCargando(true);
          GuardarReporte(values);
        }
        
      } else {
        setMensaje("Caracteres no validos\n^+=-[]\\\'/{}|\"<>");
        setIcono(ERROR[0]);
        setFuenteIcono(ERROR[1]);
        setSHowMessage(true);
      }
    },
    validationSchema: validacion
  });
  useEffect(() => {
    (async () => {
      //NOTE: veririficamos los permisos para obtener la localizacion de la app ( con soporte para ios )
      let requestPerm = await Location.getForegroundPermissionsAsync();
      setUbicacionPermiso(requestPerm.status == "granted");
      if( requestPerm.status != "granted" ){
        let { status } = await Location.requestForegroundPermissionsAsync(); //NOTE: en caso de que lleguen aqui son acceso
        if( status == "denied"){  
          setUbicacionPermiso(false);
          lanzarMensaje("MAC - Z requiere el uso de su ubicación","Mensaje","info");
          setCargando(false);
        }else{
          setUbicacionPermiso(true);
        }
      }
    })();
  }, []);
  useEffect(() => {
    obtenerTemas();
    limpiarPantalla();
  }, []);
  const obtenerPermisosCamara = async () => {
    try{
      let getCamera = await ImagePicker.getCameraPermissionsAsync();
      setUbicacionPermiso(getCamera.status != "granted");
      if(getCamera.status != "granted"){
        let requestCamera = await ImagePicker.requestCameraPermissionsAsync();
        if( requestCamera.status == "denied" ){
          setCameraPermision(false);
          return false;
        }else{
          return true;
        }
      }else{
        return true;
      }

    }catch(error){
      console.log(error.message);
      lanzarMensaje("MAC - Z requiere permisos para usar la cámara","info","material");
      return false;
    }
  }
  const obtenerTemas = async () => {
    //NOTE: Obtenemos los dato del storage si no los descargamos de internet
    if (await storage.CatalogoTemaActualizado()) {
      await CatalogoSolicitud()
        .then(async (catalogo) => {
          let listaSolicitudes = catalogo.map((elemento, index) => {
            return {
              label: elemento.descripci_on,
              value: elemento.id,
              key: elemento.id
            };
          });
          //Guardamos el catalogo de temas
          await storage.guardarFechaActualizacionCatalogoTema();
          await storage.guardarListaTemas(JSON.stringify(listaSolicitudes));
          setCatalogoSolicitud(listaSolicitudes);
        })
        .catch((error) => {
          console.log(error);
        })
    } else {
      //NOTE: lo obtenemos de la DB
      await storage.obtenerCatalogoTemas()
        .then((temas) => {
          let arrayTemas = JSON.parse(temas);
          setCatalogoSolicitud(arrayTemas);
        }).catch((erro) => {
          console.log(erro)
        })
    }
  }
  const GuardarReporte = async (Reporte: { Referencia: string, Descripcion: string }) => {
    //NOTE: aqui procesamos las imagenes
    setTimeout(() => {
      setUbicacionPermiso(true);
      setCameraPermision(true);
      console.log("Cancelando peticion");
      setCargando(false);
      CancelarPeticion();
      lanzarMensaje("Favor de revisar la conexión a internet\nError de conexión",WIFI_OFF[0],WIFI_OFF[1]);
    },15000);
    let coordenadasActuales = null;
    let formatoDireccion = "";
    if ((coordenadas == "" || coordenadas == null) && direccion == "" || direccion == null) {
      //INDEV: obtenemos las coordenadas y la direccion
      coordenadasActuales = await CordenadasActualesNumerico();
      let direccionActia = JSON.parse(await ObtenerDireccionActual(coordenadasActuales));
      formatoDireccion = ` Estado: ${direccionActia.region}\nCiudad: ${direccionActia.city}\nColonia: ${direccionActia.district}\nCalle: ${direccionActia.street}\nCódigo Postal: ${direccionActia.postalCode}`;
    }
    //NOTE: convertimos los datos de la lista en
    let listaCodificada = new Array();;
    if( listaImagenes.length > 0 ){
      if( EvidenciaUno != "" ){
        listaCodificada.push(evidenciaUnoCodificada);
      }
      if( EvidenciaDos != "" ){
        listaCodificada.push(evidenciaDosCodificada);
      }
      if( EvidenciaTres != "" ){
        listaCodificada.push(evidenciaTresCodificada);
      }
    }
    if (seleccionSolicitud != "") {
      let data = {
        Tema: seleccionSolicitud,
        Descripcion: Reporte.Descripcion,
        gps: (coordenadas == "" || coordenadas == null) ? JSON.stringify(coordenadasActuales) : coordenadas,
        direccion: (direccion == "" || direccion == null ? formatoDireccion : direccion),
        Referencia: Reporte.Referencia,
        Evidencia: (listaCodificada.length > 0) ? listaCodificada : null,
      };
      setUbicacionPermiso(true);
      setCameraPermision(true);
      await EnviarReportes(data)
        .then((result) => {
          lanzarMensaje("¡Reporte Enviado!", OK[0], OK[1]);
          limpiarPantalla();
        })
        .catch((error) => {
          //NOTE: manejador de erroes
          let mensaje = error.message;
          if (mensaje.includes("interner")) {
            //NOTE: mensaje sin internet
            lanzarMensaje(mensaje, WIFI_OFF[0], WIFI_OFF[1]);
          } else {
            lanzarMensaje(mensaje, DESCONOCIDO[0], DESCONOCIDO[1]);
          }
        })
        .finally(() => {
          setCargando(false);
        });
    } else {
      setErrorPicker(true);
    }
  };
  const solicitarPermisosCamara = async ( index:number ) => {
    //NOTE: pedir Persmisos antes de lanzar la camara
    let image = await ImagePicker.launchCameraAsync({
      presentationStyle:0,
      allowsEditing:false,
      allowsMultipleSelection:false,
      base64:true,
    });
    
    if( !image.cancelled ){
      if(index == 1){
        setEvidenciaUno(image.uri);
        setEvidenciaUnoCodificada( "data:image/jpeg;base64," + image.base64);
      }else if( index == 2 ) {
        setEvidenciaDos(image.uri);
        setEvidenciaDosCodificada( "data:image/jpeg;base64," + image.base64);

      }else if( index == 3 ){
        setEvidenciaTres( image.uri );
        setEvidenciaTresCodificada( "data:image/jpeg;base64," + image.base64);
      }
      setListaImagenes((listaImagenes) => [...listaImagenes, image]);
    }
  };
  const existeEvidencia = async () => {
    if (listaImagenes.length > 0) {
      setMostrarGaleria(true);
    } else {
      setMensaje("No se encontraron evidencias");
      setIcono(CAMERA[0]);
      setFuenteIcono(CAMERA[1]);
      setSHowMessage(true);
    }
  }
  const obtenerDatosCamara = async () => {
    let datos = await storage.obtenerDatosCamara();
    //NOTE: Obtenemos la imagen convertida
    if (datos.Imagen != null) {
      let imageObject = JSON.parse(datos.Imagen);
      let base64 = await obtenerBase64(imageObject.uri);
      switch (indiceCapturaImagen) {
        case 1:
          setEvidenciaUno(imageObject.uri);
          setEvidenciaUnoCodificada(String(base64) );
          setListaImagenes((listaImagenes) => [...listaImagenes, imageObject]);
          break;
        case 2:
          setEvidenciaDos(imageObject.uri);
          setEvidenciaDosCodificada(String(base64));
          setListaImagenes((listaImagenes) => [...listaImagenes, imageObject]);
          break;
        case 3:
          setEvidenciaTres(imageObject.uri);
          setEvidenciaTresCodificada(String(base64));
          setListaImagenes((listaImagenes) => [...listaImagenes, imageObject]);
          break
      }
      /*setListaImagenes((listaImagenes) => [...listaImagenes, imageObject]);
      let base64 = await obtenerBase64(imageObject.uri);
      setListaImagenesCodificadas((listaImagenesCodificadas) => [...listaImagenesCodificadas, String(base64)]);*/
    }
    setDireccion(datos.Direccion);
    setCoordenadas(datos.Coordenadas);
    //NOTE: borramos los datos del storage
    setCargando(false);
    await storage.limpiarDatosCamara();
  }
  const lanzarMensaje = (mensaje: string, icono: string, fuenteIcono: string) => {
    setMensaje(mensaje);
    setIcono(icono);
    setFuenteIcono(fuenteIcono);
    setSHowMessage(true);
  }
  const limpiarPantalla = () => {
    formik.setFieldValue("Referencia", "");
    formik.setFieldValue("Descripcion", "");
    formik.setFieldTouched("Referencia",false);
    formik.setFieldTouched("Descripcion",false);
    setSeleccionSolicitud("");
    //NOTE:  limpiamos los imagenes de la interfaz
    setEvidenciaUno("");
    setEvidenciaDos("");
    setEvidenciaTres("");
    setEvidenciaUnoCodificada("");
    setEvidenciaDosCodificada("");
    setEvidenciaTresCodificada("");
  }
  const validarEspeciales = () => {
    var iChars = "^+=-[]\\\'/{}|\"<>";
    let referencia = formik.values.Referencia;
    let descripcion = formik.values.Descripcion;
    let valido = true;
    //Validamos los datos de la referencia
    for (let indexEspeciales = 0; indexEspeciales < iChars.length; indexEspeciales++) {
      for (let indexTexto = 0; indexTexto < referencia.length; indexTexto++) {
        if (iChars[indexEspeciales] == referencia[indexTexto]) {
          formik.setFieldError("Referencia", "No valido");
          valido = false;
          break;
        }
      }
    }
    for (let indexEspeciales = 0; indexEspeciales < iChars.length; indexEspeciales++) {
      for (let indexTexto = 0; indexTexto < descripcion.length; indexTexto++) {
        if (iChars[indexEspeciales] == descripcion[indexTexto]) {
          formik.setFieldError("Descripcion", "No valido");
          valido = false;
          break;
        }
      }
    }
    return valido;
  }
  const eliminarImagen = (index: number) => {
    switch (index) {
      case 1:
        setEvidenciaUno("");
        setEvidenciaUnoCodificada("");
        break;
      case 2:
        setEvidenciaDos("");
        setEvidenciaDosCodificada("");
        break;
      case 3:
        setEvidenciaTres("");
        setEvidenciaTresCodificada("");
        break;
    }
  }
  const mostrarGaleria = async (index: number, stadoHook: any) => {
    ///NOTE: verificamos permisos
    if(! await obtenerPermisosCamara() ){
      lanzarMensaje("MAC - Z requiere permisos para usar la cámara","info","material");
    }else{
      if (stadoHook != "") {
        setMostrarGaleria( true );
        setIndiceGaleria(listaImagenes.findIndex(((element) =>  element.uri == stadoHook )));
      } else {
        setIndiceCapturaImagen(index);
        solicitarPermisosCamara(index);
      }
    }
  }
  return (
    <SafeAreaView style={{ flex: 1, flexDirection: "row" }} >
      <StatusBar animated={true} barStyle={colorEstado[Platform.OS]} />
      
      <ImageBackground source={FONDO} style={{ flex: 1 }} >
            <View style={{ flex: 1 }} >
              <KeyboardAvoidingView 
                style = {{flex:1}}
                behavior = { Platform.OS == "ios" ? "height" : "height" }

                >
              <ScrollView style={{ flexGrow: 1 }} >
                <View style={{ justifyContent: "center", alignItems: "center", padding:20 }}  >
                  <Image 
                    source = {AVATAR} 
                    resizeMode = { "stretch" }  
                    style = {{ height:80,width:220 }}
                  />
                </View>
                <Text style={[Style.TemaLabalCampo]} > Reportar {formik.isValid} </Text>
                <DropDownPicker
                  language="ES"
                  containerStyle={{ borderRadius: 10, padding: 20, paddingTop:0 }}
                  style={{ borderColor: errorPicker ? "red" : "black" }}
                  items={catalogoSolicitud}
                  setOpen={setPikcerAbierto}
                  open={pickerAbierto}
                  setValue={setSeleccionSolicitud}
                  value={seleccionSolicitud}
                  min={10}
                  max={15}
                  listMode={"MODAL"}
                  listItemContainerStyle={{ padding: 10 }}
                  itemSeparator={true}
                  selectedItemContainerStyle={{ backgroundColor: BlueColor + 45 }}
                  selectedItemLabelStyle={{ fontWeight: "bold" }}
                  placeholder={"Seleccione Tema"}
                />
                <View>
                  <Text style={Style.TemaLabalCampo} > Referencia {formik.isValid} </Text>
                  <TextInput
                    style={(formik.errors.Referencia && formik.touched.Referencia) ? Style.TemaCampoError : Style.TemaCampo}
                    placeholder="Entre calles..."
                    value={formik.values.Referencia}
                    onChangeText={formik.handleChange('Referencia')}
                    keyboardType={"ascii-capable"}
                  ></TextInput>
                  <Text style={Style.TemaLabalCampo} > Descripción </Text>
                  <TextInput
                    style={[(formik.errors.Descripcion && formik.touched.Descripcion) ? Style.TemaCampoError : Style.TemaCampo, { textAlignVertical: "top", color: "black" }]}
                    multiline={true}
                    numberOfLines={5}
                    placeholder="Descripcion de la solictud"
                    onChangeText={formik.handleChange('Descripcion')}
                    value={formik.values.Descripcion}
                  ></TextInput>
                  <View>
                    <View style={{ flexDirection: "row", alignSelf: "center", marginTop:40 }}>
                      <TouchableOpacity onPress={() => { eliminarImagen(1) }} style={{ height: 27, width: 27 }} disabled={!(EvidenciaUno != "")} ><Icon name="close" tvParallaxProperties style={{ borderWidth: 1, position: "relative", borderRadius: 15, backgroundColor: "white" }} color={SuinpacRed}></Icon></TouchableOpacity>
                      <TouchableOpacity style={{ marginLeft: -27, zIndex: -1, marginRight: 20, borderColor: "white" }} onPress={() => { mostrarGaleria(1, EvidenciaUno) }}>
                        <Image
                          source={(EvidenciaUno != "") ? { uri: EvidenciaUno } : require("../../assets/preview.jpeg")}
                          PlaceholderContent={<ActivityIndicator />}
                          style={{ height: 180, width: 90, borderRadius: 5, borderWidth: 1 }}
                          resizeMode={(EvidenciaUno != "") ? "cover" : "contain"}
                        />
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => { eliminarImagen(2) }} style={{ height: 27, width: 27 }} disabled={!(EvidenciaDos != "")} ><Icon name="close" tvParallaxProperties style={{ borderWidth: 1, position: "relative", borderRadius: 15, backgroundColor: "white" }} color={SuinpacRed}></Icon></TouchableOpacity>
                      <TouchableOpacity style={{ marginLeft: -27, zIndex: -1, marginRight: 20 }} onPress={() => { mostrarGaleria(2, EvidenciaDos) }} >
                        <Image
                          source={(EvidenciaDos != "") ? { uri: EvidenciaDos } : require("../../assets/preview.jpeg")}
                          PlaceholderContent={<ActivityIndicator />}
                          style={{ height: 180, width: 90, borderRadius: 5, borderWidth: 1 }}
                          resizeMode={(EvidenciaDos != "") ? "cover" : "contain"}
                        />
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => { eliminarImagen(3) }} style={{ height: 27, width: 27 }} disabled={!(EvidenciaTres != "")} ><Icon name="close" tvParallaxProperties style={{ borderWidth: 1, position: "relative", borderRadius: 15, backgroundColor: "white" }} color={SuinpacRed}></Icon></TouchableOpacity>
                      <TouchableOpacity style={{ marginLeft: -27, zIndex: -1 }} onPress={() => { mostrarGaleria(3, EvidenciaTres) }} >
                        <Image
                          source={(EvidenciaTres != "") ? { uri: EvidenciaTres } : require("../../assets/preview.jpeg")}
                          PlaceholderContent={<ActivityIndicator />}
                          style={{ height: 180, width: 90, borderRadius: 5, borderWidth: 1 }}
                          resizeMode={(EvidenciaTres != "") ? "cover" : "contain"} />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
                <TouchableOpacity style={{ marginLeft: 20, marginRight: 20, backgroundColor: azulColor, borderRadius: 10, marginTop:50 }} onPress={formik.handleSubmit} >
                  <Text style={{ color: "white", textAlign: "center", padding: 15 }}> Reportar </Text>
                </TouchableOpacity>
              </ScrollView>
              </KeyboardAvoidingView>
            </View>
        <Message
          color={azulColor}
          buttonText={"Aceptar"}
          icon={icono}
          iconsource={FuenteIcono}
          loadinColor={azulColor}
          loading={showMessage}
          transparent={true}
          message={mensaje}
          onCancelLoad={() => { }}
          onConfirmarLoad=
          {
            () => {
              setSHowMessage(false);
              if ( !ubicacionPermiso ) {
                Linking.openSettings();
                console.log("Permisos de ubicacion");
              }
              if( !cameraPermissions ){
                Linking.openSettings();
                console.log("permisos de camara");
              }
            }
          }
          tittle={"Mensaje"}
        />
        <Loading
          transparent={true}
          loading={cargando}
          loadinColor={azulColor}
          onCancelLoad={() => { }}
          tittle="Mensaje"
          message="Cargando..."
        />
        <ImageView
          images={listaImagenes}
          imageIndex={indiceGaleria}
          visible={mostrarGalera}
          onRequestClose={() => {
            setMostrarGaleria(false);
            setIndiceGaleria(0);
          }}
          swipeToCloseEnabled={false}
          doubleTapToZoomEnabled = {false}
          FooterComponent={({ imageIndex }) => (
            <View style={{ flex: 1, alignItems: "center", marginBottom: "5%" }} >
              <View >
                <Text style={{ color: "white", fontWeight: "bold", fontSize: 16 }} >{`${imageIndex + 1}/${listaImagenes.length}`}</Text>
              </View>
            </View>
          )}
          animationType="fade"
        />
      </ImageBackground>
    </SafeAreaView >
  );
}
