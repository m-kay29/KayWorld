import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import * as SecureStore from "expo-secure-store";
import { useRouter } from "expo-router";

export default function UserMenu() {
  const [open, setOpen] = useState(false);
  const [username, setUsername] = useState("");
  const router = useRouter();

  useEffect(() => {
    getUser();
  }, []);

  const getUser = async () => {
    const storedUser = await SecureStore.getItemAsync("username");
    if (storedUser) {
      setUsername(storedUser);
    }
  };

  const logout = async () => {
    await SecureStore.deleteItemAsync("userToken");
    await SecureStore.deleteItemAsync("username");
    router.replace("/login");
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => setOpen(!open)}>
        <Text style={styles.username}>👤 {username}</Text>
      </TouchableOpacity>

      {open && (
        <View style={styles.dropdown}>
          <TouchableOpacity onPress={logout}>
            <Text style={styles.logout}>Logout</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 40,
    right: 20,
    zIndex: 100,
  },

  username: {
    color: "white",
    fontWeight: "bold",
  },

  dropdown: {
    backgroundColor: "#222",
    padding: 10,
    marginTop: 5,
    borderRadius: 6,
  },

  logout: {
    color: "red",
    fontWeight: "bold",
  },
});