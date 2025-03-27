import React, { useEffect } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { useAppContext } from "../context/AppContext";
import * as Speech from "expo-speech";

export default function ResultScreen(): JSX.Element {
    const { imageUri, text } = useAppContext();

    // Hardcoded image and text (Optional)
    // const hardcodedImage = require("../assets/images/pic.png"); // Replace with local or online image
    const hardcodedText = "The image shows a small ketchup packet from Dave's Hot Chicken, a popular fast-food chain known for its spicy fried chicken.\n" +
        "\n" +
        "Details of the Ketchup Packet:\n" +
        "Branding: The packet prominently features the Dave's Hot Chicken logo, which includes a cartoon chicken with a surprised expression and a red comb.\n" +
        "Product: It is labeled as \"Tomato Ketchup.\"\n" +
        "Ingredients (partially visible): The packet lists standard ketchup ingredients, including:\n" +
        "Tomato concentrate from ripe tomatoes\n" +
        "High fructose corn syrup\n" +
        "Distilled vinegar\n" +
        "Corn syrup\n" +
        "Less than 2% of spice, onion powder, and natural flavors\n" +
        "Manufacturing Location: It mentions Hollywood, CA, which is where Dave's Hot Chicken was originally founded.\n" +
        "Condition: The packet appears slightly crumpled but unopened.";

    // Use appContext text if available, otherwise use hardcoded text
    const displayText = hardcodedText;
    const displayImage = null;

    useEffect(() => {
        // Speak the text when the screen loads
        Speech.speak(displayText, { language: "en" });
    }, [displayText]);

    const handleReplayTTS = () => {
        Speech.speak(displayText, { language: "en" });
    };

    return (
        <View style={styles.container}>
            {/* Top Left Eye Icon */}
            <Image source={require("../assets/images/eye-icon.png")} style={styles.logo} />

            <Text style={styles.title}>More about this visage...</Text>

            {/* Display Captured or Hardcoded Image */}
            <Image source={displayImage} style={styles.image} alt="image goes here" />

            {/* Display Transcribed or Hardcoded Text */}
            <Text style={styles.text}>{displayText}</Text>

            {/* Play TTS Button */}
            <TouchableOpacity onPress={handleReplayTTS} style={styles.ttsButton}>
                <Text style={styles.ttsButtonText}>🔊 Listen</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, alignItems: "center", justifyContent: "center", padding: 20, backgroundColor: "#FFFFFF" },
    logo: { position: "absolute", top: 40, left: 20, width: 40, height: 40, resizeMode: "contain" },
    title: { fontSize: 22, fontWeight: "500", marginBottom: 20, color: "#000" },
    image: { width: "90%", height: 200, borderRadius: 10, marginBottom: 20 },
    text: { fontSize: 16, textAlign: "center", color: "#000", marginBottom: 20 },
    ttsButton: { backgroundColor: "#007bff", padding: 10, borderRadius: 10, marginTop: 10 },
    ttsButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});