import React,{ useState, useEffect, useRef } from "react";
import { View, ScrollView, KeyboardAvoidingView, Image, Dimensions, Vibration, RefreshControlComponent} from "react-native";
import { Text,Icon, Card } from 'react-native-elements'
import Styles from "../../../Styles/styles";
import { Input } from "react-native-elements/dist/input/Input";
import { Picker } from '@react-native-picker/picker';
import { TouchableOpacity } from "react-native-gesture-handler";
import Carousel, {Pagination} from 'react-native-snap-carousel';
import { Camera } from 'expo-camera';
import { iconColorBlue, SuinpacRed, torchButton } from "../../../Styles/Color";
import { StorageService } from '../../controller/storage-controller';
import { CordenadasActuales, checkConnection } from '../../../utilities/utilities';
import ModalLoading from '../../components/modal-loading';
import ModalMessage from '../../components/modal-message';
import { GuardarLuminaria } from '../../controller/api-controller';
import { useSafeArea } from "react-native-safe-area-context";
import { black } from "react-native-paper/lib/typescript/styles/colors";

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
    const [laoding, setLoading] = useState(false);
    const date =  Date.now();
    //Variables para el envio del registros
    const [ coords, setCoords ] = useState(null);
    const [contrato, setContrato] = useState(String);
    const [clave, setClave ] = useState(String);
    const [clasificacion, setClasificacion] = useState(String);
    const [voltaje, setVoltaje] = useState(String);
    const [selectLuminaria, setSelectLuminaria] =  useState(String);
    const [selectEstadoFisico, setSelectEstadoFisico]= useState(String);
    //NOTE: manejador de errores
    const [handleError, setHandleError] = useState(String);
    const [ tituloError, setTituloError ] =  useState(String);
    const [ mensajeError, setMensajeError ] = useState(String);
    const [iconColor, setIconColot] = useState(String);
    const [icon,setIcon] = useState(String); 
    const [showErrorMessage,setShowErrorMessage] = useState(false);
    const [jsonLocation,setJsonLocation ] = useState(String); 
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
            storage.leerDBLuminarias();
          })();
    },[]);
    const __takePicture = async ()=>{
        if(arrayImageEncode.length <= 2){
            if(cameraPermissions){
                if(!camera) return;
                const photo =  await camera.takePictureAsync({base64:true,quality:.4});
                photo.base64
                setArrayImageEncode(arrayImageEncode => [...arrayImageEncode,photo]);
                setOnCamera(false);
                setCoords( await CordenadasActuales());
            }else{
                let { status } =  await Camera.requestCameraPermissionsAsync();
                setCameraPermision(status === 'granted');
            }
        }   
    }
    const _renderItem = ({item, index}) => {
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
    const EnviarLuminaria = async () =>{
        setLoading(true);
        try{
            let evidencia = new Array();
            let online = await checkConnection();
            online = !online;
            if(online){
                //NOTE: Se envian los base64
                arrayImageEncode.map((item,index)=>{
                    evidencia.push("data:image/jpeg;base64," +item.base64);
                });
            }else{
                //NOTE: se guardan las rutas
                arrayImageEncode.map((item,index)=>{
                    evidencia.push(item.uri);    
                });
            }
            let data = {
                Contrato: contrato,
                Clave: clave,
                Municipio: "12038",
                Localidad: "2",
                Cliente: await storage.getItem("Cliente"),
                Latitud: coords.latitude,
                Longitud: coords.longitude,
                Voltaje : voltaje,
                Calsificacion: clasificacion,
                Tipo: selectLuminaria,
                Fecha: date.toLocaleString(),
                Usuario: await storage.getItem("User"),
                LecturaActual:"0",
                LecturaAnterior:'0',
                Consumo: '0',
                Estado: selectEstadoFisico,
                Evidencia: !online ? JSON.stringify(evidencia) : evidencia,
                TipoPadron: "1",
                Ubicacion: jsonLocation,
                Observacion:""
            }
            await GuardarLuminaria(data, online)
            .then((result)=>{

                console.log(JSON.stringify(result));
            })
            .catch((error)=>{
                let mensaje = String(error.message);
                if(mensaje.includes(",")){
                    setMensajeError("Favor de rellenar los campos vacios");
                    setTituloError("Mensaje");
                    setIcon("info");
                    setIconColot(iconColorBlue);
                    setShowErrorMessage(true);
                }
                setHandleError(error.message);
                console.log(JSON.stringify(error));
            }).finally(()=>{
                setLoading(false);
            })
        }catch(error){
            
        }
    }
    const inputStyles = (active)=>{
        if(active){
            return Styles.inputError
        }else{
            return Styles.inputData
        }
    }
    const borrarDatos = ()=>{
        storage.borrarDatos("Luminaria");
        storage.borrarDatos("HistorialLuminaria");
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
                                onPress = {__takePicture}  >
                                <Icon tvParallaxProperties name = "camera" color = {SuinpacRed}></Icon>
                            </TouchableOpacity>
                        </View>
                    </Camera>
                </View> : 
                <View style = {Styles.inputButtons}>
                    <KeyboardAvoidingView>
                        <ScrollView>
                            <Input value = {contrato}  style={Styles.inputData} placeholder = "Contrato" label = "Contrato" onChangeText = {(text)=>{setContrato(text)}} ></Input>
                            <Input value = {clave} style = {inputStyles(handleError.includes("C,"))} placeholder = "Clave de indentificacion" label = "Clave" onChangeText = {(text)=>{setClave(text)}} ></Input>
                            <Input value = {clasificacion} style = {inputStyles(handleError.includes("CL,"))} placeholder = "Ejemplo: Luz L.E.D" label = "Clasificacion" onChangeText = {(text)=>{setClasificacion(text)}} ></Input>
                            <Input value = {voltaje} style = {inputStyles(handleError.includes("V,"))} placeholder = "Voltaje" label = "Voltaje" onChangeText = {(text)=>{setVoltaje(text)}} ></Input>
                            <Picker onValueChange = {(itemValue, itemIndex)=>{setSelectLuminaria(String(itemValue))}}>
                                {
                                    tipoLuminaria == null ? 
                                        <Picker.Item label = {"Cargando.."} value = {-1} key = {"-1"} ></Picker.Item> :
                                    tipoLuminaria.map((item)=>{
                                    return  <Picker.Item label = {String(item.Descripcion)} value = {item.clave} key = {String(item.clave)} ></Picker.Item>
                                    })
                                }
                            </Picker>
        
                            <Picker style={{}} onValueChange = {(itemValue, itemIndex)=>{setSelectEstadoFisico(String(itemValue))}} >
                                {
                                    tipoEstadoFisico == null ?
                                    <Picker.Item label = {"Cargando.."} value = {-1} key = {"-1"} ></Picker.Item> :
                                    tipoEstadoFisico.map((item)=>{
                                    return  <Picker.Item label = {item.Descripcion} value = {item.clave} key = {String(item.clave)} ></Picker.Item>
                                    })
                                }
                            </Picker>
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
                            <TouchableOpacity style = {Styles.btnButton} onPress = {()=>{setOnCamera(true)}} >
                                <Text style = {Styles.btnTexto} >
                                <Icon tvParallaxProperties type = "feather" name ="camera" size ={15} color = {"white"} ></Icon>
                                    {"  Tomar Fotografia"}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style = {Styles.btnButton} onPress = {EnviarLuminaria} onLongPress = {borrarDatos} >
                                <Text style = {Styles.btnTexto} >
                                    <Icon tvParallaxProperties type = "feather" name ="save" size ={15} color = {"white"} ></Icon>
                                    {"  Guardar"}</Text>
                            </TouchableOpacity>
                        </ScrollView>
                    </KeyboardAvoidingView>
                    <ModalLoading
                        loadinColor = {SuinpacRed} 
                        loading = {laoding}
                        transparent = {true}
                        onCancelLoad = {()=>{}}
                        tittle = {"Mensaje"}
                        message = {"Mensaje"}
                    />
                    <ModalMessage
                        transparent = {true}
                        loading = {showErrorMessage}
                        loadinColor = {iconColor}
                        icon = {icon}
                        iconsource = {""}
                        color = {iconColor}
                        message = {mensajeError}
                        tittle = {tituloError}
                        buttonText = {"Aceptar"}                
                        onCancelLoad = {()=>{setShowErrorMessage(false)}}
                    />
                </View>
            }
        </View>
    );
}