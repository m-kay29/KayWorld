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
import { discovery, trending, popular } from "../data/entertainmentData";

const { width, height } = Dimensions.get("window");

export default function Discovery() {
  const router = useRouter();

  // Get featured discovery (first one)
  const featuredDiscovery = discovery[0];
  
  // Get all discovery
  const allDiscovery = discovery;
  
  // Get trending discovery
  const trendingDiscovery = trending.filter(m => 
    discovery.some(mc => mc.id === m.id)
  ).slice(0, 6);
  
  // Get popular discovery
  const popularDiscovery = popular.filter(m => 
    discovery.some(mc => mc.id === m.id)
  ).slice(0, 6);

  const renderDiscoveryCard = ({ item }) => (
    <TouchableOpacity 
      style={styles.discoveryCard}
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
      <Image source={item.image} style={styles.discoveryImage} />
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.8)']}
        style={styles.discoveryGradient}
      />
      <View style={styles.discoveryInfo}>
        <Text style={styles.discoveryTitle} numberOfLines={1}>{item.title}</Text>
        <View style={styles.discoveryRating}>
          <Ionicons name="star" size={12} color="#FFD700" />
          <Text style={styles.discoveryRatingText}>{item.rating || "8.0"}</Text>
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
          <Text style={styles.logo}>Discovery</Text>
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
        {featuredDiscovery && (
          <TouchableOpacity 
            style={styles.heroBanner}
            onPress={() => router.push({
              pathname: "/details",
              params: { 
                id: featuredDiscovery.id, 
                title: featuredDiscovery.title,
                rating: featuredDiscovery.rating,
                genre: featuredDiscovery.genre,
                year: featuredDiscovery.year,
              }
            })}
            activeOpacity={0.9}
          >
            <Image source={featuredDiscovery.image} style={styles.heroImage} />
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.9)']}
              style={styles.heroGradient}
            />
            <View style={styles.heroContent}>
              <Text style={styles.heroTitle}>{featuredDiscovery.title}</Text>
              <Text style={styles.heroSubtitle}>{featuredDiscovery.subtitle || featuredDiscovery.genre}</Text>
              <View style={styles.heroMeta}>
                <Text style={styles.heroYear}>{featuredDiscovery.year || "2024"}</Text>
                <View style={styles.heroRating}>
                  <Ionicons name="star" size={16} color="#FFD700" />
                  <Text style={styles.heroRatingText}>{featuredDiscovery.rating || "8.0"}</Text>
                </View>
              </View>
              <TouchableOpacity style={[styles.playButton, { backgroundColor: "#FFB347" }]}>
                <Ionicons name="play" size={20} color="#fff" />
                <Text style={[styles.playButtonText, { color: "#fff" }]}>Explore</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        )}

        {/* Wildlife & Nature */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>🌿 Wildlife & Nature</Text>
            <TouchableOpacity onPress={() => {}}>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={allDiscovery.filter(d => 
              d.title?.toLowerCase().includes("tiger") || 
              d.title?.toLowerCase().includes("wolf") ||
              d.title?.toLowerCase().includes("gorilla") ||
              d.title?.toLowerCase().includes("deer") ||
              d.title?.toLowerCase().includes("lion")
            )}
            renderItem={renderDiscoveryCard}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.discoveryList}
          />
        </View>

        {/* Oceans & Marine Life */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>🌊 Oceans & Marine Life</Text>
            <TouchableOpacity onPress={() => {}}>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={allDiscovery.filter(d => 
              d.title?.toLowerCase().includes("ocean") || 
              d.title?.toLowerCase().includes("sea") ||
              d.title?.toLowerCase().includes("turtle") ||
              d.title?.toLowerCase().includes("sealion")
            )}
            renderItem={renderDiscoveryCard}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.discoveryList}
          />
        </View>

        {/* Planet Earth & Space */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>🌍 Planet Earth & Space</Text>
            <TouchableOpacity onPress={() => {}}>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={allDiscovery.filter(d => 
              d.title?.toLowerCase().includes("planet") || 
              d.title?.toLowerCase().includes("universe") ||
              d.title?.toLowerCase().includes("frozen") ||
              d.title?.toLowerCase().includes("mountain") ||
              d.title?.toLowerCase().includes("waterfall")
            )}
            renderItem={renderDiscoveryCard}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.discoveryList}
          />
        </View>

        {/* Trending Discovery */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>🔥 Trending Documentaries</Text>
            <TouchableOpacity onPress={() => {}}>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={trendingDiscovery}
            renderItem={renderDiscoveryCard}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.discoveryList}
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
    color: '#FFB347',
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
    width: 120,
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
    color: '#FFB347',
    fontSize: 14,
    fontWeight: '600',
  },
  discoveryList: {
    paddingLeft: 16,
  },
  discoveryCard: {
    width: 140,
    marginRight: 10,
    position: 'relative',
  },
  discoveryImage: {
    width: 140,
    height: 200,
    borderRadius: 8,
  },
  discoveryGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  discoveryInfo: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    right: 8,
  },
  discoveryTitle: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 2,
  },
  discoveryRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  discoveryRatingText: {
    color: '#FFD700',
    fontSize: 10,
    fontWeight: '600',
  },
});