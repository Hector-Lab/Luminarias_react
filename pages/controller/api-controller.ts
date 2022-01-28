import { APIServices } from '../controller/api-routes';
import { StorageService } from '../controller/storage-controller';
import { StorageBaches } from '../controller/storage-controllerBaches';
const service = new APIServices();
const storage = new StorageService();
const storageBaches = new StorageBaches();
const networkError = new Error("Sin acceso a interner");
const userNotFound = new Error("Usuario o Contraseña Incorrectos");
const curpUtilizada = new Error("Ciudadano ya registrado");
const usuarioNoValido = new Error("");
const usuarioNoEncontrado = new Error("Ciudadano no econtrado\nFavor de registrarse para continuar");
const ErrorDesconocido = new Error("Error desconocido");
const SinCambios = new Error("OK"); 
const ErrorInsertar = new Error("Error al registrar el reporte\nFavor de intentar mas tarde");
const NoRowSelect = new Error("Aún no tiene registros");
const ErrorLista = new Error("Error al obtener el historial\nFavor de intentar mas tarde");
export async function Auth(user:string,pass:string){
    //Creamos la base de datos
    let cliente = {
        'usuario': user,
        'passwd': pass
    };
    try{
        let data = await service.login(cliente);
        let jsonData =  await data.json();
        if(jsonData != null || jsonData != undefined){
            if(!jsonData['Status']){
                throw userNotFound;
            }else{
                let usuario = {
                    Usuario: jsonData['idUsuario']+"",
                    Cliente: jsonData['cliente']
                };
                //Verificamos roles
                let result = await verificamosRoles(usuario,jsonData['token']);
                console.log(result);
                if(result != -1){
                    await storage.setUser(jsonData['idUsuario']+"",jsonData['datosUsuario']['NombreCompleto'],jsonData['token'],jsonData['cliente']);
                }
                return result;
            }
        }else{
            return false;
        }
    }catch(error){
        throw verificarErrores(error); 
    }
}
export async function CatalogoLuminarias() {
    let token = await storage.getItem("Token");
    let cliente = await storage.getItem("Cliente");
    console.log(cliente);
    if( token != null ){
        let data = {
            Cliente : cliente
        };
        let catalogos = await service.catalogoLuminarias(data,String(token));
        let catalogoJson = await catalogos.json();
        storage.insertarCatalogos(catalogoJson['EstadoFisico'],catalogoJson['TipoLuminaria']);
    }else{
        console.log("El token es nulo");
    }
}
export async function GuardarLuminaria(data:any, connection: any ){
    let valid = VerificarDatosLuminaria(data);
    if(valid != ""){
        throw new Error(valid);
    }
    let token = await storage.getItem("Token");
    try{
        if(connection){ //NOTE: Se envia directo al API
            let encodeResult = await service.insertarLuminaria(data,String(token));
            let decodeResult = await encodeResult.json();
            return decodeResult;
    
        }else{ //NOTE: Se Envia a la base de datos
            console.log("Sin conexion");
            let resultLumianria = await storage.insertarLuminaria(data);
            let resultHistoria = await storage.insertarHistoriaLuminaria(data);
            return resultLumianria && resultHistoria;
        }
    }catch(error){
        console.log(error.message);
    }
}
export async function GuardarHistoriaLuminaria(data:any, connection: any) {
    let valid = VerificarDatosLuminaria(data);
    if(valid != "")
    throw new Error(valid);
    let token = await storage.getItem("Token");
    try{
        if(connection){//NOTE: se evia directo al api

        }else{ //se envia al storage 
            console.warn("Sin conexion");
            return await storage.insertarHistoral(data); 

        }
    }catch(error){
        throw verificarErrores(error);
    }
}
export async function ClavesLuminarias(){
    storage.createOpenDB();
    let cliente = await storage.getItem("Cliente");
    let token = await storage.getItem("Token");
    try{
        let data = {
            Cliente: String(cliente),
        };
        let rawData = await service.obtenerLuminarias(data,String(token));
        let result = await rawData.json();
        if(result['Status']){
            storage.insertarClavesLuminaria(result['result']);
        }
    }catch(error){
        return verificarErrores(error);
    }
}
export async function ClavesMedidor() {
    storage.createOpenDB();
    let cliente = await storage.getItem("Cliente");
    let token = await storage.getItem("Token");
    try{
        let data = {
            Cliente:String(cliente)
        };
        let rawData = await service.obtenerMedidores(data,token);
        let result = await rawData.json();
        if(result['Status']){
            console.log(result);
            storage.insertClavesMedidores(result['result']);
        }else{
            console.log("Sin datos que descargar");
        }
    }catch(error){
        return verificarErrores(error);
    }
}
//INDEV: Nuevas funciones para la aplicacion de los baches
export async function CatalogoSolicitud(){
    let cliente = await storage.getItem("Cliente");
    let data = {
        Cliente: cliente == null ? "56" : cliente 
    };
    let rawData = await service.ObtenerCatalogoAreas(data);
    let result = await rawData.json();
    return result.Catalogo;
}
export async function ObtenerMunicipios(){
    let rawData = await service.ObtenerMunicipios();
    let municipios = await rawData.json();
    if(municipios.Status){
        return municipios.Catalogo;
    }
}
export async function RegistrarCiudadano( ciudadadano:any ){
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
        if(jsonData.Code == 200){
            return true;
        }else if(jsonData.Code == 404 || jsonData.Code == 403 ){
            throw ErrorInsertar;
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
            console.log(datos);
            let rawData = await service.obtenerreportesCiudadano(datos);
            let jsonData = await rawData.json();
            
            console.log(jsonData);
            if(jsonData.Code == 200){
                return jsonData.Mensaje;
            }else if(jsonData.Code == 404){
                throw NoRowSelect;
            }else if (jsonData.Code == 403){
                throw ErrorLista;
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
        console.log(ciudadano.Code == 200 + " - " +ciudadano.Code);
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
        console.log(ciudadanoDatos);
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
            console.log(reportData);
            if(reportData.code == 200){
                console.log("Todo esta bien");
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
//NOTE: metodo internos
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
async function  verificamosRoles(usuario:{Usuario:string, Cliente:string},token:string){
    let type = -1; //NOTE: -1: usuario no valido, 0: luminarias, 1:Baches
    //Esto para verificar el rol de luminarias
    let luminariasValid = await service.verificarRol(usuario,token); 
    let userLuminaria = await luminariasValid.json();
    if(userLuminaria['Mensaje'].length > 0){
        userLuminaria['Mensaje'][0]['Estatus'] == "1" ? type = 0 : type = -1;
        if(type = 0){
            return type;
        }
    }
    //Esto para verificar el rol de los baches
    let bachesValid = await service.verificarRolBaches(usuario,token);
    let userBaches = await bachesValid.json();
    if(userBaches['Mensaje'].length > 0){
        userBaches['Mensaje'][0]['Estatus'] == "1" ? type = 1 : type = -1;
    }
    return type;
}
function VerificarDatosLuminaria(data:any){
    let errores = "";
   if(String(data.Clave) == ""){
        errores += "C,";
   }
   if(String(data.Voltaje) == ""){
       errores += "V,";
   }
   if(String(data.Calsificacion) == ""){
       errores += "CL,";
   }
   if(String(data.Tipo) == ""){
       errores += "T,"
   }
   if(String(data.EstadoFisico) == ""){
       errores += "E,"
   }
   if(data.Evidencia.length == 0){
        errores += "EV,"
   }
   return errores;
}

