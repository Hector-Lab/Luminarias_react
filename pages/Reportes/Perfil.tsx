import * as React from 'react';
import { View,Text, ScrollView, SafeAreaView,TextInput,TouchableOpacity } from 'react-native';
import { azulColor } from '../../Styles/Color';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Styles from '../../Styles/styles';

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
        onSubmit: ( values )=>{ console.log( values ); },
        validationSchema:validacion
    });
    return(
        <SafeAreaView style = {{ flexGrow:1 }} >
            <View style = {{ flex:1 , padding:10,marginTop:20, borderWidth:1 }} >
                <Text style = {{fontWeight:"bold", color:azulColor }} > Datos personales </Text>
                <View style = {{ borderRadius:5, borderWidth:1, borderStyle:"dotted", paddingLeft:10,paddingRight:10 }} >
                    <Text> Nombre </Text>
                    <TextInput 
                        style = { [Styles.inputText,{padding:7}] } 
                        placeholder = { "Nombre" }
                        value = { formik.values.Nombre }
                        onChangeText = { formik.handleChange("Nombre") }
                        />
                    <Text> Apellido Paterno </Text>
                    <TextInput 
                        style = { [Styles.inputText,{padding:7}] } 
                        placeholder = { "Apellido Paterno" }
                        value = { formik.values.Paterno }
                        onChangeText = { formik.handleChange("Paterno") }
                        />
                    <Text> Apellido Materno </Text>
                    <TextInput 
                        style = { [Styles.inputText,{padding:7}] } 
                        placeholder = { "Apellido Materno" }
                        value = { formik.values.Materno }
                        onChangeText = { formik.handleChange("Materno") }
                        />
                    <Text> CURP </Text>
                    <TextInput 
                        style = { [Styles.inputText,{padding:7}] } 
                        placeholder = { "CURP" }
                        value = { formik.values.Curp }
                        onChangeText = { formik.handleChange("Curp") }
                        />
                    <Text> Telefono </Text>
                    <TextInput 
                        style = { [Styles.inputText,{padding:7}] } 
                        placeholder = { "Telefono" }
                        value = { formik.values.Telefono }
                        onChangeText = { formik.handleChange("Telefono")}
                    />
                    <Text> Correo Electronico </Text>
                    <TextInput 
                        style = { [Styles.inputText,{padding:7, marginBottom:17 }] } 
                        placeholder = { "CURP" }
                        value = { formik.values.Curp }
                        onChangeText = { formik.handleChange("Curp") }
                        />
                </View>
                <Text style = {{ fontWeight:"bold",color:azulColor,marginTop:20 }}> Dirección </Text>
                <View style = {{ borderRadius:5, borderWidth:1, borderStyle:"dashed", paddingLeft:10, paddingRight:10 }} >
                    <Text> Localidad </Text>
                    <TextInput 
                        style = {[ Styles.inputText,{padding:7}]} 
                        placeholder = { "Localidad" }
                        value = { formik.values.Localidad }
                        onChangeText = { formik.handleChange("Localidad") }
                         />
                    <Text> Calle </Text>
                    <TextInput 
                        style = {[ Styles.inputText,{padding:7}]} 
                        placeholder = { "Calle" }
                        value = { formik.values.Calle }
                        onChangeText = { formik.handleChange("Calle") }
                        />
                    <Text> Numero </Text>
                    <TextInput 
                        style = {[ Styles.inputText,{padding:7}]} 
                        placeholder = { "Numero" }
                        value = { formik.values.Numero }
                        onChangeText = { formik.handleChange("Numero") }
                        />
                    <Text> Colonia </Text>
                    <TextInput 
                        style = {[ Styles.inputText,{padding:7}]} 
                        placeholder = { "Colonia" } 
                        value = { formik.values.Colonia }
                        onChangeText = { formik.handleChange("Colonia") }
                        />
                    <Text> Codigo Postal </Text>
                    <TextInput 
                        style = {[ Styles.inputText,{ padding:7, marginBottom:17 }]} 
                        placeholder = { "Codigo Postal" } 
                        value = { formik.values.Postal }
                        onChangeText = { formik.handleChange("Postal") }
                        />
                </View>
            </View>
            <TouchableOpacity style = {[Styles.btnOpacity,{marginRight:20,marginLeft:20,marginBottom:20}]} >
                    <Text style ={ Styles.btnTexto } > Guardar </Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}