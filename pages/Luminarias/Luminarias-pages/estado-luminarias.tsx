import React, { useState, useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Image,
  TextInput,
  Dimensions,
  Vibration,
  Alert,
} from "react-native";
import { Text, Icon } from "react-native-elements";
import { TouchableOpacity } from "react-native-gesture-handler";
import Styles from '../../../Styles/BachesStyles';
import { cardColor, DarkPrimaryColor } from "../../../Styles/BachesColor";
import DropDownPicker from 'react-native-dropdown-picker';
import {  } from '../../controller/api-controller';
import { StorageService } from '../../controller/storage-controller';

export default function LuminariasEstados(props: any) {
  const storage = new StorageService();
  //NOTE: Controladores de la seleccion de luminaria
  const [ listaLuminarias, setListaLuminarias ] = useState([]);
  const [ seleccionLuminaria, setSeleccionLuminaria ] = useState(String);
  const [ mostrarPickerLuminaria, setMostrarPickerLuminaria ] = useState( false );
  //NOTE: controladore de tipo de luminaria
  const [ listaTipoLuminaria, setListaTipoLuminaria  ] = useState([]);
  const [ seleccionTipoLuminaria, setSeleccionTipoLuminaria ] = useState(String);
  const [ mostrarPickerTipoLuminaria, setMostrarPickerTipoLuminaria ] = useState(false);
  //NOTE: 
  
  useEffect(()=>{
    //NOTE: obtenemos el catalogo de luminarias
    (async () => {
        let jsonData = await storage.leerCatalogoLuminarias();
        let luminarias = JSON.parse(String(jsonData));
        let arregloLuminarias = [];
        luminarias.map((item,index)=>{
          let datos = {label: item.ClaveLuminaria , value: item.Padron};
          arregloLuminarias.push(datos);
        });
        setListaLuminarias(arregloLuminarias);
        jsonData = await storage.leerLuminarias();
        let tipoLuminaria = JSON.parse(String(jsonData));
        let arregloTipoLuminarias = [];
        tipoLuminaria.map(( item ,index )=>{
          let datos = {label: item.Descripcion , value: item.clave};
          arregloTipoLuminarias.push(datos);
        });
        setListaTipoLuminaria(arregloTipoLuminarias);
    })();
  },[]);
  useEffect(()=>{
    //NOTE: buscamos los datos de la base de dato
    ( async () =>{
      buscarDatos();
    })();
  },[seleccionLuminaria])
  const buscarDatos = async () => {
    let luminaria = await storage.buscarLuminariaPadron(seleccionLuminaria);
    console.log(luminaria);
  }
  
  useEffect(()=>{
    if( mostrarPickerLuminaria ){
      setMostrarPickerTipoLuminaria( false );
    }
    if(mostrarPickerTipoLuminaria){
      setMostrarPickerLuminaria( false );
    }

  },[mostrarPickerLuminaria,mostrarPickerTipoLuminaria]);

  
  return (
    <View style={[Styles.TabContainer,{justifyContent:"center"}]}>
                      <View style = {Styles.cardContainer} >
                    <View style = {[Styles.bachesCard,{marginTop:5}]} >
                      <View style={Styles.cardHeader}>
                        <View style={Styles.cardHeaderText}>
                          <View style={Styles.cardRpundedIcon}></View>
                          <Text
                            style={{
                              textAlign: "center",
                              marginLeft: 15,
                              fontSize: 15,
                              fontWeight: "bold",
                            }}
                          >
                            Direccion Actual
                          </Text>
                        </View>
                      </View>
                      <View style={[Styles.cardTextView]}>
                        <Text
                        style={[
                          Styles.textMultiline
                        ]}>
                          {"Prueba de direccion"}
                        </Text>
                      </View>
                      <View style={Styles.cardFoteer}>
                        <View style={Styles.cardLocateBtn}>
                          <TouchableOpacity
                            style={{}}
                            onPress={()=>{console.log("Prueba de footer")}}
                          >
                            <Icon
                              color={DarkPrimaryColor}
                              size={25}
                              tvParallaxProperties
                              name="street-view"
                              type="font-awesome-5"
                              style={{ marginLeft: 45 }}
                            />
                          </TouchableOpacity>
                        </View>
                        <View
                          style={{
                            flex: 1,
                            flexDirection: "row",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <TouchableOpacity
                            style={{}}
                            onPress={ ()=>{} }
                          >
                            <Icon
                              size={20}
                              color={DarkPrimaryColor}
                              tvParallaxProperties
                              name="trash-alt"
                              type="font-awesome-5"
                              style={{ marginRight: 45 }}
                            />
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                    <View style = {{flex:6}} >
                      <View style = {{margin:10}} >
                        <DropDownPicker
                          open = { mostrarPickerLuminaria }
                          setOpen = { setMostrarPickerLuminaria }
                          items = { listaLuminarias }
                          setItems = {setListaLuminarias}
                          value = { seleccionLuminaria }
                          setValue = { setSeleccionLuminaria }
                          searchable = { true }
                          language = {"ES"}
                          zIndex  = {2000}
                          zIndexInverse = {1000}
                          placeholder = { "Seleccione clave de luminaria" }
                          />
                        <DropDownPicker
                          style = {{ marginTop:20 }}
                          open = { mostrarPickerTipoLuminaria }
                          setOpen = { setMostrarPickerTipoLuminaria }
                          items = { listaTipoLuminaria }
                          setItems = { setListaTipoLuminaria }
                          value = { seleccionTipoLuminaria }
                          setValue = { setSeleccionTipoLuminaria }
                          searchable = { true }
                          zIndex = { 1000 }
                          zIndexInverse = {2000}
                          language = { "ES" }
                          placeholder = { " Seleccione el tipo de luminaria" }
                          />
                        <TextInput
                          autoCorrect = { false }
                          placeholder = {"Pruebas"}
                          style = {{borderColor:cardColor, borderWidth:1,backgroundColor:cardColor+"40", padding:3, marginTop:20}} />
                        <TextInput
                          autoCorrect = { false }
                          placeholder = {"Pruebas"}
                          style = {{borderColor:cardColor, borderWidth:1,backgroundColor:cardColor+"40", padding:3,  marginTop:20}} />
                        <TextInput
                          autoCorrect = { false }
                          placeholder = {"Pruebas"}
                          style = {{borderColor:cardColor, borderWidth:1,backgroundColor:cardColor+"40", padding:3,  marginTop:20}} />
                      </View>
                    </View>
                </View>
    </View>
  );
}