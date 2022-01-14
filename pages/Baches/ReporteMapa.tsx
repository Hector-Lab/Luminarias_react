import React, { useCallback, useEffect, useState } from "react";
import { View,ImageBackground, TouchableOpacity } from "react-native";
import MyLocation from '../components/map-request';
import  * as Location from 'expo-location';
import Loading from '../components/modal-loading'; 
import { PrimaryColor } from "../../Styles/BachesColor";
export default function DetalleMapa(props:any){
    const [enableLocation, setLocationEnable ] = useState(false);
    const [location,setLocation] = useState(null);
    const [region,setRegion] = useState(null);
    const [regionInicial, setRegionInicial ] = useState(null);
    const [ reporte, setReporte ] = useState(null);
    const [loading, setLoading ] = useState(true)
    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            let { Reporte } = props.route.params;
            setReporte(Reporte);
            let coordenadasReporte;
            if(Reporte.Ubicaci_onGPS != null ){
                let regionReporte = JSON.parse(Reporte.Ubicaci_onGPS);
                setRegion(regionReporte);
                coordenadasReporte = {
                    latitude: regionReporte.latitude,
                    longitude: regionReporte.longitude,
                    latitudeDelta: 0.0022,
                    longitudeDelta: 0.00421,
                }
            }else{
                let location = await Location.getCurrentPositionAsync();
                coordenadasReporte = {
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude,
                    latitudeDelta: 0.0022,
                    longitudeDelta: 0.00421,
                }
            }
            console.log(Reporte);
          setLocationEnable(status == "granted");
          setLocation(location);
          setRegionInicial(coordenadasReporte);
          setRegion(coordenadasReporte);
        })();
      },[]);
    useEffect(()=>{
        if( region != null && regionInicial != null ){
            setLoading(false);
        }
    },[region, regionInicial]);
    const regresar = () => {
        props.navigation.pop();
    }
    return (
            <View style = {{flex:1}} >
                {
                    loading ? <Loading
                                loading = {loading}
                                message = {"Cargando..."}
                                tittle = {"Por favor espere"}
                                loadinColor = {PrimaryColor}
                                onCancelLoad={()=>{}}
                                transparent = {false}
                                 /> : 
                                 <MyLocation
                                    return = { regresar }
                                    Reporte = { reporte }
                                    initialRegion = { regionInicial }
                                    region = {region}/>
                }
            </View>
    );
}