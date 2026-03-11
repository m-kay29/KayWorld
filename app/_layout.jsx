import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="welcome" />
      <Stack.Screen name="index" />
      <Stack.Screen name="login" />
      <Stack.Screen name="menu" />
      <Stack.Screen name="movies" />
      <Stack.Screen name="music" />
      <Stack.Screen name="cartoons" />
      <Stack.Screen name="discovery" />
      <Stack.Screen name="details" />
      <Stack.Screen name="download" />
      <Stack.Screen name="profile" />
      <Stack.Screen name="signup" />

    </Stack>
  );
}