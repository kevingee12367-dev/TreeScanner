// navigation/AppNavigator.js
// -------------------------------------------------------
// WORKFLOW: "Full end-to-end app" — connects all screens
//
// This file wires all screens together using bottom tab
// navigation. Camera and Collection are the two main tabs.
// ResultScreen sits inside the Camera stack — you go there
// after a scan and return to Camera or Collection after saving.
// -------------------------------------------------------

import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Text } from "react-native";

import CameraScreen from "../screens/CameraScreen";
import ResultScreen from "../screens/ResultScreen";
import CollectionScreen from "../screens/CollectionScreen";

const Tab = createBottomTabNavigator();
const CameraStack = createNativeStackNavigator();

// Camera stack: Camera → Result (flows in sequence)
function CameraStackNavigator() {
  return (
    <CameraStack.Navigator>
      <CameraStack.Screen
        name="Camera"
        component={CameraScreen}
        options={{ title: "Scan a Tree", headerShown: false }}
      />
      <CameraStack.Screen
        name="Result"
        component={ResultScreen}
        options={{
          title: "Tree Identified",
          headerStyle: { backgroundColor: "#1D9E75" },
          headerTintColor: "#fff",
          headerTitleStyle: { fontWeight: "700" },
        }}
      />
    </CameraStack.Navigator>
  );
}

// Bottom tabs: Scanner | Collection
export default function AppNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: "#1D9E75",
        tabBarInactiveTintColor: "#999",
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: "#EEE",
          backgroundColor: "#fff",
        },
        tabBarLabelStyle: { fontSize: 12, fontWeight: "600" },
        headerStyle: { backgroundColor: "#1D9E75" },
        headerTintColor: "#fff",
        headerTitleStyle: { fontWeight: "700" },
      }}
    >
      <Tab.Screen
        name="ScannerTab"
        component={CameraStackNavigator}
        options={{
          title: "Scanner",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 20, color }}>📷</Text>
          ),
        }}
      />
      <Tab.Screen
        name="Collection"
        component={CollectionScreen}
        options={{
          title: "Collection",
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 20, color }}>🌳</Text>
          ),
        }}
      />
    </Tab.Navigator>
  );
}
