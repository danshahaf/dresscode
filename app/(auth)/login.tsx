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

const { width, height } = Dimensions.get('window');

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
      }
      
      // If we get here, authentication was successful
      router.replace('/(tabs)');
      
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
      
      let { data, error } = provider === 'google' 
        ? await signInWithGoogle()
        : await signInWithApple();
      
      if (error) throw error;
      
      // Note: For OAuth with mobile apps, the user will be redirected to a web browser
      // and then back to the app via deep linking. The actual navigation to the main app
      // will happen when the deep link is processed.
      
    } catch (error: any) {
      setSocialLoading(null);
      Alert.alert(
        'Authentication Error',
        `Failed to sign in with ${provider}. ${error.message || 'Please try again.'}`
      );
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