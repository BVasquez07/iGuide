import { useState, useEffect} from 'react';
import { View, StyleSheet, Button, Platform } from 'react-native';
import { useAudioRecorder, useAudioPlayer, AudioModule, RecordingPresets } from 'expo-audio';
import {
  TouchableHighlight,
  Text
} from 'react-native';


const PlayAudio = (audio:Blob) => {
    const audioPlayer = useAudioPlayer(audio);
    audioPlayer.volume = 0.60;
    return (
        <View>
            <Button title="Play Audio" onPress={() => audioPlayer.play()} />
        </View>
    )
}

export default PlayAudio