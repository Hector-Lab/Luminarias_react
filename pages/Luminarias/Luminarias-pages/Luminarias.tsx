import React, { useState, useEffect, useRef } from "react";
import Styles from "../../../Styles/BachesStyles";
import {
  TouchableOpacity,
  View,
  Image,
  Dimensions,
  Alert,
  ScrollView,
  TextInput,
} from "react-native";
import { BlueColor, DarkPrimaryColor } from "../../../Styles/BachesColor";
import { Text, Icon, Card, Button } from "react-native-elements";
import { Picker } from "@react-native-picker/picker";
import { Camera } from "expo-camera";
import {
  checkConnection,
  CordenadasActualesNumerico,
  ObtenerDireccionActual,
} from "../../../utilities/utilities";
import { iconColorBlue, SuinpacRed, torchButton } from "../../../Styles/Color";
import * as Location from "expo-location";
import {
  
  EnviarReportes,
} from "../../controller/api-controller";
import { StorageBaches } from "../../controller/storage-controllerBaches";
import Loading from "../../components/modal-loading";
import Message from "../../components/modal-message";
import {
  OK,
  DESCONOCIDO,
  WIFI_OFF,
  INFO,
  ERROR,
  CAMERA,
} from "../../../Styles/Iconos";
import ImageView from "react-native-image-viewing";
import ImageViewer from "../../components/image-view";
export default function Luminarias(props: any) {
  const storage = new StorageBaches();
  const [cameraPermissions, setCameraPermision] = useState(false);
  const [arrayImageEncode, setArrayImageEncode] = useState([]);
  const [arrayDataList, setArrayDataList] = useState([]);
  const SLIDER_WIDTH = Dimensions.get("window").width;
  const ITEM_WIDTH = Math.round(SLIDER_WIDTH * 0.9);
  const ITEM_HEIGHT = Math.round((ITEM_WIDTH * 3) / 4);
  const [flashOn, setFlashOn] = useState(false);
  const [onCamera, setOnCamera] = useState(false);
  const [coords, setCoords] = useState(null);
  const [direccion, setDireccion] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [habilitarBotonFotos, setHabilitarBotonFotos] = useState(false);
  const { width: viewportWidth, height: viewportHeight } =
    Dimensions.get("window");
  const [catalogoSolicitud, setCatalogoSolicitud] = useState([]);
  const [seleccionSolicitud, setSeleccionSolicitud] = useState("-1");
  const [contrato, setContrato] = useState(String);
  const [clasificacion, setClasificacion] = useState(String);
  const [clave, setClave] = useState(String);
  const [voltaje, setVoltaje] = useState(String);  
  const [direccionEnviar, setDireccionEnviar] = useState(String);
  const [errorUi, setErrorUi] = useState(String);
  const [iconSource, setIconSource] = useState(String);
  //NOTE: message title
  const [showMessage, setSHowMessage] = useState(false);
  const [messageIcon, setMessageIcon] = useState("info");
  const [headerMessage, setHeaderMessage] = useState("Mensaje");
  //NOTE: modal loading
  const [loadingMessage, setLoadingMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [imagenSeleccionada, setImagenSeleccionada] = useState("");
  const [indexImagenSeleccionada, setIndexImagenSeleccionada] = useState(-1);
  const [modalImagenVisible, setModalImagenVisible] = useState(false);
  let camera: Camera;  
  const [Color, setColor] = useState("");
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();                        
      if (status !== "granted") {
        setErrorMsg("Permisos negados");
        return;
      }
    })();
  }, []);

  const iniciarCamara = async () => {
    let { status } = await Camera.requestCameraPermissionsAsync();
    if (status === "granted") {
      setOnCamera(true);
    }
  };

  function wp(percentage) {
    const value = (percentage * viewportWidth) / 100;
    return Math.round(value);
  }

  const slideHeight = viewportHeight * 0.36;
  const slideWidth = wp(90);
  const itemHorizontalMargin = wp(2);
  const itemWidth = slideWidth + itemHorizontalMargin * 2;

  const __takePicture = async () => {
    if (arrayImageEncode.length <= 2) {
      
      if(direccion==''){
        obtenerDireccionActuales
      }

      if (cameraPermissions) {
        if (!camera) {
          __takePicture();
          return;
        }
        const photo = await camera.takePictureAsync({
          base64: true,
          quality: 0.4,
        });
        setImagenSeleccionada(photo.uri);
        setArrayImageEncode((arrayImageEncode) => [...arrayImageEncode, photo]);
      
        setOnCamera(false);
        let coordenadas = await CordenadasActualesNumerico();
        setCoords(coordenadas);
        //NOTE: verificamos los datos de localizacion
        let DireccionActual = JSON.parse(
          await ObtenerDireccionActual(coordenadas)
        );
        let formatoDireccion = `
          Estado: ${DireccionActual.region}
          Ciudad: ${DireccionActual.city}
          Colonia: ${DireccionActual.district}
          Calle: ${DireccionActual.street}
          Codigo Postal: ${DireccionActual.postalCode}
        `;
        setDireccionEnviar(
          `${DireccionActual.region}  ${DireccionActual.city} ${DireccionActual.district} ${DireccionActual.street} ${DireccionActual.postalCode}`
        );
        setDireccion(formatoDireccion);
      } else {
        let { status } = await Camera.requestCameraPermissionsAsync();
        setCameraPermision(status === "granted");
      }
    }
    setLoading(false);
  };
  const validarNumeroDeFotos = () => {
    //    console.log(arrayImageEncode.length);
    if (arrayImageEncode.length < 3) {
      setOnCamera(true);
    } else {
      Alert.alert("INFO", "El número maximo de fotos a registrar es tres.", [
        { text: "Aceptar", onPress: () => console.log("OK Pressed") },
      ]);
    }
  };
  const obtenerDireccionActuales = async () => {
    let gpsServiceStatus = await Location.hasServicesEnabledAsync();
    if (gpsServiceStatus) {
      setLoading(true);
      let coordenadasActuales = await CordenadasActualesNumerico();
      setCoords(coordenadasActuales);
      //NOTE: Obtenemos los
      let DireccionActual = JSON.parse(
        await ObtenerDireccionActual(coordenadasActuales)
      );
      let formatoDireccion = `
        Estado: ${DireccionActual.region}
        Ciudad: ${DireccionActual.city}
        Colonia: ${DireccionActual.district}
        Calle: ${DireccionActual.street}
        Codigo Postal: ${DireccionActual.postalCode}`;
      setDireccion(formatoDireccion);
      setDireccionEnviar(
        `${DireccionActual.region}  ${DireccionActual.city} ${DireccionActual.district} ${DireccionActual.street} ${DireccionActual.postalCode}`
      );
      console.log(
        `${DireccionActual.region} ${DireccionActual.city} ${DireccionActual.district} ${DireccionActual.street} ${DireccionActual.postalCode}`
      );
      setLoading(false);
    } else {
      console.log("GPS Apagado");
      setErrorMsg("Para mejor su experiencia se recomienda encender su GPS");
      setSHowMessage(true);
      return false;
    }
    setLoading(true);

    setLoading(false);
  };
  const GuardarReporte = async () => {
    setLoading(true);
    let connection = checkConnection();
    let ciudadano = await storage.obtenerIdCiudadano();
    let cliente = await storage.obtenerCliente();
    let arrayImages = new Array();
    if (connection) {
      arrayImageEncode.map((item, index) => {
        console.log("Se hizo push");
        arrayImages.push("data:image/jpeg;base64," + item.base64);
      });
    } else {
      arrayImageEncode.map((item, index) => {
        arrayImages.push(item.uri);
      });
    }
    console.log("Numero de imagenes " + arrayImages.length);
    let data = {
      Tema: seleccionSolicitud,
      //Descripcion: observaciones,
      gps: JSON.stringify(coords),
      direccion: direccionEnviar,
      
      Ciudadano: ciudadano,
      Cliente: cliente,
      Evidencia: arrayImages,
    };
    await EnviarReportes(data)
      .then((result) => {
        //NOTE: Todo bien
        limpiarPantalla();
        setErrorMsg("Reporte Guardado");
        setHeaderMessage("Mensaje");
        //NOTE: Cambiar los datos por el archvo de iconos
        setIconSource(OK[1]);
        setMessageIcon(OK[0]);
        setSHowMessage(true);
      })
      .catch((error) => {
        //NOTE: manejador de erroes
        let mensaje = error.message;
        if (mensaje.includes("interner")) {
          //NOTE: mensaje sin internet
          setIconSource(WIFI_OFF[1]);
          setMessageIcon(WIFI_OFF[0]);
        } else {
          setIconSource(ERROR[1]);
          setMessageIcon(ERROR[0]);
        }
        setErrorMsg(mensaje);
        setSHowMessage(true);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const verificarDatos = async () => {
    //NOTE: verificamos los datos antes de enviar
    //REVIEW: el tema, la direccion, la foto, la descripcion
    setLoading(true);
    let error = "";
    //seleccionSolicitud == "-1" ? (error += "T,") : error;
    arrayImageEncode.length == 0 ? (error += error += "E,") : error;
    
    clave == "" ? (error += "R,") : error;
    clasificacion == "" ? (error += "R,") : error;
    voltaje == "" ? (error += "R,") : error;
    //observaciones == "" ? (error += "D,") : error;
    direccion == "" ? (error += "S,") : error;
    if (error != "") {
      setErrorUi(error);
      setErrorMsg("Favor de capturar los campos requeridos");
      setHeaderMessage("Mensaje");
      setMessageIcon(INFO[0]);
      setIconSource(INFO[1]);
      setSHowMessage(true);
      setLoading(false);
    } else {
      //INDEV: mandamos los datos a la API
      setErrorMsg("");
     // GuardarReporte();
    }
  };
  const limpiarPantalla = () => {    
    setContrato('');
    setClave('');
    setClasificacion('');
    setVoltaje('');
    setDireccion('');    
    setArrayImageEncode([]);
    
  };
  const solicitarPermisosCamara = async () => {
    //NOTE: pedir Persmisos antes de lanzar la camara
    try {
      let { status } = await Camera.requestCameraPermissionsAsync();
      if (status === "granted") {
        await __takePicture();
      } else {
        //NOTE: lanzamos un un mensaje de permisos
        setHeaderMessage("Mensaje");
        setErrorMsg("Favor de conceder permisos");
        setIconSource(CAMERA[1]);
        setMessageIcon(CAMERA[0]);
        setSHowMessage(true);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const _renderItem = () => {
    let Imagenes = [];
    let direccion = null;
    for (let index = 0; index < 3; index++) {
      //NOTE: Obtenemos la direccion de la imagen
      if (arrayImageEncode.length > index) {
        direccion = arrayImageEncode[index].uri;
        Imagenes.push(
          <TouchableOpacity
            key={direccion}
            onPress={() => {
              setIndexImagenSeleccionada(index);
              setImagenSeleccionada(arrayImageEncode[index].uri);
            }}
            style={{
              backgroundColor:
                imagenSeleccionada == arrayImageEncode[index].uri
                  ? BlueColor + "55"
                  : "white",
              marginLeft: 5,
            }}
          >
            <View
              style={{
                flex: 1,
                alignItems: "center",
                padding: 7,
                borderRadius: 5,
              }}
              key={index}
            >
              <Image
                source={{ uri: String(direccion) }}
                style={{ width: 50, height: 60 }}
              />
            </View>
          </TouchableOpacity>
        );
      }
    }
    if (arrayImageEncode.length == 0) {
      Imagenes.push(
        <View style={{ flex: 1 }} key={"-1"}>
          <Text style={{ textAlign: "center", fontWeight: "bold" }}>
            {" "}
            Sin Evidencias{" "}
          </Text>
        </View>
      );
    }
    return Imagenes;
  };
  const eliminarFoto = () => {
    setArrayImageEncode(
      arrayImageEncode.filter((item) => item.uri !== imagenSeleccionada)
    );
    setImagenSeleccionada("");
  };

  return (
    <View style={[Styles.container]}>
      {onCamera ? (
        <View style={{ flex: 1 }}>
          <Camera
            ref={(r) => {
              camera = r;
            }}
            style={{ flex: 1 }}
            autoFocus={true}
            flashMode={
              flashOn
                ? Camera.Constants.FlashMode.torch
                : Camera.Constants.FlashMode.off
            }
          >
            <View
              style={{
                flex: 20,
                marginTop: 10,
                flexDirection: "row-reverse",
                marginLeft: 20,
              }}
            >
              <TouchableOpacity
                style={{
                  justifyContent: "center",
                  backgroundColor: SuinpacRed,
                  opacity: 0.5,
                  height: 40,
                  width: 40,
                  borderRadius: 50,
                }}
                onPress={() => {
                  setOnCamera(false);
                }}
              >
                <Icon
                  tvParallaxProperties
                  name="cancel"
                  color={iconColorBlue}
                ></Icon>
              </TouchableOpacity>
            </View>
            <View
              style={{
                flex: 2,
                marginTop: 10,
                flexDirection: "row",
                marginLeft: 20,
              }}
            >
              <TouchableOpacity
                style={{
                  justifyContent: "center",
                  backgroundColor: torchButton,
                  opacity: 0.5,
                  height: 40,
                  width: 40,
                  borderRadius: 50,
                }}
                onPress={() => {
                  setFlashOn(!flashOn);
                }}
              >
                <Icon
                  type="feather"
                  tvParallaxProperties
                  name={flashOn ? "zap" : "zap-off"}
                  color={iconColorBlue}
                ></Icon>
              </TouchableOpacity>
            </View>
            <View style={{ alignItems: "center", marginBottom: 10 }}>
              <TouchableOpacity
                style={{
                  justifyContent: "center",
                  backgroundColor: "white",
                  opacity: 0.5,
                  height: 60,
                  width: 60,
                  borderRadius: 50,
                }}
                onPress={solicitarPermisosCamara}
              >
                <Icon
                  tvParallaxProperties
                  name="camera"
                  color={SuinpacRed}
                ></Icon>
              </TouchableOpacity>
            </View>
          </Camera>
        </View>
      ) : (
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View style={Styles.cardContainer}>
            <View
              style={[
                errorUi.includes("T,") ? Styles.errorDatos : {},
                { flex: 0.2 },
              ]}
            >
              {/* NOTE:: Area Administrativa */}
              
            </View>

            <View
              style={[Styles.bachesCard, { borderRadius: 25, marginTop: 5 }]}
            >
              {/* NOTE:: Direccion del defecto */}
              <View style={Styles.cardHeader}>
                <View style={Styles.cardHeaderText}>
                  <View style={Styles.cardRpundedIcon}></View>
                  <Text
                    style={{
                      textAlign: "center",
                      marginLeft: 15,
                      fontSize: 15,
                      fontWeight: "bold",
                    }}
                  >
                    Direccion Actual
                  </Text>
                </View>
              </View>
              <View style={[Styles.cardTextView]}>
                <Text
                  style={[
                    Styles.textMultiline,
                    errorUi.includes("S,") ? Styles.errorDatos : {},
                  ]}
                >
                  {direccion}
                </Text>
              </View>
              <View style={Styles.cardFoteer}>
                <View style={Styles.cardLocateBtn}>
                  <TouchableOpacity
                    style={{ marginLeft: 45 }}
                    onPress={obtenerDireccionActuales}
                  >
                    <Icon
                      color={DarkPrimaryColor}
                      size={25}
                      tvParallaxProperties
                      name="street-view"
                      type="font-awesome-5"
                      style={{ marginLeft: 45 }}
                    />
                  </TouchableOpacity>
                </View>
                <View
                  style={{
                    flex: 1,
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <TouchableOpacity
                    style={{}}
                    onPress={() => {
                      setDireccion("");
                    }}
                  >
                    <Icon
                      size={20}
                      color={DarkPrimaryColor}
                      tvParallaxProperties
                      name="trash-alt"
                      type="font-awesome-5"
                      style={{ marginRight: 45 }}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>


            
            <View style={{ flex: 6 }}>
        
              <View style={{ flex: 1, padding: 20 }}>
                <View>
                  <TextInput
                    onChangeText={(text) => {
                      setContrato(text);
                    }}
                    value={contrato}
                    placeholder="Contrato"
                    multiline
                    numberOfLines={2}
                    style={[
                      Styles.bachesTextInput,
                      errorUi.includes("R,") ? Styles.errorDatos : {},
                    ]}
                  ></TextInput>
                </View>
                <View>
                  <TextInput
                    onChangeText={(text) => {
                      setClave(text);
                    }}
                    value={clave}
                    placeholder="Clave"
                    multiline
                    numberOfLines={2}
                    style={[
                      Styles.bachesTextInput,
                      errorUi.includes("R,") ? Styles.errorDatos : {},
                    ]}
                  ></TextInput>
                </View>

                <View>
                  <TextInput
                    onChangeText={(text) => {
                      setClasificacion(text);
                    }}
                    value={clasificacion}
                    placeholder="Clasificación"
                    multiline
                    numberOfLines={2}
                    style={[
                      Styles.bachesTextInput,
                      errorUi.includes("R,") ? Styles.errorDatos : {},
                    ]}
                  ></TextInput>
                </View>
                <View>
                  <TextInput
                    onChangeText={(text) => {
                      setVoltaje(text);
                    }}
                    value={voltaje}
                    placeholder="Voltaje"
                    multiline
                    numberOfLines={2}
                    style={[
                      Styles.bachesTextInput,
                      errorUi.includes("R,") ? Styles.errorDatos : {},
                    ]}
                  ></TextInput>
                </View>

<Picker></Picker>

           
                      {/* NOTE: Seccion de galeria */}
              <View style={Styles.cardTextView}>
                {/* INDEV: Lista de imagenes */}
                <ImageViewer
                  RenderItem={_renderItem()}
                  Selected={imagenSeleccionada}
                  EliminarImagen={eliminarFoto}
                  AgregarImagen={iniciarCamara}
                  MaximizarImagen={() => {
                    setModalImagenVisible(true);
                  }}
                  MostrarMensaje={arrayImageEncode.length == 0}
                />
              </View>
                <Button
                  icon={{
                    name: "save",
                    type: "font-awesome",
                    size: 15,
                    color: "white",
                  }}
                  title={" Guardar Reporte"}
                  buttonStyle={[Styles.btnButtonLoginSuccess]}
                  onPress={verificarDatos}
                />
              </View>
            </View>
          </View>
        </ScrollView>
      )}
      <Message
        transparent={true}
        loading={showMessage}
        loadinColor={BlueColor}
        onCancelLoad={() => {
          setSHowMessage(false);
        }}
        icon={messageIcon}
        iconsource={"font-awesome-5"}
        color={BlueColor}
        message={errorMsg}
        tittle={headerMessage}
        buttonText={"Aceptar"}
      />
      <Loading
        loading={loading}
        loadinColor={DarkPrimaryColor}
        message={loadingMessage}
        onCancelLoad={() => {
          setLoading(false);
        }}
        tittle={"Cargando"}
        transparent={true}
      />
      <ImageView
        images={arrayImageEncode}
        imageIndex={indexImagenSeleccionada}
        visible={modalImagenVisible}
        onRequestClose={() => {
          setModalImagenVisible(false);
        }}
      />
    </View>
  );
}
