import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Dimensions,
  TouchableOpacity,
  Image,
} from "react-native";
import * as Location from "expo-location";
import { Pedometer } from "expo-sensors";
import * as Battery from "expo-battery";
import bg from "../assets/Activity_Advisor2.png";
import Modal from "react-native-modal";
import { PROVIDER_GOOGLE, Marker } from "react-native-maps";
import MapView from "react-native-maps";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

export default function ActivityAdvisor() {
  const [pastStepCount, setPastStepCount] = useState(0);
  const [message, setMessage] = useState(null);
  const [address, setAddress] = useState(null);
  const [location, setLocation] = useState(null);
  const [batteryPercentage, setBatteryPercentage] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [region, setRegion] = useState({
    latitude: null,
    longitude: null,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setRegion({
      latitude: null,
      longitude: null,
      latitudeDelta: 0.05,
      longitudeDelta: 0.05,
    });
    setMessage(null);
    setAddress(null);
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
    let date = new Date();
    let time = date.getHours() + ":" + date.getMinutes();
    console.log(time);
    let URL = "http://172.22.80.1:8080/activity-advisor";
    // const json = JSON.stringify({ location: { latitude: (location == null) ? null : location.coords.latitude, longitude: (location == null) ? null : location.coords.longitude }, steps: pastStepCount, batteryPercentage: Math.round(batteryPercentage*100),  time: time, temperature: 24 });
    const json = JSON.stringify({
      location: { latitude: 46.063568, longitude: 14.54745 },
      temperature: 24,
    });
    axios.defaults.headers.common["X-Context"] = json;
    axios
      .get(URL)
      .then(function (response) {
        setMessage(response.data.message);
        setAddress(response.data.address);
        setRegion({
          latitude: response.data.location.latitude,
          longitude: response.data.location.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        });
        console.log(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
    openModal();
  }

  return (
    <ImageBackground source={bg} style={styles.backgroundStyle}>
      <TouchableOpacity
        style={styles.bellContainer}
        onPress={() => getActivity()}
      >
        <Image source={require("../assets/bell.png")} style={styles.bell} />
      </TouchableOpacity>
      {
        // (location != null) ? // because location doesn't work on emulator, uncomment in production
        true ? (
          <Modal isVisible={isModalVisible} onBackdropPress={closeModal}>
            <View style={styles.modal}>
              <TouchableOpacity onPress={closeModal}>
                <Image
                  source={require("../assets/close1.png")}
                  style={styles.close}
                />
              </TouchableOpacity>
              <View style={styles.modalContainer}>
                <Text style={styles.headerText}>Suggested activity</Text>
                <Text style={styles.msg}>{message}</Text>
                {region.latitude != null && region.longitude != null ? (
                  <MapView
                    style={styles.map}
                    provider={PROVIDER_GOOGLE}
                    initialRegion={region}
                  >
                    <Marker
                      coordinate={{
                        latitude: region.latitude,
                        longitude: region.longitude,
                      }}
                    />
                  </MapView>
                ) : (
                  <Text>Loading...</Text>
                )}
                {address && <Text>It's located on {address}</Text>}
              </View>
            </View>
          </Modal>
        ) : (
          <Modal isVisible={isModalVisible} onBackdropPress={closeModal}>
            <View style={styles.modal}>
              <TouchableOpacity onPress={closeModal}>
                <Image
                  source={require("../assets/close1.png")}
                  style={styles.close}
                />
              </TouchableOpacity>
              <Text style={styles.headerText}>Suggested activity</Text>
              <Text style={styles.msg}>{message}</Text>
              <Image
                source={require("../assets/enjoy.jpg")}
                style={styles.enjoy}
              />
            </View>
          </Modal>
        )
      }
    </ImageBackground>
  );
}
const styles = StyleSheet.create({
  btn: {
    justifyContent: "center",
  },
  backgroundStyle: {
    flex: 1,
    width: windowWidth,
    height: windowWidth,
    marginTop: windowHeight * 0.135,
  },
  bellContainer: {
    width: 50,
    height: 50,
    marginTop: windowWidth * 0.455,
    marginLeft: windowWidth * 0.25,
  },
  bell: {
    width: 50,
    height: 50,
  },
  modalContainer: {
    paddingLeft: 15,
    paddingRight: 15,
  },
  modal: {
    width: windowWidth * 0.9,
    backgroundColor: "white",
  },
  close: {
    width: 20,
    height: 20,
    marginRight: 8,
    marginTop: 8,
    alignSelf: "flex-end",
  },
  headerText: {
    fontSize: 25,
    fontWeight: "bold",
    alignSelf: "center",
    marginBottom: 15,
  },
  msg: {
    marginBottom: 15,
  },
  map: {
    height: "50%",
    width: "100%",
    marginBottom: 10,
  },
  enjoy: {
    width: 200,
    height: 200,
    alignSelf: "center",
  },
});
