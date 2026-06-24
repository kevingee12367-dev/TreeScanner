// App.js
// -------------------------------------------------------
// WORKFLOW: "Open the app" node
//
// This is the first file that runs when the app launches.
// It sets up the navigation container and renders the
// AppNavigator which connects all screens together.
// Think of this as the building that holds everything.
// -------------------------------------------------------

import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import AppNavigator from "./navigation/AppNavigator";

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <AppNavigator />
    </NavigationContainer>
  );
}
