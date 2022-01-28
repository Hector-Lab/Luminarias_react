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
import { Picker } from "@react-native-picker/picker";
import { TouchableOpacity } from "react-native-gesture-handler";
import Styles from '../../../Styles/BachesStyles';
import { cardColor, DarkPrimaryColor } from "../../../Styles/BachesColor";
import DropDownPicker from 'react-native-dropdown-picker';

export default function LuminariasEstados(props: any) {
  
  return (
    <View style={[Styles.TabContainer,{justifyContent:"center"}]}>
                      <View style = {Styles.cardContainer} >
                    <View style = {[Styles.bachesCard,{marginTop:5}]} >
                      <View style={Styles.cardHeader}>
                        <View style={Styles.cardHeaderText}>
                          <View style={Styles.cardRpundedIcon}></View>
                          <Text
                            style={{
                              textAlign: "center",
                              marginLeft: 15,
                              fontSize: 15,
                              fontWeight: "bold",
                            }}
                          >
                            Direccion Actual
                          </Text>
                        </View>
                      </View>
                      <View style={[Styles.cardTextView]}>
                        <Text
                        style={[
                          Styles.textMultiline
                        ]}>
                          {"Prueba de direccion"}
                        </Text>
                      </View>
                      <View style={Styles.cardFoteer}>
                        <View style={Styles.cardLocateBtn}>
                          <TouchableOpacity
                            style={{}}
                            onPress={()=>{console.log("Prueba de footer")}}
                          >
                            <Icon
                              color={DarkPrimaryColor}
                              size={25}
                              tvParallaxProperties
                              name="street-view"
                              type="font-awesome-5"
                              style={{ marginLeft: 45 }}
                            />
                          </TouchableOpacity>
                        </View>
                        <View
                          style={{
                            flex: 1,
                            flexDirection: "row",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <TouchableOpacity
                            style={{}}
                            onPress={() => {}}
                          >
                            <Icon
                              size={20}
                              color={DarkPrimaryColor}
                              tvParallaxProperties
                              name="trash-alt"
                              type="font-awesome-5"
                              style={{ marginRight: 45 }}
                            />
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                    <View style = {{flex:6}} >
                      <View style = {{margin:10}} >


                        <TextInput
                          autoCorrect = { false }
                          placeholder = {"Pruebas"}
                          style = {{borderColor:cardColor, borderWidth:1,backgroundColor:cardColor+"40", padding:3, marginTop:10}} />
                        <TextInput
                          autoCorrect = { false }
                          placeholder = {"Pruebas"}
                          style = {{borderColor:cardColor, borderWidth:1,backgroundColor:cardColor+"40", padding:3,  marginTop:20}} />
                        <TextInput
                          autoCorrect = { false }
                          placeholder = {"Pruebas"}
                          style = {{borderColor:cardColor, borderWidth:1,backgroundColor:cardColor+"40", padding:3,  marginTop:20}} />
                      </View>
                    </View>
                </View>
    </View>
  );
}