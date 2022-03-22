import { CardStyleInterpolators } from '@react-navigation/stack';
import React,{Component} from 'react';
import { View, StyleSheet,Text, Modal, TouchableOpacity} from 'react-native';
import { Icon } from 'react-native-elements'
import { Card} from 'react-native-elements'

export default class Message extends React.Component<
{   
    transparent:boolean,
    loading: boolean,
    loadinColor: string,
    onCancelLoad: any
    icon: string,
    iconsource: string,
    color:string,
    message: string,
    tittle: string,
    buttonText: string
}>{
    render(){
        return(
                <Modal
                style = { styles.modalContainer}
                visible = {this.props.loading}
                transparent = {this.props.transparent}
                 >
                    <View style = {styles.modalHeaderContaine} >
                         
                    </View>
                    <View style = {styles.modalBodyConteiner}>
                        <Card containerStyle = {styles.cardConteiner} >
                            <Card.Title>
                                {this.props.tittle}
                            </Card.Title>
                            <Card.Divider/>
                                <Icon
                                tvParallaxProperties
                                    type = {this.props.iconsource}
                                    name = {this.props.icon}
                                    color = {"#d9764c"}
                                    size = {50}
                                />
                            <View style = {styles.mensajeConteiner}>
                            <Text >{this.props.message}</Text>
                            </View>
                            <TouchableOpacity 
                                style={styles.btnButton}
                                onPress = {this.props.onCancelLoad} >
                                    <Text style = {{color: "white"}}  >{this.props.buttonText}</Text>
                            </TouchableOpacity>
                        </Card>
                    </View>
                    <View style = {styles.modalFooterConainer}>
                    
                    </View>
                </Modal>
        )
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
        backgroundColor: '#B20115',
        //backgroundColor: 'red'
      },
      btnContainer: {
          flex:1,
          justifyContent:"center",
          alignItems:"center"
      }

})