import * as SQLite from "expo-sqlite";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { date } from "yup/lib/locale";
let db: SQLite.WebSQLDatabase;
const root = "@Storage:";
let Fecha = new Date();

export class StorageBaches {
    
    //NOTE: Bloque de datos para guardar la lista
    async guardarListaTemas( catalogoTemas:string ){
        await AsyncStorage.setItem(root+"Temas",catalogoTemas);
    }
    async obtenerCatalogoTemas(){
        return await AsyncStorage.getItem(root+"Temas");
    }
    async guardarIdCiudadano(idCliente: string) {
        await AsyncStorage.setItem(root + "idCiudadano", idCliente);
    }
    async obtenerIdCiudadano() {
        return await AsyncStorage.getItem(root + "idCiudadano");
    }
    async guardarFechaActualizacionCatalogoTema(){
        let actual = Fecha.toLocaleDateString();
        await AsyncStorage.setItem(root+"FActualizacion",actual);
    }
    async CatalogoTemaActualizado(){
        let fecha = await AsyncStorage.getItem(root+"FActualizacion");
        if(fecha != null){
            //NOTE: calculamos los datos
            let fechaActual =  Fecha.toLocaleDateString()
            return !(fecha == fechaActual);
        }else {
            return true;
        }
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
    async getCondicionesPrivacidad() {
        return await AsyncStorage.getItem(root + "Privacidad");
    }
    async guardarIdReporteRosa(idReporte: string) {
        await AsyncStorage.setItem(root + "ReporteRosa", idReporte);
    }
    async obtenerIdReporteRosa() {
        return await AsyncStorage.getItem(root + "ReporteRosa");
    }
    async guardarDireccionFoto(url:string){
        await AsyncStorage.setItem(root + "Foto",url);
    }
    async obtenerDireccionFoto(){
        return await AsyncStorage.getItem(root + "Foto");
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
        return ( await AsyncStorage.getItem(root+"idCiudadano") != null );
    }
    async cerrarSsesion(){
        await AsyncStorage.multiRemove([root + "DatosPersonales",root + "DatosDomicilio",root + "DatosContacto",root+"Foto",root+"idCiudadano"]);
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
    async guardarDatosCamara( Imagen:string, Coordenadas:string, Direccion:string  ){
        await AsyncStorage.setItem(root+"Imagen",Imagen);
        await AsyncStorage.setItem(root+"Coordenadas",Coordenadas);
        await AsyncStorage.setItem(root+"Direccion",Direccion);
    }
    async obtenerDatosCamara(){
        let datos = {
            Imagen: await AsyncStorage.getItem(root+"Imagen"),
            Coordenadas: await AsyncStorage.getItem(root+"Coordenadas"),
            Direccion: await AsyncStorage.getItem(root+"Direccion")
        };
        return datos;
    }
    async limpiarDatosCamara(  ){
        await AsyncStorage.removeItem(root+"Imagen");
        await AsyncStorage.removeItem(root+"Coordenadas");
        await AsyncStorage.removeItem(root+"Direccion");
    }
    async eliminarElemento( index:string ) {
        await AsyncStorage.removeItem( root+index );
    }
    async asignarRegresoHistorial( tipoMenu:string ){
        await AsyncStorage.setItem( root+"tipoMenu",tipoMenu );
    }
    async obtenerRegresoHistorial( ){
        return AsyncStorage.getItem( root+"tipoMenu" );
    }
}

