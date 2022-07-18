import * as React from 'react';
import { View, Text, TextInput, Platform, ActivityIndicator, SafeAreaView, TouchableOpacity,ScrollView, findNodeHandle, Pressable } from 'react-native'
import DropDownPicker from 'react-native-dropdown-picker';
import * as ImagePicker from 'expo-image-picker';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { CatalogoSolicitud,EnviarReporte } from '../controller/api-controller';
import { azulColor,SuinpacRed } from '../../Styles/Color';
import Styles from '../../Styles/styles';
import { Icon, Image } from 'react-native-elements';
import File from '../components/item-camara';
import { requestForegroundPermissionsAsync, getForegroundPermissionsAsync,PermissionStatus } from 'expo-location';
import { ObtenerDireccionActual,CordenadasActualesNumerico } from '../../utilities/utilities';
import Loading from '../components/modal-loading';
import Message from '../components/modal-message';
import { INFO, OK } from '../../Styles/Iconos'
import { forModalPresentationIOS } from '@react-navigation/stack/lib/typescript/src/TransitionConfigs/CardStyleInterpolators';

const ErrorPermisos = new Error("Permisos negados por el usuario\n"); 
let validacion = Yup.object().shape({
    Descripcion:Yup.string().required("Requerido"),
    Referencia: Yup.string().required("Requerido")
});

