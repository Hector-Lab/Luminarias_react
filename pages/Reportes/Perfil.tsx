import * as React from 'react';
import { View,Text, ScrollView, SafeAreaView,TextInput,TouchableOpacity } from 'react-native';
import { azulColor } from '../../Styles/Color';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Styles from '../../Styles/styles';
import Loading from '../components/modal-loading';
import Message from  '../components/modal-message';
import { ObtenerCiudadano, ActualizarDatosCiudadano } from '../controller/api-controller';
import { StorageBaches } from '../controller/storage-controllerBaches';
import { WIFI_OFF,DESCONOCIDO,OK } from '../../Styles/Iconos';
import { checkConnection, verificarcurp } from '../../utilities/utilities';


const validacion = Yup.object().shape({
    Nombre: Yup.string().required("Requerido"),
    Paterno:Yup.string().required("Requerido"),
    Materno:Yup.string().required("Requerido"),
    Curp: Yup.string().required("Requerido"),
    Telefono: Yup.string().required("Requerido"),
    Email: Yup.string().required("Requerido"),
    Localidad: Yup.string().required("Requerido"),
    Calle: Yup.string().required("Requerido"),
    Numero:Yup.number().positive().required("Requerido"),
    Colonia:Yup.string().required("Requerido"),
    Postal:Yup.string().required("Requerido")
});

