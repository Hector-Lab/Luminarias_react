import { CardStyleInterpolators } from '@react-navigation/stack';
import React,{Component} from 'react';
import { ActivityIndicator, View, StyleSheet,Text, Modal, TouchableOpacity} from 'react-native';
import { Card, Image } from 'react-native-elements';


export default class ImageViewer extends React.Component<
{
    Data: Array<String>,
}
>{
  //NOTE: el flex siempre es 3   

    render(){
        let Imagenes = [];
        for (let index = 0; index < 3; index++) {
            Imagenes.push(
                <View style = {{flex:1, marginBottom:20 }} key = {index} >
                    <Card containerStyle = {{borderWidth:1}} >
                        
                    </Card>
                </View>
            )
        }
        return(
            <View style = {{ flex:1 ,borderWidth:2, marginTop:20}} >
                <Card>
                    <View style = {{flex:1,borderWidth:1,borderColor:'red', flexDirection:"row"}} >
                        { 
                            Imagenes
                        }
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