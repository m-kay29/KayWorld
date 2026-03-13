import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Auth Flow */}
      <Stack.Screen name="index" />
      <Stack.Screen name="welcome" />
      <Stack.Screen name="login" />
      <Stack.Screen name="signup" />
      {/* Main App */}
      <Stack.Screen name="menu" />
      {/* Category Screens */}
      <Stack.Screen name="movies" />
      <Stack.Screen name="music" />
      <Stack.Screen name="cartoons" />
      <Stack.Screen name="discovery" />
      {/* Content */}
      <Stack.Screen name="details" />
      <Stack.Screen name="category" />
      {/* User Features */}
      <Stack.Screen name="profile" />
      <Stack.Screen name="profile-settings" />
      <Stack.Screen name="my-list" />
      <Stack.Screen name="downloads" />
      <Stack.Screen name="watch-history" />
      <Stack.Screen name="admin" />
    </Stack>
  );
}
