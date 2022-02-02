import React, { useCallback, useEffect, useState } from "react";
import { View, Text, ImageBackground } from "react-native";
import Styles from "../../../Styles/styles";
import MyLocation from "../../components/map-request";
import * as Location from "expo-location";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import { StorageService } from "../../controller/storage-controller";
import { ListItem, Avatar } from "react-native-elements";
import { cardColor } from "../../../Styles/BachesColor";
import { Icon } from "react-native-elements/dist/icons/Icon";
export default function HistorialUsuario(props: any) {
  const storage = new StorageService();
  const [enableLocation, setLocationEnable] = useState(false);
  const [location, setLocation] = useState(null);
  const [region, setRegion] = useState(null);

  //lista datos

  const list = [
      {
        name: "01230123",
        icon:'park',
        subtitle: "Parque",
      },
      {
        name: "01230123",
        icon:'whatshot',
        subtitle: "Luminaria",
      },
      {
        name: "01230123",
        icon:'traffic',
        subtitle: "Semaforo",
      },
      {
        name: "01230123",
        icon:'apartment',
        subtitle: "Edifcios",
      },
      {
        name: "01230123",
        icon:'park',
        subtitle: "Bomberos",
      },
      {
        name: "01230123",
        icon:'park',
        subtitle: "Parque",
      },
      {
        name: "01230123",
        icon:'whatshot',
        subtitle: "Luminaria",
      },
      {
        name: "01230123",
        icon:'traffic',
        subtitle: "Semaforo",
      },
      {
        name: "01230123",
        icon:'apartment',
        subtitle: "Edifcios",
      },
      {
        name: "01230123",
        icon:'park',
        subtitle: "Bomberos",
      },
      {
        name: "01230123",
        icon:'park',
        subtitle: "Parque",
      },
      {
        name: "01230123",
        icon:'whatshot',
        subtitle: "Luminaria",
      },
      {
        name: "01230123",
        icon:'traffic',
        subtitle: "Semaforo",
      },
      {
        name: "01230123",
        icon:'apartment',
        subtitle: "Edifcios",
      },
      {
        name: "01230123",
        icon:'park',
        subtitle: "Bomberos",
      },
  ];

  const image = require("../../../resources/suinpac.png");
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      setLocationEnable(status == "granted");

      let location = await Location.getCurrentPositionAsync();
      setLocation(location);
      let region = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.0022,
        longitudeDelta: 0.00421,
      };
      setRegion(region);
    })();
  }, []);
  const requestPermisions = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    setLocationEnable(status == "granted");
  };
  const CerrarSecion = async () => {
    await storage.clearUser();
  };
  return (
    <View style={[Styles.TabContainer]}>
      <ImageBackground
        source={image}
        resizeMode="center"
        style={Styles.backgroundimage}
        imageStyle={{ opacity: 0.05 }}
      >
        {
          <View>
            <TouchableOpacity
              style={[
                ,
                Styles.btnButton,
                { marginLeft: "25%", marginRight: "25%" },
              ]}
              onPress={CerrarSecion}
            >
              <Text style={Styles.btnTexto}> {` Cerrar Sesion `} </Text>
            </TouchableOpacity>
          </View>
        }

<ScrollView>
        {
        
        
        list.map((l, i) => (
          <TouchableOpacity>
              
            <ListItem key={i} bottomDivider containerStyle={{borderWidth:0.5,padding:0,borderColor:'black',backgroundColor:cardColor+"40",borderRadius:15,margin:5}}>                                

            <Icon
            name={l.icon}
             type='material'
              color= 'green'
              size={35}
              
            >

            </Icon>
              <ListItem.Content >                  
                <ListItem.Title>{l.name +' - '+l.subtitle}</ListItem.Title>
            
              </ListItem.Content>
              <ListItem.Chevron color="red" size={40} style={{fontFamily:'bold'}} />
            </ListItem>
          </TouchableOpacity>
        ))
        
        }
        </ScrollView>
      </ImageBackground>
    </View>
  );
}
      
