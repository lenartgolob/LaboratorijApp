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


export default function DisplayTransport({route}) {

    const [originPlaceID, setOriginPlaceID] = useState(route.params.originPlaceID)
    const [destinationPlaceID, setDestinationPlaceID] = useState(route.params.destinationPlaceID)

    useEffect(() => {
        const json = JSON.stringify({
            origin: route.params.originPlaceID,
            destination: route.params.destinationPlaceID,     
          });
          axios.defaults.headers.common["X-Context"] = json;
          axios
            .get(URL)
            .then(function (response) {
              console.log(response.data);
            })
            .catch(function (error) {
              console.log(error);
            });
      }, []);

    return(
        <View style={{marginTop: 50}}>
            <Text>origin: {originPlaceID}</Text>
            <Text>destination: {destinationPlaceID}</Text>
        </View>
    );
}
