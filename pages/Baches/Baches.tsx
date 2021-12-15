import React, { useState, useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Image,
  TextInput,
  Dimensions,
  Vibration,Platform,
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
import * as Location from 'expo-location';

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

  let camera: Camera;
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  let direccionObtenidaCorrectamente=false;
  

const getLocation=async ()=>{
  let { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') {
    setErrorMsg('Permission to access location was denied');
    
  }else{
    let location = await Location.getCurrentPositionAsync({});
    setLocation(location);
    let text = '';
    if (errorMsg) {
      text = errorMsg;
    } else if (location) {
      text = JSON.stringify(location);
      direccionObtenidaCorrectamente=true;
      console.log(text);
    }
  }

  
  
}







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
        onPress:()=>{
          Vibration.vibrate(100);
          setShowBox(false);
        }
      },
    ]);
  };


  const validarNumeroDeFotos = () => {
    //    console.log(arrayImageEncode.length);
    getLocation();
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
          
              <Input placeholder="Direccióm Principal" label="Calle Principal" />
              <Text style={Styles.textFormularios} >Entre las calles</Text>
              <Input placeholder="Calle 1"  />
              <Input placeholder="Calle 2"  />

              

              <Text style={Styles.textFormularios}>Descripción</Text>
              <TextInput
                style={Styles.textArea}
                placeholder="Descripción7"
              />

              <Carousel
                ref={caorusel}
                data={arrayImageEncode}
                renderItem={_renderItem}
                sliderWidth={ITEM_WIDTH}
                itemWidth={ITEM_HEIGHT}
                useScrollView={true}
                onSnapToItem={(index) => setActiveIndex(index)}
              >
               
              </Carousel>
              {pagination()}
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
