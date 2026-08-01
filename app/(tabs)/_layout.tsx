import { Chewy_400Regular, useFonts } from '@expo-google-fonts/chewy';
import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { ScoreProvider } from '../../contexts/ScoreContext';

export default function TabLayout() {
  const [fontsLoaded] = useFonts({
    Chewy_400Regular,
  });

  if (!fontsLoaded) {
    return (
      <View
        style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#222' }}
      >
        <ActivityIndicator size="large" color="#FF4B4B" />
      </View>
    );
  }

  return (
    <ScoreProvider>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: '#FF4B4B',
          headerShown: false,
          tabBarStyle: {
            display: 'none',
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Início',
            tabBarIcon: ({ color }) => <Ionicons name="home" size={22} color={color} />,
          }}
        />

        <Tabs.Screen
          name="two"
          options={{
            href: null,
            tabBarStyle: { display: 'none' },
          }}
        />

        <Tabs.Screen
          name="onboarding"
          options={{
            title: 'Jogos',
            tabBarIcon: ({ color }) => <Ionicons name="game-controller" size={22} color={color} />,
          }}
        />
      </Tabs>
    </ScoreProvider>
  );
}
