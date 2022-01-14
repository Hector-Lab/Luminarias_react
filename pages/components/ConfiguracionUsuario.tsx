import { Picker } from '@react-native-picker/picker';
import React,{ useEffect, useState } from 'react';
import { Modal, Text, View, TouchableOpacity } from 'react-native';
import { Avatar, Input } from 'react-native-elements';
import Styles from '../../Styles/styles';
import {StorageBaches} from '../controller/storage-controllerBaches';
import { ObtenerMunicipios, RecuperarDatos } from '../controller/api-controller';
import { checkConnection, CordenadasActualesNumerico,ObtenerDireccionActual, verificarcurp } from '../../utilities/utilities';
import { cardColor, DarkPrimaryColor } from '../../Styles/BachesColor';
import Message from '../components/modal-message';
import Loading from '../components/modal-loading';

export default function Solicitud(props:any ){
    const storage = new StorageBaches();
    const [ arregloMunicipios , setArregloMunicipios] = useState([]);
    const [ cliente, setCliente ] = useState(String);
    const [ CURP, setCURP ] = useState(String);
    const [ errorMessage, setErrorMessage ] = useState(String);
    const [ errorUI, setErrorUI ] = useState(false);
    const [ iconMessage, setIconMessage ] = useState(String);
    const [ showMessage, setShowMessage ] = useState(false);
    const [ tipoError, setTipoError ] = useState("Mensaje");
    const curpError = ["","Favor de revisar la CURP ingresada","Formato de CURP no valido"];
    const [modalVisible, setModalVisible ] = useState(false);

    useEffect(() => {
        (async () => {
            setModalVisible(props.visible);
            let coords = await CordenadasActualesNumerico();
            let ubicacionActual = JSON.parse(await ObtenerDireccionActual(coords));
            let indicioFormato = String(ubicacionActual.region).normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            Municipios(indicioFormato);
            storage.createTablasBaches();
                await Municipios("");
              return;
          })();
      },[]);
    const Municipios = async ( indicio:string ) =>{
        let internetAviable = await checkConnection();
        if(internetAviable){
            //NOTE: Obtenemos los datos desde la API, limpiamoa la tabla e insertamos los datos
            let listaMunicipio = await ObtenerMunicipios();
            let municipiosAuxiliar = [];
            listaMunicipio.map((item,index)=>{
                let municipioFormato = String(item.Municipio).normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                if(municipioFormato.includes(indicio) || indicio.includes(String(item.Nombre))){
                    municipiosAuxiliar.push(item);
                }
            });
            setArregloMunicipios(municipiosAuxiliar);
            storage.LimpiarTabla("CatalogoClientes");
            await storage.InsertarMunicipios(listaMunicipio);
        }else{
            //NOTE: Obtenemos los desde la db
            let listaMunicipio = await storage.ObtenerMunicipiosDB();
            let municipiosAuxiliar = [];
            listaMunicipio.map((item,index)=>{
                let municipioFormato = String(item.Municipio).normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                if(municipioFormato.includes(indicio) || indicio.includes(String(item.Nombre))){
                    municipiosAuxiliar.push(item);
                }
            });
            setArregloMunicipios(municipiosAuxiliar);
        }
    } 
    const validarCURP = async ()=>{
        setErrorUI(false);
        let validcurp = verificarcurp(CURP);
        if(validcurp != 0){
            setErrorUI(true);
            setErrorMessage(curpError[validcurp]);
            setShowMessage(true);
            setIconMessage("user-cog");
            setTipoError("Mensaje");
        }else{
            verificarDatos();
        }
    }
    const verificarDatos = async () => {
        let rawCiudadano = await RecuperarDatos(cliente,CURP);
        let ciudadano = JSON.parse(rawCiudadano);
        let estructuraCiudadano = {
            curp:ciudadano,
            Nombres:ciudadano.Nombre,
            Paterno:ciudadano.ApellidoPaterno,
            Materno: ciudadano.ApellidoMaterno,
            Telefono:ciudadano.Telefono,
            Email: ciudadano.CorreoElectronico,
            Cliente: ciudadano.cliente,
            rfc:ciudadano.Curp
        };
        await storage.GuardarDatosPersona(estructuraCiudadano);
    }
    return (
        <Modal style = {{flex:1}}  visible = {modalVisible} onDismiss={ ()=>{props.onDismiss()} } >
            <View style = {{flex:1, flexDirection:"column"}} >
                {/**NOTE: cabecera de la pagina logo de suinpac o del municipio */}
                <View style={[Styles.avatarView,{flex:3}]}>
                <View style={Styles.avatarElement}>
                    <Avatar 
                        rounded
                        size = "xlarge"
                        containerStyle = {{height:100,width:200}}
                        source = {require("../../resources/suinpac.png")} //FIXME: se puede cambiar por el logo de mexico
                    />
                </View>
            </View>
                {/**NOTE: contenido prinpal de la pagina */}
                <View style = {[{flex:8}]} >
                    <View style = {{marginTop:50, padding:20}} >
                        <Input
                            label = "CURP"
                            autoCompleteType={undefined}
                            placeholder = {"CURP"} 
                            onChangeText = {text =>{setCURP(text)}}
                            maxLength={ 18 }
                            style = {[Styles.inputBachees,{borderWidth: errorUI ? 1 : 0 ,borderColor:"red"}]} />
                        <Picker 
                            selectedValue={cliente} 
                            onValueChange = {(itemValue, itemIndex)=>{setCliente(itemValue)}}
                            style = {{backgroundColor:cardColor+55}}
                            >
                                <Picker.Item label="Seleccione el municipio al que pertenece" value={-1} ></Picker.Item>
                                {
                                    arregloMunicipios.map((item,index)=>{
                                        return <Picker.Item key={ item.id } label = { item.Municipio } value={ item.id } ></Picker.Item>
                                    })
                                }
                        </Picker>
                    </View>
                    <View style = {{flex: 1, padding:20}} >
                        <TouchableOpacity style = {Styles.btnButtonSuccess} onPress={ validarCURP } >
                            <Text style = {{color:"white"}}> Iniciar Sesión </Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style = {{ alignItems: "center", marginTop:30 }} 
                            onPress={ ()=>{ setModalVisible(false) } } >
                            <Text style = {{color: DarkPrimaryColor , fontWeight:"bold",  }} > Regístrame </Text>
                        </TouchableOpacity>
                    </View>
                </View>
                {/**NOTE: Pie de pagina marca de suinpac */}
                <View style = {{flex:1}}>
                    <View style = {{ alignItems: "center" }} >
                        <Text style = {{color: DarkPrimaryColor , fontWeight:"bold",  }} > Suinpac </Text>
                    </View>
                </View>
            </View>
            <Message 
                transparent = {true}
                loadinColor = {DarkPrimaryColor}
                message = {errorMessage}
                buttonText = "Aceptar"
                color = {DarkPrimaryColor}
                iconsource = "font-awesome-5"
                icon = {iconMessage}
                loading = {showMessage}
                onCancelLoad={()=>{setShowMessage(false)}}
                tittle = { tipoError }
            />
        </Modal>
    );
}
