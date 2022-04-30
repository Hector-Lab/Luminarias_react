import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import { Vibration } from 'react-native';
import { StorageBaches } from '../pages/controller/storage-controllerBaches'; 
import { GuardarReporteRosaC4, ActualizarCoordenadas } from '../pages/controller/api-controller';
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
    if(await TaskManager.isTaskRegisteredAsync(TASK_LOCATION)){
        return ;
    }
    //FIXME: agregar la extraccion de datos del storage cuando esten hechas las interfaces de registro 
    TaskManager.defineTask(TASK_LOCATION, async ({ data,error,executionInfo })=>{
        if( error ){
            Vibration.vibrate(500);
            return;
        }
        if( data ){
            //NOTE: las fechas las generamos desde el API ( Lo convertimos en array y tomamos e ultimo actualizado )
            let arregloCoordenadas = JSON.parse(JSON.stringify(data)).locations;   
            let idReporte = storage.obtenerIdReporteRosa();
            if(arregloCoordenadas.length > 0){
                //INDEV: inveiamos los datos a la api
                let coords = { latitude : arregloCoordenadas[arregloCoordenadas.length-1].coords.latitude ,longitude : arregloCoordenadas[arregloCoordenadas.length-1].coords.longitude };
                console.log(JSON.stringify(arregloCoordenadas[arregloCoordenadas.length-1].coords));
                //let direccion = await ObtenerDireccionActual(coords);
                let datos = {
                    Ubicacion_GPS:JSON.stringify(arregloCoordenadas[arregloCoordenadas.length-1].coords),
                    idCiudadano:16, //NOTE: Estatico solo para laxws pruebas
                    Direccion: /*JSON.stringify(direccion)*/ '',
                }
                await ActualizarCoordenadas(datos);
            }
        }
    });
    IniciarServicio();
    //INDEV: Enviamos los datos de la 
    let historialReporte = {
        Ciudadano: 16,
        Tipo: 2,
        Cliente:56,
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
    }).then(()=>{
        Vibration.vibrate(TIME);
    }).catch((error)=>{
        console.log(error);

    });
}