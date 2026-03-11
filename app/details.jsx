import React, { useState, useEffect } from "react";
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
  Alert,
  Share,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Video } from "expo-av";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import * as DocumentPicker from "expo-document-picker";
import { moviesCategory, music, cartoons, discovery } from "../data/entertainmentData";

const { width, height } = Dimensions.get("window");

export default function Details() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { id, title, rating, genre, year } = params;

  const [content, setContent] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [videoStatus, setVideoStatus] = useState({});
  const [showVideo, setShowVideo] = useState(false);

  // Find the content from all categories
  useEffect(() => {
    const allContent = [
      ...moviesCategory,
      ...music,
      ...cartoons,
      ...discovery
    ];
    const found = allContent.find(item => item.id.toString() === id);
    setContent(found);
  }, [id]);

  if (!content) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#E50914" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  // Determine content type for styling
  const getContentType = () => {
    if (moviesCategory.some(m => m.id === content.id)) return "movie";
    if (music.some(m => m.id === content.id)) return "music";
    if (cartoons.some(m => m.id === content.id)) return "cartoon";
    if (discovery.some(m => m.id === content.id)) return "discovery";
    return "movie";
  };

  const contentType = getContentType();
  
  // Get color based on content type
  const getTypeColor = () => {
    switch(contentType) {
      case "movie": return "#E50914";
      case "music": return "#1DB954";
      case "cartoon": return "#FF6B6B";
      case "discovery": return "#FFB347";
      default: return "#E50914";
    }
  };

  const typeColor = getTypeColor();

  // Simulated video URL (in real app, you'd have actual video files)
  const getVideoUrl = () => {
    // This would be replaced with actual video file paths
    return null; // Return null to show image instead of video
  };

  const handlePlayPreview = () => {
    const videoUrl = getVideoUrl();
    if (videoUrl) {
      setShowVideo(true);
    } else {
      Alert.alert(
        "Preview Unavailable",
        "Video preview is not available for this content yet.",
        [{ text: "OK" }]
      );
    }
  };

  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      
      // Simulate download (in real app, you'd download from a URL)
      Alert.alert(
        "Download Started",
        "Your content is being downloaded. You'll be notified when it's ready.",
        [{ text: "OK" }]
      );

      // Simulate download progress
      setTimeout(() => {
        setIsDownloading(false);
        Alert.alert(
          "Download Complete",
          `${content.title} has been downloaded successfully.`,
          [
            { text: "View Downloads", onPress: () => router.push("/downloads") },
            { text: "OK" }
          ]
        );
      }, 3000);

    } catch (error) {
      console.error("Download error:", error);
      Alert.alert("Error", "Failed to download content. Please try again.");
      setIsDownloading(false);
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out "${content.title}" on MrKayWorld! It's rated ${content.rating || '8.0'}⭐. Download the app now!`,
        title: content.title,
      });
    } catch (error) {
      console.error("Share error:", error);
    }
  };

  const handleAddToList = () => {
    Alert.alert("Added to My List", `${content.title} has been added to your list.`);
  };

  const getBackdropImage = () => {
    return content.image;
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Section with Video/Image */}
        <View style={styles.heroSection}>
          {showVideo ? (
            <Video
              source={{ uri: getVideoUrl() }}
              style={styles.videoPlayer}
              useNativeControls
              resizeMode="contain"
              isLooping
              onPlaybackStatusUpdate={status => setVideoStatus(() => status)}
            />
          ) : (
            <View style={styles.heroImageContainer}>
              <Image 
                source={content.image} 
                style={styles.heroImage}
                resizeMode="cover"
              />
              <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.9)']}
                style={styles.heroGradient}
              />
            </View>
          )}

          {/* Back Button */}
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>

          {/* Content Type Badge */}
          <View style={[styles.typeBadge, { backgroundColor: typeColor }]}>
            <Ionicons 
              name={
                contentType === "movie" ? "film" :
                contentType === "music" ? "musical-notes" :
                contentType === "cartoon" ? "happy" : "earth"
              } 
              size={14} 
              color="#fff" 
            />
            <Text style={styles.typeBadgeText}>
              {contentType === "movie" ? "MOVIE" :
               contentType === "music" ? "MUSIC" :
               contentType === "cartoon" ? "CARTOON" : "DISCOVERY"}
            </Text>
          </View>
        </View>

        {/* Content Details */}
        <View style={styles.detailsContainer}>
          <Text style={styles.title}>{content.title}</Text>
          
          {/* Meta Info */}
          <View style={styles.metaContainer}>
            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={16} color="#FFD700" />
              <Text style={styles.ratingText}>{content.rating || "8.0"}</Text>
            </View>
            <Text style={styles.dot}>•</Text>
            <Text style={styles.year}>{content.year || "2024"}</Text>
            <Text style={styles.dot}>•</Text>
            <Text style={styles.genre}>{content.genre || "Action"}</Text>
          </View>

          {/* Description/Subtitle */}
          <Text style={styles.description}>
            {content.subtitle || "Experience this amazing content on MrKayWorld. Watch anytime, anywhere."}
          </Text>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={[styles.playButton, { backgroundColor: typeColor }]}
              onPress={handlePlayPreview}
            >
              <Ionicons name="play" size={20} color="#fff" />
              <Text style={styles.playButtonText}>Play Preview</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.downloadButton, { borderColor: typeColor }]}
              onPress={handleDownload}
              disabled={isDownloading}
            >
              {isDownloading ? (
                <ActivityIndicator size="small" color={typeColor} />
              ) : (
                <>
                  <Ionicons name="download" size={20} color={typeColor} />
                  <Text style={[styles.downloadButtonText, { color: typeColor }]}>Download</Text>
                </>
              )}
            </TouchableOpacity>
          </View>

          {/* Secondary Actions */}
          <View style={styles.secondaryActions}>
            <TouchableOpacity style={styles.secondaryButton} onPress={handleAddToList}>
              <Ionicons name="add-circle-outline" size={22} color="#fff" />
              <Text style={styles.secondaryButtonText}>My List</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.secondaryButton} onPress={handleShare}>
              <Ionicons name="share-social-outline" size={22} color="#fff" />
              <Text style={styles.secondaryButtonText}>Share</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.secondaryButton}>
              <Ionicons name="information-circle-outline" size={22} color="#fff" />
              <Text style={styles.secondaryButtonText}>Info</Text>
            </TouchableOpacity>
          </View>

          {/* Additional Details */}
          <View style={styles.additionalInfo}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Cast:</Text>
              <Text style={styles.infoValue}>Timothée Chalamet, Zendaya, Rebecca Ferguson</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Director:</Text>
              <Text style={styles.infoValue}>Denis Villeneuve</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Duration:</Text>
              <Text style={styles.infoValue}>2h 35min</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Language:</Text>
              <Text style={styles.infoValue}>English, Hindi, Spanish</Text>
            </View>
          </View>

          {/* You May Also Like Section */}
          <View style={styles.similarSection}>
            <Text style={styles.similarTitle}>You May Also Like</Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={styles.similarScroll}
            >
              {[1, 2, 3, 4, 5].map((item) => (
                <TouchableOpacity key={item} style={styles.similarCard}>
                  <Image 
                    source={require("../assets/images/poster1.jpg")} 
                    style={styles.similarImage}
                  />
                  <Text style={styles.similarCardTitle}>Similar Title</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </ScrollView>

      {/* Download Progress Modal (simplified) */}
      {isDownloading && (
        <View style={styles.downloadProgress}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: '60%', backgroundColor: typeColor }]} />
          </View>
          <Text style={styles.progressText}>Downloading... 60%</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#fff',
    marginTop: 12,
    fontSize: 16,
  },
  scrollView: {
    flex: 1,
  },
  // Hero Section
  heroSection: {
    height: height * 0.45,
    width: width,
    position: 'relative',
  },
  heroImageContainer: {
    width: width,
    height: height * 0.45,
    overflow: 'hidden',
  },
  heroImage: {
    width: width,
    height: height * 0.45,
  },
  heroGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: height * 0.2,
  },
  videoPlayer: {
    width: width,
    height: height * 0.45,
  },
  backButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 30,
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  typeBadge: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 30,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
    zIndex: 10,
  },
  typeBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  // Details Container
  detailsContainer: {
    padding: 20,
    marginTop: -20,
  },
  title: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 8,
  },
  metaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    color: '#FFD700',
    fontSize: 14,
    fontWeight: '600',
  },
  dot: {
    color: '#666',
    fontSize: 14,
    marginHorizontal: 8,
  },
  year: {
    color: '#aaa',
    fontSize: 14,
  },
  genre: {
    color: '#aaa',
    fontSize: 14,
  },
  description: {
    color: '#fff',
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 24,
    opacity: 0.9,
  },
  // Action Buttons
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  playButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 8,
    gap: 8,
  },
  playButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  downloadButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 8,
    borderWidth: 2,
    gap: 8,
  },
  downloadButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  // Secondary Actions
  secondaryActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 24,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#222',
  },
  secondaryButton: {
    alignItems: 'center',
    gap: 6,
  },
  secondaryButtonText: {
    color: '#fff',
    fontSize: 12,
  },
  // Additional Info
  additionalInfo: {
    marginBottom: 24,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  infoLabel: {
    color: '#888',
    fontSize: 14,
    width: 80,
  },
  infoValue: {
    color: '#fff',
    fontSize: 14,
    flex: 1,
  },
  // Similar Section
  similarSection: {
    marginBottom: 30,
  },
  similarTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  similarScroll: {
    paddingLeft: 0,
  },
  similarCard: {
    width: 100,
    marginRight: 12,
  },
  similarImage: {
    width: 100,
    height: 140,
    borderRadius: 6,
    marginBottom: 6,
  },
  similarCardTitle: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '500',
  },
  // Download Progress
  downloadProgress: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: '#222',
    borderRadius: 12,
    padding: 16,
    zIndex: 20,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#444',
    borderRadius: 3,
    marginBottom: 8,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressText: {
    color: '#fff',
    fontSize: 12,
    textAlign: 'center',
  },
});