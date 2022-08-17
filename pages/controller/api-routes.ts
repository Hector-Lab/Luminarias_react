import { APIROUTE } from  './Variables';

export class APIServices {
    //NOTE: Modificar al nuevo formato
    ObtenerCatalogoAreas(data:any){
        let jsonData = JSON.stringify(data);
        return fetch(APIROUTE+"ClienteAreas",{
            method:'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body:jsonData
        });
    }
    RegistrarCiudadano( data:any ){
        let jsondata = JSON.stringify(data);
        return fetch(APIROUTE+"Registrar",{
            method:"POST",
            headers:{
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body:jsondata
        });
    }
    Reportar( date:any ){
        let jsondata = JSON.stringify(date);
        return fetch(APIROUTE+"Reportar",{
            method:"POST",
            headers:{
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body:jsondata
        });
    }
    Historial( date:any ){
        let jsondata = JSON.stringify( date );
        return fetch(APIROUTE+"Historial",{
            method:"POST",
            headers:{
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body:jsondata
        });
    }
    ObtenerCiudadano( datos:any ){
        let jsondata = JSON.stringify(datos);
        return fetch(APIROUTE+"ObtenerCiudadano",{
            method:"POST",
            headers:{
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },body:jsondata});
    }
    ActualizarCiudadano( datos:any ){
        let jsondata = JSON.stringify(datos);
        return fetch( APIROUTE+"ActualizarCiudadano",{
            method:"POST",
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },body:jsondata
        });
    }
    IniciarSesion( datos:any ){
        let jsondata = JSON.stringify( datos );
        return fetch( APIROUTE+"IniciarSesion",{
            method:"POST",
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },body:jsondata
        })
    }
}