import React, { useState, useEffect, useRef } from "react";
import Styles from "../../Styles/BachesStyles";
import {
  TouchableOpacity,
  View,
  Image,
  Dimensions,
  Alert,
  ScrollView,
  TextInput,
} from "react-native";
import {
  BlueColor,
  cardColor,
  DarkPrimaryColor,
} from "../../Styles/BachesColor";
import { Text, Icon, Card, Button } from "react-native-elements";
import { Picker } from "@react-native-picker/picker";
import Carousel, { Pagination } from "react-native-snap-carousel";
import { Camera } from "expo-camera";
import {
  checkConnection,
  CordenadasActualesNumerico,
  ObtenerDireccionActual,
} from "../../utilities/utilities";
import { iconColorBlue, SuinpacRed, torchButton } from "../../Styles/Color";
import * as Location from "expo-location";

import {
  CatalogoSolicitud,
  EnviarReportes,
} from "../controller/api-controller";
import { StorageBaches } from "../controller/storage-controllerBaches";
import Loading from "../components/modal-loading";
import Message from "../components/modal-message";
import RNPickerDialog from "rn-modal-picker";
import {
  OK,
  DESCONOCIDO,
  WIFI_OFF,
  INFO,
  ERROR,
  CAMERA,
} from "../../Styles/Iconos";
import ImageViewer from '../components/image-view';
export default function Reportar(props: any) {
  const storage = new StorageBaches();
  const caorusel = React.useRef(null);
  const [cameraPermissions, setCameraPermision] = useState(false);
  const [arrayImageEncode, setArrayImageEncode] = useState([]);
  const [arrayDataList, setArrayDataList] = useState([]);
  const SLIDER_WIDTH = Dimensions.get("window").width;
  const ITEM_WIDTH = Math.round(SLIDER_WIDTH * 0.9);
  const ITEM_HEIGHT = Math.round((ITEM_WIDTH * 3) / 4);
  const [activeIndex, setActiveIndex] = useState(0);
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
  const [referencia, setReferencia] = useState(String);
  const [observaciones, setObservaciones] = useState(String);
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
  let camera: Camera;
  let dataListSolicitudes=[];

  const [Color, setColor] = useState("");
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      let arrayAreasSolicitud = await CatalogoSolicitud();
      
      dataListSolicitudes= arrayAreasSolicitud.map(elemento=>{
       return {id:elemento.id,name:elemento.descripci_on};
      });
      setArrayDataList(dataListSolicitudes);
      setCatalogoSolicitud(arrayAreasSolicitud);
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
  const _renderItem = ({ item, index }) => {
    return (
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          marginTop: 20,
        }}
      >
        <TouchableOpacity
          onLongPress={() => {
            eliminarEvidencia(item.uri);
          }}
        >
          <Card>
            <Image
              source={{ uri: item.uri }}
              style={{ width: 200, height: 300 }}
            />
          </Card>
        </TouchableOpacity>
      </View>
    );
  };
  const pagination = () => {
    return (
      <Pagination
        activeDotIndex={activeIndex}
        dotsLength={arrayImageEncode.length}
        containerStyle={{}}
        dotStyle={{
          width: 5,
          height: 5,
          borderRadius: 2,
          marginHorizontal: 8,
          backgroundColor: SuinpacRed,
        }}
        inactiveDotOpacity={0.4}
        inactiveDotScale={0.6}
      />
    );
  };
  const selectedItem = {
    title: "Selected item title",
    description: "Secondary long descriptive text ...",
  };
  const __takePicture = async () => {
    if (arrayImageEncode.length <= 2) {
      if (cameraPermissions) {
        if (!camera) {
          __takePicture();
          return;
        }
        const photo = await camera.takePictureAsync({
          base64: true,
          quality: 0.4,
        });
        photo.uri;
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

    /*
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
    );*/
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
      Descripcion: observaciones,
      gps: JSON.stringify(coords),
      direccion: direccionEnviar,
      Referencia: referencia,
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
    seleccionSolicitud == "-1" ? (error += "T,") : error;
    arrayImageEncode.length == 0 ? (error += error += "E,") : error;
    referencia == "" ? (error += "R,") : error;
    observaciones == "" ? (error += "D,") : error;
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
      GuardarReporte();
    }
  };
  const limpiarPantalla = () => {
    setSeleccionSolicitud("");
    setDireccion("");
    setCoords(null);
    setArrayImageEncode([]);
    setReferencia("");
    setObservaciones("");
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
  const eliminarEvidencia = (uri: String) => {
    //NOTE: lanzamos el modal para eliminar
    Alert.alert("Mensaje", " ¿ Eliminar Imagen ?", [
      {
        text: "Aceptar",
        onPress: () => {
          setArrayImageEncode(
            arrayImageEncode.filter((item) => item.uri !== uri)
          );
        },
        style: "cancel",
      },
      {
        text: "Cancelar",
        onPress: () => {},
        style: "default",
      },
    ]);
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
              <View>
                <RNPickerDialog
                  data={arrayDataList}
                  searchBarPlaceHolder={"Buscar..."}
                  pickerTitle={"Temario de la solicitud"}
                  labelText={"Temario de la solicitud"}
                  showSearchBar={true}
                  changeAnimation='fade'
                  searchBarPlaceHolderColor={BlueColor}
                  showPickerTitle={true}
                  selectedValue={(index, item) => this.selectedValue(index, item)}

                ></RNPickerDialog>
              </View>

              <Picker
                style={{
                  backgroundColor: BlueColor,
                  color: "#FFFF",
                  marginLeft: 15,
                  marginRight: 15,
                  borderRadius: 90,
                  height: 10,
                  marginBottom: 50,
                }}
                selectedValue={seleccionSolicitud}
                onValueChange={(itemValue, itemIndex) => {
                  setSeleccionSolicitud(String(itemValue));
                }}
              >
                <Picker.Item
                  //style={{color:'#FFFF', backgroundColor:BlueColor,margin:0}}
                  label=" Temario de solicitud "
                  value={-1}
                ></Picker.Item>
                {catalogoSolicitud.map((item, index) => {
                  return (
                    <Picker.Item
                      key={item.id}
                      label={item.descripci_on}
                      value={item.id}
                    ></Picker.Item>
                  );
                })}
              </Picker>
            </View>
            <View style={[Styles.bachesCard, { marginTop: 5 }]}>
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
                    style={{}}
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
              {/* NOTE: Seccion de galeria */}
              <View style={Styles.cardTextView}>
                  {/* NOTE: Carrusel */}
                  <ImageViewer

                  
                  />
                </View>
              <View style={{ flex: 1, padding: 20 }}>
                <Button
                  icon={{
                    name: "camera",
                    type: "font-awesome",
                    size: 15,
                    color: "white",
                  }}
                  onPress={iniciarCamara}
                  title={" Tomar Evidencia"}
                  disabled={habilitarBotonFotos}
                  buttonStyle={[
                    Styles.btnButtonSuccessSinPading,
                    errorUi.includes("E,") ? Styles.errorDatos : {},
                  ]}
                />
                <View>
                  <TextInput
                    onChangeText={(text) => {
                      setReferencia(text);
                    }}
                    value={referencia}
                    placeholder="Referencia"
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
                      setObservaciones(text);
                    }}
                    value={observaciones}
                    placeholder="Descripción"
                    multiline
                    numberOfLines={5}
                    style={[
                      Styles.bachesTextInput,
                      errorUi.includes("D,") ? Styles.errorDatos : {},
                    ]}
                  ></TextInput>
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
    </View>
  );
}
