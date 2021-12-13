import React,{} from "react";
import { View } from "react-native";
import { Button } from 'react-native-elements';
import MapView from 'react-native-maps';
import Styles from '../../Styles/styles';
export default function MyLocation(props:any ){
    return(
        <View style = {Styles.container} >
            <MapView 
            initialRegion={props.region}
            style = {Styles.mapContainer} />
        </View>
    );
}