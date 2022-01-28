import * as SQLite from "expo-sqlite";
import AsyncStorage from '@react-native-async-storage/async-storage';
let db: SQLite.WebSQLDatabase;
const root = "@Storage:";
export class StorageService{
    createOpenDB () {
        db = SQLite.openDatabase("data.db");
    }
    createTables (){
         //NOTE: tabla Luminaria
        db.transaction((command)=>{
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
        ()=>{});
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
        ()=>{});
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
        ()=>{});
        //NOTE: Tabla Estado Fisico
        db.transaction((commad)=>{
            commad.executeSql(`create table if not exists EstadoFisico
                                (
                                    id integer primary key NOT NULL,
                                    clave integer,
                                    Descripcion varchar
                                )`);
        },(error)=>{console.log("Mensaje de error: " + error.message)},
        ()=>{});
        //NOTE: Tabla Tipo de luminarias
        db.transaction((commad)=>{
            commad.executeSql(`create table if not exists TipoLuminaria 
                                (
                                    id integer primary key NOT NULL,
                                    clave integer,
                                    Descripcion varchar
                                )`);
        },(error)=>{console.log("Mensaje de error: " +error.message)},
        ()=>{});
        //NOTE: Tabla Tipo de luminarias
        db.transaction((commad)=>{
            commad.executeSql(`create table if not exists CatalogoLuminaria
                                (
                                    id integer primary key NOT NULL,
                                    ClaveLuminaria varchar,
                                    Contrato varchar,
                                    Padron integer,
                                    Tipo varchar,
                                    Clasificacion varchar,
                                    id_Tipo integer
                                )`);
        },(error)=>{console.log("Mensaje de error: "+ error.message)},()=>{});
        //NOTE: Tabla Tipo de CatalogoMedidores
        db.transaction((commad)=>{
            commad.executeSql(`create table if not exists CatalogoMedidores 
                                (
                                    id integer primary key NOT NULL,
                                    ClaveLuminaria varchar,
                                    Contrato varchar,
                                    LecturaActual integer,
                                    Padron integer
                                )`);
        },
        (error)=>{"Mensaje de error: " + error.message},
        ()=>{});
        //NOTE: Tabla Tipo de luminarias
    }
    crearTablasBaches(){
        //NOTE:
        db.transaction((command)=>{
            command.executeSql(`create table if not exists CatalogoClientes
                                (
                                    id integer primary key NOT NULL,
                                    Municipio varchar,
                                    Estado varchar,
                                    Cliente integer
                                )`);
        },
        (error)=>{"Mensaje de error:" + error.message},
        ()=>{});
    }
    insertarCatalogos( EstadoFisico: [], Luminaria: [] ){
        //NOTE: Insercion de catalogo estado fisico
        db = SQLite.openDatabase("data.db");
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
        ()=>{});
    }
    async leerLuminarias(){
        return new Promise((resolve,reject)=>{
            this.createOpenDB();
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
        db = SQLite.openDatabase("data.db");
        return new Promise((resolve,reject)=>{
            let fecha = new Date();
            db.transaction((command)=>{
                command.executeSql(`INSERT INTO Luminaria (id,Clave,Ubicacion,Cliente,Tipo,Latitud,Longitud,FechaTupla,ContratoVigente) 
                VALUES(NULL,
                    ?,
                    ?,
                    ?,
                    ?,
                    ?,
                    ?,
                    ?,
                    ?
                    )`,[data.Clave,data.Ubicacion,data.Cliente,data.Tipo,data.Latitud,data.Longitud,fecha.toLocaleDateString(),data.Contrato],()=>{resolve(true)});
            },(error)=>{
                reject(error.message + "Al guardar la luminaria")});
        });
    }
    async insertarHistoriaLuminaria(data:any){
        db = SQLite.openDatabase("data.db");
        let usuarios = await this.getItem('User');
        return new Promise((resolve,reject)=>{
           let fecha = new Date();
            db.transaction((commad)=>{
                commad.executeSql(`INSERT INTO HistorialLuminaria (id,Padron,Estado,Voltaje,Calsificacion,Tipo,Observacion,Evidencia,Fecha,Usuario) VALUES 
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
                    [data.Clave,String(data.Estado),String(data.Voltaje),String(data.Calsificacion),data.Tipo,data.Observacion,data.Evidencia,String(fecha.toLocaleDateString()),usuarios],//NOTE: usao la clave para ver en a quien pertenece
                    ()=>{resolve(true)});
            },(error)=>{ console.log(error.message + "Error"); reject(error.message + "AL guardar la historia")});
        })
    }
    verificarDatos(table:string){
        db = SQLite.openDatabase("data.db");
        return new Promise((resolve,reject)=>{
            db.transaction((commad)=>{
                commad.executeSql("SELECT COUNT(id) FROM Luminaria",[],(_,{rows})=>{resolve(rows._array)});
            },(error)=>{reject(error.message)});
        })
    }
    leerDBLuminarias(){
        db.transaction((command)=>{
            command.executeSql("SELECT * FROM HistorialLuminaria",[],(_,{rows})=>{
                console.log(rows);
            });
        });
    }
    insertarClavesLuminaria(Luminaria:[]){
        db = SQLite.openDatabase("data.db");
        db.transaction((commad)=>{
            Luminaria.map((item:{ClaveLuminaria:string,Contrato:string,Padron:string,Tipo:string,clasificacion:string,id_Tipo:string},value)=>{
                commad.executeSql("INSERT INTO CatalogoLuminaria (id,ClaveLuminaria,Contrato,Padron,Tipo,Clasificacion,id_Tipo) VALUES (NULL,?,?,?,?,?,?)",
                [item.ClaveLuminaria,item.Contrato,item.Padron,item.Tipo,item.clasificacion,item.id_Tipo],(_,{insertId})=>{console.log(JSON.stringify(insertId) + "insertado")});
            });
        },(error)=>{console.log(error.message)},()=>{console.log("Catalogo insertado")});
    }
    insertClavesMedidores(Medidor:[]){
        db = SQLite.openDatabase("data.db");
        db.transaction((commad)=>{
            Medidor.map((item:{ClaveLuminaria:string,Contrato:string,LecturaActual:string,Padron:string},index)=>{
                commad.executeSql("INSERT INTO CatalogoMedidores (id,ClaveLuminaria,Contrato,LecturaActual,Padron) VALUES (null,?,?,?,?)",
                [item.ClaveLuminaria,item.Contrato,item.LecturaActual,item.Padron],(_,{insertId})=>{console.log(JSON.stringify(insertId) + " insertado")});
            });
        },(erro)=>{console.log(`Mensaje de error: ${erro.message}`)},()=>{});
    }
    leerCatalogoLuminarias(){
        db = SQLite.openDatabase("data.db");
        return new Promise((resolve,reject)=>{
            db.transaction((command)=>{
                command.executeSql("SELECT * FROM CatalogoLuminaria",[],(_,{rows})=>{
                    let result = new Array();
                    rows._array.map((item,index)=>{
                        let data = {
                            ClaveLuminaria: item.ClaveLuminaria,
                            Contrato: item.Contrato,
                            Padron: item.Padron,
                            Tipo: item.Tipo,
                            clasificacion: item.clasificacion,
                            id_Tipo: item.id_Tipo,
                        };
                        result.push(data);
                    });
                    resolve(JSON.stringify(result));
                });
            },(error)=>{reject("Error al leer CatalogoLuminaria: " + error.message)});
        });
    }
    buscarLuminariaClave(key: string){
        return new Promise((resolve,reject)=>{
            db.transaction((command)=>{
                command.executeSql(`SELECT * FROM CatalogoLuminaria WHERE ClaveLuminaria LIKE '%${key}%'`,[],
                (_,{rows})=>{
                    resolve(JSON.stringify(rows._array));
                });
            },(error)=>{reject(`Mensaje de error: ${error.message}`)});
        });
    }
    async insertarHistoral(data: any){
        db = SQLite.openDatabase("data.db");
        let usuarios = await this.getItem('User');
        return new Promise((resolve,reject)=>{
            let fecha = new Date();
            db.transaction((command)=>{
                command.executeSql(`INSERT INTO HistorialLuminaria (id,Padron,Estado,Voltaje,Calsificacion,Tipo,Observacion,Evidencia,Fecha,Usuario) VALUES 
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
                    [data.Padron,String(data.Estado),String(data.Voltaje),String(data.Calsificacion),data.Tipo,data.Observacion,data.Evidencia,String(fecha.toLocaleDateString()),usuarios],
                    ()=>{resolve(true)})
            },(error)=>{ reject(error.message)})
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
    public async clearUser(){

        // TipoLuminaria, CatalogoLuminaria, CatalogoMedidores
        await AsyncStorage.clear();
        return await this.borrarTablas();
    }
    public async borrarTablas(){
        
        let result = await this.borrarDatosAsync("TipoLuminaria");
        console.log(result);
        result = await this.borrarDatosAsync("CatalogoLuminaria");
        console.log(result);
        result = await this.borrarDatosAsync("EstadoFisico");
        console.log(result);
        result = await this.borrarDatosAsync("CatalogoMedidores");
        console.log(result);
        return true;
    }
    public async borrarDatosAsync(tableName:string){
        return new Promise((resolve,reject)=>{
            db.transaction((commad)=>{
                commad.executeSql("DELETE FROM " + tableName,[],(_,{rowsAffected})=>{ resolve(`Datos de la tabla ${tableName} eliminados:  ${rowsAffected}`)});
            },(error)=>{reject(`Error al eliminar los datos de la tabla ${tableName}:  ${error.message}`)});
        })
    }
    public async verificarSesion(){
        let token = await AsyncStorage.getItem(root+"Token");
        let user = await AsyncStorage.getItem(root+"User");
        return (token != null && user != null)
    }
}

