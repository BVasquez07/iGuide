import { Stack } from "expo-router";
import "../global.css";
import { SafeAreaView } from "react-native";
import { AppProvider } from "@/context/AppContext";

// this is the root layout for the app, and it is using stack navigation

export default function RootLayout(){
    return (
        <AppProvider>
            <SafeAreaView style={{ flex: 1 }}>
                <Stack screenOptions={{ headerShown: false }}>
                </Stack>
            </SafeAreaView>
        </AppProvider>
    );
}
