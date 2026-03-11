import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
} from "react-native";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { LinearGradient } from "expo-linear-gradient";

const { width, height } = Dimensions.get("window");

export default function Login() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

const handleLogin = async () => {
  if (!username || !password) {
    Alert.alert("Error", "Please enter username and password");
    return;
  }

  try {
    // Check admin first
    const adminData = await SecureStore.getItemAsync("adminAccount");
    const admin = adminData ? JSON.parse(adminData) : null;

    if (admin && username === admin.username && password === admin.password) {
      await SecureStore.setItemAsync("userToken", "admin_logged_in");
      await SecureStore.setItemAsync("username", admin.username);
      router.replace("/menu"); 
      return;
    }

    // Check normal users
    const accountsData = await SecureStore.getItemAsync("accounts");
    const accounts = accountsData ? JSON.parse(accountsData) : [];
    const user = accounts.find(
      (acc) => acc.username === username && acc.password === password
    );

    if (user) {
      await SecureStore.setItemAsync("userToken", "logged_in");
      await SecureStore.setItemAsync("username", user.username);
      router.replace("/menu");
    } else {
      Alert.alert("Login Failed", "Invalid username or password");
    }
  } catch (error) {
    console.log(error);
    Alert.alert("Login Error", "Something went wrong");
  }
};

  return (
    <LinearGradient
      colors={['#000000', '#330000', '#660000', '#990000', '#E50914']}
      locations={[0, 0.3, 0.5, 0.7, 1]}
      style={styles.gradient}
    >
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Top Left Logo - Netflix Style */}
          <View style={styles.topLeftLogo}>
            <Text style={styles.topLeftLogoText}>MrKayWorld</Text>
          </View>

          <View style={styles.contentContainer}>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Sign in to continue your entertainment</Text>

            <View style={styles.formContainer}>
              <TextInput
                placeholder="Username"
                placeholderTextColor="rgba(255,255,255,0.5)"
                style={styles.input}
                value={username}
                onChangeText={setUsername}
              />

              <TextInput
                placeholder="Password"
                placeholderTextColor="rgba(255,255,255,0.5)"
                style={styles.input}
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />

              <TouchableOpacity style={styles.forgotPassword}>
                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <LinearGradient
                  colors={['#E50914', '#990000']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.buttonGradient}
                >
                  <Text style={styles.buttonText}>Login</Text>
                </LinearGradient>
              </TouchableOpacity>
              
              {/* Signup Link */}
              <View style={styles.signupContainer}>
                <Text style={styles.signupText}>Don't have an account? </Text>
                <TouchableOpacity onPress={() => router.push("/signup")}>
                  <Text style={styles.signupLink}>Sign Up</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Decorative Elements */}
            <View style={styles.decorativeCircle1} />
            <View style={styles.decorativeCircle2} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  // Top left logo - Netflix style
  topLeftLogo: {
    position: "absolute",
    top: Platform.OS === "ios" ? 50 : 40, // Adjust for status bar
    left: 20,
    zIndex: 10,
  },
  topLeftLogoText: {
    color: "#E50914",
    fontSize: 24,
    fontWeight: "800",
    letterSpacing: 0.5,
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
    padding: 25,
    minHeight: height,
    paddingTop: 100, // Add padding to account for the top logo
  },
  title: {
    fontSize: 32,
    color: "white",
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
    textShadowColor: "rgba(0,0,0,0.3)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  subtitle: {
    fontSize: 14,
    color: "rgba(255,255,255,0.7)",
    textAlign: "center",
    marginBottom: 40,
  },
  formContainer: {
    width: "100%",
  },
  input: {
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    color: "white",
    fontSize: 16,
    borderWidth: 1,
    borderColor: "rgba(229, 9, 20, 0.3)",
  },
  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: 24,
  },
  forgotPasswordText: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 12,
  },
  button: {
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 20,
    elevation: 5,
    shadowColor: "#E50914",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  buttonGradient: {
    paddingVertical: 16,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 18,
  },
  signupContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  signupText: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 14,
  },
  signupLink: {
    color: "#E50914",
    fontSize: 14,
    fontWeight: "bold",
  },
  decorativeCircle1: {
    position: "absolute",
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: "rgba(229, 9, 20, 0.05)",
    top: -100,
    right: -100,
    zIndex: -1,
  },
  decorativeCircle2: {
    position: "absolute",
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "rgba(229, 9, 20, 0.05)",
    bottom: -50,
    left: -50,
    zIndex: -1,
  },
});