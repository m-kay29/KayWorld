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
import { discovery, popular, trending } from "../data/entertainmentData";

const { width, height } = Dimensions.get("window");

export default function Discovery() {
  const router = useRouter();
  const scrollY = useRef(new Animated.Value(0)).current;
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Get featured discovery (first one with hero category or first item)
  const featuredDiscovery =
    discovery.find((d) => d.category?.includes("hero")) || discovery[0];

  // Get all discovery
  const allDiscovery = discovery;

  // Define categories for filtering
  const categories = [
    { id: "all", title: "All", icon: "apps" },
    { id: "wildlife", title: "Wildlife", icon: "paw" },
    { id: "ocean", title: "Ocean", icon: "water" },
    { id: "space", title: "Space", icon: "planet" },
    { id: "nature", title: "Nature", icon: "leaf" },
  ];

  // Filter functions
  const getWildlifeContent = () =>
    discovery.filter(
      (d) =>
        d.title?.toLowerCase().includes("tiger") ||
        d.title?.toLowerCase().includes("wolf") ||
        d.title?.toLowerCase().includes("gorilla") ||
        d.title?.toLowerCase().includes("deer") ||
        d.title?.toLowerCase().includes("lion") ||
        d.title?.toLowerCase().includes("bear"),
    );

  const getOceanContent = () =>
    discovery.filter(
      (d) =>
        d.title?.toLowerCase().includes("ocean") ||
        d.title?.toLowerCase().includes("sea") ||
        d.title?.toLowerCase().includes("turtle") ||
        d.title?.toLowerCase().includes("sealion") ||
        d.title?.toLowerCase().includes("fish"),
    );

  const getSpaceContent = () =>
    discovery.filter(
      (d) =>
        d.title?.toLowerCase().includes("planet") ||
        d.title?.toLowerCase().includes("universe") ||
        d.title?.toLowerCase().includes("space") ||
        d.title?.toLowerCase().includes("cosmos"),
    );

  const getNatureContent = () =>
    discovery.filter(
      (d) =>
        d.title?.toLowerCase().includes("mountain") ||
        d.title?.toLowerCase().includes("waterfall") ||
        d.title?.toLowerCase().includes("forest") ||
        d.title?.toLowerCase().includes("frozen") ||
        (!getWildlifeContent().includes(d) &&
          !getOceanContent().includes(d) &&
          !getSpaceContent().includes(d)),
    );

  // Get filtered content based on selected category
  const getFilteredContent = () => {
    switch (selectedCategory) {
      case "wildlife":
        return getWildlifeContent();
      case "ocean":
        return getOceanContent();
      case "space":
        return getSpaceContent();
      case "nature":
        return getNatureContent();
      default:
        return allDiscovery;
    }
  };

  // Get trending discovery
  const trendingDiscovery = trending.filter((m) =>
    discovery.some((d) => d.id === m.id),
  );

  // Get popular discovery
  const popularDiscovery = popular.filter((m) =>
    discovery.some((d) => d.id === m.id),
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

  const renderDiscoveryCard = ({ item, index }) => (
    <TouchableOpacity
      style={styles.discoveryCard}
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
          style={styles.discoveryImage}
          resizeMode="cover"
        />
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.8)"]}
          style={styles.cardGradient}
        />

        {/* Rating Badge */}
        <View style={styles.ratingBadge}>
          <Ionicons name="star" size={10} color="#FFD700" />
          <Text style={styles.ratingText}>{item.rating || "8.0"}</Text>
        </View>

        {/* Category Badge */}
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryBadgeText}>
            {item.genre?.split("/")[0] || "Documentary"}
          </Text>
        </View>
      </View>

      <View style={styles.cardInfo}>
        <Text style={styles.discoveryTitle} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={styles.discoverySubtitle} numberOfLines={1}>
          {item.subtitle || item.genre || "Nature Documentary"}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderCategoryChip = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.categoryChip,
        selectedCategory === item.id && styles.categoryChipActive,
      ]}
      onPress={() => setSelectedCategory(item.id)}
    >
      <Ionicons
        name={item.icon}
        size={16}
        color={selectedCategory === item.id ? "#fff" : "#FFB347"}
      />
      <Text
        style={[
          styles.categoryChipText,
          selectedCategory === item.id && styles.categoryChipTextActive,
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
          params: { id: featuredDiscovery.id },
        })
      }
      activeOpacity={0.9}
    >
      <Image
        source={featuredDiscovery.backdrop || featuredDiscovery.image}
        style={styles.heroImage}
      />
      <LinearGradient
        colors={["transparent", "rgba(0,0,0,0.9)"]}
        style={styles.heroGradient}
      />

      <View style={styles.heroContent}>
        <View style={styles.heroBadge}>
          <Ionicons name="earth" size={14} color="#FFB347" />
          <Text style={styles.heroBadgeText}>FEATURED DOCUMENTARY</Text>
        </View>

        <Text style={styles.heroTitle}>{featuredDiscovery.title}</Text>
        <Text style={styles.heroSubtitle}>
          {featuredDiscovery.subtitle ||
            featuredDiscovery.description?.slice(0, 80) + "..." ||
            "Explore the wonders of our world"}
        </Text>

        <View style={styles.heroMeta}>
          <View style={styles.heroRating}>
            <Ionicons name="star" size={16} color="#FFD700" />
            <Text style={styles.heroRatingText}>
              {featuredDiscovery.rating || "8.0"}
            </Text>
          </View>
          <Text style={styles.heroYear}>
            {featuredDiscovery.year || "2024"}
          </Text>
          {featuredDiscovery.duration && (
            <>
              <Text style={styles.heroDot}>•</Text>
              <Text style={styles.heroDuration}>
                {featuredDiscovery.duration}
              </Text>
            </>
          )}
        </View>

        <View style={styles.heroActions}>
          <TouchableOpacity
            style={[styles.playButton, { backgroundColor: "#FFB347" }]}
            onPress={() =>
              router.push({
                pathname: "/details",
                params: { id: featuredDiscovery.id },
              })
            }
          >
            <Ionicons name="play" size={20} color="#fff" />
            <Text style={styles.playButtonText}>Watch Now</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.saveButton}>
            <Ionicons name="bookmark-outline" size={20} color="#fff" />
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
          <Text style={styles.logo}>Discovery</Text>
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
        {featuredDiscovery && renderHeroSection()}

        {/* Category Filter */}
        <View style={styles.categorySection}>
          <FlatList
            data={categories}
            renderItem={renderCategoryChip}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryList}
          />
        </View>

        {/* Featured Section - Based on selected category */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleContainer}>
              <Ionicons name="apps" size={20} color="#FFB347" />
              <Text style={styles.sectionTitle}>
                {categories.find((c) => c.id === selectedCategory)?.title ||
                  "All"}{" "}
                Documentaries
              </Text>
            </View>
            <TouchableOpacity onPress={() => {}}>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={getFilteredContent().slice(0, 8)}
            renderItem={renderDiscoveryCard}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.discoveryList}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No documentaries found</Text>
              </View>
            }
          />
        </View>

        {/* Wildlife Section */}
        {getWildlifeContent().length > 0 && selectedCategory === "all" && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleContainer}>
                <Ionicons name="paw" size={20} color="#FFB347" />
                <Text style={styles.sectionTitle}>🐾 Wildlife & Nature</Text>
              </View>
              <TouchableOpacity onPress={() => setSelectedCategory("wildlife")}>
                <Text style={styles.seeAll}>See All</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={getWildlifeContent().slice(0, 6)}
              renderItem={renderDiscoveryCard}
              keyExtractor={(item) => item.id.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.discoveryList}
            />
          </View>
        )}

        {/* Oceans Section */}
        {getOceanContent().length > 0 && selectedCategory === "all" && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleContainer}>
                <Ionicons name="water" size={20} color="#FFB347" />
                <Text style={styles.sectionTitle}>🌊 Oceans & Marine Life</Text>
              </View>
              <TouchableOpacity onPress={() => setSelectedCategory("ocean")}>
                <Text style={styles.seeAll}>See All</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={getOceanContent().slice(0, 6)}
              renderItem={renderDiscoveryCard}
              keyExtractor={(item) => item.id.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.discoveryList}
            />
          </View>
        )}

        {/* Space Section */}
        {getSpaceContent().length > 0 && selectedCategory === "all" && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleContainer}>
                <Ionicons name="planet" size={20} color="#FFB347" />
                <Text style={styles.sectionTitle}>🚀 Space & Universe</Text>
              </View>
              <TouchableOpacity onPress={() => setSelectedCategory("space")}>
                <Text style={styles.seeAll}>See All</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={getSpaceContent().slice(0, 6)}
              renderItem={renderDiscoveryCard}
              keyExtractor={(item) => item.id.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.discoveryList}
            />
          </View>
        )}

        {/* Trending Documentaries */}
        {trendingDiscovery.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleContainer}>
                <Ionicons name="flame" size={20} color="#FFB347" />
                <Text style={styles.sectionTitle}>🔥 Trending Now</Text>
              </View>
              <TouchableOpacity onPress={() => {}}>
                <Text style={styles.seeAll}>See All</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={trendingDiscovery.slice(0, 6)}
              renderItem={renderDiscoveryCard}
              keyExtractor={(item) => item.id.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.discoveryList}
            />
          </View>
        )}

        {/* Popular Documentaries */}
        {popularDiscovery.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleContainer}>
                <Ionicons name="heart" size={20} color="#FFB347" />
                <Text style={styles.sectionTitle}>⭐ Popular Picks</Text>
              </View>
              <TouchableOpacity onPress={() => {}}>
                <Text style={styles.seeAll}>See All</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={popularDiscovery.slice(0, 6)}
              renderItem={renderDiscoveryCard}
              keyExtractor={(item) => item.id.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.discoveryList}
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
    color: "#FFB347",
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
    color: "#FFB347",
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
  saveButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  // Category Filter
  categorySection: {
    marginBottom: 20,
  },
  categoryList: {
    paddingHorizontal: 16,
    gap: 10,
  },
  categoryChip: {
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
  categoryChipActive: {
    backgroundColor: "#FFB347",
    borderColor: "#FFB347",
  },
  categoryChipText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
  },
  categoryChipTextActive: {
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
    color: "#FFB347",
    fontSize: 14,
    fontWeight: "600",
  },
  discoveryList: {
    paddingLeft: 16,
    paddingRight: 8,
  },
  discoveryCard: {
    width: 150,
    marginRight: 12,
  },
  cardImageContainer: {
    width: 150,
    height: 200,
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#1a1a1a",
    position: "relative",
  },
  discoveryImage: {
    width: "100%",
    height: "100%",
  },
  cardGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
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
  categoryBadge: {
    position: "absolute",
    top: 8,
    left: 8,
    backgroundColor: "rgba(255, 179, 71, 0.9)",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    zIndex: 5,
  },
  categoryBadgeText: {
    color: "#fff",
    fontSize: 9,
    fontWeight: "600",
  },
  cardInfo: {
    marginTop: 8,
    paddingHorizontal: 4,
  },
  discoveryTitle: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 2,
  },
  discoverySubtitle: {
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
