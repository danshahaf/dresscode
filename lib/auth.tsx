import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { supabase } from './supabase';
import { Text } from 'react-native';
import { Session, User } from '@supabase/supabase-js';
import { useRouter, useSegments } from 'expo-router';

// Define the auth context type
type AuthContextType = {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
};

// Create the auth context
const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  loading: true,
  signOut: async () => {},
});

// Auth provider props
interface AuthProviderProps {
  children: ReactNode;
}

// Add this at the top level, outside the component
declare global {
  var demoMode: boolean;
}

// Create the auth provider component
export function AuthProvider({ children }: AuthProviderProps) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const segments = useSegments();

  // Handle routing based on auth state
  useEffect(() => {
    if (loading) return;

    console.log('Current navigation segment:', segments[0]);
    console.log('Session exists:', !!session);
    console.log('Demo mode:', !!global.demoMode);

    // Check for demo mode using global variable
    if (global.demoMode) {
      console.log('In demo mode, navigating to tabs');
      // If in demo mode, make sure we're in the tabs
      if (segments[0] !== '(tabs)') {
        router.replace('/(tabs)');
      }
      return;
    }
    
    const inAuthGroup = segments[0] === '(auth)';
    
    if (!session && !inAuthGroup) {
      console.log('No session and not in auth group, redirecting to login');
      // If not logged in and not in auth group, redirect to login
      router.replace('/(auth)/login');
    } else if (session && inAuthGroup) {
      console.log('Session exists and in auth group, redirecting to tabs');
      // If logged in and in auth group, redirect to main app
      router.replace('/(tabs)');
    }
  }, [session, segments, loading]);

  // Set up auth state listener
  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Sign out function
  const signOut = async () => {
    await supabase.auth.signOut();
  };

  // Provide auth context
  return (
    <AuthContext.Provider value={{ session, user, loading, signOut }}>
      {children}
      {/* <Text>AuthProvider Test</Text> */}
    </AuthContext.Provider>
  );
}

// Custom hook to use auth context
export function useAuth() {
  return useContext(AuthContext);
} 