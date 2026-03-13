import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import * as Sharing from "expo-sharing";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  Dimensions,
  FlatList,
  Image,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import UserMenu from "../components/UserMenu";

const { width, height } = Dimensions.get("window");

// Storage key for downloads
const DOWNLOADS_STORAGE_KEY = "user_downloads";

export default function Downloads() {
  const router = useRouter();
  const [downloads, setDownloads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("downloaded");
  const [editing, setEditing] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [storageInfo, setStorageInfo] = useState({
    used: "0 MB",
    total: "64 GB",
    percentage: 0,
  });

  const scrollY = new Animated.Value(0);
  const headerHeight = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [Platform.OS === "ios" ? 120 : 100, 80],
    extrapolate: "clamp",
  });

  useEffect(() => {
    loadDownloads();
  }, []);

  // Load real downloads from storage
  const loadDownloads = async () => {
    setLoading(true);
    try {
      const storedDownloads = await SecureStore.getItemAsync(
        DOWNLOADS_STORAGE_KEY,
      );
      if (storedDownloads) {
        const parsedDownloads = JSON.parse(storedDownloads);
        setDownloads(parsedDownloads);

        // Calculate storage used
        calculateStorageUsed(parsedDownloads);
      } else {
        setDownloads([]);
      }
    } catch (error) {
      console.error("Error loading downloads:", error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate total storage used by downloads
  const calculateStorageUsed = (downloadsList) => {
    const downloadedItems = downloadsList.filter((item) => item.downloaded);

    if (downloadedItems.length === 0) {
      setStorageInfo({
        used: "0 MB",
        total: "64 GB",
        percentage: 0,
      });
      return;
    }

    // Parse sizes and calculate total
    let totalBytes = 0;
    downloadedItems.forEach((item) => {
      const sizeStr = item.size || "0 MB";
      const value = parseFloat(sizeStr);
      if (sizeStr.includes("GB")) {
        totalBytes += value * 1024 * 1024 * 1024;
      } else if (sizeStr.includes("MB")) {
        totalBytes += value * 1024 * 1024;
      } else if (sizeStr.includes("KB")) {
        totalBytes += value * 1024;
      }
    });

    // Convert to readable format
    const usedGB = (totalBytes / (1024 * 1024 * 1024)).toFixed(1);
    const totalGB = 64; // Assume 64GB device storage
    const percentage = Math.min(
      Math.round((totalBytes / (totalGB * 1024 * 1024 * 1024)) * 100),
      100,
    );

    setStorageInfo({
      used: `${usedGB} GB`,
      total: `${totalGB} GB`,
      percentage,
    });
  };

  // Save downloads to storage
  const saveDownloads = async (updatedDownloads) => {
    try {
      await SecureStore.setItemAsync(
        DOWNLOADS_STORAGE_KEY,
        JSON.stringify(updatedDownloads),
      );
      setDownloads(updatedDownloads);
      calculateStorageUsed(updatedDownloads);
    } catch (error) {
      console.error("Error saving downloads:", error);
    }
  };

  const getDownloadedItems = () => downloads.filter((item) => item.downloaded);
  const getDownloadingItems = () =>
    downloads.filter(
      (item) => !item.downloaded && item.progress && item.progress < 1,
    );
  const getQueuedItems = () =>
    downloads.filter(
      (item) => !item.downloaded && (!item.progress || item.progress === 0),
    );

  const getActiveItems = () => {
    switch (activeTab) {
      case "downloaded":
        return getDownloadedItems();
      case "downloading":
        return getDownloadingItems();
      case "queued":
        return getQueuedItems();
      default:
        return getDownloadedItems();
    }
  };

  const handlePlay = (item) => {
    router.push({
      pathname: "/details",
      params: { id: item.id },
    });
  };

  const handleDelete = (item) => {
    Alert.alert(
      "Delete Download",
      `Are you sure you want to delete "${item.title}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            const updatedDownloads = downloads.filter((d) => d.id !== item.id);
            saveDownloads(updatedDownloads);
          },
        },
      ],
    );
  };

  const handleDeleteSelected = () => {
    Alert.alert(
      "Delete Selected",
      `Delete ${selectedItems.length} selected item${selectedItems.length > 1 ? "s" : ""}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            const updatedDownloads = downloads.filter(
              (d) => !selectedItems.includes(d.id),
            );
            saveDownloads(updatedDownloads);
            setSelectedItems([]);
            setEditing(false);
          },
        },
      ],
    );
  };

  const handleShare = async (item) => {
    try {
      await Sharing.shareAsync(item.title);
    } catch (error) {
      console.error("Share error:", error);
    }
  };

  const handlePauseDownload = (item) => {
    Alert.alert("Paused", `Download of "${item.title}" paused`);
  };

  const handleCancelDownload = (item) => {
    Alert.alert("Cancel Download", `Cancel download of "${item.title}"?`, [
      { text: "No", style: "cancel" },
      {
        text: "Yes",
        onPress: () => {
          const updatedDownloads = downloads.filter((d) => d.id !== item.id);
          saveDownloads(updatedDownloads);
        },
      },
    ]);
  };

  const handleResumeDownload = (item) => {
    Alert.alert("Resumed", `Download of "${item.title}" resumed`);
  };

  const toggleSelection = (id) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case "movie":
        return "film";
      case "music":
        return "musical-notes";
      case "cartoon":
        return "happy";
      case "discovery":
        return "earth";
      default:
        return "videocam";
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case "movie":
        return "#E50914";
      case "music":
        return "#1DB954";
      case "cartoon":
        return "#FF6B6B";
      case "discovery":
        return "#FFB347";
      default:
        return "#E50914";
    }
  };

  const renderDownloadItem = ({ item }) => {
    const isSelected = selectedItems.includes(item.id);
    const typeColor = getTypeColor(item.type);
    const isDownloaded = item.downloaded;
    const isDownloading =
      !item.downloaded && item.progress && item.progress > 0;

    return (
      <TouchableOpacity
        style={[
          styles.downloadCard,
          editing && isSelected && styles.selectedCard,
          editing && { borderColor: typeColor, borderWidth: 2 },
        ]}
        onPress={() => (editing ? toggleSelection(item.id) : handlePlay(item))}
        onLongPress={() => {
          setEditing(true);
          toggleSelection(item.id);
        }}
        activeOpacity={0.7}
      >
        <View style={styles.cardImageContainer}>
          <Image source={item.image} style={styles.cardImage} />
          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.7)"]}
            style={styles.cardGradient}
          />

          {/* Type Badge */}
          <View style={[styles.typeBadge, { backgroundColor: typeColor }]}>
            <Ionicons name={getTypeIcon(item.type)} size={10} color="#fff" />
          </View>

          {/* Selection Checkbox (when editing) */}
          {editing && (
            <View
              style={[styles.checkbox, isSelected && styles.checkboxChecked]}
            >
              {isSelected && (
                <Ionicons name="checkmark" size={12} color="#fff" />
              )}
            </View>
          )}

          {/* Download Progress (for downloading items) */}
          {isDownloading && (
            <View style={styles.progressContainer}>
              <View
                style={[
                  styles.progressBar,
                  {
                    width: `${item.progress * 100}%`,
                    backgroundColor: typeColor,
                  },
                ]}
              />
            </View>
          )}
        </View>

        <View style={styles.cardInfo}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle} numberOfLines={1}>
              {item.title}
            </Text>
            <View style={styles.cardRating}>
              <Ionicons name="star" size={10} color="#FFD700" />
              <Text style={styles.cardRatingText}>{item.rating || "8.0"}</Text>
            </View>
          </View>

          <View style={styles.cardMeta}>
            <Text style={styles.cardGenre}>
              {item.genre?.split("/")[0] || "Content"}
            </Text>
            <Text style={styles.cardDot}>•</Text>
            <Text style={styles.cardYear}>{item.year || "2024"}</Text>
            <Text style={styles.cardDot}>•</Text>
            <Text style={styles.cardSize}>{item.size || "—"}</Text>
          </View>

          {/* Action Buttons */}
          {!editing && (
            <View style={styles.cardActions}>
              {isDownloaded ? (
                <>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.playButton]}
                    onPress={() => handlePlay(item)}
                  >
                    <Ionicons name="play" size={14} color={typeColor} />
                    <Text style={[styles.actionText, { color: typeColor }]}>
                      Play
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleShare(item)}
                  >
                    <Ionicons name="share-outline" size={14} color="#fff" />
                    <Text style={styles.actionText}>Share</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleDelete(item)}
                  >
                    <Ionicons name="trash-outline" size={14} color="#ff4444" />
                    <Text style={[styles.actionText, { color: "#ff4444" }]}>
                      Delete
                    </Text>
                  </TouchableOpacity>
                </>
              ) : isDownloading ? (
                <>
                  <View style={styles.progressInfo}>
                    <Text style={styles.progressPercent}>
                      {Math.round(item.progress * 100)}%
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handlePauseDownload(item)}
                  >
                    <Ionicons name="pause" size={14} color="#fff" />
                    <Text style={styles.actionText}>Pause</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleCancelDownload(item)}
                  >
                    <Ionicons name="close" size={14} color="#ff4444" />
                    <Text style={[styles.actionText, { color: "#ff4444" }]}>
                      Cancel
                    </Text>
                  </TouchableOpacity>
                </>
              ) : (
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => handleResumeDownload(item)}
                >
                  <Ionicons name="download" size={14} color="#4CAF50" />
                  <Text style={[styles.actionText, { color: "#4CAF50" }]}>
                    Download
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconContainer}>
        <LinearGradient
          colors={["#E50914", "#990000"]}
          style={styles.emptyIconGradient}
        >
          <Ionicons name="download-outline" size={50} color="#fff" />
        </LinearGradient>
      </View>
      <Text style={styles.emptyTitle}>No Downloads Yet</Text>
      <Text style={styles.emptyText}>
        Start downloading your favorite movies, music, and shows to watch
        offline.
      </Text>
      <TouchableOpacity
        style={styles.browseButton}
        onPress={() => router.push("/menu")}
      >
        <Text style={styles.browseButtonText}>Browse Content</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#E50914" />
        <Text style={styles.loadingText}>Loading your downloads...</Text>
      </View>
    );
  }

  const activeItems = getActiveItems();

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />

      {/* Animated Header */}
      <Animated.View style={[styles.headerGradient, { height: headerHeight }]}>
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

          <View style={styles.headerTitleContainer}>
            <Ionicons name="download" size={20} color="#E50914" />
            <Text style={styles.headerTitle}>Downloads</Text>
          </View>

          <UserMenu />
        </SafeAreaView>
      </Animated.View>

      {/* Storage Info */}
      <View style={styles.storageContainer}>
        <View style={styles.storageHeader}>
          <Text style={styles.storageTitle}>Storage</Text>
          <Text style={styles.storageUsed}>
            {storageInfo.used} of {storageInfo.total}
          </Text>
        </View>
        <View style={styles.storageBar}>
          <View
            style={[
              styles.storageFill,
              { width: `${storageInfo.percentage}%` },
            ]}
          />
        </View>
      </View>

      {/* Tab Selector */}
      <View style={styles.tabContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.tabs}>
            {[
              {
                id: "downloaded",
                label: "Downloaded",
                count: getDownloadedItems().length,
              },
              {
                id: "downloading",
                label: "Downloading",
                count: getDownloadingItems().length,
              },
              { id: "queued", label: "Queued", count: getQueuedItems().length },
            ].map((tab) => (
              <TouchableOpacity
                key={tab.id}
                style={[styles.tab, activeTab === tab.id && styles.activeTab]}
                onPress={() => setActiveTab(tab.id)}
              >
                <Text
                  style={[
                    styles.tabText,
                    activeTab === tab.id && styles.activeTabText,
                  ]}
                >
                  {tab.label} {tab.count > 0 && `(${tab.count})`}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* Edit Button (only show if there are downloaded items) */}
      {activeItems.length > 0 && !editing && (
        <View style={styles.editButtonContainer}>
          <TouchableOpacity onPress={() => setEditing(true)}>
            <Text style={styles.editText}>Edit</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Edit Actions */}
      {editing && (
        <View style={styles.editActionsContainer}>
          <TouchableOpacity onPress={() => setEditing(false)}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
          {selectedItems.length > 0 && (
            <TouchableOpacity onPress={handleDeleteSelected}>
              <Text style={styles.deleteText}>
                Delete ({selectedItems.length})
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* Downloads List */}
      {activeItems.length > 0 ? (
        <FlatList
          data={activeItems}
          renderItem={renderDownloadItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: false },
          )}
          scrollEventThrottle={16}
        />
      ) : (
        renderEmptyState()
      )}

      {/* Selection Count */}
      {editing && selectedItems.length > 0 && (
        <View style={styles.selectionBar}>
          <Text style={styles.selectionText}>
            {selectedItems.length} item{selectedItems.length > 1 ? "s" : ""}{" "}
            selected
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: "#fff",
    marginTop: 12,
    fontSize: 14,
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
  headerTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
  },
  editButtonContainer: {
    alignItems: "flex-end",
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  editText: {
    color: "#E50914",
    fontSize: 16,
    fontWeight: "600",
  },
  editActionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  cancelText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  deleteText: {
    color: "#ff4444",
    fontSize: 16,
    fontWeight: "600",
  },
  // Storage
  storageContainer: {
    marginTop: Platform.OS === "ios" ? 120 : 100,
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 12,
    backgroundColor: "#1a1a1a",
    borderRadius: 8,
  },
  storageHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  storageTitle: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "500",
  },
  storageUsed: {
    color: "#888",
    fontSize: 12,
  },
  storageBar: {
    height: 4,
    backgroundColor: "#333",
    borderRadius: 2,
    overflow: "hidden",
  },
  storageFill: {
    height: "100%",
    backgroundColor: "#E50914",
    borderRadius: 2,
  },
  // Tabs
  tabContainer: {
    marginBottom: 16,
  },
  tabs: {
    flexDirection: "row",
    paddingHorizontal: 16,
    gap: 12,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#1a1a1a",
  },
  activeTab: {
    backgroundColor: "#E50914",
  },
  tabText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "500",
  },
  activeTabText: {
    fontWeight: "700",
  },
  // List
  listContent: {
    padding: 16,
    paddingTop: 0,
  },
  downloadCard: {
    flexDirection: "row",
    backgroundColor: "#0a0a0a",
    borderRadius: 12,
    marginBottom: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#222",
  },
  selectedCard: {
    borderColor: "#E50914",
  },
  cardImageContainer: {
    width: 100,
    height: 140,
    position: "relative",
  },
  cardImage: {
    width: "100%",
    height: "100%",
  },
  cardGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
  },
  typeBadge: {
    position: "absolute",
    top: 8,
    left: 8,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 5,
  },
  checkbox: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: "#fff",
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 5,
  },
  checkboxChecked: {
    backgroundColor: "#E50914",
    borderColor: "#E50914",
  },
  progressContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: "#333",
  },
  progressBar: {
    height: "100%",
  },
  cardInfo: {
    flex: 1,
    padding: 12,
    justifyContent: "space-between",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  cardTitle: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
    flex: 1,
    marginRight: 8,
  },
  cardRating: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  cardRatingText: {
    color: "#FFD700",
    fontSize: 11,
    fontWeight: "600",
  },
  cardMeta: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  cardGenre: {
    color: "#888",
    fontSize: 11,
  },
  cardDot: {
    color: "#888",
    fontSize: 11,
    marginHorizontal: 4,
  },
  cardYear: {
    color: "#888",
    fontSize: 11,
  },
  cardSize: {
    color: "#888",
    fontSize: 11,
  },
  cardActions: {
    flexDirection: "row",
    gap: 12,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  actionText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "500",
  },
  playButton: {
    backgroundColor: "rgba(229, 9, 20, 0.1)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  progressInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 8,
  },
  progressPercent: {
    color: "#4CAF50",
    fontSize: 11,
    fontWeight: "600",
  },
  // Selection Bar
  selectionBar: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: "#E50914",
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
  },
  selectionText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  // Empty State
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
    marginTop: -100,
  },
  emptyIconContainer: {
    marginBottom: 20,
  },
  emptyIconGradient: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyTitle: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 10,
  },
  emptyText: {
    color: "#888",
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 25,
  },
  browseButton: {
    backgroundColor: "#E50914",
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 8,
  },
  browseButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
