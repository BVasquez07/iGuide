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


const UserTxtInput = () => {
  const defaultText = "Currently there is no response..."
  const [fetchData, setFetchedData] = useState(defaultText);
  const [clicked, setClicked] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  
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
        setLoading(false);
        return setFetchedData(data.data);
      })
      .catch((err) => {
        setLoading(false);
        setFetchedData("There was an error with your request please try later");
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
              <TouchableHighlight 
                className="p-4 w-fit rounded-lg bg-grey dark:bg-black items-center" 
                onPress={() => {
                  setLoading(true);
                  setClicked(prev => !prev);
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
          : <Text style={{ fontSize: 15 }}>{fetchData}</Text>}
      </View>

    </View>
  );
};

export default UserTxtInput;
