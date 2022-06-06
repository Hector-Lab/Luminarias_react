import React, { useState, useEffect, useRef, Component } from "react";
import {
  TouchableOpacity,
  View,
  Dimensions,
  ImageBackground,
  Text
} from "react-native";
import { Form, Formik, useFormik } from 'formik';
import Style from '../../Styles/styles';
import * as Yup from 'yup';
import { Camera } from "expo-camera";
import * as Location from "expo-location";
import { CatalogoSolicitud } from "../controller/api-controller";
import { StorageBaches } from "../controller/storage-controllerBaches";
import Loading from "../components/modal-loading";
import Message from "../components/modal-message";
import { BlueColor } from '../../Styles/BachesColor';
import { CAMERA, PREVIEW } from "../../Styles/Iconos";
import DropDownPicker from 'react-native-dropdown-picker';
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView, TextInput } from "react-native-gesture-handler";
import { Icon } from "react-native-elements";

const validacion = Yup.object().shape({
  Referencia: Yup.string().required(),
  Descripcion: Yup.string().required()
});
let initialValues = {
  Referencia: "",
  Descripcion: ""
};

export default function Reportar(props: any) {
  const storage = new StorageBaches();
  const [cameraPermissions, setCameraPermision] = useState(false);
  //NOTE: message title
  const [showMessage, setSHowMessage] = useState(false);
  const [messageIcon, setMessageIcon] = useState("info");
  const [headerMessage, setHeaderMessage] = useState("Mensaje");
  //NOTE: modal loading
  const [loadingMessage, setLoadingMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [imagenSeleccionada, setImagenSeleccionada] = useState("");
  const [indexImagenSeleccionada, setIndexImagenSeleccionada] = useState(0);
  const [modalImagenVisible, setModalImagenVisible] = useState(false);
  const { width: screenWidth } = Dimensions.get('window')
  //NOTE: manejadores del picker
  const [pickerAbierto, setPikcerAbierto] = useState(false);
  const [FuenteIcono, setFuenteIcono] = useState(String);
  const [catalogoSolicitud, setCatalogoSolicitud] = useState([]);
  const [seleccionSolicitud, setSeleccionSolicitud] = useState(String);
  let camera: Camera;

  let formik = useFormik({
    initialValues: initialValues,
    onSubmit: () => { },
    validationSchema: validacion
  });

  useEffect(() => {
    obtenerTemas();
  }, []);


  const iniciarCamara = async () => {
    /*if (arrayImageEncode.length <= 2) {
      setOnCamera(true);
    } else {
      setOnCamera(false);
      setMessageIcon(ADDPHOTO[0]);
      setIconSource(ADDPHOTO[1]);
      setHeaderMessage("Mensaje");
      setErrorMsg("Límite de evidencia alcanzada (Máximo 3)");
      setSHowMessage(true);
    }*/
  };
  const obtenerTemas = async () => {
    await CatalogoSolicitud()
      .then((catalogo) => {
        let listaSolicitudes = catalogo.map((elemento, index) => {
          return {
            label: elemento.descripci_on,
            value: elemento.id,
            key: elemento.id
          };
        });
        console.log(listaSolicitudes);
        setCatalogoSolicitud(listaSolicitudes);
      })
      .catch((error) => {
        console.log(error);
      })
  }
  const __takePicture = async () => {
    /*if (arrayImageEncode.length <= 2) {
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
          Código Postal: ${DireccionActual.postalCode}
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
    setLoading(false);*/
  };
  const GuardarReporte = async () => {
    /*setLoading(true);
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
          setIconSource(DESCONOCIDO[1]);
          setMessageIcon(DESCONOCIDO[0]);
        }
        setErrorMsg(mensaje);
        setSHowMessage(true);
      })
      .finally(() => {
        setLoading(false);
      });*/
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
        //setErrorMsg("La aplicación necesita permisos para acceder a la cámara");
        setHeaderMessage("Mensaje");
        setSHowMessage(true);
        //setOnCamera(false);
      }
    } catch (error) {
      //setOnCamera(false);
    }
  };
  const GenerarCamara = () => {
    /*
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
    */
  }
  const renderItem = ({ item, index }, parallaxProps) => {
    /*
    let evidencia = `${(index + 1)}/${arrayImageEncode.length}`;
    return (
      <View style={{ alignItems: "center" }}>
        <Card>
          <Card.Title> {evidencia} </Card.Title>
          <Card.Image
            source={{ uri: item.uri }}
            containerStyle={{
              flex: 1,
              marginBottom: Platform.select({ ios: 0, android: 1 }), // Prevent a random Android rendering issue
              backgroundColor: 'white',
              borderRadius: 8,
              paddingBottom: 5
            }}
            style={{ height: 200, width: 200 }}
            parallaxFactor={0.4}
            onPress={() => { setModalImagenVisible(true) }}
            {...parallaxProps}
          ></Card.Image>
          <Card.Divider />
          <Button onPress={eliminarFoto} title={"Eliminar"} />
        </Card>
      </View>
    );*/
  }
  return (
    <SafeAreaView style={{ flex: 1, flexDirection: "row" }} >
      <ImageBackground source={require('../../assets/Fondo.jpeg')} style={{ flex: 1 }} >
        <ScrollView>
          <DropDownPicker
            language="ES"
            containerStyle={{ borderRadius: 10, padding: 20 }}
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
          <Formik
            initialValues={{}}
            onSubmit={(values) => { }}
          >
            {() => {
              return <View>
                <Text style={Style.TemaLabalCampo} > Referencea </Text>
                <TextInput style={Style.TemaCampo} placeholder="Entre calles..." ></TextInput>
                <Text style={Style.TemaLabalCampo} > Descripción </Text>
                <TextInput style={[Style.TemaCampo, { textAlignVertical: "top", color: "black" }]} multiline={true} numberOfLines={5}></TextInput>
              </View>
            }}
          </Formik>
          <View>
            {/* INDEV: mostramos un boton para las evidencias */}
            <Text style={{ marginBottom: 10, marginTop: 10, marginLeft: -5, marginRight: 15, color: "black", fontWeight: "bold", justifyContent: "center", alignItems: "center" }}>Foto Evidencia (Opcional)</Text>
            <View style={{ flex: 1, flexDirection: "row" }} >
              <TouchableOpacity style = {{ flex:4, marginLeft:20,marginRight:5 }}>
                <Text style={{ color: "white", textAlign: "center",backgroundColor:BlueColor,padding:15, borderRadius:5   }}> Seleccionar Imagenes </Text>
              </TouchableOpacity>
              <TouchableOpacity style={{ flex: 1, borderRadius: 5, padding: 10, marginBottom: 10, marginRight: 20, borderWidth: 1, borderColor: BlueColor }}>
                <Icon name={PREVIEW[0]} tvParallaxProperties color={BlueColor} type={PREVIEW[1]}></Icon>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>

      </ImageBackground>
    </SafeAreaView >
  );
}
