import React from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  ImageBackground,
  Dimensions,
  TouchableOpacity,
  Image,
} from "react-native";
import LjubljanaTransport from './LjubljanaTransport';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

const GooglePlacesInput = () => {
  return (
    <GooglePlacesAutocomplete
      onPress={(data, details = null) => {
        // LjubljanaTransport.placeFound(data.place_id);
        console.log(data.place_id);
      }}
      query={{
          key: 'AIzaSyAuyfKKLPGy-FzTFXMFrzIqq-0mYhECQKk',
          language: 'en',
          location: '46.053730, 14.521310',
          radius: '8000', 
          components: 'country:SI',
          strictbounds: true,
      }}
      nearbyPlacesAPI="GooglePlacesSearch" // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch
      renderLeftButton={()  => <Image source={require('../assets/search.png')} style={styles.search} />}
      styles={styles}
    />
  );
};

const styles = StyleSheet.create({
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
      marginTop: 10,
      width: 30,
      height: 30,
      marginLeft: 5,
    }
});

export default GooglePlacesInput;