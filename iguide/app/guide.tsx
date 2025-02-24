import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, Animated } from "react-native";
import { useRouter } from "expo-router";
import { Audio } from "expo-av";
import * as ImagePicker from "expo-image-picker";

export default function GuideScreen() {
    const [image, setImage] = useState(null);
    const [recording, setRecording] = useState(null);
    const [text, setText] = useState("");
    const [isListening, setIsListening] = useState(false);
    const animation = new Animated.Value(0);
    const router = useRouter();

    useEffect(() => {
        if (isListening) {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(animation, {
                        toValue: 1,
                        duration: 500,
                        useNativeDriver: true,
                    }),
                    Animated.timing(animation, {
                        toValue: 0,
                        duration: 500,
                        useNativeDriver: true,
                    }),
                ])
            ).start();
        }
    }, [isListening]);

    // Function to take a picture
    const takePicture = async () => {
        let permissionResult = await ImagePicker.requestCameraPermissionsAsync();
        if (permissionResult.granted === false) {
            alert("Camera access is required to take pictures.");
            return;
        }
        let result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });
        if (!result.canceled) {
            setImage(result.assets[0].uri);
            startRecording();
        }
    };

    // Function to start voice recording
    const startRecording = async () => {
        try {
            const permission = await Audio.requestPermissionsAsync();
            if (permission.status !== "granted") {
                alert("Permission to access microphone is required!");
                return;
            }
            await Audio.setAudioModeAsync({ allowsRecordingIOS: true });
            const { recording } = await Audio.Recording.createAsync(
                Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
            );
            setRecording(recording);
            setIsListening(true);
        } catch (error) {
            console.error("Failed to start recording", error);
        }
    };

    // Function to submit the image
    const submitImage = () => {
        if (image) {
            alert("Image submitted successfully!");
            setImage(null);
            setText("");
        } else {
            alert("No image to submit.");
        }
    };

    return (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#fff" }}>
            <Text style={{ fontSize: 20, marginBottom: 20 }}>Your friendly Guide at hand...</Text>

            {image && (
                <>
                    <Image source={{ uri: image }} style={{ width: 200, height: 200, marginBottom: 20 }} />
                    <TouchableOpacity
                        onPress={() => setImage(null)}
                        style={{ backgroundColor: "#ff4d4d", padding: 10, borderRadius: 10, marginBottom: 10 }}>
                        <Text style={{ color: "white", fontSize: 16 }}>🔄 Retake</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={submitImage}
                        style={{ backgroundColor: "#28a745", padding: 10, borderRadius: 10, marginBottom: 20 }}>
                        <Text style={{ color: "white", fontSize: 16 }}>✅ Submit</Text>
                    </TouchableOpacity>
                </>
            )}

            {isListening ? (
                <Animated.View style={{ opacity: animation }}>
                    <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 10 }}>🎙️ Listening...</Text>
                </Animated.View>
            ) : (
                <TextInput
                    placeholder="Input text or click to speak below..."
                    style={{ borderWidth: 1, borderColor: "gray", padding: 10, width: "80%", marginBottom: 20, borderRadius: 10 }}
                    onChangeText={setText}
                    value={text}
                />
            )}

            {!image && (
                <TouchableOpacity
                    onPress={takePicture}
                    style={{ backgroundColor: "#007bff", padding: 15, borderRadius: 50 }}>
                    <Text style={{ color: "white", fontSize: 16 }}>📷 Capture & Speak</Text>
                </TouchableOpacity>
            )}
        </View>
    );
}
