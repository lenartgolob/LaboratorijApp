import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    ScrollView,
    ImageBackground,
    LinearGradient,
    Dimensions,
    TouchableOpacity,
    Button,
    Image,
    Platform,
    TouchableHighlight,
  } from "react-native";
import axios from "axios";
import MapView from "react-native-maps";
import { PROVIDER_GOOGLE } from "react-native-maps";
import {BoxShadow} from 'react-native-shadow';

const windowHeight = Dimensions.get("window").height;
const windowWidth = Dimensions.get("window").width;

export default function DisplayTransport({route}) {

    const shadowOpt = { 
        width: windowWidth-40,
        height:100,
        color:"#000",
        border:2,
        radius:10,
        opacity:0.3,
        x:1,
        y:1,
        style: {marginVertical:5, marginLeft: 20, marginRight: 20, marginTop: -50}
    }
    
      const [region, setRegion] = useState({
        latitude: 46.053730,
        longitude: 14.521310,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      });
    const panelReference = React.createRef();
    const [originPlaceID, setOriginPlaceID] = useState(route.params.originPlaceID)
    const [destinationPlaceID, setDestinationPlaceID] = useState(route.params.destinationPlaceID)

    useEffect(() => {
        // const json = JSON.stringify({
        //     origin: route.params.originPlaceID,
        //     destination: route.params.destinationPlaceID,     
        //   });
        //   axios.defaults.headers.common["X-Context"] = json;
        //   axios
        //     .get(URL)
        //     .then(function (response) {
        //       console.log(response.data);
        //     })
        //     .catch(function (error) {
        //       console.log(error);
        //     });
      }, []);

    return(
        <View style={styles.container}>
        <MapView 
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          initialRegion={region}
          mapPadding={{bottom: 50}}
        />       
        <View style={styles.ABContainer}>
          <TouchableOpacity activeOpacity={1} style={styles.startContainer}>
            <View style={{width: 90}}>
            <Image source={require('../assets/startText3.png')} style={styles.ABImg} />
            </View>
            <Text style={{fontSize: 14, fontWeight: 'bold', color: '#989898', fontFamily: 'AvenirNext-Bold', marginTop: 3}}>Tržaška cesta 121</Text>
            <View style={{width: 34}} />
          </TouchableOpacity>
          <View style={{flexDirection:"row"}}>
            <TouchableOpacity activeOpacity={1} style={styles.destinationContainer} >
                <View style={{width: 90}}>
                <Image source={require('../assets/endText3.png')} style={styles.ABImg} />
                </View>
              <Text style={{fontSize: 14, fontWeight: 'bold', color: '#989898', fontFamily: 'AvenirNext-Bold', marginTop: 3}}>Dunajska cesta</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.suggestionsContainer}>
            <View style={{flexDirection:"row"}}>
                <View style={styles.firstSuggestion}>
                    <View style={styles.suggestionsIconContainer}>
                        <Image
                            source={require("../assets/walkman.png")}
                            style={styles.walkImg}
                        />
                        <Text style={styles.smallText}>Walk</Text>
                    </View>
                    <View style={{flex:1, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end'}}>
                        <Text style={styles.kcal}>577 kcal</Text>
                        <Text style={{marginRight: 5}}><Text style={styles.time}>52</Text> <Text style={styles.timeUnit}>min</Text></Text>
                    </View>
                </View>
                <View style={styles.secondSuggestion}>
                <View style={styles.suggestionsIconContainer}>
                        <Image
                            source={require("../assets/bike.png")}
                            style={styles.bikeImg}
                        />
                        <Text style={styles.smallText}>Bikes</Text>
                    </View>
                    <View style={{flex:1, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end'}}>
                        <Text style={styles.kcal}>577 kcal</Text>
                        <Text style={{marginRight: 5}}><Text style={styles.time}>52</Text> <Text style={styles.timeUnit}>min</Text></Text>
                    </View>
                </View>
            </View>
            <View style={{flexDirection:"row"}}>
                <View style={styles.thirdSuggestion}>
                    <View style={styles.suggestionsIconContainer}>
                        <Image
                            source={require("../assets/taxi.png")}
                            style={styles.taxiImg}
                        />
                        <Text style={styles.smallText}>Taxis</Text>
                    </View>
                    <View style={{flex:1, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end'}}>
                        <Text style={styles.price}>577 kcal</Text>
                        <Text style={{marginRight: 5}}><Text style={styles.time}>52</Text> <Text style={styles.timeUnit}>min</Text></Text>
                    </View>
                </View>
                <View style={styles.fourthSuggestion}>
                    <View style={styles.suggestionsIconContainer}>
                        <Image
                            source={require("../assets/bus.png")}
                            style={styles.busImg}
                        />
                        <Text style={styles.smallText}>Buses</Text>
                    </View>
                    <View style={{flex:1, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end'}}>
                        <Text style={styles.price}>577 kcal</Text>
                        <Text style={{marginRight: 5}}><Text style={styles.time}>52</Text> <Text style={styles.timeUnit}>min</Text></Text>
                    </View>
                </View>
            </View>
            <View style={{flexDirection:"row"}}>
                <View style={styles.fifthSuggestion}>
                    <View style={styles.suggestionsIconContainer}>
                        <Image
                            source={require("../assets/train.png")}
                            style={styles.trainImg}
                        />
                        <Text style={styles.smallText}>Trains</Text>
                    </View>
                    <View style={{flex:1, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end'}}>
                        <Text style={styles.price}>577 kcal</Text>
                        <Text style={{marginRight: 5}}><Text style={styles.time}>52</Text> <Text style={styles.timeUnit}>min</Text></Text>
                    </View>
                </View>
                <View style={styles.sixthSuggestion}>

                </View>
            </View>
        </View>
        <View style={styles.ljContainer}>
          <Image
            source={require("../assets/ljubljana.png")}
            style={styles.lj}
          />
        </View>
    </View>
    );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#009f48',
    },
    map: {
      height: "50%",
      width: "100%",
    },
    ABContainer: {
      height: 100,
      borderRadius: 10,
      marginRight: 20,
      marginLeft: 20,
      marginTop: -50,
      // Shadow
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.5,
      shadowRadius: 2,  
      elevation: 2,
    },
    startContainer: {
      backgroundColor: 'white',
      height: 50,
      borderTopLeftRadius: 10,
      borderTopRightRadius: 10,
      borderBottomColor: '#D3D3D3',
      borderBottomWidth: 1,
      flexDirection: 'row',
      alignItems: 'center',
    },
    destinationContainer: {
      backgroundColor: 'white',
      height: 50,
      borderBottomLeftRadius: 10,
      borderBottomRightRadius: 10,
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
    },
    ljContainer: {
      justifyContent: 'flex-end',
      alignItems: 'center',
      flex: 1,
      marginBottom: 20,
    },
    lj: {
      width: 50,
      height: 61,
    },
    ABImg: {
      width: 70,
      height: 40,
      marginLeft: 7,
    },
    suggestionsContainer: {
        height: 100,
        borderRadius: 10,
        marginRight: 20,
        marginLeft: 20,
        marginTop: 25,
        // Shadow
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.5,
        shadowRadius: 2,  
        elevation: 2,
        fontFamily: 'AvenirNext-Bold',
    },
    firstSuggestion: {
        backgroundColor: 'white',
        height: 50,
        flex: 1,
        flexDirection: 'row',
        borderTopLeftRadius: 10, 
        borderBottomColor: '#D3D3D3',
        borderBottomWidth: 1,
        flexDirection: 'row',
      },
      secondSuggestion: {
        backgroundColor: 'white',
        height: 50,
        borderTopRightRadius: 10,
        flex: 1, 
        borderLeftColor: '#D3D3D3',
        borderLeftWidth: 1,
        flexDirection: 'row',
        borderBottomColor: '#D3D3D3',
        borderBottomWidth: 1,
      },
      thirdSuggestion: {
        backgroundColor: 'white',
        height: 50,
        flex: 1,
        flexDirection: 'row',
        borderBottomColor: '#D3D3D3',
        borderBottomWidth: 1,
      },
      fourthSuggestion: {
        backgroundColor: 'white',
        height: 50,
        flex: 1, 
        borderLeftColor: '#D3D3D3',
        borderLeftWidth: 1,
        flexDirection: 'row',
        borderBottomColor: '#D3D3D3',
        borderBottomWidth: 1,
      },
      fifthSuggestion: {
        backgroundColor: 'white',
        height: 50,
        flex: 1,
        flexDirection: 'row',
        borderBottomLeftRadius: 10,
      },
      sixthSuggestion: {
        backgroundColor: 'white',
        height: 50,
        flex: 1, 
        borderLeftColor: '#D3D3D3',
        borderLeftWidth: 1,
        flexDirection: 'row',
        borderBottomRightRadius: 10,
      },
      suggestionsIconContainer: {
        justifyContent: 'space-between', 
        marginLeft: 5, 
        marginBottom: 10, 
        height: '100%',
      },
      walkImg: {
        width: 14,
        height: 23,
        marginTop: 5,
      },
      bikeImg: {
        width: 31,
        height: 18,
        marginTop: 9,
      },
      taxiImg: {
        width: 20,
        height: 20,
        marginTop: 7,
      },
      busImg: {
        width: 19,
        height: 20,
        marginTop: 7,        
      },
      trainImg: {
        width: 23,
        height: 20,
        marginTop: 7,        
      },
      kcal: {
        fontFamily: 'AvenirNext-DemiBold',
        fontSize: 12,
        color: '#989898',
        marginRight: 5,
      },
      price: {
        fontFamily: 'AvenirNext-DemiBold',
        fontSize: 12,
        color: '#989898',
        marginRight: 5,
      },
      time: {
        fontFamily: 'AvenirNext-Bold',
        fontSize: 18,
        color: '#404040',
      },
      timeUnit: {
        fontFamily: 'AvenirNext-Bold',
        fontSize: 10,
        color: '#404040',
      },
      smallText: {
        fontFamily: 'AvenirNext-Medium',
        fontSize: 11,
        color: '#989898',
        marginBottom: 2,
      }
  });