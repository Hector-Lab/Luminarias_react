import  AsyncStorage from '@react-native-async-storage/async-storage';
import { ROOT } from '../controller/Variables';


export class StorageBaches {
    async guardarPersonalesPreregistro( jsonPersonales:string ){
        await AsyncStorage.setItem( ROOT+"PrePersonales" ,jsonPersonales);
    }
    async obtenerDatosPersonales(){
        return await AsyncStorage.getItem(ROOT+"PrePersonales");
    }
    async verificarSession(){
        return await AsyncStorage.getItem(ROOT+"logged");
    }
    async actualizarSession( identificador: string ){
        await AsyncStorage.setItem(ROOT+"logged",identificador);
    }
    async guardarCiudadano( idCiudadano:string ){
        await AsyncStorage.setItem(ROOT+"Ciudadano",idCiudadano);
    }
    async obtenerCiudadano () {
        await AsyncStorage.getItem(ROOT+"Ciudadano");
    }
    async guardarCatalogoAreas( catalogo:string ){
        await AsyncStorage.setItem(ROOT+"Areas",catalogo);
    }
    async obtenerCatalogoAreas( ){  
        return await AsyncStorage.getItem(ROOT+"Areas");
    }
}
