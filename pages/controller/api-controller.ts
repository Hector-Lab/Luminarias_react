import { RefreshControlComponent } from 'react-native';
import { APIServices } from '../controller/api-routes';
import { StorageBaches } from '../controller/storage-controllerBaches';
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
        let cliente = await storageBaches.obtenerCliente();
        let data = {
            Cliente: cliente 
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
export async function ObtenerMunicipios(){
    try{
        let rawData = await service.ObtenerMunicipios();
        let municipios = await rawData.json();        
        if( municipios.Code == 200 ){
            return municipios.Catalogo;
        }else if( municipios.Code == 404 ){
            return MunicipiosVacios;
        }else{
            return ErrorListaMunicipios;
        }
    }catch( error ){
        throw verificarErrores(error);
    }
}
export async function RegistrarCiudadano( ciudadadano:any ){
    //NOTE: esta validano en la interfaz
    try{
        let idCiudadano = await service.insertarCiudadano(ciudadadano);
        let jsonRespuesta = await idCiudadano.json();
        return jsonRespuesta;
    }catch( error ){
        throw verificarErrores(error);
    }
}
export async function EnviarReportes( reporte:any ){
    try{
        let rawData = await service.insertarReporte(reporte);
        let jsonData = await rawData.json();
        if(jsonData.code == 200){
            return true;
        }else if(jsonData.code == 404 ){
            throw ErrorInsertar;
        }else if(jsonData.code == 500 ){
            throw ErrorDesconocido;
        }else if(jsonData.code == 403){
            throw ErrorDatos;
        }else if(String(jsonData.Error).includes("42S02")){
            throw noAutizado;
        }
    }catch(error){
         throw verificarErrores(error);
    }
}
export async function ObtenerMisReportes (){
    try{
        let cliente = await storageBaches.obtenerCliente();
        let ciudadano = await storageBaches.obtenerIdCiudadano();
        if(cliente != "" && ciudadano != "" ){
            let datos = {
                "Cliente": cliente,
                "Ciudadano": ciudadano
            };
            let rawData = await service.obtenerreportesCiudadano(datos);
            let jsonData = await rawData.json();
            if(jsonData.Code == 200){
                return jsonData.Mensaje;
            }else if(jsonData.Code == 404){
                throw NoRowSelect;
            }else if (jsonData.Code == 403){
                throw ErrorLista;
            }else if (jsonData.Code == 500){
                throw ErrorDesconocido;
            }
        }
    }catch(error){
        throw verificarErrores(error);
    }
}
export async function RecuperarDatos(inputCliente: string, inputCurp: string ){
    try{
        let datos = {
            "Cliente": inputCliente,
            "Curp": inputCurp
        };
        let rawData = await service.recuperarDatosCiudadano(datos);
        let ciudadano = await rawData.json();
        if(ciudadano.Code == 200){
            return JSON.stringify(ciudadano.Mensaje[0]);
        }else if (ciudadano.Code == 404){
            throw usuarioNoEncontrado;
        } else if (ciudadano.Code == 403){
            throw ErrorDesconocido;
        }
        
    }catch(error){
        throw verificarErrores(error);
    }
}
export async function editarDatosCiudadano( curp:string, telefono:string, email:string ){
    try{
        let cliente = await storageBaches.obtenerCliente();
        let datos = {
            "Cliente":cliente,
            "Curp":curp,
            "Telefono":telefono,
            "Email":email
        };
        let rawData = await service.editarDatosCiudadano(datos);
        let ciudadanoDatos = await rawData.json();
        if(ciudadanoDatos.Code == 200){
            return JSON.stringify(ciudadanoDatos.Mensaje);
        }else if( ciudadanoDatos.Code == 403 ){
            throw usuarioNoValido;
        }else if( ciudadanoDatos.Code == 404 ){
            throw SinCambios;
        }
    }catch(error){
        throw verificarErrores(error);
    }
}
export async function RefrescarReporte (reporte: string){
    try{
        let cliente =  await storageBaches.obtenerCliente();
        let ciudadano = await storageBaches.obtenerIdCiudadano();
        if( cliente != null && ciudadano != null ){
            let data = {
                Cliente: cliente,
                Ciudadano: ciudadano,
                Reporte: reporte
            };
            let rawData = await service.ObtenerReporte(data);
            let reportData = await rawData.json();
            if(reportData.code == 200){
                return JSON.stringify(reportData.Mensaje[0]);
            }else if ( reportData.Code == 404 ){
                throw NoRowSelect;
            }
        }else{
            //NOTE: regresamos un error
            throw usuarioNoEncontrado;
        }
    }catch(error){
        throw verificarErrores(error);
    }
}
export async function GuardarReporteC4(Reporte:any) {
    try{
        let jsonReport = await service.insertarReporteC4(Reporte);
        let reportData = await jsonReport.json();
        if( reportData.Code == 200 ){
            
        }if(reportData.Code == 223) {

        }
    }catch( error ){
        console.log(error);
    }
}


//NOTE: metodo interno
function verificarErrores(error:Error) {
    let message = error.message;
    console.log(message);
    if(message.includes("Usuario")){
        return userNotFound;
    }else{
        if(message.includes("Network")){
            return networkError;
        }
    }
    return error;

}
