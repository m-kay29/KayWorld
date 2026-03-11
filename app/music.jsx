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
import { music, trending, popular } from "../data/entertainmentData";

const { width, height } = Dimensions.get("window");

export default function Music() {
  const router = useRouter();

  // Get featured music (first one)
  const featuredMusic = music[0];
  
  // Get all music
  const allMusic = music;
  
  // Get trending music
  const trendingMusic = trending.filter(m => 
    music.some(mc => mc.id === m.id)
  ).slice(0, 6);
  
  // Get popular music
  const popularMusic = popular.filter(m => 
    music.some(mc => mc.id === m.id)
  ).slice(0, 6);

  const renderMusicCard = ({ item }) => (
    <TouchableOpacity 
      style={styles.musicCard}
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
      <Image source={item.image} style={styles.musicImage} />
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.8)']}
        style={styles.musicGradient}
      />
      <View style={styles.musicInfo}>
        <Text style={styles.musicTitle} numberOfLines={1}>{item.title}</Text>
        <View style={styles.musicRating}>
          <Ionicons name="star" size={12} color="#FFD700" />
          <Text style={styles.musicRatingText}>{item.rating || "8.0"}</Text>
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
          <Text style={styles.logo}>Music</Text>
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
        {featuredMusic && (
          <TouchableOpacity 
            style={styles.heroBanner}
            onPress={() => router.push({
              pathname: "/details",
              params: { 
                id: featuredMusic.id, 
                title: featuredMusic.title,
                rating: featuredMusic.rating,
                genre: featuredMusic.genre,
                year: featuredMusic.year,
              }
            })}
            activeOpacity={0.9}
          >
            <Image source={featuredMusic.image} style={styles.heroImage} />
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.9)']}
              style={styles.heroGradient}
            />
            <View style={styles.heroContent}>
              <Text style={styles.heroTitle}>{featuredMusic.title}</Text>
              <Text style={styles.heroSubtitle}>{featuredMusic.subtitle || featuredMusic.genre}</Text>
              <View style={styles.heroMeta}>
                <Text style={styles.heroYear}>{featuredMusic.year || "2024"}</Text>
                <View style={styles.heroRating}>
                  <Ionicons name="star" size={16} color="#FFD700" />
                  <Text style={styles.heroRatingText}>{featuredMusic.rating || "8.0"}</Text>
                </View>
              </View>
              <TouchableOpacity style={[styles.playButton, { backgroundColor: "#1DB954" }]}>
                <Ionicons name="play" size={20} color="#fff" />
                <Text style={[styles.playButtonText, { color: "#fff" }]}>Listen Now</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        )}

        {/* All Music */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>🎵 Concerts & Performances</Text>
            <TouchableOpacity onPress={() => {}}>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={allMusic}
            renderItem={renderMusicCard}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.musicList}
          />
        </View>

        {/* Trending Music */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>🔥 Trending Music</Text>
            <TouchableOpacity onPress={() => {}}>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={trendingMusic}
            renderItem={renderMusicCard}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.musicList}
          />
        </View>

        {/* Popular Music */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>⭐ Popular Artists</Text>
            <TouchableOpacity onPress={() => {}}>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={popularMusic}
            renderItem={renderMusicCard}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.musicList}
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
    color: '#1DB954',
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
  },
  playButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    width: 130,
    gap: 8,
  },
  playButtonText: {
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
    color: '#1DB954',
    fontSize: 14,
    fontWeight: '600',
  },
  musicList: {
    paddingLeft: 16,
  },
  musicCard: {
    width: 140,
    marginRight: 10,
    position: 'relative',
  },
  musicImage: {
    width: 140,
    height: 140,
    borderRadius: 70, // Circular for music artists
  },
  musicGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    borderBottomLeftRadius: 70,
    borderBottomRightRadius: 70,
  },
  musicInfo: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    right: 8,
  },
  musicTitle: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 2,
    textAlign: 'center',
  },
  musicRating: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  musicRatingText: {
    color: '#FFD700',
    fontSize: 10,
    fontWeight: '600',
  },
});