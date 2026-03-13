import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import {
  Dimensions,
  ImageBackground,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width, height } = Dimensions.get("window");

export default function Welcome() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />

      <ImageBackground
        source={require("../assets/images/backdrops/movies/dora-backdrop.jpg")}
        style={styles.background}
        resizeMode="cover"
      >
        {/* Dark Gradient Overlay - covers entire ImageBackground */}
        <LinearGradient
          colors={["rgba(0,0,0,0.3)", "rgba(0,0,0,0.9)"]}
          style={styles.overlay}
        >
          {/* Top Bar with Logo and Sign In */}
          <View style={styles.topBar}>
            <Text style={styles.logo}>MrKayWorld</Text>
            <TouchableOpacity
              style={styles.signInButton}
              onPress={() => router.push("/login")}
              activeOpacity={0.8}
            >
              <Text style={styles.signInText}>Sign In</Text>
            </TouchableOpacity>
          </View>

          {/* Main Content - Centered */}
          <View style={styles.content}>
            <View style={styles.iconContainer}>
              <LinearGradient
                colors={["#E50914", "#990000"]}
                style={styles.iconGradient}
              >
                <Ionicons name="film" size={50} color="#fff" />
              </LinearGradient>
            </View>

            <Text style={styles.title}>Unlimited Entertainment</Text>
            <Text style={styles.subtitle}>
              Movies • Music • Cartoons • Discovery
            </Text>

            <TouchableOpacity
              style={styles.getStartedButton}
              onPress={() => router.push("/signup")}
              activeOpacity={0.8}
            >
              <Text style={styles.getStartedText}>Get Started</Text>
            </TouchableOpacity>

            <Text style={styles.disclaimer}>
              Join MrKayWorld today. Cancel anytime.
            </Text>
          </View>

          {/* Decorative Elements */}
          <View style={styles.decorativeCircle1} />
          <View style={styles.decorativeCircle2} />
        </LinearGradient>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  background: {
    flex: 1,
    width: width,
    height: height,
  },
  overlay: {
    flex: 1,
    width: width,
    height: height,
    paddingTop: Platform.OS === "ios" ? 50 : 40,
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    zIndex: 10,
  },
  logo: {
    color: "#E50914",
    fontSize: 28,
    fontWeight: "800",
    letterSpacing: 1,
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  signInButton: {
    backgroundColor: "#E50914",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
  },
  signInText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: -50, // Adjust for visual centering
  },
  iconContainer: {
    marginBottom: 20,
    shadowColor: "#E50914",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  iconGradient: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    color: "#fff",
    fontSize: 36,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 10,
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    color: "#fff",
    fontSize: 18,
    textAlign: "center",
    marginBottom: 30,
    opacity: 0.9,
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  getStartedButton: {
    backgroundColor: "#E50914",
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 4,
    marginBottom: 15,
    width: width * 0.7,
    alignItems: "center",
  },
  getStartedText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
  disclaimer: {
    color: "#fff",
    fontSize: 12,
    opacity: 0.7,
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
