import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Dimensions,
  ActivityIndicator,
  Alert
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Link, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { supabase, signIn, signUp, signInWithGoogle, signInWithApple } from '@/lib/supabase';
import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri } from 'expo-auth-session';
import * as Linking from 'expo-linking';

const { width, height } = Dimensions.get('window');
const appleRedirectUrl = 'https://etwwfjctkahkhltzvlvx.supabase.co/auth/v1/callback';

// Enable WebBrowser redirect handling
WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<string | null>(null);
  
  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  
  // Check for existing session on load
  useEffect(() => {
    const checkSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (data.session) {
        // User is already logged in, redirect to main app
        router.replace('/(tabs)');
      }
    };
    
    checkSession();
  }, []);

  // Set up deep link handling for OAuth
  useEffect(() => {
    const handleDeepLink = (event: { url: string }) => {
      // Handle the deep link
      if (event.url.includes('auth/callback')) {
        // The URL contains our auth callback
        // Supabase Auth will automatically handle the token exchange
        checkUserProfile();
      }
    };

    // Add event listener for deep links
    const subscription = Linking.addEventListener('url', handleDeepLink);

    return () => {
      subscription.remove();
    };
  }, []);
  
  // Check if user has a profile and redirect accordingly
  const checkUserProfile = async () => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      
      if (userData.user) {
        const { data: profileData, error: profileError } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('user_id', userData.user.id)
          .single();
          
        if (profileError && profileError.code !== 'PGRST116') {
          throw profileError;
        }
        
        // If no profile exists, redirect to profile setup
        if (!profileData) {
          router.replace('/(auth)/profile-setup');
          return;
        }
        
        // If profile exists, go to main app
        router.replace('/(tabs)');
      }
    } catch (error) {
      console.error('Error checking user profile:', error);
    }
  };
  
  // Handle authentication
  const handleAuth = async () => {
    // Validate form
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter your email');
      return;
    }
    
    if (!password.trim()) {
      Alert.alert('Error', 'Please enter your password');
      return;
    }
    
    if (!isLogin && !name.trim()) {
      Alert.alert('Error', 'Please enter your name');
      return;
    }
    
    try {
      setIsLoading(true);
      
      if (isLogin) {
        // Sign in
        const { data, error } = await signIn(email, password);
        
        if (error) throw error;
        
        // Check if user has a profile
        const { data: profileData, error: profileError } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('user_id', data.user?.id)
          .single();
          
        if (profileError && profileError.code !== 'PGRST116') {
          // PGRST116 is "no rows returned" error, which is expected if no profile exists
          throw profileError;
        }
        
        // If no profile exists, redirect to profile setup
        if (!profileData) {
          router.replace('/(auth)/profile-setup');
          return;
        }
        
        // If profile exists, go to main app
        router.replace('/(tabs)');
      } else {
        // Sign up
        const { data, error } = await signUp(email, password, { full_name: name });
        
        if (error) throw error;
        
        // If sign up successful but needs email confirmation
        if (data.user && data.session === null) {
          Alert.alert(
            'Verification Email Sent',
            'Please check your email to verify your account before logging in.'
          );
          setIsLogin(true); // Switch to login view
          setPassword('');
          return;
        }
        
        // If sign up successful and session created, go to profile setup
        if (data.user && data.session) {
          router.replace('/(auth)/profile-setup');
          return;
        }
      }
      
    } catch (error: any) {
      Alert.alert(
        'Authentication Error',
        error.message || 'There was a problem authenticating. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle social sign-in
  const handleSocialSignIn = async (provider: 'google' | 'apple') => {
    try {
      setSocialLoading(provider);
      
      // Get the redirect URL for deep linking
      const redirectUrl = makeRedirectUri({
        scheme: 'dresscode',
        path: 'auth/callback',
      });
      
      console.log('Redirect URL:', redirectUrl);
      
      // Start the OAuth flow
      if (provider === 'google') {
        const { data, error } = await signInWithGoogle();
        
        if (error) {
          console.error('Google sign-in error:', error);
          throw error;
        }
        
        // Open the browser for authentication
        if (data?.url) {
          console.log('Opening browser with URL:', data.url);
          const result = await WebBrowser.openAuthSessionAsync(
            data.url,
            redirectUrl
          );
          
          console.log('Browser result:', result);
          
          if (result.type === 'success') {
            // The user was redirected back to our app
            // Supabase Auth will automatically handle the token exchange
            await checkUserProfile();
          }
        }
      } else if (provider === 'apple') {
        const { data, error } = await signInWithApple();
        
        if (error) {
          console.error('Apple sign-in error:', error);
          throw error;
        }
        
        // Open the browser for authentication
        if (data?.url) {
          console.log('Opening browser with URL:', data.url);
          const result = await WebBrowser.openAuthSessionAsync(data.url, appleRedirectUrl);
          
          console.log('Browser result:', result);
          
          if (result.type === 'success') {
            // The user was redirected back to our app
            // Supabase Auth will automatically handle the token exchange
            await checkUserProfile();
          }
        }
      }
      
    } catch (error: any) {
      console.error(`Error signing in with ${provider}:`, error);
      
      // If provider is not enabled, offer demo mode
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
  
  // Toggle between login and signup
  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    // Clear form when switching modes
    setPassword('');
  };
  
  // Skip login for demo purposes
  const handleSkip = () => {
    // Bypass authentication and go directly to main app
    global.demoMode = true;
    router.replace('/(tabs)');
  };
  
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView style={styles.container} contentContainerStyle={{ flexGrow: 1 }}>
        {/* Background Image */}
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070' }}
          style={styles.backgroundImage}
        />
        
        {/* Gradient Overlay */}
        <LinearGradient
          colors={['rgba(0,0,0,0.1)', 'rgba(0,0,0,0.7)']}
          style={styles.gradient}
        />
        
        {/* Content */}
        <View style={styles.content}>
          {/* Logo/App Name */}
          <View style={styles.logoContainer}>
            <Text style={styles.logoText}>STYLIST</Text>
            <Text style={styles.tagline}>Your AI Fashion Assistant</Text>
          </View>
          
          {/* Auth Form */}
          <BlurView intensity={30} tint="dark" style={styles.formContainer}>
            <Text style={styles.formTitle}>{isLogin ? 'Sign In' : 'Create Account'}</Text>
            
            {/* Name Input (Sign Up only) */}
            {!isLogin && (
              <View style={styles.inputWrapper}>
                <IconSymbol name="person" size={20} color="#fff" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Full Name"
                  placeholderTextColor="rgba(255,255,255,0.7)"
                  value={name}
                  onChangeText={setName}
                />
              </View>
            )}
            
            {/* Email Input */}
            <View style={styles.inputWrapper}>
              <IconSymbol name="envelope" size={20} color="#fff" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="rgba(255,255,255,0.7)"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
            
            {/* Password Input */}
            <View style={styles.inputWrapper}>
              <IconSymbol name="lock" size={20} color="#fff" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="rgba(255,255,255,0.7)"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!passwordVisible}
              />
              <TouchableOpacity 
                onPress={() => setPasswordVisible(!passwordVisible)}
                style={styles.eyeIcon}
              >
                <IconSymbol 
                  name={passwordVisible ? "eye.slash" : "eye"} 
                  size={20} 
                  color="#fff" 
                />
              </TouchableOpacity>
            </View>
            
            {/* Forgot Password (Login only) */}
            {isLogin && (
              <TouchableOpacity 
                style={styles.forgotPasswordButton}
                onPress={() => Alert.alert(
                  'Reset Password',
                  'Enter your email to receive a password reset link',
                  [
                    { text: 'Cancel', style: 'cancel' },
                    { 
                      text: 'Send Link', 
                      onPress: () => {
                        if (email) {
                          supabase.auth.resetPasswordForEmail(email, {
                            redirectTo: 'dresscode://reset-password',
                          });
                          Alert.alert('Password Reset', 'Check your email for a password reset link');
                        } else {
                          Alert.alert('Error', 'Please enter your email first');
                        }
                      } 
                    },
                  ]
                )}
              >
                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
              </TouchableOpacity>
            )}
            
            {/* Submit Button */}
            <TouchableOpacity 
              style={styles.submitButton}
              onPress={handleAuth}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.submitButtonText}>
                  {isLogin ? 'Sign In' : 'Create Account'}
                </Text>
              )}
            </TouchableOpacity>
            
            {/* Social Login */}
            <View style={styles.socialContainer}>
              <Text style={styles.socialText}>Or continue with</Text>
              <View style={styles.socialButtons}>
                <TouchableOpacity 
                  style={styles.socialButton}
                  onPress={() => handleSocialSignIn('google')}
                  disabled={socialLoading !== null}
                >
                  {socialLoading === 'google' ? (
                    <ActivityIndicator color="#fff" size="small" />
                  ) : (
                    <Ionicons name="logo-google" size={24} color="#fff" />
                  )}
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.socialButton}
                  onPress={() => handleSocialSignIn('apple')}
                  disabled={socialLoading !== null}
                >
                  {socialLoading === 'apple' ? (
                    <ActivityIndicator color="#fff" size="small" />
                  ) : (
                    <IconSymbol name="apple.logo" size={24} color="#fff" />
                  )}
                </TouchableOpacity>
              </View>
            </View>
            
            {/* Toggle Login/Signup */}
            <View style={styles.toggleContainer}>
              <Text style={styles.toggleText}>
                {isLogin ? "Don't have an account?" : "Already have an account?"}
              </Text>
              <TouchableOpacity onPress={toggleAuthMode}>
                <Text style={styles.toggleButton}>
                  {isLogin ? 'Sign Up' : 'Sign In'}
                </Text>
              </TouchableOpacity>
            </View>
          </BlurView>
          
          {/* Skip Button (for demo) */}
          <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
            <Text style={styles.skipButtonText}>Skip for now</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  backgroundImage: {
    position: 'absolute',
    width: width,
    height: height,
    resizeMode: 'cover',
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: height,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
    letterSpacing: 2,
  },
  tagline: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 5,
  },
  formContainer: {
    borderRadius: 20,
    padding: 20,
    overflow: 'hidden',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  formTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.3)',
    marginBottom: 20,
    paddingBottom: 10,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
  },
  eyeIcon: {
    padding: 5,
  },
  forgotPasswordButton: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  forgotPasswordText: {
    color: '#cca702',
    fontSize: 14,
  },
  submitButton: {
    backgroundColor: '#cca702',
    borderRadius: 30,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  socialContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  socialText: {
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 15,
  },
  socialButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  socialButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  toggleText: {
    color: 'rgba(255,255,255,0.7)',
  },
  toggleButton: {
    color: '#cca702',
    fontWeight: 'bold',
    marginLeft: 5,
  },
  skipButton: {
    alignSelf: 'center',
    marginTop: 20,
    padding: 10,
  },
  skipButtonText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 14,
  },
}); 