import React, { useState, useEffect, useRef } from "react";
import { SafeAreaView, ScrollView, Text, ImageBackground, View, TextInput, TouchableOpacity, StatusBar } from 'react-native';
import { Formik, useFormik } from 'formik';
import { Avatar, Divider } from 'react-native-elements';
import * as Yup from 'yup';
import { StorageBaches } from '../controller/storage-controllerBaches';
import { ObtenerDatosContacto, ActualizarDatosContactos } from '../controller/api-controller';
import Styles from '../../Styles/styles';
import Loading from '../components/modal-loading';
import { azulColor } from "../../Styles/Color";
import Message from '../components/modal-message';
import { DESCONOCIDO,ERROR,OK } from '../../Styles/Iconos';

let storage = new StorageBaches();
let valores = {
    UnoNombre: '',
    UnoTelefono: '',
    UnoDireccion: '',
    UnoEmail: '',
    DosNombre: '',
    DosTelefono: '',
    DosDireccion: '',
    DosEmail: ''
}
let validacion = Yup.object().shape({
    UnoNombre: Yup.string().required(),
    UnoTelefono: Yup.string().required(),
    UnoDireccion: Yup.string().required(),
    UnoEmail: Yup.string().required(),
    DosNombre: Yup.string().required(),
    DosTelefono: Yup.string().required(),
    DosDireccion: Yup.string().required(),
    DosEmail: Yup.string().required(),

});
export default function EditarContacto(props: any) {
    let [cargando, setCargando] = useState(true);
    let [mostrarMensaje, setMostrarMensaje] = useState(false);
    let [icono, setIcono] = useState("info");
    let [fuenteIcono, setFuenteIcono] = useState("material");
    let [tituloMensaje, setTituloMensaje] = useState("Mensaje");
    let [mensaje, setMensaje] = useState("");
    let [ids,setIds] = useState(null);
    //NOTE: Obtenemos los datos de contacto del ciudadno
    useEffect(()=>{
        obtnerDatosContaco();
    },[])
    let formik = useFormik({
        initialValues: {
            UnoId:'',
            UnoNombre: '',
            UnoTelefono: '',
            UnoDireccion: '',
            UnoEmail: '',
            DosId:'',
            DosNombre: '',
            DosTelefono: '',
            DosDireccion: '',
            DosEmail: ''
        },
        onSubmit: ( values ) => {
            setCargando(true); 
            actualizarDatosContacto( values ) 
        },
        validationSchema: validacion
    });
    const lanzarMensaje = (titulo, mensaje, icono, fuenteIcono) => {
        setTituloMensaje(mensaje);
        setMensaje(titulo);
        setIcono(icono);
        setFuenteIcono(fuenteIcono);
        setMostrarMensaje(true);
    }
    const obtnerDatosContaco = async() => {
        await ObtenerDatosContacto()
        .then((contactos)=>{
            let indice = ['Uno','Dos'];
            let ids = [];
            contactos.map(( item,index )=>{
                console.log(item.id);
                ids.push(indice[index]+"Id:"+item.id);
                formik.setFieldValue(indice[index]+'Id',item.Id);
                formik.setFieldValue(indice[index]+'Nombre',item.Nombre);
                formik.setFieldValue(indice[index]+'Telefono',item.Telefono);
                formik.setFieldValue(indice[index]+'Direccion',item.Direccion);
                formik.setFieldValue(indice[index]+'Email',item.CorreoElectronico);
            });
            setIds(ids);
        }).catch((error)=>{
            let mensaje = String(error.message);
            lanzarMensaje(mensaje,'Mensaje',mensaje.includes("¡Error al obtener los contatos!") ? ERROR[0] : DESCONOCIDO[0], mensaje.includes("¡Error al obtener los contatos!") ? ERROR[1] : DESCONOCIDO[1]);
        }).finally(()=>{
            setCargando(false);
        })
    }
    const actualizarDatosContacto = async( contactos ) =>{
        await ActualizarDatosContactos(contactos,ids)
        .then(( datos )=>{
            lanzarMensaje("Datos Actualizados","Mensaje",OK[0],OK[1]);
        })
        .catch((error)=>{
            let mensaje = String(error.message);
            lanzarMensaje(mensaje,"Mensaje", mensaje.includes("¡Error al actualizar contactos!") ? ERROR[0] : DESCONOCIDO[0] ,mensaje.includes("¡Error al actualizar contactos!") ? ERROR[1] : DESCONOCIDO[1]);
        })
        .finally(()=>{
            setCargando(false);
        })
    }
    return (
        <SafeAreaView style={{ flex: 1 }} >
            <StatusBar animated={true} barStyle = {"dark-content"}/>
            <ImageBackground source={require('../../assets/Fondo.jpeg')} style={{ flex: 1 }} >
                <ScrollView style={{ flexGrow: 1 }} >
                    <View style={{ justifyContent: "center", alignItems: "center" }}  >
                        <Avatar
                            avatarStyle={{}}
                            rounded
                            imageProps={{ resizeMode: "contain" }}
                            size="xlarge"
                            containerStyle={{ height: 120, width: 220 }}
                            source={require("../../assets/banner.png")}
                        />
                    </View>
                    <View style={{ flexDirection: "row", marginBottom: 10 }} >
                        <Text style={{ textAlign: "center", flex: 2, fontWeight: "bold" }} > Contactos de Emergencia </Text>
                    </View>
                    <Formik
                        initialValues={valores}
                        onSubmit={valores => { console.log(valores) }}
                        validationSchema={validacion}
                    >
                        {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => {
                            //NOTE: Verificacion del primer bloque
                            let errorBloqueUno = ((formik.errors.UnoNombre && formik.touched.UnoNombre) || (formik.errors.UnoTelefono && formik.touched.UnoTelefono) || (formik.errors.UnoDireccion && formik.touched.UnoDireccion) || (formik.errors.UnoEmail && formik.touched.UnoEmail));
                            let errorBloqueDos = ((formik.errors.DosNombre && formik.touched.DosNombre) || (formik.errors.DosTelefono && formik.touched.DosTelefono) || (formik.errors.DosDireccion && formik.touched.DosDireccion) || (formik.errors.DosEmail && formik.touched.DosEmail));
                            return (
                                <View>
                                    <Text style={{ color: "black", marginLeft: 20 }} > Primer Contacto {(errorBloqueUno ? <Text style={{ color: "red", fontWeight: "bold" }} > Campos no validos </Text> : <></>)}  </Text>
                                    <View style={{ borderWidth: 1, borderRadius: 5, borderColor: "black", marginLeft: 20, marginRight: 20, borderStyle: "dashed" }} >
                                        <Text style={Styles.TemaLabalCampo} >Nombre</Text>
                                        <TextInput
                                            
                                            style={(formik.errors.UnoNombre && formik.touched.UnoNombre) ? Styles.TemaCampoError : Styles.TemaCampo}
                                            placeholder="Ejemplo: Juan Perez"
                                            onChangeText={formik.handleChange('UnoNombre')}
                                            value={formik.values.UnoNombre} />

                                        <Text style={Styles.TemaLabalCampo} >Telefono</Text>
                                        <TextInput
                                            style={(formik.errors.UnoTelefono && formik.touched.UnoTelefono) ? Styles.TemaCampoError : Styles.TemaCampo}
                                            placeholder="Ejemplo: Avenida Violetas"
                                            onChangeText={formik.handleChange('UnoTelefono')}
                                            value={formik.values.UnoTelefono} />

                                        <Text style={Styles.TemaLabalCampo} >Dirección</Text>
                                        <TextInput
                                            style={(formik.errors.UnoDireccion && formik.touched.UnoDireccion) ? Styles.TemaCampoError : Styles.TemaCampo}
                                            placeholder="Ejemplo: 20"
                                            onChangeText={formik.handleChange('UnoDireccion')}
                                            value={formik.values.UnoDireccion} />

                                        <Text style={Styles.TemaLabalCampo} >Correo Electronico</Text>
                                        <TextInput
                                            style={(formik.errors.UnoEmail && formik.touched.UnoEmail) ? Styles.TemaCampoError : Styles.TemaCampo}
                                            placeholder="Ejemplo: Colinas del Lago"
                                            onChangeText={formik.handleChange('UnoEmail')}
                                            value={formik.values.UnoEmail} />
                                    </View>
                                    <Text style={{ color: "black", marginLeft: 20, marginTop: 20 }} > Segundo Contacto {errorBloqueDos ? <Text style={{ color: "red", fontWeight: "bold" }}> Campos no validos </Text> : <></>} </Text>
                                    <View style={{ borderWidth: 1, borderRadius: 5, borderColor: "black", marginLeft: 20, marginRight: 20, borderStyle: "dashed" }} >
                                        <Text style={Styles.TemaLabalCampo} >Nombre</Text>
                                        <TextInput
                                            style={(formik.errors.DosNombre && formik.touched.DosNombre) ? Styles.TemaCampoError : Styles.TemaCampo}
                                            placeholder="Ejemplo: Juan Perez"
                                            onChangeText={formik.handleChange('DosNombre')}
                                            value={formik.values.DosNombre} />

                                        <Text style={Styles.TemaLabalCampo} >Telefono</Text>
                                        <TextInput
                                            style={(formik.errors.DosTelefono && formik.touched.DosTelefono) ? Styles.TemaCampoError : Styles.TemaCampo}
                                            placeholder="Ejemplo: Avenida Violetas"
                                            onChangeText={formik.handleChange('DosTelefono')}
                                            value={formik.values.DosTelefono} />

                                        <Text style={Styles.TemaLabalCampo} >Dirección</Text>
                                        <TextInput
                                            style={(formik.errors.DosDireccion && formik.touched.DosDireccion) ? Styles.TemaCampoError : Styles.TemaCampo}
                                            placeholder="Ejemplo: 20"
                                            onChangeText={formik.handleChange('DosDireccion')}
                                            value={formik.values.DosDireccion} />

                                        <Text style={Styles.TemaLabalCampo} > Correo Electronico </Text>
                                        <TextInput
                                            style={(formik.errors.DosEmail && formik.touched.DosEmail) ? Styles.TemaCampoError : Styles.TemaCampo}
                                            placeholder="Ejemplo: Colinas del Lago"
                                            onChangeText={formik.handleChange('DosEmail')}
                                            value={formik.values.DosEmail} />
                                    </View>
                                    <TouchableOpacity style={[Styles.btnGeneral, { marginTop: 20, marginBottom: 20 }]} onPress={formik.handleSubmit}  >
                                        <Text style={[Styles.btnTexto, { textAlign: "center" }]} > Guardar </Text>
                                    </TouchableOpacity>
                                </View>)
                        }}
                    </Formik>
                </ScrollView>
                <Loading
                    transparent={true}
                    loading={cargando}
                    loadinColor={azulColor}
                    onCancelLoad={() => { }}
                    tittle={" Mensaje "}
                    message={" Cargando "}
                />
                <Message
                    transparent={true}
                    loading={mostrarMensaje}
                    loadinColor={azulColor}
                    onCancelLoad={() => { }}
                    icon={icono}
                    iconsource={fuenteIcono}
                    color={azulColor}
                    message={mensaje}
                    tittle={tituloMensaje}
                    buttonText={"Aceptar"}
                    buttonCancel={true}
                    onConfirmarLoad={() => { setMostrarMensaje( false ) }}
                />
            </ImageBackground>
        </SafeAreaView>
    )
}