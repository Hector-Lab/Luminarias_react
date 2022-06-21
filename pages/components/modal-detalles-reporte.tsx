import React,{ Component, useEffect, useState } from "react";
import { View, StyleSheet, Text, ImageBackground, TouchableOpacity, Touchable,Modal, StatusBar } from "react-native";
import { Icon,Card, registerCustomIconType } from 'react-native-elements';
import { cardColor } from "../../Styles/BachesColor";
import { textoAtencion } from  '../../Styles/Color';

export default class ReporteDetalle extends React.Component<{ Reporte:{Area:string},Visible:boolean,Plataform:string }> {
    //'rgba(158, 150, 150, .5)'
    // NOTE: Estatus 1=> Pendiente, 2=> Proceso, 3=>Atendida, 4=> Rechazada
    render(){

        let estados = {1:"Pendiente",2:"Proceso",3:"Atendida",4:"Rechazada"};
        let colorEstado = {1:"#6c757d",2:"#17a2b8",3:"#28a745",4:"#dc3545"};
        let reporte;
        console.log(this.props.Reporte);
        const ReporteVacio = () =>{
            return  <View style = {{ borderWidth:1,marginTop: this.props.Plataform == "ios" ? 20:0 }} >
                        <Text> Vacio </Text>
                    </View>;
        }
        return(
            <Modal style = {{marginRight:18,marginLeft:18,flex:1 }} visible = { this.props.Visible } >
                {
                    this.props.Reporte == null ? 
                        ReporteVacio():
                        <View style = {{ borderWidth:1,marginTop: this.props.Plataform == "ios" ? 20:0 }} >
                            <Text style = {{textAlign:"center"}} > {String(this.props.Reporte.Area)} </Text>
                        </View>
                }
            </Modal>
        )
    }
}
const estilosElemento = StyleSheet.create({
    contedorFondo:{
        flex:1, 
        marginRight:12,
        marginLeft:12
    }
  });