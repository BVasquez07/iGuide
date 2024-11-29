import { Text, View } from "react-native";
import UserTxtInput from "./components/UserTxtInput";
import {GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler';

export default function Index() {
  // there is kind of weird behavior with wrapping GestureHandlerRootView with ScrollView
  // so instead of having the text generated within the UserTxtInput component let us make a
  // seperate child component that will be wrapped with ScrollView
  return (
    <View className="flex flex-col items-center justify-center h-screen bg-gray-100 dark:bg-gray-800">
        <GestureHandlerRootView>
          <ScrollView>
            <UserTxtInput />
          </ScrollView>
        </GestureHandlerRootView>
    </View>
  );
}
