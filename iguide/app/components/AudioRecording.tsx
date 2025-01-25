import { useState, useEffect} from 'react';
import { View, StyleSheet, Button, Platform } from 'react-native';
import { useAudioRecorder, useAudioPlayer, AudioModule, RecordingPresets } from 'expo-audio';
import {
  TouchableHighlight,
  Text
} from 'react-native';
import * as FileSystem from "expo-file-system";

/*

The idea is that instead we will not send multi part form data
with the

{
  image: image.jpg,
  prompt: "the prompt"
  audio: "this is the spoken prompt which will have to be converted in the server."
}
*/

const AudioRecording = () => {
  const [recording, setRecording] = useState(false); // preserve the states for each rerender when interacting
  const [audioData, setAudioData] = useState(null);
  const audioRecorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);


  const record = () => {
    audioRecorder.record();
    setRecording(audioRecorder.isRecording);
  }

  const stopRecording = async () => {
    await audioRecorder.stop();
    setRecording(await audioRecorder.isRecording);
    audioRecorder.uri ? uploadAudio(await audioRecorder.uri) : console.log("There was an error stopping the recording.")
  }

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
  
        reader.readAsDataURL(blob); // Convert Blob to Base64
      });
    } catch (error) {
      console.error("Error converting Blob to URI:", error);
    }
  };

  const uploadAudio = (uri: string) => {
    //have to fix a couple things here like what the response is on the server side.
    const formData = new FormData();
    formData.append("audio", {uri: uri, type: 'audio/m4a', name: 'speech-prompt.m4a'});
    //look into this more closely, specifcally: why we can just send the entire local uri to the server and not a blob!
    formData.append('prompt', "There was no prompt passed to the model!");

    fetch('http://localhost:3060/recieveaudio', {
      method: 'POST',
      body: formData
    })
      .then(res => res.blob())
      .then(blob => blobToURI(blob))
      .then(uri => setAudioData(uri))
      .catch(err => console.error(err));
      //in the response we will be recieving a wav file in response which we will play
  }
  
  const player = useAudioPlayer(audioData);
  player.play();

  //look into canAskAgain as well from https://docs.expo.dev/versions/latest/sdk/audio/
  useEffect(() => {
    (async () => {
      const status = await AudioModule.requestRecordingPermissionsAsync();
      if (!status.granted) {
        alert('Permission to access microphone was denied');
      }
    })();
  }, []);
  return (
    <View>
      <TouchableHighlight 
        className="p-4 w-fit rounded-lg bg-iguide-main-brand dark:bg-black items-center" 
        onPress={recording ? stopRecording : record}
        underlayColor="grey">
        <View>
          <Text className='text-xl text-[white]'> {recording ? 'Stop Recording' : 'Start Recording'}</Text>
        </View>
      </TouchableHighlight>
    </View>
    
  );
}


export default AudioRecording;