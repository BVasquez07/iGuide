import { Text, View, Button, Pressable } from "react-native";
import { fetch } from 'expo/fetch';
import React, { useEffect, useState } from "react";


// const resp = await fetch('https://httpbin.org/drip?numbytes=512&duration=2', {
//   headers: { Accept: 'text/event-stream' },
// });
// const reader = resp.body.getReader();
// const chunks = [];
// while (true) { /* possibly pushing the chunks onto the buffer.... */
//   const { done, value } = await reader.read();
//   if (done) {
//     break;
//   }
//   chunks.push(value);
// }


export default function Index() {
  const [fetchData, setFetchedData] = useState(null);
  const [clicked, setClicked] = useState(false);

  const fetching = () => {
    fetch('http://localhost:3060/gptRes')
    
      .then((res) =>{
        return res.json()
      })
      .then((data) => {
        console.log(data.data);
        return setFetchedData(data.data);
      })
      .catch((err) =>  err);
  }
  useEffect(() => {
    fetching();
  }, [clicked]);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Button
        onPress={() => {
          setClicked(true);
          setClicked(false);
        }}
        title="Get Data"
        color="#841584"
        accessibilityLabel="Click here"
      />
      <Pressable className="p-4 bg-white dark:bg-black" onPress={() => setClicked(true)} onPressOut={() => setClicked(false)}>
        <Text>I'm pressable!</Text>
      </Pressable>
      <Text style={{ fontSize: 24 }}>Text from the API: {fetchData}</Text>
    </View>
  );
}
