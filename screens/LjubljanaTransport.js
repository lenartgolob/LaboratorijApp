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
  const [logoVisible, setLogoVisible] = useState(true);

  function placeFound(placeID){
    if(origin == null && destination == null) {
      setOrigin(placeID);
    }
    else if(origin != null && destination == null) {
      setDestination(placeID);
    }
    else if(origin != null && destination != null) {
      // Gre na novo stran
    }
  }

  function getMeSomewhere() {
    panelReference.current?.show(windowHeight*0.7);
    setOrigin(null);
    setDestination(null);
  }

  function getMeHome(){
    alert("In development")
  }

  function getMeToWork(){
    alert("In development")
  }

    return(
      <View style={styles.container}>
        <MapView 
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          initialRegion={region}
          mapPadding={{bottom: 50}}
        />
        <View style={styles.multiSearchContainer}>
          <TouchableOpacity activeOpacity={1} style={styles.searchContainer} onPress={()=> getMeSomewhere()}>
            <Image source={require('../assets/AB.png')} style={styles.search} />
          </TouchableOpacity>
          <View style={{flexDirection:"row"}}>
            <TouchableOpacity activeOpacity={1} style={styles.homeContainer} onPress={()=> getMeHome()}>
              <Image source={require('../assets/home.png')} style={styles.search} />
              <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <Text style={{fontSize: 16, fontWeight: 'bold', color: '#808080'}}>Get me home</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={1} style={styles.workContainer} onPress={()=> getMeToWork()}>
              <Image source={require('../assets/work.png')} style={styles.search} />
            </TouchableOpacity>
          </View>
        </View>
        <View style={logoVisible ? styles.ljContainer : {display: 'none'}}>
          <Image
            source={require("../assets/ljubljana.png")}
            style={styles.lj}
          />
        </View>
        <SlidingUpPanel ref={panelReference} backdropOpacity={0} onDragStart={()=> {setLogoVisible(false)}} onBottomReached={()=> {setLogoVisible(true)}}>
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
  multiSearchContainer: {
    height: 100,
    marginRight: 20,
    marginLeft: 20,
    marginTop: -50,
    borderRadius: 10,
    // Shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 2,  
    elevation: 5,
  },
  searchContainer: {
    backgroundColor: 'white',
    height: 50,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomColor: '#D3D3D3',
    borderBottomWidth: 1,
  },
  homeContainer: {
    backgroundColor: 'white',
    height: 50,
    borderBottomLeftRadius: 10,
    flex: 1,
    flexDirection: 'row',
  },
  workContainer: {
    backgroundColor: 'white',
    height: 50,
    borderBottomRightRadius: 10,
    flex: 1, 
    borderLeftColor: '#D3D3D3',
    borderLeftWidth: 1,
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
  search: {
    marginTop: 10,
    width: 30,
    height: 30,
    marginLeft: 5,
  }
});