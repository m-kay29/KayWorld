import { useEffect } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { initializeAdmin } from "../utils/initAdmin";

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    initializeAdmin();
    checkLogin();
  }, []);

  const checkLogin = async () => {
    try {
      const token = await SecureStore.getItemAsync("userToken");

      if (token === "logged_in") {
        router.replace("/menu");
      } else if (token === "admin_logged_in") {
        router.replace("/menu");
      } else {
        router.replace("/login");
      }
    } catch (error) {
      console.log("Login check error:", error);
      router.replace("/login");
    }
  };

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#E50914" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#121212",
  },
});