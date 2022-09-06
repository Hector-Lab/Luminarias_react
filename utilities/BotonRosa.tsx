import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import { Platform, Vibration } from 'react-native';
import { StorageBaches } from '../pages/controller/storage-controllerBaches'; 
import { GuardarReporteRosaC4, ActualizarCoordenadas } from '../pages/controller/api-controller';
import { CLIENTE } from '../utilities/Variables';
//NOTE: session de errores

const TASK_LOCATION = "TRACK_LOCATION";
const TIME = 1000;
const storage = new StorageBaches();


export function iniciarServicioUbicacion() {
     
}

export async function detenerServicionUbicacion() {
    if(await TaskManager.isTaskRegisteredAsync(TASK_LOCATION)){
        Location.stopLocationUpdatesAsync(TASK_LOCATION);
        console.log("Deteniendo servicio");
    }
}


export async function IniciarTarea(){
    //Obtenemos el id del ciudadano 
    if(await TaskManager.isTaskRegisteredAsync(TASK_LOCATION)){
        return ;
    }
    //FIXED: agregar la extraccion de datos del storage cuando esten hechas las interfaces de registro 
    //FIXME: agregar validacion de segundo plano para el geocode
    TaskManager.defineTask(TASK_LOCATION, async ({ data,error,executionInfo })=>{
        if( error ){
            if(Platform.OS == "android")
            Vibration.vibrate(500);
            return;
        }
        if( data ){
            //NOTE: las fechas las generamos desde el API ( Lo convertimos en array y tomamos e ultimo actualizado )
            let arregloCoordenadas = JSON.parse(JSON.stringify(data)).locations;   
            if(arregloCoordenadas.length > 0){
                //INDEV: inveiamos los datos a la api
                let coords = { latitude : arregloCoordenadas[arregloCoordenadas.length-1].coords.latitude ,longitude : arregloCoordenadas[arregloCoordenadas.length-1].coords.longitude };
                console.log(coords);
                //let direccion = await ObtenerDireccionActual(coords);
                let datos = {
                    Ubicacion_GPS:JSON.stringify(coords),
                    idCiudadano: storage.obtenerIdReporteRosa(),
                    Direccion:/*direccion*/'',
                }
                let estadoReporte = await ActualizarCoordenadas(datos);
                if(estadoReporte == 0){
                    detenerServicionUbicacion();
                }
            }
        }
    });
    IniciarServicio();
    //INDEV: Enviamos los datos de la 
    let historialReporte = {
        Ciudadano: await storage.obtenerIdCiudadano(),
        Tipo: 2,
        Cliente:CLIENTE,
    };
    return await GuardarReporteRosaC4(historialReporte);
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
        //deferredUpdatesDistance:2
    }).then(()=>{
        if(Platform.OS == "android")
        Vibration.vibrate(TIME);
    }).catch((error)=>{
        console.log("Error de incio");
        console.log(error);
    });
}