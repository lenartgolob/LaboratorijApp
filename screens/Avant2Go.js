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
    Linking,
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

export default function Taxis({navigation}) {

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
    const [startingStation, setStartingStation] = useState();
    const [finishStation, setFinishStation] = useState();
    const [startingStationTitle, setStartingStationTitle] = useState();
    const [finishStationTitle, setFinishStationTitle] = useState();
    const [startingStationLat, setStartingStationLat] = useState(0);
    const [finishStationLat, setFinishStationLat] = useState(0);
    const [startingStationLng, setStartingStationLng] = useState(0);
    const [finishStationLng, setFinishStationLng] = useState(0);
    const [time1, setTime1] = useState();
    const [time2, setTime2] = useState();
    const [time3, setTime3] = useState();

    const getCarsharingPath = async () => {
      let URL = "http://130.61.179.62:8080/ljubljana-transport/carsharing";
        axios
          .get(URL)
          .then(function (response) {
            console.log(response.data);
            setStartingStation(response.data.startingStation.addressLine1);
            setFinishStation(response.data.finishStation.addressLine1);
            setStartingStationTitle(response.data.startingStation.title);
            setFinishStationTitle(response.data.finishStation.title);
            setStartingStationLat(response.data.startingStation.latitude);
            setFinishStationLat(response.data.finishStation.latitude);
            setStartingStationLng(response.data.startingStation.longitude);
            setFinishStationLng(response.data.finishStation.longitude);
            setTime1(response.data.originToStation.duration.text);
            setTime2(response.data.stationToStation.duration.text);
            setTime3(response.data.stationToDestination.duration.text);

          })
          .catch(function (error) {
            console.log(error);
          });
  }

    useEffect(() => {
        getCarsharingPath();
        // Get coordinates of origin and destination
        getCoordinatesFromPlaceID(origin, true);
        getCoordinatesFromPlaceID(destination, false);

      }, []);

      const mapRef = useRef();

      useEffect(() => {
        if (mapRef.current) {
          // list of _id's must same that has been provided to the identifier props of the Marker
          mapRef.current.fitToSuppliedMarkers(['origin','destination'], { 
            edgePadding: 
            { 
              top: 50,
              right: 50,
              bottom: 50,
              left: 50 
            }
          });
        }
      }, [originCoordinates, destinationCoordinates, startingStationLat, finishStationLat]);

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

    function handleGetDirections(mode, lat1, lng1, lat2, lng2) {
        const data = {
          source: {
            latitude: lat1,
            longitude: lng1,
          },
          destination: {
            latitude: lat2,
            longitude: lng2,
          },
          params: [
            {
                key: "travelmode",
                value: mode  
            },
            {
              key: "dir_action",
              value: "navigate"
            }
          ],
        }
        getDirections(data)
      }

    function back() {
      navigation.navigate("DisplayTransport");
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
          {(startingStationLat != 0) &&
          <Marker 
            key={'startingStation'}
            identifier={'startingStation'}
            coordinate={{
            latitude: startingStationLat,
            longitude: startingStationLng,
            }}
            >
                <View style={{width: 7, height: 7, borderRadius: Math.round(windowHeight+windowWidth)/2, backgroundColor: '#006400' }}></View>
            </Marker>
          }


          {(finishStationLat != 0) &&
            <Marker 
                key={'finishStation'}
                identifier={'finishStation'}
                coordinate={{
                latitude: finishStationLat,
                longitude: finishStationLng,
                }}
            >
                <View style={{width: 7, height: 7, borderRadius: Math.round(windowHeight+windowWidth)/2, backgroundColor: '#006400' }}></View>
            </Marker>
          }
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
              { latitude: startingStationLat, longitude: startingStationLng },
            ]}
            strokeColor="#77ca9d"
            strokeWidth={3}
          />
            <Polyline
                coordinates={[
                { latitude: startingStationLat, longitude: startingStationLng },
                { latitude: finishStationLat, longitude: finishStationLng },
                ]}
                strokeColor="#77ca9d"
                strokeWidth={3}
            />
            <Polyline
                coordinates={[
                { latitude: finishStationLat, longitude: finishStationLng },
                { latitude: destinationCoordinates.lat, longitude: destinationCoordinates.lng },
                ]}
                strokeColor="#77ca9d"
                strokeWidth={3}
            />
        </MapView>    
        <TouchableOpacity style={styles.back} onPress={() => back()}>
          <Image
            source={require("../assets/back.png")}
            style={styles.backImg}
          />
        </TouchableOpacity>        
        <Image
            source={require("../assets/avant.png")}
            style={styles.avant2GoContainer}
        />
        <ScrollView>
            <View style={styles.directionsContainerTop}>
                <View style={{justifyContent: 'center', padding: 8, paddingLeft: 15, paddingRight: 15}}>
                    <Text style={Platform.OS === 'ios' ? styles.directionHeaderIOS : styles.directionHeaderAndroid}>1. Head to Avant2Go {startingStationTitle} station and rent a car.</Text>
                </View>
                <View style={styles.addressContainer}>
                    <TouchableOpacity onPress={() => handleGetDirections("walking", originCoordinates.lat, originCoordinates.lng, startingStationLat, startingStationLng)} style={styles.directionsTextContainer}>
                        <Image source={require('../assets/location.png')} style={styles.locationImg} />
                        <Text style={{marginLeft: 10, flex: 1, flexWrap: 'wrap'}}>{startingStation}</Text>
                    </TouchableOpacity>
                    <View style={{flexDirection: 'row', alignItems: 'center', width: '30%', borderLeftWidth: 1, borderLeftColor: '#D3D3D3', marginLeft: 10, paddingLeft: 10}}>
                        <Image source={require('../assets/walkman.png')} style={styles.walkingImg} />
                        <Text style={{marginLeft: 10}}>{time1}</Text>
                    </View>
                </View>
            </View>

            <View style={styles.directionsContainer}>
                <View style={{justifyContent: 'center', padding: 8, paddingLeft: 15, paddingRight: 15}}>
                    <Text style={Platform.OS === 'ios' ? styles.directionHeaderIOS : styles.directionHeaderAndroid}>2. Drive to {finishStationTitle} station and return the car.</Text>
                </View>
                <View style={styles.addressContainer}>
                    <TouchableOpacity onPress={() => handleGetDirections("driving", startingStationLat, startingStationLng, finishStationLat, finishStationLng)} style={styles.directionsTextContainer}>
                        <Image source={require('../assets/location.png')} style={styles.locationImg} />
                        <Text style={{marginLeft: 10, flex: 1, flexWrap: 'wrap'}}>{finishStation}</Text>
                    </TouchableOpacity>
                    <View style={{flexDirection: 'row', alignItems: 'center', width: '30%', borderLeftWidth: 1, borderLeftColor: '#D3D3D3', marginLeft: 10, paddingLeft: 10}}>
                        <Image source={require('../assets/car.png')} style={styles.carImg} />
                        <Text style={{marginLeft: 10}}>{time2}</Text>
                    </View>
                </View>
            </View>

            <View style={styles.directionsContainer}>
                <View style={{justifyContent: 'center', padding: 8, paddingLeft: 15, paddingRight: 15}}>
                    <Text style={Platform.OS === 'ios' ? styles.directionHeaderIOS : styles.directionHeaderAndroid}>3. Walk to your destination.</Text>
                </View>
                <View style={styles.addressContainer}>
                    <TouchableOpacity onPress={() => handleGetDirections("walking", finishStationLat, finishStationLng, destinationCoordinates.lat, destinationCoordinates.lng)} style={styles.directionsTextContainer}>
                        <Image source={require('../assets/location.png')} style={styles.locationImg} />
                        <Text style={{marginLeft: 10, flex: 1, flexWrap: 'wrap'}}>{destinationAddress}</Text>
                    </TouchableOpacity>
                    <View style={{flexDirection: 'row', alignItems: 'center', width: '30%', borderLeftWidth: 1, borderLeftColor: '#D3D3D3', marginLeft: 10, paddingLeft: 10}}>
                        <Image source={require('../assets/walkman.png')} style={styles.walkingImg} />
                        <Text style={{marginLeft: 10}}>{time3}</Text>
                    </View>
                </View>
            </View>

            <View style={styles.ljContainer}>
            <Image
                source={require("../assets/ljubljana.png")}
                style={styles.lj}
            />
            </View>
        </ScrollView>
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
    avant2GoContainer: {
      height: 85,
      width: 180,
      borderRadius: 5,
      marginTop: -42.5,
      marginLeft: (windowWidth-180)/2,
    },
    startContainer: {
      backgroundColor: 'white',
      height: 55,
      borderRadius: 5,
      flexDirection: 'row',
      alignItems: 'center',
    },
    ljContainer: {
      justifyContent: 'flex-end',
      alignItems: 'center',
      flex: 1,
      marginBottom: 20,
      marginTop: 25,
    },
    lj: {
      width: 50,
      height: 61,
    },
    carImg: {
        width: 34,
        height: 13,
    },
    back: {
      position: 'absolute', 
      left: 15, 
      top: 35, 
      backgroundColor: '#E8E8E8', 
      borderRadius: 5, 
      paddingRight: 5,
      paddingLeft: 2, 
      paddingTop: 3, 
      paddingBottom: 3,
      borderColor: '#404040',
      borderWidth: 2
    },
    backImg: {
      height: 22,
      width: 22,
    },
    directionsContainer: {
        backgroundColor: 'white',
        marginRight: 20,
        marginLeft: 20,
        marginTop: 12,
        borderRadius: 5,
        // Shadow
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.5,
        shadowRadius: 2,  
        elevation: 2,
      },
      directionsContainerTop: {
        backgroundColor: 'white',
        marginRight: 20,
        marginLeft: 20,
        marginTop: 30,
        borderRadius: 5,
        // Shadow
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.5,
        shadowRadius: 2,  
        elevation: 2,
      },
      locationImg: {
        height: 30,
        width: 30,
        marginLeft: 5,
      },
      walkingImg: {
        width: 14,
        height: 23,
      },
      directionsTextContainer: {
        alignItems: 'center', 
        flexDirection: 'row',
        padding: 5,
        width: '65%'
      },
      addressContainer: {
        borderTopWidth: 1, 
        borderTopColor: '#D3D3D3', 
        flexDirection: 'row',
      },
      directionHeaderIOS: {
        fontFamily: 'AvenirNext-DemiBold',
        fontSize: 15,
        color: '#404040',
        flexDirection: 'row',
      },
      directionHeaderAndroid: {
        fontSize: 15,
        color: '#404040',
        textAlign: 'left',
      },
  });