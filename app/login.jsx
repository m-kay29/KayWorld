import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const { width, height } = Dimensions.get("window");

export default function Login() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

  useEffect(() => {
    // Check for saved credentials
    loadSavedCredentials();

    // Entrance animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const loadSavedCredentials = async () => {
    try {
      const savedUsername = await SecureStore.getItemAsync("saved_username");
      if (savedUsername) {
        setUsername(savedUsername);
        setRememberMe(true);
      }
    } catch (error) {
      console.error("Error loading saved credentials:", error);
    }
  };

  const handleLogin = async () => {
    // Validation
    if (!username || !password) {
      Alert.alert("Error", "Please enter username and password");
      return;
    }

    if (username.length < 3) {
      Alert.alert("Error", "Username must be at least 3 characters");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);

    try {
      // Check admin first
      const adminData = await SecureStore.getItemAsync("adminAccount");
      const admin = adminData ? JSON.parse(adminData) : null;

      if (admin && username === admin.username && password === admin.password) {
        await SecureStore.setItemAsync("userToken", "admin_logged_in");
        await SecureStore.setItemAsync("username", admin.username);

        // Save username if remember me is checked
        if (rememberMe) {
          await SecureStore.setItemAsync("saved_username", admin.username);
        } else {
          await SecureStore.deleteItemAsync("saved_username");
        }

        router.replace("/menu");
        return;
      }

      // Check normal users
      const accountsData = await SecureStore.getItemAsync("accounts");
      const accounts = accountsData ? JSON.parse(accountsData) : [];
      const user = accounts.find(
        (acc) => acc.username === username && acc.password === password,
      );

      if (user) {
        await SecureStore.setItemAsync("userToken", "logged_in");
        await SecureStore.setItemAsync("username", user.username);

        // Save username if remember me is checked
        if (rememberMe) {
          await SecureStore.setItemAsync("saved_username", user.username);
        } else {
          await SecureStore.deleteItemAsync("saved_username");
        }

        router.replace("/menu");
      } else {
        Alert.alert("Login Failed", "Invalid username or password");
      }
    } catch (error) {
      console.log(error);
      Alert.alert("Login Error", "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    Alert.alert(
      "Reset Password",
      "Enter your email to receive password reset instructions",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Send",
          onPress: () =>
            Alert.alert("Success", "Reset instructions sent to your email"),
        },
      ],
    );
  };

  return (
    <LinearGradient
      colors={["#000000", "#330000", "#660000", "#990000", "#E50914"]}
      locations={[0, 0.3, 0.5, 0.7, 1]}
      style={styles.gradient}
    >
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Top Left Logo */}
          <TouchableOpacity
            style={styles.topLeftLogo}
            onPress={() => router.push("/welcome")}
          >
            <Text style={styles.topLeftLogoText}>MrKayWorld</Text>
          </TouchableOpacity>

          {/* Back Button */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>

          <Animated.View
            style={[
              styles.contentContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
              },
            ]}
          >
            {/* Welcome Icon */}
            <View style={styles.welcomeIcon}>
              <LinearGradient
                colors={["#E50914", "#990000"]}
                style={styles.iconGradient}
              >
                <Ionicons name="film" size={40} color="#fff" />
              </LinearGradient>
            </View>

            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>
              Sign in to continue your entertainment
            </Text>

            <View style={styles.formContainer}>
              {/* Username Input */}
              <View style={styles.inputContainer}>
                <Ionicons
                  name="person-outline"
                  size={20}
                  color="#E50914"
                  style={styles.inputIcon}
                />
                <TextInput
                  placeholder="Username"
                  placeholderTextColor="rgba(255,255,255,0.5)"
                  style={styles.input}
                  value={username}
                  onChangeText={setUsername}
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!isLoading}
                />
              </View>

              {/* Password Input */}
              <View style={styles.inputContainer}>
                <Ionicons
                  name="lock-closed-outline"
                  size={20}
                  color="#E50914"
                  style={styles.inputIcon}
                />
                <TextInput
                  placeholder="Password"
                  placeholderTextColor="rgba(255,255,255,0.5)"
                  style={styles.input}
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={setPassword}
                  editable={!isLoading}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Ionicons
                    name={showPassword ? "eye-off-outline" : "eye-outline"}
                    size={20}
                    color="rgba(255,255,255,0.5)"
                  />
                </TouchableOpacity>
              </View>

              {/* Remember Me & Forgot Password */}
              <View style={styles.row}>
                <TouchableOpacity
                  style={styles.rememberContainer}
                  onPress={() => setRememberMe(!rememberMe)}
                >
                  <View
                    style={[
                      styles.checkbox,
                      rememberMe && styles.checkboxChecked,
                    ]}
                  >
                    {rememberMe && (
                      <Ionicons name="checkmark" size={12} color="#fff" />
                    )}
                  </View>
                  <Text style={styles.rememberText}>Remember me</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={handleForgotPassword}>
                  <Text style={styles.forgotPasswordText}>
                    Forgot Password?
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Login Button */}
              <TouchableOpacity
                style={styles.button}
                onPress={handleLogin}
                disabled={isLoading}
              >
                <LinearGradient
                  colors={isLoading ? ["#666", "#444"] : ["#E50914", "#990000"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.buttonGradient}
                >
                  {isLoading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.buttonText}>Login</Text>
                  )}
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

            {/* Demo Credentials Hint */}
            <View style={styles.demoContainer}>
              <Text style={styles.demoTitle}>Demo Credentials:</Text>
              <Text style={styles.demoText}>Admin: admin / admin123</Text>
              <Text style={styles.demoText}>User: user / password123</Text>
            </View>

            {/* Decorative Elements */}
            <View style={styles.decorativeCircle1} />
            <View style={styles.decorativeCircle2} />
          </Animated.View>
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
  // Top left logo
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
  // Back button
  backButton: {
    position: "absolute",
    top: Platform.OS === "ios" ? 50 : 40,
    right: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
    padding: 25,
    minHeight: height,
    paddingTop: 120,
  },
  welcomeIcon: {
    alignItems: "center",
    marginBottom: 20,
  },
  iconGradient: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#E50914",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
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
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 12,
    marginBottom: 16,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "rgba(229, 9, 20, 0.3)",
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 16,
    color: "white",
    fontSize: 16,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  rememberContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: "#E50914",
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxChecked: {
    backgroundColor: "#E50914",
  },
  rememberText: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 12,
  },
  forgotPasswordText: {
    color: "#E50914",
    fontSize: 12,
    fontWeight: "600",
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
  demoContainer: {
    marginTop: 30,
    padding: 16,
    backgroundColor: "rgba(0,0,0,0.3)",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(229, 9, 20, 0.2)",
  },
  demoTitle: {
    color: "#E50914",
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 6,
  },
  demoText: {
    color: "rgba(255,255,255,0.5)",
    fontSize: 11,
    marginBottom: 2,
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
