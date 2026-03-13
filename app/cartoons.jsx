import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  FlatList,
  Image,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import UserMenu from "../components/UserMenu"; // Fixed import path
import { cartoons, popular, trending } from "../data/entertainmentData";

const { width, height } = Dimensions.get("window");

export default function Cartoons() {
  const router = useRouter();
  const scrollY = useRef(new Animated.Value(0)).current;
  const [selectedAgeGroup, setSelectedAgeGroup] = useState("all");

  // Get featured cartoon (first one with hero category or first item)
  const featuredCartoon =
    cartoons.find((c) => c.category?.includes("hero")) || cartoons[0];

  // Get all cartoons
  const allCartoons = cartoons;

  // Age group categories
  const ageGroups = [
    { id: "all", title: "All Ages", icon: "people", color: "#FF6B6B" },
    { id: "kids", title: "Kids (3-7)", icon: "happy", color: "#4ECDC4" },
    { id: "family", title: "Family (8-12)", icon: "people", color: "#FFD93D" },
    { id: "teen", title: "Teen (13+)", icon: "rocket", color: "#6C5CE7" },
  ];

  // Filter functions based on content
  const getKidsContent = () =>
    cartoons.filter(
      (c) =>
        c.title?.toLowerCase().includes("bluey") ||
        c.title?.toLowerCase().includes("dora") ||
        c.genre?.toLowerCase().includes("family") ||
        (c.rating && parseFloat(c.rating) < 8.5),
    );

  const getFamilyContent = () =>
    cartoons.filter(
      (c) =>
        c.title?.toLowerCase().includes("simpsons") ||
        c.title?.toLowerCase().includes("spider") ||
        c.genre?.toLowerCase().includes("comedy") ||
        (c.rating && parseFloat(c.rating) >= 8.5 && parseFloat(c.rating) < 9.0),
    );

  const getTeenContent = () =>
    cartoons.filter(
      (c) =>
        c.title?.toLowerCase().includes("rick") ||
        c.title?.toLowerCase().includes("morty") ||
        c.genre?.toLowerCase().includes("sci-fi") ||
        (c.rating && parseFloat(c.rating) >= 9.0),
    );

  // Get filtered content based on selected age group
  const getFilteredContent = () => {
    switch (selectedAgeGroup) {
      case "kids":
        return getKidsContent();
      case "family":
        return getFamilyContent();
      case "teen":
        return getTeenContent();
      default:
        return allCartoons;
    }
  };

  // Get trending cartoons
  const trendingCartoons = trending.filter((m) =>
    cartoons.some((c) => c.id === m.id),
  );

  // Get popular cartoons
  const popularCartoons = popular.filter((m) =>
    cartoons.some((c) => c.id === m.id),
  );

  // Header animation
  const headerHeight = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [Platform.OS === "ios" ? 120 : 100, 80],
    extrapolate: "clamp",
  });

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 50, 100],
    outputRange: [1, 0.8, 0.95],
    extrapolate: "clamp",
  });

  const renderCartoonCard = ({ item, index }) => (
    <TouchableOpacity
      style={styles.cartoonCard}
      onPress={() =>
        router.push({
          pathname: "/details",
          params: { id: item.id },
        })
      }
      activeOpacity={0.8}
    >
      <View style={styles.cardImageContainer}>
        <Image
          source={item.backdrop || item.image}
          style={styles.cartoonImage}
          resizeMode="cover"
        />
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.8)"]}
          style={styles.cardGradient}
        />

        {/* Playful Character Badge */}
        <View
          style={[
            styles.characterBadge,
            { backgroundColor: getRandomColor(index) },
          ]}
        >
          <Ionicons name={getRandomIcon(index)} size={12} color="#fff" />
        </View>

        {/* Rating Badge */}
        <View style={styles.ratingBadge}>
          <Ionicons name="star" size={10} color="#FFD700" />
          <Text style={styles.ratingText}>{item.rating || "8.0"}</Text>
        </View>

        {/* Age Badge */}
        <View style={styles.ageBadge}>
          <Text style={styles.ageText}>
            {item.genre?.includes("Family")
              ? "All"
              : item.genre?.includes("Sci-Fi")
                ? "13+"
                : "7+"}
          </Text>
        </View>
      </View>

      <View style={styles.cardInfo}>
        <Text style={styles.cartoonTitle} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={styles.cartoonGenre} numberOfLines={1}>
          {item.genre?.split("/")[0] || "Animation"}
        </Text>
      </View>
    </TouchableOpacity>
  );

  // Helper functions for random playful elements
  const getRandomColor = (index) => {
    const colors = [
      "#FF6B6B",
      "#4ECDC4",
      "#FFD93D",
      "#6C5CE7",
      "#A8E6CF",
      "#FF8A5C",
    ];
    return colors[index % colors.length];
  };

  const getRandomIcon = (index) => {
    const icons = ["happy", "rocket", "star", "heart", "cafe", "ice-cream"];
    return icons[index % icons.length];
  };

  const renderAgeGroupChip = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.ageChip,
        selectedAgeGroup === item.id && { backgroundColor: item.color },
      ]}
      onPress={() => setSelectedAgeGroup(item.id)}
    >
      <Ionicons
        name={item.icon}
        size={16}
        color={selectedAgeGroup === item.id ? "#fff" : item.color}
      />
      <Text
        style={[
          styles.ageChipText,
          selectedAgeGroup === item.id && styles.ageChipTextActive,
        ]}
      >
        {item.title}
      </Text>
    </TouchableOpacity>
  );

  const renderHeroSection = () => (
    <TouchableOpacity
      style={styles.heroBanner}
      onPress={() =>
        router.push({
          pathname: "/details",
          params: { id: featuredCartoon.id },
        })
      }
      activeOpacity={0.9}
    >
      <Image
        source={featuredCartoon.backdrop || featuredCartoon.image}
        style={styles.heroImage}
      />
      <LinearGradient
        colors={["transparent", "rgba(0,0,0,0.9)"]}
        style={styles.heroGradient}
      />

      <View style={styles.heroContent}>
        <View style={[styles.heroBadge, { backgroundColor: "#FF6B6B" }]}>
          <Ionicons name="happy" size={14} color="#fff" />
          <Text style={styles.heroBadgeText}>FEATURED CARTOON</Text>
        </View>

        <Text style={styles.heroTitle}>{featuredCartoon.title}</Text>
        <Text style={styles.heroSubtitle}>
          {featuredCartoon.subtitle ||
            featuredCartoon.description?.slice(0, 80) + "..." ||
            "Fun for the whole family!"}
        </Text>

        <View style={styles.heroMeta}>
          <View style={styles.heroRating}>
            <Ionicons name="star" size={16} color="#FFD700" />
            <Text style={styles.heroRatingText}>
              {featuredCartoon.rating || "8.0"}
            </Text>
          </View>
          <Text style={styles.heroYear}>{featuredCartoon.year || "2024"}</Text>
          {featuredCartoon.duration && (
            <>
              <Text style={styles.heroDot}>•</Text>
              <Text style={styles.heroDuration}>
                {featuredCartoon.duration}
              </Text>
            </>
          )}
        </View>

        <View style={styles.heroActions}>
          <TouchableOpacity
            style={[styles.playButton, { backgroundColor: "#FF6B6B" }]}
            onPress={() =>
              router.push({
                pathname: "/details",
                params: { id: featuredCartoon.id },
              })
            }
          >
            <Ionicons name="play" size={20} color="#fff" />
            <Text style={styles.playButtonText}>Watch Now</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.favoriteButton}>
            <Ionicons name="heart-outline" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />

      {/* Animated Header */}
      <Animated.View
        style={[
          styles.headerGradient,
          { height: headerHeight, opacity: headerOpacity },
        ]}
      >
        <LinearGradient
          colors={["rgba(0,0,0,0.9)", "transparent"]}
          style={StyleSheet.absoluteFill}
        />
        <SafeAreaView style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.logo}>Cartoons</Text>
          <UserMenu />
        </SafeAreaView>
      </Animated.View>

      <Animated.ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false },
        )}
        scrollEventThrottle={16}
      >
        {/* Hero Banner */}
        {featuredCartoon && renderHeroSection()}

        {/* Age Group Filter */}
        <View style={styles.ageSection}>
          <FlatList
            data={ageGroups}
            renderItem={renderAgeGroupChip}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.ageList}
          />
        </View>

        {/* Featured Section - Based on age group */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleContainer}>
              <Ionicons name="happy" size={20} color="#FF6B6B" />
              <Text style={styles.sectionTitle}>
                {ageGroups.find((a) => a.id === selectedAgeGroup)?.title ||
                  "All"}{" "}
                Cartoons
              </Text>
            </View>
            <TouchableOpacity onPress={() => {}}>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={getFilteredContent().slice(0, 8)}
            renderItem={renderCartoonCard}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.cartoonList}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No cartoons found</Text>
              </View>
            }
          />
        </View>

        {/* Kids Corner */}
        {getKidsContent().length > 0 && selectedAgeGroup === "all" && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleContainer}>
                <Ionicons name="happy" size={20} color="#4ECDC4" />
                <Text style={styles.sectionTitle}>🧸 Kids Corner (3-7)</Text>
              </View>
              <TouchableOpacity onPress={() => setSelectedAgeGroup("kids")}>
                <Text style={styles.seeAll}>See All</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={getKidsContent().slice(0, 6)}
              renderItem={renderCartoonCard}
              keyExtractor={(item) => item.id.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.cartoonList}
            />
          </View>
        )}

        {/* Family Favorites */}
        {getFamilyContent().length > 0 && selectedAgeGroup === "all" && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleContainer}>
                <Ionicons name="people" size={20} color="#FFD93D" />
                <Text style={styles.sectionTitle}>👪 Family Favorites</Text>
              </View>
              <TouchableOpacity onPress={() => setSelectedAgeGroup("family")}>
                <Text style={styles.seeAll}>See All</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={getFamilyContent().slice(0, 6)}
              renderItem={renderCartoonCard}
              keyExtractor={(item) => item.id.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.cartoonList}
            />
          </View>
        )}

        {/* Teen Zone */}
        {getTeenContent().length > 0 && selectedAgeGroup === "all" && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleContainer}>
                <Ionicons name="rocket" size={20} color="#6C5CE7" />
                <Text style={styles.sectionTitle}>🚀 Teen Zone (13+)</Text>
              </View>
              <TouchableOpacity onPress={() => setSelectedAgeGroup("teen")}>
                <Text style={styles.seeAll}>See All</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={getTeenContent().slice(0, 6)}
              renderItem={renderCartoonCard}
              keyExtractor={(item) => item.id.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.cartoonList}
            />
          </View>
        )}

        {/* Trending Cartoons */}
        {trendingCartoons.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleContainer}>
                <Ionicons name="flame" size={20} color="#FF6B6B" />
                <Text style={styles.sectionTitle}>🔥 Trending Now</Text>
              </View>
              <TouchableOpacity onPress={() => {}}>
                <Text style={styles.seeAll}>See All</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={trendingCartoons.slice(0, 6)}
              renderItem={renderCartoonCard}
              keyExtractor={(item) => item.id.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.cartoonList}
            />
          </View>
        )}

        {/* Popular Cartoons */}
        {popularCartoons.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleContainer}>
                <Ionicons name="heart" size={20} color="#FF6B6B" />
                <Text style={styles.sectionTitle}>⭐ Fan Favorites</Text>
              </View>
              <TouchableOpacity onPress={() => {}}>
                <Text style={styles.seeAll}>See All</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={popularCartoons.slice(0, 6)}
              renderItem={renderCartoonCard}
              keyExtractor={(item) => item.id.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.cartoonList}
            />
          </View>
        )}

        {/* Bottom Spacing */}
        <View style={{ height: 30 }} />
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  headerGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: Platform.OS === "ios" ? 50 : 30,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
  },
  logo: {
    color: "#FF6B6B",
    fontSize: 20,
    fontWeight: "700",
  },
  scrollView: {
    flex: 1,
  },
  // Hero Banner
  heroBanner: {
    height: height * 0.6,
    width: width,
    marginBottom: 20,
  },
  heroImage: {
    width: width,
    height: height * 0.6,
  },
  heroGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: height * 0.4,
  },
  heroContent: {
    position: "absolute",
    bottom: 40,
    left: 20,
    right: 20,
  },
  heroBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    alignSelf: "flex-start",
    marginBottom: 12,
    gap: 6,
  },
  heroBadgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  heroTitle: {
    color: "#fff",
    fontSize: 36,
    fontWeight: "800",
    marginBottom: 8,
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  heroSubtitle: {
    color: "#fff",
    fontSize: 14,
    opacity: 0.9,
    marginBottom: 12,
    lineHeight: 20,
  },
  heroMeta: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    gap: 8,
  },
  heroRating: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  heroRatingText: {
    color: "#FFD700",
    fontSize: 14,
    fontWeight: "600",
  },
  heroYear: {
    color: "#aaa",
    fontSize: 14,
  },
  heroDot: {
    color: "#aaa",
    fontSize: 14,
  },
  heroDuration: {
    color: "#aaa",
    fontSize: 14,
  },
  heroActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  playButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    gap: 8,
  },
  playButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  favoriteButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  // Age Group Filter
  ageSection: {
    marginBottom: 20,
  },
  ageList: {
    paddingHorizontal: 16,
    gap: 10,
  },
  ageChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#1a1a1a",
    borderWidth: 1,
    borderColor: "#333",
    gap: 6,
  },
  ageChipText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
  },
  ageChipTextActive: {
    color: "#fff",
    fontWeight: "700",
  },
  // Sections
  section: {
    marginTop: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  sectionTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  sectionTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  seeAll: {
    color: "#FF6B6B",
    fontSize: 14,
    fontWeight: "600",
  },
  cartoonList: {
    paddingLeft: 16,
    paddingRight: 8,
  },
  cartoonCard: {
    width: 140,
    marginRight: 12,
  },
  cardImageContainer: {
    width: 140,
    height: 200,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#1a1a1a",
    position: "relative",
  },
  cartoonImage: {
    width: "100%",
    height: "100%",
  },
  cardGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  characterBadge: {
    position: "absolute",
    top: 8,
    left: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 5,
  },
  ratingBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.7)",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    gap: 2,
    zIndex: 5,
  },
  ratingText: {
    color: "#FFD700",
    fontSize: 10,
    fontWeight: "600",
  },
  ageBadge: {
    position: "absolute",
    bottom: 8,
    right: 8,
    backgroundColor: "rgba(255, 107, 107, 0.9)",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    zIndex: 5,
  },
  ageText: {
    color: "#fff",
    fontSize: 9,
    fontWeight: "600",
  },
  cardInfo: {
    marginTop: 8,
    paddingHorizontal: 4,
  },
  cartoonTitle: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 2,
  },
  cartoonGenre: {
    color: "#888",
    fontSize: 11,
  },
  // Empty State
  emptyContainer: {
    width: width - 32,
    height: 200,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    color: "#666",
    fontSize: 14,
  },
});
