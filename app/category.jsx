import { View, Text, StyleSheet } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import EntertainmentCard from "../components/EntertainmentCard";

export default function Category() {
  const { category } = useLocalSearchParams();
  const router = useRouter();

  const items = ["Item 1", "Item 2", "Item 3", "Item 4"];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{category}</Text>

      {items.map((item, index) => (
        <EntertainmentCard
          key={index}
          title={item}
          onPress={() =>
            router.push({
              pathname: "/details",
              params: { name: item },
            })
          }
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    margin: 20,
    fontWeight: "bold",
  },
});