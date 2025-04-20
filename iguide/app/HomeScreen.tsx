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

    const handleGoBack = () => {
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
            <TouchableOpacity onPress={() => router.push("/RecordScreen")} style={styles.speechButton}>
                <Image source={require("../assets/images/speechButton.png")} style={styles.speechIcon} />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#FFFFFF" },
    logo: { position: "absolute", top: 2, left: 10, width: 80, height: 50 },
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
