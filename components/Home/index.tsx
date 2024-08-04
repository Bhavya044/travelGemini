import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import MultiSlider from "@ptomasroos/react-native-multi-slider"; // Import MultiSlider
import { GoogleGenerativeAI } from "@google/generative-ai";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "@/types/customTypes";

const API_KEY = "AIzaSyA58smqvMT1XvaMtqN0PCkP6CL3eU0XutY";
const MODEL_NAME = "gemini-1.5-flash";

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, "Home">;

export default function Home() {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      startingPlace: "",
      destination: "",
      duration: "",
      budget: [5000, 20000], // Default values for the range slider
    },
  });

  const genAI = new GoogleGenerativeAI(API_KEY);
  const model = genAI.getGenerativeModel({
    model: MODEL_NAME,
  });

  const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 12000,
    // responseMimeType: "text/plain",
  };

  const [loading, setLoading] = useState(false);
  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      const chat = model.startChat({
        generationConfig,
        history: [],
      });
      const prompt = `
      Starting Place: ${data?.startingPlace}
      Destination: ${data?.destination}
      Duration: ${data?.duration}
      Budget: ${data?.budget} INR
      
      Please provide a day wise itinerary for visiting the famous and popular places, as well as locally famous places, including why they are famous, what local food to try. Also, recommend hotels, how to reach them, and any cautions to be taken care of. 
      
      In addition, please provide the latitude and longitude for the following:
      - Starting Place
      - Destination
      
      Please note that the budget does not include flights, trains, and hotels. The hotel and flight prices may vary, and the provided information is just an estimate. Please provide response in following json format: 
      "itinerary": {
        "days": [
          {
            "day": 1,
            "places": [
              {
                "name": "",
                "description": "",
                "latitude": "",
                "longitude": ""
              }
            ],
            "food": [
              {
                "name": "",
                "description": ""
              }
            ],
            "hotels": [
              {
                "name": "",
                "description": "",
                "price": "",
                "howToReach": "",
                "cautions": ""
              }
            ]
          }
        ]
      },
      cautions:string[],
      safety:..."
      "coordinates": {
        "startingPlace": {
          "latitude": "",
          "longitude": ""
        },
        "destination": {
          "latitude": "",
          "longitude": ""
        }
    
  }
}
  Please note to not send any extra string and only send data in this format.
      `;
      const result = await chat.sendMessage(prompt);
      const responseData = result.response.text(); // Assuming the response is in JSON format

      navigation.navigate("Detail", {
        itinerary: responseData,
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false); // End loading
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Travel Itinerary Generator</Text>
      {/* <Controller
        control={control}
        name="name"
        rules={{ required: "Name is required" }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={styles.input}
            placeholder="Name"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
          />
        )}
      />
      {errors.name && (
        <Text style={styles.errorText}>{errors.name.message}</Text>
      )} */}

      <Controller
        control={control}
        name="startingPlace"
        rules={{ required: "Starting place is required" }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={styles.input}
            placeholder="Starting Place"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
          />
        )}
      />
      {errors.startingPlace && (
        <Text style={styles.errorText}>{errors.startingPlace.message}</Text>
      )}

      <Controller
        control={control}
        name="destination"
        rules={{ required: "Destination is required" }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={styles.input}
            placeholder="Destination"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
          />
        )}
      />
      {errors.destination && (
        <Text style={styles.errorText}>{errors.destination.message}</Text>
      )}

      <Controller
        control={control}
        name="duration"
        rules={{
          required: "Duration is required",
          pattern: { value: /^[0-9]+$/, message: "Duration must be a number" },
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={styles.input}
            placeholder="Duration (in days)"
            keyboardType="numeric"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
          />
        )}
      />
      {errors.duration && (
        <Text style={styles.errorText}>{errors.duration.message}</Text>
      )}

      <View style={styles.sliderContainer}>
        <Text style={styles.sliderLabel}>
          Budget: ₹{control._formValues.budget[0]} - ₹
          {control._formValues.budget[1]}
        </Text>
        <MultiSlider
          values={control._formValues.budget}
          min={1000}
          max={100000}
          step={1000}
          onValuesChange={(values) => setValue("budget", values)}
          containerStyle={styles.slider}
          trackStyle={styles.sliderTrack}
          selectedStyle={styles.sliderSelected}
          markerStyle={styles.sliderMarker}
          pressedMarkerStyle={styles.sliderMarkerPressed}
        />
      </View>
      {errors.budget && (
        <Text style={styles.errorText}>{errors.budget.message}</Text>
      )}

      {loading ? (
        <ActivityIndicator size="large" color="#007bff" />
      ) : (
        <Button title="Submit" onPress={handleSubmit(onSubmit)} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 8,
  },
  errorText: {
    color: "red",
    marginBottom: 10,
  },
  sliderContainer: {
    marginBottom: 20,
  },
  slider: {
    height: 40,
  },
  sliderTrack: {
    backgroundColor: "#ddd",
  },
  sliderSelected: {
    backgroundColor: "#007bff",
  },
  sliderMarker: {
    backgroundColor: "#007bff",
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  sliderMarkerPressed: {
    backgroundColor: "#0056b3",
  },
  sliderLabel: {
    fontSize: 16,
    marginBottom: 10,
  },
});
