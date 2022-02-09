import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  ImageBackground,
  Dimensions,
  TouchableOpacity,
  Button,
  Image,
} from "react-native";
import GooglePlacesInput from './GooglePlacesInput';
import MapView from "react-native-maps";
import { PROVIDER_GOOGLE } from "react-native-maps";
import SlidingUpPanel from 'rn-sliding-up-panel';

const windowHeight = Dimensions.get("window").height;

export default function LjubljanaTransport() {

  const [region, setRegion] = useState({
    latitude: 46.053730,
    longitude: 14.521310,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });
  const panelReference = React.createRef();
  const [origin, setOrigin] = useState(null);
  const [destination, setDestination] = useState(null);

  function placeFound(placeID){
    if(origin == null && destination == null) {
      setOrigin(placeID);
    }
    else if(origin != null && destination == null) {
      setDestination(placeID);
    }
    alert("heej");
  }

    return(
      <View style={styles.container}>
        <MapView 
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          initialRegion={region}
          mapPadding={{bottom: 50}}
        />
        <TouchableOpacity activeOpacity={1} style={styles.searchContainer} onPress={()=> {panelReference.current?.show(windowHeight*0.7)}} />

        <SlidingUpPanel ref={panelReference} backdropOpacity={0}>
          <View style={styles.slidingUpPanel}>
            <GooglePlacesInput style={styles.googleSearch} />
            <View style={styles.bgPanel} />
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
  searchContainer: {
    backgroundColor: 'white',
    height: 60,
    marginTop: -30,
    marginRight: 20,
    marginLeft: 20,
    borderRadius: 10,
    // Shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 2,  
    elevation: 5,
  },
  slidingUpPanel: {
    height: windowHeight*0.7,
  },
  bgPanel: {
    backgroundColor: '#009f48',
    height: '100%',
    marginTop: 25,
    borderRadius: 8,
  },
  googleSearch: {
    marginTop: 0
  },
});