import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LandingPage from './screens/LandingPage';
import ActivityAdvisor from './screens/ActivityAdvisor';
import LjubljanaTransport from './screens/LjubljanaTransport';
import DisplayTransport from './screens/DisplayTransport';
import Taxis from './screens/Taxis';
import BicikeLJ from './screens/BicikeLJ';
import Avant2Go from './screens/Avant2Go';
import { NavigationContainer } from '@react-navigation/native';
import { Provider } from 'react-redux';
import { Store } from './redux/store';


const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <Provider store={Store}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="LandingPage">
          <Stack.Screen options={{headerShown: false}} name="LandingPage" component={LandingPage} />
          <Stack.Screen options={{headerShown: false}} name="ActivityAdvisor" component={ActivityAdvisor} />
          <Stack.Screen options={{headerShown: false}} name="LjubljanaTransport" component={LjubljanaTransport} />
          <Stack.Screen options={{headerShown: false}} name="DisplayTransport" component={DisplayTransport} />
          <Stack.Screen options={{headerShown: false}} name="Taxis" component={Taxis} />
          <Stack.Screen options={{headerShown: false}} name="BicikeLJ" component={BicikeLJ} />
          <Stack.Screen options={{headerShown: false}} name="Avant2Go" component={Avant2Go} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}