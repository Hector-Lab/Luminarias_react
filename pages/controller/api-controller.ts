import { APIServices } from '../controller/api-routes';
const service = new APIServices();

export async function Auth(user:string,pass:string){
    let cliente = {
        'usuario': user,
        'passwd': pass
    };
    let data = await service.login(cliente);
    let jsonData =  await data.json();
    console.log(jsonData);
}