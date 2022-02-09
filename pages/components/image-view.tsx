import { CardStyleInterpolators } from '@react-navigation/stack';
import { Camera } from 'expo-camera';
import React,{Component} from 'react';
import { ActivityIndicator, View, StyleSheet,Text, Modal, TouchableOpacity} from 'react-native';
import { Card, Image, Icon } from 'react-native-elements';
import { BlueColor } from '../../Styles/BachesColor';
import Style from  '../../Styles/BachesStyles';
import { SuinpacRed } from '../../Styles/Color';
import { ADDPHOTO, DELETE} from '../../Styles/Iconos';

export default class ImageViewer extends React.Component<
{
    RenderItem: any[],
    Selected: string,
    AgregarImagen: Function,
    EliminarImagen: Function,
    MaximizarImagen: Function,
    MostrarMensaje: boolean
}
>{

  //NOTE: el flex siempre es 3   
    render(){
        console.log(this.props.Selected);
        return(
            <View style = {{ flex:1 , marginTop:25,elevation:0}} >
                <Card >
                    <View style = {{flex:1, flexDirection: this.props.MostrarMensaje ? "column" : "row" }}  >
                        {
                            this.props.RenderItem
                        }
                        <View style = {{flex:2}} >
                        </View>
                    </View>
                    {
                        this.props.Selected == "" ? <></> :
                            <View style = {{ flex:1 }} >
                                <TouchableOpacity onPress = {()=>{this.props.MaximizarImagen()}} >
                                    <Image
                                        source = {{uri: this.props.Selected}} 
                                        style = {{height:200,width:300,marginTop:15}}
                                        resizeMode = {"center"}
                                    />
                                </TouchableOpacity>
                            </View>
                    }
                    <View style = {{flex:1,flexDirection:"row", marginTop:15}}>
                        <TouchableOpacity style = {{flex:1}} onPress = { ()=>{this.props.AgregarImagen()} } >
                            <View style = { [Style.btnButton,{ backgroundColor:BlueColor, borderColor:BlueColor}] } >
                                    <Icon type = {ADDPHOTO[1]} name = {ADDPHOTO[0]} color = {"white"} tvParallaxProperties />
                            </View>
                        </TouchableOpacity>
                        <View style = {{flex:1}} ></View>
                        <TouchableOpacity style = {{flex:1}} onPress = { ()=>{this.props.EliminarImagen()} } >
                            <View style = { [Style.btnButton,{ backgroundColor:SuinpacRed, borderColor:SuinpacRed}] } >
                                    <Icon type = {DELETE[1]} name = {DELETE[0]} color = {"white"} tvParallaxProperties />
                            </View>
                        </TouchableOpacity>
                    </View>
                </Card>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    ImageStyle: {
        aspectRatio:1,
        width:"20%",
        height:"20%",
    }
})