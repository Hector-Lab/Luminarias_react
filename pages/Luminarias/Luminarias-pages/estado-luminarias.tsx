import React, { useState, useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Image,
  TextInput,
  Dimensions,
  Vibration,
  Alert,
} from "react-native";
import { Text, Button, Icon, Card, ListItem } from "react-native-elements";
import { FlatList } from 'react-native';
import Styles from "../../../Styles/styles";
import { Input } from "react-native-elements/dist/input/Input";
import { Picker } from "@react-native-picker/picker";
import { TouchableOpacity } from "react-native-gesture-handler";
import Carousel, { Pagination } from "react-native-snap-carousel";
import { Camera } from "expo-camera";
import { iconColorBlue, SuinpacRed, torchButton } from "../../../Styles/Color";
import { StorageService } from '../../controller/storage-controller';
import { Searchbar } from 'react-native-paper';
import Loading from '../../components/modal-loading';
import Message from '../../components/modal-message';
import { checkConnection, CordenadasActuales } from '../../../utilities/utilities';
import { GuardarHistoriaLuminaria } from '../../controller/api-controller';

export default function LuminariasEstados(props: any) {
  
  return (
    <View style={[Styles.TabContainer,{justifyContent:"center"}]}>
      <Text> Agregar Estado de luminarias </Text>
    </View>
  );
}