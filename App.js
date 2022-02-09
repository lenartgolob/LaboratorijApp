import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LandingPage from './screens/LandingPage';
import ActivityAdvisor from './screens/ActivityAdvisor';
import LjubljanaTransport from './screens/LjubljanaTransport';
import { NavigationContainer } from '@react-navigation/native';


const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="LandingPage">
        <Stack.Screen options={{headerShown: false}} name="LandingPage" component={LandingPage} />
        <Stack.Screen name="ActivityAdvisor" component={ActivityAdvisor} />
        <Stack.Screen options={{headerShown: false}} name="LjubljanaTransport" component={LjubljanaTransport} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}