import React, { Component, useEffect, useState } from "react";
import { View, StyleSheet, Text, ImageBackground, TouchableOpacity, Touchable, Modal, StatusBar, Pressable, ActivityIndicator } from "react-native";
import { Icon, Card, registerCustomIconType } from 'react-native-elements';
import { ScrollView } from "react-native-gesture-handler";
import MapView, { Marker } from "react-native-maps";
import { BlueColor, cardColor } from "../../Styles/BachesColor";
import { azulColor, textoAtencion } from '../../Styles/Color';
import { CLOSE } from '../../Styles/Iconos';
import ImageView from "react-native-image-viewing";
import Styles from "../../Styles/styles";

export default class ReporteDetalle extends React.Component<{
    Reporte:
    {
        Area: string,
        Ciudadano: string,
        Nombre: string,
        Codigo: string,
        Estatus: string,
        FechaTupla: string,
        FechaAtendida: string,
        FechaSolucion: string,
        Descripci_on: string,
        Referencia: string,
        Ubicaci_onEscrita: string,
        Ubicaci_onGPS: string,
        Rutas: string
    },
    Visible: boolean, Plataform: string, onClose: Function, onMostrarEvidencia: Function, mostrarEvidencia: boolean
}> {
    //'rgba(158, 150, 150, .5)' 
    // NOTE: Estatus 1=> Pendiente, 2=> Proceso, 3=>Atendida, 4=> Rechazada
    render() {
        let estados = { 1: "Pendiente", 2: "Proceso", 3: "Atendida", 4: "Rechazada" };
        let colorEstado = { 1: "#6c757d", 2: "#17a2b8", 3: "#28a745", 4: "#dc3545" };
        let Rutas = [];
        let coordenasas = null;
        if (this.props.Reporte.Ubicaci_onGPS != undefined) {
            coordenasas = JSON.parse(this.props.Reporte.Ubicaci_onGPS);
        }
        //NOTE: convertimos en arreglo y los volvemos objeto
        if (this.props.Reporte.Rutas != null) {
            let RawRutas = this.props.Reporte.Rutas.split(",");
            RawRutas.map((item, index) => {
                let objetoImagen = {
                    uri: `https://suinpac.com/${item}`,
                };
                Rutas.push(objetoImagen);
            })
        }
        const ReporteVacio = () => {
            return <View style={{ borderWidth: 1, marginTop: this.props.Plataform == "ios" ? 20 : 0 }} >
                <Text> Vacio </Text>
            </View>;
        }
        return (
            <View>
                <Modal style={{ marginRight: 18, marginLeft: 18, flex: 1 }} transparent={false} visible={this.props.Visible}  >
                    {
                        this.props.Reporte == null ?
                            ReporteVacio() :
                            <ScrollView style={{ marginTop: this.props.Plataform == "ios" ? 20 : 0 }} >
                                <View style={{ flexDirection: "row", marginTop: 20, alignSelf: "flex-end" }}  >
                                    <TouchableOpacity style={{ marginRight: 15 }} onPress={() => { this.props.onClose() }} >
                                        <Icon tvParallaxProperties type={CLOSE[1]} name={CLOSE[0]} size={30} color={"#dc3545"} >  </Icon>
                                    </TouchableOpacity>
                                </View>
                                <Text style={{ textAlign: "center", fontWeight: "bold", marginTop: 20 }} > {String(this.props.Reporte.Area)} </Text>
                                <View style={{ flexDirection: "row", marginTop: 10 }}>
                                    <Text style={{ flex: 2 }} > Nombre: </Text>
                                    <Text style={{ flex: 3 }} > {this.props.Reporte.Nombre} </Text>
                                </View>
                                <View style={{ flexDirection: "row", marginTop: 10 }}>
                                    <Text style={{ flex: 2 }} > Estado: </Text>
                                    <Text style={{ flex: 3, color: colorEstado[this.props.Reporte.Estatus], fontWeight: "bold" }} > {estados[this.props.Reporte.Estatus]} </Text>
                                </View>
                                <View style={{ flexDirection: "row", marginTop: 10 }}>
                                    <Text style={{ flex: 2 }} > Codigo: </Text>
                                    <Text style={{ flex: 3 }} > {this.props.Reporte.Codigo} </Text>
                                </View>
                                <View style={{ flexDirection: "row", marginTop: 10 }}>
                                    <Text style={{ flex: 2 }} > Fecha Reporte: </Text>
                                    <Text style={{ flex: 3 }} > {this.props.Reporte.FechaTupla} </Text>
                                </View>
                                <View style={{ flexDirection: "row", marginTop: 10 }}>
                                    <Text style={{ flex: 2 }} > Fecha Atención: </Text>
                                    <Text style={{ flex: 3 }} > {this.props.Reporte.FechaAtendida == null ? "Sin Asignar" : this.props.Reporte.FechaTupla} </Text>
                                </View>
                                <View style={{ flexDirection: "row", marginTop: 10 }}>
                                    <Text style={{ flex: 2 }} > Fecha Atención: </Text>
                                    <Text style={{ flex: 3 }} > {this.props.Reporte.FechaSolucion == null ? "Sin Asignar" : this.props.Reporte.FechaSolucion} </Text>
                                </View>
                                <Text style={{ textAlign: "center", fontWeight: "bold", marginTop: 20 }} > Descripción y Referencias del Reporte </Text>
                                <View style={{ flexDirection: "column", marginTop: 10 }}>
                                    <Text style={{ flex: 1, textAlign: "center", marginBottom: 5 }} > Descripción: </Text>
                                    <ScrollView style={[estilosElemento.scrollText, { height: 100 }]} >
                                        <Text style={[estilosElemento.textArea, { height: 150 }]} > {this.props.Reporte.Descripci_on} </Text>
                                    </ScrollView>
                                </View>
                                <View style={{ flexDirection: "column", marginTop: 10 }}>
                                    <Text style={{ flex: 1, textAlign: "center", marginBottom: 5 }} > Referencia: </Text>
                                    <ScrollView style={[estilosElemento.scrollText, { height: 100 }]} >
                                        <Text style={[estilosElemento.textArea, { height: 150 }]} > {this.props.Reporte.Referencia} </Text>
                                    </ScrollView>
                                </View>
                                <View style={{ flexDirection: "column", marginTop: 10 }}>
                                    <Text style={{ flex: 1, textAlign: "center", marginBottom: 5 }} > Dirección: </Text>
                                    <ScrollView style={[estilosElemento.scrollText, { height: 100 }]} >
                                        <Text style={[estilosElemento.textArea, { height: 150 }]} > {String(this.props.Reporte.Ubicaci_onEscrita).replace("\t", "")} </Text>
                                    </ScrollView>
                                </View>
                                <View style={{ marginTop: 20, marginLeft: 10, marginRight: 10, borderWidth: 1 }} >
                                    {
                                        (this.props.Reporte.Ubicaci_onGPS != undefined || this.props.Reporte.Ubicaci_onGPS != null) ?
                                            <MapView style={{ height: 200 }}
                                                initialRegion={{
                                                    latitude: coordenasas.latitude,
                                                    longitude: coordenasas.longitude,
                                                    latitudeDelta: coordenasas.latitudeDelta == undefined ? 0 : coordenasas.latitudeDelta,
                                                    longitudeDelta: coordenasas.longitudeDelta == undefined ? 0 : coordenasas.longitudeDelta
                                                }}
                                                region={{
                                                    latitude: coordenasas.latitude,
                                                    longitude: coordenasas.longitude,
                                                    latitudeDelta: 0.0020,
                                                    longitudeDelta: 0.0071
                                                }}
                                            >
                                                <Marker
                                                    title={estados[this.props.Reporte.Estatus]}
                                                    description={`Reporto: ${this.props.Reporte.Nombre}`}
                                                    coordinate={{ "latitude": coordenasas.latitude, "longitude": coordenasas.longitude }}
                                                ></Marker>
                                            </MapView> : <ActivityIndicator size="large" color={BlueColor} style={{ flex: 1 }} />
                                    }
                                </View>
                                {
                                    (Rutas.length > 0) ?
                                        <TouchableOpacity style={{ alignItems: "center", backgroundColor: azulColor, margin: 10, borderRadius: 10, marginTop:20 }}
                                            onPress={() => { this.props.onClose(); this.props.onMostrarEvidencia(); }} >
                                            <Text style={{ color: "white", textAlign: "center", padding: 10 }}> Evidencia del Reporte </Text>
                                        </TouchableOpacity> : <></>
                                }
                            </ScrollView>
                    }
                </Modal>
                {/**INDEV: componentes para las imagenes  */}
                <ImageView
                    images={Rutas}
                    imageIndex={0}
                    visible={this.props.mostrarEvidencia}
                    onRequestClose={() => {
                        this.props.onClose();
                        this.props.onMostrarEvidencia();
                    }}
                    swipeToCloseEnabled={false}
                    FooterComponent={({ imageIndex }) => (
                        <View style={{ flex: 1, alignItems: "center", marginBottom: "5%" }} >
                            <View >
                                <Text style={{ color: "white", fontWeight: "bold", fontSize: 16 }} >{`${imageIndex + 1}/${Rutas.length}`}</Text>
                            </View>
                        </View>
                    )}
                    animationType="fade"
                />
            </View>
        )
    }
}
const estilosElemento = StyleSheet.create({
    contedorFondo: {
        flex: 1,
        marginRight: 12,
        marginLeft: 12
    },
    textArea: {
        flex: 1,
        textAlign: "justify",
    },
    scrollText: {
        borderColor: "#6c757d",
        borderWidth: 1,
        marginLeft: 10,
        marginRight: 10,
        borderRadius: 10
    }
});