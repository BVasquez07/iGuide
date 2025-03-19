import { useState, useEffect } from 'react';
import { View, StyleSheet, Button } from 'react-native';
import { Audio } from 'expo-av';
import { AVPlaybackSourceObject } from 'expo-av/build/AV';
import {
    TouchableHighlight,
    Text
  } from 'react-native';
import * as FileSystem from "expo-file-system";
const url = 'http://3.145.65.151:5000/'; //api url whether it be local or deployed.

//helper function
const blobToURI = async (blob: Blob) => { //review this chunk here
    // the idea here is that we take in our blob -> base64 -> uri
    try {
    const reader = new FileReader();
    return new Promise((resolve, reject) => {
        reader.onloadend = async () => {
        const base64Data = reader.result.split(",")[1]; // Extract the Base64 part
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


const AudioRecording_AV = () => {
  const [recording, setRecording] = useState();
  const [permissionResponse, requestPermission] = Audio.usePermissions();
  const [sound, setSound] = useState();
  const [incomingAudio, setIncomingAudio] = useState();

  useEffect(() => { //unload the sound to avoid memory leaks
    return sound
      ? () => {
          console.log('Unloading Sound');
          sound.unloadAsync(); 
        }
      : undefined;
  }, [sound]);


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
  };

  
    const uploadAudio = (uri: string) => {
        //have to fix a couple things here like what the response is on the server side.
        const formData = new FormData();
        formData.append("audio", {uri: uri, type: 'audio/m4a', name: 'speech-prompt.m4a'});
        //look into this more closely, specifcally: why we can just send the entire local uri to the server and not a blob!
        formData.append("text", "I love life!");
        //formData.append("image", {uri: "iguide/assets/images/adaptive-icon.png", type: 'image/png', name: 'test.png'});

        fetch(`${url}incomingPayload`, {
            mode: 'cors',
            method: 'POST',
            body: formData
        })
            .then(res => res.blob())
            .then(blob => blobToURI(blob)) // turn the audio file 
            .then(uri => playRecording(uri))
            .catch(err => console.error(err));
        //in the response we will be recieving a wav file in response which we will play
    };
    
    async function startRecording() {
        try {
            if (permissionResponse.status !== 'granted') {
                    console.log('Requesting permission..');
                    await requestPermission();
                }
                await Audio.setAudioModeAsync({
                    allowsRecordingIOS: true,
                    playsInSilentModeIOS: true, // look into what this is
                }); 

                console.log('Starting recording..');
                const { recording } = await Audio.Recording.createAsync(
                    Audio.RecordingOptionsPresets.HIGH_QUALITY
                );
                setRecording(recording);
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
        console.log('Recording stopped and stored at', uri);
        uploadAudio(uri); // send to the backend for processing
    };

    return (
        <View>
            <TouchableHighlight 
            className="p-4 w-fit rounded-lg bg-iguide-main-brand dark:bg-black items-center" 
            onPress={recording ? stopRecording : startRecording}
            underlayColor="grey">
            <View>
                <Text className='text-xl text-[white]'> {recording ? 'Stop Recording' : 'Start Recording'}</Text>
            </View>
            </TouchableHighlight>
        </View>
    );
}


export default AudioRecording_AV;
