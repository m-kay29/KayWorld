import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Image,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  action,
  cartoons,
  discovery,
  moviesCategory,
  music,
  popular,
  trending,
} from "../data/entertainmentData";

const { width, height } = Dimensions.get("window");

export default function Category() {
  const { category } = useLocalSearchParams();
  const router = useRouter();
  const scrollY = useRef(new Animated.Value(0)).current;
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("default");

  // Get data based on category
  const getCategoryData = () => {
    const categoryStr = Array.isArray(category) ? category[0] : category;

    switch (categoryStr?.toLowerCase()) {
      case "movies":
        return moviesCategory;
      case "music":
        return music;
      case "cartoons":
        return cartoons;
      case "discovery":
        return discovery;
      case "trending":
        return trending;
      case "popular":
        return popular;
      case "action":
        return action;
      default:
        return moviesCategory;
    }
  };

  const allItems = getCategoryData();

  // Filter and sort items
  const getFilteredItems = () => {
    let filtered = [...allItems];

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (item) =>
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.genre?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.subtitle?.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    // Apply sorting
    switch (sortBy) {
      case "rating":
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case "year":
        filtered.sort((a, b) => (b.year || 0) - (a.year || 0));
        break;
      case "title":
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      default:
        // Keep original order
        break;
    }

    return filtered;
  };

  const filteredItems = getFilteredItems();

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

  // Get category color
  const getCategoryColor = () => {
    const categoryStr = Array.isArray(category) ? category[0] : category;

    switch (categoryStr?.toLowerCase()) {
      case "movies":
        return "#E50914";
      case "music":
        return "#1DB954";
      case "cartoons":
        return "#FF6B6B";
      case "discovery":
        return "#FFB347";
      case "trending":
        return "#E50914";
      case "popular":
        return "#FFD700";
      case "action":
        return "#FF4500";
      default:
        return "#E50914";
    }
  };

  const categoryColor = getCategoryColor();

  // Get category icon
  const getCategoryIcon = () => {
    const categoryStr = Array.isArray(category) ? category[0] : category;

    switch (categoryStr?.toLowerCase()) {
      case "movies":
        return "film";
      case "music":
        return "musical-notes";
      case "cartoons":
        return "happy";
      case "discovery":
        return "earth";
      case "trending":
        return "flame";
      case "popular":
        return "heart";
      case "action":
        return "flash";
      default:
        return "apps";
    }
  };

  const renderItem = ({ item, index }) => (
    <TouchableOpacity
      style={styles.itemCard}
      onPress={() =>
        router.push({
          pathname: "/details",
          params: { id: item.id },
        })
      }
      activeOpacity={0.8}
    >
      <View style={styles.itemImageContainer}>
        <Image
          source={item.backdrop || item.image}
          style={styles.itemImage}
          resizeMode="cover"
        />
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.8)"]}
          style={styles.itemGradient}
        />

        {/* Ranking for first 3 items */}
        {index < 3 && (
          <View style={[styles.rankBadge, { backgroundColor: categoryColor }]}>
            <Text style={styles.rankText}>#{index + 1}</Text>
          </View>
        )}

        {/* Rating Badge */}
        <View style={styles.ratingBadge}>
          <Ionicons name="star" size={12} color="#FFD700" />
          <Text style={styles.ratingText}>{item.rating || "8.0"}</Text>
        </View>
      </View>

      <View style={styles.itemInfo}>
        <Text style={styles.itemTitle} numberOfLines={1}>
          {item.title}
        </Text>

        <View style={styles.itemMeta}>
          <Text style={styles.itemYear}>{item.year || "2024"}</Text>
          <Text style={styles.itemDot}>•</Text>
          <Text style={styles.itemGenre} numberOfLines={1}>
            {item.genre?.split("/")[0] || "Documentary"}
          </Text>
        </View>

        {item.subtitle && (
          <Text style={styles.itemSubtitle} numberOfLines={2}>
            {item.subtitle}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );

  const renderSortButton = (label, value) => (
    <TouchableOpacity
      style={[
        styles.sortButton,
        sortBy === value && { backgroundColor: categoryColor },
      ]}
      onPress={() => setSortBy(value)}
    >
      <Text
        style={[
          styles.sortButtonText,
          sortBy === value && styles.sortButtonTextActive,
        ]}
      >
        {label}
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

          <View style={styles.headerTitleContainer}>
            <Ionicons
              name={getCategoryIcon()}
              size={20}
              color={categoryColor}
            />
            <Text style={styles.headerTitle}>
              {typeof category === "string"
                ? category
                : category?.[0] || "Category"}
            </Text>
          </View>

          <TouchableOpacity style={styles.searchButton}>
            <Ionicons name="search" size={22} color="#fff" />
          </TouchableOpacity>
        </SafeAreaView>
      </Animated.View>

      {/* Main Content */}
      <Animated.FlatList
        data={filteredItems}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false },
        )}
        scrollEventThrottle={16}
        ListHeaderComponent={
          <View style={styles.headerSection}>
            {/* Stats Bar */}
            <View style={styles.statsBar}>
              <Text style={styles.statsText}>
                {filteredItems.length}{" "}
                {filteredItems.length === 1 ? "item" : "items"}
              </Text>

              {/* Sort Options */}
              <View style={styles.sortContainer}>
                <Text style={styles.sortLabel}>Sort by:</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View style={styles.sortButtons}>
                    {renderSortButton("Default", "default")}
                    {renderSortButton("Rating", "rating")}
                    {renderSortButton("Year", "year")}
                    {renderSortButton("Title", "title")}
                  </View>
                </ScrollView>
              </View>
            </View>

            {/* Search Bar (optional) */}
            <View style={styles.searchContainer}>
              <Ionicons name="search-outline" size={18} color="#666" />
              <TextInput
                style={styles.searchInput}
                placeholder={`Search ${category}...`}
                placeholderTextColor="#666"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery("")}>
                  <Ionicons name="close-circle" size={16} color="#666" />
                </TouchableOpacity>
              )}
            </View>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="sad-outline" size={60} color="#444" />
            <Text style={styles.emptyTitle}>No items found</Text>
            <Text style={styles.emptyText}>
              Try adjusting your search or filter to find what you're looking
              for.
            </Text>
          </View>
        }
      />
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
  searchButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  // List Header
  headerSection: {
    paddingHorizontal: 16,
    paddingTop: Platform.OS === "ios" ? 120 : 100,
    paddingBottom: 16,
  },
  statsBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  statsText: {
    color: "#aaa",
    fontSize: 13,
  },
  sortContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  sortLabel: {
    color: "#666",
    fontSize: 12,
  },
  sortButtons: {
    flexDirection: "row",
    gap: 8,
  },
  sortButton: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: "#1a1a1a",
    borderWidth: 1,
    borderColor: "#333",
  },
  sortButtonText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "500",
  },
  sortButtonTextActive: {
    color: "#fff",
    fontWeight: "700",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1a1a1a",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
    borderWidth: 1,
    borderColor: "#333",
  },
  searchInput: {
    flex: 1,
    color: "#fff",
    fontSize: 14,
    padding: 0,
  },
  // List Content
  listContent: {
    paddingHorizontal: 12,
    paddingBottom: 20,
  },
  columnWrapper: {
    justifyContent: "space-between",
    marginBottom: 16,
  },
  itemCard: {
    width: (width - 40) / 2,
    backgroundColor: "#0a0a0a",
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#222",
  },
  itemImageContainer: {
    width: "100%",
    height: 160,
    position: "relative",
  },
  itemImage: {
    width: "100%",
    height: "100%",
  },
  itemGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
  },
  rankBadge: {
    position: "absolute",
    top: 8,
    left: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    zIndex: 5,
  },
  rankText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "800",
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
  itemInfo: {
    padding: 12,
  },
  itemTitle: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
  },
  itemMeta: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  itemYear: {
    color: "#888",
    fontSize: 11,
  },
  itemDot: {
    color: "#888",
    fontSize: 11,
    marginHorizontal: 4,
  },
  itemGenre: {
    color: "#888",
    fontSize: 11,
    flex: 1,
  },
  itemSubtitle: {
    color: "#666",
    fontSize: 11,
    lineHeight: 14,
  },
  // Empty State
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  emptyTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    color: "#666",
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },
});
