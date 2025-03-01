import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  
  // Golden color for active tabs
  const activeColor = '#cca702'; // b39200 cca702 FFD700
  // Black color for inactive tabs
  const inactiveColor = '#000000';

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: activeColor,
        tabBarInactiveTintColor: inactiveColor,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: 'absolute',
            backgroundColor: 'rgba(255, 255, 255, 0.85)', // Slightly less transparent
            paddingTop: 10, // More padding at the top
            paddingBottom: 2, // Less padding at the bottom
            borderTopLeftRadius: 25,
            borderTopRightRadius: 25,
            borderTopWidth: 0, // Remove the default top border
            shadowColor: '#000',
            shadowOffset: { width: 0, height: -3 },
            shadowOpacity: 0.1,
            shadowRadius: 5,
            marginBottom: -1, // Fix any gap that might appear
            overflow: 'hidden',
          },
          default: {
            backgroundColor: 'rgba(255, 255, 255, 0.85)', // Slightly less transparent
            paddingTop: 10, // More padding at the top
            paddingBottom: 2, // Less padding at the bottom
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            borderTopWidth: 0, // Remove the default top border
            elevation: 8, // Add elevation for Android shadow
            marginBottom: -1, // Fix any gap that might appear
          },
        }),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Scan',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="camera.viewfinder" color={color} />,
        }}
      />
      <Tabs.Screen
        name="progress"
        options={{
          title: 'Looks',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="tshirt" color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="star.fill" color={color} />,
        }}
      />
    </Tabs>
  );
}
