import * as React from 'react';
import { View,Text, SafeAreaView, Platform,TouchableOpacity, FlatList } from  'react-native';
import { azulColor } from '../../Styles/Color';
import { HistorialReportes } from '../controller/api-controller';
import Styles from '../../Styles/styles';
import ItemReporte from '../components/item-reporte';
import Loading from '../components/modal-loading';
import ReporteDetalle from '../components/detalle-reporte';
import { checkConnection } from '../../utilities/utilities';
import Message from '../components/modal-message';
import { WIFI_OFF, ERROR} from '../../Styles/Iconos';
import { StorageBaches } from '../controller/storage-controllerBaches';

export default function Historial( props ) {
    const storage = new StorageBaches();
    const [ listaReporte, setListaReporte ] = React.useState([]);
    const [ cargando, setCargando ] = React.useState( false );
    const [ reporte, setReporte ] = React.useState( null );
    const [ mostrarDetalles, setMostrarDetalles ] = React.useState( false );
    const [ mostrarEvidencia, setMostrarEvidencia ] = React.useState( false );
    //NOTE: manejadores de los mensajes
    const [ mensaje, setMensaje ] = React.useState(String);
    const [ icono, setIcono ] = React.useState( String );
    const [ iconoFuente, setIconoFuente ] = React.useState( String );
    const [ mostrarMensaje, setMostrarMensaje ] = React.useState( false );
    React.useEffect(()=>{
        setCargando( true );
        ObtenerReportes();
    },[]);
    const ObtenerReportes = async () =>{
        if(await checkConnection()){
            await HistorialReportes()
            .then( async ( Historial )=>{
                setListaReporte(Historial);
                //NOTE: guardamos datos en el storage
                await storage.guardarHistorialReportes( JSON.stringify(Historial) );
            })
            .catch( (error) =>{
                let msj = String(error.message);
                lanzarMensaje( msj , ( msj.includes("!Sin acceso a internet¡") ? WIFI_OFF[0]:ERROR[0] ), ( msj.includes("!Sin acceso a internet¡") ? WIFI_OFF[1]:ERROR[1] ));
            })
            .finally(()=>{
                setCargando(false);
            });
        }else{
            setCargando( false );
            lanzarMensaje("!Sin acceso a internet¡",WIFI_OFF[0],WIFI_OFF[1]);
            let historial = await storage.obtenerHistorialReporte();
            if( historial != null ){
                setListaReporte( JSON.parse(historial) );
            }
        }

    }
    const renderItem = ({item})=>{
        return(
            <ItemReporte
                Descripcion = { item.Descripci_on }
                Area = { item.Area }
                Estado = { item.Estatus }   
                FechaAlta = { item.FechaTupla }
                OnPressItem = { ()=> { setMostrarDetalles( true ); setReporte( item == "" ? null : item ) }}
            />
        );
    }
    const lanzarMensaje = ( msj:string, icn:string, icnf:string ) => {
        setMensaje(msj);
        setIcono(icn);
        setIconoFuente(icnf);
        setMostrarMensaje(true);
    }
    return(
        <SafeAreaView style ={{ flexGrow:1 }}>
            <View style = {{padding:20, flexGrow:1, backgroundColor:"white" }} >
                <Text style ={{marginTop:5, marginBottom:5, fontWeight:"bold", color:azulColor}} > Mis reportes </Text> 
                <View style = {{ flexGrow:1, borderRadius:3, backgroundColor:"#F2F2F2" }} >
                    {
                        listaReporte.length > 0 ?
                            ( 
                                <FlatList
                                    data = { listaReporte }
                                    renderItem = { renderItem }
                                    keyExtractor = { item => item.id }
                                />
                            ) :
                            (
                                <></>
                            )
                    }
                </View>
                <TouchableOpacity style = { Styles.btnOpacity } >
                    <Text style ={ Styles.btnTexto } > Regresar </Text>
                </TouchableOpacity>
            </View>
            <Loading 
                loadinColor = { azulColor }
                loading = { cargando }
                message = { "Cargando..." }
                onCancelLoad = {()=>{ }}
                tittle = {"Mensaje"}
                transparent = { true }
            />
            <ReporteDetalle
                Plataform = { Platform.OS }
                Reporte = { reporte }
                Visible = { mostrarDetalles }
                onClose = { () =>{ setMostrarDetalles(!mostrarDetalles) } }
                onMostrarEvidencia = { () =>{setMostrarEvidencia( !mostrarEvidencia )} }
                mostrarEvidencia = { mostrarEvidencia }
            />
            <Message 
                buttonText = {"Aceptar"}
                color = { azulColor }
                icon = { icono }
                iconsource = { iconoFuente }
                loadinColor = { azulColor }
                loading = { mostrarMensaje }
                message = { mensaje }
                onCancelLoad = { ( )=>{ setMostrarMensaje( false )} }
                tittle = { "Mensaje" }
                transparent = { true }
            />
        </SafeAreaView>
    );
}