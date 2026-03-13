import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useEffect, useRef } from "react";
import {
  ActivityIndicator,
  Animated,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function Index() {
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.3)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    // Start entrance animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();

    // Navigate to welcome screen after delay
    const timer = setTimeout(() => {
      router.replace("/welcome");
    }, 2500); // 2.5 seconds

    // Cleanup timer
    return () => clearTimeout(timer);
  }, []);

  return (
    <LinearGradient
      colors={["#000000", "#1a0000", "#330000"]}
      style={styles.container}
    >
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }, { translateY: slideAnim }],
          },
        ]}
      >
        {/* Logo Icon */}
        <View style={styles.iconContainer}>
          <LinearGradient
            colors={["#E50914", "#990000"]}
            style={styles.iconGradient}
          >
            <Ionicons name="film" size={60} color="#fff" />
          </LinearGradient>
        </View>

        {/* Brand Name */}
        <Text style={styles.brand}>MrKayWorld</Text>

        {/* Tagline */}
        <Text style={styles.tagline}>Your Entertainment Universe</Text>

        {/* Loading Indicator */}
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#E50914" />
          <Text style={styles.loadingText}>Loading your experience...</Text>
        </View>

        {/* Version Number */}
        <Text style={styles.version}>Version 1.0.0</Text>
      </Animated.View>

      {/* Decorative Elements */}
      <View style={styles.decorativeCircle1} />
      <View style={styles.decorativeCircle2} />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
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
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  brand: {
    fontSize: 42,
    fontWeight: "800",
    color: "#E50914",
    letterSpacing: 1,
    marginBottom: 8,
    textShadowColor: "rgba(229, 9, 20, 0.3)",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  tagline: {
    fontSize: 16,
    color: "#fff",
    opacity: 0.8,
    marginBottom: 40,
    letterSpacing: 0.5,
  },
  loadingContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  loadingText: {
    color: "#aaa",
    fontSize: 14,
    marginTop: 12,
  },
  version: {
    position: "absolute",
    bottom: -100,
    color: "rgba(255,255,255,0.3)",
    fontSize: 12,
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
