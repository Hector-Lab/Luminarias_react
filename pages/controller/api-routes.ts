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
    insertarReporteC4( data:any ){
        let jsonData = JSON.stringify(data);
        return fetch("https://api.servicioenlinea.mx/api-movil/ReporteC4/Reportar",{
            method:"POST",
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body:jsonData
        });
    }
    realizarBotonRosa( data:any ){
        let jsonData = JSON.stringify(data);
        return fetch("https://api.servicioenlinea.mx/api-movil/ReporteC4/BotonRosa",{
            method:"POST",
            headers:{
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body:jsonData
        });
    }
    ActualizarPocision ( data:any ){
        let jsonData = JSON.stringify( data );
        return fetch('https://api.servicioenlinea.mx/api-movil/ReporteC4/ActualizarCoordenadas',{
            method:"POST",
            headers:{
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body:jsonData
        });
    }
    RegistrarCiudadano ( datosCiudadanos: any ){
        let jsonData =  JSON.stringify(datosCiudadanos);
        return fetch('https://api.servicioenlinea.mx/api-movil/ReporteC4/RegistrarCiudadano',{
            method:"POST",
            headers:{
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body:jsonData
        });
    }
    iniciarSessionCiudadano( data:any ){
        let jsonData = JSON.stringify(data);
        return fetch('https://api.servicioenlinea.mx/api-movil/ReporteC4/LoginReportes',{
            method:"POST",
            headers:{
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body:jsonData
        });
    }
    
}