import { CommonActions, ServerContainer } from '@react-navigation/native';
import { APIServices } from '../controller/api-routes';
import { StorageService } from '../controller/storage-controller';
const service = new APIServices();
const storage = new StorageService();
const networkError = new Error("Favor de verificar la conexion a internet");
const userNotFound = new Error("Usuario o Contraseña Incorrectos");
export async function Auth(user:string,pass:string){
    //Creamos la base de datos
    storage.createOpenDB();
    storage.createTables();
    storage.borrarDatos("EstadoFisico");
    storage.borrarDatos("TipoLuminaria");
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
    if(connection){ //NOTE: Se envia directo al API
        let valid = VerificarDatosLuminaria(data);
        if(valid != ""){
            throw new Error(valid);
        }
        let token = await storage.getItem("Token");
        console.log(token);
        let encodeResult = await service.insertarLuminaria(data,String(token));
        let decodeResult = await encodeResult.json();
        return decodeResult;

    }else{ //NOTE: Se Envia a la base de datos

    }
}

//NOTE: metodo internos
function verificarErrores(error:Error) {
    let message = error.message;
    if(message.includes("Usuario")){
        return userNotFound;
    }
    return networkError;
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
    /*
                    "Clave" => "required|string",
                    "Cliente" => "required",
                    "Latitud" => "required|string",
                    "Longitud" => "required|string",
                    "Voltaje" => "required|string",
                    "Calsificacion" => "required|string",
                    "Tipo" => "required|string",
                    #"Evidencia" =>"required|string",  //Arreglo de fotos
                    "Fecha" => "required|string",
                    "Usuario" => "required|string",
                    "LecturaActual" => "required|string",
                    "LecturaAnterior" => "required|string",
                    "Consumo" => "required|string",
                    "Estado" => "required|string",
    */
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
   return errores;
}