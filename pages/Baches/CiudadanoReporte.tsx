import React, { useState, useEffect, useRef, Component } from "react";
import Styles from "../../Styles/BachesStyles";
import {
  TouchableOpacity,
  View,
  Image,
  Dimensions,
  Alert,
  ScrollView,
  TextInput,
  Platform,
  Linking,
} from "react-native";
import { BlueColor, cardColor, DarkPrimaryColor } from "../../Styles/BachesColor";
import { Text, Icon, Button, Card } from "react-native-elements";
import Carousel, { ParallaxImage } from 'react-native-snap-carousel';
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
import {
  OK,
  DESCONOCIDO,
  WIFI_OFF,
  INFO,
  ERROR,
  CAMERA,
  APPSETTINGS,
  ADDPHOTO
} from "../../Styles/Iconos";
import DropDownPicker from 'react-native-dropdown-picker';
import ImageView from "react-native-image-viewing";
import ImageViewer from "../components/image-view";
import { SafeAreaView } from "react-native-safe-area-context";
export default function Reportar(props: any) {
  const storage = new StorageBaches();
  const [cameraPermissions, setCameraPermision] = useState(false);
  const [arrayImageEncode, setArrayImageEncode] = useState([]);
  const [flashOn, setFlashOn] = useState(false);
  const [onCamera, setOnCamera] = useState(false);
  const [coords, setCoords] = useState(null);
  const [direccion, setDireccion] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
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
  const [imagenSeleccionada, setImagenSeleccionada] = useState("");
  const [indexImagenSeleccionada, setIndexImagenSeleccionada] = useState(0);
  const [modalImagenVisible, setModalImagenVisible] = useState(false);
  const { width: screenWidth } = Dimensions.get('window')
  //NOTE: manejadores del picker
  const [ pickerAbierto, setPikcerAbierto ] = useState(false);
  const [ FuenteIcono, setFuenteIcono ] = useState(String);
  //NOTE: variable que identifica los datos
  const [existeCiudadano , setExisteCiudadano ] = useState(false);
  

  let camera: Camera;
  let dataListSolicitudes = [];
  useEffect(()=>{
    props.navigation.addListener('focus', VerificaSession );
  });

  useEffect(() => {
    (async () => { 
      if(existeCiudadano){
        //NOTE: verificamos los datos de alida
        let { status } = await Location.requestForegroundPermissionsAsync();
        let arrayAreasSolicitud = await CatalogoSolicitud();
        dataListSolicitudes = arrayAreasSolicitud.map((elemento) => {
          //NOTE: Obtenemos los datos del catalog
          return  { 
            label: elemento.descripci_on , 
            value: elemento.id,
            key: elemento.id
        };
        });
        setCatalogoSolicitud(dataListSolicitudes);
        if (status !== "granted") {
          setErrorMsg("Permisos negados");
          return;
        }
      }else{
        setErrorUi("");
        limpiarPantalla();
      }
      setLoading(false);
    })();
  }, [existeCiudadano]);

  //INDEV: render con hooks
  const VerificaSession = async () =>{
    let ciudadano = await storage.obtenerDatosPersona();
    setExisteCiudadano( ciudadano != null );
  }
  const iniciarCamara = async () => {
    if(arrayImageEncode.length <= 2) {
      setOnCamera(true);
    }else{
      setOnCamera(false);
      setMessageIcon(ADDPHOTO[0]);
      setIconSource(ADDPHOTO[1]);
      setHeaderMessage("Mensaje");
      setErrorMsg("Limite de evidencia alcanzada (Maximo 3)");
      setSHowMessage(true);
    }
  };
  const __takePicture = async () => {
    if (arrayImageEncode.length <= 2) {
      if (cameraPermissions) {
        if (!camera) {
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
  const GuardarReporte = async () => {
    setLoading(true);
    let connection = checkConnection();
    let ciudadano = await storage.obtenerIdCiudadano();
    let cliente = await storage.obtenerCliente();
    let arrayImages = new Array();
    if (connection) {
      arrayImageEncode.map((item, index) => {
        arrayImages.push("data:image/jpeg;base64," + item.base64);
      });
    } else {
      arrayImageEncode.map((item, index) => {
        arrayImages.push(item.uri);
      });
    }
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
    if (error != "") {
      console.log(error);
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
    setImagenSeleccionada("");
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
        //NOTE: verifiamos el tamanio de las fotos
        await __takePicture();
      } else {
        //NOTE: lanzamos un un mensaje de permisos 
        setMessageIcon(CAMERA[0]);
        setFuenteIcono(CAMERA[1]);
        setErrorMsg("La apliacion necesita permisos para acceder a la camara");
        setHeaderMessage("Mensaje");
        setSHowMessage(true);
        setOnCamera(false);
        
      }
    } catch (error) {
      console.log(error);
    }
  };
  const eliminarFoto = () => {
    console.log(indexImagenSeleccionada);
    if( arrayImageEncode[indexImagenSeleccionada] == undefined ){
      setArrayImageEncode([]);
      setIndexImagenSeleccionada(0);
    }else{
      setArrayImageEncode( arrayImageEncode.filter((item) => item.uri !== arrayImageEncode[indexImagenSeleccionada].uri ));
    }
    
  };
  const GenerarCamara = ( ) => {
    return <View style={{ flex: 1 }}>
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
  }
  const renderItem = ({item, index}, parallaxProps) => {
    let evidencia = `${(index + 1)}/${ arrayImageEncode.length }`;  
    return (
      <View style = {{alignItems:"center"}}>
        <Card>
          <Card.Title> {evidencia} </Card.Title>
          <Card.Image
             source={{uri: item.uri}}
             containerStyle = {{    flex: 1,
               marginBottom: Platform.select({ios: 0, android: 1}), // Prevent a random Android rendering issue
               backgroundColor: 'white',
               borderRadius: 8,
               paddingBottom:5 }}
               style = {{height:200,width:200}}
             parallaxFactor={0.4}
             onPress = {()=>{setModalImagenVisible(true)}}
             {...parallaxProps}
          ></Card.Image>
          <Card.Divider/>
          <Button onPress={ eliminarFoto } title={"Eliminar"} />
        </Card>
      </View>
    );
  }
  return (
      <SafeAreaView style = {{flex:1, flexDirection:"row"}} >
        {
          onCamera ? GenerarCamara() :
          <ScrollView style = {{flexGrow:1}} >
            <View style = {{flex:1}} >
              <View style = {{flex:2}} >
                {/* Generamos el picker*/ }
                <DropDownPicker
                    disabled = { !existeCiudadano }
                    language="ES"
                    containerStyle = {{ borderWidth: errorUi.includes("T,") ? 3 : 0, borderColor:"red", borderRadius:10, padding:15 }}
                    style = {{borderColor: errorUi.includes("T,") ? "red" : cardColor, borderWidth:1}}
                    items = { catalogoSolicitud }
                    setOpen = { setPikcerAbierto }
                    open = { pickerAbierto }
                    setValue={ setSeleccionSolicitud }
                    value = { seleccionSolicitud }
                    min =  {10}
                    max = {15}
                    listMode = {"MODAL"}
                    listItemContainerStyle = {{padding:10}}
                    itemSeparator = {true}
                    selectedItemContainerStyle = { {backgroundColor:BlueColor + 45 } }
                    selectedItemLabelStyle = {{ fontWeight:"bold" }}
                    placeholder = {"Seleccione Tema"}
                  />
              </View>
              <View style = {{flex:4}} >
                <View style = {{flex:1,justifyContent:"center", alignContent:"center"}} >
                  <TextInput
                        editable = { false }
                        multiline = {true}
                        style={ [ { textAlign:"center", fontWeight:"bold", color:"black" }] }

                      >{ `Mi direcciòn` }</TextInput>
                </View>
                <View style = {{flex:1}} >
                  <TextInput 
                    editable = {false}
                    multiline = {true}
                    numberOfLines={5}
                    
                    style={ [ Styles.inputBachees ,{ textAlign: existeCiudadano ? "left" : "center", fontWeight:"bold", color: existeCiudadano ? "black" : "red", borderColor: cardColor,borderWidth:1 , marginLeft:25, marginRight:25, borderRadius:10, padding:5}] }
                  >
                    { existeCiudadano ? direccion : "Favor de iniciar session" }
                  </TextInput>
                </View>
              </View>
              <View style = {{ flex:4 }}>
              <Carousel
                sliderWidth={screenWidth}
                sliderHeight={screenWidth}
                itemWidth={screenWidth - 60}
                data={arrayImageEncode}
                renderItem = { renderItem }
                onSnapToItem = {indexs => setIndexImagenSeleccionada(indexs) }
                hasParallaxImages={true}
            />
              </View>
              <View style = {{paddingLeft:20, paddingRight:20}} >
              <Button
                  disabled = {!existeCiudadano}
                  icon={{
                    name: "camera",
                    type: "font-awesome",
                    size: 15,
                    color: "white",
                  }}
                  title={"Capturar"}
                  buttonStyle={[Styles.btnButtonLoginSuccess,{ borderColor:"red", borderWidth: errorUi.includes("E,") ? 2 : 0 }]}
                  onPress={iniciarCamara}
                />
              </View>
              <View style = {{flex:4}} >
                <View  style = {{ paddingLeft:25, paddingRight:25 }} >
                  <TextInput
                    editable = { existeCiudadano }
                    onChangeText={(text) => {
                        setReferencia(text);
                    }}
                    value={referencia}
                    placeholder="Referencia"
                    multiline
                    numberOfLines={2}
                    style={[
                      Styles.inputBachees,
                      errorUi.includes("R,") ? Styles.errorDatos : {},]}
                    ></TextInput>
                </View>
                <View style = {{ paddingLeft:25, paddingRight:25 }} >
                  <TextInput
                      onChangeText={(text) => {
                        setObservaciones(text);
                      }}
                      editable = { existeCiudadano }
                      value={observaciones}
                      placeholder="Descripción"
                      multiline
                      numberOfLines={5}
                      style={[
                        Styles.inputBachees,
                        errorUi.includes("D,") ? Styles.errorDatos : {},
                      ]}
                    ></TextInput>
                </View>
              </View>
              <Text></Text>
              <View style = {{paddingLeft:20, paddingRight:20}} >
              <Button
                  icon={{
                    name: "save",
                    type: "font-awesome",
                    size: 15,
                    color: "white",
                  }}
                  disabled = {!existeCiudadano}
                  title={" Guardar Reporte"}
                  buttonStyle={[Styles.btnButtonLoginSuccess]}
                  onPress={verificarDatos}
                />
              </View>
            </View>
            <Text></Text>
            <Message
              transparent={true}
              loading={showMessage}
              loadinColor={BlueColor}
              onCancelLoad={() => {
                setSHowMessage(false);
              }}
              icon={messageIcon}
              iconsource={FuenteIcono}
              color={BlueColor}
              message={errorMsg}
              tittle={headerMessage}
              buttonText={"Aceptar"}
            />
          <Loading
            loading={ loading }
            loadinColor={DarkPrimaryColor}
            message={ loadingMessage }
            onCancelLoad={() => {
              setLoading(false);
            }}
            tittle={"Cargando"}
            transparent={existeCiudadano}
          />
          <ImageView
            images={arrayImageEncode}
            imageIndex={indexImagenSeleccionada}
            visible={modalImagenVisible}
            onRequestClose={() => {
              setModalImagenVisible(false);
            }}
            swipeToCloseEnabled={false}
            FooterComponent={({ imageIndex }) => (
              <View style = {{flex:1, alignItems:"center", marginBottom:"5%"}} >
                  <View >
                      <Text style = {{color:"white", fontWeight:"bold", fontSize:16}} >{`${ imageIndex + 1 }/${arrayImageEncode.length}`}</Text>
                  </View>
              </View>
          )}
          />
          {/**Mesaje para los solicitar los permisos desde la aplicacion*/}
          <Message
            transparent={true}
            loading={showMessage}
            loadinColor={BlueColor}
            onCancelLoad={() => { 
              setSHowMessage(false);
              if(errorMsg.includes("La apliacion necesita permisos para acceder a la camara"))
                Linking.openSettings();
            }}
            
            icon={messageIcon}
            iconsource={FuenteIcono}
            color={BlueColor}
            message={errorMsg}
            tittle={headerMessage}
            buttonText={"Aceptar"}
          />

          </ScrollView> 
        }
      </SafeAreaView>
  );
}
