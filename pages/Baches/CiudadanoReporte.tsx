import React, { useState, useEffect, useRef, Component } from "react";
import {
  TouchableOpacity,
  View,
  Dimensions,
  ImageBackground,
  Text,
  TextInput,
  Linking,
  StatusBar,
  Platform
} from "react-native";
import { Form, Formik, useFormik } from 'formik';
import Style from '../../Styles/styles';
import * as Yup from 'yup';
import { CordenadasActualesNumerico, ObtenerDireccionActual } from '../../utilities/utilities';
import { Camera } from "expo-camera";
import { CatalogoSolicitud, EnviarReportes } from "../controller/api-controller";
import { StorageBaches } from "../controller/storage-controllerBaches";
import Loading from "../components/modal-loading";
import Message from "../components/modal-message";
import { BlueColor } from '../../Styles/BachesColor';
import { CAMERA, DESCONOCIDO, PREVIEW, WIFI_OFF, OK } from "../../Styles/Iconos";
import DropDownPicker from 'react-native-dropdown-picker';
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native-gesture-handler";
import { Avatar, Icon } from "react-native-elements";
import { azulColor } from "../../Styles/Color";
import Camara from '../components/Camara';
import { obtenerBase64 } from '../../utilities/utilities';
import ImageView from "react-native-image-viewing";
const colorEstado = { "ios": "dark-content", "android": "light-content" };
let validacion = Yup.object().shape({
  Referencia: Yup.string().required(),
  Descripcion: Yup.string().required()
});


