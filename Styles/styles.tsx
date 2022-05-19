import { Dimensions, StyleSheet } from "react-native";
import { SuinpacRed, BackgrounBlue,azulColor,azulClaro } from "./Color";
import { cardColor, buttonSuccess } from '../Styles/BachesColor';

const Styles = StyleSheet.create({
  containerKeyboard: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    justifyContent: "center",
  },
  containerTest1: {
    flex: 1,
    backgroundColor: "red",
  },
  containerTest2: {
    flex: 1,
    backgroundColor: "green",
  },
  containerTest3: {
    flex: 1,
    backgroundColor: "blue",
  },
  avatarElement: {
    flex: 1,
    alignItems: "center",
  },
  avatarView: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  inputButtons: {
    flex: 3,
    flexDirection: "column",
    margin: 30,
  },
  btnButton: {
    marginTop: 30,
    borderRadius: 15,
    alignItems: "center",
    padding: 10,
    backgroundColor: SuinpacRed,
    borderWidth: 2,
    borderColor: SuinpacRed,
    //backgroundColor: 'red'
  },
  btnTexto: {
    color: "white",
    fontWeight: "bold",
  },
  FooterConteiner: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  FooterText: {
    color: SuinpacRed,
    fontSize: 23,
  },
  TabContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
  },
  mapContainer: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
  backgroundPage: {
    backgroundColor: BackgrounBlue,
  },
  backgroundimage: {
    flex: 1,
    justifyContent: "center",
  },
  MenuLuminaria: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  btnMenuSali: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "baseline",
  },
  textFormularios: {
    paddingLeft: 10,
    fontWeight: "bold",
    fontSize: 17,
    borderRadius:10,
    
  },
  textArea: {
    height: 100,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    borderRadius:10
  },
  btnFoto: {
    justifyContent: "center",
  },
  btnShortButton: {
    borderRadius: 15,
    alignItems: "center",
    padding: 10,
    backgroundColor:SuinpacRed,
    borderWidth: 1,
    borderColor: SuinpacRed,
    marginBottom: 10,
    marginTop: 20,
    
    //backgroundColor: 'red'
  },
  btbSearch: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
  },
  btnCancelSearch: {
    borderRadius: 15,
    alignItems: "center",
  
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: 'white',
    marginLeft: 5,
    marginBottom: 20,
    marginTop: 25,
  },
  box: {
    height: 150,
    width: "100%",
    backgroundColor: "white",
    elevation: 5,
    shadowColor: "grey",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    borderRadius: 10,
    marginBottom: 10,
  },
  inputData: {
    borderWidth: 0.5,
    padding: 5,
    borderRadius: 5,
  },
  inputError: {
    borderWidth: 1,
    padding: 5,
    borderRadius: 5,
    borderColor: 'red',
  },
  inputBachees:{
    marginTop: 10,
    backgroundColor:cardColor+45
  },
  inputBacheesError: {
    marginTop: 10,
    backgroundColor:cardColor+45,
    borderColor:'red',
    borderWidth:2,
  },
  btnButtonSuccess: {
    marginTop: 15,
    borderRadius: 15,
    alignItems: "center",
    padding: 10,
    backgroundColor: buttonSuccess ,
    //backgroundColor: 'red'
  },
  containerr: {
    flex: 1,
  },
  fonts: {
    marginBottom: 8,
  },
  user: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  image: {
    width: 30,
    height: 30,
    marginRight: 10,
  },
  name: {
    fontSize: 16,
    marginTop: 5,
  },
  ContenedorElemento: {flex:4, justifyContent:"center" },
  TemaCampo:{
    borderWidth: 0.5,
    padding: 5,
    marginLeft:20,
    marginRight:20,
    marginBottom:10,
    borderRadius: 5,
    backgroundColor:"white"
  },
  TemaLabalCampo: {
    marginLeft:20,
    marginBottom:5,
    color: azulColor,
    fontWeight:"bold"
  },
  btnGeneral: {
    borderRadius:5,
    backgroundColor:azulColor,
    padding:8,
    marginLeft:20,
    marginRight:20,
  },
  textoSubrayado: {
    marginTop:20,
    textAlign:"center",
    textDecorationLine:"underline",
    color:azulClaro,
    fontWeight: "bold",
  },
  itemPerfil:{
    flexDirection:"row",
    marginTop:20, 
    marginLeft:20, 
    marginRight:20, 
    borderBottomWidth:1, 
    borderColor:"lightgray"
  },
  TemaCampoError:{
    borderWidth: 2,
    padding: 5,
    marginLeft:20,
    marginRight:20,
    marginBottom:10,
    borderRadius: 5,
    backgroundColor:"white",
    borderColor:"red"
  },

});


export default Styles;
