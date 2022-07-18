import React,{Component} from 'react';
import { View, StyleSheet,Text, Modal, TouchableOpacity} from 'react-native';
import { Icon,Divider,Image } from 'react-native-elements'
import { azulColor } from '../../Styles/Color';


export default class File extends React.Component<
{   
    onPress:Function,
    selected:Boolean,
    onDelete:any
}>{
    render(){
        return(
            <View style = { this.props.selected ? styles.imgContenedorSeleccion : styles.imgContenedor } >
                <TouchableOpacity onPress = { this.props.onDelete } style = {{ flexDirection:"row",alignSelf:"flex-end", borderColor:"#dc3545" }}>
                    <Icon size = {20} name = "close" color="#dc3545" ></Icon>
                </TouchableOpacity>
                <TouchableOpacity style = { [styles.imgItem,{alignSelf:"center",marginTop:-20}]} onPress = {this.props.onPress}  >
                    <Icon size = {50} name = "image" type = "material" color= { azulColor+"ae" } />
                    <Text style = {{ alignSelf:"center" }} >Evidencia</Text>
                </TouchableOpacity>
            </View>
        );
    };
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        flexDirection:"column",
    },
    modalContainer: {
        flex: 1,
        justifyContent:"center",
        backgroundColor:"#000000"
    },
    modalHeaderContaine: {
        flex: 1,
    },
    modalBodyConteiner: {
        flex:1,
        flexDirection:"column",
        justifyContent:"center",
    },
    modalFooterConainer: {
        flex: 1,
    },
    cardConteiner: {
        borderRadius: 10,
        shadowColor:"#B20115", //Solo funciona en ios
        elevation: 10
    },
    mensajeConteiner:{
        marginTop:"5%",
        alignItems:"center"
    },
    btnButton: {
        marginTop: 30,
        borderRadius: 15,
        alignItems: 'center',
        padding: 10,
        backgroundColor: azulColor,
        //backgroundColor: 'red'
      },
      btnContainer: {
          flex:1,
          justifyContent:"center",
          alignItems:"center"
      },
    imgItem: {
        flex:1, 
        justifyContent:"center", 
        borderBottomEndRadius:10, 
        borderBottomLeftRadius:10 
      },
      imgContenedor: {
        height:120,
        width:100, 
        backgroundColor:"#6c757d18",
        borderRadius:10,
        borderTopRightRadius:0,
        marginLeft:5
      },
      imgContenedorSeleccion: {
        height:120,
        width:100, 
        backgroundColor:azulColor+43,
        borderRadius:10,
        borderTopRightRadius:0,
        marginLeft:5
      }

})