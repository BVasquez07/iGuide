import React, { useState, useEffect } from "react";
import { View, TouchableOpacity, Text, Image, StyleSheet, TouchableHighlight } from "react-native";
import { useRouter } from "expo-router";
import { useAppContext } from "../context/AppContext";
import { Audio, InterruptionModeIOS, InterruptionModeAndroid } from "expo-av";
import BackArrow from "./components/backArrow";





export default function RecordScreen(): JSX.Element {
    const { cacheAudio } = useAppContext();
    const [recording, setRecording] = useState<Audio.Recording | null>(null);
    const [isRecording, setIsRecording] = useState(false);
    const router = useRouter();

    const [permissionResponse, requestPermission] = Audio.usePermissions();
    const [sound, setSound] = useState();
    const [incomingAudio, setIncomingAudio] = useState();
    const [displayListening, setDisplayListening] = useState(false);
    const [displayHoldPrompt, setDisplayHoldPrompt] = useState(true); //be default should be true so the user knows what to do.

    const transitionText = 'Prepare to snap a picture of the object!'; // this wll depend on whether we have text or voice input.
    const nextScreen = '/CaptureScreen'; 


    async function startRecording() {
        try {
            const { status } = await Audio.requestPermissionsAsync();
            if (status !== 'granted') {
                    console.log('Requesting permission..');
                    await requestPermission();
                }
                await Audio.setAudioModeAsync({
                    allowsRecordingIOS: true,
                    playsInSilentModeIOS: true, // look into what this is
                    shouldDuckAndroid: true,
                    interruptionModeIOS: InterruptionModeIOS.DuckOthers, // Fixed import
                    staysActiveInBackground: false,
                    interruptionModeAndroid: InterruptionModeAndroid.DuckOthers, // Fixed import
                }); 
    
                console.log('Starting recording..');
                const { recording } = await Audio.Recording.createAsync(
                    Audio.RecordingOptionsPresets.HIGH_QUALITY
                );
                setRecording(recording);
                setIsRecording(true);
                console.log('Recording started');
        } catch (err) {
            console.error('Failed to start recording', err);
        }
    }

    async function stopRecording() {
        console.log('Stopping recording..');
        setRecording(undefined);
        await recording.stopAndUnloadAsync(); 
        await Audio.setAudioModeAsync(
            { allowsRecordingIOS: false}
        ); 
    
        const uri = recording.getURI(); 
        uri ? await cacheAudio(uri) : null; //cache the audio file to the device
        console.log('Recording stopped and stored at', uri);
        setIsRecording(false);
        router.push(`/TransitionScreen?routeData=${encodeURIComponent(transitionText)}&nextPage=${encodeURIComponent(nextScreen)}`);
    };
    const handlePressIn = () => {
        setDisplayListening(true);
        setDisplayHoldPrompt(false);
        startRecording();
    }
    const handlePressOut = () => {
        setDisplayHoldPrompt(true);
        setDisplayListening(false);
        stopRecording();
    }

    return (
        <View style={styles.container}>
            <BackArrow />

            <TouchableOpacity onPressIn={handlePressIn} onPressOut={handlePressOut} accessibilityLabel="Record button">
                <Image source={require("../assets/images/audioRecord.png")} style={styles.waveform} />
            </TouchableOpacity>
            
            {displayHoldPrompt && <Text style={styles.listeningText}>Hold the button above to begin recording...</Text>}
            {displayListening && <Text style={styles.listeningText}>Listening...</Text>}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#FFFFFF" },
    logo: { position: "absolute", top: 40, left: 20, width: 40, height: 40, resizeMode: "contain" },
    waveform: { width: 220, height: 220, resizeMode: "contain" },
    listeningText: { marginTop: 10, fontFamily:'inter', fontSize: 20, color: "#000" },
    stopButton: { marginTop: 20, backgroundColor: "#ff3b30", paddingVertical: 10, paddingHorizontal: 25, borderRadius: 20 },
    stopButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});








