import React,{ useState, useEffect, useRef } from "react";
import { View, ScrollView, KeyboardAvoidingView, Image, Dimensions, Vibration, RefreshControlComponent, ImagePropTypes } from "react-native";
import { Text,Icon, Card } from 'react-native-elements'
import Styles from "../../../Styles/styles";
import { Input } from "react-native-elements/dist/input/Input";
import { Picker } from '@react-native-picker/picker';
import { TouchableOpacity } from "react-native-gesture-handler";
import Carousel, {Pagination} from 'react-native-snap-carousel';
import { Camera } from 'expo-camera';
import NetInfo from '@react-native-community/netinfo';
import { iconColorBlue, SuinpacRed, torchButton } from "../../../Styles/Color";
import { StorageService } from '../../controller/storage-controller';
export default function Luminarias(props:any ){
    const storage = new StorageService();
    const [cameraPermissions, setCameraPermision] = useState(false);
    const [arrayImageEncode, setArrayImageEncode ] = useState([]);
    const [flashOn, setFlashOn] = useState(false);
    const [onCamera, setOnCamera] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);
    const caorusel = React.useRef(null);
    const SLIDER_WIDTH = Dimensions.get("window").width;
    const ITEM_WIDTH = Math.round(SLIDER_WIDTH * .8 );
    const ITEM_HEIGHT = Math.round(ITEM_WIDTH * 3 / 4);
    const [tipoLuminaria, setTipoLuminaria] = useState([]);
    const [ tipoEstadoFisico, setTipoEstadoFisico ] = useState([]);
    let camera: Camera;
    useEffect(()=>{
        (async () => {
            console.log("Cargando");
            let { status } =  await Camera.requestCameraPermissionsAsync();
            setCameraPermision(status === 'granted');
            storage.createOpenDB();
            //VERIFICANCO
            let data = await storage.leerLuminarias();
            let arrayDaya = JSON.parse(String(data));
            setTipoLuminaria(arrayDaya);
            let estados = await storage.leerEstadoFisco();
            let arrayEstado = JSON.parse(String(estados));
            setTipoEstadoFisico(arrayEstado);
          })();
    },[]);
    const __takePicture = async ()=>{
        if(arrayImageEncode.length <= 2){
            if(cameraPermissions){
                if(!camera) return;
                const photo =  await camera.takePictureAsync({base64:true,quality:.4});
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
            <View 
            style = {{ justifyContent:"center", alignItems:"center", marginTop:20}}>
                <TouchableOpacity onLongPress = {deleteImage} >
                    <Card >
                        <Image
                            
                            source = {{uri:item.uri}}
                            style = {{width:200,height:300}} 
                        />
                    </Card>
                </TouchableOpacity>
            </View>
        );
    }
    const deleteImage = ()=>{
       Vibration.vibrate(200);
        //let newarray = array.filter(item => item !== "hello");
        if(arrayImageEncode.length == 1){
            setArrayImageEncode([]);
        }else{
            setArrayImageEncode(arrayImageEncode.filter(item => item.uri !== arrayImageEncode[activeIndex].uri ));
        }     let item = arrayImageEncode[activeIndex]; //INDEV:Aqui se borra de la lista 
    
    }
    const pagination = ()=> {
        
        return (
            <Pagination
                activeDotIndex = {activeIndex}
                dotsLength={arrayImageEncode.length}
                containerStyle={{}}
                dotStyle={{
                    width: 10,
                    height: 10,
                    borderRadius: 5,
                    marginHorizontal: 8,
                    backgroundColor: SuinpacRed
                }}
                inactiveDotOpacity={0.4}
                inactiveDotScale={0.6}
                />
        );
    }
    const checkConnection = () =>{
        NetInfo.fetch().then((estado)=>{
            console.log("Tipo de conexion: " + estado.type);
            console.log("conectado a internet: " + estado.isInternetReachable);
        })
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
                            <Input placeholder = "Contrato" label = "Contrato" ></Input>
                            <Input placeholder = "Clave de indentificacion" label = "Clave" ></Input>
                            <Input placeholder = "Ejemplo: Luz L.E.D" label = "Clasificacion" ></Input>
                            <Input placeholder = "Voltaje" label = "Voltaje" ></Input>
                            <Picker>
                                {
                                    tipoLuminaria == null ? 
                                        <Picker.Item label = {"Cargando.."} value = {-1} key = {"-1"} ></Picker.Item> :
                                    tipoLuminaria.map((item)=>{
                                    return  <Picker.Item label = {String(item.Descripcion)} value = {item.clave} key = {String(item.clave)} ></Picker.Item>
                                    })
                                }
                            </Picker>
        
                            <Picker >
                                {
                                    tipoEstadoFisico == null ?
                                    <Picker.Item label = {"Cargando.."} value = {-1} key = {"-1"} ></Picker.Item> :
                                    tipoEstadoFisico.map((item)=>{
                                    return  <Picker.Item label = {item.Descripcion} value = {item.clave} key = {String(item.clave)} ></Picker.Item>
                                    })
                                }
                            </Picker>
                            <TouchableOpacity style = {Styles.btnButton} onPress = {()=>{setOnCamera(true)}} >
                                <Text>
                                <Icon tvParallaxProperties type = "feather" name ="camera" size ={15} ></Icon>
                                    {"  Tomar Fotografia"}</Text>
                            </TouchableOpacity>
                                <Carousel
                                ref={caorusel}
                                data = {arrayImageEncode}
                                renderItem = {_renderItem}
                                
                                sliderWidth={ITEM_WIDTH}
                                itemWidth={ITEM_HEIGHT}
                                useScrollView={true}
                                onSnapToItem={(index) => setActiveIndex(index)}
                                    >
                                </Carousel>
                                {pagination()}
                            <TouchableOpacity style = {Styles.btnButton} onPress = {checkConnection} >
                                <Text >
                                    <Icon tvParallaxProperties type = "feather" name ="save" size ={15} ></Icon>
                                    {"  Guardar"}</Text>
                            </TouchableOpacity>
                        </ScrollView>
                    </KeyboardAvoidingView>
                </View>
            }
        </View>
    );
}