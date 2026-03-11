import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
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

export default function Signup() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async () => {
    if (!username || !email || !password) {
      Alert.alert("Error", "All fields are required");
      return;
    }

    try {
      // Get existing accounts
      const accountsData = await SecureStore.getItemAsync("accounts");
      let accounts = accountsData ? JSON.parse(accountsData) : [];

      // Check if username or email exists
      const exists = accounts.find(
        (acc) => acc.username === username || acc.email === email
      );

      if (exists) {
        Alert.alert("Error", "Username or email already exists");
        return;
      }

      // Add new account
      accounts.push({ username, email, password });

      await SecureStore.setItemAsync("accounts", JSON.stringify(accounts));

      Alert.alert("Success", "Account created successfully!");
      router.replace("/login");
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Something went wrong");
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
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Join us and start your entertainment journey</Text>

            <View style={styles.formContainer}>
              <TextInput
                placeholder="Username"
                placeholderTextColor="rgba(255,255,255,0.5)"
                style={styles.input}
                value={username}
                onChangeText={setUsername}
              />

              <TextInput
                placeholder="Email"
                placeholderTextColor="rgba(255,255,255,0.5)"
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />

              <TextInput
                placeholder="Password"
                placeholderTextColor="rgba(255,255,255,0.5)"
                style={styles.input}
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />

              <Text style={styles.passwordHint}>
                Password must be at least 6 characters
              </Text>

              <TouchableOpacity style={styles.button} onPress={handleSignup}>
                <LinearGradient
                  colors={['#E50914', '#990000']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.buttonGradient}
                >
                  <Text style={styles.buttonText}>Sign Up</Text>
                </LinearGradient>
              </TouchableOpacity>
              
              {/* Login Link */}
              <View style={styles.loginContainer}>
                <Text style={styles.loginText}>Already have an account? </Text>
                <TouchableOpacity onPress={() => router.replace("/login")}>
                  <Text style={styles.loginLink}>Login</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Terms and Privacy */}
            <Text style={styles.termsText}>
              By signing up, you agree to our Terms of Service and Privacy Policy
            </Text>

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
    top: Platform.OS === "ios" ? 50 : 40,
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
    paddingTop: 100,
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
  passwordHint: {
    color: "rgba(255,255,255,0.4)",
    fontSize: 11,
    marginBottom: 20,
    marginTop: -8,
    paddingLeft: 4,
  },
  button: {
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 20,
    marginTop: 10,
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
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  loginText: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 14,
  },
  loginLink: {
    color: "#E50914",
    fontSize: 14,
    fontWeight: "bold",
  },
  termsText: {
    color: "rgba(255,255,255,0.4)",
    fontSize: 11,
    textAlign: "center",
    marginTop: 30,
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