import { readAsStringAsync } from "expo-file-system";

export class APIServices {
    
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
    
}