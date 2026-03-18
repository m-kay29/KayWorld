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
import UserMenu from "../components/UserMenu";
import { music, popular, trending } from "../data/entertainmentData";
import { addToMyList } from "../utils/myListUtils";

const { width, height } = Dimensions.get("window");

export default function Music() {
  const router = useRouter();
  const scrollY = useRef(new Animated.Value(0)).current;
  const [selectedGenre, setSelectedGenre] = useState("all");

  // Get featured music (first one)
  const featuredMusic = music[0];

  // Get all music
  const allMusic = music;

  // Get trending music
  const trendingMusic = trending.filter((m) =>
    music.some((mc) => mc.id === m.id),
  );

  // Get popular music
  const popularMusic = popular.filter((m) =>
    music.some((mc) => mc.id === m.id),
  );

  // Get unique genres from music
  const genres = [
    "all",
    ...new Set(
      music.map((item) => item.genre?.split("/")[0].trim() || "Other"),
    ),
  ];

  // Filter music by genre
  const getFilteredMusic = () => {
    if (selectedGenre === "all") return allMusic;
    return allMusic.filter((item) => item.genre?.includes(selectedGenre));
  };

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

  // Navigation functions for "See All" buttons
  const navigateToCategory = (category, title) => {
    router.push({
      pathname: "/category",
      params: { category, title },
    });
  };

  const renderMusicCard = ({ item, index }) => (
    <TouchableOpacity
      style={styles.musicCard}
      onPress={() =>
        router.push({
          pathname: "/details",
          params: {
            id: item.id,
            title: item.title,
          },
        })
      }
      activeOpacity={0.8}
    >
      <View style={styles.musicImageContainer}>
        <Image
          source={item.image}
          style={styles.musicImage}
          resizeMode="cover"
        />
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.8)"]}
          style={styles.musicGradient}
        />

        {/* Play Button Overlay */}
        <View style={styles.playOverlay}>
          <Ionicons name="play-circle" size={40} color="#fff" />
        </View>

        {/* Rating Badge */}
        <View style={styles.ratingBadge}>
          <Ionicons name="star" size={10} color="#FFD700" />
          <Text style={styles.ratingText}>{item.rating || "8.0"}</Text>
        </View>
      </View>

      <View style={styles.musicInfo}>
        <Text style={styles.musicTitle} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={styles.musicArtist} numberOfLines={1}>
          {item.cast?.[0] ||
            item.subtitle?.split(" ").slice(0, 2).join(" ") ||
            "Various Artists"}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderGenreChip = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.genreChip,
        selectedGenre === item && styles.genreChipActive,
      ]}
      onPress={() => setSelectedGenre(item)}
    >
      <Text
        style={[
          styles.genreChipText,
          selectedGenre === item && styles.genreChipTextActive,
        ]}
      >
        {item === "all" ? "All" : item}
      </Text>
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
          <Text style={styles.logo}>Music</Text>
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
        {featuredMusic && (
          <TouchableOpacity
            style={styles.heroBanner}
            onPress={() =>
              router.push({
                pathname: "/details",
                params: { id: featuredMusic.id },
              })
            }
            activeOpacity={0.9}
          >
            <Image
              source={featuredMusic.backdrop || featuredMusic.image}
              style={styles.heroImage}
            />
            <LinearGradient
              colors={["transparent", "rgba(0,0,0,0.9)"]}
              style={styles.heroGradient}
            />

            <View style={styles.heroContent}>
              <View style={styles.heroBadge}>
                <Ionicons name="musical-notes" size={14} color="#1DB954" />
                <Text style={styles.heroBadgeText}>FEATURED CONCERT</Text>
              </View>

              <Text style={styles.heroTitle}>{featuredMusic.title}</Text>
              <Text style={styles.heroSubtitle}>
                {featuredMusic.subtitle ||
                  featuredMusic.description?.slice(0, 60) + "..." ||
                  "Experience the ultimate concert"}
              </Text>

              <View style={styles.heroMeta}>
                <View style={styles.heroRating}>
                  <Ionicons name="star" size={16} color="#FFD700" />
                  <Text style={styles.heroRatingText}>
                    {featuredMusic.rating || "8.0"}
                  </Text>
                </View>
                <Text style={styles.heroYear}>
                  {featuredMusic.year || "2024"}
                </Text>
                {featuredMusic.duration && (
                  <>
                    <Text style={styles.heroDot}>•</Text>
                    <Text style={styles.heroDuration}>
                      {featuredMusic.duration}
                    </Text>
                  </>
                )}
              </View>

              <View style={styles.heroActions}>
                <TouchableOpacity
                  style={[styles.playButton, { backgroundColor: "#1DB954" }]}
                  onPress={() =>
                    router.push({
                      pathname: "/details",
                      params: { id: featuredMusic.id },
                    })
                  }
                >
                  <Ionicons name="play" size={20} color="#fff" />
                  <Text style={styles.playButtonText}>Listen Now</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.addButton}
                  onPress={() => addToMyList(featuredMusic, router)}
                >
                  <Ionicons name="add" size={24} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        )}

        {/* Genre Filter */}
        <View style={styles.genreSection}>
          <FlatList
            data={genres}
            renderItem={renderGenreChip}
            keyExtractor={(item) => item}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.genreList}
          />
        </View>

        {/* All Music Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleContainer}>
              <Ionicons name="musical-notes" size={20} color="#1DB954" />
              <Text style={styles.sectionTitle}>All Concerts</Text>
            </View>
            <TouchableOpacity
              onPress={() => navigateToCategory("music", "All Music")}
            >
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={getFilteredMusic()}
            renderItem={renderMusicCard}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.musicList}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No music found</Text>
              </View>
            }
          />
        </View>

        {/* Trending Music */}
        {trendingMusic.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleContainer}>
                <Text style={styles.sectionTitle}>🔥 Trending Now</Text>
              </View>
              <TouchableOpacity
                onPress={() => navigateToCategory("trending", "Trending Music")}
              >
                <Text style={styles.seeAll}>See All</Text>
              </TouchableOpacity>
            </View>

            <FlatList
              data={trendingMusic.slice(0, 6)}
              renderItem={renderMusicCard}
              keyExtractor={(item) => item.id.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.musicList}
            />
          </View>
        )}

        {/* Popular Artists */}
        {popularMusic.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleContainer}>
                <Text style={styles.sectionTitle}>⭐ Popular Artists</Text>
              </View>
              <TouchableOpacity
                onPress={() => navigateToCategory("popular", "Popular Music")}
              >
                <Text style={styles.seeAll}>See All</Text>
              </TouchableOpacity>
            </View>

            <FlatList
              data={popularMusic.slice(0, 6)}
              renderItem={renderMusicCard}
              keyExtractor={(item) => item.id.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.musicList}
            />
          </View>
        )}

        {/* Recently Added */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleContainer}>
              <Ionicons name="time" size={20} color="#1DB954" />
              <Text style={styles.sectionTitle}>Recently Added</Text>
            </View>
            <TouchableOpacity
              onPress={() =>
                navigateToCategory("recent", "Recently Added Music")
              }
            >
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={[...allMusic].reverse().slice(0, 6)}
            renderItem={renderMusicCard}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.musicList}
          />
        </View>

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
    color: "#1DB954",
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
    color: "#1DB954",
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
  addButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  // Genre Filter
  genreSection: {
    marginBottom: 20,
  },
  genreList: {
    paddingHorizontal: 16,
    gap: 10,
  },
  genreChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#1a1a1a",
    borderWidth: 1,
    borderColor: "#333",
  },
  genreChipActive: {
    backgroundColor: "#1DB954",
    borderColor: "#1DB954",
  },
  genreChipText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
  },
  genreChipTextActive: {
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
    color: "#1DB954",
    fontSize: 14,
    fontWeight: "600",
  },
  musicList: {
    paddingLeft: 16,
    paddingRight: 8,
  },
  musicCard: {
    width: 150,
    marginRight: 12,
  },
  musicImageContainer: {
    width: 150,
    height: 150,
    borderRadius: 75,
    overflow: "hidden",
    backgroundColor: "#1a1a1a",
    position: "relative",
  },
  musicImage: {
    width: "100%",
    height: "100%",
  },
  musicGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    borderBottomLeftRadius: 75,
    borderBottomRightRadius: 75,
  },
  playOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
    opacity: 0,
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
  },
  ratingText: {
    color: "#FFD700",
    fontSize: 10,
    fontWeight: "600",
  },
  musicInfo: {
    marginTop: 8,
    paddingHorizontal: 4,
  },
  musicTitle: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 2,
  },
  musicArtist: {
    color: "#888",
    fontSize: 11,
  },
  // Empty State
  emptyContainer: {
    width: width - 32,
    height: 150,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    color: "#666",
    fontSize: 14,
  },
});
