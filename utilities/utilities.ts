import  * as Location from 'expo-location';
import NetInfo from '@react-native-community/netinfo';

export async function CordenadasActuales () {
    let data = await Location.getCurrentPositionAsync();
    let coords = {
        latitude : String(data.coords.latitude),
        longitude : String(data.coords.longitude)
    };
    return coords;
}

 export async function checkConnection (){
    return new Promise((resolve,reject)=>{
        NetInfo.fetch()
        .then((estado)=>{
            resolve(estado.isInternetReachable);
        })
        .catch((error)=>{
            reject(error);
        })
    });
}