import React,{ useEffect, useState } from "react";
import { View, StyleSheet, Text, ImageBackground } from "react-native";
import { Icon } from 'react-native-elements';
import { TouchableOpacity } from "react-native-gesture-handler";
import { textoAtencion } from  '../../Styles/Color';

export default class Message extends React.Component
<
{   
    colorBoton:string,
    colorSombraBoton: string,
    TextoArriba: string,
    TextoAbajo:string,
    fondo: any,
    marginBotton: number,
    marginLeft: number,
    onPress: Function
}>{
    //'rgba(158, 150, 150, .5)'
    render(){
        return(
            <View style = {{ flex:1, justifyContent:"center"}} >
            <ImageBackground style = { estilosElemento.contedorFondo } source = { this.props.fondo } >
                <View style = { estilosElemento.contenedorElemento }>
                    <View style = {estilosElemento.contenedorTexto}>
                        <View style = { estilosElemento.bloqueTexto } >
                            <Text style = { estilosElemento.textoArriba }>{this.props.TextoArriba}</Text>
                            <Text style = { estilosElemento.textoAbajo}>{this.props.TextoAbajo}</Text> 
                        </View>
                    </View>
                    <View style = {estilosElemento.contenedorBoton}>
                        <TouchableOpacity style ={[estilosElemento.boton,
                        {   borderColor: this.props.colorSombraBoton,
                            marginBottom: this.props.marginBotton,
                            marginRight: this.props.marginLeft,
                            backgroundColor:this.props.colorBoton
                            }]} onPress = { ()=>{ this.props.onPress() } } ></TouchableOpacity>
                    </View>
                    <View style = { estilosElemento.contenedorVacio }/>
                </View>
            </ImageBackground>
        </View>
        )
    }
}
const estilosElemento = StyleSheet.create({
    contedorFondo:{
        flex:1, 
        marginRight:18,
    },
    contenedorElemento: {
        flex:1 , 
        flexDirection:"row",
    },
    contenedorTexto:{
        paddingLeft:20,
        flex:8,
        justifyContent:"center",
    },
    contenedorBoton:{
        flex: 6,
        justifyContent:"center",
        alignItems:"center",
        borderColor:'red'
    },
    contenedorVacio:{
        flex:10
    },
    boton:{
        padding:30, 
        borderWidth:2,
        borderRadius:40,
        elevation:10
    },
    bloqueTexto: {
        marginLeft: 10, marginBottom:10
    },
    textoArriba:{
        fontSize:16
    },
    textoAbajo:{
        fontWeight:"bold", 
        fontSize:17
    }
  });