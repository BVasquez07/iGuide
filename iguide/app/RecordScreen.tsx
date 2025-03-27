import React, { useState, useEffect } from "react";
import { View, TouchableOpacity, Text, Image, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useAppContext } from "../context/AppContext";
import { Audio, InterruptionModeIOS, InterruptionModeAndroid } from "expo-av";

export default function RecordScreen(): JSX.Element {
    const { cacheAudio } = useAppContext();
    const [recording, setRecording] = useState<Audio.Recording | null>(null);
    const [isRecording, setIsRecording] = useState(false);
    const router = useRouter();

    useEffect(() => {
        startRecording(); // Start recording automatically when the screen loads
    }, []);

    const startRecording = async () => {
        try {
            const { status } = await Audio.requestPermissionsAsync();
            if (status !== "granted") {
                alert("Microphone permission is required to record audio!");
                return;
            }

            // Fix: Correct audio mode settings
            await Audio.setAudioModeAsync({
                allowsRecordingIOS: true,
                playsInSilentModeIOS: true,
                staysActiveInBackground: false,
                interruptionModeIOS: InterruptionModeIOS.DuckOthers, // Fixed import
                shouldDuckAndroid: true,
                interruptionModeAndroid: InterruptionModeAndroid.DuckOthers, // Fixed import
            });

            // Start Recording
            const newRecording = new Audio.Recording();
            await newRecording.prepareToRecordAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
            await newRecording.startAsync();

            setRecording(newRecording);
            setIsRecording(true);
        } catch (error) {
            console.error("Recording error:", error);
        }
    };

    const stopRecording = async () => {
        if (recording) {
            try {
                await recording.stopAndUnloadAsync();
                const uri = recording.getURI();
                if (uri) {
                    await cacheAudio(uri);
                }
            } catch (error) {
                console.error("Error stopping recording:", error);
            }
            setIsRecording(false);
            router.push("/CaptureScreen"); // Navigate to Camera Screen after stopping
        }
    };

    return (
        <View style={styles.container}>
            {/* Top Left Eye Icon */}
            <Image source={require("../assets/images/eye-icon.png")} style={styles.logo} />

            {/* Animated GIF when recording */}
            {isRecording && (
                <Image source={require("../assets/images/sound.gif")} style={styles.waveform} />
            )}

            {/* Listening text when recording */}
            {isRecording && <Text style={styles.listeningText}>Listening...</Text>}

            {/* Stop Recording Button */}
            {isRecording && (
                <TouchableOpacity onPress={stopRecording} style={styles.stopButton}>
                    <Text style={styles.stopButtonText}>Stop</Text>
                </TouchableOpacity>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#FFFFFF" },
    logo: { position: "absolute", top: 40, left: 20, width: 40, height: 40, resizeMode: "contain" },
    waveform: { width: 120, height: 120, resizeMode: "contain" },
    listeningText: { marginTop: 10, fontSize: 18, fontWeight: "500", color: "#000" },
    stopButton: { marginTop: 20, backgroundColor: "#ff3b30", paddingVertical: 10, paddingHorizontal: 25, borderRadius: 20 },
    stopButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});

