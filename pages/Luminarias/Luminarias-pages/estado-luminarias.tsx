import React,{ useState, useEffect, useRef } from "react";
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Image,TextInput } from "react-native";
import { Text,Button,Icon  } from 'react-native-elements'
import Styles from "../../../Styles/styles";
import { Input } from "react-native-elements/dist/input/Input";
import { Picker } from '@react-native-picker/picker';
import { TouchableOpacity } from "react-native-gesture-handler";
import Carousel from 'react-native-snap-carousel';
import { Camera } from 'expo-camera';


import { iconColorBlue, SuinpacRed, torchButton } from "../../../Styles/Color";
export default function LuminariasEstados(props:any ){
    const [previewVisible, setPreviewVisible] = useState(false);
    const [cameraPermissions, setCameraPermision] = useState(false);
    const [arrayImageLinks,setArrayImageLinks] = useState([]);
    const [arrayImageEncode, setArrayImageEncode ] = useState([]);
    const [flashOn, setFlashOn] = useState(false);
    const [onCamera, setOnCamera] = useState(false);
    const caorusel = React.useRef(null);
    let camera: Camera;
    useEffect(()=>{
        (async () => {
            let { status } =  await Camera.requestCameraPermissionsAsync();
            setCameraPermision(status === 'granted');
          })();
    })

    const luminariaList = [
        {
            "id": 1,
            "lavel": "Semaforo",
        },
        {
            "id": "2",
            "lavel": "Luminaria"
        }
    ];
    const estados = [
        {
            "id": "4",
            "lavel": "Bueno",
        },
        {
            "id": "6",
            "lavel": "Regular"
        },
        {
            "id": "6",
            "lavel": "malo"
        }
    ];
    const __takePicture = async ()=>{
        if(arrayImageEncode.length <= 2){
            if(cameraPermissions){
                if(!camera) return;
                const photo =  await camera.takePictureAsync({base64:true,quality:.4});
                photo.uri
                setArrayImageEncode(arrayImageEncode => [...arrayImageEncode,photo]);
                setOnCamera(false);
            }else{
                let { status } =  await Camera.requestCameraPermissionsAsync();
                setCameraPermision(status === 'granted');
            }
        }   
    }
    const _renderItem = ({item, index}) => {
        console.log(item.uri);
        return (
            <View style = {{backgroundColor:"red", justifyContent:"center", alignItems:"center", marginTop:20}}>
                <Image
                    source = {{uri:item.uri}}
                    style = {{width:200,height:300}} 
                />
            </View>
        );
    }
    return(
        <View style = {Styles.TabContainer}>
            {
                onCamera ? 
                <View style = {{flex:1}}>
                    <Camera 
                        ref={(r) => {
                        camera = r
                        }}
                        style = {{flex:1}} autoFocus = {true} flashMode = {flashOn ? Camera.Constants.FlashMode.torch : Camera.Constants.FlashMode.off }  >  
                        <View style = {{flex:20, marginTop: 10, flexDirection:"row-reverse", marginLeft:20}}>
                            <TouchableOpacity style = {{justifyContent:"center",backgroundColor:SuinpacRed, opacity:.5, height:40, width:40, borderRadius:50}}
                                onPress = { ()=>{setOnCamera(false);} }>
                                <Icon tvParallaxProperties name = "cancel" color = {iconColorBlue}></Icon>
                            </TouchableOpacity>
                        </View>
                        <View style = {{flex:2, marginTop: 10, flexDirection:"row", marginLeft:20}}>
                            <TouchableOpacity style = {{justifyContent:"center",backgroundColor:torchButton, opacity:.5, height:40, width:40, borderRadius:50}}
                                onPress = { ()=>{setFlashOn(!flashOn)} }>
                                <Icon type = "feather" tvParallaxProperties name = {flashOn ? "zap" : "zap-off"} color = {iconColorBlue}></Icon>
                            </TouchableOpacity>
                        </View>
                        <View style = {{alignItems:"center", marginBottom:10}} >
                            <TouchableOpacity style = {{justifyContent:"center",backgroundColor:'white', opacity:.5, height:60, width:60, borderRadius:50}}
                                onPress = {__takePicture}>
                                <Icon tvParallaxProperties name = "camera" color = {SuinpacRed}></Icon>
                            </TouchableOpacity>
                        </View>
                    </Camera>
                </View> : 
                <View style = {Styles.inputButtons}>
                    <KeyboardAvoidingView>
                        <ScrollView>
                        
                <Input placeholder="Clave Padrón"    rightIcon={{ type: 'font-awesome', name: 'search' }} />                                
                <Input placeholder="Lectura Anterior" label="Lectura Anterior" />
                <Input placeholder="Lectura Actual" label="Lectura Actual" />
                <Input placeholder="Consumo" label="Consumo" />

                <Text style={Styles.textFormularios}>Estado</Text>

        
                            <Picker >
                                {
                                    estados.map((item)=>{
                                    return  <Picker.Item label = {item.lavel} value = {item.id} key = {item.id} ></Picker.Item>
                                    })
                                }
                            </Picker>
                            <Text style={Styles.textFormularios}>Observaciones</Text>
                            <TextInput style={Styles.textArea} placeholder="Observaciones Del Medidor"/>

                            <Carousel
                                
                                ref={caorusel}
                                data = {arrayImageEncode}
                                renderItem = {_renderItem}
                                sliderWidth={300}
                                itemWidth={300}
                                useScrollView={true}
                            >

                            </Carousel>
                            <Button style={Styles.btnFoto}  onPress = {()=>{setOnCamera(true)}} icon={ <Icon name="camera" size={25} color="white"/>} title="  Tomar Foto" />

                            <Text></Text>
                            <Button style={Styles.btnFoto}  onPress = {()=>{setOnCamera(true)}} icon={ <Icon name="save" size={25} color="white"/>} title="  Guardar" />

                        </ScrollView>
                    </KeyboardAvoidingView>
                </View>
            }
        </View>
    );
}

