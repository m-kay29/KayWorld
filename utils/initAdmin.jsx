import * as SecureStore from "expo-secure-store";

export const initializeAdmin = async () => {
  try {
    const adminData = await SecureStore.getItemAsync("adminAccount");
    if (!adminData) {
      const admin = {
        username: "admin",
        password: "@SirKay007",
      };
      await SecureStore.setItemAsync("adminAccount", JSON.stringify(admin));
      console.log("Admin account initialized");
    }
  } catch (error) {
    console.log("Error initializing admin account:", error);
  }
};
