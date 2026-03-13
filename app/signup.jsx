import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
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

export default function Signup() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  // Password strength checker
  useEffect(() => {
    let strength = 0;
    if (password.length >= 6) strength += 1;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    setPasswordStrength(Math.min(strength, 4));
  }, [password]);

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSignup = async () => {
    // Validation checks
    if (!username || !email || !password || !confirmPassword) {
      Alert.alert("Error", "All fields are required");
      return;
    }

    if (username.length < 3) {
      Alert.alert("Error", "Username must be at least 3 characters long");
      return;
    }

    if (!validateEmail(email)) {
      Alert.alert("Error", "Please enter a valid email address");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters long");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    setIsLoading(true);

    try {
      // Get existing accounts
      const accountsData = await SecureStore.getItemAsync("accounts");
      let accounts = accountsData ? JSON.parse(accountsData) : [];

      // Check if username or email exists
      const usernameExists = accounts.find(
        (acc) => acc.username.toLowerCase() === username.toLowerCase(),
      );

      const emailExists = accounts.find(
        (acc) => acc.email.toLowerCase() === email.toLowerCase(),
      );

      if (usernameExists) {
        Alert.alert("Error", "Username already exists");
        setIsLoading(false);
        return;
      }

      if (emailExists) {
        Alert.alert("Error", "Email already registered");
        setIsLoading(false);
        return;
      }

      // Add new account with timestamp
      const newAccount = {
        username,
        email,
        password,
        createdAt: new Date().toISOString(),
        isAdmin: false,
      };

      accounts.push(newAccount);
      await SecureStore.setItemAsync("accounts", JSON.stringify(accounts));

      Alert.alert(
        "Success 🎉",
        "Account created successfully! You can now log in.",
        [
          {
            text: "Continue to Login",
            onPress: () => router.replace("/login"),
          },
        ],
      );
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const getPasswordStrengthColor = () => {
    const colors = ["#FF4444", "#FF8C44", "#FFD344", "#8BC34A", "#4CAF50"];
    return colors[passwordStrength] || "#FF4444";
  };

  const getPasswordStrengthText = () => {
    const texts = ["Weak", "Fair", "Good", "Strong", "Very Strong"];
    return texts[passwordStrength] || "Weak";
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

          <View style={styles.contentContainer}>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>
              Join millions of entertainment lovers
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
                />
              </View>

              {/* Email Input */}
              <View style={styles.inputContainer}>
                <Ionicons
                  name="mail-outline"
                  size={20}
                  color="#E50914"
                  style={styles.inputIcon}
                />
                <TextInput
                  placeholder="Email"
                  placeholderTextColor="rgba(255,255,255,0.5)"
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
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

              {/* Password Strength Meter */}
              {password.length > 0 && (
                <View style={styles.strengthContainer}>
                  <View style={styles.strengthBarContainer}>
                    {[1, 2, 3, 4].map((level) => (
                      <View
                        key={level}
                        style={[
                          styles.strengthBar,
                          {
                            backgroundColor:
                              level <= passwordStrength
                                ? getPasswordStrengthColor()
                                : "rgba(255,255,255,0.1)",
                          },
                        ]}
                      />
                    ))}
                  </View>
                  <Text
                    style={[
                      styles.strengthText,
                      { color: getPasswordStrengthColor() },
                    ]}
                  >
                    {getPasswordStrengthText()}
                  </Text>
                </View>
              )}

              {/* Confirm Password Input */}
              <View style={styles.inputContainer}>
                <Ionicons
                  name="lock-closed-outline"
                  size={20}
                  color="#E50914"
                  style={styles.inputIcon}
                />
                <TextInput
                  placeholder="Confirm Password"
                  placeholderTextColor="rgba(255,255,255,0.5)"
                  style={styles.input}
                  secureTextEntry={!showConfirmPassword}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                />
                <TouchableOpacity
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <Ionicons
                    name={
                      showConfirmPassword ? "eye-off-outline" : "eye-outline"
                    }
                    size={20}
                    color="rgba(255,255,255,0.5)"
                  />
                </TouchableOpacity>
              </View>

              {/* Password Match Indicator */}
              {confirmPassword.length > 0 && (
                <View style={styles.matchContainer}>
                  <Ionicons
                    name={
                      password === confirmPassword
                        ? "checkmark-circle"
                        : "close-circle"
                    }
                    size={16}
                    color={password === confirmPassword ? "#4CAF50" : "#FF4444"}
                  />
                  <Text
                    style={[
                      styles.matchText,
                      {
                        color:
                          password === confirmPassword ? "#4CAF50" : "#FF4444",
                      },
                    ]}
                  >
                    {password === confirmPassword
                      ? "Passwords match"
                      : "Passwords don't match"}
                  </Text>
                </View>
              )}

              <Text style={styles.passwordHint}>
                Use 6+ characters with mix of letters, numbers & symbols
              </Text>

              {/* Sign Up Button */}
              <TouchableOpacity
                style={styles.button}
                onPress={handleSignup}
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
                    <Text style={styles.buttonText}>Sign Up</Text>
                  )}
                </LinearGradient>
              </TouchableOpacity>

              {/* Login Link */}
              <View style={styles.loginContainer}>
                <Text style={styles.loginText}>Already have an account? </Text>
                <TouchableOpacity onPress={() => router.replace("/login")}>
                  <Text style={styles.loginLink}>Log In</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Terms and Privacy */}
            <Text style={styles.termsText}>
              By signing up, you agree to our{" "}
              <Text style={styles.termsLink}>Terms of Service</Text> and{" "}
              <Text style={styles.termsLink}>Privacy Policy</Text>
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
  title: {
    fontSize: 36,
    color: "white",
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
    textShadowColor: "rgba(0,0,0,0.3)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  subtitle: {
    fontSize: 16,
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
  // Password strength
  strengthContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    marginTop: -8,
  },
  strengthBarContainer: {
    flex: 1,
    flexDirection: "row",
    gap: 4,
    marginRight: 10,
  },
  strengthBar: {
    flex: 1,
    height: 4,
    borderRadius: 2,
  },
  strengthText: {
    fontSize: 12,
    fontWeight: "600",
  },
  // Password match
  matchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    marginTop: -8,
    gap: 6,
  },
  matchText: {
    fontSize: 12,
  },
  passwordHint: {
    color: "rgba(255,255,255,0.4)",
    fontSize: 11,
    marginBottom: 20,
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
  termsLink: {
    color: "#E50914",
    textDecorationLine: "underline",
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
