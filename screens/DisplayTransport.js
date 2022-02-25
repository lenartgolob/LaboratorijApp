import React, { useState, useEffect, useRef } from "react";
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
    TouchableHighlight,
    Button,
    Image,
    Platform,
  } from "react-native";
import axios from "axios";
import MapView, { Polyline } from "react-native-maps";
import { PROVIDER_GOOGLE, Marker } from "react-native-maps";
import {BoxShadow} from 'react-native-shadow';
import { useSelector, useDispatch } from "react-redux";
import { setOrigin, setOriginAddress, setDestination, setDestinationAddress } from "../redux/actions";
import getDirections from 'react-native-google-maps-directions'

const windowHeight = Dimensions.get("window").height;
const windowWidth = Dimensions.get("window").width;

export default function DisplayTransport({route, navigation}) {

    const googleMapsKey = require('../config.json').googleMapsKey;

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
    // const [originPlaceID, setOriginPlaceID] = useState(route.params.originPlaceID)
    // const [destinationPlaceID, setDestinationPlaceID] = useState(route.params.destinationPlaceID)
    const dispatch = useDispatch();
    const { origin, originAddress, destination, destinationAddress } = useSelector(state => state.ljubljanaTransportReducer);
    const [originCoordinates, setOriginCoordinates] = useState({
      lat: 46.033703,
      lng: 14.4525267,
    })
    const [destinationCoordinates, setDestinationCoordinates] = useState({
      lat: 46.033703,
      lng: 14.4525267,
    })
    const [walkTime, setWalkTime] = useState(null);
    const [bikesTime, setBikesTime] = useState(null);
    const [taxiTime, setTaxiTime] = useState(null);
    const [carsharingTime, setCarsharingTime] = useState(null);
    const [busTime, setBusTime] = useState(null);
    const [trainTime, setTrainTime] = useState(null);

    const[walkPrice, setWalkPrice] = useState(null);
    const[bikesPrice, setBikesPrice] = useState(null);
    const[taxiPrice, setTaxiPrice] = useState(null);
    const[carsharingPrice, setCarsharingPrice] = useState(null);
    const[busPrice, setBusPrice] = useState(null);
    const[trainPrice, setTrainPrice] = useState(null);

    useEffect(() => {
        let URL = "http://192.168.56.1:8080/ljubljana-transport";
        const json = JSON.stringify({
            origin: origin,
            destination: destination,     
          });
          axios.defaults.headers.common["X-Context"] = json;
          axios
            .get(URL)
            .then(function (response) {
              console.log(response.data);
              if(response.data.walking.duration != null) {
                setWalkTime(Math.round(response.data.walking.duration.value/60));
                setWalkPrice(response.data.walking.kcal + " kcal")
              }
              if(response.data.bicycling.duration != null){
                setBikesTime(Math.round(response.data.bicycling.duration.value/60));
                setBikesPrice(response.data.bicycling.kcal + " kcal")
              }
              if(response.data.taxi.duration != null){
                setTaxiTime(Math.round(response.data.taxi.duration.value/60));
                setTaxiPrice(response.data.taxi.price + " €")
              }
              if(response.data.bus.duration != null){
                setBusTime(Math.round(response.data.bus.duration.value/60));
                setBusPrice(response.data.bus.price + " €")
              }
              if(response.data.train.duration != null){
                setTrainTime(Math.round(response.data.train.duration.value/60));
                setTrainPrice(response.data.train.price + " €")
              }
            })
            .catch(function (error) {
              console.log(error);
            });

        // Get coordinates of origin and destination
        getCoordinatesFromPlaceID(origin, true);
        getCoordinatesFromPlaceID(destination, false);

      }, []);

      const mapRef = useRef();

      useEffect(() => {
        if (mapRef.current) {
          // list of _id's must same that has been provided to the identifier props of the Marker
          mapRef.current.fitToSuppliedMarkers(['origin','destination'], { 
            animated: true,
            edgePadding: {
              top: 100,
              right: 100,
              bottom: 800,
              left: 100
            },
          });
        }
      }, [originCoordinates, destinationCoordinates]);

    function getCoordinatesFromPlaceID(placeID, isOrigin) {
      axios
      .get('https://maps.googleapis.com/maps/api/geocode/json?place_id=' + placeID + '&key=' + googleMapsKey)
      .then(function (response) {
        console.log(response.data.results[0].geometry.location);
        if(isOrigin){
          setOriginCoordinates({
            lat: response.data.results[0].geometry.location.lat,
            lng: response.data.results[0].geometry.location.lng,
          });
        } else {
          setDestinationCoordinates({
            lat: response.data.results[0].geometry.location.lat,
            lng: response.data.results[0].geometry.location.lng,
          });
        }
      })
      .catch(function (error) {
        console.log(error);
      });
    }

    function clearOrigin() {
      dispatch(setOrigin(null));
      dispatch(setOriginAddress(null));
      navigation.navigate("LjubljanaTransport");
    }

    function clearDestination() {
      dispatch(setDestination(null));
      dispatch(setDestinationAddress(null));
      navigation.navigate("LjubljanaTransport");
    }

    function handleGetDirections(travelmode) {
      const data = {
         source: {
          latitude: originCoordinates.lat,
          longitude: originCoordinates.lng
        },
        destination: {
          latitude: destinationCoordinates.lat,
          longitude: destinationCoordinates.lng
        },
        params: [
          {
            key: "travelmode",
            value: travelmode
          },
          {
            key: "dir_action",
            value: "navigate"
          }
        ],
      }
      getDirections(data)
    }

    return(
        <View style={styles.container}>
        <MapView 
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          initialRegion={region}
          mapPadding={{bottom: 50}}
          ref={mapRef}
        >
          <Marker 
            key={'origin'}
            identifier={'origin'}
            coordinate={{
            latitude: originCoordinates.lat,
            longitude: originCoordinates.lng,
            }}
          >
            <Image source={require('../assets/startMarker.png')} style={{height: 40, width: 40}} />
          </Marker>
          <Marker
            key={'destination'}
            identifier={'destination'}
            coordinate={{
            latitude: destinationCoordinates.lat,
            longitude: destinationCoordinates.lng,
            }}
          >
            <Image source={require('../assets/endMarker.png')} style={{height: 40, width: 40}} />
          </Marker>  
          <Polyline
            coordinates={[
              { latitude: originCoordinates.lat, longitude: originCoordinates.lng },
              { latitude: destinationCoordinates.lat, longitude: destinationCoordinates.lng },
            ]}
            strokeColor="#77ca9d"
            strokeWidth={3}
          />
        </MapView>       
        <View style={styles.ABContainer}>
          <TouchableOpacity activeOpacity={1} style={styles.startContainer}>
            <View style={{width: 90}}>
              <Image source={require('../assets/startText3.png')} style={styles.ABImg} />
            </View>
            <View style={{flex: 1, marginRight: 3}}>
              <Text style={{fontSize: 12, fontWeight: 'bold', color: '#989898', fontFamily: 'AvenirNext-Bold', marginTop: 3}}>{originAddress}</Text>
            </View>
            <TouchableOpacity onPress={() => clearOrigin()} ><Image source={require('../assets/close.png')} style={{width: 14, height: 14, marginRight: 7}} /></TouchableOpacity>
          </TouchableOpacity>
          <View style={{flexDirection:"row"}}>
            <TouchableOpacity activeOpacity={1} style={styles.destinationContainer} >
              <View style={{width: 90}}>
                <Image source={require('../assets/endText3.png')} style={styles.ABImg} />
              </View>
              <View style={{flex: 1, marginRight: 3}}>
                <Text style={{fontSize: 12, fontWeight: 'bold', color: '#989898', fontFamily: 'AvenirNext-Bold', marginTop: 3}}>{destinationAddress}</Text>
              </View>
              <TouchableOpacity onPress={() => clearDestination()} ><Image source={require('../assets/close.png')} style={{width: 14, height: 14, marginRight: 7}} /></TouchableOpacity>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.suggestionsContainer}>
            <View style={{flexDirection:"row"}}>
                <TouchableOpacity onPress={() => walkTime != null && handleGetDirections("walking")} activeOpacity={walkTime != null ? 0.9 : 1} style={walkTime != null ? styles.firstSuggestionOn : styles.firstSuggestionOff}>
                    <View style={styles.suggestionsIconContainer}>
                        <Image
                            source={require("../assets/walkman.png")}
                            style={styles.walkImg}
                        />
                        <Text style={styles.smallText}>Walk</Text>
                    </View>
                    <View style={{flex:1, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end'}}>
                        { walkTime != null ? 
                        <View style={{flex:1, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end'}}>
                          <Text style={styles.kcal}>{walkPrice}</Text>
                          <Text style={{marginRight: 5}}><Text style={styles.time}>{walkTime}</Text> <Text style={styles.timeUnit}>min</Text></Text>
                        </View>
                        :
                        <Text style={styles.unavailable}>Not found</Text>
                        }
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => bikesTime != null && handleGetDirections("bicycling")} activeOpacity={bikesTime != null ? 0.9 : 1} style={bikesTime != null ? styles.secondSuggestionOn : styles.secondSuggestionOff}>
                    <View style={styles.suggestionsIconContainer}>
                        <Image
                            source={require("../assets/bike.png")}
                            style={styles.bikeImg}
                        />
                        <Text style={styles.smallText}>Bikes</Text>
                    </View>
                    <View style={{flex:1, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end'}}>
                        { bikesTime != null ? 
                        <View style={{flex:1, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end'}}>
                          <Text style={styles.kcal}>{bikesPrice}</Text>
                          <Text style={{marginRight: 5}}><Text style={styles.time}>{bikesTime}</Text> <Text style={styles.timeUnit}>min</Text></Text>
                        </View>
                        :
                        <Text style={styles.unavailable}>Not found</Text>
                        }
                    </View>
                </TouchableOpacity>
            </View>
            <View style={{flexDirection:"row"}}>
                <TouchableOpacity onPress={() => taxiTime != null && navigation.navigate("Taxis")} activeOpacity={taxiTime != null ? 0.9 : 1} style={taxiTime != null ? styles.thirdSuggestionOn : styles.thirdSuggestionOff}>
                    <View style={styles.suggestionsIconContainer}>
                        <Image
                            source={require("../assets/taxi.png")}
                            style={styles.taxiImg}
                        />
                        <Text style={styles.smallText}>Taxis</Text>
                    </View>
                    <View style={{flex:1, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end'}}>
                        { taxiTime != null ? 
                        <View>
                          <Text style={styles.price}>{taxiPrice}</Text>
                          <Text style={{marginRight: 5}}><Text style={styles.time}>{taxiTime}</Text> <Text style={styles.timeUnit}>min</Text></Text>
                        </View>
                        :
                        <Text style={styles.unavailable}>Not found</Text>
                        }
                    </View>
                </TouchableOpacity>
                <View style={carsharingTime != null ? styles.fourthSuggestionOn : styles.fourthSuggestionOff}>
                  <View style={styles.suggestionsIconContainer}>
                        <Image
                            source={require("../assets/car.png")}
                            style={styles.carImg}
                        />
                        <Text style={styles.smallText}>Carsharing</Text>
                    </View>
                    <View style={{flex:1, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end'}}>
                        { carsharingTime != null ? 
                        <View>
                          <Text style={styles.price}>{carsharingPrice}</Text>
                          <Text style={{marginRight: 5}}><Text style={styles.time}>{carsharingTime}</Text> <Text style={styles.timeUnit}>min</Text></Text>
                        </View>
                        :
                        <Text style={styles.unavailable}>Not found</Text>
                        }
                    </View>
                </View>
            </View>
            <View style={{flexDirection:"row"}}>
                <TouchableOpacity onPress={() => busTime != null && handleGetDirections("transit")} activeOpacity={busTime != null ? 0.9 : 1} style={busTime != null ? styles.fifthSuggestionOn : styles.fifthSuggestionOff}>
                  <View style={styles.suggestionsIconContainer}>
                        <Image
                            source={require("../assets/bus.png")}
                            style={styles.busImg}
                        />
                        <Text style={styles.smallText}>Buses</Text>
                    </View>
                    <View style={{flex:1, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end'}}>
                        { busTime != null ? 
                        <View>
                          <Text style={styles.price}>{busPrice}</Text>
                          <Text style={{marginRight: 5}}><Text style={styles.time}>{busTime}</Text> <Text style={styles.timeUnit}>min</Text></Text>
                        </View>
                        :
                        <Text style={styles.unavailable}>Not found</Text>
                        }

                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => trainTime != null && handleGetDirections("transit")} activeOpacity={trainTime != null ? 0.9 : 1} style={trainTime != null ? styles.sixthSuggestionOn : styles.sixthSuggestionOff}>
                  <View style={styles.suggestionsIconContainer}>
                        <Image
                            source={require("../assets/train.png")}
                            style={styles.trainImg}
                        />
                        <Text style={styles.smallText}>Trains</Text>
                    </View>
                    <View style={{flex:1, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end'}}>
                        { trainTime != null ? 
                        <View>
                          <Text style={styles.price}>{trainPrice}</Text>
                          <Text style={{marginRight: 5}}><Text style={styles.time}>{trainTime}</Text> <Text style={styles.timeUnit}>min</Text></Text>
                        </View>
                        :
                        <Text style={styles.unavailable}>Not found</Text>
                        }
                    </View>
                </TouchableOpacity>
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
        height: 150,
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
    firstSuggestionOn: {
        backgroundColor: 'white',
        height: 50,
        flex: 1,
        flexDirection: 'row',
        borderTopLeftRadius: 10, 
        borderBottomColor: '#D3D3D3',
        borderBottomWidth: 1,
        flexDirection: 'row',
    },
    firstSuggestionOff: {
      backgroundColor: '#E8E8E8',
      height: 50,
      flex: 1,
      flexDirection: 'row',
      borderTopLeftRadius: 10, 
      borderBottomColor: '#D3D3D3',
      borderBottomWidth: 1,
      flexDirection: 'row',
    },
      secondSuggestionOn: {
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
      secondSuggestionOff: {
        backgroundColor: '#E8E8E8',
        height: 50,
        borderTopRightRadius: 10,
        flex: 1, 
        borderLeftColor: '#D3D3D3',
        borderLeftWidth: 1,
        flexDirection: 'row',
        borderBottomColor: '#D3D3D3',
        borderBottomWidth: 1,
      },
      thirdSuggestionOn: {
        backgroundColor: 'white',
        height: 50,
        flex: 1,
        flexDirection: 'row',
        borderBottomColor: '#D3D3D3',
        borderBottomWidth: 1,
      },
      thirdSuggestionOff: {
        backgroundColor: '#E8E8E8',
        height: 50,
        flex: 1,
        flexDirection: 'row',
        borderBottomColor: '#D3D3D3',
        borderBottomWidth: 1,
      },
      fourthSuggestionOn: {
        backgroundColor: 'white',
        height: 50,
        flex: 1, 
        borderLeftColor: '#D3D3D3',
        borderLeftWidth: 1,
        flexDirection: 'row',
        borderBottomColor: '#D3D3D3',
        borderBottomWidth: 1,
      },
      fourthSuggestionOff: {
        backgroundColor: '#E8E8E8',
        height: 50,
        flex: 1, 
        borderLeftColor: '#D3D3D3',
        borderLeftWidth: 1,
        flexDirection: 'row',
        borderBottomColor: '#D3D3D3',
        borderBottomWidth: 1,
      },
      fifthSuggestionOn: {
        backgroundColor: 'white',
        height: 50,
        flex: 1,
        flexDirection: 'row',
        borderBottomLeftRadius: 10,
      },
      fifthSuggestionOff: {
        backgroundColor: '#E8E8E8',
        height: 50,
        flex: 1,
        flexDirection: 'row',
        borderBottomLeftRadius: 10,
      },
      sixthSuggestionOn: {
        backgroundColor: 'white',
        height: 50,
        flex: 1, 
        borderLeftColor: '#D3D3D3',
        borderLeftWidth: 1,
        flexDirection: 'row',
        borderBottomRightRadius: 10,
      },
      sixthSuggestionOff: {
        backgroundColor: '#E8E8E8',
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
      carImg: {
        width: 34,
        height: 12,
        marginTop: 12,
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
        fontFamily: 'AvenirNext-Bold',
        fontSize: 12,
        color: '#787878',
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
      },
      unavailable: {
        fontFamily: 'AvenirNext-DemiBold',
        fontSize: 11,
        color: '#404040',
        marginRight: 15
      }
  });