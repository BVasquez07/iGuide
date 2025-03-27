import { Stack, Slot } from "expo-router";
import "../global.css";
import { AppProvider } from "../context/AppContext";
import { SafeAreaView } from "react-native";


export default function RootLayout(){
    return (
        <AppProvider>
            <SafeAreaView style={{ flex: 1 }}>
                <Stack screenOptions={{ headerShown: false }} />
            </SafeAreaView>
        </AppProvider>
    );
}
