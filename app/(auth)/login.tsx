import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Dimensions,
  ActivityIndicator,
  Alert
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useRouter } from 'expo-router';
import { useAuth } from '@/lib/auth';
import { supabase, signInWithGoogle, signInWithApple } from '@/lib/supabase';
import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri } from 'expo-auth-session';
import * as Linking from 'expo-linking';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '@/app/styles/login.styles';
import { InfoModal } from '@/app/components/profile/InfoModal';
import { TermsOfServiceContent } from '@/app/components/profile/TermsOfServiceContent';
import { PrivacyPolicyContent } from '@/app/components/profile/PrivacyPolicyContent';
import { hasPremiumAccess } from '@/lib/premiumAccess';

const { width, height } = Dimensions.get('window');

const redirectUrl = makeRedirectUri({
  scheme: 'dresscode',
  path: 'auth/callback',
});

const verifyAge = () => {
  return new Promise((resolve, reject) => {
    Alert.alert(
      "Age Verification",
      "Please confirm that you are at least 13 years old to use Dresscode.",
      [
        { text: "No", style: "cancel", onPress: () => reject(new Error("User is under 13")) },
        { text: "Yes", onPress: () => resolve(true) }
      ],
      { cancelable: false }
    );
  });
};


// App brand colors
const BRAND_GOLD = '#cca702';

