import React, { useState, useEffect, useRef, Component } from "react";
import { ScrollView, TextInput, TouchableOpacity, View, SafeAreaView,Linking, StyleSheet, ActivityIndicator } from "react-native";
import { Avatar, Button, Card, Icon, Text } from "react-native-elements";
import MapView from "react-native-maps";
import * as Location from 'expo-location';
import { Marker } from 'react-native-maps';
import {ObtenerDireccionActual,CordenadasActualesNumerico} from  "../../utilities/utilities";
import { Camera } from "expo-camera";
//NOTE:  ccomponentes importados desde la carpeta components
import { CAMERA, ERROR, OK, PREVIEW } from '../../Styles/Iconos';
import Loading from '../components/modal-loading';
import Message from '../components/modal-message';
import { BlueColor, DarkPrimaryColor } from "../../Styles/BachesColor";
import { iconColorBlue, SuinpacRed, torchButton } from "../../Styles/Color";
import ImageView from "react-native-image-viewing";
import { GuardarReporteC4 } from "../controller/api-controller";
import { CLIENTE } from  '../../utilities/utilities';


export default function ReporteC4(props: any) {
    const [ Nombre, setNombre ] = useState(String);
    const [ Telefono, setTelefono ] = useState(String);
    const [ Problema, setProblema ] = useState(String);
    const [ Locacion, setLocacion ] = useState(Object);
    const [ mapaCargado, SetMapaCargado ] = useState(Boolean);
    const [ direccion, setDireccion ] = useState(Object);
    //INDEV: parte para el arreglo de fotos
    const [ arregloFotos, setArregloFotos ] = useState([]);
    const [ arregloFotosVista , setArregloFotosVista ] = useState<String[]>([]);
    //NOTE:  mmanejador de la camara
    const [ camaraActiva, setCamaraActiva ] = useState( false );
    const [ cameraPermissions, setCameraPermision ] = useState(false);
    const [ flashOn, setFlashOn ] = useState(false);
    const [ indiceGaleria, setIndiceGaleria ] = useState(0);
    //NOTE: manejador de mensajes para la aplicacion
    const [ mensaje, setMensaje ] = useState(String);
    const [ tipoMensaje, setTipoMensaje ] = useState(String);
    const [ iconoMensaje, setIconoMensaje ] = useState( String );
    const [ iconoFuente, setIconoFuente ] = useState( String );
    const [ mostraMensaje, setMonstrarMensaje ] = useState(Boolean);
    const [ InterfazError, setInterfazError ] = useState( String );
    //NOTE: modal de evidencias
    const [ mostraModalEvidencia, setMostraModalEvidencia ] = useState( Boolean );
    const [ cargando, setCargando ] = useState(false);

    let camera: Camera;
    useEffect(() => {
        (async () => {
          let { status } = await Location.requestForegroundPermissionsAsync();
          if (status !== 'granted') {
            setMensaje('Permission to access location was denied');
            return;
          }
          let location= await Location.getCurrentPositionAsync();
          setLocacion(location);
          let DireccionActual = JSON.parse(await ObtenerDireccionActual(location.coords));
            let formatoDireccion = {
            Estado: DireccionActual.region,
            Ciudad: DireccionActual.city,
            Colonia: DireccionActual.district,
            Calle: DireccionActual.street,
            CodigoPostal: DireccionActual.postalCode 
        };
        setDireccion(formatoDireccion);
        })();
      }, []);
      useEffect(()=>{
        (async ()=>{
        

        SetMapaCargado(true);
        
        });
        
      },[Locacion]);
    //INDEV: parte de la camara
    const solicitarPermisosCamara = async () => {
      //NOTE: pedir Persmisos antes de lanzar la camara
      try {
        let { status } = await Camera.requestCameraPermissionsAsync();
        if (status === "granted") {
          //NOTE: verifiamos el tamanio de las fotos
          await __takePicture();
        } else {
          //NOTE: lanzamos un un mensaje de permisos 
          setIconoMensaje(CAMERA[0]);
          setIconoFuente(CAMERA[1]);
          setMensaje("La aplicación necesita permisos para acceder a la cámara");
          setTipoMensaje("Mensaje");
          setMonstrarMensaje(true);
          setCamaraActiva(false);
        }
      } catch (error) {
        setCamaraActiva(false);
      }
    };
    const __takePicture = async () => {
      if (arregloFotos.length <= 2) {
        if (cameraPermissions) {
          if (!camera) {
            return;
          }
          const photo = await camera.takePictureAsync({
            base64: true,
            quality: 0.4,
          });
          //setImagenSeleccionada(photo.uri);
          console.log();
          setArregloFotos( (arregloFotos) => [...arregloFotos, photo]);
          setCamaraActiva(false);
          let coordenadas = await CordenadasActualesNumerico();
          Locacion(coordenadas);
          //NOTE: verificamos los datos de localizacion
          let DireccionActual = JSON.parse(
            await ObtenerDireccionActual(coordenadas)
          );
          let formatoDireccion = {
            Estado: DireccionActual.region,
            Ciudad: DireccionActual.city,
            Colonia: DireccionActual.district,
            Calle: DireccionActual.street,
            CodigoPostal: DireccionActual.postalCode};
        setDireccion(formatoDireccion);
        } else {
          let { status } = await Camera.requestCameraPermissionsAsync();
          setCameraPermision(status === "granted");
        }
      }
    };
    const GenerarCamara = ( ) => {
      return <View style={{ flex: 1 }}>
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
                  setCamaraActiva(false);
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
                onPress={solicitarPermisosCamara}
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
    } 
    const existeEvidencia = async ()=>{
      if(arregloFotos.length > 0 ) {
          setMostraModalEvidencia(true);
      }else{
          setMensaje("No se encontraron evidencias");
          setTipoMensaje("Mensaje");
          setIconoMensaje(CAMERA[0]);
          setIconoFuente(CAMERA[1]);
          setMonstrarMensaje(true);
      }
    }
    const verificarDatosReporte = () =>{
      setCargando(true);
      let errores = "";
      Locacion != null ? "" : errores += "L,";
      arregloFotos.length >= 0 ? GuardarReporte() : lanzarMensaje("¡Favor de verificar los campos requeridos!","Mensaje de Error",PREVIEW[0],PREVIEW[1]);
    }
    const GuardarReporte = async () =>{
        //INDEV: reunimos los datos del reporte
        //NOTE: recorremos el reporte 
        let encodeFotos = new Array();
        arregloFotos.map((imagen)=>{
          encodeFotos.push( "data:image/jpeg;base64," + imagen.base64);
        });
        let datosReposte = {
          'Cliente': CLIENTE,
          'Nombre':Nombre,
          'Telefono':Telefono,
          'Problema':Problema,
          'Evidencia':encodeFotos,
          'Locacion':JSON.stringify(Locacion.coords),
          'Direccion':JSON.stringify(direccion)
        }
        await GuardarReporteC4(datosReposte).
        then((MensajeGuardado)=>{
          lanzarMensaje(MensajeGuardado,"Mensaje Exitoso", OK[0], OK[1])
        }).
        catch((MensajeError)=>{
          lanzarMensaje(MensajeError, "Mensaje de Error", ERROR[0], ERROR[1])
        }).finally(()=>{
          setCargando(false);
        })
    }
    const lanzarMensaje = (msj:string,tMensaje:string,mIcono:string,mFuenteIcono:string ,colorIcono = BlueColor ) => {
      setTipoMensaje(tMensaje);
      setMensaje(msj);
      setIconoMensaje(mIcono);
      setIconoFuente(mFuenteIcono);
      setMonstrarMensaje(true);
    }
return(
      <SafeAreaView style = {{flex:1}} >
        {
          camaraActiva ? GenerarCamara():
            <ScrollView contentContainerStyle = { { flexGrow:1 } } >
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center"}}>
              <View style = {{flex:1, flexDirection:"row"}} >
                <View style = {{flex:2, alignItems:"center"}} >
                  <Avatar 
                    rounded
                    imageProps={ {resizeMode:"contain"} }
                    size = "xlarge"
                    containerStyle = {{ height:64,width:64 }}
                    source = {require("../../assets/ICONOC4.png")}
                  />
                </View>
                <View style = {{flex:5, justifyContent:"center"}} >
                  <Text style = {{textAlign:"center", fontWeight:"bold"}} >DATOS DEL REPORTE</Text>
                </View>
                <View style = {{flex:2}} >
                  <Text></Text>
                </View>
              </View>
            </View>
            <View style={{ flex: 6  }}>
            <View>
                <Text style= {{marginBottom: 5, marginTop: 10, marginLeft: 15, marginRight: 15, color:"black", fontWeight:"bold", justifyContent: "center", alignItems: "center"}}>Nombre</Text>
                    <TextInput
                                placeholder="Ejemplo: Juan Perez"
                                //maxLength={ 50 }
                                keyboardType="default"
                                value= {Nombre}
                                onChangeText={ text => { setNombre(text); }}
                                autoCapitalize = {"characters"}
                                style = { [ InterfazError.includes('N,') ? { borderColor: "red" } : { borderColor: "black" }  ,{ borderWidth: 1, padding: 3, marginLeft: 15, marginRight: 15, marginBottom: 10, borderRadius: 5}] }
                    />   
            </View>
            <View>
                <Text style= {{marginBottom: 5, marginTop: 10, marginLeft: 15, marginRight: 15, color:"black", fontWeight:"bold", justifyContent: "center", alignItems: "center"}}>Teléfono</Text>
                    <TextInput
                                placeholder="Ejemplo: 7474879912"
                                //maxLength={ 50 }
                                keyboardType="number-pad"
                                value= {Telefono}
                                onChangeText={ text => { setTelefono(text); }}
                                autoCapitalize = {"characters"}
                                style = {[ InterfazError.includes('T,') ? { borderColor: "red" } : { borderColor: "black" } , { borderWidth: 1, padding: 3, marginLeft: 15, marginRight: 15, marginBottom: 10, borderRadius: 5 }]}
                    />   
            </View>    
            <View>
                <Text style= {{marginBottom: 5, marginTop: 10, marginLeft: 15, marginRight: 15, color:"black", fontWeight:"bold", justifyContent: "center", alignItems: "center"}}>Problema</Text>
                    <TextInput
                    numberOfLines={5}
                                placeholder="Sea Breve en su Descripción"
                                //maxLength={ 50 }
                                keyboardType="default"
                                value= {Problema}
                                onChangeText={ text => { setProblema(text); }}
                                autoCapitalize = {"characters"}
                                style = {[InterfazError.includes('P,') ? { borderColor: "red" } : { borderColor: "black" },{ borderWidth: 1, padding: 3, marginLeft: 15, marginRight: 15, marginBottom: 10, borderRadius: 5}]}
                    />   
            </View>    
            <View style = {{paddingLeft:20, paddingRight:20 }} >
            {/* INDEV: mostramos un boton para las evidencias */}
            <Text style= {{marginBottom: 10, marginTop: 10, marginLeft: -5, marginRight: 15, color:"black", fontWeight:"bold", justifyContent: "center", alignItems: "center"}}>Foto Evidencia (Opcional)</Text>
              <View style = {{flex:1,flexDirection:"row"}} >
                <TouchableOpacity style = {[ InterfazError.includes('G,') ? { borderColor: "red", borderWidth:1 } : { borderColor: "black", borderWidth:0 } ,{ flex:4 ,backgroundColor: "#104971", borderRadius: 5, padding: 10, marginBottom: 10}]} onPress = {()=>{ setCamaraActiva( true ) }}>
                    <Text style = {{color:"white", textAlign: "center"  }}> Seleccionar Imagenes </Text>
                </TouchableOpacity>
                <TouchableOpacity style = {{flex:1, borderRadius: 5, padding: 10, marginBottom: 10, marginLeft:20, borderWidth:1, borderColor:BlueColor}} onPress = {existeEvidencia}>
                    <Icon name = {PREVIEW[0]} tvParallaxProperties color={ BlueColor } type = {PREVIEW[1]}></Icon>
                </TouchableOpacity>
              </View>
            </View>
            <View>
            <Text style= {{ color:"black", fontWeight:"bold", marginLeft:15}}>Ubicación</Text>
              <View style = {[ InterfazError.includes("L,") ? { borderColor:"red" } : { borderColor:"black" } ,{ margin:15, borderWidth:1, elevation:7, marginTop:5}]} >
                <View  style = {{ backgroundColor: "lightgray", height:200}} >
                        {
                            (Locacion.coords != undefined ) ? 
                            <MapView style = {{ height:200 }}
                            initialRegion = {{ 
                                latitude : Locacion.coords.latitude, 
                                longitude : Locacion.coords.longitude,  
                                latitudeDelta : Locacion.coords.latitudeDelta == null ? 0: Locacion.coords.latitudeDelta, 
                                longitudeDelta : Locacion.coords.longitudeDelta == null ? 0: Locacion.coords.longitudeDelta
                          }} 
                          region = {{
                            latitude : Locacion.coords.latitude, 
                            longitude : Locacion.coords.longitude,  
                            latitudeDelta :    0.0020,  
                            longitudeDelta : 0.0071
                          }}
                        >
                            <Marker     
                              title = { "¡Estoy aquí!" }
                              description = {` Calle: ` + direccion.Calle + ` Codigo Postal: `+ direccion.CodigoPostal}
                              coordinate={{"latitude":Locacion.coords.latitude,"longitude":Locacion.coords.longitude}}
                            ></Marker>
                        </MapView>: <ActivityIndicator size="large" color = {BlueColor} style = {{flex:1}}  />}
                    </View>
              </View>
                </View>
            <View style = {{paddingLeft:20, paddingRight:20 }} >
                    <TouchableOpacity style = {{backgroundColor: "#104971", borderRadius: 5, padding: 10, marginBottom: 10}} onPress = { verificarDatosReporte } >
                        <Text style = {{color:"white", textAlign: "center"  }}> Enviar </Text>
                    </TouchableOpacity>
            </View>  
            </View>
        </ScrollView>
        }
        <Message
          transparent={true}
          loading={ mostraMensaje }
          loadinColor={ BlueColor }
          onCancelLoad={() => { 
            setMonstrarMensaje(false);
            if(mensaje.includes("La aplicación necesita permisos para acceder a la cámara"))
              Linking.openSettings();
          }}
          icon={iconoMensaje}
          iconsource={iconoFuente}
          color={BlueColor}
          message={mensaje}
          tittle={tipoMensaje}
          buttonText={"Aceptar"}
        />
        <ImageView
          images={arregloFotos}
          imageIndex={ indiceGaleria }
          visible={mostraModalEvidencia}
          onRequestClose={() => {
          setMostraModalEvidencia(false);
          }}
          swipeToCloseEnabled={false}
          FooterComponent={({ imageIndex }) => (
              <View style = {{flex:1, alignItems:"center", marginBottom:"5%"}} >
                  <View >
                      <Text style = {{color:"white", fontWeight:"bold", fontSize:16}} >{`${ imageIndex + 1 }/${arregloFotos.length}`}</Text>
                  </View>
              </View>
          )}
          animationType = "fade"
          />
        <Loading
          loading={ cargando }
          loadinColor={DarkPrimaryColor}
          message={ "Enviando Reporte" }
          onCancelLoad={() => {
            setCargando(false);
          }}
          tittle={"Cargando"}
          transparent={true}
          />
      </SafeAreaView>
)

}