import React, { useEffect, useState } from "react";
import { View, Image, StyleSheet, TouchableOpacity, Text, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useAppContext } from "../context/AppContext";

export default function CaptureScreen(): JSX.Element {
    const { setImageUri } = useAppContext();
    const [image, setImage] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        // Automatically open the camera when the screen loads
        openCamera();
    }, []);

    // Open Camera to Take a Picture
    const openCamera = async () => {
        const permission = await ImagePicker.requestCameraPermissionsAsync();
        if (!permission.granted) {
            alert("Camera access is required to take pictures.");
            return;
        }

        const result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            handleImageSelection(result.assets[0].uri);
        }
    };

    // Open Image Library to Select a Photo
    const openImageLibrary = async () => {
        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permission.granted) {
            alert("Permission to access photos is required.");
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            handleImageSelection(result.assets[0].uri);
        }
    };

    // Handle Image Selection (Camera or Gallery)
    const handleImageSelection = (uri: string) => {
        setImage(uri);
        setImageUri(uri);
        router.push("/ResultScreen"); // Navigate to ResultScreen
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Capture or Select Image</Text>

            {/* Display Selected Image */}
            {image && <Image source={{ uri: image }} style={styles.image} />}

            {/* Camera Button */}
            <TouchableOpacity onPress={openCamera} style={styles.button}>
                <Text style={styles.buttonText}>📷 Take Picture</Text>
            </TouchableOpacity>

            {/* Upload Button */}
            <TouchableOpacity onPress={openImageLibrary} style={styles.button}>
                <Text style={styles.buttonText}>📁 Upload from Gallery</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20, backgroundColor: "#fff" },
    title: { fontSize: 20, marginBottom: 20 },
    button: { backgroundColor: "#007bff", padding: 15, borderRadius: 50, marginTop: 10, width: "80%", alignItems: "center" },
    buttonText: { color: "#fff", fontSize: 16 },
    image: { width: 300, height: 300, borderRadius: 10, marginBottom: 20 },
});