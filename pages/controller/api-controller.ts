import { CommonActions, ServerContainer } from '@react-navigation/native';
import { APIServices } from '../controller/api-routes';
import { StorageService } from '../controller/storage-controller';
const service = new APIServices();
const storage = new StorageService();
const networkError = new Error("Favor de verificar la conexion a internet");
const userNotFound = new Error("Usuario o Contraseña Incorrectos");
export async function Auth(user:string,pass:string){
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

function verificarErrores(error:Error) {
    let message = error.message;
    console.log(message);
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
    console.log();
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