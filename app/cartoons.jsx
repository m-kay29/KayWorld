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
import { cartoons, trending, popular } from "../data/entertainmentData";

const { width, height } = Dimensions.get("window");

export default function Cartoons() {
  const router = useRouter();

  // Get featured cartoon (first one)
  const featuredCartoon = cartoons[0];
  
  // Get all cartoons
  const allCartoons = cartoons;
  
  // Get trending cartoons
  const trendingCartoons = trending.filter(m => 
    cartoons.some(mc => mc.id === m.id)
  ).slice(0, 6);
  
  // Get popular cartoons
  const popularCartoons = popular.filter(m => 
    cartoons.some(mc => mc.id === m.id)
  ).slice(0, 6);

  const renderCartoonCard = ({ item }) => (
    <TouchableOpacity 
      style={styles.cartoonCard}
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
      <Image source={item.image} style={styles.cartoonImage} />
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.8)']}
        style={styles.cartoonGradient}
      />
      <View style={styles.cartoonInfo}>
        <Text style={styles.cartoonTitle} numberOfLines={1}>{item.title}</Text>
        <View style={styles.cartoonRating}>
          <Ionicons name="star" size={12} color="#FFD700" />
          <Text style={styles.cartoonRatingText}>{item.rating || "8.0"}</Text>
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
          <Text style={styles.logo}>Cartoons</Text>
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
        {featuredCartoon && (
          <TouchableOpacity 
            style={styles.heroBanner}
            onPress={() => router.push({
              pathname: "/details",
              params: { 
                id: featuredCartoon.id, 
                title: featuredCartoon.title,
                rating: featuredCartoon.rating,
                genre: featuredCartoon.genre,
                year: featuredCartoon.year,
              }
            })}
            activeOpacity={0.9}
          >
            <Image source={featuredCartoon.image} style={styles.heroImage} />
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.9)']}
              style={styles.heroGradient}
            />
            <View style={styles.heroContent}>
              <Text style={styles.heroTitle}>{featuredCartoon.title}</Text>
              <Text style={styles.heroSubtitle}>{featuredCartoon.subtitle || featuredCartoon.genre}</Text>
              <View style={styles.heroMeta}>
                <Text style={styles.heroYear}>{featuredCartoon.year || "2024"}</Text>
                <View style={styles.heroRating}>
                  <Ionicons name="star" size={16} color="#FFD700" />
                  <Text style={styles.heroRatingText}>{featuredCartoon.rating || "8.0"}</Text>
                </View>
              </View>
              <TouchableOpacity style={[styles.playButton, { backgroundColor: "#FF6B6B" }]}>
                <Ionicons name="play" size={20} color="#fff" />
                <Text style={[styles.playButtonText, { color: "#fff" }]}>Watch Now</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        )}

        {/* All Cartoons */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>🧸 Animated Fun</Text>
            <TouchableOpacity onPress={() => {}}>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={allCartoons}
            renderItem={renderCartoonCard}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.cartoonList}
          />
        </View>

        {/* Trending Cartoons */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>🔥 Trending Cartoons</Text>
            <TouchableOpacity onPress={() => {}}>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={trendingCartoons}
            renderItem={renderCartoonCard}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.cartoonList}
          />
        </View>

        {/* Popular Cartoons */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>⭐ Fan Favorites</Text>
            <TouchableOpacity onPress={() => {}}>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={popularCartoons}
            renderItem={renderCartoonCard}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.cartoonList}
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
    color: '#FF6B6B',
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
    color: '#FF6B6B',
    fontSize: 14,
    fontWeight: '600',
  },
  cartoonList: {
    paddingLeft: 16,
  },
  cartoonCard: {
    width: 140,
    marginRight: 10,
    position: 'relative',
  },
  cartoonImage: {
    width: 140,
    height: 200,
    borderRadius: 12,
  },
  cartoonGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  cartoonInfo: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    right: 8,
  },
  cartoonTitle: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 2,
  },
  cartoonRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  cartoonRatingText: {
    color: '#FFD700',
    fontSize: 10,
    fontWeight: '600',
  },
});