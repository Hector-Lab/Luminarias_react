import React,{ useEffect, useState } from "react";
import { View, ImageBackground } from "react-native";
import { Text, Card,Icon } from 'react-native-elements'
import { TouchableOpacity } from "react-native-gesture-handler";
import { iconColorBlue, SuinpacRed } from '../../Styles/Color';
import Styles from "../../Styles/styles";
import { StorageService } from '../controller/storage-controller';
import ModalMessage from '../components/modal-message';
import { color } from "react-native-elements/dist/helpers";

export default function MenuLuminarias(props:any ){
    const image = require("../../resources/suinpac.png");
    const [message,setMessage] = useState(String);
    const [icon, setIcon] = useState(String);
    const [iconColor, setIconColor ] = useState(String);
    const [headerMessage, setHeaderMessage] = useState(String);
    const [showMessage, setShowMessage] = useState(false);
    let storage = new StorageService();    
    const [canUpload,setCantUpload] = useState(false);
    useEffect(()=>{
            async function fetchData (){
                let result = await storageService();
                if(result[0]['COUNT(id)'] >= 1){
                    console.log(result[0]['COUNT(id)']);
                    setShowMessage(true);
                    setMessage("Existen registros guardados en el dispositivo");
                    setIcon("info");
                    setIconColor(iconColorBlue);
                    setHeaderMessage("Mensaje");
                    setCantUpload(true);
                }
            }
            fetchData();
    },[]);
    
    const handleLuminariaPress = ()=>{
        props.navigation.navigate("Luminarias");
    }
    const handleLogount = async () =>{
        let borrado = await storage.clearUser();
        console.log(`Datos Eliminados : ${borrado}`);
        props.navigation.pop();
    }
    const handMedidoresPress = ()=>{
        props.navigation.navigate("Medidores");
    }
    const storageService =  async() => {
        return await storage.verificarDatos("Luminarias");
    }
    return(
        <View style = {[Styles.container]}>
            <ImageBackground source={image} resizeMode="center" style = {Styles.backgroundimage} imageStyle = {{opacity:.06}} >
                <View style = {[Styles.MenuLuminaria]} >
                    <TouchableOpacity onPress = {handleLuminariaPress}>
                        <Card>
                            <Card.Title> Luminarias</Card.Title>
                            <Icon
                                type = {"font-awesome-5"}
                                tvParallaxProperties
                                name ={"lightbulb"}
                                size = {50}
                                color = {SuinpacRed}
                            />
                        </Card>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handMedidoresPress}>
                        <Card>
                                <Card.Title>Medidores</Card.Title>
                                <Icon
                                    type = {"font-awesome-5"}
                                    tvParallaxProperties
                                    name ={"tachometer-alt"}
                                    size = {50}
                                    color = {SuinpacRed}
                                />
                        </Card>
                    </TouchableOpacity>
                    {
                        //REVIEW: Este Boton se activa cuando haya datos en guardados que no enviaron en la captura
                        canUpload ? 
                        <TouchableOpacity>
                            <Card>
                                    <Card.Title>Cargar</Card.Title>
                                    <Icon
                                        style = {{marginLeft:15, marginRight:15}}
                                        type = {"font-awesome-5"}
                                        tvParallaxProperties
                                        name ={"upload"}
                                        size = {50}
                                        color = {SuinpacRed}
                                    />
                            </Card>
                        </TouchableOpacity>
                        :
                        <></>
                    }
                </View>
                <View style = {[Styles.btnMenuSali]} >
                <TouchableOpacity onPress = {handleLogount}>
                        <Card  >
                            <Card.Title> Salir</Card.Title>
                            <Icon
                                style = {{marginLeft:15, marginRight:15}}
                                tvParallaxProperties
                                name ={"logout"}
                                size = {50}
                                color = {SuinpacRed}
                            />
                        </Card>
                    </TouchableOpacity>
                </View>
                <ModalMessage
                    transparent = {true}
                    loading = {showMessage}
                    message = { message }
                    tittle = {headerMessage}
                    color = {color}
                    icon = {icon}
                    iconsource = { ""}
                    loadinColor = {iconColor}
                    buttonText = {"Aceptar"}
                    onCancelLoad = {()=>{setShowMessage(false)}}
                />
            </ImageBackground>
        </View>
    );
}