export default function Reportar(props) {
    //NOTE: manejadores del comobo
    const [ mostrarCombo, setMostrarCombo ] = React.useState(false);
    const [ seleccionArea, setSeleccionArea ] = React.useState(0);
    const [ catalogoAreas, setCatalogoAreas ] = React.useState([]);
    //NOTE: manejadores de imagenes 
    const [ arregloImagenes, setArregloImagenes ] = React.useState([]); 
    const [ imagenActiva, setImagenActiva ] = React.useState( String );

    const [ cargando, setCargando ] = React.useState( false );
    //NOTE: Manejadores de mensajes
    const [ mensaje, setMensaje ] = React.useState(String);
    const [ icono, setIcono ] = React.useState(String);
    const [ iconoFuente, setIconoFuente ] = React.useState(String);
    const [ mostrarMensaje, setMostrarMensaje ] = React.useState( false );

    

    const formik = useFormik({
        initialValues:{
            Descripcion:"",
            Referencia: ""
        },
        onSubmit:( campos )=>{ 
            if( seleccionArea != 0 ){
                setCargando( true );
                Enviar( campos ) 
            }else{
                lanzarMensaje("Seleccione un tema",INFO[0],INFO[1]);
            }
        },
        validationSchema:validacion
    })
    
    React.useEffect(() => {
        obtenerCatalogos();
    }, []);
    const obtenerCatalogos = async () => {
        await CatalogoSolicitud()
            .then((catalogo) => {
                //NOTE: recorremos los datos y damos formato para el combo
                let listaAreas = catalogo.map((item, index) => {
                    return {
                        label: item.descripci_on,
                        value: item.id,
                        key: item.id
                    }
                });
                setCatalogoAreas(listaAreas);

            })
            .catch(() => {
                //FIXME: arreglamos los errores del catch
            })
    }
    const verificarPermisosCamara = async () =>{
        let { status } = await ImagePicker.getCameraPermissionsAsync();
        if( status != ImagePicker.PermissionStatus.GRANTED ){
            await ImagePicker.requestCameraPermissionsAsync();
        }else{
            lanzarCamara();
        }
    }
    const lanzarCamara = async () =>{
        let result = await ImagePicker.launchCameraAsync({
            base64:true,
            allowsEditing:false
        });
        if( !result.cancelled ){
            setArregloImagenes( ()=> [...arregloImagenes,result ] )
            setImagenActiva(result.uri);
        }
    }
    const eliminarImagen = async () =>{
        setArregloImagenes( arregloImagenes.filter( (item) => { return item.uri != imagenActiva }));
        setImagenActiva("");
    }
    const Enviar = async ( datos:{ Descripcion: string, Referencia: string} ) =>{
        let imagenesCodificadas = [];
        arregloImagenes.map(( item,index )=>{
            imagenesCodificadas.push("data:image/jpeg;base64,"+item.base64);
        });
        try{
            await validarPermisosLocation()
            .then( async ( result )=>{
                //INDEV: juntamos los datos oara el reporte
                let reporte = {
                    Tema: String(seleccionArea),
                    Descripcion: datos.Descripcion,
                    Referencia: datos.Referencia,
                    gps: JSON.stringify(result.Coords),
                    direccion: JSON.stringify(result.Direccion),
                    Evidencia: ( imagenesCodificadas.length > 0 ) ? imagenesCodificadas : null
                };
                await EnviarReporte(reporte)
                .then(( code )=>{
                    lanzarMensaje("Reporte Enviado",OK[0],OK[1]);
                    limpiarCampos();
                })
                .catch((error)=>{
                    lanzarMensaje("¡Error al registrar el reporte!\nFavor de intentar más tarde",OK[0],OK[1]);
                })
                .finally(()=>{
                    setCargando( false );
                })
            })
            .catch(( error )=>{
                setCargando( false );
                lanzarMensaje( "Permisos negados por el usuario",INFO[0],INFO[1] );
            })
        }catch( error ){    
            console.log(error);
        }
    }
    const validarPermisosLocation = async () =>{
        let { status } = await getForegroundPermissionsAsync(); 
        if( status == PermissionStatus.GRANTED ){
            let coords = await CordenadasActualesNumerico();
            let direccion = await ObtenerDireccionActual(coords);
            return {"Coords":coords, "Direccion":direccion };
        }else{
            let { status } = await requestForegroundPermissionsAsync();
            if( status == PermissionStatus.GRANTED ){
                let coords = await CordenadasActualesNumerico();
                let direccion = await ObtenerDireccionActual(coords);
                return {"Coords":coords, "Direccion":direccion };
            }else{
                throw ErrorPermisos;
            }
        }
    }
    const lanzarMensaje = ( mensaje:string, icono:string, fuenteIcon:string ) =>{
        setMensaje(mensaje);
        setIcono( icono );
        setIconoFuente( fuenteIcon );
        setMostrarMensaje( true );
    }
    const limpiarCampos = () => {
        formik.setFieldValue("Referencia","");
        formik.setFieldValue("Descripcion","");
        formik.setFieldTouched("Descripcion",false);
        formik.setFieldTouched("Referencia",false);
        setSeleccionArea(0);
        setArregloImagenes([]);
        setImagenActiva("");
    }
    return (
        <SafeAreaView style={{ flex: 1 }} >
            <ScrollView style={{ flexGrow: 1 }} >
                <DropDownPicker
                    language="ES"
                    containerStyle={{ borderRadius: 20, padding: 20 }}
                    items={catalogoAreas}
                    open={mostrarCombo}
                    setValue={ setSeleccionArea }
                    value={ seleccionArea }
                    min={10}
                    max={15}
                    listMode={"MODAL"}
                    listItemContainerStyle={{ padding: 10 }}
                    itemSeparator={true}
                    selectedItemLabelStyle={{ fontWeight: "bold" }}
                    selectedItemContainerStyle={{ backgroundColor: azulColor + 45 }}
                    placeholder={"SELECCIONE UNA OPCIÓN"}
                    setOpen={setMostrarCombo}
                />
                <TextInput
                    style={[( formik.errors.Descripcion && formik.touched.Descripcion ) ?  Styles.errorCampo : Styles.campo , { textAlignVertical: "top", marginLeft: 20, marginRight: 20 }, (Platform.OS == "ios" ? { height: 33 * 4 } : {})]}
                    placeholder={"Descripcion del reporte"}
                    multiline
                    numberOfLines={5}
                    value = { formik.values.Descripcion }
                    onChangeText = { formik.handleChange("Descripcion") }
                />

                <TextInput
                    style={[( formik.errors.Referencia && formik.touched.Referencia ) ?  Styles.errorCampo : Styles.campo, { marginLeft: 20, marginRight: 20 }]}
                    placeholder={"Referencia"}
                    value = { formik.values.Referencia }
                    onChangeText = {  formik.handleChange("Referencia") }
                />
                <Text style={{ marginLeft: 15, fontWeight: "bold", marginTop: 20 }} > Evidencia </Text>
                <View style={{  marginLeft: 20, marginRight: 20, borderWidth:1, borderColor:"#6c757d", borderStyle:"dotted", borderRadius:5 }} >
                    <View style={{ flexDirection: "row" }} >
                        <ScrollView style={{  borderStyle:"dotted",borderRightWidth:4 ,width:"80%", borderWidth:1, flexDirection: "row", height:125, borderColor:"#6c757d", borderRadius:5 }} horizontal = { true } >
                            {
                                arregloImagenes.map((item,index)=>{
                                    return <File 
                                        key = { item.uri } 
                                        onPress = { ()=>{ setImagenActiva( item.uri ); }} 
                                        selected  = { item.uri === imagenActiva }
                                        onDelete = { eliminarImagen }
                                        />
                                })
                            }
                        </ScrollView>
                        <View style={{ justifyContent: "center" }} >
                            <TouchableOpacity onPress = {verificarPermisosCamara} style={{ borderWidth: 1, borderColor: "white", borderRadius: 30, padding: 10, marginLeft: 10, marginRight: 10, backgroundColor: SuinpacRed + 90 }} >
                                <Icon name="camera" type="material" color={"white"}> </Icon>
                            </TouchableOpacity>
                        </View>
                    </View>
                    {
                        imagenActiva != "" ?  <View style={{ justifyContent: "center", alignItems: "center", marginTop: 20, marginBottom:20 }} >
                                    <Image source={{ uri: imagenActiva }} style={{ height: 300, width: 270, borderRadius: 5, borderBottomWidth:2 }} />
                                </View> : <></>
                    }
                </View>
            </ScrollView>
            <TouchableOpacity onPress = { formik.handleSubmit } style={[Styles.btnOpacity,{marginBottom:20, marginRight:20,marginLeft:20 }]} >
                <Text style={Styles.btnTexto} > Reportar </Text>
            </TouchableOpacity>
            <Loading 
                message = { "Cargando..." }
                loading = { cargando }
                loadinColor = { azulColor }
                onCancelLoad = { ()=>{  } }
                tittle = { "Mensaje" }
                transparent = { true }
            />
            <Message 
                message = { mensaje }
                loading = { mostrarMensaje }
                loadinColor = { azulColor }
                buttonText = { "Aceptar" }
                color = { azulColor }
                icon = { icono }
                iconsource = { iconoFuente }
                onCancelLoad = { ()=>{ setMostrarMensaje( false ); } }
                tittle = { "Aceptar" }
                transparent = { true }
            />
        </SafeAreaView>
    )
}