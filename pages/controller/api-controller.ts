import { RefreshControlComponent } from 'react-native';
import BatchedBridge from 'react-native/Libraries/BatchedBridge/BatchedBridge';
import { APIServices } from '../controller/api-routes';
import { StorageBaches } from '../controller/storage-controllerBaches';
import { CLIENTE } from '../controller/Variables';
const service = new APIServices();
const storageBaches = new StorageBaches();
const networkError = new Error("!Sin acceso a internet¡");
const userNotFound = new Error("Usuario o Contraseña Incorrectos");
const usuarioNoValido = new Error("");
const usuarioNoEncontrado = new Error("Ciudadano no encontrado\nFavor de registrarse para continuar");
const ErrorDesconocido = new Error("¡Error desconocido!");
const SinCambios = new Error("OK"); 
const ErrorInsertar = new Error("¡Error al registrar el reporte!\nFavor de intentar más tarde");
const NoRowSelect = new Error("¡Aún no tiene registros!");
const ErrorLista = new Error("¡Error al obtener el historial!\nFavor de intentar más tarde");
const MunicipiosVacios = new Error( "¡Municipios no encontrados!" );
const ErrorListaMunicipios = new Error( "!Error al obtener lista de municipios¡\nFavor de intentar más tarde" );
const ErrorSinAreas = new Error("¡El municipio no cuenta con temas disponibles!");
const ErrorAreas = new Error("¡Hubo un problema al obtener la lista de temas!");
const ErrorDatos = new Error("¡Favor de ingresar los datos requeridos!");
const noAutizado = new Error("¡El servicio aún no está disponible en tu municipio!!");

//INDEV: Nuevas funciones para la aplicacion de los baches
export async function CatalogoSolicitud(){
    try{
        let data = {
            Cliente: CLIENTE
        };
        let rawData = await service.ObtenerCatalogoAreas(data);
        let result = await rawData.json();
        if(result.Code == 200){
            return result.Catalogo;
        }else if(result.code == 404){
            throw ErrorSinAreas;
        }else if(result.code == 403){
            throw ErrorAreas;
        }else if( result.code == 500 ){
            throw ErrorDesconocido;
        }
    }catch( error ){
        throw verificarErrores(error);
    }
}
export async function RegistrarCiudadano( domicilio:string ) {
    try{
        let personales = await storageBaches.obtenerDatosPersonales();
        let data = {
            Personales: personales,
            Domicilio: domicilio,
            Cliente:CLIENTE
        };
        let rawData = await service.RegistrarCiudadano(data);
        let result = await rawData.json();
        console.log(result);
    }catch( error ){
        throw verificarErrores(error);
    }
}
export async function EnviarReporte( datos ) {
    try {
        let ciudadano = await storageBaches.obtenerCiudadano();
        let formato = { 
            Tema: datos.Tema ,
            Descripcion: datos.Descripcion,
            gps: datos.gps,
            direccion: datos.direccion,
            Referencia: datos.Referencia,
            Ciudadano: /*ciudadano*/ 8,
            Cliente: CLIENTE,
            Evidencia: datos.Evidencia,
        }
        let raw = await service.Reportar(formato);
        let result = await raw.json();
        console.log(result);
        if( result.code == 200 ){
            return true;
        }else if ( result.code == 403 ) {
            throw ErrorInsertar;
        }
    }catch( error ){
        throw verificarErrores(error);
    }
}
export async function HistorialReportes( ){
    try{
        let ciudadano = await storageBaches.obtenerCiudadano();
        let datos = {
            Ciudadano: (ciudadano == null ) ? "8" : ciudadano,
            Cliente: CLIENTE
        }
        let result = await service.Historial(datos);
        let reportes = await result.json();
        if(reportes.Code == 200){
            return reportes.Mensaje
        }else{
            throw ErrorLista;
        }
    }catch( error ){
        throw verificarErrores;
    }
}
//NOTE: metodo interno
function verificarErrores(error:Error) {
    let message = error.message;
    if(message.includes("Usuario")){
        return userNotFound;
    }else{
        if(message.includes("Network")){
            return networkError;
        }
    }
    return error;

}
