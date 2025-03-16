import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  const activeColor = '#cca702';
  const inactiveColor = '#000000';

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: activeColor,
        tabBarInactiveTintColor: inactiveColor,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: Platform.select({
          ios: {
            position: 'absolute',
            backgroundColor: '#ffffff',
            paddingTop: 10,
            paddingBottom: 2,
            borderTopLeftRadius: 25,
            borderTopRightRadius: 25,
            borderTopWidth: 0,
            // Thin drop shadow outwardly
            shadowColor: '#cca702',
            shadowOffset: { width: 0, height: -1 },
            shadowOpacity: 0.2,
            shadowRadius: 5,
            marginBottom: -1,
            overflow: 'visible', // allow shadow to extend outside
          },
          default: {
            backgroundColor: '#ffffff',
            paddingTop: 10,
            paddingBottom: 2,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            borderTopWidth: 0,
            elevation: 2, // minimal elevation for a thin shadow on Android
            marginBottom: -1,
          },
        }),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Scan',
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="camera.viewfinder" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="progress"
        options={{
          title: 'Looks',
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="tshirt" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="star.fill" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
