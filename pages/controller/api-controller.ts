import { ServerContainer, TabRouter } from '@react-navigation/native';
import { RefreshControlComponent } from 'react-native';
import { APIServices } from '../controller/api-routes';
import { StorageBaches } from '../controller/storage-controllerBaches';
import { verificarcurp } from  '../../utilities/utilities';
import { CLIENTE } from '../../utilities/Variables';
import { iconColorBlue } from '../../Styles/Color';
import { string } from 'yup/lib/locale';

const service = new APIServices();
const storageBaches = new StorageBaches();
const networkError = new Error("!Sin acceso a internet¡");
const userNotFound = new Error("Usuario o Contraseña Incorrectos");
const usuarioNoValido = new Error("");
const usuarioNoEncontrado = new Error("Ciudadano no encontrado\nFavor de registrarse para continuar");
const ErrorDesconocido = new Error("¡Servicio no disponible!\nFavor de intentar más tarde");
const SinCambios = new Error("OK"); 
const ErrorInsertar = new Error("¡Error al registrar el reporte!\nFavor de intentar más tarde");
const NoRowSelect = new Error("¡Aún no tiene registros!");
const ErrorLista = new Error("¡Error al obtener el historial!\nFavor de intentar más tarde");
const MunicipiosVacios = new Error( "¡Municipios no encontrados!" );
const ErrorListaMunicipios = new Error( "!Error al obtener lista de municipios¡\nFavor de intentar más tarde");
const ErrorSinAreas = new Error("¡El municipio no cuenta con temas disponibles!");
const ErrorAreas = new Error("¡Hubo un problema al obtener la lista de temas!");
const ErrorDatos = new Error("¡Favor de ingresar los datos requeridos!");
const noAutizado = new Error("¡El servicio aún no está disponible en tu municipio!!");
const Error223ReporteC4 = new Error("¡Favor de llenar los campos requeridos!");
const Error500ReporteC4 = new Error("Servicio en Mantenimiento\nDisculpe las molestias");
const Error224ReporteC4 = new Error("Error al enviar alerta, Reintentando");
const ErrorC4UsuarioRegistrado = new Error("¡La CURP ingresada esta registrada!");
const ErrorC4Registro = new Error("¡Error al registrar ciudadano!\nFavor de intentar más tarde");
const ErrorDatosDomiclio = new Error("¡Error al obtener domicilio!\nFavor de intentar más tarde");
const ErrorActualizarDomiclio = new Error("¡Error al actulizar el domicilio!\nFavor de intentar más tarde");
const ErrorDatosContactos = new Error("¡Error al obtener los contatos!\nFavor de intentar más tarde");
const ErrorActualizatContactos = new Error("¡Error al actualizar contactos!\nFavor de intentar más tarde");
const ErrorActualizarPersonales = new Error("¡Error al actualizar personales!\nFavor de intentar más tarde");
const ErrorActualizarCiudadano = new Error("¡Error al actualizar ciudadano!\nFavor de intentar más tarde");
const ErrorGetFotoPerfil = new Error("¡Error al obtener la foto del ciudadano!\nFavor de intentar más tarde");
const ErrorEnviarRespuesta =  new Error("¡Error al enviar la respuesta!\nFavor de intentar más tarde");
let abort = new AbortController();
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
export async function EnviarReportes( reporte:any ){
    try{
        let data = {
            Tema: reporte.Tema,
            Descripcion: reporte.Descripcion,
            gps: reporte.gps,
            direccion: reporte.direccion,
            Referencia: reporte.Referencia,
            Ciudadano: await storageBaches.obtenerIdCiudadano(),
            Cliente: CLIENTE,
            Evidencia: reporte.Evidencia,
        }; 
        let rawData = await service.insertarReporte(data,abort);
        let jsonData = await rawData.json();
        console.log(jsonData);
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
        let ciudadano = await storageBaches.obtenerIdCiudadano();
        if(CLIENTE != null && ciudadano != "" ){
            let datos = {
                "Cliente": String(CLIENTE),
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
        console.log(reportData);
        if( reportData.Code == 200 ){
            return("¡Reporte Guardado con Éxito!"); //Mensaje Guaradado
        }if(reportData.Code == 223) {
            throw(Error223ReporteC4);
        }if(reportData.Code == 403){
            throw(Error500ReporteC4);
        }
    }catch( error ){
        throw verificarErrores(error);
    }
}
export async function GuardarReporteRosaC4(Ciudadano:any){
    try{
        console.log(Ciudadano);
        let jsonReport = await service.realizarBotonRosa(Ciudadano);
        let reportData = await jsonReport.json();
        if(reportData.Code == 200){
            //NOTE: guardamos el id en el storge 
            storageBaches.guardarIdReporteRosa(String(reportData.Mensaje));
            return;
        }else if (reportData.Code == 223){
            throw Error224ReporteC4;
        }else if (reportData.Code == 500){
            throw ErrorDesconocido;
        }
    }catch( error ){
        throw verificarErrores(error);
    }
}
export async function ActualizarCoordenadas( datos:any  ){
    try{
        //INDEV: Obtenemos el id del ciudadano
        let idCiudadano = await storageBaches.obtenerIdCiudadano();
        let idReporte = await storageBaches.obtenerIdReporteRosa();
        let Reporte = {
            Ubicacion:datos.Ubicacion_GPS,
            Cliente:CLIENTE,
            Ciudadano: idCiudadano,
            Direccion:datos.Direccion,
            Reporte:idReporte
        }
        let result = await service.ActualizarPocision(Reporte);
        let jsonResult = await result.json();
        console.log(jsonResult);
        return jsonResult.Estado;
    }catch( error ){
        console.log(error.message);
    }
}
export async function FinalizarRegistro( Contactos ){
    //NOTE: Obtenemos todos los datos de la db
    try{
        let jsonDatosPersonales = await storageBaches.obtenerDatosPersonalesPreregistro();
        let jsonDatosDomicilio = await storageBaches.obtenerDatosDomicilioPreRegistro();
        if( jsonDatosPersonales != null && jsonDatosDomicilio != null ){
            let jsonDatosContactos = JSON.stringify(Contactos);

            let DatosCiudadanos = {
                'Personales':jsonDatosPersonales,
                'Domicilio':jsonDatosDomicilio,
                'Contactos':jsonDatosContactos,
                'Cliente':CLIENTE
            }
            //NOTE: enviamos los datos a la API
            let respuesta = await service.RegistrarCiudadano(DatosCiudadanos);
            let jsonRespuesta = await respuesta.json();
            console.log(jsonRespuesta);
            if(jsonRespuesta.Code == 200){
                //NOTE: guardamos los datos del ciudadano
                let objetoPersonales = JSON.parse(jsonDatosPersonales);
                let valores = {
                    Nombre:objetoPersonales.Nombre,
                    ApellidoP:objetoPersonales.ApellidoP,
                    ApellidoM:objetoPersonales.ApellidoM,
                    CURP:objetoPersonales.CURP,
                    Email:objetoPersonales.Email,
                    Telefono:objetoPersonales.Telefono,
                    Password:objetoPersonales.Password
                }
                await storageBaches.guardarDatosCiudadanos(JSON.stringify(valores),jsonDatosDomicilio,jsonDatosContactos);
                await storageBaches.guardarIdCiudadano(String(jsonRespuesta.Ciudadano));
                return jsonRespuesta.Mensaje;
            }else if ( jsonRespuesta.Code == 403 ){
                return "-1";
                //throw ErrorC4UsuarioRegistrado;
            }else if ( jsonRespuesta.Code = 402 ){
                throw ErrorC4Registro;
            }
        }
    }catch( error ){
        console.log(error);
        throw verificarErrores(error);
    }
}
export async function IniciarSession( Credenciales ) {
    try{
        let datos = {
            'Curp':Credenciales.Curp,
            'Password':Credenciales.Password,
            'Cliente':CLIENTE
        }
        let data = await service.iniciarSessionCiudadano( datos );
        let Ciudadano = await data.json();
        console.log(Ciudadano);
        if( Ciudadano.Status ){
            storageBaches.guardarIdCiudadano(String(Ciudadano.id));
            storageBaches.guardarDatosPersonalesCiudadano(JSON.stringify(Ciudadano.Ciudadano));
            return Ciudadano;
        }else{
            throw userNotFound;
        }
    }catch( error ){
        throw verificarErrores(error);
    }
}
export async function actualiarDatosPersonales( datosPersonales:{ Nombre:String,ApellidoP:String,ApellidoM:String,CURP:String,Email:String,Telefono:String,Password:String} ){
    try{
        let ciudadano = await storageBaches.obtenerIdCiudadano();
        let datos = {
            'Cliente':String(CLIENTE),
            'Ciudadano':String(ciudadano),
            'Personales':JSON.stringify(datosPersonales)
        }
        let respuesta = await service.actualizarDatosPersonales(datos);
        let jsonRepuesta = await respuesta.json();
        console.log(jsonRepuesta);
        if(jsonRepuesta.Status){
            //NOTE: Guardamos los datos personales del ciudadano
            storageBaches.guardarDatosPersonalesCiudadano(datos.Personales);
            return true;
        }else{
            throw ErrorActualizarPersonales;
        }
    }catch( error ){
        console.log(error);
        throw verificarErrores(error);
    }
}
export async function obtenerDatosDomicilio(){
    try{
        let idCiudadano = await storageBaches.obtenerIdCiudadano();
        let datos = {
            'Cliente': CLIENTE,
            'Ciudadano':idCiudadano
        };
        let result = await service.obtenerDatosDomicilio(datos);
        let jsonResult = await result.json();
        if( jsonResult.Status ){
            return jsonResult.Datos[0];
        }else{
            throw ErrorDatosDomiclio;
        }
    }catch( error ){
        throw verificarErrores( error );
    }
}
export async function ActualizarDatosDomiclio( jsonDatos ){
    try {
        let idCiudadano = await storageBaches.obtenerIdCiudadano(); 
        let datos = {
            Cliente: CLIENTE,
            Ciudadano:parseInt(idCiudadano),
            DatosDomiclio: jsonDatos
        };
        let result = await service.actualizarDatosDomicilio( datos );
        let jsonResult = await result.json();
        console.log(jsonResult);
        if( jsonResult.Status ){
            console.log(jsonResult);
            return true;
        }else{
            throw ErrorActualizarDomiclio;
        }
    }catch(error){
        throw verificarErrores(error);
    }
}
export async function ObtenerDatosContacto(  ) {
    try {
        let idCiudadano = await storageBaches.obtenerIdCiudadano();
        let datos = {
            'Cliente':CLIENTE,
            'Ciudadano':parseInt(idCiudadano)
        };
        let result = await service.obtenerContactosCiudadano(datos);
        let jsonResult = await result.json();
        //NOTE: Guardamos los contactos 
        if(jsonResult.Status){
            return jsonResult.Data;
        }else{
            throw ErrorDatosContactos;
        }
    }catch( error ){
        console.log(error);
        throw verificarErrores(error);
    }
}
export async function ActualizarDatosContactos( Contactos,ids ){
    try{
        let idCiudadano = await storageBaches.obtenerIdCiudadano();
        let Datoscontactos = {
            UnoId:String(ids[0]).split(":")[1],
            UnoNombre:Contactos.UnoNombre,
            UnoTelefono:Contactos.UnoTelefono,
            UnoDireccion:Contactos.UnoDireccion,
            UnoEmail:Contactos.UnoEmail,
            DosId:String(ids[1]).split(":")[1],
            DosNombre:Contactos.DosNombre,
            DosTelefono:Contactos.DosTelefono,
            DosDireccion:Contactos.DosDireccion,
            DosEmail:Contactos.DosEmail
        }
        let datos = {
            'Cliente':CLIENTE,
            'Ciudadano':parseInt(idCiudadano),
            'Contactos':JSON.stringify(Datoscontactos)
        };
        let result = await service.actualizarDatosContactos( datos );
        let jsonResult = await result.json();
        console.log(jsonResult);
        if(jsonResult.Status){
            return true;
        }else{
            throw ErrorActualizatContactos;
        }
    }catch( error ){
        console.log(error);
        throw verificarErrores(error);
    }
}
export async function ActualiarRegistroCiudadano( Contactos ){
        //NOTE: Obtenemos todos los datos de la db
        try{
            let jsonDatosPersonales = await storageBaches.obtenerDatosPersonalesPreregistro();
            let jsonDatosDomicilio = await storageBaches.obtenerDatosDomicilioPreRegistro();
            if( jsonDatosPersonales != null && jsonDatosDomicilio != null ){
                let jsonDatosContactos = JSON.stringify(Contactos);
    
                let DatosCiudadanos = {
                    'Personales':jsonDatosPersonales,
                    'Domicilio':jsonDatosDomicilio,
                    'Contactos':jsonDatosContactos,
                    'Cliente':CLIENTE
                }
                //NOTE: enviamos los datos a la API
                let respuesta = await service.actualizarRegistro(DatosCiudadanos);
                let jsonRespuesta = await respuesta.json();
                if(jsonRespuesta.Status){
                     //NOTE: guardamos los datos del ciudadano
                    let objetoPersonales = JSON.parse(jsonDatosPersonales);
                    let valores = {
                        Nombre:objetoPersonales.Nombre,
                        ApellidoP:objetoPersonales.ApellidoP,
                        ApellidoM:objetoPersonales.ApellidoM,
                        CURP:objetoPersonales.CURP,
                        Email:objetoPersonales.Email,
                        Telefono:objetoPersonales.Telefono,
                        Password:objetoPersonales.Password
                    }
                    await storageBaches.guardarDatosCiudadanos(JSON.stringify(valores),jsonDatosDomicilio,jsonDatosContactos);
                    await storageBaches.guardarIdCiudadano(String(jsonRespuesta.Ciudadano));
                    return true;
                }else{
                    throw ErrorActualizarCiudadano;
                }
            }
        }catch( error ){
            throw verificarErrores(error);
        }
}
export async function  CancelarPeticion() {
    abort.abort();
}
export async function actualizarFoto(foto:String) {
    try{
        let idCiudadano = await storageBaches.obtenerIdCiudadano();
        let datos = {
            Cliente:String(CLIENTE),
            Ciudadano:parseInt(idCiudadano),
            Foto: foto
        }
        let respuesta = await service.actualizarFoto(datos);
        let jsonResult = await respuesta.json();
        console.log(jsonResult);
        if(jsonResult.code == 200){
            storageBaches.guardarDireccionFoto(jsonResult.Mensaje);
            return jsonResult.Mensaje;
        }else if( jsonResult.code == 203 ){
            console.log(jsonResult.Error);
            throw Error223ReporteC4;
        }else if(jsonResult.code ==  403 ){
            throw ErrorActualizarCiudadano;
        }
    }catch(err){
        throw verificarErrores(err);
    }
}
export async function obterFotoPerilAPI(){
    try{
        let datos = {
            'Cliente':CLIENTE,
            'Ciudadano': parseInt(await storageBaches.obtenerIdCiudadano())
        }
        let result = await service.cargarFoto(datos);
        let direccionFoto = await result.json();
        if(direccionFoto.code == 200 ){
            storageBaches.guardarDireccionFoto(direccionFoto.Ruta);
            return direccionFoto.Ruta;
        }else if(direccionFoto.code == 203){
            throw ErrorGetFotoPerfil;
        }else {
            return ErrorDesconocido;
        }
    }catch(error){
        console.log(error.message);
        throw verificarErrores(error);
    }
}
export async function ObtenerListaObservaciones( idReporte:number ){
    try{        
        let datos = {
            Cliente: CLIENTE,
            Reporte: idReporte
        };
        let result = await service.ObtenerObservaciones(datos);
        let respuestaAPI = await result.json();
        if(respuestaAPI.code == 200){
            return respuestaAPI.Mensaje;
        }else if( respuestaAPI.code == 203 ){
            console.log(respuestaAPI.Mensaje);
        }
    }catch( error ){
        throw verificarErrores(error);
    }
}
export async function enviarRepuestaObservacion( idObservacion:number, respuesta: string ){
    try{
        let datos = {
            Cliente: CLIENTE,
            idObservacion: idObservacion,
            Respuesta:respuesta
        }
        let result = await service.EnviarRepuesta(datos);
        let jsonResult = await result.json();
        console.log(jsonResult.code == 403);
        if(jsonResult.code == 200){
            return "OK";
        }else if( jsonResult.code == 203 ){
            throw ErrorEnviarRespuesta;
        }else if( jsonResult.code == 403 ){
            throw Error223ReporteC4;
        }
    }catch(error){
        throw verificarErrores(error);
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

