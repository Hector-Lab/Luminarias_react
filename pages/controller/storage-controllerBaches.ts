import AsyncStorage from '@react-native-async-storage/async-storage';

const root = "Storage:";
export class StorageBaches {
    async GuardarDatosPersona ( Persona: 
        {   Curp:string,
            Nombres:string,
            Paterno:string,
            Materno: string,
            Telefono:string,
            Email: string} ) {
        let jsonPersona = JSON.stringify(Persona);
        await AsyncStorage.setItem(root+"Persona", jsonPersona); 
    }
}