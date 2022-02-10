import * as SQLite from "expo-sqlite";
import AsyncStorage from '@react-native-async-storage/async-storage';
let db: SQLite.WebSQLDatabase;
const root = "@Storage:";

export class StorageBaches {
    createOpenDB () {
        db = SQLite.openDatabase("baches.db");
        this.createTablasBaches();    
    }
    createTablasBaches(){
        db = SQLite.openDatabase("baches.db");
        db.transaction((commad)=>{
            commad.executeSql(`create table if not exists CatalogoClientes 
                                (
                                    id integer primary key NOT NULL,
                                    Municipio varchar,
                                    Estado varchar,
                                    Cliente integer
                                )`);
        },
        (error)=>{console.log(error)},
        ()=>{console.log("Tabla Creada")});
    }
    LimpiarTabla( table: String ){
        db = SQLite.openDatabase("baches.db");
        db.transaction((command)=>{
            command.executeSql(`DELETE FROM ${table}`,[],(_,rows)=>{ console.log( "Registros Eliminados: " + rows.rowsAffected);})
        });
    }
    InsertarMunicipios( Municipios: [] ){
        db = SQLite.openDatabase("baches.db");
        return new Promise((resolve,reject )=>{
            Municipios.map((item: any,index)=>{
                db.transaction((command)=>{
                    command.executeSql(`INSERT INTO CatalogoClientes (id,Municipio,Estado,Cliente) VALUES (null,?,?,?)`,[item.Municipio,item.Nombre,item.id])
                },(error)=>{reject(error.message)},()=>{resolve(true)});
            });
        });
    }
    ObtenerMunicipiosDB(){
        db = SQLite.openDatabase("baches.db");
        return new Promise((resolve,reject)=>{
            db.transaction((commad)=>{
                let arreglosDatos = [];
                commad.executeSql(`SELECT * FROM CatalogoClientes`,[],
                (_,{rows})=>{
                    rows._array.map((item,index)=>{
                        let municipio = {
                            "Municipio": item.Municipio,
                            "Nombre": item.Estado,
                            "id": item.Cliente
                        };
                        arreglosDatos.push(municipio);
                    })
                    resolve(arreglosDatos);
                });
            },(error)=>{reject("Error: " + error.message)})
        })
    }
    //NOTE: metodos del async storage
    async GuardarDatosPersona ( Persona: 
        {  
            curp:string,
            Nombres:string,
            Paterno:string,
            Materno: string,
            Telefono:string,
            Email: string,
            Cliente: string,
            rfc:string }) {
        let jsonPersona = JSON.stringify(Persona);
        await AsyncStorage.setItem(root+"Persona", jsonPersona); 
    }
    async guardarIdCiudadano( idCliente:string ){
        console.log(idCliente);
        await AsyncStorage.setItem(root+"idCiudadano",idCliente);
    }
    async obtenerIdCiudadano(){
        return await AsyncStorage.getItem(root+"idCiudadano");
    }
    async obtenerCliente(){
        let cliente = "";
        let usuario = await AsyncStorage.getItem(root+"Persona");
        if(usuario != null){
            let objectUsuario = JSON.parse(usuario);
            cliente = objectUsuario.Cliente;
        }
        return cliente;

    }
    async obtenerDatosPersona(){
        let persona = await AsyncStorage.getItem( root+"Persona" );
        return persona;
    }
    async borrarDatosCiudadano(){
        await AsyncStorage.removeItem(root+"Persona");
    }
    async setModoPantallaDatos( tipo: string ){
        await AsyncStorage.setItem( root+"TipoPantalla", tipo);
    }
    async getModoPantallaDatos( ){
        return await AsyncStorage.getItem( root+"TipoPantalla" );
    }
}
