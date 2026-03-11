import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  StatusBar,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

export default function Menu() {
  const router = useRouter();

  const menuItems = [
    {
      id: "movies",
      title: "Movies",
      icon: "film",
      color: "#E50914",
      description: "Blockbusters, Classics & Action",
      screen: "/movies",
    },
    {
      id: "music",
      title: "Music",
      icon: "musical-notes",
      color: "#1DB954",
      description: "Concerts, Artists & Documentaries",
      screen: "/music",
    },
    {
      id: "cartoons",
      title: "Cartoons",
      icon: "happy",
      color: "#FF6B6B",
      description: "Animated Fun for Everyone",
      screen: "/cartoons",
    },
    {
      id: "discovery",
      title: "Discovery",
      icon: "earth",
      color: "#FFB347",
      description: "Nat Geo Wild, Nature & Beyond",
      screen: "/discovery",
    },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      
      {/* Header with Gradient */}
      <LinearGradient
        colors={['#000000', '#121212']}
        style={styles.header}
      >
        <SafeAreaView>
          <Text style={styles.logo}>MrKayWorld</Text>
          <Text style={styles.welcomeText}>What would you like to explore today?</Text>
        </SafeAreaView>
      </LinearGradient>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Menu Items Grid */}
        <View style={styles.menuGrid}>
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.menuCard}
              onPress={() => router.push(item.screen)}
              activeOpacity={0.7}
            >
              <LinearGradient
                colors={[item.color, '#000']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.cardGradient}
              >
                <View style={[styles.iconContainer, { backgroundColor: item.color }]}>
                  <Ionicons name={item.icon} size={32} color="#fff" />
                </View>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.cardDescription}>{item.description}</Text>
                <View style={styles.cardFooter}>
                  <Text style={styles.exploreText}>Explore</Text>
                  <Ionicons name="arrow-forward" size={16} color="#fff" />
                </View>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </View>

        {/* Quick Stats or Info Section */}
        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>Your Entertainment Hub</Text>
          <Text style={styles.infoText}>
            Choose a category above to start watching movies, music concerts, 
            cartoons, or discovery documentaries. All in one place.
          </Text>
        </View>

        {/* Bottom Spacing */}
        <View style={{ height: 20 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  header: {
    paddingTop: 20,
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  logo: {
    color: "#E50914",
    fontSize: 32,
    fontWeight: "800",
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  welcomeText: {
    color: "#fff",
    fontSize: 16,
    opacity: 0.8,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  menuGrid: {
    gap: 16,
    marginTop: 10,
  },
  menuCard: {
    borderRadius: 16,
    overflow: "hidden",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  cardGradient: {
    padding: 20,
    minHeight: 140,
    justifyContent: "space-between",
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  cardTitle: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 4,
  },
  cardDescription: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 14,
    marginBottom: 12,
  },
  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  exploreText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  infoSection: {
    marginTop: 30,
    padding: 20,
    backgroundColor: "#121212",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#333",
  },
  infoTitle: {
    color: "#E50914",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  infoText: {
    color: "#aaa",
    fontSize: 14,
    lineHeight: 20,
  },
});