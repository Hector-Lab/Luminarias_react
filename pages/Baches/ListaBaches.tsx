import React, { useState, useEffect, useRef } from "react";
import Styles  from '../../Styles/BachesStyles';
import {
  TouchableOpacity,
  View,
  Image,
  Dimensions,
  Alert,
  ScrollView,
  TextInput,
} from "react-native";
import { BlueColor, cardColor, DarkPrimaryColor } from "../../Styles/BachesColor";
import { Text, Icon,Card } from "react-native-elements";
import { Picker } from "@react-native-picker/picker";
import Carousel, { Pagination } from "react-native-snap-carousel";
import { Camera } from "expo-camera";
import { checkConnection, CordenadasActuales } from '../../utilities/utilities';
import { iconColorBlue, SuinpacRed, torchButton } from "../../Styles/Color";
export default function BachesList(props: any) {
  const caorusel = React.useRef(null);
  const [cameraPermissions, setCameraPermision] = useState(false);
  const [arrayImageEncode, setArrayImageEncode] = useState([]);
  const SLIDER_WIDTH = Dimensions.get("window").width;
  const ITEM_WIDTH = Math.round(SLIDER_WIDTH * .9);
  const ITEM_HEIGHT = Math.round((ITEM_WIDTH * 3) / 4); 
  const [activeIndex, setActiveIndex] = useState(0);
  const [flashOn, setFlashOn] = useState(false);
  const [onCamera, setOnCamera] = useState(false);
  const [ coords, setCoords ] = useState(null);
  const [ direccion,setDireccion ] = useState("Direccion actual \n\n\n\n\n\n\n ");
  let camera: Camera;

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
          <Card>
            <Image
              source={{ uri: item.uri }}
              style={{ width: 200, height: 300 }}
            />
          </Card>
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
        setCoords(await CordenadasActuales());
      } else {
        let { status } = await Camera.requestCameraPermissionsAsync();
        setCameraPermision(status === "granted");
      }
    }
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
  return (
    <View style = { [Styles.container]}>
      {
        onCamera ? <View style={{ flex: 1 }}>
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
      </View> :
        <ScrollView contentContainerStyle = {{flexGrow:1}} >
          <View style = {Styles.cardContainer} >
              <View style = {{flex:.2}} >
                {/* NOTE:: Area Administrativa */ }
                <Picker>
                  <Picker.Item label="Seleccione uno" ></Picker.Item>
                </Picker>
              </View>
              <View style = {Styles.bachesCard} >
                {/* NOTE:: Direccion del defecto */ }
                <View style = {Styles.cardHeader}>
                  <View style = {Styles.cardLeftIcon}>
                    <View style = {Styles.cardRpundedIcon} >
                      <Icon color = {"white"}  tvParallaxProperties  name = "street-view" type ="font-awesome-5" style = {{margin:3}} />
                    </View>
                  </View>
                  <View style = {Styles.cardHeaderText}>
                    <Text style = {{textAlign:"center"}} >Direccion Actual</Text> 
                  </View>
                  <View style = {Styles.cardRigthIcon}>
                  <View style = {Styles.cardRpundedIcon} >
                      <Icon color = {"white"}  tvParallaxProperties  name = "map" type ="feather" style = {{margin:3}} />
                    </View> 
                  </View>
                </View>
                <View style = {Styles.cardTextView} >
                    <Text style = {Styles.textMultiline} ></Text>
                </View>
                <View style = {Styles.cardFoteer}>
                  <View style = {Styles.cardFoteerContainer}>
                      <TouchableOpacity style = {Styles.cardLeftBtn} >
                        <Text style = {{ color:BlueColor }} > Editar </Text>
                      </TouchableOpacity> 
                  </View>
                  <View style = {Styles.cardLocateBtn}>
                    <TouchableOpacity style = {Styles.cardBtn} >
                      <Icon color = {DarkPrimaryColor}  tvParallaxProperties  name = "map-pin" type ="font-awesome-5" style = {{margin:3}} />
                    </TouchableOpacity> 
                  </View>
                  <View style = {{flex:1,flexDirection:"row", justifyContent:"center", alignItems:"center"}}>
                    <TouchableOpacity style = {Styles.cardBtn} >
                        <Icon color = {DarkPrimaryColor}  tvParallaxProperties  name = "trash-alt" type ="font-awesome-5" style = {{margin:3}} />
                    </TouchableOpacity> 
                  </View>
                </View>
              </View>
              <Text></Text>
              <View style = {{ flex:6 }} >
                {/* NOTE: Seccion de galeria */}
                <View style = {Styles.cardHeader}>
                  <View style = {Styles.cardLeftIcon}>
                    <View style = {Styles.cardRpundedIcon} >
                      <Icon color = {"white"}  tvParallaxProperties  name = "street-view" type ="font-awesome-5" style = {{margin:3}} />
                    </View>
                  </View>
                  <View style = {Styles.cardHeaderText}>
                    <Text style = {{textAlign:"center"}} >Direccion Actual</Text> 
                  </View>
                  <View style = {Styles.cardRigthIcon}>
                  <View style = {Styles.cardRpundedIcon} >
                      <Icon color = {"white"}  tvParallaxProperties  name = "map" type ="feather" style = {{margin:3}} />
                    </View> 
                  </View>
                </View>
                 
              </View>

          </View>
        </ScrollView>  
      }
       
    </View>
    );
}
