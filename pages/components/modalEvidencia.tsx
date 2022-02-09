import React,{Component, useEffect} from 'react';
import { View ,Text, Modal, TouchableOpacity, Dimensions} from 'react-native';
import { buttonSuccess, PrimaryColor } from '../../Styles/BachesColor';
import Styles from '../../Styles/BachesStyles';
import Carousel, { Pagination } from "react-native-snap-carousel";
import { Card, Image } from 'react-native-elements';
import { DarkPrimaryColor } from '../../Styles/BachesColor';
const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');

export default class Evidencias extends React.Component<
{   
    transparente:boolean,
    visible: boolean,
    reference: any,
    arregloImagenes:any[],
    slideWidth:any,
    itemWidth:any,
    onButtonPress: any,
    activeIndex: any,
    arrayLength: number,
    activeIndexFunction: Function
}>{
  //INDEV: agregar la vista de la evidencia
    render(){
        const _renderItem = ({ item, index }) => {
            return (
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: 20,
                }}
              >
                  <Card>
                    <Image 
                      resizeMode = {"contain"}
                        height = { ((viewportHeight /100)*75) }
                        width = {((viewportWidth/100)*90)}
                        source={{ uri: `https://suinpac.com/${item}` }}
                        style={{ height:((viewportHeight /100)*65), width:((viewportWidth/100)*80)}}
                    />
                  </Card>
              </View>
            );
          };
          const pagination = () => {
            return (
              <Pagination
                activeDotIndex={this.props.activeIndex}
                dotsLength={this.props.arrayLength}
                containerStyle={{}}
                dotStyle={{
                  width: 8,
                  height: 8,
                  borderRadius: 4,
                  marginHorizontal: 8,
                  backgroundColor: DarkPrimaryColor,
                }}
                inactiveDotOpacity={0.4}
                inactiveDotScale={0.6}
              />
            );
          };
    
        return(
                <Modal
                style = {{backgroundColor:'green'}} 
                visible = {this.props.visible} 
                transparent = { false }
                animationType='fade'
                >
                    <View style = {[Styles.cardContainer]} >
                        <View style = {{flex:9}} >
                            <Carousel
                                    ref={this.props.reference}
                                    data={this.props.arregloImagenes}
                                    renderItem={_renderItem}
                                    sliderWidth={this.props.slideWidth}
                                    itemWidth={this.props.itemWidth}
                                    layout={"tinder"}
                                    containerCustomStyle={Styles.slider}
                                    contentContainerCustomStyle = { Styles.sliderContentContainer}
                                    onSnapToItem = { (index)=>{this.props.activeIndexFunction(index)} }
                                    loop = {true}
                                >
                                </Carousel>
                                {pagination()}
                        </View>
                        <View style = {{flex:1, justifyContent:"center", padding:20}} >
                        <TouchableOpacity 
                            style = {[Styles.cardLeftBtn,{backgroundColor:'#3A5C84', borderRadius:10 , borderColor: buttonSuccess, }]}
                            onPress = {this.props.onButtonPress}
                            >
                        <Text style = {{ color:"white", textAlign:"center"}} > Aceptar </Text>
                      </TouchableOpacity> 
                        </View>
                    </View>
                </Modal>
        )
    };
}