import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import * as SecureStore from 'expo-secure-store';
import Constants from 'expo-constants';

// SecureStore adapter for Supabase auth persistence
const ExpoSecureStoreAdapter = {
  getItem: (key: string) => {
    return SecureStore.getItemAsync(key);
  },
  setItem: (key: string, value: string) => {
    return SecureStore.setItemAsync(key, value);
  },
  removeItem: (key: string) => {
    return SecureStore.deleteItemAsync(key);
  },
};

// Get environment variables with fallbacks
const supabaseUrl = Constants.expoConfig?.extra?.supabaseUrl || 
  process.env.EXPO_PUBLIC_SUPABASE_URL || 
  'https://etwwfjctkahkhltzvlvx.supabase.co';

const supabaseAnonKey = Constants.expoConfig?.extra?.supabaseAnonKey || 
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV0d3dmamN0a2Foa2hsdHp2bHZ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA5MzMxOTksImV4cCI6MjA1NjUwOTE5OX0.xM9XzWVV8GYx4m1RHQ3Z7BJdOIZq0vKr7O3LQvXqwAA';

// Initialize Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: ExpoSecureStoreAdapter,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Auth helper functions
export const signUp = async (email: string, password: string, userData?: object) => {
  return supabase.auth.signUp({
    email,
    password,
    options: {
      data: userData,
    },
  });
};

export const signIn = async (email: string, password: string) => {
  return supabase.auth.signInWithPassword({
    email,
    password,
  });
};

export const signOut = async () => {
  return supabase.auth.signOut();
};

export const resetPassword = async (email: string) => {
  return supabase.auth.resetPasswordForEmail(email, {
    redirectTo: 'dresscode://reset-password',
  });
};

export const getCurrentUser = async () => {
  return supabase.auth.getUser();
};

export const getSession = async () => {
  return supabase.auth.getSession();
};

// Social auth helpers
export const signInWithGoogle = async () => {
  return supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: 'dresscode://auth/callback',
    },
  });
};

export const signInWithApple = async () => {
  return supabase.auth.signInWithOAuth({
    provider: 'apple',
    options: {
      redirectTo: 'dresscode://auth/callback',
    },
  });
}; 