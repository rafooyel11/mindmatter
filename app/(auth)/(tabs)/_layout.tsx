import { View, Text } from 'react-native'
import React from 'react'
import { Tabs, Stack } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'


export default function AuthLayout() {

  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: '#699992', headerShown: false, }}>
      <Tabs.Screen name="home" options={{
        title: 'Home',
        tabBarIcon: ({ color, focused }: { color: string; focused: boolean }) => (
          <Ionicons name={focused ? 'home' : 'home-outline'} size={24} color={color} />
        )
      }}
      />
      <Tabs.Screen name="message" options={{
        title: 'Messages',
        tabBarIcon: ({ color, focused }: { color: string; focused: boolean }) => (
          <Ionicons name={focused ? 'chatbubble' : 'chatbubble-outline'} size={24} color={color} />
        )
      }}
      />
      <Tabs.Screen name="notification" options={{
        title: 'Notifications',
        tabBarIcon: ({ color, focused }: { color: string; focused: boolean }) => (
          <Ionicons name={focused ? 'notifications' : 'notifications-outline'} size={24} color={color} />
        )
      }}
      />
      <Tabs.Screen name="profile" options={{
        title: 'Profile',
        tabBarIcon: ({ color, focused }: { color: string; focused: boolean }) => (
          <Ionicons name={focused ? 'person' : 'person-outline'} size={24} color={color} />
        )
      }}
      />
    </Tabs>
  )

}