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
import getDirections from 'react-native-google-maps-directions';
import * as Location from "expo-location";
import { Pedometer } from "expo-sensors";
import * as Battery from "expo-battery";

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
      latitudeDelta: 0.07,
      longitudeDelta: 0.07,
    });
    const [activityLocation, setActivityLocation] = useState(null);


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
    let URL = "http://192.168.56.1:8080/activity-advisor";
    // const json = JSON.stringify({ location: { latitude: (location == null) ? null : location.coords.latitude, longitude: (location == null) ? null : location.coords.longitude }, steps: pastStepCount, batteryPercentage: Math.round(batteryPercentage*100),  time: time, temperature: 24 });
    const json = JSON.stringify({
      location: { latitude: 46.063568, longitude: 14.54745 },
      temperature: 24,
      batteryPercentage: Math.round(batteryPercentage*100),
      time: time,

    });
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
        console.log(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
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
            }}
            style={{display: 'none'}}
            onPress={() => handleGetDirections()}
        />
        }
        </MapView>       
        <View style={styles.findActivityContainer}>
          <TouchableOpacity onPress={() => getActivity()} activeOpacity={0.95} style={styles.startContainer}>
            <View style={{width: 40}}>
              <Image source={require('../assets/idea.png')} style={styles.ideaImg} />
            </View>
            <View style={{flex: 1, marginRight: 3}}>
              <Text style={{fontSize: 20, fontWeight: 'bold', color: '#696969', fontFamily: 'AvenirNext-Bold', textAlign: 'center'}}>Find Activity</Text>
            </View>
            <View style={{width: 40}} />
          </TouchableOpacity>
        </View>
        <View style={styles.activityContainer}>
          <View style={activity ? {justifyContent: 'center', height: 45, alignItems: 'center'} : {display: 'none'}}><Text style={styles.activityHeader}>{activity}</Text></View>
          <View style={ message ? styles.activityTextContainer : { display: 'none' }}><Text style={{padding: 3}}>{message}</Text></View>
          <TouchableOpacity onPress={() => handleGetDirections()} style={ address ? styles.activityTextContainer : {display: 'none'}}>
            <Image source={require('../assets/location.png')} style={styles.locationImg} />
            <Text style={{marginLeft: 10, flex: 1, flexWrap: 'wrap'}}>{address}</Text>
          </TouchableOpacity>
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
    findActivityContainer: {
      height: 60,
      marginRight: 20,
      marginLeft: 20,
      marginTop: -30,
      // Shadow
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.5,
      shadowRadius: 2,  
      elevation: 2,
    },
    startContainer: {
      borderRadius: 10,
      backgroundColor: 'white',
      height: 60,
      borderBottomColor: '#D3D3D3',
      borderBottomWidth: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
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
    ljContainerBottom: {
      flex: 1,
      justifyContent: 'flex-end',
      alignItems: 'center',
      marginBottom: 20,
      marginTop: 190,
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
        backgroundColor: '#E8E8E8',
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
      activityHeader: {
        fontFamily: 'AvenirNext-DemiBold',
        fontSize: 17,
        color: '#404040',
        textAlign: 'center',
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
  });

// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import {
//   View,
//   Text,
//   StyleSheet,
//   ImageBackground,
//   Dimensions,
//   TouchableOpacity,
//   Image,
// } from "react-native";
// import * as Location from "expo-location";
// import { Pedometer } from "expo-sensors";
// import * as Battery from "expo-battery";
// import bg from "../assets/Activity_Advisor2.png";
// import Modal from "react-native-modal";
// import { PROVIDER_GOOGLE, Marker } from "react-native-maps";
// import MapView from "react-native-maps";

// const windowWidth = Dimensions.get("window").width;
// const windowHeight = Dimensions.get("window").height;

// export default function ActivityAdvisor() {
//   const [pastStepCount, setPastStepCount] = useState(0);
//   const [message, setMessage] = useState(null);
//   const [address, setAddress] = useState(null);
//   const [location, setLocation] = useState(null);
//   const [batteryPercentage, setBatteryPercentage] = useState(null);
//   const [isModalVisible, setModalVisible] = useState(false);
//   const [region, setRegion] = useState({
//     latitude: null,
//     longitude: null,
//     latitudeDelta: 0.05,
//     longitudeDelta: 0.05,
//   });

//   const openModal = () => {
//     setModalVisible(true);
//   };

//   const closeModal = () => {
//     setModalVisible(false);
//     setRegion({
//       latitude: null,
//       longitude: null,
//       latitudeDelta: 0.05,
//       longitudeDelta: 0.05,
//     });
//     setMessage(null);
//     setAddress(null);
//   };

//   let _subscription;

//   const _subscribe = () => {
//     // Steps
//     Pedometer.isAvailableAsync().then(
//       (result) => {
//         console.log(result);
//       },
//       (error) => {
//         console.log("Could not get isPedometerAvailable: " + error);
//       }
//     );

//     const end = new Date();
//     const start = new Date();
//     start.setDate(end.getDate() - 1);
//     Pedometer.getStepCountAsync(start, end).then(
//       (result) => {
//         setPastStepCount(result.steps);
//       },
//       (error) => {
//         console.log("Could not get stepCount: " + error);
//       }
//     );
//   };

//   const _subscribeBattery = async () => {
//     // Battery
//     const batteryLevel = await Battery.getBatteryLevelAsync();
//     setBatteryPercentage(batteryLevel);
//     _subscription = Battery.addBatteryLevelListener(({ batteryLevel }) => {
//       setBatteryPercentage(batteryLevel);
//     });
//   };

//   const _unsubscribe = () => {
//     _subscription && _subscription.remove();
//     _subscription = null;
//   };

//   useEffect(() => {
//     // Location
//     (async () => {
//       let { status } = await Location.requestForegroundPermissionsAsync();
//       if (status !== "granted") {
//         console.log("Permission to access location was denied");
//         return;
//       }

//       let location = await Location.getCurrentPositionAsync({});
//       setLocation(location);
//       console.log(location);
//     })();
//     // Steps
//     _subscribe();
//     // Battery
//     _subscribeBattery();
//     return () => _unsubscribe();
//   }, []);

//   function getActivity() {
//     let date = new Date();
//     let time = date.getHours() + ":" + (date.getMinutes()<10?'0':'') + + date.getMinutes();
//     console.log(time);
//     let URL = "http://172.22.80.1:8080/activity-advisor";
//     // const json = JSON.stringify({ location: { latitude: (location == null) ? null : location.coords.latitude, longitude: (location == null) ? null : location.coords.longitude }, steps: pastStepCount, batteryPercentage: Math.round(batteryPercentage*100),  time: time, temperature: 24 });
//     const json = JSON.stringify({
//       location: { latitude: 46.063568, longitude: 14.54745 },
//       temperature: 24,
//       batteryPercentage: Math.round(batteryPercentage*100),
//       time: time,

//     });
//     axios.defaults.headers.common["X-Context"] = json;
//     axios
//       .get(URL)
//       .then(function (response) {
//         setMessage(response.data.message);
//         setAddress(response.data.address);
//         setRegion({
//           latitude: response.data.location.latitude,
//           longitude: response.data.location.longitude,
//           latitudeDelta: 0.05,
//           longitudeDelta: 0.05,
//         });
//         console.log(response.data);
//       })
//       .catch(function (error) {
//         console.log(error);
//       });
//     openModal();
//   }

//   return (
//     <ImageBackground source={bg} style={styles.backgroundStyle}>
//       <TouchableOpacity
//         style={styles.bellContainer}
//         onPress={() => getActivity()}
//       >
//         <Image source={require("../assets/bell.png")} style={styles.bell} />
//       </TouchableOpacity>
//       {
//         // (location != null) ? // because location doesn't work on emulator, uncomment in production
//         true ? (
//           <Modal isVisible={isModalVisible} onBackdropPress={closeModal}>
//             <View style={styles.modal}>
//               <TouchableOpacity onPress={closeModal}>
//                 <Image
//                   source={require("../assets/close1.png")}
//                   style={styles.close}
//                 />
//               </TouchableOpacity>
//               <View style={styles.modalContainer}>
//                 <Text style={styles.headerText}>Suggested activity</Text>
//                 <Text style={styles.msg}>{message}</Text>
//                 {region.latitude != null && region.longitude != null ? (
//                   <MapView
//                     style={styles.map}
//                     provider={PROVIDER_GOOGLE}
//                     initialRegion={region}
//                   >
//                     <Marker
//                       coordinate={{
//                         latitude: region.latitude,
//                         longitude: region.longitude,
//                       }}
//                     />
//                   </MapView>
//                 ) : (
//                   <Text>Loading...</Text>
//                 )}
//                 {address && <Text>It's located on {address}</Text>}
//               </View>
//             </View>
//           </Modal>
//         ) : (
//           <Modal isVisible={isModalVisible} onBackdropPress={closeModal}>
//             <View style={styles.modal}>
//               <TouchableOpacity onPress={closeModal}>
//                 <Image
//                   source={require("../assets/close1.png")}
//                   style={styles.close}
//                 />
//               </TouchableOpacity>
//               <Text style={styles.headerText}>Suggested activity</Text>
//               <Text style={styles.msg}>{message}</Text>
//               <Image
//                 source={require("../assets/enjoy.jpg")}
//                 style={styles.enjoy}
//               />
//             </View>
//           </Modal>
//         )
//       }
//     </ImageBackground>
//   );
// }
// const styles = StyleSheet.create({
//   btn: {
//     justifyContent: "center",
//   },
//   backgroundStyle: {
//     flex: 1,
//     width: windowWidth,
//     height: windowWidth,
//     marginTop: windowHeight * 0.135,
//   },
//   bellContainer: {
//     width: 50,
//     height: 50,
//     marginTop: windowWidth * 0.455,
//     marginLeft: windowWidth * 0.25,
//   },
//   bell: {
//     width: 50,
//     height: 50,
//   },
//   modalContainer: {
//     paddingLeft: 15,
//     paddingRight: 15,
//   },
//   modal: {
//     width: windowWidth * 0.9,
//     backgroundColor: "white",
//   },
//   close: {
//     width: 20,
//     height: 20,
//     marginRight: 8,
//     marginTop: 8,
//     alignSelf: "flex-end",
//   },
//   headerText: {
//     fontSize: 25,
//     fontWeight: "bold",
//     alignSelf: "center",
//     marginBottom: 15,
//   },
//   msg: {
//     marginBottom: 15,
//   },
//   map: {
//     height: "50%",
//     width: "100%",
//     marginBottom: 10,
//   },
//   enjoy: {
//     width: 200,
//     height: 200,
//     alignSelf: "center",
//   },
// });
