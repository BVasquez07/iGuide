import React, {useEffect, useState} from 'react';
import {
  View,
  KeyboardAvoidingView,
  TextInput,
  Text,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Pressable,
  TouchableHighlight
} from 'react-native';

const UserTxtInput = () => {
  const [fetchData, setFetchedData] = useState("Currently there is no response...");
  const [clicked, setClicked] = useState(false);
  const [prompt, setPrompt] = useState("");
  
  const fetching = (userPromp: String) => {
    fetch('http://localhost:3060/gptRes', 
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({prompt: userPromp}),
        mode: 'cors',
      })
      .then((res) =>{
        return res.json()
      })
      .then((data) => {
        return setFetchedData(data.data);
      })
      .catch((err) => {
        return err;
      });
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
              {/* <Pressable className="p-4 w-fit rounded-lg bg-white dark:bg-black items-center" 
                onPress={() => setClicked(true)} 
                onPressOut={() => setClicked(false)}
              >
                <Text>Generate</Text>
              </Pressable> */}
              <TouchableHighlight className="p-4 w-fit rounded-lg bg-grey dark:bg-black items-center" 
                onPress={() => setClicked(prev => !prev)} 
                underlayColor="white">
                <View>
                  <Text>Generate</Text>
                </View>
              </TouchableHighlight>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
      <View className='p-5 mt-4 w-[250px]'>
        <Text style={{ fontSize: 15 }}>{fetchData}</Text>
      </View>
    </View>
  );
};

export default UserTxtInput;
