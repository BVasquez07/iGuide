import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Keyboard, Touchable } from "react-native";
// import {Image} from "expo-image";
import { useRouter } from "expo-router";
import { useAppContext } from "../context/AppContext";
import { Audio, InterruptionModeIOS, InterruptionModeAndroid } from 'expo-av';
import { AVPlaybackSourceObject } from 'expo-av/build/AV';
const greetingFiles = [
    require("../assets/audio/gptRes0.wav"),
    require("../assets/audio/gptRes1.wav"),
    require("../assets/audio/gptRes2.wav"),
    require("../assets/audio/gptRes3.wav"),
    require("../assets/audio/gptRes4.wav"),
    require("../assets/audio/gptRes5.wav"),
    require("../assets/audio/gptRes6.wav"),
    require("../assets/audio/gptRes7.wav"),
    require("../assets/audio/gptRes8.wav"),
    require("../assets/audio/gptRes9.wav"),
    require("../assets/audio/gptRes10.wav"),
    require("../assets/audio/gptRes11.wav"),
    require("../assets/audio/gptRes12.wav"),
    require("../assets/audio/gptRes13.wav"),
    require("../assets/audio/gptRes14.wav"),
    require("../assets/audio/gptRes15.wav"),
    require("../assets/audio/gptRes16.wav"),
    require("../assets/audio/gptRes17.wav"),
    require("../assets/audio/gptRes18.wav"),
    require("../assets/audio/gptRes19.wav"),
    require("../assets/audio/gptRes20.wav"),
    require("../assets/audio/gptRes21.wav"),
    require("../assets/audio/gptRes22.wav"),
    require("../assets/audio/gptRes23.wav"),
    require("../assets/audio/gptRes24.wav"),
    require("../assets/audio/gptRes25.wav"),
    require("../assets/audio/gptRes26.wav"),
    require("../assets/audio/gptRes27.wav"),
];


export default function HomeScreen(): JSX.Element {
    const audioSource = greetingFiles[Math.floor(Math.random() * greetingFiles.length)];
    const { setText } = useAppContext();
    const [inputText, setInputText] = useState("");
    const router = useRouter();
    const [sound, setSound] = useState<Audio.Sound | null>(null);
    let transitionText; // this wll depend on whether we have text or voice input.
    let nextScreen; 

    const handleTextSubmit = () => {
        
        if (inputText.trim()) {
            transitionText = "Prepare to snap a picture of the object!"; // this wll depend on whether we have text or voice input.
            nextScreen = "/CaptureScreen"; 
            setText(inputText);
            Keyboard.dismiss();
            router.push(`/TransitionScreen?routeData=${encodeURIComponent(transitionText)}&nextPage=${encodeURIComponent(nextScreen)}`); // Navigate to TransitionScreen with the input text as a query parameter
        }
    };
    
    const handleVoiceSubmit = () => {
        transitionText = "Prepare to record your voice!"; // this wll depend on whether we have text or voice input.
        nextScreen = "/RecordScreen"; 
        router.push(`/TransitionScreen?routeData=${encodeURIComponent(transitionText)}&nextPage=${encodeURIComponent(nextScreen)}`);
    }

    useEffect(() => { //unload the sound to avoid memory leaks
            return sound ? () => {
                    console.log('Unloading Sound');
                    sound.unloadAsync(); 
                } : undefined;
    }, [sound]);

    useEffect(() => {
        console.log(audioSource)
        playRecording(audioSource);
    }, [])

    const playRecording = async (uri: AVPlaybackSourceObject) => {
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
            {/* Top Left Eye Icon */}
            <View accessibilityLabel="iGuide logo" style={styles.logo} accessibilityRole="button">
             <Image source={require("../assets/images/eye-icon.png")} style={styles.logo} accessibilityLabel="iGuide logo" accessibilityRole="image" />
            </View>

            {/* Title */}
            <Text style={styles.title}>Your friendly Guide at hand...</Text>

            {/* Input Field */}
            <TextInput
                style={styles.input}
                placeholder="Input text or click to speak below"
                value={inputText}
                onChangeText={setInputText}
                placeholderTextColor="#A0A0A0"
                returnKeyType="done"
                onSubmitEditing={handleTextSubmit}
                keyboardType="default"
            />
            {/* Record Button - Navigates Immediately to RecordScreen */}
            <TouchableOpacity onPress={handleVoiceSubmit} style={styles.speechButton}>
                <Image source={require("../assets/images/speechButton.png")} style={styles.speechIcon} accessibilityLabel="Begin recording your voice" />
            </TouchableOpacity>
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
