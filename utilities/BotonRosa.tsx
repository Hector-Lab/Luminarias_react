import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import { Vibration } from 'react-native';

const TASK_LOCATION = "TRACK_LOCATION";
const TIME = 1000;

export function iniciarServicioUbicacion() {

}

export function detenerServicionUbicacion() {
    Location.stopLocationUpdatesAsync(TASK_LOCATION);
}

export function guardarReporte(  ){

}

export async function IniciarTarea (){
    TaskManager.defineTask(TASK_LOCATION, async ({ data,error,executionInfo })=>{
        if( error ){
            console.log(error);
            return;
        }
        if( data ){
            console.log("________________________________________");
            console.log(data);
            console.log("________________________________________");
        }
    });
    IniciarServicio();
}   
export function IniciarServicio(){
    Location.startLocationUpdatesAsync(TASK_LOCATION,{
        showsBackgroundLocationIndicator:true,
        accuracy:Location.Accuracy.BestForNavigation,
        foregroundService:{
            notificationTitle:"Localizacion",
            notificationBody:"Servicion de localizacion activado",
            notificationColor: "#fff",
        },
        activityType:Location.ActivityType.Fitness,
        deferredUpdatesInterval:5000,
    }).then(()=>{
        Vibration.vibrate(TIME);
    }).catch((error)=>{


    });
}