// Enable WebBrowser redirect handling
WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const router = useRouter();
  const { user, setUser } = useAuth();
  const [socialLoading, setSocialLoading] = useState<string | null>(null);
  const [initialCheckDone, setInitialCheckDone] = useState(false);
  const [termsVisible, setTermsVisible] = useState(false);
  const [privacyVisible, setPrivacyVisible] = useState(false);

  // Define a shared deep link handler to parse tokens and call checkUserProfile
  const handleDeepLink = async (event: { url: string }) => {
    console.log('Deep link received:', event.url);
    // If URL has a fragment after '#' (contains tokens)
    const parts = event.url.split('#');
    if (parts.length > 1) {
      const fragment = parts[1];
      const params = new URLSearchParams(fragment);
      const access_token = params.get('access_token');
      const refresh_token = params.get('refresh_token');
      if (access_token && refresh_token) {
        console.log('Parsed tokens:', { access_token, refresh_token });
        try {
          const { data, error } = await supabase.auth.setSession({
            access_token,
            refresh_token,
          });
          if (error) {
            console.error('Error setting session:', error);
          } else {
            console.log('Session set successfully:', data);
          }
        } catch (err) {
          console.error('Exception setting session:', err);
        }
      }
    }
    // Continue to check user profile
    await checkUserProfile();
  };

  // Check for an existing session on load
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Error checking session:', error);
          setInitialCheckDone(true);
          return;
        }
        if (data.session) {
          console.log('Existing session found');
          await checkUserProfile();
        } else {
          console.log('No existing session');
          setInitialCheckDone(true);
        }
      } catch (error) {
        console.error('Unexpected error checking session:', error);
        setInitialCheckDone(true);
      }
    };
    checkSession();
  }, []);

  // Set up deep link event listener
  useEffect(() => {
    const subscription = Linking.addEventListener('url', handleDeepLink);
    return () => {
      subscription.remove();
    };
  }, []);

  // Check initial URL in case the app was launched with a deep link
  useEffect(() => {
    async function checkInitialURL() {
      const initialUrl = await Linking.getInitialURL();
      if (initialUrl) {
        console.log('Initial deep link URL:', initialUrl);
        await handleDeepLink({ url: initialUrl });
      }
    }
    checkInitialURL();
  }, []);

  // Check if user has a profile and redirect accordingly
  const checkUserProfile = async () => {
    try {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError) {
        console.error('Error getting user:', userError);
        setInitialCheckDone(true);
        return;
      }
      console.log('User Session:', userData);
      if (userData.user) {
        // Verify age before proceeding
        try {
          await verifyAge();
        } catch (err) {
          Alert.alert("Age Restriction", "You must be at least 13 years old to use Dresscode.");
          await supabase.auth.signOut();
          setInitialCheckDone(true);
          return;
        }
        
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', userData.user.id)
          .single();
        if (profileError) {
          if (profileError.code === 'PGRST116') {
            console.log('No profile found, redirecting to profile setup');
            router.replace('/(auth)/profile-setup');
          } else {
            console.error('Error checking profile:', profileError);
            setInitialCheckDone(true);
          }
          return;
        }
  
        // Merge the profile data into the user object:
        const updatedUser = {
          ...userData.user,
          subscription_plan: profileData.subscription_plan,
          subscription_status: profileData.subscription_status,
          subscription_expires_at: profileData.subscription_expires_at,
        };
  
        // Update the global auth state with the updated user object.
        setUser(updatedUser);
  
        // Optionally log the premium access status:
        const isPremium = hasPremiumAccess(updatedUser);
        console.log('User premium access:', isPremium);
  
        console.log('Profile found, redirecting to main app');
        router.replace('/(tabs)');
  
      } else {
        setInitialCheckDone(true);
      }
    } catch (error) {
      console.error('Error checking user profile:', error);
      setInitialCheckDone(true);
    }
  };
  

  // Handle social sign-in flows
  const handleSocialSignIn = async (provider: 'google' | 'apple') => {
    try {
      setSocialLoading(provider);
      console.log('Starting sign-in with', provider);
      console.log('Redirect URL:', redirectUrl);
      if (provider === 'google') {
        const { data, error } = await signInWithGoogle();
        if (error) {
          console.error('Google sign-in error:', error);
          throw error;
        }
        if (data?.url) {
          console.log('Opening browser with URL:', data.url);
          const result = await WebBrowser.openAuthSessionAsync(
            data.url,
            redirectUrl
          );
          console.log('Browser result:', result);
          if (result.type === 'success' && result.url) {
            await handleDeepLink({ url: result.url });
          } else if (result.type === 'success') {
            await checkUserProfile();
          }
        }
      } else if (provider === 'apple') {
        const { data, error } = await signInWithApple();
        if (error) {
          console.error('Apple sign-in error:', error);
          throw error;
        }
        if (data?.url) {
          console.log('Opening browser with URL:', data.url);
          const result = await WebBrowser.openAuthSessionAsync(
            data.url,
            redirectUrl
          );
          console.log('Browser result:', result);
          if (result.type === 'success' && result.url) {
            await handleDeepLink({ url: result.url });
          } else if (result.type === 'success') {
            await checkUserProfile();
          }
        }
      }
    } catch (error: any) {
      console.error(`Error signing in with ${provider}:`, error);
      if (error.message && error.message.includes('provider is not enabled')) {
        Alert.alert(
          "OAuth Configuration Issue",
          `There's still an issue with the ${provider} configuration. Would you like to use demo mode instead?`,
          [
            {
              text: "Use Demo Mode",
              onPress: () => {
                global.demoMode = true;
                router.replace('/(tabs)');
              }
            },
            {
              text: "Cancel",
              style: "cancel"
            }
          ]
        );
      } else {
        Alert.alert(
          'Authentication Error',
          `Failed to sign in with ${provider}. ${error.message || 'Please try again.'}`
        );
      }
    } finally {
      setSocialLoading(null);
    }
  };

  // Skip login for demo purposes
  const handleSkip = () => {
    global.demoMode = true;
    router.replace('/(tabs)');
  };

  // Show loading screen while checking for existing session
  if (!initialCheckDone && !socialLoading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color={BRAND_GOLD} />
        <Text style={styles.loadingText}>Checking login status...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Background Image */}
      <Image
        source={require('../../assets/images/cover-dresscode-3.png')}
        style={styles.backgroundImage}
      />
      {/* Gradient Overlay */}
      <LinearGradient
        colors={['rgba(0,0,0,0.1)', 'rgba(0,0,0,0.2)']}
        style={styles.gradient}
      />
      {/* Content */}
      <View style={styles.content}>
        {/* Logo/App Name */}
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>Dresscode AI</Text>
          <Text style={styles.tagline}>Your AI Fashion Assistant</Text>
        </View>
        {/* Auth Options */}
        <BlurView intensity={15} tint="light" style={styles.authContainer}>
          <Text style={styles.subtitleText}>Sign in to track your style journey</Text>
          {/* Social Sign In Buttons */}
          <View style={styles.socialButtonsContainer}>
            <TouchableOpacity
              style={[styles.socialButton, styles.googleButton]}
              onPress={() => handleSocialSignIn('google')}
              disabled={!!socialLoading}
            >
              {socialLoading === 'google' ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <>
                  <View style={styles.googleIconContainer}>
                    <Text style={styles.googleIconText}>G</Text>
                  </View>
                  <Text style={styles.socialButtonText}>Continue with Google</Text>
                </>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.socialButton, styles.appleButton]}
              onPress={() => handleSocialSignIn('apple')}
              disabled={!!socialLoading}
            >
              {socialLoading === 'apple' ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <>
                  <Ionicons name="logo-apple" size={22} color="#fff" style={styles.appleIcon} />
                  <Text style={styles.socialButtonText}>Continue with Apple</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
          {/* Privacy Policy */}
          <Text style={styles.privacyText}>
            By continuing, you agree to our{' '}
            <Text 
              style={[styles.privacyText, styles.link]}
              onPress={() => setTermsVisible(true)}
            >
              Terms of Service
            </Text>
            {' '}and{' '}
            <Text
              style={[styles.privacyText, styles.link]} 
              onPress={() => setPrivacyVisible(true)}
            >
              Privacy Policy
            </Text>
          </Text>
        </BlurView>
      </View>
      {/* Terms of Service Modal */}
      <InfoModal
        visible={termsVisible}
        onClose={() => setTermsVisible(false)}
        title="Terms of Service"
        content={<TermsOfServiceContent />}
      />
      {/* Privacy Policy Modal */}
      <InfoModal
        visible={privacyVisible}
        onClose={() => setPrivacyVisible(false)}
        title="Privacy Policy"
        content={<PrivacyPolicyContent />}
      />
    </View>
  );
}
