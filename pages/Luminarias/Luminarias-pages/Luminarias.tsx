import React,{ useState, useEffect, useRef } from "react";
import { View, Modal , Pressable, TouchableOpacity, ScrollView} from "react-native";
import { Text,Icon, Card } from 'react-native-elements'

import { Camera } from 'expo-camera';
import { CAMERA } from '../../../Styles/Iconos';
import Styles from '../../../Styles/BachesStyles';
import { CordenadasActualesNumerico, ObtenerDireccionActual } from '../../../utilities/utilities';
import { iconColorBlue, SuinpacRed, torchButton } from "../../../Styles/Color";

export default function Luminarias(props:any ){
    const [ camaraActiva, setCamaraActiva ] = useState(false);
    const [ activarFlash, setActivarFlash ] = useState(false);
    const [ TituloMensaje, setTituloMensaje ] = useState("Mensaje");
    const [ ErrorMensaje, setErrorMensje ] = useState(String);
    const [ IconoMensaje, setIconoMensaje ] = useState(String);
    const [ MostrarMensaje, setMostrarMensaje ] = useState(String);
    const [ arrayImageEncode, setarrayImageEncode ] = useState([]);
    const [ PermisosCamera, setPermisosCamara ] = useState(false);
    const [coordenadas, setCoordenadas ] = useState();

    let Camara: Camera;
    const MostrarCamara = () =>{
        console.log("Esto es un ejemplo de un presable");
        setCamaraActiva(true);
    }
    const solicitarPermisosCamara = async () =>{
        //NOTE: pedir Persmisos antes de lanzar la camara
        try{
          let { status } = await Camera.requestCameraPermissionsAsync(); //ESto Solo es para requerir permisos
          if(status === 'granted'){
            setCamaraActiva(true);
          }else{

          }
        }catch(error){
          console.log(error);
        }
    }
    const __takePicture = async () => {
        if (arrayImageEncode.length <= 2) {
          if (PermisosCamera) {
            if (!Camara){
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
            setCoords(coordenadas);
            //NOTE: verificamos los datos de localizacion
            let DireccionActual = JSON.parse(await ObtenerDireccionActual(coordenadas));
            let formatoDireccion = `
              Estado: ${DireccionActual.region}
              Ciudad: ${DireccionActual.city}
              Colonia: ${DireccionActual.district}
              Calle: ${DireccionActual.street}
              Codigo Postal: ${DireccionActual.postalCode}
            `;
            setDireccionEnviar(`${DireccionActual.region}  ${DireccionActual.city} ${DireccionActual.district} ${DireccionActual.street} ${DireccionActual.postalCode}`);
            setDireccion(formatoDireccion);
          } else {
            let { status } = await Camera.requestCameraPermissionsAsync();
            setCameraPermision(status === "granted");
          }
        }
        setLoading(false);
    };
    
    return(
        <View style = {Styles.TabContainer}>
            <ScrollView contentContainerStyle = {{flexGrow:1}} >
                <View style = {Styles.cardContainer} >

                </View>
            </ScrollView>

            {/** NOTE: modal para la camara  */}
            <Modal 
                style = {{ flex:1 , backgroundColor:"#000000"}}  
                transparent = {false} 
                visible = {camaraActiva} >
                <Camera
                    ref={(r) => { Camara  = r; }}
                    style={{ flex: 1 }}
                    autoFocus={true}
                    flashMode = { activarFlash ? Camera.Constants.FlashMode.torch : Camera.Constants.FlashMode.off }
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
              onPress = { ()=>{setCamaraActiva(false)} }
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
              onPress={ ()=>{ setActivarFlash(!activarFlash) } }
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
              onPress={ ()=>{PermisosCamera} }
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
        </View>
    );
}