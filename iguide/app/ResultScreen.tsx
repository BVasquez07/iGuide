import React, { useEffect, useState } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native";
import { useAppContext } from "../context/AppContext";
import { Audio } from 'expo-av';
import { AVPlaybackSourceObject } from 'expo-av/build/AV';
import * as FileSystem from "expo-file-system";
import { router } from "expo-router";
const url = 'http://3.145.65.151:5000/'; //api url whether it be local or deployed.

//helper function
const blobToURI = async (blob: Blob) => { 
    // the idea here is that we take in our blob -> base64 -> uri
    try {
    const reader = new FileReader();
    return new Promise((resolve, reject) => {
        reader.onloadend = async () => {
        const base64Data = reader.result.split(",")[1]; // extracts the base64 part of the data URL
        const filePath = `${FileSystem.cacheDirectory}temp-audio-file.mp3`;

        try {
            await FileSystem.writeAsStringAsync(filePath, base64Data, {
            encoding: FileSystem.EncodingType.Base64,
            });
            resolve(filePath);
        } catch (error) {
            reject("Error saving file: " + error.message);
        }
        };

        reader.onerror = () => {
        reject("Error reading Blob");
        };

        reader.readAsDataURL(blob);
    });
    } catch (error) {
    console.error("Error converting Blob to URI:", error);
    }
};



const ResultScreen = () : JSX.Element => {
    const { imageUri, text, audioUri} = useAppContext();
    const [sound, setSound] = useState();
    const [incomingAudio, setIncomingAudio] = useState();
    const [loading, setLoading] = useState(false);

    useEffect(() => { //unload the sound to avoid memory leaks
        return sound ? () => {
                console.log('Unloading Sound');
                sound.unloadAsync(); 
            } : undefined;
    }, [sound]);

    useEffect(() => {
        setLoading(true);
        uploadAudio(audioUri)
    }, [])

    const playRecording = async (uri: string) => {
        //playing back the sound
        console.log('Loading Sound');

        //params to pass to the sound object to play
        const source: AVPlaybackSourceObject = {uri: uri}
        const downloadFirst = false;
        const initialStatus = {shouldPlay: true};
        const onPlaybackStatusUpdate = null

        const sound = new Audio.Sound();
        sound.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate);

        await sound.loadAsync(source, initialStatus, downloadFirst);
        setSound(sound); 

        console.log('Playing Sound');
        await sound.playAsync(); 
        setLoading(false);
    };

    const uploadAudio = (uri: string) => {
        //have to fix a couple things here like what the response is on the server side.
        const formData = new FormData();
        console.log(audioUri ? "there is audio" : "empty");
        console.log(text ? "there is text" : "empty");
        console.log(imageUri ? "there is an image" : "empty");
        audioUri ?  formData.append("audio", {uri: uri, type: 'audio/m4a', name: 'speech-prompt.m4a'}): null;
        text ? formData.append("text", text): null;
        imageUri ? formData.append("image", {uri: imageUri, type: 'image/jpeg', name: 'image.jpg'}): null;

        console.log(formData.get("text"));

        fetch(`${url}incomingPayload`, {
            mode: 'cors',
            method: 'POST',
            body: formData
        })
            .then(res => res.blob())
            .then(blob => blobToURI(blob))
            .then(uri => {
                console.log(uri);
                setIncomingAudio(uri);
                playRecording(uri);
            }) // we can store the response URI so that playback can occur
            .catch(err => console.error(err));
        //in the response we will be recieving a wav file in response which we will play
    };

    const playBack = () => {
        incomingAudio ? playRecording(incomingAudio) : console.log("No audio to play back");
    }

    const handleRestart = () => {
        const transitionText = 'Navigating back to the home screen so you can ask more questions!'
        const nextScreen = '/HomeScreen'; // this will be the next screen to navigate to after the image is selected.

        sound ? sound.unloadAsync() : undefined;  
        router.push(`/TransitionScreen?routeData=${encodeURIComponent(transitionText)}&nextPage=${encodeURIComponent(nextScreen)}`);
    }
    

    return (
        <View style={styles.container}>
            <Image source={require("../assets/images/eye-icon.png")} style={styles.logo} />

            <Text style={styles.title}>More about this visage...</Text>

            <Image source={{uri: imageUri}} style={styles.image} alt="cached image" />

            {loading?
                <ActivityIndicator size="large" color="#70CDFF" />
                :
                <>
                    <Text style={styles.text}>{text}</Text>
                    <TouchableOpacity onPress={playBack} style={styles.button}>
                        <Text style={styles.ttsButtonText}>Replay</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleRestart} style={styles.button}>
                        <Text style={styles.ttsButtonText}>Something New</Text>
                    </TouchableOpacity>
                </>
            }
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, alignItems: "center", justifyContent: "center", padding: 20, backgroundColor: "#FFFFFF" },
    logo: { position: "absolute", top: 2, left: 10, width: 80, height: 50 },
    title: { fontFamily:"inter",fontSize: 22, fontWeight: "500", marginBottom: 20, color: "#000" },
    image: { width: "90%", height: 200, borderRadius: 10, marginBottom: 20 },
    text: { fontFamily:"inter", fontSize: 16, textAlign: "center", color: "#000", marginBottom: 20 },
    ttsButtonText: { color: "#87CEFA", fontSize: 16, fontFamily:"inter" },
    button: { borderColor: "#87CEFA", borderWidth: 2, padding: 15, borderRadius: 50, marginTop: 10, width: "80%", alignItems: "center" }
});

export default ResultScreen;