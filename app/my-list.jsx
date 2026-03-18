import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useFocusEffect, useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useCallback, useState } from "react";
import {
  Alert,
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

const { width } = Dimensions.get("window");

// Storage key for my list
const MY_LIST_STORAGE_KEY = "user_my_list";

export default function MyList() {
  const router = useRouter();
  const [myList, setMyList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [editing, setEditing] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);

  // Load the list whenever the screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadMyList();
    }, []),
  );

  const loadMyList = async () => {
    setLoading(true);
    try {
      const storedList = await SecureStore.getItemAsync(MY_LIST_STORAGE_KEY);
      console.log("Raw stored list:", storedList); // Debug log

      if (storedList) {
        const parsedList = JSON.parse(storedList);
        console.log("Parsed list:", parsedList); // Debug log
        setMyList(parsedList);
      } else {
        console.log("No stored list found - starting empty"); // Debug log
        setMyList([]);
      }
    } catch (error) {
      console.error("Error loading my list:", error);
    } finally {
      setLoading(false);
    }
  };

  const saveMyList = async (updatedList) => {
    try {
      await SecureStore.setItemAsync(
        MY_LIST_STORAGE_KEY,
        JSON.stringify(updatedList),
      );
      setMyList(updatedList);
    } catch (error) {
      console.error("Error saving my list:", error);
    }
  };

  const categories = [
    { id: "all", label: "All", icon: "apps" },
    { id: "movie", label: "Movies", icon: "film" },
    { id: "music", label: "Music", icon: "musical-notes" },
    { id: "cartoon", label: "Cartoons", icon: "happy" },
    { id: "discovery", label: "Discovery", icon: "earth" },
  ];

  const getFilteredList = () => {
    if (selectedCategory === "all") return myList;
    return myList.filter((item) => item.type === selectedCategory);
  };

  const handleRemove = (item) => {
    Alert.alert("Remove from List", `Remove "${item.title}" from your list?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Remove",
        style: "destructive",
        onPress: () => {
          const updatedList = myList.filter((i) => i.id !== item.id);
          saveMyList(updatedList);
        },
      },
    ]);
  };

  const handleRemoveSelected = () => {
    Alert.alert(
      "Remove Selected",
      `Remove ${selectedItems.length} item${selectedItems.length > 1 ? "s" : ""} from your list?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: () => {
            const updatedList = myList.filter(
              (item) => !selectedItems.includes(item.id),
            );
            saveMyList(updatedList);
            setSelectedItems([]);
            setEditing(false);
          },
        },
      ],
    );
  };

  const toggleSelection = (id) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const handleItemPress = (item) => {
    if (editing) {
      toggleSelection(item.id);
    } else {
      router.push({
        pathname: "/details",
        params: { id: item.id },
      });
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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString();
  };

  const renderItem = ({ item }) => {
    const isSelected = selectedItems.includes(item.id);
    const typeColor = getTypeColor(item.type);

    return (
      <TouchableOpacity
        style={[styles.listItem, editing && isSelected && styles.selectedItem]}
        onPress={() => handleItemPress(item)}
        onLongPress={() => {
          setEditing(true);
          toggleSelection(item.id);
        }}
        activeOpacity={0.7}
      >
        <View style={styles.itemImageContainer}>
          <Image source={item.image} style={styles.itemImage} />
          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.7)"]}
            style={styles.imageGradient}
          />

          {/* Type Badge */}
          <View style={[styles.typeBadge, { backgroundColor: typeColor }]}>
            <Ionicons name={getTypeIcon(item.type)} size={10} color="#fff" />
          </View>

          {/* Selection Checkbox */}
          {editing && (
            <View
              style={[styles.checkbox, isSelected && styles.checkboxChecked]}
            >
              {isSelected && (
                <Ionicons name="checkmark" size={12} color="#fff" />
              )}
            </View>
          )}
        </View>

        <View style={styles.itemInfo}>
          <View style={styles.itemHeader}>
            <Text style={styles.itemTitle} numberOfLines={1}>
              {item.title}
            </Text>
            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={12} color="#FFD700" />
              <Text style={styles.ratingText}>{item.rating}</Text>
            </View>
          </View>

          <View style={styles.itemMeta}>
            <Text style={styles.itemGenre}>{item.genre?.split("/")[0]}</Text>
            <Text style={styles.itemDot}>•</Text>
            <Text style={styles.itemYear}>{item.year}</Text>
          </View>

          <Text style={styles.addedDate}>
            Added {formatDate(item.dateAdded)}
          </Text>

          {!editing && (
            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => handleRemove(item)}
            >
              <Ionicons name="close-circle" size={20} color="#666" />
            </TouchableOpacity>
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
          <Ionicons name="heart-outline" size={50} color="#fff" />
        </LinearGradient>
      </View>
      <Text style={styles.emptyTitle}>Your List is Empty</Text>
      <Text style={styles.emptyText}>
        Start adding movies, music, and shows to your list to watch later.
      </Text>
      <TouchableOpacity
        style={styles.browseButton}
        onPress={() => router.push("/menu")}
      >
        <Text style={styles.browseButtonText}>Browse Content</Text>
      </TouchableOpacity>
    </View>
  );

  const filteredList = getFilteredList();

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />

      {/* Header */}
      <LinearGradient
        colors={["#000000", "#1a0000", "#330000"]}
        style={styles.header}
      >
        <SafeAreaView style={styles.headerContent}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>My List</Text>
          <UserMenu />
        </SafeAreaView>
      </LinearGradient>

      {/* Category Filter - Only show if list has items */}
      {myList.length > 0 && (
        <View style={styles.categoryContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.categoryList}>
              {categories.map((cat) => (
                <TouchableOpacity
                  key={cat.id}
                  style={[
                    styles.categoryChip,
                    selectedCategory === cat.id && styles.categoryChipActive,
                  ]}
                  onPress={() => setSelectedCategory(cat.id)}
                >
                  <Ionicons
                    name={cat.icon}
                    size={14}
                    color={selectedCategory === cat.id ? "#fff" : "#E50914"}
                  />
                  <Text
                    style={[
                      styles.categoryChipText,
                      selectedCategory === cat.id &&
                        styles.categoryChipTextActive,
                    ]}
                  >
                    {cat.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>
      )}

      {/* Edit Button - Only show if list has items */}
      {filteredList.length > 0 && !editing && (
        <View style={styles.editButtonContainer}>
          <TouchableOpacity onPress={() => setEditing(true)}>
            <Text style={styles.editText}>Edit</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Edit Actions */}
      {editing && (
        <View style={styles.editActionsContainer}>
          <TouchableOpacity
            onPress={() => {
              setEditing(false);
              setSelectedItems([]);
            }}
          >
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
          {selectedItems.length > 0 && (
            <TouchableOpacity onPress={handleRemoveSelected}>
              <Text style={styles.removeText}>
                Remove ({selectedItems.length})
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* List Content */}
      {filteredList.length > 0 ? (
        <FlatList
          data={filteredList}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        renderEmptyState()
      )}

      {/* Selection Bar */}
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
    fontSize: 16,
  },
  header: {
    paddingTop: 0,
    paddingBottom: 15,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: Platform.OS === "ios" ? 50 : 30,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
  },
  headerTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
  },
  // Category Filter
  categoryContainer: {
    marginTop: 16,
    marginBottom: 8,
  },
  categoryList: {
    flexDirection: "row",
    paddingHorizontal: 16,
    gap: 10,
  },
  categoryChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: "#1a1a1a",
    gap: 6,
  },
  categoryChipActive: {
    backgroundColor: "#E50914",
  },
  categoryChipText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "500",
  },
  categoryChipTextActive: {
    fontWeight: "700",
  },
  // Edit Controls
  editButtonContainer: {
    alignItems: "flex-end",
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  editText: {
    color: "#E50914",
    fontSize: 14,
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
    fontSize: 14,
    fontWeight: "600",
  },
  removeText: {
    color: "#ff4444",
    fontSize: 14,
    fontWeight: "600",
  },
  // List
  listContent: {
    padding: 16,
    paddingTop: 0,
  },
  listItem: {
    flexDirection: "row",
    backgroundColor: "#0a0a0a",
    borderRadius: 12,
    marginBottom: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#222",
  },
  selectedItem: {
    borderColor: "#E50914",
    borderWidth: 2,
  },
  itemImageContainer: {
    width: 100,
    height: 140,
    position: "relative",
  },
  itemImage: {
    width: "100%",
    height: "100%",
  },
  imageGradient: {
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
  itemInfo: {
    flex: 1,
    padding: 12,
    position: "relative",
  },
  itemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  itemTitle: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
    flex: 1,
    marginRight: 8,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  ratingText: {
    color: "#FFD700",
    fontSize: 11,
    fontWeight: "600",
  },
  itemMeta: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  itemGenre: {
    color: "#888",
    fontSize: 11,
  },
  itemDot: {
    color: "#888",
    fontSize: 11,
    marginHorizontal: 4,
  },
  itemYear: {
    color: "#888",
    fontSize: 11,
  },
  addedDate: {
    color: "#666",
    fontSize: 10,
  },
  removeButton: {
    position: "absolute",
    bottom: 12,
    right: 12,
  },
  // Empty State
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
    marginTop: -50,
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
});
