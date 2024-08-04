import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { RouteProp, useRoute } from "@react-navigation/native"; // Import useRoute
import { RootStackParamList } from "@/types/customTypes";

type DetailRouteProp = RouteProp<RootStackParamList, "Detail">;

export default function Detail() {
  const route = useRoute<DetailRouteProp>(); // Get route object
  const { itinerary } = route.params; // Get itinerary from params
  console.log("itenary", itinerary);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Itinerary Details</Text>
      <Text style={styles.itinerary}>{itinerary}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flexGrow: 1, // Ensure content takes up available space
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  itinerary: {
    fontSize: 16,
    lineHeight: 24,
    color: "#333",
  },
});
