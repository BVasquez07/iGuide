import { Text, View } from "react-native";
import UserTxtInput from "./components/UserTxtInput";

export default function Index() {

  return (
    <View className="flex flex-col items-center justify-center h-screen bg-gray-100 dark:bg-gray-800">
      <View className="mt-5">
        <UserTxtInput />
      </View>
    </View>
  );
}
