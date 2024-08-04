import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { registerRootComponent } from "expo";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Home from "@/components/Home";
import Detail from "@/components/Detail";

const App = () => {
  const Stack = createStackNavigator();
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
