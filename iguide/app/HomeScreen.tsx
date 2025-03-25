import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Keyboard } from "react-native";
import { useRouter } from "expo-router";
import { useAppContext } from "../context/AppContext";

export default function HomeScreen(): JSX.Element {
    const { setText } = useAppContext();
    const [inputText, setInputText] = useState("");
    const router = useRouter();

    const handleTextSubmit = () => {
        if (inputText.trim()) {
            setText(inputText);
            Keyboard.dismiss();
            router.push("/CaptureScreen"); // Opens camera screen immediately
        }
    };

    return (
        <View style={styles.container}>
            {/* Top Left Eye Icon */}
            <Image source={require("../assets/images/eye-icon.png")} style={styles.logo} />

            {/* Title */}
            <Text style={styles.title}>Your friendly Guide at hand....</Text>

            {/* Input Field */}
            <TextInput
                style={styles.input}
                placeholder="Input text or click to speak below..."
                value={inputText}
                onChangeText={setInputText}
                placeholderTextColor="#A0A0A0"
                returnKeyType="done"
                onSubmitEditing={handleTextSubmit} // Pressing "Done" will submit and open camera
            />

            {/* Record Button - Navigates Immediately to RecordScreen */}
            <TouchableOpacity onPress={() => router.push("/RecordScreen")} style={styles.recordButton}>
                <Image source={require("../assets/images/mic-icon.png")} style={styles.recordIcon} />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#FFFFFF" },
    logo: { position: "absolute", top: 40, left: 20, width: 40, height: 40, resizeMode: "contain" },
    title: { fontSize: 22, fontWeight: "500", marginBottom: 20, color: "#000" },
    input: {
        width: "80%",
        height: 50,
        borderWidth: 1,
        borderColor: "#000",
        borderRadius: 25,
        paddingLeft: 20,
        fontSize: 16,
        textAlign: "center",
        color: "#000"
    },
    recordButton: {
        position: "absolute",
        bottom: 80,
        width: 80,
        height: 80,
        borderRadius: 40,
        alignItems: "center",
        justifyContent: "center"
    },
    recordIcon: { width: 50, height: 50, tintColor: "#87CEFA" },
});

export default HomeScreen;
