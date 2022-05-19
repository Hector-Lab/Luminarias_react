import { CardStyleInterpolators } from '@react-navigation/stack';
import React,{Component} from 'react';
import { ActivityIndicator, View, StyleSheet,Text, Modal, TouchableOpacity} from 'react-native';
import { Card} from 'react-native-elements'
import { Button } from 'react-native-elements/dist/buttons/Button';
import { azulClaro, azulColor } from '../../Styles/Color';

export default class Loading extends React.Component<
{   
    transparent:boolean,
    loading: boolean,
    loadinColor: string,
    onCancelLoad: any
    tittle:string,
    message:string

}>{
    render(){
        return(
                <Modal
                style = { [styles.modalContainer] }
                visible = {this.props.loading}
                transparent = {this.props.transparent}>
                <View style = {{flex:1,opacity:.9, backgroundColor:"lightgrey"}} >
                <View style = {styles.modalHeaderContaine} >       
                    </View>
                    <View style = {styles.modalBodyConteiner}>
                        <Card containerStyle = {[styles.cardConteiner]} >
                            <Card.Title>
                                {this.props.tittle == "" ? "Verificando Credenciales" : this.props.tittle}
                            </Card.Title>
                            <Card.Divider/>
                            <ActivityIndicator size = "large" color = {this.props.loadinColor} />
                            <View style = {styles.mensajeConteiner}>
                                <Text >Cargando...</Text>
                            </View>
                        </Card>
                    </View>
                    <View style = {styles.modalFooterConainer}>
                    
                    </View>
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
        shadowColor: azulColor, //Solo funciona en ios
        marginLeft:50,
        marginRight:50
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

})