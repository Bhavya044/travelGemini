// Define types for itinerary locations, food, hotel, and transport
interface Location {
  name: string;
  description: string;
  latitude: number;
  longitude: number;
}

interface Food {
  name: string;
  description: string;
}

interface Hotel {
  name: string;
  description: string;
  price: string;
}

interface Transport {
  mode: string;
  duration: string;
}

interface ItineraryDetails {
  title: string;
  description: string;
  locations: Location[];
  food: Food[];
  hotel: Hotel;
  transport: Transport;
  cautions: string[];
}

interface Itinerary {
  [day: string]: ItineraryDetails;
}

interface ResponseData {
  itinerary: Itinerary;
  startingPlace: {
    name: string;
    latitude: number;
    longitude: number;
  };
  destination: {
    name: string;
    latitude: number;
    longitude: number;
  };
}

export function cleanJsonString(inputString: string) {
  // Remove the triple backticks at the start and end of the string
  const cleanedString = inputString.replace(/^```json\s*|\s*```$/g, "").trim(); // Remove leading and trailing whitespace

  try {
    // Parse the cleaned string into JSON
    const jsonData = JSON.parse(cleanedString);
    return jsonData;
  } catch (error) {
    console.error("Invalid JSON format:", error);
    return null;
  }
}
