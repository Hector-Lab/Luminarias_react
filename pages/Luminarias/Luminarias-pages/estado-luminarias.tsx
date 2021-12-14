import React,{ useState, useEffect} from "react";
import { View,TextInput,ScrollView,Alert,TouchableOpacity,ImageBackground } from "react-native";
import { Text,Button } from 'react-native-elements';
import Styles from "../../../Styles/styles";
import Carousel from 'react-native-snap-carousel';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Input } from "react-native-elements/dist/input/Input";
import { Picker } from "@react-native-picker/picker";
import { Camera } from 'expo-camera';
export default function LuminariasEstados(props:any ){
    const [previewVisible, setPreviewVisible] = useState(false)
    const [capturedImage, setCapturedImage] = useState<any>(null)
    const [startCamera,setStartCamera] = React.useState(false)
    let camera: Camera;
    const __retakePicture = () => {
        setCapturedImage(null)
        setPreviewVisible(false)
        __startCamera()
      }
    const CameraPreview = ({photo}: any) => {
        console.log('sdsfds', photo)
        return (
          <View
            style={{
              backgroundColor: 'transparent',
              flex: 1,
              width: '100%',
              height: '100%'
            }}
          >
            <ImageBackground
              source={{uri: photo && photo.uri}}
              style={{
                flex: 1
              }}
            />
          </View>
        )
      }
    const __takePicture = async () => {
        if (!camera) return
        const photo = await camera.takePictureAsync()
        console.log(photo)
 
        setPreviewVisible(true)
        setCapturedImage(photo)
      }
    const __startCamera = async () => {
        const {status} = await Camera.requestMicrophonePermissionsAsync()
        if (status === 'granted') {
          // start the camera
          setStartCamera(true)
        } else {
          Alert.alert('Acceso Denegado A La Camara')
        }
      }

    return(
        
        <View style = {Styles.TabContainer}> 
                {startCamera ? (
          
          (previewVisible && capturedImage) ? (
<CameraPreview photo={capturedImage}  retakePicture={__retakePicture} />
          ) : ( <Camera
          style={{flex: 1,width:"100%"}}
          ref={(r) => {
            camera = r
          }}
        >
            <View >
            <TouchableOpacity 
            onPress={__takePicture}
            style={{
            width: 70,
            height: 70,            
            borderRadius: 50,
            backgroundColor: 'red',

            }}/>    
            </View>
             
        </Camera>)
        
        
      ) : (
              <View  style={Styles.inputButtons} >              
                
             <ScrollView>
                <Input placeholder="Clave Padrón"    rightIcon={{ type: 'font-awesome', name: 'search' }} />                                
                <Input placeholder="Lectura Anterior" label="Lectura Anterior" />
                <Input placeholder="Lectura Actual" label="Lectura Actual" />
                <Input placeholder="Consumo" label="Consumo" />
                <Text style={Styles.textFormularios}>Estado</Text>
                <Picker>
                    <Picker.Item label="Anomalia 8" value="8" />
                    <Picker.Item label="Anomalia 9" value="9" />
                    </Picker >  
                    <Text style={Styles.textFormularios}>Observaciones</Text>
                    <TextInput style={Styles.textArea} placeholder="Observaciones Del Medidor"
                    
                />
                <Carousel />
           
                <Button style={Styles.btnFoto}   onPress={__startCamera} icon={<Icon name="camera" size={15} color="white"/>} title="  Tomar Foto" />
                <Text></Text>
                <Button  icon={<Icon name="save" size={15} color="white"/>} title="  GUARDAR" />
            </ScrollView>
            </View>)}
  
            
        </View>           
        
            
            
            
        
    );
}

