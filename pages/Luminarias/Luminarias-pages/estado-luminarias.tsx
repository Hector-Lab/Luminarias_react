import React,{} from "react";
import { View,TextInput,ScrollView } from "react-native";
import { Text,Button } from 'react-native-elements';
import Styles from "../../../Styles/styles";
import Carousel from 'react-native-snap-carousel';
import Icon from 'react-native-vector-icons/FontAwesome';

import { Input } from "react-native-elements/dist/input/Input";
import { Picker } from "@react-native-picker/picker";


export default function LuminariasEstados(props:any ){


    return(
        <View style = {Styles.TabContainer}> 
            <View  style={Styles.inputButtons} >              
              <ScrollView>
                <Input placeholder="Clave Padrón"    rightIcon={{ type: 'font-awesome', name: 'search' }} />                                
                <Input placeholder="Lectura Anterior" label="Lectura Anterior" />
                <Input placeholder="Lectura Actual" label="Lectura Actual" />
                <Input placeholder="Consumo" label="Consumo" />
                <Text style={Styles.textFormularios}>Estado</Text>
                <Picker>
                    <Picker.Item label="Anomalia 8" value="8" />
                    <Picker.Item label="Anomalia 9" value="9" />
                    </Picker >  
                    <Text style={Styles.textFormularios}>Observaciones</Text>
                    <TextInput style={Styles.textArea} placeholder="Observaciones Del Medidor"
                    
                />
                <Carousel
                
                />
                <Button style={Styles.btnFoto}  icon={<Icon name="camera" size={25} color="white"/>} title="  Tomar Foto" />
                <Text></Text>
                <Button  icon={<Icon name="save" size={25} color="white"/>} title="  GUARDAR" />
            </ScrollView>
            </View>
  
            
        </View>           

            
            
            
        
    );
}