import * as SQLite from "expo-sqlite";
import AsyncStorage from '@react-native-async-storage/async-storage';
let db: SQLite.WebSQLDatabase;
const root = "@Storage:";

export class StorageBaches {
    createOpenDB() {
        db = SQLite.openDatabase("baches.db");
        this.createTablasBaches();
    }
    createTablasBaches() {
        db = SQLite.openDatabase("baches.db");
        db.transaction((commad) => {
            commad.executeSql(`create table if not exists CatalogoClientes 
                                (
                                    id integer primary key NOT NULL,
                                    Municipio varchar,
                                    Estado varchar,
                                    Cliente integer
                                )`);
        },
            (error) => { console.log(error) },
            () => { console.log("Tabla Creada") });
    }
    LimpiarTabla(table: String) {
        db = SQLite.openDatabase("baches.db");
        db.transaction((command) => {
            command.executeSql(`DELETE FROM ${table}`, [], (_, rows) => { console.log("Registros Eliminados: " + rows.rowsAffected); })
        });
    }
    InsertarMunicipios(Municipios: []) {
        db = SQLite.openDatabase("baches.db");
        return new Promise((resolve, reject) => {
            Municipios.map((item: any, index) => {
                db.transaction((command) => {
                    command.executeSql(`INSERT INTO CatalogoClientes (id,Municipio,Estado,Cliente) VALUES (null,?,?,?)`, [item.Municipio, item.Nombre, item.id])
                }, (error) => { reject(error.message) }, () => { resolve(true) });
            });
        });
    }
    ObtenerMunicipiosDB() {
        db = SQLite.openDatabase("baches.db");
        return new Promise((resolve, reject) => {
            db.transaction((commad) => {
                let arreglosDatos = [];
                commad.executeSql(`SELECT * FROM CatalogoClientes`, [],
                    (_, { rows }) => {
                        rows._array.map((item, index) => {
                            let municipio = {
                                "Municipio": item.Municipio,
                                "Nombre": item.Estado,
                                "id": item.Cliente
                            };
                            arreglosDatos.push(municipio);
                        })
                        resolve(arreglosDatos);
                    });
            }, (error) => { reject("Error: " + error.message) })
        })
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
