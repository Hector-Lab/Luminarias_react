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
  Alert,
} from "react-native";
import { Text, Button, Icon, Card } from "react-native-elements";
import Styles from "../../../Styles/styles";
import { Input } from "react-native-elements/dist/input/Input";
import { Picker } from "@react-native-picker/picker";
import { TouchableOpacity } from "react-native-gesture-handler";
import Carousel, { Pagination } from "react-native-snap-carousel";
import { Camera } from "expo-camera";
import { iconColorBlue, SuinpacRed, torchButton } from "../../../Styles/Color";

export default function LuminariasEstados(props: any) {
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

  let camera: Camera;

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
            setArrayImageEncode([]);
          } else {
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
      },
    ]);
  };

  const estados = [
    {
      id: "4",
      lavel: "Bueno",
    },
    {
      id: "6",
      lavel: "Regular",
    },
    {
      id: "8",
      lavel: "malo",
    },
  ];

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
    console.log(item.uri);
    return (
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          marginTop: 20,
        }}
      >
        <TouchableOpacity onLongPress={showConfirmDialog}>
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
          <KeyboardAvoidingView>
            <ScrollView>
              <Input
                placeholder="Clave Padrón"
                rightIcon={{ type: "font-awesome", name: "search" }}
              />
              <Input placeholder="Lectura Anterior" label="Lectura Anterior" />
              <Input placeholder="Lectura Actual" label="Lectura Actual" />
              <Input placeholder="Consumo" label="Consumo" />

              <Text style={Styles.textFormularios}>Estado</Text>

              <Picker>
                {estados.map((item) => {
                  return (
                    <Picker.Item
                      label={item.lavel}
                      value={item.id}
                      key={item.id}
                    ></Picker.Item>
                  );
                })}
              </Picker>
              <Text style={Styles.textFormularios}>Observaciones</Text>
              <TextInput
                style={Styles.textArea}
                placeholder="Observaciones Del Medidor"
              />

              <Carousel
                ref={caorusel}
                data={arrayImageEncode}
                renderItem={_renderItem}
                sliderWidth={ITEM_WIDTH}
                itemWidth={ITEM_HEIGHT}
                useScrollView={true}
                onSnapToItem={(index) => setActiveIndex(index)}
              ></Carousel>
              <TouchableOpacity
                style={Styles.btnButton}
                onPress={validarNumeroDeFotos}
              >
                <Text>
                  <Icon
                    tvParallaxProperties
                    type="feather"
                    name="camera"
                    size={15}
                  ></Icon>
                  {"  Tomar Fotografia"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity style={Styles.btnButton} onPress={() => {}}>
                <Text>
                  <Icon
                    tvParallaxProperties
                    type="feather"
                    name="save"
                    size={15}
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
