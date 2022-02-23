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
  Button,
  Image,
  Platform,
  TouchableHighlight,
} from "react-native";
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import MapView from "react-native-maps";
import { PROVIDER_GOOGLE } from "react-native-maps";
import SlidingUpPanel from 'rn-sliding-up-panel';
import {BoxShadow} from 'react-native-shadow';
import { useSelector, useDispatch } from "react-redux";
import { setOrigin, setOriginAddress, setDestination, setDestinationAddress } from "../redux/actions";

const windowHeight = Dimensions.get("window").height;
const windowWidth = Dimensions.get("window").width;

export default function LjubljanaTransport({ navigation }) {

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
  const dispatch = useDispatch();
  const { origin, originAddress, destination, destinationAddress } = useSelector(state => state.ljubljanaTransportReducer);
  // const [origin, setOrigin] = useState(null);
  // const [destination, setDestination] = useState(null);
  // const [originAddress, setOriginAddress] = useState(null);
  // const [destinationAddress, setDestinationAddress] = useState(null);
  const [logoVisible, setLogoVisible] = useState(true);

  const googleMapsKey = require('../config.json').googleMapsKey;

  const GooglePlacesInput = () => {
    return (
      <GooglePlacesAutocomplete
        onPress={(data, details = null) => {
          placeFound(data.place_id, data.description);
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
        renderLeftButton={()  => <Image source={ (origin == null) ? require('../assets/start.png') : require('../assets/end.png')} style={stylesGoogleInputIOS.search} />}
        styles={ Platform.OS === 'ios' ? stylesGoogleInputIOS : stylesGoogleInputAndroid}
      />
    );
  };

  function placeFound(placeID, description){
    if(origin == null && destination == null) {
      dispatch(setOrigin(placeID));
      dispatch(setOriginAddress(description));
    }
    else {
      if(origin != null && destination == null) {
        dispatch(setDestination(placeID));
        dispatch(setDestinationAddress(description));
      }
      else if(origin == null && destination != null) {
        dispatch(setOrigin(placeID));
        dispatch(setOriginAddress(description));
      }
      navigation.navigate("DisplayTransport");
    }
  }

  function getMeAToB() {
    if(Platform.OS === 'ios') {
      panelReference.current?.show(windowHeight*0.7);
    } else {
      panelReference.current?.show(windowHeight*0.57);
    }
    dispatch(setOrigin(null));
    dispatch(setDestination(null));
    dispatch(setOriginAddress(null));
    dispatch(setDestinationAddress(null));
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
        { Platform.OS === 'ios' ?
          <View style={styles.multiSearchContainerIOS}>
            <TouchableOpacity activeOpacity={0.9} style={styles.searchContainer} onPress={()=> getMeAToB()}>
              <Image source={require('../assets/AB2.png')} style={styles.searchImg} />
              <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                  <Text style={{fontSize: 16, fontWeight: 'bold', color: '#989898', fontFamily: 'AvenirNext-Bold'}}>Get me from A to B</Text>
              </View>
              <View style={{width: 34}} />
            </TouchableOpacity>
            <View style={{flexDirection:"row"}}>
              <TouchableOpacity activeOpacity={0.9} style={styles.homeContainer} onPress={()=> getMeHome()}>
                <Image source={require('../assets/home2.png')} style={styles.homeImg} />
                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                  <Text style={{fontSize: 16, fontWeight: 'bold', color: '#989898', fontFamily: 'AvenirNext-Bold'}}>Get me home</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity activeOpacity={0.9} style={styles.workContainer} onPress={()=> getMeToWork()}>
                <Image source={require('../assets/work2.png')} style={styles.workImg} />
                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                  <Text style={{fontSize: 16, fontWeight: 'bold', color: '#989898', fontFamily: 'AvenirNext-Bold'}}>Get me to work</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        :   
        <BoxShadow setting={shadowOpt}>
        <View style={styles.multiSearchContainerAndroid}>
          <TouchableOpacity activeOpacity={0.9} style={styles.searchContainer} onPress={()=> getMeAToB()}>
            <Image source={require('../assets/AB2.png')} style={styles.searchImg} />
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <Text style={{fontSize: 16, fontWeight: 'bold', color: '#989898', fontFamily: 'AvenirNext-Bold'}}>Get me from A to B</Text>
            </View>
            <View style={{width: 34}} />
          </TouchableOpacity>
          <View style={{flexDirection:"row"}}>
            <TouchableOpacity activeOpacity={0.9} style={styles.homeContainer} onPress={()=> getMeHome()}>
              <Image source={require('../assets/home2.png')} style={styles.homeImg} />
              <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <Text style={{fontSize: 16, fontWeight: 'bold', color: '#989898', fontFamily: 'AvenirNext-Bold'}}>Get me home</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={0.9} style={styles.workContainer} onPress={()=> getMeToWork()}>
              <Image source={require('../assets/work2.png')} style={styles.workImg} />
              <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <Text style={{fontSize: 16, fontWeight: 'bold', color: '#989898', fontFamily: 'AvenirNext-Bold'}}>Get me to work</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </BoxShadow>     
        }
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
  multiSearchContainerAndroid: {
    height: 100,
    borderRadius: 10,
    // Shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 2,  
  },
  multiSearchContainerIOS: {
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
  },
  searchContainer: {
    backgroundColor: 'white',
    height: 50,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomColor: '#D3D3D3',
    borderBottomWidth: 1,
    flexDirection: 'row',
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
    flexDirection: 'row',
  },
  slidingUpPanel: {
    height: windowHeight*0.7,
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
  searchImg: {
    marginTop: 10,
    width: 34,
    height: 34,
    marginLeft: 5,
  },
  homeImg: {
    marginTop: 10,
    width: 30,
    height: 30,
    marginLeft: 5,
  },
  workImg: {
    marginTop: 10,
    width: 27,
    height: 27,
    marginLeft: 5,
  }
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
    width: 75,
    height: 30,
    marginLeft: 5,
  }
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
  }
});