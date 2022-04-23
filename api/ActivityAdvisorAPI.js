import axios from "axios";

const _API_ = 'http://192.168.83.1:8080/activity-advisor';

function getActivity() {
    let date = new Date();
    let time = date.getHours() + ":" + date.getMinutes();
    console.log(time);
    // const json = JSON.stringify({ location: { latitude: (location == null) ? null : location.coords.latitude, longitude: (location == null) ? null : location.coords.longitude }, steps: pastStepCount, batteryPercentage: Math.round(batteryPercentage*100),  time: time, temperature: 24 });
    const json = JSON.stringify({
      location: { latitude: 46.063568, longitude: 14.54745 },
      temperature: 24,
    });
    axios.defaults.headers.common["X-Context"] = json;
    axios
      .get(_API_)
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
  }