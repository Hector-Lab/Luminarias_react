import { StyleSheet } from 'react-native';
import {SuinpacRed} from "./Color";

const Styles = StyleSheet.create({
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
    flex: 2,
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
        justifyContent: 'center', 
        alignItems: 'center' 
    }
});

export default Styles;