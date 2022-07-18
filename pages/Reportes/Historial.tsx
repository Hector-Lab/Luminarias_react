import * as React from 'react';
import { View,Text, SafeAreaView, Platform } from  'react-native';
import { FlatList, ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { azulColor } from '../../Styles/Color';
import { HistorialReportes } from '../controller/api-controller';
import Styles from '../../Styles/styles';
import ItemReporte from '../components/item-reporte';
import Loading from '../components/modal-loading';
import ReporteDetalle from '../components/detalle-reporte';

export default function Historial( props ) {
    const [ listaReporte, setListaReporte ] = React.useState([]);
    const [ cargando, setCargando ] = React.useState( false );
    const [ reporte, setReporte ] = React.useState( null );
    const [ mostrarDetalles, setMostrarDetalles ] = React.useState( false );
    const [ mostrarEvidencia, setMostrarEvidencia ] = React.useState( false );
    React.useEffect(()=>{
        setCargando( true );
        ObtenerReportes();
    },[]);
    const ObtenerReportes = async () =>{
        await HistorialReportes()
        .then(( Historial )=>{
            setListaReporte(Historial);
        })
        .catch( (error) =>{
            console.log( error );
        })
        .finally(()=>{
            setCargando(false);
        });
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
        </SafeAreaView>
    );
}