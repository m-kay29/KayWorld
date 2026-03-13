import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  FlatList,
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import UserMenu from "../components/UserMenu"; // Import the reusable component
import {
  cartoons,
  discovery,
  moviesCategory,
  music,
} from "../data/entertainmentData";

const { width, height } = Dimensions.get("window");

export default function Menu() {
  const router = useRouter();
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);
  const flatListRef = useRef(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  // Collect all backdrop images for hero slideshow
  const heroSlides = [
    ...moviesCategory.slice(0, 5).map((item) => ({
      ...item,
      uniqueId: `movie-${item.id}`,
    })),
    ...music.slice(0, 2).map((item) => ({
      ...item,
      uniqueId: `music-${item.id}`,
    })),
    ...cartoons.slice(0, 2).map((item) => ({
      ...item,
      uniqueId: `cartoon-${item.id}`,
    })),
    ...discovery.slice(0, 4).map((item) => ({
      ...item,
      uniqueId: `discovery-${item.id}`,
    })),
  ].map((item) => ({
    id: item.uniqueId,
    image: item.backdrop || item.image,
    title: item.title,
    type: item.genre?.split("/")[0] || "Entertainment",
  }));

  const categoryImages = {
    movies:
      moviesCategory[7]?.image ||
      require("../assets/images/backdrops/movies/dune-backdrop.jpg"),
    music:
      music[0]?.image ||
      require("../assets/images/backdrops/music/beyonce-backdrop.jpg"),
    cartoons:
      cartoons[4]?.image ||
      require("../assets/images/backdrops/cartoons/rickmorty-backdrop.jpg"),
    discovery:
      discovery[8]?.image ||
      require("../assets/images/backdrops/discovery/planetearth-backdrop.jpg"),
  };

  useEffect(() => {
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
    ]).start();

    // Auto-slide hero banner
    const interval = setInterval(() => {
      if (flatListRef.current && heroSlides.length > 0) {
        const nextIndex = (currentHeroIndex + 1) % heroSlides.length;
        setCurrentHeroIndex(nextIndex);
        flatListRef.current.scrollToIndex({
          index: nextIndex,
          animated: true,
        });
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [currentHeroIndex, heroSlides.length]);

  const menuItems = [
    {
      id: "movies",
      title: "Movies",
      icon: "film",
      color: "#E50914",
      description: "Blockbusters, Classics & Action",
      screen: "/movies",
      gradientColors: ["#E50914", "#990000"],
      image: categoryImages.movies,
    },
    {
      id: "music",
      title: "Music",
      icon: "musical-notes",
      color: "#1DB954",
      description: "Concerts, Artists & Documentaries",
      screen: "/music",
      gradientColors: ["#1DB954", "#0F6B2B"],
      image: categoryImages.music,
    },
    {
      id: "cartoons",
      title: "Cartoons",
      icon: "happy",
      color: "#FF6B6B",
      description: "Animated Fun for Everyone",
      screen: "/cartoons",
      gradientColors: ["#FF6B6B", "#C23B3B"],
      image: categoryImages.cartoons,
    },
    {
      id: "discovery",
      title: "Discovery",
      icon: "earth",
      color: "#FFB347",
      description: "Nat Geo Wild, Nature & Beyond",
      screen: "/discovery",
      gradientColors: ["#FFB347", "#C4701F"],
      image: categoryImages.discovery,
    },
  ];

  const renderHeroSlide = ({ item }) => (
    <TouchableOpacity
      style={styles.heroSlide}
      onPress={() =>
        router.push({
          pathname: "/details",
          params: { id: item.id },
        })
      }
      activeOpacity={0.9}
    >
      <View style={styles.heroImageContainer}>
        <Image
          source={item.image}
          style={styles.heroImage}
          resizeMode="center"
        />
      </View>
      <LinearGradient
        colors={["transparent", "rgba(0,0,0,0.8)"]}
        style={styles.heroGradient}
      />
      <View style={styles.heroTextContainer}>
        <Text style={styles.heroTitle}>{item.title}</Text>
        <Text style={styles.heroType}>{item.type}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderPaginationDot = (index) => (
    <View
      key={index}
      style={[
        styles.paginationDot,
        index === currentHeroIndex && styles.paginationDotActive,
      ]}
    />
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />

      {/* Header with Profile Dropdown */}
      <LinearGradient
        colors={["#000000", "#1a0000", "#330000"]}
        style={styles.header}
      >
        <SafeAreaView style={styles.headerContent}>
          <Text style={styles.logo}>MrKayWorld</Text>
          <UserMenu />
        </SafeAreaView>
      </LinearGradient>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Hero Banner Slideshow */}
        {heroSlides.length > 0 && (
          <Animated.View
            style={[
              styles.heroSection,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <FlatList
              ref={flatListRef}
              data={heroSlides}
              renderItem={renderHeroSlide}
              keyExtractor={(item) => item.id}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onMomentumScrollEnd={(event) => {
                const index = Math.floor(
                  event.nativeEvent.contentOffset.x / width,
                );
                setCurrentHeroIndex(index);
              }}
            />

            {/* Pagination Dots */}
            <View style={styles.paginationContainer}>
              {heroSlides.map((_, index) => renderPaginationDot(index))}
            </View>
          </Animated.View>
        )}

        {/* Menu Items Grid */}
        <Animated.View
          style={[
            styles.menuGrid,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Text style={styles.sectionTitle}>Explore Categories</Text>

          {menuItems.map((item, index) => (
            <Animated.View
              key={item.id}
              style={{
                transform: [
                  {
                    translateY: slideAnim.interpolate({
                      inputRange: [0, 50],
                      outputRange: [0, (index + 1) * 10],
                    }),
                  },
                ],
              }}
            >
              <TouchableOpacity
                style={styles.menuCard}
                onPress={() => router.push(item.screen)}
                activeOpacity={0.8}
              >
                <View style={styles.cardImageContainer}>
                  <Image
                    source={item.image}
                    style={styles.cardBackgroundImage}
                    resizeMode="stretch"
                  />
                </View>
                <LinearGradient
                  colors={[
                    "transparent",
                    "rgba(0,0,0,0.8)",
                    "rgba(0,0,0,0.95)",
                  ]}
                  style={styles.cardOverlay}
                />
                <LinearGradient
                  colors={item.gradientColors}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.cardAccent}
                />

                <View style={styles.cardContent}>
                  <View
                    style={[
                      styles.iconContainer,
                      { backgroundColor: item.color },
                    ]}
                  >
                    <Ionicons name={item.icon} size={28} color="#fff" />
                  </View>
                  <View style={styles.cardTextContent}>
                    <Text style={styles.cardTitle}>{item.title}</Text>
                    <Text style={styles.cardDescription}>
                      {item.description}
                    </Text>
                  </View>
                  <View style={styles.cardArrow}>
                    <Ionicons
                      name="arrow-forward-circle"
                      size={32}
                      color={item.color}
                    />
                  </View>
                </View>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </Animated.View>

        {/* Bottom Spacing */}
        <View style={{ height: 20 }} />
      </ScrollView>
    </View>
  );
}

// Keep all your existing styles here - they remain the same
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  header: {
    paddingTop: 0,
    paddingBottom: 15,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    zIndex: 1000,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logo: {
    color: "#E50914",
    fontSize: 24,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  scrollView: {
    flex: 1,
    zIndex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  // Hero Section
  heroSection: {
    height: height * 0.3,
    marginBottom: 24,
    borderRadius: 16,
    overflow: "hidden",
  },
  heroSlide: {
    width: width - 32,
    height: height * 0.3,
    marginRight: 0,
    position: "relative",
    borderRadius: 16,
    overflow: "hidden",
  },
  heroImageContainer: {
    width: "100%",
    height: "100%",
    backgroundColor: "#1a1a1a",
  },
  heroImage: {
    width: "100%",
    height: "100%",
  },
  heroGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "60%",
  },
  heroTextContainer: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
  },
  heroTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 4,
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  heroType: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 14,
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  paginationContainer: {
    position: "absolute",
    bottom: 10,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
  },
  paginationDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "rgba(255,255,255,0.4)",
  },
  paginationDotActive: {
    width: 16,
    backgroundColor: "#E50914",
  },
  sectionTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 16,
    marginLeft: 4,
  },
  menuGrid: {
    gap: 16,
  },
  // Category Cards
  menuCard: {
    height: height * 0.2,
    borderRadius: 16,
    overflow: "hidden",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    position: "relative",
  },
  cardImageContainer: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundColor: "#1a1a1a",
  },
  cardBackgroundImage: {
    width: "100%",
    height: "100%",
  },
  cardOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  cardAccent: {
    position: "absolute",
    top: 0,
    left: 0,
    width: 4,
    height: "100%",
  },
  cardContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    gap: 12,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  cardTextContent: {
    flex: 1,
  },
  cardTitle: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 4,
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  cardDescription: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 13,
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  cardArrow: {
    justifyContent: "center",
    alignItems: "center",
  },
});
