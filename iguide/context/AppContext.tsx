import React, { createContext, useState, useContext } from "react";
import * as FileSystem from "expo-file-system";

interface AppContextType {
    text: string;
    setText: (text: string) => void;
    audioUri: string | null;
    setAudioUri: (uri: string | null) => void;
    imageUri: string | null;
    setImageUri: (uri: string | null) => void;
    cacheAudio: (uri: string) => Promise<void>;
    cacheImage: (uri: string) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [text, setText] = useState<string>("");
    const [audioUri, setAudioUri] = useState<string | null>(null);
    const [imageUri, setImageUri] = useState<string | null>(null);

    // Function to cache recorded audio
    const cacheAudio = async (uri: string) => {
        try {
            const fileName = `recording-${Date.now()}.m4a`;
            const cachedPath = `${FileSystem.cacheDirectory}${fileName}`;
            await FileSystem.copyAsync({ from: uri, to: cachedPath });
            setAudioUri(cachedPath);
        } catch (error) {
            console.error("Error caching audio:", error);
        }
    };

    // Function to cache captured image
    const cacheImage = async (uri: string) => {
        try {
            const fileName = `image-${Date.now()}.jpg`;
            const cachedPath = `${FileSystem.cacheDirectory}${fileName}`;
            await FileSystem.copyAsync({ from: uri, to: cachedPath });
            setImageUri(cachedPath);
        } catch (error) {
            console.error("Error caching image:", error);
        }
    };

    return (
        <AppContext.Provider value={{ text, setText, audioUri, setAudioUri, imageUri, setImageUri, cacheAudio, cacheImage }}>
            {children}
        </AppContext.Provider>
    );
};

// Custom hook for easy context access
export const useAppContext = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error("useAppContext must be used within an AppProvider");
    }
    return context;
};
