import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { registerRootComponent } from "expo";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Home from "@/components/Home";
import Detail from "@/components/Detail";
import { RootStackParamList } from "@/types/customTypes";

const App = () => {
  const Stack = createStackNavigator<RootStackParamList>();
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={Home}></Stack.Screen>
        <Stack.Screen name="Detail" component={Detail}></Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

registerRootComponent(App);
