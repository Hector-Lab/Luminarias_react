import { RefreshControlComponent } from 'react-native';
import BatchedBridge from 'react-native/Libraries/BatchedBridge/BatchedBridge';
import { APIServices } from '../controller/api-routes';
import { StorageBaches } from '../controller/storage-controllerBaches';
import { CLIENTE } from '../controller/Variables';
const service = new APIServices();
const storageBaches = new StorageBaches();
const networkError = new Error("!Sin acceso a internet¡");
const userNotFound = new Error("Usuario no encontrado");
const usuarioNoValido = new Error("");
const usuarioNoEncontrado = new Error("Ciudadano no encontrado\nFavor de registrarse para continuar");
const ErrorDesconocido = new Error("¡Error desconocido!");
const ErrorInsertar = new Error("¡Error al registrar el reporte!\nFavor de intentar más tarde");
const NoRowSelect = new Error("¡Aún no tiene registros!");
const ErrorLista = new Error("¡Error al obtener al actualizar historial!\nFavor de intentar más tarde");
const ErrorSinAreas = new Error("¡El municipio no cuenta con temas disponibles!");
const ErrorAreas = new Error("¡Hubo un problema al obtener la lista de temas!");
const ErrorDatos = new Error("¡Favor de ingresar los datos requeridos!");
const ErrorCiudadano = new Error("Error al obtener datos del ciudadano\nFavor de intentar más tarde!");
const Error500 = new Error("Servicio no disponible\nFavor de intentar más tarde");
const Error403 = new Error("Error al actualizar su informacion\nFavor de intentar más tarde");
const UsuarioEncontrado = new Error("¡La CURP ingresada ya fue registrada!\nFavor de verificar sus datos");
const ErrorRegistro = new Error("Error al registrar al ciudadano\nFavor de intentar más tarde");
//INDEV: Nuevas funciones para la aplicacion de los baches
export async function CatalogoSolicitud() {
    try {
        let data = {
            Cliente: CLIENTE
        };
        let rawData = await service.ObtenerCatalogoAreas(data);
        let result = await rawData.json();

        if (result.Code == 200) {
            return result.Catalogo;
        } else if (result.code == 404) {
            throw ErrorSinAreas;
        } else if (result.code == 403) {
            throw ErrorAreas;
        } else if (result.code == 500) {
            throw Error500;
        }
    } catch (error) {
        throw verificarErrores(error);
    }
}
export async function RegistrarCiudadano(domicilio: string) {
    try {
        let personales = await storageBaches.obtenerDatosPersonales();
        let data = {
            Personales: personales,
            Domicilio: domicilio,
            Cliente: CLIENTE
        };
        let rawData = await service.RegistrarCiudadano(data);
        let result = await rawData.json();
        if( result.Code == 200 ){
            console.log(result.Ciudadano);
            await storageBaches.guardarCiudadano( String(result.Ciudadano) );
            return true;
        }else if( result.Code == 409 ){
            throw UsuarioEncontrado;
        }else if( result.Code == 223 ){
            throw ErrorDatos
        }else if ( result.code == 403 ){
            throw ErrorRegistro;
        }
    } catch (error) {
        throw verificarErrores(error);
    }
}
export async function EnviarReporte(datos) {
    try {
        let ciudadano = await storageBaches.obtenerCiudadano();
        let formato = {
            Tema: datos.Tema,
            Descripcion: datos.Descripcion,
            gps: datos.gps,
            direccion: datos.direccion,
            Referencia: datos.Referencia,
            Ciudadano: ciudadano,
            Cliente: CLIENTE,
            Evidencia: datos.Evidencia,
        }
        let raw = await service.Reportar(formato);
        let result = await raw.json();
        console.log(result);
        if (result.code == 200) {
            return true;
        } else if (result.code == 403) {
            throw ErrorInsertar;
        }
    } catch (error) {
        throw verificarErrores(error);
    }
}
export async function HistorialReportes() {
    try {
        let ciudadano = await storageBaches.obtenerCiudadano();
        let datos = {
            Ciudadano: ciudadano,
            Cliente: CLIENTE
        }
        let result = await service.Historial(datos);
        let reportes = await result.json();
        console.log(reportes);
        if( reportes.Code == 404 ){
            return []
        } if (reportes.Code == 200) {
            return reportes.Mensaje
        } else {
            throw ErrorLista;
        }
    } catch (error) {
        throw verificarErrores;
    }
}
export async function ObtenerCiudadano() {
    try {
        let ciudadano = await storageBaches.obtenerCiudadano();
        let datos = {
            Cliente: CLIENTE,
            Ciudadano: ciudadano
        };
        let rawdata = await service.ObtenerCiudadano(datos);
        let result = await rawdata.json();
        if (result.Code == 200) {
            return result.Message[0];
        } else if (result.Code == 403) {
            throw ErrorCiudadano;
        } else {
            throw Error500;
        }
    } catch (error) {
        throw verificarErrores(error);
    }
}
export async function ActualizarDatosCiudadano(datos: {
    Nombre: string,
    Paterno: string,
    Materno: string,
    Curp: string,
    Telefono: string,
    Email: string,
    Localidad: string,
    Calle: string,
    Numero: string,
    Colonia: string,
    Postal: string
}) {
    try {
        let Ciudadano = await storageBaches.obtenerCiudadano();
        let request = {
            Cliente: CLIENTE,
            Ciudadano: Ciudadano,
            Nombre:datos.Nombre ,
            Paterno:datos.Paterno,
            Materno:datos.Materno,
            Curp:datos.Curp,
            Telefono:datos.Telefono,
            Email:datos.Email,
            Localidad:datos.Localidad,
            Calle:datos.Calle,
            Numero:datos.Numero,
            Colonia:datos.Colonia,
            Postal:datos.Postal,
        }
        let rawData = await service.ActualizarCiudadano(request);
        let result = await rawData.json();
        console.log(result);
        if( result.Code = 200 ){
            return true;
        }else if ( result.Code == 500 ){
            throw Error500;
        }else if( result.Code = 403 ) {
            throw Error403;
        }
    } catch (error) {
        console.log(error);
    }
}
export async function IniciarSesion( curp:string ) {
    try{
        let datos = {
            Cliente: CLIENTE,
            Curp: curp
        };
        let raw = await service.IniciarSesion(datos);
        let result = await raw.json();
        if( result.code == 200 && result.Message.length > 0 ){
            await storageBaches.guardarCiudadano(String(result.Message[0].id));
            return true;
        }else if ( result.code == 200 && result.Message.length == 0 ){
            throw userNotFound;
        }else if( result.code == 403 ){
            throw Error500;
        }
    }catch(error){
        throw verificarErrores(error);
    }
}
//NOTE: metodo interno
function verificarErrores(error: Error) {
    let message = error.message;
    if (message.includes("Usuario")) {
        return userNotFound;
    } else {
        if (message.includes("Network")) {
            return networkError;
        }
    }
    return error;

}