export default function Reportar(props: any) {
  const storage = new StorageBaches();
  const [cameraPermissions, setCameraPermision] = useState(false);
  //NOTE: message title
  const [showMessage, setSHowMessage] = useState(false);
  const [mensaje, setMensaje] = useState(String);
  const [ icono , setIcono ] = useState( String );
  //NOTE: modal loading
  const [cargando, setCargando] = useState(false);
  //NOTE: manejadores del picker
  const [pickerAbierto, setPikcerAbierto] = useState(false);
  const [FuenteIcono, setFuenteIcono] = useState(String);
  const [catalogoSolicitud, setCatalogoSolicitud] = useState([]);
  const [seleccionSolicitud, setSeleccionSolicitud] = useState(String);
  const [errorPicker, setErrorPicker] = useState(false);
  //NOTE: Controladores de la camara
  const [camaraActiva, setCamaraActiva] = useState(false);
  const [flashActivo, setFlashActivo] = useState(false);
  const [listaImagenes, setListaImagenes] = useState([]);
  const [listaImagenesCodificadas, setListaImagenesCodificadas] = useState([]);
  const [direccion, setDireccion] = useState(String);
  const [coordenadas, setCoordenadas] = useState(String);
  //NOTE: controlador de la galerai
  const [ indiceGaleria, setIndiceGaleria ] = useState( 0 );
  const [ mostrarGalera, setMostrarGaleria ] = useState( false );

  let formik = useFormik({
    initialValues: {
      Referencia: '',
      Descripcion: ''
    },
    onSubmit: (values) => { setCargando(true); GuardarReporte(values); },
    validationSchema: validacion
  });
  useEffect(() => {
    obtenerTemas();
  }, []);
  useEffect(() => {
    //NOTE: obtenemos los datos que genero el componente camara
    if (!camaraActiva) {
      setCargando(true);
      obtenerDatosCamara();
    }
  }, [camaraActiva]);
  useEffect(() => {
    //NOTE: Verificamos los permisos de la cara
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setCameraPermision(status === "granted");
    })();
  });

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
    let coordenadasActuales = null;
    let formatoDireccion = "";
    if ((coordenadas == "" || coordenadas == null) && direccion == "" || direccion == null) {
      //INDEV: obtenemos las coordenadas y la direccion
      coordenadasActuales = await CordenadasActualesNumerico();
      let direccionActia = JSON.parse(await ObtenerDireccionActual(coordenadasActuales));
      formatoDireccion = ` Estado: ${direccionActia.region}\nCiudad: ${direccionActia.city}\nColonia: ${direccionActia.district}\nCalle: ${direccionActia.street}\nCódigo Postal: ${direccionActia.postalCode}`;
    }
    if (seleccionSolicitud != "") {
      let data = {
        Tema: seleccionSolicitud,
        Descripcion: Reporte.Descripcion,
        gps: (coordenadas == "" || coordenadas == null) ? JSON.stringify(coordenadasActuales) : coordenadas,
        direccion: (direccion == "" || direccion == null ? formatoDireccion : direccion),
        Referencia: Reporte.Referencia,
        Evidencia: listaImagenesCodificadas,
      };
      console.log(data);
      await EnviarReportes(data)
        .then((result) => {
          lanzarMensaje("¡Reporte Enviado!", OK[0], OK[1] );
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
  const solicitarPermisosCamara = async () => {
    //NOTE: pedir Persmisos antes de lanzar la camara
    try {
      let { status } = await Camera.requestCameraPermissionsAsync();
      if (status === "granted") {
        setCameraPermision(true);
        //NOTE: Activamos la camara
        setCamaraActiva(true);
      } else {
        //NOTE: lanzamos un un mensaje de permisos 
        setIcono(CAMERA[0]);
        setFuenteIcono(CAMERA[1]);
        setMensaje("La aplicación necesita permisos para acceder a la cámara");
        setSHowMessage(true);
        setCamaraActiva(false);
        setCameraPermision(false);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const existeEvidencia = async ()=>{
    if(listaImagenes.length > 0 ) {
        setMostrarGaleria(true);
    }else{
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
      setListaImagenes((listaImagenes) => [...listaImagenes, imageObject]);
      let base64 = await obtenerBase64(imageObject.uri);
      setListaImagenesCodificadas((listaImagenesCodificadas) => [...listaImagenesCodificadas, String(base64)]);
    }
    setDireccion(datos.Direccion);
    setCoordenadas(datos.Coordenadas);
    //NOTE: borramos los datos del storage
    setCargando( false );
    await storage.limpiarDatosCamara();
  }
  const lanzarMensaje = (mensaje: string, icono: string, fuenteIcono: string) => {
    setMensaje(mensaje);
    setIcono(icono);
    setFuenteIcono(fuenteIcono);
    setSHowMessage(true);
  }
  return (
    <SafeAreaView style={{ flex: 1, flexDirection: "row" }} >
      <StatusBar animated={true} barStyle = { colorEstado[Platform.OS] }/>
      <ImageBackground source={require('../../assets/Fondo.jpeg')} style={{ flex: 1 }} >
        {
          !camaraActiva ?
            <View style={{ flex: 1 }} >
              <ScrollView style={{ flexGrow: 1 }} >
                <View style={{ justifyContent: "center", alignItems: "center" }}  >
                  <Avatar
                    avatarStyle={{}}
                    rounded
                    imageProps={{ resizeMode: "contain" }}
                    size="xlarge"
                    containerStyle={{ height: 120, width: 220 }}
                    source={require("../../assets/banner.png")}
                  />
                </View>
                <DropDownPicker
                  language="ES"
                  containerStyle={{ borderRadius: 10, padding: 20 }}
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
                  <Text style={Style.TemaLabalCampo} > Referencea {formik.isValid} </Text>
                  <TextInput
                    style={(formik.errors.Referencia && formik.touched.Referencia) ? Style.TemaCampoError : Style.TemaCampo}
                    placeholder="Entre calles..."
                    value={formik.values.Referencia}
                    onChangeText={formik.handleChange('Referencia')}
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
                    {/* INDEV: mostramos un boton para las evidencias */}
                    <Text style={Style.TemaLabalCampo}>Foto Evidencia (Opcional)</Text>
                    <View style={{ flex: 1, flexDirection: "row" }} >
                      <TouchableOpacity style={{ flex: 4, marginLeft: 20, marginRight: 5 }} onPress={solicitarPermisosCamara} >
                        <Text style={{ color: "white", textAlign: "center", padding: 13, borderRadius: 10, backgroundColor: azulColor }}> Seleccionar Imagenes </Text>
                      </TouchableOpacity>
                      <TouchableOpacity 
                        style={{ flex: 1, borderRadius: 5, padding: 10, marginBottom: 10, marginRight: 20, borderWidth: 1, borderColor: azulColor }}
                        onPress = {existeEvidencia}
                        >
                        <Icon name={PREVIEW[0]} tvParallaxProperties color={azulColor} type={PREVIEW[1]}   ></Icon>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </ScrollView>
              <TouchableOpacity style={{ marginLeft: 20, marginRight: 20, backgroundColor: azulColor, borderRadius: 10, marginBottom: 10 }} onPress={formik.handleSubmit} >
                <Text style={{ color: "white", textAlign: "center", padding: 15 }}> Reportar </Text>
              </TouchableOpacity>
            </View>
            :
            <View style={{ flex: 1 }} >
              <Camara
                Activa={camaraActiva}
                onActiveCamera={() => { setCamaraActiva(false) }}
                flashOn={flashActivo}
                onChangeFlash={() => { setFlashActivo(!flashActivo) }}

              />
            </View>
        }
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
              if (!cameraPermissions) {
                console.log("Abriendo setting");
                Linking.openSettings();
              }
            }
          }
          tittle={"Mensaje"}
        />
        <Loading
          transparent = { true }
          loading = { cargando }
          loadinColor = { azulColor }
          onCancelLoad = { ()=>{ } }
          tittle = "Mensaje"
          message = "Cargando..."
        />
        <ImageView
          images={listaImagenes}
          imageIndex={ indiceGaleria }
          visible={mostrarGalera}
          onRequestClose={() => {
          setMostrarGaleria(false);
          setIndiceGaleria(0);
          }}
          swipeToCloseEnabled={false}
          FooterComponent={({ imageIndex }) => (
              <View style = {{flex:1, alignItems:"center", marginBottom:"5%"}} >
                  <View >
                      <Text style = {{color:"white", fontWeight:"bold", fontSize:16}} >{`${ imageIndex + 1 }/${listaImagenes.length}`}</Text>
                  </View>
              </View>
          )}
          animationType = "fade"
          />
      </ImageBackground>
    </SafeAreaView >
  );
}
