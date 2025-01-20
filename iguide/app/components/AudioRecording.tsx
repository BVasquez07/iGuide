import { useState, useEffect} from 'react';
import { View, StyleSheet, Button } from 'react-native';
import { useAudioRecorder, RecordingOptions, AudioModule, RecordingPresets } from 'expo-audio';
import {
  TouchableHighlight,
  Text
} from 'react-native';


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
  const [recording, setRecording] = useState(false); // preserve the states for each rerender
  const [audioUri, setAudioUri] = useState(""); // preserve the uri
  const audioRecorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);

  const record = () => {
    audioRecorder.record();
    setRecording(audioRecorder.isRecording);
  }

  const stopRecording = async () => {
    await audioRecorder.stop();
    setRecording(audioRecorder.isRecording);
    if(typeof audioRecorder.uri === "string"){
      setAudioUri(audioRecorder.uri);
      uploadAudio(audioUri);
    }
    else{
      console.log("There was an error stopping the recording.")
    }
  }

  //the plan is to get the audio uri and 
  const uploadAudio = (uri: string) => {
    const formData = new FormData();
    //keep working here to get the Blob (binary large object) of the audio file from the URI!
    fetch(uri)
        .then(response => response.blob())
        .then(blob => {
          // Read the Blob as a data URL
          const reader = new FileReader();
          reader.readAsDataURL(blob); 
      
          reader.onloadend = () => {
            // Send the data URL in the fetch request
            const base64Audio = reader.result.split(',')[1]; // Extract Base64 data
            formData.append('audio', base64Audio);
            fetch('http://localhost:3060/recieveaudio', {
              method: 'POST',
              headers: {
                'Content-Type': 'multipart/form-data'
              },
              body: formData,
              mode: 'cors'
            })
            .then(response => response.json()) 
            .then(data => {
              // Handle response
              console.log(data);
            })
            .catch(error => {
              // Handle error
              console.error(error);
            });
          }
        })}
  };

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