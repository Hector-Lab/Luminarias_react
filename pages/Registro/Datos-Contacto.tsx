import React, { useState, useEffect, useRef } from "react";
import { SafeAreaView, ScrollView, Text, ImageBackground, View, TextInput, TouchableOpacity, StatusBar } from 'react-native';
import { Avatar, Divider } from 'react-native-elements';
import Styles from '../../Styles/styles';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { CommonActions } from '@react-navigation/native';
import { StorageBaches } from '../controller/storage-controllerBaches';
import { FinalizarRegistro, ActualiarRegistroCiudadano } from '../controller/api-controller';
import Loading from '../components/modal-loading';
import { azulColor } from "../../Styles/Color";
import Message from '../components/modal-message';
import { DESCONOCIDO,ERROR } from '../../Styles/Iconos';

let Storage = new StorageBaches();
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
export default function Perfil(props: any) {
    let [ cargando, setCargando ] = useState( false );
    let [ mostrarMensaje, setMostrarMensaje ] = useState( false );
    let [ icono, setIcono ] = useState("info");
    let [ fuenteIcono, setFuenteIcono ] = useState("material");
    let [ tituloMensaje, setTituloMensaje ] = useState("Mensaje");
    let [ mensaje, setMensaje ] =  useState("");
    let [ abrirMenu, setAbrirMenu ] = useState( false );
    let [ contactos, setContactos ] = useState(null);
    let [ botonCanelar, setBotonCancelar ] = useState( false );
    let [actualizarCiudadano, setActualizarCiudadano] = useState(false);
    const finalizarRegistro = async (datosContactos) => {
        //NOTE: Verificamos los datos del storage y lo enviamos al api
        setCargando( true );
        await FinalizarRegistro(datosContactos)
            .then(( respuesta ) => {
                setCargando( false );
                if (String(respuesta).includes("-1")){
                    setBotonCancelar(true);
                    setActualizarCiudadano(true);
                    lanzarMensaje("¡La CURP ingresada esta registrada!|\nActualizar Información","Mensaje","info","material");
                    setContactos(datosContactos);
                }else{
                    lanzarMensaje(respuesta,"Mensaje","info","material");
                    setAbrirMenu(true);
                }
            })
            .catch(( error ) => {
                setCargando( false );
                lanzarMensaje(String(error.message),"Mensaje",DESCONOCIDO[0],DESCONOCIDO[1]);
            })
    }
    const lanzarMensaje = ( titulo,mensaje,icono,fuenteIcono ) =>{
        setTituloMensaje( mensaje );
        setMensaje(titulo);
        setIcono( icono );
        setFuenteIcono(fuenteIcono);
        setMostrarMensaje(true);
    }
    const ManejadorBotonMensaje = ()=>{
        if(abrirMenu){
            //NOTE: guardamos los datos 
            props.navigation.dispatch(
                CommonActions.reset({
                  index: 1,
                  routes: [{ name:'Menu'}]
                })
              );
        }else{
            setMostrarMensaje(false);
        }  
    }
    const irMenu = () =>{
        //NOTE: guardamos los datos 
        props.navigation.dispatch(
            CommonActions.reset({
              index: 1,
              routes: [{ name:'Menu'}]
            })
          );
    }
    const actualizarDatosCiudadano = async () =>{
        setMostrarMensaje(false);
        setCargando(true);
        if(contactos != null){
            await ActualiarRegistroCiudadano(contactos)
            .then(( result )=>{
                setActualizarCiudadano(false);
                setBotonCancelar(false);
                setCargando(false);
                irMenu();
            })
            .catch((error)=>{
                let mensaje = String(error.message);
                lanzarMensaje(mensaje,'Mensaje',mensaje.includes("¡Error al actualizar ciudadano!") ? Error[0] : DESCONOCIDO[0], mensaje.includes("¡Error al actualizar ciudadano!") ? Error[1] : DESCONOCIDO[1] );
                setCargando(false);
            })
        }else{
            console.log("No hay contactos");
        }
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
                        <Text style={{ textAlign: "left", flex: 1, marginLeft: 16, fontWeight: "bold" }} > Paso 3 de 3 </Text>
                        <Text style={{ textAlign: "left", flex: 2, fontWeight: "bold" }} > Contactos de Emergencia </Text>
                    </View>
                    <Formik
                        initialValues={valores}
                        onSubmit={valores => { finalizarRegistro( valores ); }}
                        validationSchema={validacion}
                    >
                        {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => {
                            //NOTE: Verificacion del primer bloque
                            let errorBloqueUno = ((errors.UnoNombre && touched.UnoNombre) || (errors.UnoTelefono && touched.UnoTelefono) || (errors.UnoDireccion && touched.UnoDireccion) || (errors.UnoEmail && touched.UnoEmail));
                            let errorBloqueDos = ((errors.DosNombre && touched.DosNombre) || (errors.DosTelefono && touched.DosTelefono) || (errors.DosDireccion && touched.DosDireccion) || (errors.DosEmail && touched.DosEmail));
                            return (
                                <View>
                                    <Text style={{ color: "black", marginLeft: 20 }} > Primer Contacto {(errorBloqueUno ? <Text style={{ color: "red", fontWeight: "bold" }} > Campos no validos </Text> : <></>)}  </Text>
                                    <View style={{ borderWidth: 1, borderRadius: 5, borderColor: "black", marginLeft: 20, marginRight: 20, borderStyle: "dashed" }} >
                                        <Text style={Styles.TemaLabalCampo} >Nombre</Text>
                                        <TextInput
                                            keyboardType="default"
                                            textContentType="name"
                                            style={(errors.UnoNombre && touched.UnoNombre) ? Styles.TemaCampoError : Styles.TemaCampo}
                                            placeholder="Ejemplo: Juan Perez Perez"
                                            onChangeText={handleChange('UnoNombre')}
                                            value={values.UnoNombre} />

                                        <Text style={Styles.TemaLabalCampo} >Telefono</Text>
                                        <TextInput
                                            keyboardType="phone-pad"
                                            textContentType="telephoneNumber"
                                            style={(errors.UnoTelefono && touched.UnoTelefono) ? Styles.TemaCampoError : Styles.TemaCampo}
                                            placeholder="Ejemplo: Avenida Violetas"
                                            onChangeText={handleChange('UnoTelefono')}
                                            value={values.UnoTelefono} />

                                        <Text style={Styles.TemaLabalCampo} >Dirección</Text>
                                        <TextInput
                                            keyboardType="default"
                                            textContentType="fullStreetAddress"
                                            style={(errors.UnoDireccion && touched.UnoDireccion) ? Styles.TemaCampoError : Styles.TemaCampo}
                                            placeholder="Ejemplo: 20"
                                            onChangeText={handleChange('UnoDireccion')}
                                            value={values.UnoDireccion} />

                                        <Text style={Styles.TemaLabalCampo} >Correo Electronico</Text>
                                        <TextInput
                                            keyboardType="email-address"
                                            textContentType="emailAddress"
                                            style={(errors.UnoEmail && touched.UnoEmail) ? Styles.TemaCampoError : Styles.TemaCampo}
                                            placeholder="Ejemplo: ccuatrotest@gmail.com"
                                            onChangeText={handleChange('UnoEmail')}
                                            value={values.UnoEmail} />
                                    </View>
                                    <Text style={{ color: "black", marginLeft: 20, marginTop: 20 }} > Segundo Contacto {errorBloqueDos ? <Text style={{ color: "red", fontWeight: "bold" }}> Campos no validos </Text> : <></>} </Text>
                                    <View style={{ borderWidth: 1, borderRadius: 5, borderColor: "black", marginLeft: 20, marginRight: 20, borderStyle: "dashed" }} >
                                        <Text style={Styles.TemaLabalCampo} >Nombre</Text>
                                        <TextInput
                                            keyboardType="default"
                                            textContentType="name"
                                            style={(errors.DosNombre && touched.DosNombre) ? Styles.TemaCampoError : Styles.TemaCampo}
                                            placeholder="Ejemplo: Juan Perez Perez"
                                            onChangeText={handleChange('DosNombre')}
                                            value={values.DosNombre} />

                                        <Text style={Styles.TemaLabalCampo} >Telefono</Text>
                                        <TextInput
                                            keyboardType="phone-pad"
                                            textContentType="telephoneNumber"
                                            style={(errors.DosTelefono && touched.DosTelefono) ? Styles.TemaCampoError : Styles.TemaCampo}
                                            placeholder="Ejemplo: 55 12 34 56 78"
                                            onChangeText={handleChange('DosTelefono')}
                                            value={values.DosTelefono} />

                                        <Text style={Styles.TemaLabalCampo} >Direccion</Text>
                                        <TextInput
                                            keyboardType="default"
                                            textContentType="fullStreetAddress"
                                            style={(errors.DosDireccion && touched.DosDireccion) ? Styles.TemaCampoError : Styles.TemaCampo}
                                            placeholder="Ejemplo: Olivos primero de marzo 20"
                                            onChangeText={handleChange('DosDireccion')}
                                            value={values.DosDireccion} />

                                        <Text style={Styles.TemaLabalCampo} > Correo Electronico </Text>
                                        <TextInput
                                            keyboardType="email-address"
                                            textContentType="emailAddress"
                                            style={(errors.DosEmail && touched.DosEmail) ? Styles.TemaCampoError : Styles.TemaCampo}
                                            placeholder="Ejemplo: ccuatrotest@gmail.com"
                                            onChangeText={handleChange('DosEmail')}
                                            value={values.DosEmail} />
                                    </View>
                                    <TouchableOpacity style={[Styles.btnGeneral, { marginTop: 20, marginBottom: 20 }]} onPress={handleSubmit}  >
                                        <Text style={[Styles.btnTexto, { textAlign: "center" }]} > Finalizar </Text>
                                    </TouchableOpacity>
                                </View>)
                        }}
                    </Formik>
                </ScrollView>
                <Loading
                    transparent={ true }
                    loading={ cargando }
                    loadinColor={ azulColor }
                    onCancelLoad={ ManejadorBotonMensaje }
                    tittle={" Mensaje "}
                    message={" Cargando "}
                />
                <Message 
                    transparent = { true }
                    loading = { mostrarMensaje }
                    loadinColor = { azulColor }
                    onCancelLoad = { ManejadorBotonMensaje }
                    icon = { icono }
                    iconsource = { fuenteIcono }
                    color = { azulColor }
                    message = { mensaje }
                    tittle = { tituloMensaje }
                    buttonText = {"Aceptar"}
                    buttonCancel = { botonCanelar }
                    onConfirmarLoad = { actualizarCiudadano ? actualizarDatosCiudadano : ()=>{ setMostrarMensaje( false ) } }
                />
            </ImageBackground>
        </SafeAreaView>
    )
}