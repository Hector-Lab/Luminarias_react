import React, { useCallback, useEffect, useState } from "react";
import { View, Text,ImageBackground } from "react-native";
import Styles from "../../../Styles/styles";
import MyLocation from '../../components/map-request';
import  * as Location from 'expo-location';
import { TouchableOpacity } from "react-native-gesture-handler";
export default function CustomMap(props:any){
    const [enableLocation, setLocationEnable ] = useState(false);
    const [location,setLocation] = useState(null);
    const [region,setRegion] = useState(null);

    const image = require("../../../resources/suinpac.png");
    useEffect(() => {
        (async () => {
          let { status } = await Location.requestForegroundPermissionsAsync();
          setLocationEnable(status == "granted");
    
          let location = await Location.getCurrentPositionAsync();
          setLocation(location);
          let region = {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.0022,
            longitudeDelta: 0.00421,
          }
          setRegion(region);
        })();
      },[]);
    const requestPermisions = async() =>{
        let { status } = await Location.requestForegroundPermissionsAsync();
        setLocationEnable(status == "granted");

    }
    return(
        <View style = {[Styles.TabContainer]} >
            <ImageBackground source={image} resizeMode="center" style = {Styles.backgroundimage} imageStyle = {{opacity:.05}} >
            {
                enableLocation ? 
                <MyLocation
                region = {region}
                /> : 
                <View>
                    <TouchableOpacity 
                    style = {[,Styles.btnButton,{marginLeft:"25%",marginRight:"25%"}]}
                    onPress = {requestPermisions}>
                        <Text style = {Styles.btnTexto} > Activar Permisos </Text>
                    </TouchableOpacity>
                </View>
            }
            </ImageBackground>
        </View>
    );
}