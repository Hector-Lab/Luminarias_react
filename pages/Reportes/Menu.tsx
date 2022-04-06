import React,{} from  'react';
import { View, Text, ImageBackground } from "react-native";
import { Avatar } from 'react-native-elements';
import  Styles from  '../../Styles/styles';
import MenuItem from '../components/ItemMenuReporte';

export default function MenuReportes(props: any) {
    const reporteTerceros = () =>{
        props.navigation.navigate("Terceros");
    }
    const reporteBotonRosa = () =>{

    }
    const reporteEmpatiaCiudadana = () => {


    }

    return(
        <View style = {{ flex:1 }} >
            <ImageBackground source = { require('../../assets/Fondo.jpeg') } style = {{ flex:1 }} >
                <View style = {{flex:2, borderRadius:1, borderColor:"black", justifyContent:"center" }} >
                    <View style = {{ justifyContent:"center" , alignItems:"center"}}  >
                        <Avatar
                        avatarStyle={{  }}
                            rounded
                            imageProps={ {resizeMode:"contain"} }
                            size = "xlarge"
                            containerStyle = {{height:120,width:220}}
                            source = {require("../../assets/banner.png")} 
                        />
                    </View>
                </View>
                {/*INDEV: */ }
                <View style = { [Styles.ContenedorElemento,{borderColor:"green"} ] } >
                    <MenuItem
                        TextoArriba='Empatía'
                        TextoAbajo ='Ciudadana'
                        colorBoton ='#003356'
                        colorSombraBoton='rgba(158, 150, 150, .3)'
                        marginBotton={ 0 }
                        marginLeft = { 7 }
                        onPress= { ()=>{ } }
                        fondo = {require('../../assets/Botones/BtnRedonda.png')}
                    />
                </View>
                <View style = { [Styles.ContenedorElemento,{borderColor:"cyan"}] } >
                <MenuItem
                        TextoArriba='Boton'
                        TextoAbajo ='Rosa'
                        colorBoton ='#e6acdd'
                        marginBotton={ 12 }
                        marginLeft = { 7 }
                        onPress= { ()=>{ } }
                        colorSombraBoton='rgba(230, 172, 221, .3)'
                        fondo = {require('../../assets/Botones/btnRosa.png')}
                    />
                </View>
                <View style = { [Styles.ContenedorElemento,{borderColor:"black"}] } >
                <MenuItem
                        TextoArriba='Reporte a'
                        TextoAbajo ='Terceros'
                        colorBoton ='#39b54a'
                        marginBotton={ 12 }
                        marginLeft = { 7 }
                        colorSombraBoton='rgba(57, 181, 74, .3)'
                        onPress= { reporteTerceros }
                        fondo = {require('../../assets/Botones/btnTeerceros.png')}
                    />
                </View>
                <View style = {{flex:2, borderRadius:1, borderColor:"black" }} >
                    
                </View>
            </ImageBackground>
        </View>
    );
}