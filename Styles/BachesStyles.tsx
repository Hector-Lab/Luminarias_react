import { Dimensions, StyleSheet } from "react-native";
import { SuinpacRed, BackgrounBlue } from "./Color";
import { buttonSuccess,cardColor,BlueColor, DarkPrimaryColor } from './BachesColor';
const Styles = StyleSheet.create({
    inputs: {
        marginTop: 10,
      },
      TabContainer: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "center",
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
      btnButtonSuccess: {
        marginTop: 30,
        borderRadius: 15,
        alignItems: "center",
        padding: 10,
        backgroundColor: buttonSuccess ,
        borderWidth: 2,
        borderColor: buttonSuccess,
        //backgroundColor: 'red'
      },
      container: { 
        flex:1,
        justifyContent:"flex-start",
        flexDirection:"column",
        backgroundColor:"white"
      },
      cardContainer: {
        flex:1,
        borderRadius:10,
        elevation:2,
        padding:15
      },
      bachesCard: {
        flex:4,
        flexDirection:"column",
        justifyContent:"center",
        borderRadius:10,
        backgroundColor:BlueColor+"22"
      },
      cardHeader:{
        flex:1,
        flexDirection:"row",
        alignContent:"center"
      },
      cardLeftIcon : {
        flex:1,
        justifyContent:"center",
        alignItems:"center"
      },
      cardRpundedIcon: {
        backgroundColor:DarkPrimaryColor,
        borderRadius:10
      },
      cardHeaderText: {
        flex:2,
        flexDirection:"row",
        justifyContent:"center",
        alignItems:"center"
      },
      cardRigthIcon: {
        flex:1,flexDirection:"row", justifyContent:"center", alignItems:"center"
      },
      cardTextView:{
        flex:3, 
        flexDirection:"row"
      },
      textMultiline: {
        backgroundColor:"white",
        borderWidth:1, 
        flex:1, 
        margin:15, 
        borderColor: cardColor, 
        borderRadius:10
      },
      cardFoteer: {
        flex:.5,
        flexDirection:"row",
        alignContent:"center"
      },
      cardFoteerContainer: {
        flex:1,
        justifyContent:"center", 
        alignItems:"center"
      },
      cardLeftBtn: {
        padding:5 ,
        backgroundColor:"white" , 
        borderColor: BlueColor, 
        borderRadius:5, 
        borderWidth:1
      },
      cardLocateBtn: {
        marginLeft:10 ,flex:2,flexDirection:"row", justifyContent:"flex-start", alignItems:"center"
      },
      cardBtn: {
        borderColor:BlueColor, 
        borderWidth:1,
        backgroundColor:"white",
        paddingLeft:7,
        paddingRight:7, 
        borderRadius:5
      }
});

export default Styles;