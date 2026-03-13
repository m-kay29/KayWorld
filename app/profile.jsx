import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";
import {
  Alert,
  Dimensions,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

export default function ProfileScreen() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [memberSince, setMemberSince] = useState("");

  useEffect(() => {
    getUserData();
  }, []);

  const getUserData = async () => {
    try {
      const storedUser = await SecureStore.getItemAsync("username");
      const token = await SecureStore.getItemAsync("userToken");
      const accountsData = await SecureStore.getItemAsync("accounts");

      if (storedUser) {
        setUsername(storedUser);
        setIsAdmin(token === "admin_logged_in");

        // Find user email from accounts
        if (accountsData) {
          const accounts = JSON.parse(accountsData);
          const user = accounts.find((acc) => acc.username === storedUser);
          if (user) {
            setEmail(user.email || "No email provided");
            setMemberSince(
              user.createdAt
                ? new Date(user.createdAt).toLocaleDateString()
                : "Recent",
            );
          }
        }
      }
    } catch (error) {
      console.error("Error loading user data:", error);
    }
  };

  const getInitials = () => {
    if (!username) return "U";
    return username.charAt(0).toUpperCase();
  };

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
            await SecureStore.deleteItemAsync("userToken");
            await SecureStore.deleteItemAsync("username");
            router.replace("/login");
          },
        },
      ],
      { cancelable: true },
    );
  };

  const menuItems = [
    {
      icon: "person-outline",
      label: "Account Settings",
      screen: "/profile-settings",
    },
    { icon: "heart-outline", label: "My List", screen: "/my-list" },
    { icon: "download-outline", label: "Downloads", screen: "/downloads" },
    { icon: "time-outline", label: "Watch History", screen: "/watch-history" },
    {
      icon: "notifications-outline",
      label: "Notifications",
      screen: "/notifications",
    },
    {
      icon: "help-circle-outline",
      label: "Help & Support",
      screen: "/support",
    },
    { icon: "information-circle-outline", label: "About", screen: "/about" },
  ];

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
          <Text style={styles.headerTitle}>Profile</Text>
          <View style={{ width: 40 }} />
        </SafeAreaView>
      </LinearGradient>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Card */}
        <LinearGradient
          colors={["#E50914", "#990000"]}
          style={styles.profileCard}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>{getInitials()}</Text>
          </View>
          <Text style={styles.userName}>{username || "Guest"}</Text>
          <Text style={styles.userEmail}>{email || "No email provided"}</Text>
          <View style={styles.badgeContainer}>
            <Text style={styles.userBadge}>
              {isAdmin ? "Administrator" : "Member"}
            </Text>
          </View>
          <Text style={styles.memberSince}>Member since {memberSince}</Text>
        </LinearGradient>

        {/* Stats Section */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>0</Text>
            <Text style={styles.statLabel}>Movies</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>0</Text>
            <Text style={styles.statLabel}>Music</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>0</Text>
            <Text style={styles.statLabel}>Cartoons</Text>
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.menuContainer}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.menuItem}
              onPress={() => router.push(item.screen)}
            >
              <View style={styles.menuItemLeft}>
                <Ionicons name={item.icon} size={22} color="#E50914" />
                <Text style={styles.menuItemLabel}>{item.label}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#666" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={22} color="#ff4444" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

        {/* App Version */}
        <Text style={styles.version}>Version 1.0.0</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
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
  scrollView: {
    flex: 1,
  },
  // Profile Card
  profileCard: {
    margin: 16,
    padding: 24,
    borderRadius: 16,
    alignItems: "center",
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#E50914",
  },
  userName: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 4,
  },
  userEmail: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 14,
    marginBottom: 8,
  },
  badgeContainer: {
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
  },
  userBadge: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  memberSince: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 12,
  },
  // Stats
  statsContainer: {
    flexDirection: "row",
    backgroundColor: "#1a1a1a",
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    padding: 16,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statNumber: {
    color: "#E50914",
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 4,
  },
  statLabel: {
    color: "#888",
    fontSize: 12,
  },
  statDivider: {
    width: 1,
    height: "100%",
    backgroundColor: "#333",
  },
  // Menu
  menuContainer: {
    backgroundColor: "#1a1a1a",
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    overflow: "hidden",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#222",
  },
  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  menuItemLabel: {
    color: "#fff",
    fontSize: 15,
  },
  // Logout
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#1a1a1a",
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
  },
  logoutText: {
    color: "#ff4444",
    fontSize: 16,
    fontWeight: "600",
  },
  // Version
  version: {
    textAlign: "center",
    color: "#666",
    fontSize: 12,
    marginBottom: 20,
  },
});
