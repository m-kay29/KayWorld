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
import { moviesCategory, popular, trending } from "../data/entertainmentData";
import { addToMyList } from "../utils/myListUtils";

const { width, height } = Dimensions.get("window");

export default function Movies() {
  const router = useRouter();
  const scrollY = useRef(new Animated.Value(0)).current;
  const [selectedGenre, setSelectedGenre] = useState("all");

  // Get hero banner from movies
  const heroMovie =
    moviesCategory.find((m) => m.category?.includes("hero")) ||
    moviesCategory[0];

  // Get all movies
  const allMovies = moviesCategory;

  // Get unique genres from movies
  const genres = [
    "all",
    ...new Set(
      allMovies.map((item) => item.genre?.split("/")[0].trim() || "Other"),
    ),
  ];

  // Filter movies by genre
  const getFilteredMovies = () => {
    if (selectedGenre === "all") return allMovies;
    return allMovies.filter((item) => item.genre?.includes(selectedGenre));
  };

  // Get action movies
  const actionMovies = allMovies.filter(
    (m) =>
      m.genre?.toLowerCase().includes("action") ||
      m.category?.includes("action"),
  );

  // Get trending movies
  const trendingMovies = trending.filter((m) =>
    allMovies.some((mc) => mc.id === m.id),
  );

  // Get popular movies
  const popularMovies = popular.filter((m) =>
    allMovies.some((mc) => mc.id === m.id),
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

  // Navigation functions for "See All" buttons
  const navigateToCategory = (category, title) => {
    router.push({
      pathname: "/category",
      params: { category, title },
    });
  };

  const renderMovieCard = ({ item, index }) => (
    <TouchableOpacity
      style={styles.movieCard}
      onPress={() =>
        router.push({
          pathname: "/details",
          params: { id: item.id },
        })
      }
      activeOpacity={0.8}
    >
      <View style={styles.movieImageContainer}>
        <Image
          source={item.image}
          style={styles.movieImage}
          resizeMode="cover"
        />
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.8)"]}
          style={styles.movieGradient}
        />

        {/* Rating Badge */}
        <View style={styles.ratingBadge}>
          <Ionicons name="star" size={10} color="#FFD700" />
          <Text style={styles.ratingText}>{item.rating || "8.0"}</Text>
        </View>

        {/* Year Badge */}
        <View style={styles.yearBadge}>
          <Text style={styles.yearBadgeText}>{item.year || "2024"}</Text>
        </View>
      </View>

      <View style={styles.movieInfo}>
        <Text style={styles.movieTitle} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={styles.movieGenre} numberOfLines={1}>
          {item.genre?.split("/")[0] || "Action"}
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

  const renderHeroSection = () => (
    <TouchableOpacity
      style={styles.heroBanner}
      onPress={() =>
        router.push({
          pathname: "/details",
          params: { id: heroMovie.id },
        })
      }
      activeOpacity={0.9}
    >
      <Image
        source={heroMovie.backdrop || heroMovie.image}
        style={styles.heroImage}
      />
      <LinearGradient
        colors={["transparent", "rgba(0,0,0,0.9)"]}
        style={styles.heroGradient}
      />

      <View style={styles.heroContent}>
        <View style={styles.heroBadge}>
          <Ionicons name="film" size={14} color="#E50914" />
          <Text style={styles.heroBadgeText}>FEATURED MOVIE</Text>
        </View>

        <Text style={styles.heroTitle}>{heroMovie.title}</Text>
        <Text style={styles.heroSubtitle}>
          {heroMovie.subtitle ||
            heroMovie.description?.slice(0, 80) + "..." ||
            "Experience the ultimate cinematic adventure"}
        </Text>

        <View style={styles.heroMeta}>
          <View style={styles.heroRating}>
            <Ionicons name="star" size={16} color="#FFD700" />
            <Text style={styles.heroRatingText}>
              {heroMovie.rating || "8.0"}
            </Text>
          </View>
          <Text style={styles.heroYear}>{heroMovie.year || "2024"}</Text>
          {heroMovie.duration && (
            <>
              <Text style={styles.heroDot}>•</Text>
              <Text style={styles.heroDuration}>{heroMovie.duration}</Text>
            </>
          )}
        </View>

        <View style={styles.heroActions}>
          <TouchableOpacity
            style={[styles.playButton, { backgroundColor: "#E50914" }]}
            onPress={() =>
              router.push({
                pathname: "/details",
                params: { id: heroMovie.id },
              })
            }
          >
            <Ionicons name="play" size={20} color="#fff" />
            <Text style={styles.playButtonText}>Watch Now</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.addButton}
            onPress={() => addToMyList(heroMovie, router)}
          >
            <Ionicons name="add" size={24} color="#fff" />
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
          <Text style={styles.logo}>Movies</Text>
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
        {heroMovie && renderHeroSection()}

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

        {/* All Movies - Filtered by Genre */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleContainer}>
              <Ionicons name="film" size={20} color="#E50914" />
              <Text style={styles.sectionTitle}>All Movies</Text>
            </View>
            <TouchableOpacity
              onPress={() => navigateToCategory("movies", "All Movies")}
            >
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={getFilteredMovies().slice(0, 10)}
            renderItem={renderMovieCard}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.movieList}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No movies found</Text>
              </View>
            }
          />
        </View>

        {/* Action Movies */}
        {actionMovies.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleContainer}>
                <Ionicons name="flash" size={20} color="#E50914" />
                <Text style={styles.sectionTitle}>Action Movies</Text>
              </View>
              <TouchableOpacity
                onPress={() => navigateToCategory("action", "Action Movies")}
              >
                <Text style={styles.seeAll}>See All</Text>
              </TouchableOpacity>
            </View>

            <FlatList
              data={actionMovies.slice(0, 6)}
              renderItem={renderMovieCard}
              keyExtractor={(item) => item.id.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.movieList}
            />
          </View>
        )}

        {/* Trending Movies */}
        {trendingMovies.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleContainer}>
                <Text style={styles.sectionTitle}>🔥 Trending Now</Text>
              </View>
              <TouchableOpacity
                onPress={() =>
                  navigateToCategory("trending", "Trending Movies")
                }
              >
                <Text style={styles.seeAll}>See All</Text>
              </TouchableOpacity>
            </View>

            <FlatList
              data={trendingMovies.slice(0, 6)}
              renderItem={renderMovieCard}
              keyExtractor={(item) => item.id.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.movieList}
            />
          </View>
        )}

        {/* Popular Movies */}
        {popularMovies.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleContainer}>
                <Text style={styles.sectionTitle}>⭐ Popular Picks</Text>
              </View>
              <TouchableOpacity
                onPress={() => navigateToCategory("popular", "Popular Movies")}
              >
                <Text style={styles.seeAll}>See All</Text>
              </TouchableOpacity>
            </View>

            <FlatList
              data={popularMovies.slice(0, 6)}
              renderItem={renderMovieCard}
              keyExtractor={(item) => item.id.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.movieList}
            />
          </View>
        )}

        {/* Recently Added */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleContainer}>
              <Ionicons name="time" size={20} color="#E50914" />
              <Text style={styles.sectionTitle}>Recently Added</Text>
            </View>
            <TouchableOpacity
              onPress={() => navigateToCategory("recent", "Recently Added")}
            >
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={[...allMovies].reverse().slice(0, 6)}
            renderItem={renderMovieCard}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.movieList}
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
    color: "#E50914",
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
    color: "#E50914",
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
    backgroundColor: "#E50914",
    borderColor: "#E50914",
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
    color: "#E50914",
    fontSize: 14,
    fontWeight: "600",
  },
  movieList: {
    paddingLeft: 16,
    paddingRight: 8,
  },
  movieCard: {
    width: 140,
    marginRight: 12,
  },
  movieImageContainer: {
    width: 140,
    height: 200,
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#1a1a1a",
    position: "relative",
  },
  movieImage: {
    width: "100%",
    height: "100%",
  },
  movieGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 70,
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
  yearBadge: {
    position: "absolute",
    top: 8,
    left: 8,
    backgroundColor: "rgba(229, 9, 20, 0.9)",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    zIndex: 5,
  },
  yearBadgeText: {
    color: "#fff",
    fontSize: 9,
    fontWeight: "600",
  },
  movieInfo: {
    marginTop: 8,
    paddingHorizontal: 4,
  },
  movieTitle: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 2,
  },
  movieGenre: {
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
