import { Camera } from 'expo-camera';
import React, { Component } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-elements';
import { iconColorBlue, SuinpacRed, torchButton } from '../../Styles/Color';
import { CordenadasActualesNumerico, ObtenerDireccionActual } from '../../utilities/utilities';
import { StorageBaches } from '../controller/storage-controllerBaches';

let camera: Camera;
const storage = new StorageBaches();
const _takePicture = async () => {
  if (!camera) {
    return;
  }
  const photo = await camera.takePictureAsync({
    base64: false,
    quality: 0.4,
  });
  //NOTE: verificamos los datos de localizacion
  let coordenadas = await CordenadasActualesNumerico();
  let DireccionActual = JSON.parse(await ObtenerDireccionActual(coordenadas));
  let formatoDireccion = `
        Estado: ${DireccionActual.region}
        Ciudad: ${DireccionActual.city}
        Colonia: ${DireccionActual.district}
        Calle: ${DireccionActual.street}
        Código Postal: ${DireccionActual.postalCode}
        `;
  storage.guardarDatosCamara(JSON.stringify(photo), JSON.stringify(coordenadas), formatoDireccion);

}

export default class Camara extends React.Component<
  {
    Activa: boolean,
    onActiveCamera: Function,
    flashOn: boolean,
    onChangeFlash: Function
  }>{
  render() {
    if (this.props.Activa) {
      return (
        <View style={{ flex: 1 }}>
          <Camera
            ref={(r) => {
              camera = r;
            }}
            style={{ flex: 1 }}
            autoFocus={true}
            flashMode={
              this.props.flashOn
                ? Camera.Constants.FlashMode.torch
                : Camera.Constants.FlashMode.off
            }
          >
            <View
              style={{
                flex: 20,
                marginTop: 10,
                flexDirection: "row-reverse",
                marginLeft: 20,
              }}
            >
              <TouchableOpacity
                style={{
                  justifyContent: "center",
                  backgroundColor: SuinpacRed,
                  opacity: 0.5,
                  height: 40,
                  width: 40,
                  borderRadius: 50,
                }}
                onPress={() => {
                  this.props.onActiveCamera();
                }}
              >
                <Icon
                  tvParallaxProperties
                  name="cancel"
                  color={iconColorBlue}
                ></Icon>
              </TouchableOpacity>
            </View>
            <View
              style={{
                flex: 2,
                marginTop: 10,
                flexDirection: "row",
                marginLeft: 20,
              }}
            >
              <TouchableOpacity
                style={{
                  justifyContent: "center",
                  backgroundColor: torchButton,
                  opacity: 0.5,
                  height: 40,
                  width: 40,
                  borderRadius: 50,
                }}
                onPress={() => {
                  this.props.onChangeFlash();
                }}
              >
                <Icon
                  type="feather"
                  tvParallaxProperties
                  name={this.props.flashOn ? "zap" : "zap-off"}
                  color={iconColorBlue}
                ></Icon>
              </TouchableOpacity>
            </View>
            <View style={{ alignItems: "center", marginBottom: 10 }}>
              <TouchableOpacity
                style={{
                  justifyContent: "center",
                  backgroundColor: "white",
                  opacity: 0.5,
                  height: 60,
                  width: 60,
                  borderRadius: 50,
                }}
                onPress={async () => {
                  await _takePicture();
                  this.props.onActiveCamera();
                }}
              >
                <Icon
                  tvParallaxProperties
                  name="camera"
                  color={SuinpacRed}
                ></Icon>
              </TouchableOpacity>
            </View>
          </Camera>
        </View>
      );
    } else {
      return (<></>);
    }
  }
}