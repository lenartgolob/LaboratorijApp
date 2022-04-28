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
    Animated, 
    Easing, 
  } from "react-native";
import axios from "axios";
import MapView, { Polyline } from "react-native-maps";
import { PROVIDER_GOOGLE, Marker } from "react-native-maps";
import {BoxShadow} from 'react-native-shadow';
import { useSelector, useDispatch } from "react-redux";
import { setOrigin, setOriginAddress, setDestination, setDestinationAddress } from "../redux/actions";
import getDirections from 'react-native-google-maps-directions';
import * as Location from "expo-location";
import { Pedometer } from "expo-sensors";
import * as Battery from "expo-battery";
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import SlidingUpPanel from 'rn-sliding-up-panel';


const windowHeight = Dimensions.get("window").height;
const windowWidth = Dimensions.get("window").width;

export default function DisplayTransport({route, navigation}) {

    const googleMapsKey = require('../config.json').googleMapsKey;

    const [pastStepCount, setPastStepCount] = useState(0);
    const [message, setMessage] = useState(null);
    const [activity, setActivity] = useState(null);
    const [address, setAddress] = useState(null);
    const [location, setLocation] = useState(null);
    const [batteryPercentage, setBatteryPercentage] = useState(null);
    const [region, setRegion] = useState({
      latitude: 46.053730,
      longitude: 14.521310,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    });
    const [activityLocation, setActivityLocation] = useState(null);
    const [logoVisible, setLogoVisible] = useState(true);

    const panelReference = React.createRef();

    const GooglePlacesInput = () => {
      return (
        <GooglePlacesAutocomplete
          onPress={(data, details = null) => {
            console.log(data);
          }}
          query={{
              key: googleMapsKey,
              language: 'en',
              location: '46.053730, 14.521310',
              radius: '8000', 
              components: 'country:SI',
              strictbounds: true,
          }}
          nearbyPlacesAPI="GooglePlacesSearch" // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch
          renderLeftButton={()  => <Image source={require('../assets/search.png')} style={stylesGoogleInputIOS.search} />}
          styles={ Platform.OS === 'ios' ? stylesGoogleInputIOS : stylesGoogleInputAndroid}
        />
      );
    };

  let _subscription;

  const _subscribe = () => {
    // Steps
    Pedometer.isAvailableAsync().then(
      (result) => {
        console.log(result);
      },
      (error) => {
        console.log("Could not get isPedometerAvailable: " + error);
      }
    );

    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - 1);
    Pedometer.getStepCountAsync(start, end).then(
      (result) => {
        setPastStepCount(result.steps);
      },
      (error) => {
        console.log("Could not get stepCount: " + error);
      }
    );
  };

  const _subscribeBattery = async () => {
    // Battery
    const batteryLevel = await Battery.getBatteryLevelAsync();
    setBatteryPercentage(batteryLevel);
    _subscription = Battery.addBatteryLevelListener(({ batteryLevel }) => {
      setBatteryPercentage(batteryLevel);
    });
  };

  const _unsubscribe = () => {
    _subscription && _subscription.remove();
    _subscription = null;
  };

  useEffect(() => {
    // Location
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
      console.log(location);
    })();
    // Steps
    _subscribe();
    // Battery
    _subscribeBattery();
    return () => _unsubscribe();
  }, []);

  function getActivity() {
    setActivity(null);
    setAddress(null);
    setMessage(null);
    setActivityLocation(null);
    let date = new Date();
    let time = date.getHours() + ":" + (date.getMinutes()<10?'0':'') + + date.getMinutes();
    console.log(time);
    let URL = "http://130.61.179.62:8080/activity-advisor";
    // const json = JSON.stringify({ location: { latitude: (location == null) ? null : location.coords.latitude, longitude: (location == null) ? null : location.coords.longitude }, steps: pastStepCount, batteryPercentage: Math.round(batteryPercentage*100), temperature: 24 });
    const json = JSON.stringify({
      location: { latitude: 46.063568, longitude: 14.54745 },
      temperature: 24,
    });
    try {
      axios.defaults.headers.common["X-Context"] = json;
      axios
        .get(URL)
        .then(function (response) {
          setMessage(response.data.message);
          setAddress(response.data.address);
          setActivity(response.data.name);
          setActivityLocation({          
            latitude: response.data.location.latitude,
            longitude: response.data.location.longitude,
          });
        })
    } catch (err) {
      if (_.get(err, 'response.status') === HttpStatus.NOT_FOUND) {
        throw new errors.BadRequestError(`Project with id: ${projectId} doesn't exist`)
      } else {
        // re-throw other error
        throw err
      }
    }
  }

  function getActivityFromLocation() {
    if(Platform.OS === 'ios') {
      panelReference.current?.show(windowHeight*0.7);
    } else {
      panelReference.current?.show(windowHeight*0.53);
    }
    setActivity(null);
    setAddress(null);
    setMessage(null);
    setActivityLocation(null);
    let date = new Date();
    let time = date.getHours() + ":" + (date.getMinutes()<10?'0':'') + + date.getMinutes();
    console.log(time);
    let URL = "http://130.61.179.62:8080/activity-advisor";
    // const json = JSON.stringify({ location: { latitude: (location == null) ? null : location.coords.latitude, longitude: (location == null) ? null : location.coords.longitude }, steps: pastStepCount, batteryPercentage: Math.round(batteryPercentage*100), temperature: 24 });
    const json = JSON.stringify({
      location: { latitude: 46.063568, longitude: 14.54745 },
      temperature: 24,
    });
    try {
      axios.defaults.headers.common["X-Context"] = json;
      axios
        .get(URL)
        .then(function (response) {
          setMessage(response.data.message);
          setAddress(response.data.address);
          setActivity(response.data.name);
          setActivityLocation({          
            latitude: response.data.location.latitude,
            longitude: response.data.location.longitude,
          });
        })
    } catch (err) {
      if (_.get(err, 'response.status') === HttpStatus.NOT_FOUND) {
        throw new errors.BadRequestError(`Project with id: ${projectId} doesn't exist`)
      } else {
        // re-throw other error
        throw err
      }
    }
  }

  const mapRef = useRef();

  useEffect(() => {
    if (mapRef.current) {
      // list of _id's must same that has been provided to the identifier props of the Marker
      mapRef.current.fitToSuppliedMarkers(['activityLocation'], { 
        edgePadding: 
        { 
          top: 500,
          right: 500,
          bottom: 500,
          left: 500 
        }
      });
    }
  }, [activityLocation]);

  function handleGetDirections() {
    const data = {
      source: {
        latitude: location.latitude,
        longitude: location.longitude,
      },
      destination: {
        latitude: activityLocation.latitude,
        longitude: activityLocation.longitude,
      },
      params: [
        {
          key: "dir_action",
          value: "navigate"
        }
      ],
    }
    getDirections(data)
  }

  function back() {
    navigation.navigate("LandingPage");
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
        { activityLocation &&
        <Marker
          key={'activityLocation'}
          identifier={'activityLocation'}
          coordinate={{
            latitude: activityLocation.latitude,
            longitude: activityLocation.longitude,
            latitudeDelta: 0.07,
            longitudeDelta: 0.07,
            }}
            style={{display: 'none'}}
            onPress={() => handleGetDirections()}
        />
        }
        </MapView> 
        <TouchableOpacity style={styles.back} onPress={() => back()}>
          <Image
            source={require("../assets/back.png")}
            style={styles.backImg}
          />
        </TouchableOpacity>    
        <View style={styles.findActivityContainer}>
          <TouchableOpacity onPress={() => getActivity()} activeOpacity={0.95} style={styles.startContainerTop}>
            <View style={{width: 40}}>
              <Image source={require('../assets/idea.png')} style={styles.ideaImg} />
            </View>
            <View style={{flex: 1, marginRight: 3}}>
              <Text style={Platform.OS === 'ios' ? {fontSize: 16, fontWeight: 'bold', color: '#696969', fontFamily: 'AvenirNext-Bold', textAlign: 'center'} : {fontSize: 20, fontWeight: 'bold', color: '#696969', textAlign: 'center'}}>Find Activity Near Me</Text>
            </View>
            <View style={{width: 40}} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => getActivityFromLocation()} activeOpacity={0.95} style={styles.startContainerBottom}>
            <View style={{width: 40}}>
              <Image source={require('../assets/AB2.png')} style={styles.searchImg} />
            </View>
            <View style={{flex: 1, marginRight: 3}}>
              <Text style={Platform.OS === 'ios' ? {fontSize: 16, fontWeight: 'bold', color: '#696969', fontFamily: 'AvenirNext-Bold', textAlign: 'center'} : {fontSize: 20, fontWeight: 'bold', color: '#696969', textAlign: 'center'}}>Find Activity Near Location</Text>
            </View>
            <View style={{width: 40}} />
          </TouchableOpacity>
        </View>

        <View style={styles.activityContainer}>
          <View style={activity ? {justifyContent: 'center', height: 45, alignItems: 'center'} : {display: 'none'}}>
            <Text style={Platform.OS === 'ios' ? styles.activityHeaderIOS : styles.activityHeaderAndroid}>{activity}</Text>
          </View>
          <View style={ message ? styles.activityTextContainer : { display: 'none' }}><Text style={{padding: 3}}>{message}</Text></View>
          <TouchableOpacity onPress={() => handleGetDirections()} style={ address ? styles.activityTextContainer : {display: 'none'}}>
            <Image source={require('../assets/location.png')} style={styles.locationImg} />
            <Text style={{marginLeft: 10, flex: 1, flexWrap: 'wrap'}}>{address}</Text>
          </TouchableOpacity>
        </View>
        <View style={logoVisible ? styles.ljContainer : {display: 'none'}}>
          <Image
            source={require("../assets/ljubljana.png")}
            style={styles.lj}
          />
        </View>
        <SlidingUpPanel ref={panelReference} style={{display: 'none'}} backdropOpacity={0} onDragStart={()=> {setLogoVisible(false)}} onBottomReached={()=> {setLogoVisible(true)}}>
          <View style={styles.slidingUpPanel}>
            <GooglePlacesInput style={styles.googleSearch} />
            <View style={ Platform.OS === 'ios' ? styles.bgPanelIOS : styles.bgPanelAndroid } />
          </View>
        </SlidingUpPanel>
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
    slidingUpPanel: {
      height: windowHeight*0.7,
      // marginTop: 50,
    },
    bgPanelAndroid: {
      backgroundColor: '#009f48',
      height: '100%',
      marginTop: 35,
      borderRadius: 8,
    },
    bgPanelIOS: {
      backgroundColor: '#009f48',
      height: '100%',
      marginTop: 25,
      borderRadius: 8,
    },
    findActivityContainer: {
      height: 100,
      marginRight: 20,
      marginLeft: 20,
      marginTop: -50,
      // Shadow
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.5,
      shadowRadius: 2,  
    },
    startContainerTop: {
      borderTopLeftRadius: 10,
      borderTopRightRadius: 10,
      backgroundColor: 'white',
      height: 50,
      borderBottomColor: '#D3D3D3',
      borderBottomWidth: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    startContainerBottom: {
      borderBottomLeftRadius: 10,
      borderBottomRightRadius: 10,
      backgroundColor: 'white',
      height: 50,
      borderBottomColor: '#D3D3D3',
      borderBottomWidth: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    searchImg: {
      width: 37,
      height: 37,
      marginLeft: 5,
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
    ideaImg: {
      width: 40,
      height: 40,
      marginLeft: 7,
    },
      activityContainer: {
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
      activityHeaderIOS: {
        fontFamily: 'AvenirNext-DemiBold',
        fontSize: 17,
        color: '#404040',
        textAlign: 'center',
        flexDirection: 'row',
        alignItems: 'center',
      },
      activityHeaderAndroid: {
        fontSize: 17,
        color: '#404040',
        textAlign: 'center',
        flexDirection: 'row',
        alignItems: 'center',
      },
      activityTextContainer: {
        borderTopWidth: 1, 
        borderTopColor: '#D3D3D3', 
        alignItems: 'center', 
        flexDirection: 'row',
        padding: 5,
      },
      locationImg: {
        height: 30,
        width: 30,
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

  const stylesGoogleInputIOS = StyleSheet.create({
    container: {
      zIndex: 10,
      overflow: 'visible',
      height: 50,
      flexGrow: 0,
      flexShrink: 0
    },
    textInputContainer: {
      borderTopWidth: 0,
      borderBottomWidth: 0,
      height: 50,
      overflow: 'visible',
      backgroundColor: 'white',
      borderColor: 'white',
      borderRadius: 10,
      marginRight: 20,
      marginLeft: 20,
      // Shadow
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.5,
      shadowRadius: 2,  
      elevation: 5,
    },
    textInput: {
      backgroundColor: 'transparent',
      fontSize: 18,
      lineHeight: 22.5,
      paddingBottom: 0,
      flex: 1,
    },
    listView: {
      position: 'absolute',
      top: 60,
      left: 10,
      right: 10,
      backgroundColor: 'white',
      borderRadius: 5,
      flex: 1,
      elevation: 3,
      zIndex: 10,
      marginRight: 12,
      marginLeft: 12,
    },
    description: {
      color: 'black'
    },
    predefinedPlacesDescription: {
      color: 'black'
    },
    search: {
      marginTop: 12,
      width: 31,
      height: 31,
      marginLeft: 5,
    },
  });
  
  const stylesGoogleInputAndroid = StyleSheet.create({
    textInputContainer: {
      borderTopWidth: 0,
      borderBottomWidth: 0,
      height: 50,
      overflow: 'visible',
      backgroundColor: 'white',
      borderColor: 'white',
      borderRadius: 10,
      marginRight: 20,
      marginLeft: 20,
      elevation: 5,
    },
    textInput: {
      backgroundColor: 'transparent',
      fontSize: 18,
      lineHeight: 22.5,
      paddingBottom: 0,
      flex: 1,
    },
    listView: {
      position: 'absolute',
      top: 60,
      left: 10,
      right: 10,
      backgroundColor: 'white',
      borderRadius: 5,
      flex: 1,
      elevation: 3,
      zIndex: 10,
      marginRight: 12,
      marginLeft: 12,
    },
    description: {
      color: 'black'
    },
    predefinedPlacesDescription: {
      color: 'black'
    },
    search: {
      marginTop: 12,
      width: 75,
      height: 30,
      marginLeft: 5,
    },
  });