import React, { useState, useEffect, useRef } from "react";
import {
  View,
  ScrollView,
  FlatList,
  RefreshControl,
  Text
} from "react-native";
import Styles from '../../Styles/BachesStyles';
import { StorageService } from "../controller/storage-controller";
import { ObtenerMisReportes } from '../controller/api-controller';
import { Icon, ListItem, Button, getIconType } from 'react-native-elements';
import { BlueColor, buttonSuccess, cardColor, DarkPrimaryColor, PrimaryColor } from "../../Styles/BachesColor";
import Message from '../components/modal-message';
import Loading, {} from '../components/modal-loading'; 
import { DESCONOCIDO,ERROR,INFO,OK, WIFI, WIFI_OFF, ICONLIST } from '../../Styles/Iconos';

import { Badge } from "react-native-elements/dist/badge/Badge";
import { TextInput, TouchableOpacity } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
const storage = new StorageService();

export default function HistorialReporte(props: any) {

  const service = new StorageService();
  const [ reportes, setReportes ] = useState([]);
  //NOTE: Manejador del modal mensaje 
  const [ errorMensaje, setErrorMensaje ] = useState(String); 
  const [ tituloMensaje, setTituloMensaje ] = useState(String);
  const [ icono, setIcono ] = useState("info");
  const [ iconSource, setIconSource ] = useState("font-awesome-5");
  const [ showMessage, setShowMessage ] = useState(false);
  const [refreshing, setRefreshing] = React.useState(false);
  const [ loading, setLoading ] = useState(true);
  useEffect(()=>{
    (async () => {
      //NOTE: Cargamos la lista de los reportes del ciudadano
      await ObtenerMisReportes()
        .then((arregloReportes)=>{
          setReportes(arregloReportes);
        })
        .catch((error)=>{
          let message = String(error.message);
          if(message.includes("encontrados") ||  message.includes("no tiene registros")){
            /*setTituloMensaje("Mensaje");
            setIconSource(INFO[1]);
            setIcono(INFO[0]);*/
            setShowMessage(false);
            setErrorMensaje("");
          }else if(message.includes("interner")){
            setTituloMensaje("Error");
            setIconSource(WIFI_OFF[1]);
            setIcono(WIFI_OFF[0]);
            setShowMessage(true);
            setErrorMensaje(message);
          }else{
            setTituloMensaje("Mensaje");
            setIcono(ERROR[0]);
            setIconSource(ERROR[1]);
            setShowMessage(true);
            setErrorMensaje(message);
          }
          
        }).finally(()=>{
          setLoading(false);
        })
    })();
  },[]);

  const iconos = [{"Icon":"building"},{"Icon":"tint"},{"Icon":"lightbulb"},{"Icon":"road"}];
  const estatusLetra = [{"Nombre":"Pendiente"},{"Nombre":"Proceso"},{"Nombre":"Atendida"},{"Nombre":"Rechazada"}]
  type reporteCiudadano = {
    Tema: string;
    Codigo: string;
    Descripci_on:string;
    Estatus:string;
    FechaTupla:string,
    Ubicaci_onEscrita:string,
    FechaAtendida:string,
    FechaProceso:string,
    FechaRechazada:string,
    FechaSolucion:string,
    MotivoRechazo:string,
    Observaci_onServidorPublico:string,
    Referencia:string,
    ServidorPublico:string,
    Ubicaci_onGPS:string,
    Area:string,
  };

  const renderRow = ({ item }: { item: reporteCiudadano })=>{
    let icon = "info"; 
    let estatusColor = cardColor;
    if(item.Tema.includes("Alumbrado"))
      icon = iconos[2].Icon
    if(item.Tema.includes("Agua"))
      icon = iconos[1].Icon
    if(item.Tema.includes("Catastro"))
      icon = iconos[0].Icon
    //NOTE: Estados del repoete ( 1=> Pendiente, 2=> Proceso, 3=>Atendida, 4=> Rechazada )
    if(item.Estatus == "2")
      estatusColor = BlueColor;
    if(item.Estatus == "3")
      estatusColor = buttonSuccess;
    if(item.Estatus == "4")
      estatusColor = PrimaryColor;

    return <View style = {{padding:2}} >
            <ListItem
              bottomDivider>
                <Icon name = { icon } type = {"font-awesome-5"} tvParallaxProperties/>  
                <TouchableOpacity onPress= {()=>{verReporte(item)}}>
                  <ListItem.Content >
                    <ListItem.Title>
                      { `Folio: ${item.Codigo} `}
                      <Badge
                        badgeStyle = {{backgroundColor:estatusColor }} 
                        value = {estatusLetra[ parseInt(item.Estatus) -1 ].Nombre}/>
                    </ListItem.Title>
                    <ListItem.Subtitle>
                      {`Referencia: ${item.Referencia == null ? "" : item.Referencia}`}
                    </ListItem.Subtitle>
                  </ListItem.Content>     
                </TouchableOpacity>
            </ListItem>
          </View>
  }
  const verReporte = (item:reporteCiudadano ) =>{
    props.navigation.navigate('Detalles', {"Reporte":item}); 
  }
  const refrescarLista = async () =>{
    setLoading(true);
    console.log("Prueba");
    await ObtenerMisReportes()
    .then((arregloReportes)=>{
      setReportes(arregloReportes);
    })
    .catch((error)=>{
      let message = String(error.message);
      console.log(message);
      if(message.includes("encontrados") || message.includes("no tiene registros")){
        setErrorMensaje("");
        setShowMessage(false);
      }else if(message.includes("interner")){
        setTituloMensaje("Error");
        setIconSource(WIFI_OFF[1]);
        setIcono(WIFI_OFF[0]);
        setErrorMensaje(message);
      setShowMessage(true);
      }else{
        setTituloMensaje("Mensaje");
        setIcono(ERROR[0]);
        setIconSource(ERROR[1]);
        setErrorMensaje(message);
      setShowMessage(true);
      }
      setReportes([]);
      
    })
    .finally(()=>{setLoading(false)})
  }
  return (
  <SafeAreaView>
    <FlatList
      refreshControl={
        <RefreshControl
        refreshing={refreshing}
        onRefresh={refrescarLista}
      />
      }
      data={reportes}
      keyExtractor={(a: reporteCiudadano, index: number) => index.toString()}
      renderItem={renderRow}
    /> 
  </SafeAreaView>    
  );
}