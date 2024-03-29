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
    const [taxis, setTaxis] = useState([]);

    const get_all_taxis = async () => {
      let URL = "http://130.61.179.62:8080/ljubljana-transport/taxis";
      const json = JSON.stringify({
          origin: origin,
          destination: destination,     
        });
        axios.defaults.headers.common["X-Context"] = json;
        axios
          .get(URL)
          .then(function (response) {
            console.log(response.data);
            setTaxis(response.data);
          })
          .catch(function (error) {
            console.log(error);
          });
  }

    useEffect(() => {
        get_all_taxis();
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

    function call(phoneNumber) {
        Linking.openURL(`tel:${phoneNumber}`)
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
        <TouchableOpacity style={styles.back} onPress={() => back()}>
          <Image
            source={require("../assets/back.png")}
            style={styles.backImg}
          />
        </TouchableOpacity>        
        <View style={styles.taxiContainer}>
          <View activeOpacity={1} style={styles.startContainer}>
            <View style={{width: 30}}>
              <Image source={require('../assets/taxi.png')} style={styles.taxiImg} />
            </View>
            <View style={{flex: 1, marginRight: 3, alignItems: 'center'}}>
              <Text style={Platform.OS === 'ios' ? {fontSize: 20, fontWeight: 'bold', color: '#989898', fontFamily: 'AvenirNext-Bold', marginTop: 3} : {fontSize: 20, fontWeight: 'bold', color: '#989898', marginTop: 3}}>Taxis</Text>
            </View>
            <View style={{width: 30}} />
          </View>
        </View>
        <ScrollView>
          {
            taxis.map(function(taxi, index) {
              return <View key={taxi.name} style={ index == 0 ? styles.taxiInfoContainerFirst : styles.taxiInfoContainer}>
                <View style={{justifyContent: 'center', height: 40}}><Text style={Platform.OS === 'ios' ? styles.taxiHeaderIOS : styles.taxiHeaderAndroid}>{taxi.name}</Text></View>
                <TouchableOpacity onPress={() => call(taxi.phoneNumber)} style={styles.taxiTextContainer}>
                    <Image source={require('../assets/call.png')} style={styles.callImg} />
                    <Text style={Platform.OS === 'ios' ? styles.taxiTextIOS : styles.taxiTextAndroid}>{taxi.phoneNumber}</Text>
                </TouchableOpacity>
                <View style={styles.taxiTextContainer}>
                    <Image source={require('../assets/email.png')} style={styles.callImg} />
                    <Text selectable={true} style={styles.taxiText}>{taxi.email}</Text>
                </View>
              </View>;
            })
          }
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
    taxiContainer: {
      height: 60,
      borderRadius: 5,
      marginRight: 50,
      marginLeft: 50,
      marginTop: -27.5,
      // Shadow
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.5,
      shadowRadius: 2,  
      elevation: 2,
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
    taxiImg: {
      width: 25,
      height: 25,
      marginLeft: 7,
    },
    taxiInfoContainer: {
      backgroundColor: 'white',
      borderRadius: 5,
      marginRight: 50,
      marginLeft: 50,
      marginTop: 10,
      // Shadow
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.5,
      shadowRadius: 2,  
      elevation: 2,
    },
    taxiInfoContainerFirst: {
      backgroundColor: 'white',
      borderRadius: 5,
      marginRight: 50,
      marginLeft: 50,
      marginTop: 20,
      // Shadow
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.5,
      shadowRadius: 2,  
      elevation: 2,
    },
    taxiHeaderIOS: {
      fontFamily: 'AvenirNext-DemiBold',
      fontSize: 17,
      color: '#404040',
      textAlign: 'center',
    },
    taxiHeaderAndroid: {
      fontSize: 17,
      color: '#404040',
      textAlign: 'center',
    },
    taxiTextContainer: {
        borderTopWidth: 1, 
        borderTopColor: '#D3D3D3', 
        height: 35, 
        alignItems: 'center', 
        flexDirection: 'row',
    },
    taxiTextIOS: {
      fontFamily: 'AvenirNext-DemiBold',
      fontSize: 15,
      color: '#707070',
      marginLeft: 15,
    },
    taxiTextAndroid: {
      fontSize: 15,
      color: '#707070',
      marginLeft: 15,
    },
    callImg: {
        height: 20,
        width: 20,
        marginLeft: 5,
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
  });