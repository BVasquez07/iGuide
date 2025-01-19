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
  const audioRecorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);

  const record = () => {
    audioRecorder.record();
    setRecording(audioRecorder.isRecording);
  }

  const stopRecording = async () => {
    await audioRecorder.stop();
    setRecording(audioRecorder.isRecording);
    console.log(audioRecorder.uri);
  };

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