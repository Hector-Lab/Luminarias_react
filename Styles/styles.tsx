import { Dimensions, StyleSheet } from "react-native";
import { azulColor } from '../Styles/Color';
import { cardColor, buttonSuccess } from '../Styles/BachesColor';
const Styles = StyleSheet.create({
  inputText:{
    borderWidth:1,
    borderColor:"black",
    padding:10
  },
  contenedorRegistrar:{
    flexDirection:"row",alignSelf:"center"
  },
  btnRegistrar: {
    marginTop:20,
  },
  txtRegistrar: {
    textAlign:"center",
    fontWeight:"bold",
    color:azulColor
  },
  txtSubtitulo: {
    fontWeight:"bold",
    color:"black"
  },
  txtLabel: {
    color: azulColor,
    marginTop:5
  },
  campo:{
    borderWidth:1,
    padding:7,
    marginTop:10,
    borderRadius:3,
    backgroundColor:"#F2F2F2"
  },
  errorCampo:{
    borderColor:"red",
    borderWidth:1,
    padding:7,
    marginTop:10,
    borderRadius:3,
  },
  btnOpacity:{
    borderRadius:5,
    backgroundColor:azulColor,
    marginTop:20 
  },
  btnTexto:{
    color:"white",
    fontWeight:"bold",
     padding:10, textAlign:"center"
  },
  itemPerfil:{
    flexDirection:"row",
    marginTop:20, 
    marginLeft:20, 
    marginRight:20, 
    borderBottomWidth:1, 
    borderColor:"lightgray"
  },
});

export default Styles;
