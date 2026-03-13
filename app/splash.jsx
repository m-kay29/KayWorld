import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useEffect, useRef } from "react";
import { Animated, Easing, StatusBar, StyleSheet, Text, View } from "react-native";

export default function Splash() {
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.3)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    // Hide status bar for clean splash
    StatusBar.setHidden(true);

    // Animate logo entrance
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
        easing: Easing.out(Easing.back(1.5)),
      }),
    ]).start();

    // Navigate to welcome screen after delay
    const timer = setTimeout(() => {
      StatusBar.setHidden(false);
      router.replace("/welcome");
    }, 3000);

    return () => {
      clearTimeout(timer);
      StatusBar.setHidden(false);
    };
  }, []);

  return (
    <LinearGradient
      colors={["#000000", "#1a0000", "#330000", "#4d0000", "#E50914"]}
      locations={[0, 0.2, 0.4, 0.6, 1]}
      style={styles.container}
    >
      <View style={styles.content}>
        {/* Animated Logo Container */}
        <Animated.View
          style={[
            styles.logoContainer,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }, { translateY: slideAnim }],
            },
          ]}
        >
          <View style={styles.iconContainer}>
            <Ionicons name="film" size={50} color="#E50914" />
          </View>
          <Text style={styles.logo}>KayWorld</Text>
          <View style={styles.logoUnderline} />
        </Animated.View>

        {/* Animated Subtitle */}
        <Animated.View style={{ opacity: fadeAnim }}>
          <Text style={styles.subtitle}>Unlimited Entertainment</Text>
        </Animated.View>

        {/* Loading Dots */}
        <View style={styles.loadingContainer}>
          {[0, 1, 2].map((dot) => (
            <Animated.View
              key={dot}
              style={[
                styles.loadingDot,
                {
                  backgroundColor: "#E50914",
                  opacity: fadeAnim,
                  transform: [
                    {
                      scale: fadeAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.5, 1],
                      }),
                    },
                  ],
                },
              ]}
            />
          ))}
        </View>

        {/* Tagline */}
        <Animated.Text style={[styles.tagline, { opacity: fadeAnim }]}>
          Movies • Music • Cartoons • Discovery
        </Animated.Text>
      </View>

      {/* Version Number */}
      <Text style={styles.version}>Version 1.0.0</Text>
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
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "rgba(229, 9, 20, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
    borderWidth: 2,
    borderColor: "#E50914",
  },
  logo: {
    fontSize: 48,
    color: "#E50914",
    fontWeight: "800",
    letterSpacing: 1,
    textShadowColor: "rgba(229, 9, 20, 0.3)",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  logoUnderline: {
    width: 60,
    height: 3,
    backgroundColor: "#E50914",
    marginTop: 10,
    borderRadius: 2,
  },
  subtitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "500",
    marginTop: 10,
    opacity: 0.9,
    letterSpacing: 0.5,
  },
  loadingContainer: {
    flexDirection: "row",
    marginTop: 40,
    gap: 10,
  },
  loadingDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#E50914",
  },
  tagline: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 14,
    marginTop: 30,
    letterSpacing: 1,
  },
  version: {
    position: "absolute",
    bottom: 30,
    color: "rgba(255,255,255,0.3)",
    fontSize: 12,
  },
});
