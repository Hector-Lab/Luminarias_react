import React, { useEffect, useState } from "react";
import { View, TouchableOpacity, Image, Dimensions, RefreshControl, ScrollView } from "react-native";
import { Icon, Text, Button, Divider, Card } from 'react-native-elements';
import Styles from '../../Styles/BachesStyles';
import { BlueColor, cardColor, DarkPrimaryColor } from "../../Styles/BachesColor";
import Loading from '../components/modal-loading';
import Evidencias from '../components/modalEvidencia';
import Message from '../components/modal-message';
import { WIFI_OFF,ERROR,  } from '../../Styles/Iconos';
import { RefrescarReporte } from '../controller/api-controller';

export default function DetallesReporte(props:any){
    const [ Reporte, setReporte ] = useState(null); 
    const [ headerIcon , setHeaderIcon ] = useState("info");
    const [ loading, setLoading ] = useState(true);
    const [ mapaBloqueado, setMapaBloqueado ] = useState(false);
    const [ evidenciaBloque, setEvidenciaBloqueo ] = useState(false);
    const [ modalEvidenciasVisible, setModalEvidenciasVisible ] = useState(false);
    const [ arrayImagenes, setArrayImagenes ] = useState([]);
    const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');
    const [ activeIndex, setActiveIndex ] = useState(0);
    const [ observacionCentrado, setObservacionCentrado ] = useState(true);
    const caorusel = React.useRef(null);
    const [recahazada, setRechazada ] = useState(false);
    const [refrescar, setRefrescar ] = useState(false);
    const iconos = [{"icon":"building"},{"icon":"tint"},{"icon":"lightbulb"},{"icon":"road"}];
    const estatusLetra = [{"Nombre":"Pendiente"},{"Nombre":"Proceso"},{"Nombre":"Atendida"},{"Nombre":"Rechazada"}];
    //NOTE: manejadore del componente de base de datos
    const [iconMessage, setIconMessage ] = useState("info");
    const [iconSource, setIconSource  ]= useState(""); 
    const [ message, setMessage ] = useState("");
    const [ mostrarMensaje, setMostrarMensaje ] = useState(false);
    let estatusColor = cardColor;
    useEffect(()=>{
        let { Reporte } = props.route.params;
        console.log(Reporte.id);
        setRechazada(Reporte.FechaRechazada != null);
        //NOTE: Seleccionamos el icono
        if(Reporte.Area.includes("Alumbrado"))
            setHeaderIcon(iconos[2].icon);
        if(Reporte.Area.includes("Agua"))
            setHeaderIcon(iconos[1].icon);
        if(Reporte.Area.includes("Catastro"))
            setHeaderIcon(iconos[0].icon);
        if(Reporte.Ubicaci_onGPS == null || Reporte.Ubicaci_onGPS == ""){
            setMapaBloqueado(true);
        }else{
            setMapaBloqueado(false);
        }
        //NOTE: Buscamos los datos de las imagenes
        Reporte != null ? ( Reporte.Observaci_onServidorPublico != null ?  setObservacionCentrado(false) : setObservacionCentrado(true) ) : setObservacionCentrado(true);
        
        if(Reporte.Rutas == null, Reporte.Rutas == ""){
            setEvidenciaBloqueo(true);
        }else{
            let arrayImagenes = String(Reporte.Rutas).split(",");
            setArrayImagenes(arrayImagenes);
            setMapaBloqueado(false);
        }
        
        setReporte(Reporte);
    },[]);
    useEffect(()=>{
        if( Reporte != null ){
            setLoading(false);
        }
    },[Reporte])
    const verMapa = () =>{
        //props.navigation.navigate('Detalles', {"Reporte":item});
        props.navigation.navigate("Mapa",{"Reporte":Reporte});
    }
    /**
     * INDEV: Componentes para el modal de imagenes
     */
    function wp (percentage) {
        const value = (percentage * viewportWidth) / 100;
        return Math.round(value);
    }
    const slideHeight = viewportHeight * 0.36;
    const slideWidth = wp(70);
    const itemHorizontalMargin = wp(11);
    const itemWidth = slideWidth + itemHorizontalMargin * 2;
    const RetrocesoReporte = () => {
        props.navigation.pop();
    }
    const activeIndexFunction = (index) =>{
        console.log(index);
        setActiveIndex(index);
    }
    const ActualizarReporte = async () =>{
        setRefrescar(true);
        await RefrescarReporte(String(Reporte.id))
        .then((result)=>{
            setReporte(JSON.parse(result));
            //NOTE: verificamos que los datos sean de salida
            if(Reporte.FechaRechazada != null ){
                setRechazada(true);
            }
        }).catch((error)=>{
            let menssage = String(error.message);
            if(menssage.includes("interner")){
                setIconMessage(WIFI_OFF[0]);
                setIconSource(WIFI_OFF[1]);
                setMessage(menssage);
                setMostrarMensaje(true);
            }else{
                setIconMessage(ERROR[0]);
                setIconSource(ERROR[1]);
                setMessage(menssage);
                setMostrarMensaje(true);
            }
        }).finally(()=>{
            setRefrescar(false);
        });
    }
    return (
        <ScrollView 
            contentContainerStyle = {{flexGrow:1}}
            refreshControl={ 
                <RefreshControl
                    refreshing = {refrescar}
                    onRefresh={ ActualizarReporte }
                />
            }
            >
            <View style = {Styles.cardContainer}>
            <View style = {Styles.cardHeader}>
              <View style = {Styles.cardLeftIcon}>
                <View style = {Styles.cardBackButton} >
                    <TouchableOpacity onPress = { RetrocesoReporte } >
                        <Icon color = {"white"} tvParallaxProperties  name = "arrow-circle-left" type ="font-awesome-5" style = {{margin:3}} />
                    </TouchableOpacity>
                </View>
              </View>
              <View style = {Styles.cardHeaderText}>
                <Text style = {{textAlign:"center", fontWeight:"bold"}} >
                    {`Folio: ${(Reporte != null  ) ? Reporte.Codigo: "" } \n Hector Ramirez Contreras`}
                    </Text>
              </View>
              <View style = {Styles.cardRigthIcon}>
              <View style = {[Styles.cardRpundedIcon]} >
                  <Icon color = {"white"}  tvParallaxProperties  name = {headerIcon} type ="font-awesome-5" style = {{margin:5}} />
                </View> 
              </View>
            </View>
            <View style = {[Styles.cardConteinerFlex8,{marginTop:10}]} >
                <ScrollView style = {{flexGrow:1}} >
                    <View>
                        <View style = {{flex:1, flexDirection:"column", margin:20, backgroundColor:"white", borderRadius:10}} >
                            <Text style = {[Styles.directionTittleColor, {fontWeight:"bold"}]}>Descripción</Text>
                            <Divider/>
                            <TouchableOpacity>
                                <Text style = {{padding:5}} numberOfLines={5}>{Reporte != null ? Reporte.Descripci_on : ""} </Text>
                            </TouchableOpacity>
                        </View>
                        <View style = {{flex:1, flexDirection:"column", margin:20, backgroundColor:"white", borderRadius:10}} >
                            <Text style = {[Styles.directionTittleColor, {fontWeight:"bold"}]}>Observación del servidor publico </Text>
                            <Divider/>
                            <TouchableOpacity>
                                <Text style = {{padding:5, textAlign: observacionCentrado ? "center" : "left" }} numberOfLines={5}>{Reporte != null ? (Reporte.Observaci_onServidorPublico != null ? Reporte.Observaci_onServidorPublico : "Sin Observaciones") : ""} </Text>
                            </TouchableOpacity>
                        </View>
                        <View style = {{flex:1}} >
                            <View style = {{flex:1, flexDirection:"column"}}>
                                <Text
                                    style = {{ fontWeight:"bold" ,padding:7, backgroundColor: "white", borderRadius:10}}
                                >
                                    {`Estatus: ${ Reporte != null ? (Reporte.Ubicaci_onEscrita != null ? (estatusLetra[parseInt(Reporte.Estatus) -1 ].Nombre):("Pendiente") ) : "" }`}
                                </Text>
                                
                                <Text 
                                    style = {{padding:7, backgroundColor: "white", borderRadius:10, marginTop:10}}
                                    > {`Tema: ${ Reporte != null ? Reporte.Area : "" }`} </Text>
                                <Text
                                    style = {{padding:7, backgroundColor: "white", borderRadius:10, marginTop:10}}
                                >
                                    {`Direccion: ${ Reporte != null ? Reporte.Ubicaci_onEscrita : "" }`}
                                </Text>
                                <Text
                                    style = {{padding:7, backgroundColor: "white", borderRadius:10, marginTop:10}}
                                >
                                    {`Referencia: ${ Reporte != null ? (Reporte.Referencia != null ? Reporte.Referencia : "" )  : "" }`}
                                </Text>
                                <Text
                                    style = {{padding:7, backgroundColor: "white", borderRadius:10, marginTop:10}}
                                >
                                    {`Fecha del Reporte: ${ Reporte != null ? Reporte.FechaTupla : "" }`}
                                </Text>
                                {/**Datos del servidor publico */}
                                <Text
                                    style = {{padding:7, backgroundColor: "white", borderRadius:10, marginTop:10}}
                                >
                                    {`Servidor Publico: ${ (Reporte != null ) ? (Reporte.ServidorPublicoNombre != null ? Reporte.ServidorPublicoNombre : "No asignado"  ) : "" }`}
                                </Text>
                                <Text
                                    style = {{padding:7, backgroundColor: "white", borderRadius:10, marginTop:10}}
                                >
                                    {`Telefono: ${ Reporte != null ? (Reporte.Telefono != null ? Reporte.Telefono : "No asignado" ) : "No Asignado" }`}
                                </Text>
                                <Text
                                    style = {{padding:7, backgroundColor: "white", borderRadius:10, marginTop:10}}
                                >
                                    {`Fecha de Atencion: ${ Reporte != null ? (Reporte.FechaAtendida != null ? ( Reporte.FechaAtendida ):( "Prendiente" )) : "" }`}
                                </Text>
                                <Text
                                    style = {{padding:7, backgroundColor:"white", borderRadius:10, marginTop:10}}
                                >
                                    {`Fecha Estimada: ${Reporte != null ? ( Reporte.FechaSolucion != null ? Reporte.FechaSolucion : "Sin asignar" ) : "Pendiente"}`}
                                </Text>
                                {
                                    //NOTE: Solo aparece si se rechazo el reporte
                                    recahazada ? <View>
                                        <Text
                                            style = {{padding:7, backgroundColor:"white", borderRadius:10, marginTop:10}}
                                        >
                                            {`Fecha de rechazada: ${Reporte != null ? ( Reporte.FechaRechazada != null ? Reporte.FechaRechazada : "No Aplica" ) : "No Aplica"}`}
                                        </Text>
                                        <Text
                                            style = {{padding:7,backgroundColor:"white",borderRadius:10, marginTop:10}}                                        
                                        >
                                            {`Motivo de rechazo : ${Reporte != null ? (Reporte.MotivoRechazo != null ? Reporte.MotivoRechazo : "No Aplica" ) : "No Aplica"}`}
                                        </Text>
                                    </View> : <></>
                                }
                            </View>
                        </View>
                        <View style = {{flex:1,flexDirection:"row", marginTop:20, justifyContent:"center"}} >
                        <Button 
                            disabled = { evidenciaBloque }
                            icon={{
                                name: 'eye',
                                type: 'font-awesome-5',
                                size: 15,
                                color: 'white',
                            }}
                            onPress = { ()=>{setModalEvidenciasVisible(true)} }
                            title={" Evidencia"}
                            buttonStyle = {[Styles.btnButtonSuccessSinPading]} />
                        <Button 
                            disabled = { mapaBloqueado }
                            icon={{
                                name: 'map-pin',
                                type: 'font-awesome-5',
                                size: 15,
                                color: 'white',
                            }}
                            onPress = { verMapa }
                            title={" Ver mapa"}
                            buttonStyle = {[Styles.btnButtonSuccessSinPading ]} />
                        </View>
                    </View>
                </ScrollView>
            </View>
            </View>
            {/*NOTE: Modal para eliminar*/}
            <Loading 
                transparent = {true}
                loading = {loading}
                message = ""
                loadinColor = {BlueColor}
                onCancelLoad={()=>{}}
                tittle="Mensaje"
            />
            <Evidencias
                transparente = {false}
                visible = {modalEvidenciasVisible}
                itemWidth={ itemWidth }
                slideWidth={ slideWidth }
                reference={caorusel}
                arregloImagenes={arrayImagenes}
                onButtonPress={ ()=>{setModalEvidenciasVisible(false)}}
                activeIndex={activeIndex}
                arrayLength={ arrayImagenes.length }
                activeIndexFunction = {activeIndexFunction}
            />
            <Message
                tittle="Mensaje"
                transparent = {true}
                buttonText = {"Aceptar"}
                color = {BlueColor}
                icon = {iconMessage}
                iconsource = {iconSource}
                loadinColor = {BlueColor}
                loading = {mostrarMensaje} //NOTE: lo mostramos cuando 
                message = {message}
                onCancelLoad={()=>{ setMostrarMensaje(false)}}
            />
        </ScrollView>
    );
}