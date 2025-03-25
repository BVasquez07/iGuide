import { Stack } from "expo-router";
import { AppProvider } from "../context/AppContext";
import { SafeAreaView } from "react-native";
import React from "react";

export default function Layout(): JSX.Element {
    return (
        <AppProvider>
            <SafeAreaView style={{ flex: 1 }}>
                <Stack screenOptions={{ headerShown: false }} />
            </SafeAreaView>
        </AppProvider>
    );
}
