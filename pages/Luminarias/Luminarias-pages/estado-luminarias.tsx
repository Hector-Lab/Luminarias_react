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
import {} from '../../controller/api-controller';
import { StorageService } from '../../controller/storage-controller';

export default function LuminariasEstados(props: any) {
  const storage = new StorageService();
  const [ listaLuminarias, setListaLuminarias ] = useState([]);
  const [ seleccionLuminaria, setSeleccionLuminaria ] = useState(String);
  const [ mostrarPickerLuminaria, setMostrarPickerLuminaria ] = useState( false )
  
  useEffect(()=>{
    //NOTE: obtenemos el catalogo de luminarias
    (async () => {
      
        let jsonData = await storage.leerCatalogoLuminarias() ;
        let luminarias = JSON.parse(String(jsonData));
        let arregloLuminarias = [];
        luminarias.map((item,index)=>{
          let datos = {label: item.ClaveLuminaria , value: item.Padron};
          arregloLuminarias.push(datos);
        })
        setListaLuminarias(arregloLuminarias);
    })();
  },[]);


  //NOTE: Metodos de prueba
  const eliminarDatos = async () => {
    console.log("Eliminanda dato");
    storage.borrarDatos("EstadoFisico");
    storage.borrarDatos("TipoLuminaria");
  }
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
                            onPress={eliminarDatos}
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
                          language = {"ES"} />

                        <TextInput
                          autoCorrect = { false }
                          placeholder = {"Pruebas"}
                          style = {{borderColor:cardColor, borderWidth:1,backgroundColor:cardColor+"40", padding:3, marginTop:10}} />
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