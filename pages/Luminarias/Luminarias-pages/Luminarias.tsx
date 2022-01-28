import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Modal,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from "react-native";
import { Text, Icon, Card } from "react-native-elements";
import { Camera } from "expo-camera";
import { Picker } from "@react-native-picker/picker";
import Styles from "../../../Styles/BachesStyles";
import {
  CordenadasActualesNumerico,
  ObtenerDireccionActual,
} from "../../../utilities/utilities";
import { iconColorBlue, SuinpacRed, torchButton } from "../../../Styles/Color";
import {
  cardColor,
  BlueColor,
  DarkPrimaryColor,
} from "../../../Styles/BachesColor";
import * as Location from "expo-location";
import Loading from "../../components/modal-loading";
import Message from "../../components/modal-message";
import { StorageService } from "../../controller/storage-controller";
import { CatalogoLuminarias } from "../../controller/api-controller";
const storage = new StorageService();





import {
  OK,
  DESCONOCIDO,
  WIFI_OFF,
  INFO,
  ERROR,
  CAMERA,
} from "../../../Styles/Iconos";
import { Button } from "react-native-elements/dist/buttons/Button";
export default function Luminarias(props: any) {
  const [tipoEstadoFisico, setTipoEstadoFisico] = useState([]);
  const [selectEstadoFisico, setSelectEstadoFisico] = useState(String);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorUi, setErrorUi] = useState(String);
  const [observaciones, setObservaciones] = useState(String);
  //NOTE: message title
  const [messageIcon, setMessageIcon] = useState("info");
  const [headerMessage, setHeaderMessage] = useState("Mensaje");
  //-------------------
  const [camaraActiva, setCamaraActiva] = useState(false);
  const [activarFlash, setActivarFlash] = useState(false);
  const [TituloMensaje, setTituloMensaje] = useState("Mensaje");
  const [ErrorMensaje, setErrorMensje] = useState(String);
  const [IconoMensaje, setIconoMensaje] = useState(String);
  const [MostrarMensaje, setMostrarMensaje] = useState(String);
  const [arrayImageEncode, setarrayImageEncode] = useState([]);
  const [PermisosCamera, setPermisosCamara] = useState(false);
  const [coordenadas, setCoordenadas] = useState();
  const [coords, setCoords] = useState(null);
  const [direccion, setDireccion] = useState("");
  const [direccionEnviar, setDireccionEnviar] = useState(String);
  const [errorMsg, setErrorMsg] = useState("");
  const [showMessage, setSHowMessage] = useState(false);
  const [indexImagenSeleccionada, setIndexImagenSeleccionada] = useState(-1);
  const [modalImagenVisible, setModalImagenVisible] = useState(false);

  let Camara: Camera;
  const MostrarCamara = () => {
    console.log("Esto es un ejemplo de un presable");
    setCamaraActiva(true);
  };

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      storage.createOpenDB();
      storage.createTables();
      await CatalogoLuminarias().then();
      storage.leerCatalogoLuminarias();
      let estados = await storage.leerEstadoFisco();
      //let arrayEstado = JSON.parse(String(estados));
      //console.log(arrayEstado)
      // setTipoEstadoFisico(arrayEstado);
    })();
  }, []);
  const solicitarPermisosCamara = async () => {
    //NOTE: pedir Persmisos antes de lanzar la camara
    try {
      let { status } = await Camera.requestCameraPermissionsAsync(); //ESto Solo es para requerir permisos
      if (status === "granted") {
        setCamaraActiva(true);
      } else {
      }
    } catch (error) {
      console.log(error);
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
  const __takePicture = async () => {
    if (arrayImageEncode.length <= 2) {
      if (PermisosCamera) {
        if (!Camara) {
          __takePicture();
          return;
        }
        const photo = await Camara.takePictureAsync({
          base64: true,
          quality: 0.4,
        });
        photo.uri;
        setarrayImageEncode((arrayImageEncode) => [...arrayImageEncode, photo]);
        setCamaraActiva(false);
        let coordenadas = await CordenadasActualesNumerico();
        //setCoords(coordenadas);
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
        //setDireccionEnviar(`${DireccionActual.region}  ${DireccionActual.city} ${DireccionActual.district} ${DireccionActual.street} ${DireccionActual.postalCode}`);
        //setDireccion(formatoDireccion);
      } else {
        let { status } = await Camera.requestCameraPermissionsAsync();
        //setCameraPermision(status === "granted");
      }
    }
    //setLoading(false);
  };

  return (
    <View style={Styles.TabContainer}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={Styles.cardContainer}>
          <View style={[Styles.bachesCard, { borderRadius: 25, marginTop: 5 }]}>
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
                    style={{ marginLeft: "15%" }}
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
                    style={{ marginRight: "75%" }}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View style={{ flex: 6 }}>
            <View style={{ margin: 10 }}>
              <TextInput
                autoCorrect={false}
                placeholder={"Clave Del Padrón"}
                style={{
                  borderColor: cardColor,
                  borderWidth: 1,
                  backgroundColor: cardColor + "40",
                  padding: 3,
                  marginTop: 10,
                }}
              />
              <TextInput
                autoCorrect={false}
                placeholder={"Lectura Anterior"}
                style={{
                  borderColor: cardColor,
                  borderWidth: 1,
                  backgroundColor: cardColor + "40",
                  padding: 3,
                  marginTop: 20,
                }}
              />
              <TextInput
                autoCorrect={false}
                placeholder={"Lectura Actual"}
                style={{
                  borderColor: cardColor,
                  borderWidth: 1,
                  backgroundColor: cardColor + "40",
                  padding: 3,
                  marginTop: 20,
                }}
              />
              <TextInput
                autoCorrect={false}
                placeholder={"Consumo"}
                style={{
                  borderColor: cardColor,
                  borderWidth: 1,
                  backgroundColor: cardColor + "40",
                  padding: 3,
                  marginTop: 20,
                }}
              />
              <TextInput
                autoCorrect={false}
                placeholder={"Estado"}
                style={{
                  borderColor: cardColor,
                  borderWidth: 1,
                  backgroundColor: cardColor + "40",
                  padding: 3,
                  marginTop: 20,
                }}
              />
              <TextInput
                onChangeText={(text) => {
                  setObservaciones(text);
                }}
                value={observaciones}
                placeholder="Observaciones Del Medidor"
                multiline
                numberOfLines={5}
                style={[
                  Styles.bachesTextInput,
                  errorUi.includes("D,") ? Styles.errorDatos : {},
                ]}
              ></TextInput>

              <Picker
                onValueChange={(itemValue, itemIndex) => {
                  setSelectEstadoFisico(String(itemValue));
                }}
              >
                {tipoEstadoFisico == null ? (
                  <Picker.Item
                    label={"Cargando.."}
                    value={-1}
                    key={"-1"}
                  ></Picker.Item>
                ) : (
                  tipoEstadoFisico.map((item) => {
                    return (
                      <Picker.Item
                        label={item.Descripcion}
                        value={item.clave}
                        key={String(item.clave)}
                      ></Picker.Item>
                    );
                  })
                )}
              </Picker>

              <Button
                icon={{
                  name: "save",
                  type: "font-awesome",
                  size: 15,
                  color: "white",
                }}
                title={" Guardar "}
                buttonStyle={[Styles.btnButtonLoginSuccess]}
              />
            </View>
          </View>
        </View>
      </ScrollView>
      {/** NOTE: modal para la camara  */}
      <Modal
        style={{ flex: 1, backgroundColor: "#000000" }}
        transparent={false}
        visible={false}
      >
        <Camera
          ref={(r) => {
            Camara = r;
          }}
          style={{ flex: 1 }}
          autoFocus={true}
          flashMode={
            activarFlash
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
                setCamaraActiva(false);
              }}
            >
              <Icon tvParallaxProperties name="cancel" color={iconColorBlue} />
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
                setActivarFlash(!activarFlash);
              }}
            >
              <Icon
                type="feather"
                tvParallaxProperties
                name={activarFlash ? "zap" : "zap-off"}
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
              onPress={() => {
                PermisosCamera;
              }}
            >
              <Icon
                tvParallaxProperties
                name="camera"
                color={SuinpacRed}
              ></Icon>
            </TouchableOpacity>
          </View>
        </Camera>
      </Modal>
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
