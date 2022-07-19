import  * as Location from 'expo-location';
import NetInfo from '@react-native-community/netinfo';
//NOTE: exprecion regular para la curp
const rgexCurp = /^([A-Z][AEIOUX][A-Z]{2}\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])[HM](?:AS|B[CS]|C[CLMSH]|D[FG]|G[TR]|HG|JC|M[CNS]|N[ETL]|OC|PL|Q[TR]|S[PLR]|T[CSL]|VZ|YN|ZS)[B-DF-HJ-NP-TV-Z]{3}[A-Z\d])(\d)$/;

export async function CordenadasActuales () {
    let data = await Location.getCurrentPositionAsync();
    let coords = {
        latitude : String(data.coords.latitude),
        longitude : String(data.coords.longitude)
    };
    return coords;
}

export async function CordenadasActualesNumerico () {
    let data = await Location.getCurrentPositionAsync();
    let coords = {
        latitude : data.coords.latitude,
        longitude : data.coords.longitude
    };
    
    return coords;
}

export async function checkConnection (){
    return new Promise((resolve,reject)=>{
        NetInfo.fetch()
        .then((estado)=>{
            resolve(estado.isInternetReachable);
        })
        .catch((error)=>{
            console.log(error);
            reject(error);
        })
    });
}
export async function ObtenerDireccionActual(location:any){
    let data = await Location.reverseGeocodeAsync(location);
    let direccion = {
        Localidad: data[0].city,
        Calle: data[0].street,
        Numero: data[0].streetNumber,
        Colonia: data[0].district,
        Codigo: data[0].postalCode

    };
    return direccion
    //return JSON.stringify(data[0]);
}
export function rfcValido(rfc, aceptarGenerico = true) {
    const re       = /^([A-ZÑ&]{3,4}) ?(?:- ?)?(\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])) ?(?:- ?)?([A-Z\d]{2})([A\d])$/;
    var   validado = rfc.match(re);
    if (!validado)  //Coincide con el formato general del regex?
        return false;

    //Separar el dígito verificador del resto del RFC
    const digitoVerificador = validado.pop(),
          rfcSinDigito      = validado.slice(1).join(''),
          len               = rfcSinDigito.length,

    //Obtener el digito esperado
          diccionario       = "0123456789ABCDEFGHIJKLMN&OPQRSTUVWXYZ Ñ",
          indice            = len + 1;
    var   suma,
          digitoEsperado;

    if (len == 12) suma = 0
    else suma = 481; //Ajuste para persona moral

    for(var i=0; i<len; i++)
        suma += diccionario.indexOf(rfcSinDigito.charAt(i)) * (indice - i);
    digitoEsperado = 11 - suma % 11;
    if (digitoEsperado == 11) digitoEsperado = 0;
    else if (digitoEsperado == 10) digitoEsperado = "A";

    //El dígito verificador coincide con el esperado?
    // o es un RFC Genérico (ventas a público general)?
    if ((digitoVerificador != digitoEsperado)
     && (!aceptarGenerico || rfcSinDigito + digitoVerificador != "XAXX010101000"))
        return false;
    else if (!aceptarGenerico && rfcSinDigito + digitoVerificador == "XEXX010101000")
        return false;
    return rfcSinDigito + digitoVerificador;
}
function digitoVerificador(curp17) {
    //Fuente https://consultas.curp.gob.mx/CurpSP/
    var diccionario  = "0123456789ABCDEFGHIJKLMNÑOPQRSTUVWXYZ",
        lngSuma      = 0.0,
        lngDigito    = 0.0;
    for(var i=0; i<17; i++)
        lngSuma = lngSuma + diccionario.indexOf(curp17.charAt(i)) * (18 - i);
    lngDigito = 10 - lngSuma % 10;
    if (lngDigito == 10) return 0;
    return lngDigito;
}
export function verificarcurp (curp: string){
    let splicedCurp = curp.match(rgexCurp);
    if(splicedCurp){
        let digitoCalculado = digitoVerificador(splicedCurp[1]);
        if( splicedCurp[2] !=  String(digitoCalculado) ){
            return 1;
        }else{
            return 0;
        }
    }else{
        return 2;
    }
}