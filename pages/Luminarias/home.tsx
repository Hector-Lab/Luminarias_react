import React,{ useState } from "react";
import { View, ImageBackground } from "react-native";
import { Text, Card,Icon } from 'react-native-elements'
import { TouchableOpacity } from "react-native-gesture-handler";
import { SuinpacRed } from '../../Styles/Color';
import IconAnt from 'react-native-vector-icons/AntDesign' 
import Styles from "../../Styles/styles";


export default function MenuLuminarias(props:any ){
    const image = require("../../resources/suinpac.png");
    const [canUpload,setCantUpload] = useState(false);
    const handleLuminariaPress = ()=>{
        props.navigation.navigate("Luminarias");
    }
    const handleLogount = ()=>{
        props.navigation.pop();
    }
    const handMedidoresPress = ()=>{
        props.navigation.navigate("Medidores");
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
            </ImageBackground>
        </View>
    );
}