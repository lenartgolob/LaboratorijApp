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

    return(
        <View style={[styles.btnContainer]} >
            <Button
                onPress={() => redirectToActivityAdvisor()}
                title="Activity Advisor"
                color="#841584"
                accessibilityLabel="Learn more about this purple button"
            />
        </View>
    );
}
const styles = StyleSheet.create({
    btnContainer: {
        marginTop: 50,
        justifyContent: 'center',
    }
});