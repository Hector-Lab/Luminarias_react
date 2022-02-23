import { CardStyleInterpolators } from '@react-navigation/stack';
import React,{Component} from 'react';
import { View, Text, Modal, TouchableOpacity, BackHandler} from 'react-native';
import { Icon, Card } from 'react-native-elements';
import * as Linking from 'expo-linking'
import { BackgrounBlue, SuinpacRed} from  '../../Styles/Color';
import Styles from  '../../Styles/BachesStyles';
import { StorageBaches } from '../controller/storage-controllerBaches';


export default class Privacidad extends React.Component<
{   
    visible: boolean,
    onAccept: Function
}>{
    render(){
        const storage = new StorageBaches();
        const AceptarCondiciones = async ()=> {
            await storage.setCondicionesPrivacidad("OK");
            this.props.onAccept();
        }
        return(
            <Modal visible= { this.props.visible } transparent = { true} >
                <View style = {{flex:1, justifyContent:"center"}}>
                    <Card containerStyle = {{ elevation:10 }} >
                        <Card.Title> Terminos y Condiciones </Card.Title>
                        <Card.Divider></Card.Divider>
                        <View>
                        <Icon
                            tvParallaxProperties
                            type = {"material"}
                            name = {"policy"}
                            color = { BackgrounBlue }
                            size = {50}
                        />
                        <View>
                            <Text></Text>
                            <TouchableOpacity onPress = { ()=>{Linking.openURL("https://cuautitlanatencionciudadana.servicioenlinea.mx/bootstrap/pdf/aviprivext.pdf")} } >
                                <Text style = {{textAlign:"center", color:"#003357", fontWeight:"bold", textDecorationLine:"underline"}} > Acepto los terminos y condiciones</Text>
                            </TouchableOpacity>
                        </View>
                        <Text></Text>
                        <Card.Divider></Card.Divider>
                        <View style = {{flexDirection:"row", justifyContent:"space-around" }} >
                            <TouchableOpacity style = { [Styles.btnButtonSuccessSinPading,{ padding:15}] } onPress = { AceptarCondiciones } >
                                <Text style = {{textAlign:"center", color:"white", fontWeight:"bold"}} > Aceptar </Text>
                            </TouchableOpacity>
                            <TouchableOpacity style = {[Styles.btnButtonSuccessSinPading, { padding:15,  backgroundColor:SuinpacRed }]} onPress = {()=>{BackHandler.exitApp();}} >
                                <Text style = {{textAlign:"center", color:"white", fontWeight:"bold"}}  > Cancelar </Text>
                            </TouchableOpacity>
                        </View>
                        </View>
                    </Card>
                </View>
            </Modal>
        );
    }
}