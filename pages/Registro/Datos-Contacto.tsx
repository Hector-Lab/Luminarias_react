import React, { useState, useEffect, useRef } from "react";
import { SafeAreaView, ScrollView, Text, ImageBackground, View, TextInput, TouchableOpacity } from 'react-native';
import { Avatar, Divider } from 'react-native-elements';
import Styles from '../../Styles/styles';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { CommonActions } from '@react-navigation/native';
import { StorageBaches } from '../controller/storage-controllerBaches';
import { FinalizarRegistro } from '../controller/api-controller';
import Loading from '../components/modal-loading';
import { azulColor } from "../../Styles/Color";
import Message from '../components/modal-message';
import { DESCONOCIDO } from '../../Styles/Iconos';

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
    let [ mostrarMensaje, setMostrarMensaje ] = useState( true );
    let [ icono, setIcono ] = useState("info");
    let [ fuenteIcono, setFuenteIcono ] = useState("material");
    let [ tituloMensaje, setTituloMensaje ] = useState("Mensaje");
    let [ mensaje, setMensaje ] =  useState("");
    let [ abrirMenu, setAbrirMenu ] = useState( false );
    const finalizarRegistro = async (Contactos) => {
        //NOTE: Verificamos los datos del storage y lo enviamos al api
        setCargando( true );
        await FinalizarRegistro(Contactos)
            .then(( respuesta ) => {
                setCargando( false );
                if (String(respuesta).includes("-1")){
                    lanzarMensaje("¡La CURP ingresada esta registrada!|\nActualizar Información","Mensaje","info","material");
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
    const actualizarDatosCiudadano = () =>{
        console.log("Actualizando datos");
    }
    return (
        <SafeAreaView style={{ flex: 1 }} >
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
                                            style={(errors.UnoNombre && touched.UnoNombre) ? Styles.TemaCampoError : Styles.TemaCampo}
                                            placeholder="Ejemplo: Juan Perez"
                                            onChangeText={handleChange('UnoNombre')}
                                            value={values.UnoNombre} />

                                        <Text style={Styles.TemaLabalCampo} >Telefono</Text>
                                        <TextInput
                                            style={(errors.UnoTelefono && touched.UnoTelefono) ? Styles.TemaCampoError : Styles.TemaCampo}
                                            placeholder="Ejemplo: Avenida Violetas"
                                            onChangeText={handleChange('UnoTelefono')}
                                            value={values.UnoTelefono} />

                                        <Text style={Styles.TemaLabalCampo} >Dirección</Text>
                                        <TextInput
                                            style={(errors.UnoDireccion && touched.UnoDireccion) ? Styles.TemaCampoError : Styles.TemaCampo}
                                            placeholder="Ejemplo: 20"
                                            onChangeText={handleChange('UnoDireccion')}
                                            value={values.UnoDireccion} />

                                        <Text style={Styles.TemaLabalCampo} >Correo Electronico</Text>
                                        <TextInput
                                            style={(errors.UnoEmail && touched.UnoEmail) ? Styles.TemaCampoError : Styles.TemaCampo}
                                            placeholder="Ejemplo: Colinas del Lago"
                                            onChangeText={handleChange('UnoEmail')}
                                            value={values.UnoEmail} />
                                    </View>
                                    <Text style={{ color: "black", marginLeft: 20, marginTop: 20 }} > Segundo Contacto {errorBloqueDos ? <Text style={{ color: "red", fontWeight: "bold" }}> Campos no validos </Text> : <></>} </Text>
                                    <View style={{ borderWidth: 1, borderRadius: 5, borderColor: "black", marginLeft: 20, marginRight: 20, borderStyle: "dashed" }} >
                                        <Text style={Styles.TemaLabalCampo} >Nombre</Text>
                                        <TextInput
                                            style={(errors.DosNombre && touched.DosNombre) ? Styles.TemaCampoError : Styles.TemaCampo}
                                            placeholder="Ejemplo: Juan Perez"
                                            onChangeText={handleChange('DosNombre')}
                                            value={values.DosNombre} />

                                        <Text style={Styles.TemaLabalCampo} >Telefono</Text>
                                        <TextInput
                                            style={(errors.DosTelefono && touched.DosTelefono) ? Styles.TemaCampoError : Styles.TemaCampo}
                                            placeholder="Ejemplo: Avenida Violetas"
                                            onChangeText={handleChange('DosTelefono')}
                                            value={values.DosTelefono} />

                                        <Text style={Styles.TemaLabalCampo} >Direccion</Text>
                                        <TextInput
                                            style={(errors.DosDireccion && touched.DosDireccion) ? Styles.TemaCampoError : Styles.TemaCampo}
                                            placeholder="Ejemplo: 20"
                                            onChangeText={handleChange('DosDireccion')}
                                            value={values.DosDireccion} />

                                        <Text style={Styles.TemaLabalCampo} > Correo Electronico </Text>
                                        <TextInput
                                            style={(errors.DosEmail && touched.DosEmail) ? Styles.TemaCampoError : Styles.TemaCampo}
                                            placeholder="Ejemplo: Colinas del Lago"
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
                    transparent={true}
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
                    buttonCancel = { true }
                    onConfirmarLoad = { actualizarDatosCiudadano }
                />
            </ImageBackground>
        </SafeAreaView>
    )
}