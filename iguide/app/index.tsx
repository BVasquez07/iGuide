import { Text, View, Button, Pressable } from "react-native";
import React, { useEffect, useState } from "react";

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
    <View className="flex flex-col items-center justify-center h-screen bg-gray-100 dark:bg-gray-800">
      <Pressable className="p-4 bg-white dark:bg-black" onPress={() => setClicked(true)} onPressOut={() => setClicked(false)}>
        <Text>I'm pressable!</Text>
      </Pressable>
      <View className="flex-auto p-10">
        <Text className="m-b 1" style={{ fontSize: 12 }}>Response:</Text>
        <Text style={{ fontSize: 12 }}>{fetchData}</Text>
      </View>
    </View>
  );
}
