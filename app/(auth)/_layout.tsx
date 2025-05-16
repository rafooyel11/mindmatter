import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }}/>
      <Stack.Screen name="quiz" options={{ headerShown: false, title: "Mental Health Assessment", presentation: "card" }} />
      <Stack.Screen name="location" options={{ headerShown: false, title: "GPS", presentation: "card" }} />
      <Stack.Screen name="edit_profile" options={{ headerShown: false, title: "Edit Profile", presentation: "card" }} />
      <Stack.Screen name="users" options={{ headerShown: false, title: "Friends", presentation: "card" }} />
    </Stack>
  )
}