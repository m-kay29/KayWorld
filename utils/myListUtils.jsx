import * as SecureStore from "expo-secure-store";
import { Alert } from "react-native";

const MY_LIST_STORAGE_KEY = "user_my_list";

// Add item to My List
export const addToMyList = async (item, router) => {
  try {
    // Get current list
    const storedList = await SecureStore.getItemAsync(MY_LIST_STORAGE_KEY);
    let myList = storedList ? JSON.parse(storedList) : [];

    // this checks if item already exists
    const exists = myList.some((listItem) => listItem.id === item.id);

    if (exists) {
      Alert.alert("Already in List", `${item.title} is already in your list.`);
      return;
    }

    // Add new item with timestamp
    const newItem = {
      ...item,
      dateAdded: new Date().toISOString(),
    };

    myList.push(newItem);
    await SecureStore.setItemAsync(MY_LIST_STORAGE_KEY, JSON.stringify(myList));

    Alert.alert("Added to List", `${item.title} has been added to your list.`, [
      {
        text: "View List",
        onPress: () => router.push("/my-list"),
      },
      { text: "OK", style: "cancel" },
    ]);
  } catch (error) {
    console.error("Error adding to list:", error);
    Alert.alert("Error", "Failed to add item to list");
  }
};

// Remove item from My List
export const removeFromMyList = async (itemId) => {
  try {
    const storedList = await SecureStore.getItemAsync(MY_LIST_STORAGE_KEY);
    if (storedList) {
      let myList = JSON.parse(storedList);
      myList = myList.filter((item) => item.id !== itemId);
      await SecureStore.setItemAsync(
        MY_LIST_STORAGE_KEY,
        JSON.stringify(myList),
      );
    }
  } catch (error) {
    console.error("Error removing from list:", error);
  }
};

// Check if item is in My List
export const isInMyList = async (itemId) => {
  try {
    const storedList = await SecureStore.getItemAsync(MY_LIST_STORAGE_KEY);
    if (storedList) {
      const myList = JSON.parse(storedList);
      return myList.some((item) => item.id === itemId);
    }
    return false;
  } catch (error) {
    console.error("Error checking list:", error);
    return false;
  }
};
