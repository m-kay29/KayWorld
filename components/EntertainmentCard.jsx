import { TouchableOpacity, Text, StyleSheet } from "react-native";

export default function EntertainmentCard({ title, onPress }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#03DAC6",
    padding: 20,
    margin: 10,
    width: 250,
    borderRadius: 10,
  },
  text: {
    fontSize: 18,
  },
});