import React,{ Component, useEffect, useState } from "react";
import { View, StyleSheet, Text, ImageBackground, TouchableOpacity, Touchable,Modal } from "react-native";
import { Icon,Card } from 'react-native-elements';
import { cardColor } from "../../Styles/BachesColor";

export default class ItemReporte extends React.Component
<
{   
    Area:string,
    Descripcion:string,
    FechaAlta:string,
    Estado:string,
    OnPressItem: Function
}
>{
    //'rgba(158, 150, 150, .5)'
    // NOTE: Estatus 1=> Pendiente, 2=> Proceso, 3=>Atendida, 4=> Rechazada
    render(){
        let estados = {1:"Pendiente",2:"Proceso",3:"Atendida",4:"Rechazada"};
        let colorEstado = {1:"#6c757d",2:"#17a2b8",3:"#28a745",4:"#dc3545"};
        return(
            <View style = {{marginBottom:15,flex:1,flexDirection:"column"}} >
                <TouchableOpacity style = {{ borderWidth:1,backgroundColor:"white", borderRadius:5}} onPress = { this.props.OnPressItem } >
                    <Text style = {{ flex:1, textAlign:"center",marginBottom:5,fontWeight:"bold", color: colorEstado[parseInt(this.props.Estado)]  }}>{estados[parseInt(this.props.Estado)]}</Text>
                    <Text style = {{ flex:1, justifyContent:"center", fontSize:13, textAlign:"left", marginLeft:5 }}>{this.props.Area} - { this.props.FechaAlta } </Text>
                </TouchableOpacity>
            </View>
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