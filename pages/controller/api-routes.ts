import { readAsStringAsync } from "expo-file-system";

export class APIServices {
    
    login (data: any){
        let jsonData = JSON.stringify(data);
        return fetch("https://api.servicioenlinea.mx/api-movil/login-luminarias",
        {
            method:'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body:jsonData
        }
        );
    }

    verificarRol (data:any,token:string){
        let jsonData = JSON.stringify(data);
        return fetch("https://api.servicioenlinea.mx/api-movil/verificarDatos",
        {
            method:'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization':"Bearer " + token
            },
            body:jsonData
        });
    }
    verificarRolBaches(data:any,token:string){
        let jsonData = JSON.stringify(data);
        //verificarRolBaches
        return fetch("https://api.servicioenlinea.mx/api-movil/verificarRolBaches",{
            method:'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization':"Bearer " + token
            },
            body:jsonData
        });
    }
    catalogoLuminarias(data:any,token:string){
        let jsonData = JSON.stringify(data);
        //ObtenerCatalogosLuminarias
        return fetch("https://api.servicioenlinea.mx/api-movil/ObtenerCatalogosLuminarias",
        {
            method:'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization':"Bearer " + token
            },
            body:jsonData
        });

    }
    insertarLuminaria (data:any, token:string){
        let jsonData = JSON.stringify(data);
        return fetch("https://api.servicioenlinea.mx/api-movil/GuardarLuminaria",
        {
            method:'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization':"Bearer " + token
            },
            body:jsonData
        }
        );

    }
    obtenerLuminarias (data:any, token:string){
        let jsonData = JSON.stringify(data);
        return fetch("https://api.servicioenlinea.mx/api-movil/CargarHistorialLuminaria",{
            method:'POST',
            headers:{
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization':"Bearer " + token
            },
            body:jsonData
        })
    }
    obtenerMedidores(data:any,token:string){
        let jsonData = JSON.stringify(data);
        return fetch("https://api.servicioenlinea.mx/api-movil/CargarHistorialMedidor",{
            method: 'POST',
            headers:{
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization':"Bearer " + token
            },
            body:jsonData
        });

    }
}