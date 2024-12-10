import { View, StyleSheet, Button } from 'react-native';
import * as Speech from 'expo-speech';

export default function AudioRecording() {
  const speak = () => {
    Speech.speak('Hello, how are you feeling today?');
  };

  return (
    <View style={styles.container}>
      <Button title="Press to hear some words" onPress={speak} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#ecf0f1',
    padding: 8,
  },
});
