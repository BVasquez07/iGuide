import React, { useEffect, useState } from "react";
import { View, Image, StyleSheet, TouchableOpacity, Text, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useAppContext } from "@/context/AppContext";
import BackArrow from "./components/backArrow";

export default function CaptureScreen(): JSX.Element {
    const { setImageUri } = useAppContext();
    const [image, setImage] = useState<string | null>(null);
    const router = useRouter();
    const transitionText = 'Generating a response to your query! Gimme a sec while I think.'; // this wll depend on whether we have text or voice input.
    const nextScreen = '/ResultScreen'; // this will be the next screen to navigate to after the image is selected.
    const transitionAudio = 'result'; // this will be the next screen to navigate to after the image is selected.

    // Open Camera to Take a Picture
    const openCamera = async () => {
        // const permission = await ImagePicker.requestCameraPermissionsAsync();
        // if (!permission.granted) {
        //     alert("Camera access is required to take pictures.");
        //     return;
        // }
        const result = await ImagePicker.launchCameraAsync({
            allowsEditing: false,
            aspect: [4, 3],
            quality: 0.1, // we need a lower quality so the compression is low as the server can't handle large files.
        });

        if (!result.canceled) {
            console.log(result.assets[0].uri);
            handleImageSelection(result.assets[0].uri);
        }
    };

    // Open Image Library to Select a Photo
    const openImageLibrary = async () => {

        // const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
        // if (!permission.granted) {
        //     alert("Permission to access photos is required.");
        //     return;
        // }
        //the permission check is causing issues on the simulator.

        const result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: false,
            aspect: [4, 3],
            quality: 0.1,
        });

        if (!result.canceled) {
            console.log(result.assets[0].uri);
            handleImageSelection(result.assets[0].uri);
        }
    };

    // Handle Image Selection (Camera or Gallery)
    const handleImageSelection = (uri: string) => {
        setImage(uri);
        setImageUri(uri);
        router.push(`/TransitionScreen?routeData=${encodeURIComponent(transitionText)}&nextPage=${encodeURIComponent(nextScreen)}&audio=${encodeURIComponent(transitionAudio)}`);
    };

    const handleNoImage = () => { 
        router.push(`/TransitionScreen?routeData=${encodeURIComponent(transitionText)}&nextPage=${encodeURIComponent(nextScreen)}&audio=${encodeURIComponent(transitionAudio)}`);
    };

    return (
        <View style={styles.container}>
            <BackArrow />

            <Text style={styles.title}>Capture or Select Image</Text>

            {/* Display Selected Image */}
            {image && <Image source={{ uri: image }} style={styles.image} />}



            <TouchableOpacity onPress={() => router.push("/RecordScreen")} style={styles.capture}>
                <TouchableOpacity onPress={openCamera} style={styles.imageContainer}>
                    <Image source={require("../assets/images/camera.png")} style={styles.camera} alt="camera to capture item" />
                    <Text style={styles.buttonText}>Capture</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={openImageLibrary} style={styles.imageContainer}>
                    <Image source={require("../assets/images/upload.png")} style={styles.upload} alt="upload image from camera roll" />
                    <Text style={styles.buttonText}>Upload</Text>
                </TouchableOpacity>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleNoImage} style={styles.button}>
                <Text style={styles.buttonText}>No Picture</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20, backgroundColor: "#fff"},
    title: { fontFamily:"inter", fontSize: 20, marginBottom: 20 },
    button: { borderColor: "#87CEFA", borderWidth: 2, padding: 15, borderRadius: 50, marginTop: 10, width: "80%", alignItems: "center" },
    buttonText: { color: "#87CEFA", fontSize: 20, fontFamily:"inter" },
    capture: {  flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 45, marginBottom: 15}, // Optional: Align items vertically },
    camera: { width: 110, height: 100 },
    upload: { width: 100, height: 100 },
    imageContainer: { margin: 14, alignItems: 'center' },
    image: { width: 300, height: 300, borderRadius: 10, marginBottom: 20 }
});