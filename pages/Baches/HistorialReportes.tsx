import React, { useState, useEffect, useRef } from "react";
import {
  View,
  ScrollView,
  FlatList,
  RefreshControl
} from "react-native";
import Styles from '../../Styles/BachesStyles';
import { StorageService } from "../controller/storage-controller";
import { ObtenerMisReportes } from '../controller/api-controller';
import { Icon, ListItem, Text, Button } from 'react-native-elements';
import { BlueColor, buttonSuccess, cardColor, DarkPrimaryColor, PrimaryColor } from "../../Styles/BachesColor";
import Message from '../components/modal-message';
import Loading, {} from '../components/modal-loading'; 
import { DESCONOCIDO,ERROR,INFO,OK, WIFI, WIFI_OFF } from '../../Styles/Iconos';

import { Badge } from "react-native-elements/dist/badge/Badge";
import { TouchableOpacity } from "react-native-gesture-handler";
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
          if(message.includes("encontrados")){
            setTituloMensaje("Mensaje");
            setIconSource(INFO[1]);
            setIcono(INFO[0]);
          }else if(message.includes("interner")){
            setTituloMensaje("Error");
            setIconSource(WIFI_OFF[1]);
            setIcono(WIFI_OFF[0]);
          }else{
            setTituloMensaje("Mensaje");
            setIcono(ERROR[0]);
            setIconSource(ERROR[1]);
          }
          setErrorMensaje(message);
          setShowMessage(true);
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
              hasTVPreferredFocus
              tvParallaxProperties
              bottomDivider>
                <Icon name = { icon } type = {"font-awesome-5"} tvParallaxProperties/>  
                <TouchableOpacity onPress= { ()=>{verReporte(item)} } >
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
    await ObtenerMisReportes()
    .then((arregloReportes)=>{
      setReportes(arregloReportes);
    })
    .catch((error)=>{
      let message = String(error.message);
      if(message.includes("encontrados")){
        setTituloMensaje("Mensaje");
        setIconSource(INFO[1]);
        setIcono(INFO[0]);
      }else if(message.includes("interner")){
        setTituloMensaje("Error");
        setIconSource(WIFI_OFF[1]);
        setIcono(WIFI_OFF[0]);
      }else{
        setTituloMensaje("Mensaje");
        setIcono(ERROR[0]);
        setIconSource(ERROR[1]);
      }

      setErrorMensaje(message);
      setShowMessage(true);
    })
    .finally(()=>{setLoading(false)})
  }
  return (
        <View style = {{flex:1}} >
          <View style = { Styles.cardContainer } >
            <View style = {Styles.cardHeader}>
              <View style = {Styles.cardLeftIcon}>
                <View style = {Styles.cardRpundedIcon} >
                  <Icon color = {"white"}  tvParallaxProperties  name = "street-view" type ="font-awesome-5" style = {{margin:3}} />
                </View>
              </View>
              <View style = {Styles.cardHeaderText}>
                <Text style = {{textAlign:"center"}} >Mis reportes</Text> 
              </View>
              <View style = {Styles.cardRigthIcon}>
              <View style = {Styles.cardRpundedIcon} >
                  <Icon color = {"white"}  tvParallaxProperties  name = "map" type ="feather" style = {{margin:3}} />
                </View> 
              </View>
            </View>
            <View style = {Styles.cardConteinerFlex8} >
                <FlatList
                  refreshControl={
                    <RefreshControl
                    refreshing={refreshing}
                    onRefresh={refrescarLista}
                  />
                  }
                  contentContainerStyle = {{flexGrow:1}}
                  data={reportes}
                  keyExtractor={(a: reporteCiudadano, index: number) => index.toString()}
                  renderItem={renderRow}
                />
            <Message
              transparent = { true }
              loading = {showMessage}
              message = {errorMensaje}
              buttonText="Aceptar"
              color = {DarkPrimaryColor}
              iconsource = {iconSource}
              icon = {icono}
              loadinColor = {DarkPrimaryColor}
              onCancelLoad={()=>{ setShowMessage(false) }}
              tittle = {tituloMensaje}
            />
            <Loading
              transparent = {true}
              loading = {loading}
              message={"Cargando..."}
              loadinColor = {DarkPrimaryColor}
              onCancelLoad = { ()=>{setLoading(false)}}
              tittle = { "Mensaje" }
            />
          </View>
          </View>
        </View>
  );
}