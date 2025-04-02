import React from 'react';
import { Stack } from 'expo-router';
import { AuthProvider } from '@/lib/auth';
import { StripeProvider } from '@stripe/stripe-react-native';

export default function RootLayout() {
  
  const publishableKey = process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY || '';

  return (
    <StripeProvider
      publishableKey={publishableKey}
      merchantIdentifier="merchant.com.dresscode"
      urlScheme="dresscode"
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

