import React from 'react';
import { Stack } from 'expo-router';
import { AuthProvider } from '@/lib/auth';
import { StripeProvider } from '@stripe/stripe-react-native';

export default function RootLayout() {
  return (
    <StripeProvider
      publishableKey={process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY || ''}
      merchantIdentifier="merchant.com.dresscode" // Replace with your Apple Merchant ID
      urlScheme="dresscode" // Your app's scheme
    >
      <AuthProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="index" />
        </Stack>
      </AuthProvider>
    </StripeProvider>
  );
}
