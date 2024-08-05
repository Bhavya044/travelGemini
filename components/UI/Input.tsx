import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Keyboard,
  StyleSheet,
  Dimensions,
} from "react-native";

interface InputProps {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  fetchSuggestions?: (query: string) => Promise<any[]>;
  type?: "text" | "autocomplete";
}

const { height } = Dimensions.get("window");

const Input: React.FC<InputProps> = ({
  label,
  placeholder,
  value,
  onChange,
  error,
  fetchSuggestions,
  type = "text",
}) => {
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [query, setQuery] = useState(value);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleTextChange = async (text: string) => {
    setQuery(text);
    onChange(text);
    if (fetchSuggestions) {
      const suggestions = await fetchSuggestions(text);
      setSuggestions(suggestions);
      setShowSuggestions(true);
    }
  };

  const handleSelect = (item: any) => {
    setQuery(item.title);
    onChange(item.title);
    setSuggestions([]);
    setShowSuggestions(false);
    Keyboard.dismiss(); // Dismiss keyboard on selection
  };

  const handleBlur = () => {
    setShowSuggestions(false);
  };

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={styles.autocompleteWrapper}>
        <TextInput
          style={[
            styles.input,
            showSuggestions && styles.inputFocused,
            error ? styles.inputError : {}, // Apply error style if there's an error
          ]}
          placeholder={placeholder}
          onChangeText={handleTextChange}
          value={query}
          placeholderTextColor="#B0B0B0" // Light gray
          onBlur={handleBlur}
          onFocus={() => setShowSuggestions(true)}
        />
        {showSuggestions && (
          <ScrollView
            style={styles.suggestionList}
            contentContainerStyle={styles.suggestionListContainer}
            keyboardShouldPersistTaps="handled"
          >
            {suggestions.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.suggestion}
                onPress={() => handleSelect(item)}
              >
                <Text style={styles.suggestionText}>{item.title}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </View>
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: "#333333", // Dark gray
    fontWeight: "600", // Bold
  },
  autocompleteWrapper: {
    position: "relative",
  },
  suggestionList: {
    position: "absolute",
    top: 48, // Adjusted to match the height of the TextInput
    left: 0,
    right: 0,
    maxHeight: Math.min(height * 0.4, 200), // Dynamic height based on screen
    backgroundColor: "#FFFFFF", // White
    borderRadius: 10,
    borderColor: "#DDDDDD", // Light gray
    borderWidth: 1,
    zIndex: 10,
    elevation: 5,
  },
  suggestionListContainer: {
    paddingVertical: 0,
  },
  suggestion: {
    padding: 12,
    borderBottomColor: "#DDDDDD", // Light gray
    borderBottomWidth: 1,
  },
  suggestionText: {
    fontSize: 16,
    color: "#333333", // Dark gray
  },
  input: {
    height: 48,
    borderColor: "#DDDDDD", // Light gray
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 16,
    backgroundColor: "#F8F8F8", // Light gray background
    fontSize: 16,
    color: "#333333", // Dark gray
  },
  inputFocused: {
    borderColor: "#007BFF", // Blue
    borderWidth: 2,
  },
  inputError: {
    borderColor: "#FF6F61", // Coral, matches error text color
  },
  error: {
    color: "#FF6F61", // Coral
    fontSize: 14,
    marginTop: 4,
  },
});

export default Input;
