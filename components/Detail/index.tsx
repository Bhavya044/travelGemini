import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, Dimensions } from "react-native";
import { useRoute, RouteProp } from "@react-navigation/native";
import MapView, { Marker } from "react-native-maps";
import { RootStackParamList } from "@/types/customTypes";
import { cleanJsonString } from "./detail.config";

// Define types for itinerary and coordinates
interface Location {
  latitude: number;
  longitude: number;
}

interface ItineraryDay {
  title: string;
  description: string;
  locations: Location[];
  food: { name: string; description: string }[];
  hotel: { name: string; description: string; price: string };
  transport: { mode: string; duration: string };
  cautions: string[];
}

interface Itinerary {
  days: ItineraryDay[];
}

interface Coordinates {
  startingPlace: Location;
  destination: Location;
}

interface ResponseData {
  itinerary: Itinerary;
  coordinates: Coordinates;
  safety: string;
  cautions: string[];
}

type DetailRouteProp = RouteProp<RootStackParamList, "Detail">;

export default function Detail() {
  const route = useRoute<DetailRouteProp>();
  const { itinerary } = route.params as any;

  const [response, setResponse] = useState<ResponseData | null>(null);

  useEffect(() => {
    const itineraryJson = cleanJsonString(itinerary);
    console.log("clean string===================", itineraryJson);
    setResponse(itineraryJson);
  }, [itinerary]);

  if (!response) {
    return <Text>Loading...</Text>;
  }

  // Compute bounding box if needed (optional)
  // const getBoundingRegion = (locations: Location[]) => {
  //   if (locations.length > 0) {
  //     const latitudes = locations.map((loc) => loc.latitude);
  //     const longitudes = locations.map((loc) => loc.longitude);
  //     const latitudeDelta =
  //       Math.max(...latitudes) - Math.min(...latitudes) + 0.05;
  //     const longitudeDelta =
  //       Math.max(...longitudes) - Math.min(...longitudes) + 0.05;
  //     return {
  //       latitude: (Math.max(...latitudes) + Math.min(...latitudes)) / 2,
  //       longitude: (Math.max(...longitudes) + Math.min(...longitudes)) / 2,
  //       latitudeDelta,
  //       longitudeDelta,
  //     };
  //   }
  //   return {
  //     latitude: 30.7333, // Default to Chandigarh
  //     longitude: 76.7794,
  //     latitudeDelta: 0.05,
  //     longitudeDelta: 0.05,
  //   };
  // };

  // const allLocations = response.itinerary.days
  //   .flatMap((day) => day.locations)
  //   .map((loc) => ({
  //     latitude: loc.latitude,
  //     longitude: loc.longitude,
  //   }));

  // const initialRegion = getBoundingRegion(allLocations);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Itinerary Details</Text>
      {/* Render itinerary details */}
      {response?.itinerary?.days?.map((day, index) => (
        <View key={index} style={styles.dayContainer}>
          <Text style={styles.dayTitle}>{day?.title}</Text>
          <Text>{JSON.stringify(day)} </Text>
          {/* <Text style={styles.dayDescription}>{day?.description}</Text> */}
          {/* {day.locations.map((location, locIndex) => (
            <Text key={locIndex}>
              Location {locIndex + 1}: Latitude {location.latitude}, Longitude{" "}
              {location.longitude}
            </Text>
          ))}
          {day.food.map((food, foodIndex) => (
            <Text key={foodIndex}>
              {food.name}: {food.description}
            </Text>
          ))}
          <Text>
            {day.hotel.name}: {day.hotel.description} ({day.hotel.price})
          </Text> */}
          {/* <Text>
            Transport: {day.transport.mode}, {day.transport.duration}
          </Text> */}
          {/* {day.cautions.map((caution, index) => (
            <Text key={index}>Caution: {caution}</Text>
          ))} */}
        </View>
      ))}
      {/* <View style={styles.mapContainer}>
        <Text style={styles.mapTitle}>Map Overview</Text>
        <MapView
          style={styles.map}
          initialRegion={initialRegion}
          showsUserLocation={true}
        >
          {allLocations.map((loc, index) => (
            <Marker
              key={index}
              coordinate={loc}
              title={`Location ${index + 1}`}
              pinColor="blue"
            />
          ))}
        </MapView>
      </View> */}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flexGrow: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  dayContainer: {
    marginBottom: 20,
  },
  dayTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
  },
  dayDescription: {
    fontSize: 16,
    lineHeight: 24,
    color: "#333",
  },
  mapContainer: {
    marginTop: 20,
    height: 300, // Adjust height as needed
    borderRadius: 10,
    overflow: "hidden",
  },
  mapTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  map: {
    width: Dimensions.get("window").width - 40, // Adjust width as needed
    height: "100%",
  },
});
