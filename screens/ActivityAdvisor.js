import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    View,
    Button,
    Text,
    StyleSheet,
  } from "react-native";
import * as Location from 'expo-location';
import { Pedometer } from 'expo-sensors';
import * as Battery from 'expo-battery';
export default function ActivityAdvisor({ navigation }) {

    const [isPedometerAvailable, setIsPedometerAvailable] = useState('checking');
    const [pastStepCount, setPastStepCount] = useState(0);
    const [stepsError, setStepsError] = useState(null);
    const [message, setMessage] = useState(null);
    const [location, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);
    const [batteryPercentage, setBatteryPercentage] = useState(null);

    let _subscription;

    const _subscribe = () => {  
      // Steps
      Pedometer.isAvailableAsync().then(
        result => {
          setIsPedometerAvailable(result);
        },
        error => {
          setIsPedometerAvailable('Could not get isPedometerAvailable: ' + error);
        }
      );
  
      const end = new Date();
      const start = new Date();
      start.setDate(end.getDate() - 1);
      Pedometer.getStepCountAsync(start, end).then(
        result => {
          setPastStepCount(result.steps);
        },
        error => {
          setStepsError('Could not get stepCount: ' + error);
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
    }
  
    const _unsubscribe = () => {
      _subscription && _subscription.remove();
      _subscription = null;
    };
  
    useEffect(() => {
      // Location  
      (async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setErrorMsg('Permission to access location was denied');
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
      return ()=> _unsubscribe();
    }, []);
  
    let text = 'Waiting..';
    if (errorMsg) {
      text = errorMsg;
    } else if (location) {
      text = JSON.stringify(location);
    }

    function getActivity(){
        let date = new Date();
        let time = date.getHours() + ":" + date.getMinutes();
        console.log(date);
        let URL = 'http://172.23.112.1:8080/activity-advisor';
        const json = JSON.stringify({ location: { latitude: (location == null) ? null : location.coords.latitude, longitude: (location == null) ? null : location.coords.longitude }, steps: pastStepCount, batteryPercentage: Math.round(batteryPercentage*100),  time: time, temperature: 24 });
        axios.defaults.headers.common['X-Context'] = json;
        axios.get(URL)
        .then(function (response) {
            setMessage(response.data.message);
            console.log(response.data);
        })
        .catch(function (error) {
            console.log(error);
        });
    }

    return(
        <View>
            <Button
                style={[styles.btn]}
                onPress={() => getActivity()}
                title="Get Activity"
                color="#841584"
                accessibilityLabel="Learn more about this purple button"
            />
            <Text>{message}</Text>
            <Text>{text}</Text>
            <Text>Pedometer.isAvailableAsync(): {isPedometerAvailable}</Text>
            <Text>Steps taken in the last 24 hours: {pastStepCount}</Text>
            <Text>Current Battery Level: {batteryPercentage}</Text>
        </View>
    );
}
const styles = StyleSheet.create({
    btn: {
        justifyContent: 'center',
    }
});
  