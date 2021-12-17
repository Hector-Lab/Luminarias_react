import * as SQLite from "expo-sqlite";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CommonActions } from "@react-navigation/native";
import { registerCustomIconType } from "react-native-elements";
import { RefreshControlComponent } from "react-native";
let db: SQLite.WebSQLDatabase;
const root = "@Storage:";
export class StorageService{
    createOpenDB () {
        db = SQLite.openDatabase("data.db");
    }
     createTables (){
         //NOTE: tabla Luminaria
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
                                    );`);
        },
        (error)=>{ console.log("Error al crear la base de datos: " + error.message )},
        ()=>{console.log("Tabla luminaras creada")});
        //NOTE: Tabla HistorialLuminarias
        db.transaction((command)=>{
            command.executeSql(`create table if not exists HistorialLuminaria 
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
                                );`);
        },
        (error)=>{console.log("Error al crear la base de datos")},
        ()=>{console.log("Tabla Historial luminarias creada")});
        //NOTE: Tabla HistorialMedidores
        db.transaction((command)=>{
            command.executeSql(`create table if not exists HistorialMedidores
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
                                );`);
        },(error)=>{console.log("Mensaje de error" + error.message)},
        ()=>{console.log("Tabla Historial Medidores Creada")});
        //NOTE: Tabla Estado Fisico
        db.transaction((commad)=>{
            commad.executeSql(`create table if not exists EstadoFisico
                                (
                                    id integer primary key NOT NULL,
                                    clave integer,
                                    Descripcion varchar
                                )`);
        },(error)=>{console.log("Mensaje de error: " + error.message)},
        ()=>{console.log("Tabla Estado fisico creada")});
        //NOTE: Tabla Tipo de luminarias
        db.transaction((commad)=>{
            commad.executeSql(`create table if not exists TipoLuminaria 
                                (
                                    id integer primary key NOT NULL,
                                    clave integer,
                                    Descripcion varchar
                                )`);
        },(error)=>{console.log("Mensaje de error: " +error.message)},
        ()=>{console.log("Tabla Tipo Luminarias creada")});

    }
    insertarCatalogos( EstadoFisico: [], Luminaria: [] ){
        //NOTE: Insercion de catalogo estado fisico
        db.transaction((command)=>{
            EstadoFisico.map((item: { id:string,Descripci_on:string }, index:Number)=>{
                command.executeSql("INSERT INTO EstadoFisico (id,clave,Descripcion) VALUES (NULL,?,?)",[item.id,item.Descripci_on]);
            });
        },
        (err)=>{
           console.log("Hubo un error: " + err.message);
        },
        ()=>{
            console.log("Correto Estado Fisico");
        });
        //NOTE: Insercion de catalogo tipo luminaria
        db.transaction((command)=>{
            Luminaria.map((item:{id_Luminaria:string,Descripci_on:string},index:number)=>{
                command.executeSql("INSERT INTO TipoLuminaria (id,clave,Descripcion) VALUES (NULL,?,?)", [item.id_Luminaria,item.Descripci_on]);
            });
        },
        (err)=>{
            console.log("Hubo un error" + err.message);
        },
        ()=>{
            console.log("Correcto Luminarias");
        });
    }
    borrarDatos(tableName: string,){
        db.transaction((commad)=>{
            commad.executeSql("DELETE FROM " + tableName);
        },(error)=>{console.log("Error al elimnar la tabla" + error.message)},
        ()=>{console.log("Tabla eliminada: " + tableName)});
    }
    async leerLuminarias(){
        return new Promise((resolve,reject)=>{
            db.transaction((commad)=>{
                commad.executeSql("SELECT * FROM TipoLuminaria",[],
                (_,rows)=>{
                    let arrayDatos = new Array();
                    rows.rows._array.map((item,index)=>{
                        let data = {
                            clave: item.clave,
                            Descripcion: item.Descripcion
                        };
                        arrayDatos.push(data);
                    });
                    resolve(JSON.stringify(arrayDatos));});
            },(error)=>reject(error.message));
        });
    }
    leerEstadoFisco(){
        return new Promise((resolve,reject)=>{
            db.transaction((command)=>{
                command.executeSql("SELECT * FROM EstadoFisico",[],
                (_,rows)=>{
                    let arrayDatos = new Array();
                    rows.rows._array.map((item,index)=>{
                        let data = {
                            clave: item.clave,
                            Descripcion: item.Descripcion
                        };
                        arrayDatos.push(data);
                    });
                    resolve(JSON.stringify(arrayDatos));
                });
            },(error)=>{reject(error.message)});
        })
    }
    insertarLuminaria(data:any){
        return new Promise((resolve,reject)=>{
            let fecha = new Date();
            db.transaction((command)=>{
                command.executeSql(`INSERT INTO Luminaria (id,Clave,Ubicacion,Cliente,Tipo,Latitud,Longitud,FechaTupla,ContratoVigente) 
                VALUES(NULL,
                    ${data.Clave},
                    ${data.Ubicacion},
                    ${data.Cliente},
                    ${data.Tipo},
                    ${data.Latitud},
                    ${data.Longitud},
                    ${fecha.toLocaleDateString()},
                    ${data.Contrato}
                    )`,[data.Clave,data.Ubicacion,data.Cliente,data.Tipo,data.Latitud,data.Longitud,fecha.toLocaleDateString(),data.Contrato],()=>{resolve(true)});
            },(error)=>{reject(error.message + "Al guardar la luminaria")});
        });
    }
    insertarHistoriaLuminaria(data:any){
        return new Promise((resolve,reject)=>{
           let usuarios = this.getItem('User');
           let fecha = new Date();
            db.transaction((commad)=>{
                commad.executeSql(`INSERT INTO (id,Padron,Estado,Voltaje,Calsificacion,Tipo,Observacion,Evidencia,Fecha,Usuario) VALUES 
                (NULL,
                    ?,
                    ?,
                    ?,
                    ?,
                    ?,
                    ?,
                    ?,
                    ?,
                    ?)`,
                    ['-1',data.Estado,data.Voltaje,data.Calsificacion,data.Tipo,data.Observacion,data.Evidencia,fecha.toLocaleDateString(),usuarios],
                    ()=>{resolve(true)});
            },(error)=>{reject(error.message + "AL guardar la historia")});
        })
    }
    leerDBLuminarias(){
        db.transaction((command)=>{
            command.executeSql("SELECT * FROM Luminaria",[],(_,{rows})=>{
                console.log(rows);
            });
        });
    }

        //NOTE: metodos para guardar datos basicos de ,
        public async setUser(user:string, name:string, token: string,cliente:string ){
            await AsyncStorage.setItem(root+"User",user);
            await AsyncStorage.setItem(root+"UserName",name);
            await AsyncStorage.setItem(root+"Token",token);
            await AsyncStorage.setItem(root+"Cliente",cliente);
        }
        public async getItem(key:string){
            return await AsyncStorage.getItem(root+key);
        }
}

