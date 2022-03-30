import React, { useState, useEffect, useRef, Component } from "react";
import { ScrollView, TextInput, TouchableOpacity, View } from "react-native";
import { Card, Text } from "react-native-elements";
import MapView from "react-native-maps";
import * as Location from 'expo-location';
import { Marker } from 'react-native-maps';
import {ObtenerDireccionActual} from  "../../utilities/utilities";
import { Camera } from "expo-camera";



export default function ReporteC4(props: any) {
    const [Nombre, setNombre] = useState(String);
    const [Telefono, setTelefono] = useState(String);
    const [Texto, setTexto] = useState(String);
    const [Locacion, setLocacion] = useState(Object);
    const [ErrorMensaje, setErrorMensaje] = useState(String);
    const [InitialLocation, setInitiallocation] = useState(Object);
    const [mapaCargado, SetMapaCargado] = useState(Boolean);
    const [direccion, setDireccion] = useState(Object);

    useEffect(() => {
        (async () => {
          let { status } = await Location.requestForegroundPermissionsAsync();
          if (status !== 'granted') {
            setErrorMensaje('Permission to access location was denied');
            return;
          }
    
         let location= await Location.getCurrentPositionAsync();
              setLocacion(location);
              let DireccionActual = JSON.parse(
                await ObtenerDireccionActual(location.coords)
              );
                let formatoDireccion = {
                Estado: DireccionActual.region,
                Ciudad: DireccionActual.city,
                Colonia: DireccionActual.district,
                Calle: DireccionActual.street,
                CodigoPostal: DireccionActual.postalCode 
            };
                console.log(DireccionActual);
                setDireccion(formatoDireccion);
          
        })();
      }, []);

      useEffect(()=>{
        (async ()=>{
        

        SetMapaCargado(true);
        
        });
        
      },[Locacion]);

      


      
return(
    <ScrollView contentContainerStyle = { { flexGrow:1 } } >
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center", borderWidth: 1}}>
            <Text>DATOS REPORTE</Text>   
            </View>
            
            <View style={{ flex: 6, borderWidth: 1  }}>
            <View>
                <Text style= {{marginBottom: 5, marginTop: 10, marginLeft: 15, marginRight: 15, color:"black", fontWeight:"bold", justifyContent: "center", alignItems: "center"}}>Nombre</Text>
                    <TextInput
                                placeholder="Ingresa tu Nombre"
                                //maxLength={ 50 }
                                keyboardType="default"
                                value= {Nombre}
                                onChangeText={ text => { setNombre(text); }}
                                autoCapitalize = {"characters"}
                                style = {{borderColor: "black", borderWidth: 1, padding: 3, marginLeft: 15, marginRight: 15, marginBottom: 10, borderRadius: 5 }}
                    />   
            </View>
            <View>
                <Text style= {{marginBottom: 5, marginTop: 10, marginLeft: 15, marginRight: 15, color:"black", fontWeight:"bold", justifyContent: "center", alignItems: "center"}}>Teléfono</Text>
                    <TextInput
                                placeholder="Ingresa tu Teléfono"
                                //maxLength={ 50 }
                                keyboardType="number-pad"
                                value= {Telefono}
                                onChangeText={ text => { setTelefono(text); }}
                                autoCapitalize = {"characters"}
                                style = {{borderColor: "black", borderWidth: 1, padding: 3, marginLeft: 15, marginRight: 15, marginBottom: 10, borderRadius: 5 }}
                    />   
            </View>    
            <View>
                <Text style= {{marginBottom: 5, marginTop: 10, marginLeft: 15, marginRight: 15, color:"black", fontWeight:"bold", justifyContent: "center", alignItems: "center"}}>Problema</Text>
                    <TextInput
                    numberOfLines={5}
                                placeholder="Sea Breve en su Descripción"
                                //maxLength={ 50 }
                                keyboardType="default"
                                value= {Texto}
                                onChangeText={ text => { setTexto(text); }}
                                autoCapitalize = {"characters"}
                                style = {{borderColor: "black", borderWidth: 1, padding: 3, marginLeft: 15, marginRight: 15, marginBottom: 10, borderRadius: 5}}
                    />   
            </View>    
        
            <View style = {{paddingLeft:20, paddingRight:20 }} >
            <Text style= {{marginBottom: 10, marginTop: 10, marginLeft: -5, marginRight: 15, color:"black", fontWeight:"bold", justifyContent: "center", alignItems: "center"}}>Foto Evidencia (Opcional)</Text>
                    <TouchableOpacity style = {{backgroundColor: "#104971", borderRadius: 5, padding: 10, marginBottom: 10}} >
                        <Text style = {{color:"white", textAlign: "center"  }}> Seleccionar Imagenes </Text>
                    </TouchableOpacity>
                    
            </View>

            <View style = {{paddingLeft:20, paddingRight:20 }} >
            <Text style= {{marginBottom: 0, marginTop: 10, marginLeft: -5, marginRight: 15, color:"black", fontWeight:"bold", justifyContent: "center", alignItems: "center"}}>Ubicación</Text>
                    <Card  containerStyle = {{ backgroundColor: "lightgray", width: 370, height: 200, alignItems: "center", marginLeft: -5, marginRight: 10, marginBottom: 40, marginTop: 10}} >
                        {
                            Locacion.coords != undefined ? 
                            <MapView style = {{height: 200, width:370}}
                            initialRegion = { { 
                                latitude : Locacion.coords.latitude, 
                                longitude : Locacion.coords.longitude,  
                                latitudeDelta : Locacion.coords.latitudeDelta == null ? 0: Locacion.coords.latitudeDelta, 
                                longitudeDelta : Locacion.coords.longitudeDelta == null ? 0: Locacion.coords.longitudeDelta
                          }} 
                          region = {{
                            latitude : Locacion.coords.latitude, 
                            longitude : Locacion.coords.longitude,  
                            latitudeDelta :    0.0020,  
                            longitudeDelta : 0.0071
                          }}

                        >
                            <Marker     
                                        title = { "Estoy aquí: " }
                                        description = {` Calle: ` + direccion.Calle + ` Codigo Postal: `+ direccion.CodigoPostal}
                                        coordinate={{"latitude":Locacion.coords.latitude,"longitude":Locacion.coords.longitude}}
                            ></Marker>

                        </MapView>:<></>}
                    </Card>
                    
                </View>
            <View style = {{paddingLeft:20, paddingRight:20 }} >
                    <TouchableOpacity style = {{backgroundColor: "#104971", borderRadius: 5, padding: 10, marginBottom: 10}} >
                        <Text style = {{color:"white", textAlign: "center"  }}> Enviar </Text>
                    </TouchableOpacity>
                    
            </View>  
                
            </View>
            
                
            
            
            

    </ScrollView>
)

}