import { Dimensions, StyleSheet } from 'react-native';
import {SuinpacRed, BackgrounBlue} from "./Color";


const Styles = StyleSheet.create({
    containerKeyboard: {
        flex:1
    },
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
        justifyContent: 'center',
    },
    containerTest1:{
        flex: 1,
        backgroundColor:"red",
    },
    containerTest2:{
        flex: 1,
        backgroundColor:"green",
    },
    containerTest3:{
        flex: 1,
        backgroundColor:"blue",
    },
    avatarElement : {
        flex: 1,
        alignItems: 'center'
      },
    avatarView: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    },
    inputButtons : {
        flex: 3,
        flexDirection: 'column',
        margin:30,
    },
    btnButton: {
        marginTop: 30,
        borderRadius: 15,
        alignItems: 'center',
        padding: 10,
        backgroundColor: 'white',
        borderWidth : 2,
        borderColor: SuinpacRed,
        //backgroundColor: 'red'
    },
    btnTexto: {
        color: SuinpacRed ,
        fontWeight: 'bold'
      },
    FooterConteiner: {
        flex:1,
        justifyContent:"center",
        alignItems:"center"
    },
    FooterText: {
        color: SuinpacRed,
        fontSize: 23
    },
    TabContainer :{
        flex: 1, 
        flexDirection:'row',
        justifyContent: 'center', 
    },
    mapContainer: {
        width: Dimensions.get("window").width,
        height: Dimensions.get("window").height
    },
    backgroundPage: {
        backgroundColor: BackgrounBlue
    },
    backgroundimage: {
        flex: 1,
        justifyContent:"center"
    },
    MenuLuminaria: {
        flex:1,
        flexDirection: "row",
        justifyContent:"center",
        alignItems:"center",
    },
    btnMenuSali: {
        flex:1,
        flexDirection: "row",
        justifyContent:"center",
        alignItems:"baseline"    
    },
    textFormularios:{
        paddingLeft:10,
        fontWeight:'bold',
        fontSize:17
        
    },
    textArea:{
        height: 100,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    },
    btnFoto:{
    justifyContent:'center',
    
    }
    
   
});

export default Styles;