export default function Perfil( props ){ 
    const storage = new StorageBaches(); 
    const [ cargando, setCargando ] = React.useState( false );
    //NOTE: manejadores de modal mensajes
    const [ mensaje, setMensaje ] = React.useState( String);
    const [ icono, setIcono ] = React.useState( String );
    const [ iconoFuente, setIconoFuente ] = React.useState( String );
    const [ mostrarMensaje, setMostrarMensaje ] = React.useState( false );
    const erroresCurp = [ "TESTs","CURP no valida","Formato no valido" ];
    //NOTE: obtener datos del api
    React.useEffect(()=>{
        setCargando( true );
        obtenerDatosCiudadano();
    },[]);
    const formik = useFormik({
        initialValues:{
            Nombre:"",
            Paterno:"",
            Materno:"",
            Curp:"",
            Telefono:"",
            Email:"",
            Localidad:"",
            Calle:"",
            Numero:"",
            Colonia:"",
            Postal:""
        },
        onSubmit: ( values )=>{ enviarDatosCiudadano( values ) },
        validationSchema:validacion
    });
    
    const enviarDatosCiudadano = async ( datos: { Nombre:string, Paterno:string, Materno: string, Curp:string, Telefono:string, Email:string, Localidad:string, Calle:string, Numero:string, Colonia:string,Postal:string }) =>{
        let code = await verificarcurp( datos.Curp );
        if( await checkConnection() ){
            if( code == 0 ){ //NOTE: Curp valida se envia a el API
                await ActualizarDatosCiudadano(datos)
                .then(( responce )=>{
                    lanzarMensaje("Datos actualizados",OK[0],OK[1]);
                })
                .catch((error)=>{
                    let mensaje = String(error.message);
                    lanzarMensaje(mensaje,"info","material");
                });
            }
            lanzarMensaje( erroresCurp[code],"info","material" );
        }else{
            lanzarMensaje("Sin acceso a internet",WIFI_OFF[0],WIFI_OFF[1]);
        }
    }
    const obtenerDatosCiudadano = async () =>{
        if( await checkConnection() ){
            await ObtenerCiudadano()
            .then( async ( ciudadano )=>{
                asignarDatos(ciudadano);
                console.log("Desde el API");
                await storage.guardarDatosPerfil(JSON.stringify(ciudadano));
            })
            .catch(( error )=>{
                let msj = String(error.message);
                if( msj.includes("!Sin acceso a internet¡") ){
                    lanzarMensaje(msj,WIFI_OFF[0],WIFI_OFF[1]);
                }else if (msj.includes("Servicio no disponible")){
                    lanzarMensaje( msj, DESCONOCIDO[0],DESCONOCIDO[1]);
                }
            })
            .finally(()=>{
                setCargando(false);
            })
        }else{
            setCargando( false );
            console.log("Desde el storage");
            let datos = await storage.obtenerDatosPerfil();
            asignarDatos(JSON.parse(datos));
        }
    }
    const lanzarMensaje = (mensaje:string,icono:string, iconoFuente:string) =>{
        setMensaje(mensaje);
        setIcono(icono);
        setIconoFuente(iconoFuente);
        setMostrarMensaje( true );
    }
    const asignarDatos = ( ciudadano: 
        { 
            Calle:string, 
            CodigoPostal:string, 
            Colonia:string, 
            CorreoElectronico:string, 
            Curp:string, 
            FechaTupla:string, 
            Localidad:string, 
            Nombre:string,
            Numero:string,
            Telefono:string,
            ApellidoMaterno:string,
            ApellidoPaterno:string
        }
        )=>{
        formik.setFieldValue("Calle",ciudadano.Calle);
        formik.setFieldValue("Postal",ciudadano.CodigoPostal);
        formik.setFieldValue("Colonia",ciudadano.Colonia);
        formik.setFieldValue("Email",ciudadano.CorreoElectronico);
        formik.setFieldValue("Curp",ciudadano.Curp);
        formik.setFieldValue("Localidad",ciudadano.Localidad);
        formik.setFieldValue("Nombre",ciudadano.Nombre);
        formik.setFieldValue("Numero",ciudadano.Numero);
        formik.setFieldValue("Telefono",ciudadano.Telefono);
        formik.setFieldValue("Paterno",ciudadano.ApellidoPaterno);
        formik.setFieldValue("Materno",ciudadano.ApellidoMaterno);
        
        //formik.setFieldValue("Paterno",ciudadano.)
    }

    return(
        <SafeAreaView style = {{ flexGrow:1, backgroundColor:"white" }} >
            <ScrollView style = {{ flex:1 , padding:10,marginTop:20 }} >
                <Text style = {{fontWeight:"bold", color:azulColor }} > Datos personales </Text>
                <View style = {{ borderRadius:5, borderWidth:1, borderStyle:"dotted", paddingLeft:10,paddingRight:10 }} >
                    <Text style = {Styles.txtLabel} > Nombre </Text>
                    <TextInput 
                        style = { [ ( formik.errors.Nombre &&  formik.touched.Nombre ) ? Styles.errorCampo : Styles.campo,{ marginTop:0 } ] } 
                        placeholder = { "Nombre" }
                        value = { formik.values.Nombre }
                        onChangeText = { formik.handleChange("Nombre") }
                        />
                    <Text style = {Styles.txtLabel} > Apellido Paterno </Text>
                    <TextInput 
                        style = { [ ( formik.errors.Paterno && formik.touched.Paterno ) ? Styles.errorCampo : Styles.campo ,{ marginTop:0 }] } 
                        placeholder = { "Apellido Paterno" }
                        value = { formik.values.Paterno }
                        onChangeText = { formik.handleChange("Paterno") }
                        />
                    <Text style = {Styles.txtLabel} > Apellido Materno </Text>
                    <TextInput 
                        style = {[ ( formik.errors.Materno && formik.touched.Materno ) ? Styles.errorCampo : Styles.campo,{marginTop:0 }] } 
                        placeholder = { "Apellido Materno" }
                        value = { formik.values.Materno }

                        onChangeText = { formik.handleChange("Materno") }
                        />
                    <Text style = {Styles.txtLabel} > CURP </Text>
                    <TextInput 
                        style = {[ ( formik.errors.Curp && formik.touched.Curp ) ? Styles.errorCampo :  Styles.campo,{marginTop:0,backgroundColor:"#6c757d70", color:"#6c757dff"}]}
                        placeholder = { "CURP" }
                        value = { formik.values.Curp }
                        onChangeText = { formik.handleChange("Curp") }
                        editable = { false }
                        selectTextOnFocus = { false }
                        />
                    <Text style = {Styles.txtLabel} > Telefono </Text>
                    <TextInput 
                        style = {[ ( formik.errors.Telefono && formik.touched.Telefono ) ?  Styles.errorCampo : Styles.campo,{marginTop:0}] } 
                        placeholder = { "Telefono" }
                        value = { formik.values.Telefono }
                        onChangeText = { formik.handleChange("Telefono")}
                    />
                    <Text style = {Styles.txtLabel} > Email </Text>
                    <TextInput 
                        style = {[ ( formik.touched.Curp && formik.errors.Curp ) ? Styles.errorCampo : Styles.campo,{marginTop:0, marginBottom:17 }] } 
                        placeholder = { "Email" }
                        value = { formik.values.Email }
                        onChangeText = { formik.handleChange("Email") }
                        />
                </View>
                <Text style = {{ fontWeight:"bold",color:azulColor,marginTop:20 }}> Dirección </Text>
                <View style = {{ borderRadius:5, borderWidth:1, borderStyle:"dashed", paddingLeft:10, paddingRight:10 }} >
                    <Text style = {Styles.txtLabel} > Localidad </Text>
                    <TextInput
                        style = {[ ( formik.touched.Localidad && formik.errors.Localidad ) ? Styles.errorCampo : Styles.campo,{marginTop:0}]} 
                        placeholder = { "Localidad" }
                        value = { formik.values.Localidad }
                        onChangeText = { formik.handleChange("Localidad") }
                         />
                    <Text style = {Styles.txtLabel} > Calle </Text>
                    <TextInput 
                        style = {[( formik.touched.Calle && formik.errors.Calle ) ? Styles.errorCampo : Styles.campo,{marginTop:0}]} 
                        placeholder = { "Calle" }
                        value = { formik.values.Calle }
                        onChangeText = { formik.handleChange("Calle") }
                        />
                    <Text style = {Styles.txtLabel} > Numero </Text>
                    <TextInput 
                        style = {[ ( formik.touched.Numero && formik.errors.Numero ) ? Styles.errorCampo : Styles.campo ,{marginTop:0}]} 
                        placeholder = { "Numero" }
                        value = { formik.values.Numero }
                        onChangeText = { formik.handleChange("Numero") }
                        />
                    <Text style = {Styles.txtLabel} > Colonia </Text>
                    <TextInput 
                        style = {[ ( formik.touched.Colonia && formik.errors.Colonia ) ? Styles.errorCampo : Styles.campo,{marginTop:0}]} 
                        placeholder = { "Colonia" } 
                        value = { formik.values.Colonia }
                        onChangeText = { formik.handleChange("Colonia") }
                        />
                    <Text style = {Styles.txtLabel} > Codigo Postal </Text>
                    <TextInput 
                        style = {[ ( formik.touched.Postal && formik.errors.Postal ) ?  Styles.errorCampo : Styles.campo,{ marginTop:0, marginBottom:17 }]} 
                        placeholder = { "Codigo Postal" } 
                        value = { formik.values.Postal }
                        onChangeText = { formik.handleChange("Postal") }
                        />
                </View>
            </ScrollView>
            <TouchableOpacity onPress = { formik.handleSubmit } style = {[Styles.btnOpacity,{marginRight:20,marginLeft:20,marginBottom:20}]} >
                    <Text style ={ Styles.btnTexto } > Guardar </Text>
            </TouchableOpacity>
            <Loading
                loadinColor = { azulColor }
                loading = { cargando }
                message = { "Cargando..." }
                onCancelLoad = { () => { console.log("Cargando..."); }}
                tittle = { "Mensaje..." }
                transparent = { true }
            />
            <Message 
                buttonText = { "Aceptar" }
                color = { azulColor }
                icon = { icono }
                iconsource = { iconoFuente }
                loadinColor = { azulColor }
                loading = { mostrarMensaje  }
                message = { mensaje }
                onCancelLoad = {()=>{ setMostrarMensaje(false) }}
                tittle = { "Mensaje" }
                transparent = { true }
            />
        </SafeAreaView>
    );
}