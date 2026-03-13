import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";
import {
    Alert,
    Dimensions,
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
import UserMenu from "../components/UserMenu";

const { width } = Dimensions.get("window");

export default function ProfileSettings() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [downloadOverWifi, setDownloadOverWifi] = useState(true);
  const [autoPlay, setAutoPlay] = useState(true);
  const [subtitles, setSubtitles] = useState(true);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const storedUser = await SecureStore.getItemAsync("username");
      const accountsData = await SecureStore.getItemAsync("accounts");

      if (storedUser) {
        setUsername(storedUser);

        if (accountsData) {
          const accounts = JSON.parse(accountsData);
          const user = accounts.find((acc) => acc.username === storedUser);
          if (user) {
            setEmail(user.email || "");
          }
        }
      }
    } catch (error) {
      console.error("Error loading user data:", error);
    }
  };

  const handleSaveProfile = async () => {
    if (!username || !email) {
      Alert.alert("Error", "Username and email are required");
      return;
    }

    setIsLoading(true);

    try {
      const accountsData = await SecureStore.getItemAsync("accounts");
      if (accountsData) {
        let accounts = JSON.parse(accountsData);
        const currentUser = await SecureStore.getItemAsync("username");

        // Update user data
        accounts = accounts.map((acc) => {
          if (acc.username === currentUser) {
            return { ...acc, username, email };
          }
          return acc;
        });

        await SecureStore.setItemAsync("accounts", JSON.stringify(accounts));

        // Update stored username if changed
        if (username !== currentUser) {
          await SecureStore.setItemAsync("username", username);
        }

        Alert.alert("Success", "Profile updated successfully");
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      Alert.alert("Error", "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert("Error", "All password fields are required");
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "New passwords do not match");
      return;
    }

    setIsLoading(true);

    try {
      const accountsData = await SecureStore.getItemAsync("accounts");
      const currentUser = await SecureStore.getItemAsync("username");

      if (accountsData) {
        let accounts = JSON.parse(accountsData);
        const userIndex = accounts.findIndex(
          (acc) => acc.username === currentUser,
        );

        if (userIndex !== -1) {
          // Verify current password (in a real app, this would be hashed)
          if (accounts[userIndex].password !== currentPassword) {
            Alert.alert("Error", "Current password is incorrect");
            setIsLoading(false);
            return;
          }

          // Update password
          accounts[userIndex].password = newPassword;
          await SecureStore.setItemAsync("accounts", JSON.stringify(accounts));

          Alert.alert("Success", "Password changed successfully");
          setCurrentPassword("");
          setNewPassword("");
          setConfirmPassword("");
        }
      }
    } catch (error) {
      console.error("Error changing password:", error);
      Alert.alert("Error", "Failed to change password");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearHistory = () => {
    Alert.alert(
      "Clear Watch History",
      "Are you sure you want to clear your watch history? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear",
          style: "destructive",
          onPress: () => {
            // Implement clear history logic
            Alert.alert("Success", "Watch history cleared");
          },
        },
      ],
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete Account",
      "Are you sure you want to delete your account? All your data will be permanently removed.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const currentUser = await SecureStore.getItemAsync("username");
              const accountsData = await SecureStore.getItemAsync("accounts");

              if (accountsData) {
                let accounts = JSON.parse(accountsData);
                accounts = accounts.filter(
                  (acc) => acc.username !== currentUser,
                );
                await SecureStore.setItemAsync(
                  "accounts",
                  JSON.stringify(accounts),
                );
                await SecureStore.deleteItemAsync("userToken");
                await SecureStore.deleteItemAsync("username");
                router.replace("/welcome");
              }
            } catch (error) {
              console.error("Error deleting account:", error);
            }
          },
        },
      ],
    );
  };

  const SettingSwitch = ({ value, onValueChange, label }) => (
    <TouchableOpacity
      style={styles.settingRow}
      onPress={() => onValueChange(!value)}
    >
      <Text style={styles.settingLabel}>{label}</Text>
      <View style={[styles.switch, value && styles.switchActive]}>
        <View
          style={[styles.switchCircle, value && styles.switchCircleActive]}
        />
      </View>
    </TouchableOpacity>
  );

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
          <Text style={styles.headerTitle}>Settings</Text>
          <UserMenu />
        </SafeAreaView>
      </LinearGradient>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Profile Information</Text>

          <View style={styles.inputContainer}>
            <Ionicons
              name="person-outline"
              size={20}
              color="#E50914"
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="Username"
              placeholderTextColor="#666"
              value={username}
              onChangeText={setUsername}
            />
          </View>

          <View style={styles.inputContainer}>
            <Ionicons
              name="mail-outline"
              size={20}
              color="#E50914"
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#666"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSaveProfile}
            disabled={isLoading}
          >
            <LinearGradient
              colors={["#E50914", "#990000"]}
              style={styles.saveButtonGradient}
            >
              <Text style={styles.saveButtonText}>Save Changes</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Change Password Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Change Password</Text>

          <View style={styles.inputContainer}>
            <Ionicons
              name="lock-closed-outline"
              size={20}
              color="#E50914"
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="Current Password"
              placeholderTextColor="#666"
              secureTextEntry={!showCurrentPassword}
              value={currentPassword}
              onChangeText={setCurrentPassword}
            />
            <TouchableOpacity
              onPress={() => setShowCurrentPassword(!showCurrentPassword)}
            >
              <Ionicons
                name={showCurrentPassword ? "eye-off-outline" : "eye-outline"}
                size={20}
                color="#666"
              />
            </TouchableOpacity>
          </View>

          <View style={styles.inputContainer}>
            <Ionicons
              name="lock-closed-outline"
              size={20}
              color="#E50914"
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="New Password"
              placeholderTextColor="#666"
              secureTextEntry={!showNewPassword}
              value={newPassword}
              onChangeText={setNewPassword}
            />
            <TouchableOpacity
              onPress={() => setShowNewPassword(!showNewPassword)}
            >
              <Ionicons
                name={showNewPassword ? "eye-off-outline" : "eye-outline"}
                size={20}
                color="#666"
              />
            </TouchableOpacity>
          </View>

          <View style={styles.inputContainer}>
            <Ionicons
              name="lock-closed-outline"
              size={20}
              color="#E50914"
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="Confirm New Password"
              placeholderTextColor="#666"
              secureTextEntry={!showConfirmPassword}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
            <TouchableOpacity
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              <Ionicons
                name={showConfirmPassword ? "eye-off-outline" : "eye-outline"}
                size={20}
                color="#666"
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.changePasswordButton}
            onPress={handleChangePassword}
            disabled={isLoading}
          >
            <Text style={styles.changePasswordText}>Update Password</Text>
          </TouchableOpacity>
        </View>

        {/* Preferences Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>

          <SettingSwitch
            label="Push Notifications"
            value={notifications}
            onValueChange={setNotifications}
          />

          <SettingSwitch
            label="Download over Wi-Fi only"
            value={downloadOverWifi}
            onValueChange={setDownloadOverWifi}
          />

          <SettingSwitch
            label="Auto-play previews"
            value={autoPlay}
            onValueChange={setAutoPlay}
          />

          <SettingSwitch
            label="Subtitles by default"
            value={subtitles}
            onValueChange={setSubtitles}
          />
        </View>

        {/* Content Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Content</Text>

          <TouchableOpacity style={styles.menuItem} onPress={() => {}}>
            <View style={styles.menuItemLeft}>
              <Ionicons name="language-outline" size={20} color="#E50914" />
              <Text style={styles.menuItemText}>Language Preferences</Text>
            </View>
            <Text style={styles.menuItemValue}>English</Text>
            <Ionicons name="chevron-forward" size={18} color="#666" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={() => {}}>
            <View style={styles.menuItemLeft}>
              <Ionicons
                name="closed-captioning-outline"
                size={20}
                color="#E50914"
              />
              <Text style={styles.menuItemText}>Subtitle Settings</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#666" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={() => {}}>
            <View style={styles.menuItemLeft}>
              <Ionicons name="videocam-outline" size={20} color="#E50914" />
              <Text style={styles.menuItemText}>Video Quality</Text>
            </View>
            <Text style={styles.menuItemValue}>Auto</Text>
            <Ionicons name="chevron-forward" size={18} color="#666" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={() => {}}>
            <View style={styles.menuItemLeft}>
              <Ionicons
                name="musical-notes-outline"
                size={20}
                color="#E50914"
              />
              <Text style={styles.menuItemText}>Audio Quality</Text>
            </View>
            <Text style={styles.menuItemValue}>High</Text>
            <Ionicons name="chevron-forward" size={18} color="#666" />
          </TouchableOpacity>
        </View>

        {/* Privacy Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Privacy</Text>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={handleClearHistory}
          >
            <View style={styles.menuItemLeft}>
              <Ionicons name="time-outline" size={20} color="#E50914" />
              <Text style={styles.menuItemText}>Clear Watch History</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#666" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={() => {}}>
            <View style={styles.menuItemLeft}>
              <Ionicons name="download-outline" size={20} color="#E50914" />
              <Text style={styles.menuItemText}>Clear Downloads</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#666" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={() => {}}>
            <View style={styles.menuItemLeft}>
              <Ionicons name="search-outline" size={20} color="#E50914" />
              <Text style={styles.menuItemText}>Clear Search History</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#666" />
          </TouchableOpacity>
        </View>

        {/* Support Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>

          <TouchableOpacity style={styles.menuItem} onPress={() => {}}>
            <View style={styles.menuItemLeft}>
              <Ionicons name="help-circle-outline" size={20} color="#E50914" />
              <Text style={styles.menuItemText}>Help Center</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#666" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={() => {}}>
            <View style={styles.menuItemLeft}>
              <Ionicons
                name="document-text-outline"
                size={20}
                color="#E50914"
              />
              <Text style={styles.menuItemText}>Terms of Service</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#666" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={() => {}}>
            <View style={styles.menuItemLeft}>
              <Ionicons name="shield-outline" size={20} color="#E50914" />
              <Text style={styles.menuItemText}>Privacy Policy</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#666" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={() => {}}>
            <View style={styles.menuItemLeft}>
              <Ionicons
                name="information-circle-outline"
                size={20}
                color="#E50914"
              />
              <Text style={styles.menuItemText}>About</Text>
            </View>
            <Text style={styles.menuItemValue}>Version 1.0.0</Text>
            <Ionicons name="chevron-forward" size={18} color="#666" />
          </TouchableOpacity>
        </View>

        {/* Danger Zone */}
        <View style={[styles.section, styles.dangerZone]}>
          <Text style={[styles.sectionTitle, styles.dangerTitle]}>
            Danger Zone
          </Text>

          <TouchableOpacity
            style={styles.dangerButton}
            onPress={handleDeleteAccount}
          >
            <Ionicons name="trash-outline" size={20} color="#ff4444" />
            <Text style={styles.dangerButtonText}>Delete Account</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 30 }} />
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
  // Sections
  section: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 16,
  },
  // Input Fields
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1a1a1a",
    borderRadius: 8,
    marginBottom: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#333",
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: "#fff",
    fontSize: 15,
    paddingVertical: 14,
  },
  saveButton: {
    marginTop: 8,
    borderRadius: 8,
    overflow: "hidden",
  },
  saveButtonGradient: {
    paddingVertical: 14,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  changePasswordButton: {
    backgroundColor: "#1a1a1a",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#333",
    marginTop: 8,
  },
  changePasswordText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "500",
  },
  // Settings
  settingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#1a1a1a",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 8,
    marginBottom: 8,
  },
  settingLabel: {
    color: "#fff",
    fontSize: 15,
  },
  switch: {
    width: 48,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#333",
    padding: 2,
  },
  switchActive: {
    backgroundColor: "#E50914",
  },
  switchCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#fff",
  },
  switchCircleActive: {
    transform: [{ translateX: 24 }],
  },
  // Menu Items
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#1a1a1a",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 8,
    marginBottom: 8,
  },
  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  menuItemText: {
    color: "#fff",
    fontSize: 15,
  },
  menuItemValue: {
    color: "#888",
    fontSize: 14,
    marginRight: 8,
  },
  // Danger Zone
  dangerZone: {
    borderTopWidth: 1,
    borderTopColor: "#333",
    paddingTop: 24,
  },
  dangerTitle: {
    color: "#ff4444",
  },
  dangerButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#1a1a1a",
    paddingVertical: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ff4444",
  },
  dangerButtonText: {
    color: "#ff4444",
    fontSize: 16,
    fontWeight: "600",
  },
});
