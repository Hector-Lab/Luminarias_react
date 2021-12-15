import * as SQLite from "expo-sqlite";
import AsyncStorage from '@react-native-async-storage/async-storage';
let db: SQLite.WebSQLDatabase;
const root = "@Storage:";
export class StorageService{
    createOpenDB () {
        db = SQLite.openDatabase("data.db");
    }
     createTables (){
        db.transaction((command)=>{
            //Ubicaci_on en json, ClaveLuminaria, Cliente,Estatus, Tipo, Latitud, Longitud, FechaTupla, ContratoVigente
            //d_Padr_on, id_Estado, Voltaje, Clasificaci_on, Tipo, Observaci_on, Evidencia fotos json, Fecha, Usuario
            command.executeSql(`create table if not exists Luminaria
                                (id integer primary key NOT NULL,
                                    Clave varchar,
                                    Ubicacion varchar, 
                                    Cliente integer,
                                    Tipo varchar,
                                    Latitud varchar,
                                    Longitud varchar,
                                    FechaTupla varchar,
                                    ContratoVigente varchar
                                    );
                                    create table if not exists HistorialLuminaria 
                                    (
                                        id integer primary key NOT NULL,
                                        Padron integer,
                                        Estado integer,
                                        Voltaje integer,
                                        Calsificacion varchar,
                                        Tipo integer,
                                        Observacion varchar,
                                        Evidencia varchar,
                                        Fecha varchar,
                                        Usuario integer
                                    );
                                    create table if not exists HistorialMedidores
                                    (
                                        id integer primary key NOT NULL,
                                        Padron integer,
                                        Estado integer,
                                        LecturaActual integer,
                                        LecturaAnterior integer,
                                        Consumo integer,
                                        Observacion varchar,
                                        Evidencia varchar,
                                        Fecha varchar,
                                        Usuario integer
                                    ) 
                                    `);
        },
        (error)=>{ console.log("Error al crear la base de datos: " + error.message )},
        ()=>{console.log("Creados correctamente!")});
    }


    //NOTE: metodos para guardar datos basicos de 
    public async setUser(user:string, name:string, token: string,cliente:string ){
        await AsyncStorage.setItem(root+"User",user);
        await AsyncStorage.setItem(root+"UserName",name);
        await AsyncStorage.setItem(root+"Token",token);
        await AsyncStorage.setItem(root+"Cliente",cliente);
        console.log("Datos almacenados");
    }
    public async getItem(key:string){
        return await AsyncStorage.getItem(root+key);
    }
}

