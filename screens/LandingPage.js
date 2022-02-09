import {
    View,
    Text,
    Button,
    StyleSheet,
  } from "react-native";
export default function LandingPage({ navigation }) {

    function redirectToActivityAdvisor() {
        navigation.navigate("ActivityAdvisor");
    }

    function redirectToLjubljanaTransport() {
        navigation.navigate("LjubljanaTransport");
    }

    return(
        <View style={[styles.btnContainer]} >
            <Button
                onPress={() => redirectToActivityAdvisor()}
                title="Activity Advisor"
                color="#841584"
                accessibilityLabel="Learn more about this purple button"
                style={[styles.btn]}
            />
            
            <Button
                onPress={() => redirectToLjubljanaTransport()}
                title="LjubljanaTransport"
                color="#841584"
                accessibilityLabel="Learn more about this purple button"
                style={[styles.btn]}
            />
        </View>
    );
}
const styles = StyleSheet.create({
    btnContainer: {
        marginTop: 50,
        justifyContent: 'center',
    },
    btn: {
        marginBottom: 20,
    }
});