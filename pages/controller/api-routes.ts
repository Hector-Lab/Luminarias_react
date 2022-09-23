import { readAsStringAsync } from "expo-file-system";
import { object } from "yup/lib/locale";

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
    insertarReporte( data:any, abort:AbortController ){
        let jsonData = JSON.stringify(data);
        return fetch(`https://api.servicioenlinea.mx/api-movil/GuardarReporte`,{
            method:"POST",
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body:jsonData,
            signal:abort.signal
        });
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
    actualizarDatosPersonales( data:any ){
        let jsonData = JSON.stringify(data);
        return fetch('https://api.servicioenlinea.mx/api-movil/ReporteC4/ActualizarDatosPersonales',{
            method:"POST",
            headers:{
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body:jsonData
        });
    }
    obtenerDatosDomicilio( data:any ){
        let jsonData = JSON.stringify(data);
        return fetch(`https://api.servicioenlinea.mx/api-movil/ReporteC4/DatosDomicilio`,{
            method:"POST",
            headers:{
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body:jsonData
        });
    }
    actualizarDatosDomicilio( data:any ){
        let jsonData = JSON.stringify(data);
        return fetch(`https://api.servicioenlinea.mx/api-movil/ReporteC4/ActualizarDomicilio`,{
            method:"POST",
            headers:{
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body:jsonData
        });
    }
    obtenerContactosCiudadano(data:object){
        let jsonData = JSON.stringify(data);
        return fetch(`https://api.servicioenlinea.mx/api-movil/ReporteC4/DatosContacto`,{
            method:"POST",
            headers:{
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body:jsonData
        });
    }
    actualizarDatosContactos( data:object ){
        let jsonData = JSON.stringify(data);
        return fetch(`https://api.servicioenlinea.mx/api-movil/ReporteC4/ActualizarDatosContacto`,{
            method:"POST",
            headers:{
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body:jsonData
        });
    }
    actualizarRegistro( data:object ){
        let jsonData = JSON.stringify(data);
        return fetch(`https://api.servicioenlinea.mx/api-movil/ReporteC4/ActualizarCiudadano`,{
            method:"POST",
            headers:{
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body:jsonData
        });
    }
    actualizarFoto( data:object ){
        let jsonData =  JSON.stringify(data);
        return fetch(`https://api.servicioenlinea.mx/api-movil/AtencionCliente/ActualizaFoto`,{
            method:"POST",
            headers:{
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body:jsonData
        });
    }
    //NOTE: para obtener la foto de los empleados
    cargarFoto( data:object ){
        let jsonData =  JSON.stringify(data);
        return fetch(`https://api.servicioenlinea.mx/api-movil/AtencionCliente/FotoPerfil`,{
            method:"POST",
            headers:{
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body:jsonData
        });
    }
    ObtenerObservaciones( data:object  ){
        let jsonData = JSON.stringify(data);
        return fetch('https://api.servicioenlinea.mx/api-movil/AtencionCliente/Observaciones',{
            method:"POST",
            headers:{
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body:jsonData
        });
    }
    EnviarRepuesta( data:object ){
        let jsonData = JSON.stringify(data);
        return fetch('https://api.servicioenlinea.mx/api-movil/AtencionCliente/Responder',{
            method:"POST",
            headers:{
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body:jsonData
        });
    }
}