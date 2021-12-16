import React, { useState, useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Image,
  TextInput,
  Dimensions,
  Vibration,
  Platform,
  Alert,
} from "react-native";
import { Text, Button, Icon, Card } from "react-native-elements";
import Styles from "../../Styles/styles";
import { Input } from "react-native-elements/dist/input/Input";
import { Picker } from "@react-native-picker/picker";
import { TouchableOpacity } from "react-native-gesture-handler";
import Carousel, { Pagination } from "react-native-snap-carousel";
import { Camera } from "expo-camera";
import { iconColorBlue, SuinpacRed, torchButton } from "../../Styles/Color";
import * as Location from "expo-location";
import { StorageService } from "../controller/storage-controller";
const storage = new StorageService();

export default function BachesRegistry(props: any) {
  const [previewVisible, setPreviewVisible] = useState(false);
  const [cameraPermissions, setCameraPermision] = useState(false);
  const [arrayImageLinks, setArrayImageLinks] = useState([]);
  const [arrayImageEncode, setArrayImageEncode] = useState([]);
  const [flashOn, setFlashOn] = useState(false);
  const [onCamera, setOnCamera] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [showBox, setShowBox] = useState(true);
  const caorusel = React.useRef(null);
  const SLIDER_WIDTH = Dimensions.get("window").width;
  const ITEM_WIDTH = Math.round(SLIDER_WIDTH * 0.8);
  const ITEM_HEIGHT = Math.round((ITEM_WIDTH * 3) / 4);
  const fecha = new Date();
  const user = storage.getItem("UserName");
  let [nameUser, setNameUser] = useState("");

  let camera: Camera;
  const [location, setLocation] = useState(null);
  const [direccion, setDireccion] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  let direccionObtenidaCorrectamente = false;

  user
    .then((response) => {
      setNameUser(response);
    })
    .catch((error) => {
      console.log("Error al obtener el nombre del usuario actual " + error);
    });

  const getLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setErrorMsg("Permisos  de ubicacion negados");
    } else {
      let location = await Location.getCurrentPositionAsync({});

      let text = "";
      if (errorMsg) {
        text = errorMsg;
      } else if (location) {
        text = JSON.stringify(location);
        setLocation(location);
        direccionObtenidaCorrectamente = true;
      }
    }
  };
  const getDireccion = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setErrorMsg("Permisos  de ubicacion negados");
    } else {
      let location = await Location.getCurrentPositionAsync({});
      if (!errorMsg && location) {
        let direccion = await Location.reverseGeocodeAsync(location.coords);

        setDireccion(direccion[0]);
      }
    }
  };

  const clearDireccion = () => {
    setDireccion(null);
  };
  useEffect(() => {
    (async () => {
      let { status } = await Camera.requestCameraPermissionsAsync();
      setCameraPermision(status === "granted");
    })();
  });

  const showConfirmDialog = () => {
    Vibration.vibrate(200);
    Alert.alert("", "¿Esta seguro de eliminar la foto?", [
      {
        text: "SI",
        onPress: () => {
          let item = arrayImageEncode[activeIndex]; //INDEV:Aqui se borra de la lista

          //let newarray = array.filter(item => item !== "hello");
          if (arrayImageEncode.length == 1) {
            Vibration.vibrate(100);
            setArrayImageEncode([]);
          } else {
            Vibration.vibrate(100);
            setArrayImageEncode(
              arrayImageEncode.filter(
                (item) => item.uri !== arrayImageEncode[activeIndex].uri
              )
            );
          }
          setShowBox(false);
        },
      },

      {
        text: "NO",
        onPress: () => {
          Vibration.vibrate(100);
          setShowBox(false);
        },
      },
    ]);
  };

  const validarNumeroDeFotos = () => {
    //    console.log(arrayImageEncode.length);
    if (!direccionObtenidaCorrectamente) getLocation();

    if (arrayImageEncode.length < 3) {
      setOnCamera(true);
    } else {
      Alert.alert("INFO", "El número maximo de fotos a registrar es tres.", [
        { text: "Aceptar", onPress: () => console.log("OK Pressed") },
      ]);
    }
  };
  const __takePicture = async () => {
    if (arrayImageEncode.length <= 2) {
      if (cameraPermissions) {
        if (!camera) return;

        const photo = await camera.takePictureAsync({
          base64: true,
          quality: 0.4,
        });
        photo.uri;
        setArrayImageEncode((arrayImageEncode) => [...arrayImageEncode, photo]);
        setOnCamera(false);
      } else {
        let { status } = await Camera.requestCameraPermissionsAsync();
        setCameraPermision(status === "granted");
      }
    }
  };
  const _renderItem = ({ item, index }) => {    
    return (
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          
        }}
      >
        <TouchableOpacity  onLongPress={showConfirmDialog}>
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
          width: 10,
          height: 10,
          borderRadius: 5,
          marginHorizontal: 8,
          backgroundColor: SuinpacRed,
        }}
        inactiveDotOpacity={0.4}
        inactiveDotScale={0.6}
      />
    );
  };
  return (
    <View style={Styles.TabContainer}>
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
                onPress={__takePicture}
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
        <View style={Styles.inputButtons}>
          <KeyboardAvoidingView style={{}}>
            <ScrollView>
              <View style={Styles.box}>
                <Text
                  style={{
                    justifyContent: "center",
                    textAlign: "center",
                    marginBottom: 20,
                    fontStyle: "italic",
                    fontSize: 22,
                  }}
                >
                  {nameUser}
                </Text>

                <Text
                  style={{
                    paddingLeft: 10,
                    fontWeight: "bold",
                    fontSize: 17,
                    textAlign: "center",
                  }}
                >
                  Fecha del Reporte {fecha.toLocaleDateString().toString()}
                </Text>

                <View style={Styles.btbSearch}>
                  <TouchableOpacity
                    style={Styles.btnShortButton}
                    onPress={getDireccion}
                  >
                    <Text style={{color:'white'}}>
                      <Icon
                        tvParallaxProperties
                        type="feather"
                        name="search"
                        size={15}
                        color='white'
                      ></Icon>
                      {"  Obtener Dirección"}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={Styles.btnCancelSearch}
                    onPress={clearDireccion}
                  >
                    <Text>
                      <Icon
                        tvParallaxProperties
                        type="feather"
                        name="trash"
                        size={25}
                        color='white'
                      ></Icon>
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
              <Input
                style={{
                  borderWidth: 1,
                  padding: 5,
                  borderRadius: 5,
                  fontWeight: "bold",
                }}
                editable={false}
                placeholder="País"
                value="México"
                label="País"
              />
              <Input
                style={Styles.inputData}
                placeholder="Localidad"
                value={direccion != undefined ? direccion.city : ""}
                label="Localidad"
              />
              <Input
                style={Styles.inputData}
                value={
                  direccion != undefined && direccion != null
                    ? direccion.street
                    : ""
                }
                placeholder="Calle / Av."
                label="Calle / Av."
              />
              <Input
                style={Styles.inputData}
                value={
                  direccion != undefined && direccion != null
                    ? direccion.district
                    : ""
                }
                placeholder="Colonia / Delegación"
                label="Colonia / Delegación"
              />
              <Input
                style={Styles.inputData}
                value={
                  direccion != undefined && direccion != null
                    ? direccion.postalCode
                    : ""
                }
                placeholder="Código Postal"
                label="Código Postal"
              />
              <Input
                style={Styles.inputData}
                value={
                  direccion != undefined && direccion != null
                    ? direccion.region
                    : ""
                }
                placeholder="Estado"
                label="Estado"
              />
              <Text style={Styles.textFormularios}>Descripción</Text>
              <TextInput style={Styles.textArea} placeholder="Descripción" />

              <Carousel
                ref={caorusel}
                data={arrayImageEncode}
                renderItem={_renderItem}
                sliderWidth={ITEM_WIDTH}
                itemWidth={ITEM_HEIGHT}
                useScrollView={true}
                onSnapToItem={(index) => setActiveIndex(index)}
              ></Carousel>
              {pagination()}
              <TouchableOpacity
                style={Styles.btnButton}
                onPress={validarNumeroDeFotos}
              >
                <Text style={{color:'white'}}>
                  <Icon
                    tvParallaxProperties
                    type="feather"
                    name="camera"
                    size={15}
                    color="white"
                  ></Icon>
                  {"  Tomar Fotografia"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity style={Styles.btnButton} onPress={() => {}}>
                <Text style={{color:'white'}}>
                  <Icon
                    tvParallaxProperties
                    type="feather"
                    name="save"
                    size={15}
                    color="white"
                  ></Icon>
                  {"  Guardar"}
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </KeyboardAvoidingView>
        </View>
      )}
    </View>
  );
}
