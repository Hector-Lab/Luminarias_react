import React,{} from "react";
import { View } from "react-native";
import { Text } from 'react-native-elements'
import Styles from "../../../Styles/styles";
import { Input } from "react-native-elements/dist/input/Input";

export default function Luminarias(props:any ){
    return(
        <View style = {Styles.TabContainer}>
            <Input placeholder = "Contrato"></Input>
        </View>
    );
}
