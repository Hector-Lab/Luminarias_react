import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import { Vibration } from 'react-native';
import { StorageBaches } from '../pages/controller/storage-controllerBaches'; 

const TASK_LOCATION = "TRACK_LOCATION";
const TIME = 1000;
let storage;

export function iniciarServicioUbicacion() {
     
}

export function detenerServicionUbicacion() {
    Location.stopLocationUpdatesAsync(TASK_LOCATION);
}


export async function IniciarTarea (){
    let storage = new StorageBaches();
    let Ciudadano = storage.obtenerDatosPersona();
    let fecha = new Date();
    let fechaTula = fecha.getFullYear()+"-"+(fecha.getMonth() + 1) + " - " + fecha.getDay();
    console.log();
    let historialReporte = {
        idCiudadano: Ciudadano,
        TipoReporte: 2,
        Fecha:fechaTula,
        //FechaReporte: "Es la fecha del reporte"
    }
    
    TaskManager.defineTask(TASK_LOCATION, async ({ data,error,executionInfo })=>{
        if( error ){
            console.log(error);
            return;
        }
        if( data ){
            console.log(data);
            guardarReporte();
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