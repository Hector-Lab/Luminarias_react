import * as SQLite from "expo-sqlite";
import AsyncStorage from '@react-native-async-storage/async-storage';
let db: SQLite.WebSQLDatabase;
const root = "@Storage:";

export class StorageBaches {
    //NOTE: Bloque de datos para guardar la lista
    async guardarListaTemas(){

    }

    async guardarIdCiudadano(idCliente: string) {
        await AsyncStorage.setItem(root + "idCiudadano", idCliente);
    }
    async obtenerIdCiudadano() {
        return await AsyncStorage.getItem(root + "idCiudadano");
    }
    async obtenerCliente() {
        let cliente = "";
        let usuario = await AsyncStorage.getItem(root + "Persona");
        if (usuario != null) {
            let objectUsuario = JSON.parse(usuario);
            cliente = objectUsuario.Cliente;
        }
        return cliente;
    }
    async obtenerDatosPersona() {
        let persona = await AsyncStorage.getItem(root + "Persona");
        return persona;
    }
    async borrarDatosCiudadano() {
        await AsyncStorage.removeItem(root + "Persona");
    }
    async setModoPantallaDatos(tipo: string) {
        await AsyncStorage.setItem(root + "TipoPantalla", tipo);
    }
    async getModoPantallaDatos() {
        return await AsyncStorage.getItem(root + "TipoPantalla");
    }
    async setCondicionesPrivacidad(aceptar: string) {
        await AsyncStorage.setItem(root + "Privacidad", aceptar);
    }
    async getCondicionesProvacidad() {
        return await AsyncStorage.getItem(root + "Privacidad");
    }
    async guardarIdReporteRosa(idReporte: string) {
        await AsyncStorage.setItem(root + "ReporteRosa", idReporte);
    }
    async obtenerIdReporteRosa() {
        return await AsyncStorage.getItem(root + "ReporteRosa");
    }
    //NOTE: Bloque de datos del preregistor
    async datosPersonalesPreRegistro(Personales: string) {
        return await AsyncStorage.setItem(root + "PersonalesPreregistro", Personales);
    }
    async datosDomicilioPreRegistro(Domicilio: string) {
        return await AsyncStorage.setItem(root + "DomicilioPreregistro", Domicilio);
    }
    async obtenerDatosPersonalesPreregistro() {
        return await AsyncStorage.getItem(root + "PersonalesPreregistro");
    }
    async obtenerDatosDomicilioPreRegistro() {
        return await AsyncStorage.getItem(root + "DomicilioPreregistro");
    }
    async guardarDatosCiudadanos(Personales: string, Domicilio: string, Contactos: string) {
        await AsyncStorage.setItem(root + "DatosPersonales", Personales);
        await AsyncStorage.setItem(root + "DatosDomicilio", Domicilio);
        await AsyncStorage.setItem(root + "DatosContacto", Contactos);
    }
    async verificarDatosCiudadano() { 
        return ( await AsyncStorage.getItem(root + "DatosPersonales") != null && await AsyncStorage.getItem(root+"idCiudadano") != null );
    }
    async cerrarSsesion(){
        await AsyncStorage.multiRemove([root + "DatosPersonales",root + "DatosDomicilio",root + "DatosContacto"]);
    }
    async ObtenerPerfilCiudadano(){
        let jsonCiudadano = await AsyncStorage.getItem(root + "DatosPersonales");
        let objectCiudadano = JSON.parse(jsonCiudadano);
        //console.log(idCiudadano);
        return [objectCiudadano.Nombre + " " + objectCiudadano.ApellidoP + " "+objectCiudadano.ApellidoM ,objectCiudadano.Email];
    }
    async guardarDatosPersonalesCiudadano( Personales ){
        await AsyncStorage.setItem(root + "DatosPersonales", Personales);
    }
    async obtenerDatosPersonalesCiudadano( ){
        return await AsyncStorage.getItem(root + "DatosPersonales");
    }
}
