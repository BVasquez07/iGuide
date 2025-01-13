import React, {useEffect, useState} from 'react';
import {
  View,
  KeyboardAvoidingView,
  TextInput,
  Text,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
  TouchableHighlight,
  FlatList
} from 'react-native';
import * as Speech from 'expo-speech';
import * as ImagePicker from 'expo-image-picker';

// for understanding how to pick image from the library the image we can use the following: https://docs.expo.dev/tutorial/image-picker/
//
//
//
//

/*

The idea for handling sending the image and text payload will be the following:

User can at any time just submit a query otherwise they 


The below has to be restructured to instead send a form to the backend
with the appropriate keys which are 
{
  image: image.jpg,
  prompt: "the prompt"
}

*/

const TextToSpeech = () => {
  const defaultText = "Currently there is no response..."
  const [fetchData, setFetchedData] = useState(defaultText);
  const [clicked, setClicked] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [speakCount, setSpeakCount] = useState(0);

  const fetching = (userPrompt: String) => {
    const formData = new FormData();
    const blob = new Blob([''], {type: 'image/jpg'}); 
    //images come in as blobs so we have to work on it here!
    //we should check if any of the data is null or not available here.
    formData.append('prompt', String(userPrompt));
    formData.append('image', blob, 'image.jpg');
    fetch('http://localhost:3060/recievepayload', //this endpoint should be in a config or .env file
      {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
        mode: 'cors',
      })
      .then((res) =>{
        return res.json()
      })
      .then((data) => {
        setLoading(false);
        return setFetchedData(data.data);
      })
      .catch((err) => {
        setLoading(false);
        setFetchedData("There was an error with your request please try later");
        return err;
      });
  }
  const vocalize = (textToSay: string) : string => { // this is the built in speak service that expo has!
    Speech.speak(textToSay);
    setSpeakCount(0);
    return "";
  }

  useEffect(() => {
    fetching(prompt);
  }, [clicked]);

  return (
    <View>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View>
            <View className='m-2 w-[250px]'>
              <TextInput 
                multiline 
                placeholder="Input your prompt" 
                onChangeText={text => setPrompt(text)}/>
            </View>
            <View>
              <TouchableHighlight 
                className="p-4 w-fit rounded-lg bg-grey dark:bg-black items-center" 
                onPress={() => {
                  setLoading(true);
                  setClicked(prev => !prev);
                  setSpeakCount(1);
                }}
                underlayColor="white">
                <View>
                  <Text>Generate</Text>
                </View>
              </TouchableHighlight>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
      <View className='p-2 mt-4 w-[250px]'>
        {loading
          ? <ActivityIndicator size="small" color="#0000ff" /> 
          : <Text style={{ fontSize: 15 }}>
              {fetchData}
              {speakCount === 1 ? vocalize(fetchData) : null}
            </Text>}
      </View>
    </View>
  );
};

export default TextToSpeech;
