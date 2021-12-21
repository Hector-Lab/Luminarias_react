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
  RefreshControlComponent,
} from "react-native";
import { Text, Button, Icon, Card, ListItem } from "react-native-elements";
import { FlatList } from 'react-native';
import Styles from "../../../Styles/styles";
import { Input } from "react-native-elements/dist/input/Input";
import { Picker } from "@react-native-picker/picker";
import { TouchableOpacity } from "react-native-gesture-handler";
import Carousel, { Pagination } from "react-native-snap-carousel";
import { Camera } from "expo-camera";
import { iconColorBlue, SuinpacRed, torchButton } from "../../../Styles/Color";
import { StorageService } from '../../controller/storage-controller';
import { List, Searchbar } from 'react-native-paper';
import { Item } from "react-native-paper/lib/typescript/components/List/List";

export default function LuminariasEstados(props: any) {
  const [previewVisible, setPreviewVisible] = useState(false);
  const [cameraPermissions, setCameraPermision] = useState(false);
  const [arrayImageLinks, setArrayImageLinks] = useState([]);
  const [arrayImageEncode, setArrayImageEncode] = useState([]);
  const [flashOn, setFlashOn] = useState(false);
  const [onCamera, setOnCamera] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [showBox, setShowBox] = useState(true);
  const [ clavesLuminaria , setClaveLuminarias ] = useState([]);
  const [ catalogoEstadoFisico, setCatalodoEstadoFisico ] = useState([]);
  const [ selectEstadoFisico , setSelectEstadoFisico ] = useState(String);
  const [serchKey, setSerchKey ] =  useState();
  const [visibleList, setvisibleList ] = useState(true);
  const caorusel = React.useRef(null);
  const SLIDER_WIDTH = Dimensions.get("window").width;
  const ITEM_WIDTH = Math.round(SLIDER_WIDTH * 0.8);
  const ITEM_HEIGHT = Math.round((ITEM_WIDTH * 3) / 4);
  let storage = new StorageService();
  let camera: Camera;

  useEffect(() => {
    (async () => {
      let { status } = await Camera.requestCameraPermissionsAsync();
      setCameraPermision(status === "granted");
      let estados = await storage.leerEstadoFisco();
      let arrayEstado = JSON.parse(String(estados));
      setCatalodoEstadoFisico(arrayEstado);
    })();
  },[]);

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
  const onChangeSearch = query => {
    setSerchKey(query);
  }
  const serchLuminarias = async () =>{
    let serchData = await storage.buscarLuminariaClave(serchKey);
    setClaveLuminarias(JSON.parse(String(serchData)));
  }
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
          {
            visibleList ? (<View style = {{flex:1}}>
                <Searchbar
                  value = {serchKey}
                  onChangeText = {onChangeSearch}
                  placeholder="Clave Padrón"
                  onSubmitEditing = {serchLuminarias}
                />
                <Text></Text>
                <FlatList 
                  style = {{ borderWidth : 1, borderRadius :10,borderColor:iconColorBlue}}
                  data = { clavesLuminaria }
                  renderItem = {({item})=>(
                    <TouchableOpacity style = {{margin:10}} >
                    <ListItem tvParallaxProperties hasTVPreferredFocus bottomDivider  style = {{padding: 2 }}>
                      <ListItem.Content>
                        <ListItem.Title > {`Clave: ${item.ClaveLuminaria} - ${ item.Contrato == "" ? "Sin contrato":`Contrato:  ${item.Contrato}` }`} </ListItem.Title>
                        <ListItem.Subtitle>{ `Tipo: ${item.Tipo} - Clasificación: ${item.Clasificacion}`  }</ListItem.Subtitle>
                      </ListItem.Content>
                    </ListItem>
                    </TouchableOpacity>
                  )}
                  
                />
            </View>) : (<>
                  <KeyboardAvoidingView>
                  <ScrollView>
                  <Input placeholder="Lectura Anterior" label="Lectura Anterior" />
                  <Input placeholder="Lectura Actual" label="Lectura Actual" />
                  <Input placeholder="Consumo" label="Consumo" />

                  <Text style={Styles.textFormularios}>Estado</Text>

                  <Picker onValueChange = {(itemValue, itemIndex)=>{setSelectEstadoFisico(String(itemValue))}} >
                      {
                          catalogoEstadoFisico == null ?
                          <Picker.Item label = {"Cargando.."} value = {-1} key = {"-1"} ></Picker.Item> :
                          catalogoEstadoFisico.map((item)=>{
                          return <Picker.Item label = {item.Descripcion} value = {item.clave} key = {String(item.clave)} ></Picker.Item>
                          })
                      }
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
                  >
                    {pagination}
                  </Carousel>
                  
                  <TouchableOpacity
                    style={Styles.btnButton}
                    onPress={validarNumeroDeFotos}
                  >
                    <Text style = {Styles.btnTexto}>
                      <Icon
                        color = {"white"}
                        tvParallaxProperties
                        type="feather"
                        name="camera"
                        size={15}
                      ></Icon>
                      {"  Tomar Fotografia"}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={Styles.btnButton} onPress={() => {}}>
                    <Text style = {Styles.btnTexto} >
                      <Icon
                        color = {"white"}
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
            </>)
          }
        </View>
      )}
    </View>
  );
}
