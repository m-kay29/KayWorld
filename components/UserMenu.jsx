import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";

export default function UserMenu() {
  const router = useRouter();
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [username, setUsername] = useState("");
  const [userInitial, setUserInitial] = useState("");

  useEffect(() => {
    getUserData();
  }, []);

  const getUserData = async () => {
    try {
      const storedUser = await SecureStore.getItemAsync("username");
      if (storedUser) {
        setUsername(storedUser);
        setUserInitial(storedUser.charAt(0).toUpperCase());
      } else {
        setUsername("Guest");
        setUserInitial("G");
      }
    } catch (error) {
      console.error("Error loading user data:", error);
    }
  };

  const handleLogout = async () => {
    setDropdownVisible(false);
    await SecureStore.deleteItemAsync("userToken");
    await SecureStore.deleteItemAsync("username");
    router.replace("/welcome");
  };

  const handleNavigation = (route) => {
    setDropdownVisible(false);
    router.push(route);
  };

  return (
    <View style={styles.profileContainer}>
      <TouchableOpacity
        style={styles.profileButton}
        onPress={() => setDropdownVisible(!dropdownVisible)}
        activeOpacity={0.7}
      >
        <LinearGradient
          colors={["#E50914", "#990000"]}
          style={styles.profileGradient}
        >
          <Text style={styles.profileInitial}>{userInitial}</Text>
        </LinearGradient>
      </TouchableOpacity>

      {/* Dropdown Menu */}
      {dropdownVisible && (
        <>
          <TouchableOpacity
            style={styles.dropdownBackdrop}
            activeOpacity={1}
            onPress={() => setDropdownVisible(false)}
          />
          <View style={styles.dropdown}>
            <View style={styles.dropdownHeader}>
              <LinearGradient
                colors={["#E50914", "#990000"]}
                style={styles.dropdownAvatar}
              >
                <Text style={styles.dropdownAvatarText}>{userInitial}</Text>
              </LinearGradient>
              <View style={styles.dropdownUserInfo}>
                <Text style={styles.dropdownUsername}>{username}</Text>
                <Text style={styles.dropdownEmail}>
                  {username === "Guest" ? "Not signed in" : "Member"}
                </Text>
              </View>
            </View>

            <View style={styles.dropdownDivider} />

            {/* Profile Link */}
            <TouchableOpacity
              style={styles.dropdownItem}
              onPress={() => handleNavigation("/profile")}
            >
              <Ionicons name="person-outline" size={18} color="#E50914" />
              <Text style={styles.dropdownItemText}>Profile</Text>
            </TouchableOpacity>

            {/* My List Link */}
            <TouchableOpacity
              style={styles.dropdownItem}
              onPress={() => handleNavigation("/my-list")}
            >
              <Ionicons name="heart-outline" size={18} color="#E50914" />
              <Text style={styles.dropdownItemText}>My List</Text>
            </TouchableOpacity>

            {/* Downloads Link */}
            <TouchableOpacity
              style={styles.dropdownItem}
              onPress={() => handleNavigation("/download")}
            >
              <Ionicons name="download-outline" size={18} color="#E50914" />
              <Text style={styles.dropdownItemText}>Downloads</Text>
            </TouchableOpacity>

            {/* Settings Link */}
            <TouchableOpacity
              style={styles.dropdownItem}
              onPress={() => handleNavigation("/profile-settings")}
            >
              <Ionicons name="settings-outline" size={18} color="#E50914" />
              <Text style={styles.dropdownItemText}>Settings</Text>
            </TouchableOpacity>

            <View style={styles.dropdownDivider} />

            {/* Logout/Sign In Link */}
            <TouchableOpacity
              style={[styles.dropdownItem, styles.logoutItem]}
              onPress={handleLogout}
            >
              <Ionicons name="log-out-outline" size={18} color="#ff4444" />
              <Text style={[styles.dropdownItemText, styles.logoutText]}>
                {username === "Guest" ? "Sign In" : "Logout"}
              </Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  profileContainer: {
    position: "relative",
    zIndex: 2000,
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "#E50914",
  },
  profileGradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  profileInitial: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  dropdownBackdrop: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "transparent",
    zIndex: 1999,
  },
  dropdown: {
    position: "absolute",
    top: 50,
    right: 0,
    width: 220,
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "#333",
    zIndex: 3000,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  dropdownHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingBottom: 12,
  },
  dropdownAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  dropdownAvatarText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  dropdownUserInfo: {
    flex: 1,
  },
  dropdownUsername: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  dropdownEmail: {
    color: "#888",
    fontSize: 12,
    marginTop: 2,
  },
  dropdownDivider: {
    height: 1,
    backgroundColor: "#333",
    marginVertical: 8,
  },
  dropdownItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    gap: 12,
  },
  dropdownItemText: {
    color: "#fff",
    fontSize: 14,
  },
  logoutItem: {
    marginTop: 0,
  },
  logoutText: {
    color: "#ff4444",
  },
});
