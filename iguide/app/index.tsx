// import { View } from "react-native";
// import UserTxtInput from "./components/TextToSpeech";
// // import AudioRecording from "./components/AudioRecording";
// import AudioRecording_AV from "./components/AudioRecording_AV";
// import {GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler';
// // import HomeScreen from "./components/HomeScreen";



// export default function Index() {
//   //there is kind of weird behavior with wrapping GestureHandlerRootView with ScrollView
//   // so instead of having the text generated within the UserTxtInput component let us make a
//   // seperate child component that will be wrapped with ScrollView
//   return (
//     <View className="flex flex-col mt-40 items-center justify-center h-screen bg-gray-100 dark:bg-gray-800">
//         <View >
//           <GestureHandlerRootView>
//             <ScrollView>
//               {/* <UserTxtInput /> */}
//               <AudioRecording_AV />
//               {/* <AudioRecording /> */}
//             </ScrollView>
//           </GestureHandlerRootView>
//         </View>
//     </View>
//   );
// }


import { useRouter, useNavigationContainerRef } from "expo-router";
import { useEffect } from "react";
import React from "react";

export default function Index(): JSX.Element | null {
    const router = useRouter();
    const navigationRef = useNavigationContainerRef();

    useEffect(() => {
        const unsubscribe = navigationRef?.addListener("state", () => {
            router.replace("/HomeScreen"); // Redirect safely after mounting
        });

        return () => unsubscribe?.();
    }, [navigationRef]);

    return null; // No UI needed, it's just for redirection
}

