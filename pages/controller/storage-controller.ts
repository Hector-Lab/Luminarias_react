import * as SQLite from "expo-sqlite";

export class StorageService{
    createOpenDB () {
        let db = SQLite.openDatabase("data.db");
    }
}