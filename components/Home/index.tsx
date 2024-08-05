import React, { useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "@/types/customTypes";
import Input from "../UI/Input";
import MultiSlider from "@ptomasroos/react-native-multi-slider";

const GEMINI_API_KEY = "AIzaSyA58smqvMT1XvaMtqN0PCkP6CL3eU0XutY";
const OPENCAGE_API_KEY = "4b4d4acee27446e5bcfa2761e6587c0e"; // Replace with your OpenCage API key
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
      startingPlace: "",
      destination: "",
      duration: "",
      budget: [5000, 20000], // Default values for the range slider
    },
  });

  const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({
    model: MODEL_NAME,
  });

  const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 12000,
  };

  const [loading, setLoading] = useState(false);

  const fetchPlaceSuggestions = async (query: string) => {
    if (query.length < 3) return [];
    const response = await fetch(
      `https://api.opencagedata.com/geocode/v1/json?q=${query}&key=${OPENCAGE_API_KEY}`
    );
    const data = await response.json();
    return data.results.map((result: any) => ({
      id: result.formatted,
      title: result.formatted,
    }));
  };

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
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Travel Itinerary Generator</Text>

      <Controller
        control={control}
        name="startingPlace"
        rules={{ required: "Starting place is required" }}
        render={({ field: { onChange, value } }) => (
          <Input
            label="Starting Place"
            placeholder="Enter starting place"
            value={value}
            onChange={onChange}
            error={errors.startingPlace?.message}
            fetchSuggestions={fetchPlaceSuggestions}
            type="autocomplete"
          />
        )}
      />

      <Controller
        control={control}
        name="destination"
        rules={{ required: "Destination is required" }}
        render={({ field: { onChange, value } }) => (
          <Input
            label="Destination"
            placeholder="Enter destination"
            value={value}
            onChange={onChange}
            error={errors.destination?.message}
            fetchSuggestions={fetchPlaceSuggestions}
            type="autocomplete"
          />
        )}
      />

      <Controller
        control={control}
        name="duration"
        rules={{
          required: "Duration is required",
          pattern: { value: /^[0-9]+$/, message: "Duration must be a number" },
        }}
        render={({ field: { onChange, value } }) => (
          <View style={styles.inputContainer}>
            <Input
              label="Duration (in days)"
              placeholder="Enter duration"
              value={value}
              onChange={onChange}
              error={errors.duration?.message}
            />
          </View>
        )}
      />

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
        <ActivityIndicator
          size="large"
          color="#B3E5FC"
          style={styles.loading}
        />
      ) : (
        <TouchableOpacity
          style={styles.button}
          onPress={handleSubmit(onSubmit)}
        >
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: "#F7FBFF", // Light gray gradient
  },
  title: {
    fontSize: 30,
    fontWeight: "700",
    marginBottom: 24,
    color: "#333",
    textAlign: "center",
    fontFamily: "Montserrat", // Modern font
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: "#444", // Darker gray
  },
  sliderContainer: {
    marginVertical: 20,
    backgroundColor: "#FFFFFF", // White for clean look
    padding: 20,
    borderRadius: 12, // Increased border radius
    borderColor: "#DDDDDD", // Light border color
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15, // Subtle shadow
    shadowRadius: 10,
    elevation: 5,
  },
  sliderLabel: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
    color: "#333",
    // fontFamily: "Montserrat",
  },
  slider: {
    marginVertical: 10,
  },
  sliderTrack: {
    height: 10,
    backgroundColor: "#E0E0E0", // Light gray track
    borderRadius: 5,
  },
  sliderSelected: {
    backgroundColor: "#4CAF50", // Vibrant green for selected track
  },
  sliderMarker: {
    height: 30,
    width: 30,
    backgroundColor: "#4CAF50", // Vibrant green for marker
    borderRadius: 15,
    borderColor: "#FFFFFF", // White border for contrast
    borderWidth: 2,
  },
  sliderMarkerPressed: {
    height: 34,
    width: 34,
    backgroundColor: "#388E3C", // Darker green for pressed state
    borderColor: "#FFFFFF",
    borderWidth: 2,
  },
  button: {
    backgroundColor: "#4CAF50", // Vibrant green button
    paddingVertical: 16,
    paddingHorizontal: 30,
    borderRadius: 12, // More rounded button
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonText: {
    color: "#FFFFFF", // White text
    fontSize: 20,
    fontWeight: "600",
    fontFamily: "Montserrat",
  },
  loading: {
    marginVertical: 20,
  },
  errorText: {
    color: "#FF6F6F", // Error color
    fontSize: 14,
    marginTop: 5,
  },
});
