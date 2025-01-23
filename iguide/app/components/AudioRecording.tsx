import { useState, useEffect} from 'react';
import { View, StyleSheet, Button, Platform } from 'react-native';
import { useAudioRecorder, RecordingOptions, AudioModule, RecordingPresets, IOSOutputFormat, AudioQuality } from 'expo-audio';
import {
  TouchableHighlight,
  Text
} from 'react-native';
import * as FileSystem from 'expo-file-system';
import { Buffer } from 'buffer';
import { get } from 'http';

/*

The idea is that instead we will not send multi part form data
with the

{
  image: image.jpg,
  prompt: "the prompt"
  audio: "this is the spoken prompt which will have to be converted in the server."
}


URI -> base64 -> blob -> send to the server by appending to the form.
There is currently an issue with recording where the first instance of recording doesn't get loaded but start and stop work.
This could be due to 
- async nature of the recording
- state handling

Another issue that has risen is that on the server the 
file is only appearing in the request.form object and not in the request.files object.
This means that the file is not being sent as a file but as a form object.

*/


const AudioRecording = () => {
  const [recording, setRecording] = useState(false); // preserve the states for each rerender when interacting
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

  const uploadAudio = (uri: string) => {
    //have to fix a couple things here like what the response is on the server side.
    const formData = new FormData();
    formData.append("audio", {uri: uri, type: 'audio/m4a', name: 'speech-prompt.m4a'});
    //look into this more closely, specifcally: why we can just send the entire local uri to the server and not a blob!
    formData.append('prompt', "There was no prompt passed to the model!");
    //formData.append('audio', blob, 'audio-file.mp4');

    fetch('http://localhost:3060/recieveaudio', {
      method: 'POST',
      body: formData
    })
      .then(res => console.log(res))
      .catch(err => console.error(err));
  }

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