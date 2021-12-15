import * as SQLite from "expo-sqlite";
import AsyncStorage from '@react-native-async-storage/async-storage';
let db: SQLite.WebSQLDatabase;
const root = "@Storage:";
export class StorageService{
    createOpenDB () {
        db = SQLite.openDatabase("data.db");
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
        return await AsyncStorage.setItem(root+"Cliente",key);
    }
}

