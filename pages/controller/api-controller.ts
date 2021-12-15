import { CommonActions } from '@react-navigation/native';
import { APIServices } from '../controller/api-routes';
const service = new APIServices();
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
                //INDEV: Verificamos el rol del sujeto
                let usuario = {
                    Usuario: jsonData['idUsuario']+"",
                    Cliente: jsonData['cliente']
                };
                let valid = await service.verificarRol(usuario,jsonData['token']);
                let validJSON = await valid.json();
                return validJSON['Mensaje'][0]['Estatus'] == "1";
            }
        }else{
            return false;
        }
    }catch(error){
        throw verificarErrores(error); 
    }
    //Guardamos los datos basicos del usuario nombre, cliente, idUsuario, token

    function verificarErrores(error:Error) {
        let message = error.message;
        console.log(message);
        if(message.includes("Usuario")){
            return userNotFound;
        }
        return networkError;
    }
}