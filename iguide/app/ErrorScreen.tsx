// one thing that def needs to be updated is going to the previous screen.
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Keyboard, Touchable, ActivityIndicator } from "react-native";
import { useRouter, useGlobalSearchParams, useLocalSearchParams } from "expo-router";
import { useAppContext } from "../context/AppContext";
import { Audio, InterruptionModeIOS, InterruptionModeAndroid } from 'expo-av';
import { AVPlaybackSourceObject } from 'expo-av/build/AV';
import { useEffect, useState } from "react";

const ErrorScreen = (): JSX.Element => {
    const [sound, setSound] = useState<Audio.Sound | null>(null);

    const playRecording = async (uri: AVPlaybackSourceObject) => { // should make playrecording a component 
        //playing back the sound
        try {
            console.log('Loading Sound');

            await Audio.setAudioModeAsync({
                allowsRecordingIOS: false,
                interruptionModeIOS: InterruptionModeIOS.DuckOthers,
                playsInSilentModeIOS: true,
                shouldDuckAndroid: true,
                interruptionModeAndroid: InterruptionModeAndroid.DuckOthers,
                playThroughEarpieceAndroid: false,
            });

            //params to pass to the sound object to play
            const source = uri
            const downloadFirst = false;
            const initialStatus = {shouldPlay: true};
            const onPlaybackStatusUpdate = null

            const audio = new Audio.Sound();
            audio.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate);
            await audio.loadAsync(source, initialStatus, downloadFirst);
            setSound(audio); 

            console.log('Playing Sound');
            await audio.playAsync(); 
        } catch (err) {
            console.error('Failed to play sound', err);
        }
    };


    return (
        <View style={styles.container}>
            <Text accessibilityLabel={"Error message"} style={styles.title}>{"There was an error please refresh the application and if the issue persists contact ..."}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#FFFFFF" },
    logo: { position: "absolute", top: 2, left: 10, width: 80, height: 50, pointerEvents: 'none' },
    title: { fontFamily:"inter", fontSize: 19, marginBottom: 40, color: "#000", textAlign: "center" },
    input: {
        width: "80%",
        height: 50,
        borderWidth: 1,
        borderColor: "#000",
        borderRadius: 25,
        paddingLeft: 20,
        paddingRight: 20,
        fontSize: 12,
        fontFamily:"inter",
        textAlign: "center",
    },
    speechIcon: { width: 130, height: 130, color: "#87CEFA" },
    speechButton: {
        position: "absolute",
        bottom: 100,
        width: 160,
        height: 150,
        borderRadius: 40,
        alignItems: "center",
        justifyContent: "center",
    },
});
export default ErrorScreen;