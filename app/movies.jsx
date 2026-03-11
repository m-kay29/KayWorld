import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  Platform,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { moviesCategory, trending, popular } from "../data/entertainmentData";

const { width, height } = Dimensions.get("window");

export default function Movies() {
  const router = useRouter();

  // Get hero banner from movies (first movie with hero category or first movie)
  const heroMovie = moviesCategory.find(m => m.category?.includes("hero")) || moviesCategory[0];
  
  // Get featured movies (first 6)
  const featuredMovies = moviesCategory.slice(0, 6);
  
  // Get action movies from movies category
  const actionMovies = moviesCategory.filter(m => m.genre?.includes("Action") || m.category?.includes("action")).slice(0, 6);
  
  // Get trending movies that are also in movies category
  const trendingMovies = trending.filter(m => 
    moviesCategory.some(mc => mc.id === m.id)
  ).slice(0, 6);

  const renderMovieCard = ({ item }) => (
    <TouchableOpacity 
      style={styles.movieCard}
      onPress={() => router.push({
        pathname: "/details",
        params: { 
          id: item.id, 
          title: item.title,
          rating: item.rating,
          genre: item.genre,
          year: item.year,
        }
      })}
      activeOpacity={0.8}
    >
      <View style={styles.movieImageContainer}>
        <Image 
          source={item.image} 
          style={styles.movieImage}
          resizeMode="cover"
        />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.8)']}
          style={styles.movieGradient}
        />
      </View>
      <View style={styles.movieInfo}>
        <Text style={styles.movieTitle} numberOfLines={1}>{item.title}</Text>
        <View style={styles.movieRating}>
          <Ionicons name="star" size={12} color="#FFD700" />
          <Text style={styles.movieRatingText}>{item.rating || "8.0"}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      {/* Header */}
      <LinearGradient
        colors={['rgba(0,0,0,0.9)', 'transparent']}
        style={styles.headerGradient}
      >
        <SafeAreaView style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.logo}>Movies</Text>
          <TouchableOpacity style={styles.profileButton}>
            <Image 
              source={{ uri: 'https://via.placeholder.com/32' }} 
              style={styles.profileImage}
            />
          </TouchableOpacity>
        </SafeAreaView>
      </LinearGradient>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Banner */}
        {heroMovie && (
          <TouchableOpacity 
            style={styles.heroBanner}
            onPress={() => router.push({
              pathname: "/details",
              params: { 
                id: heroMovie.id, 
                title: heroMovie.title,
                rating: heroMovie.rating,
                genre: heroMovie.genre,
                year: heroMovie.year,
              }
            })}
            activeOpacity={0.9}
          >
            <View style={styles.heroImageContainer}>
              <Image 
                source={heroMovie.image} 
                style={styles.heroImage}
                resizeMode="cover"
              />
              <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.9)']}
                style={styles.heroGradient}
              />
            </View>
            <View style={styles.heroContent}>
              <Text style={styles.heroTitle}>{heroMovie.title}</Text>
              <Text style={styles.heroSubtitle}>{heroMovie.subtitle || heroMovie.genre}</Text>
              <View style={styles.heroMeta}>
                <Text style={styles.heroYear}>{heroMovie.year || "2024"}</Text>
                <View style={styles.heroRating}>
                  <Ionicons name="star" size={16} color="#FFD700" />
                  <Text style={styles.heroRatingText}>{heroMovie.rating || "8.0"}</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.playButton}>
                <Ionicons name="play" size={20} color="#000" />
                <Text style={styles.playButtonText}>Play</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        )}

        {/* Featured Movies */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Featured Movies</Text>
            <TouchableOpacity onPress={() => {}}>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={featuredMovies}
            renderItem={renderMovieCard}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.movieList}
          />
        </View>

        {/* Action Movies */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Action Movies</Text>
            <TouchableOpacity onPress={() => {}}>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={actionMovies}
            renderItem={renderMovieCard}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.movieList}
          />
        </View>

        {/* Trending Movies */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>🔥 Trending Movies</Text>
            <TouchableOpacity onPress={() => {}}>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={trendingMovies}
            renderItem={renderMovieCard}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.movieList}
          />
        </View>

        {/* Popular Movies */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Popular Movies</Text>
            <TouchableOpacity onPress={() => {}}>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={popular.filter(m => moviesCategory.some(mc => mc.id === m.id)).slice(0, 6)}
            renderItem={renderMovieCard}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.movieList}
          />
        </View>

        {/* Bottom Spacing */}
        <View style={{ height: 30 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  headerGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    height: Platform.OS === 'ios' ? 120 : 100,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 50 : 30,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  logo: {
    color: '#E50914',
    fontSize: 20,
    fontWeight: '700',
  },
  profileButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    overflow: 'hidden',
  },
  profileImage: {
    width: 36,
    height: 36,
  },
  scrollView: {
    flex: 1,
  },
  // Hero Banner
  heroBanner: {
    height: height * 0.5,
    width: width,
    marginBottom: 20,
    position: 'relative',
  },
  heroImageContainer: {
    width: width,
    height: height * 0.5,
    overflow: 'hidden',
  },
  heroImage: {
    width: width,
    height: height * 0.5,
  },
  heroGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: height * 0.3,
  },
  heroContent: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
    zIndex: 5,
  },
  heroTitle: {
    color: '#fff',
    fontSize: 32,
    fontWeight: '800',
    marginBottom: 4,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  heroSubtitle: {
    color: '#fff',
    fontSize: 14,
    opacity: 0.9,
    marginBottom: 8,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  heroMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    gap: 15,
  },
  heroYear: {
    color: '#aaa',
    fontSize: 14,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  heroRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  heroRatingText: {
    color: '#FFD700',
    fontSize: 14,
    fontWeight: '600',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  playButton: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    width: 100,
    gap: 8,
  },
  playButtonText: {
    color: '#000',
    fontSize: 14,
    fontWeight: '600',
  },
  // Sections
  section: {
    marginTop: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  seeAll: {
    color: '#E50914',
    fontSize: 14,
    fontWeight: '600',
  },
  movieList: {
    paddingLeft: 16,
    paddingRight: 8,
  },
  movieCard: {
    width: 140,
    marginRight: 12,
    position: 'relative',
  },
  movieImageContainer: {
    width: 140,
    height: 200,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#1a1a1a',
  },
  movieImage: {
    width: '100%',
    height: '100%',
  },
  movieGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 70,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  movieInfo: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    right: 8,
    zIndex: 5,
  },
  movieTitle: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 4,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  movieRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  movieRatingText: {
    color: '#FFD700',
    fontSize: 11,
    fontWeight: '600',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});