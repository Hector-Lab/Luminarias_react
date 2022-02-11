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
    ObtenerCatalogoAreas(data:any){
        let jsonData = JSON.stringify(data);
        return fetch("https://api.servicioenlinea.mx/api-movil/ObtenerCatalogo",{
            method:'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body:jsonData
        });
    }
    ObtenerMunicipios(){
        return fetch("https://api.servicioenlinea.mx/api-movil/Municipios",{
            method:'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
        });
    }
    insertarCiudadano( data:any ){
        let jsonData = JSON.stringify(data);
        return fetch("https://api.servicioenlinea.mx/api-movil/RegistrarCiudadano",{
            method:"POST",
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body:jsonData
        });
    }
    insertarReporte( data:any ){
        let jsonData = JSON.stringify(data);
        return fetch(`https://api.servicioenlinea.mx/api-movil/GuardarReporte`,{
            method:"POST",
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body:jsonData
        })
    }
    obtenerreportesCiudadano ( data:any ){
        let jsonData = JSON.stringify(data);
        return fetch(`https://api.servicioenlinea.mx/api-movil/ListaReportes`,{
            method:"POST",
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body:jsonData
        });
    }
    recuperarDatosCiudadano( data:any ){
        let jsonData = JSON.stringify(data);
        return fetch(`https://api.servicioenlinea.mx/api-movil/DatosCiudadano`,{
            method:"POST",
            headers:{
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body:jsonData
        });
    }
    editarDatosCiudadano( data:any ){
        let jsonData = JSON.stringify(data);
        return fetch('https://api.servicioenlinea.mx/api-movil/EditarContactoCiudadano',{
            method:"POST",
            headers:{
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body:jsonData
        });
    }
    ObtenerReporte (data: any){
        let jsonData = JSON.stringify(data);
        return fetch(`https://api.servicioenlinea.mx/api-movil/RefrescarReporte`,{
            method:"POST",
            headers:{
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body:jsonData
        });
    }
    VerificaToken (data: any){
        let jsonData = JSON.stringify(data);
        return fetch('https://api.servicioenlinea.mx/api-movil/VerificaSession',{
            method: "POST",
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization':"Bearer " + token
            },
            body:jsonData
        })
    }
}