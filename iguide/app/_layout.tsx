import { Stack } from "expo-router";

export default function Layout() {
  return (
      <Stack>
        <Stack.Screen name="guide" options={{ title: "Capture & Speak" }} />
      </Stack>
  );
}
