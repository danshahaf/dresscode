import React, { useState } from 'react';
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
import { useRouter } from 'expo-router';

const { width, height } = Dimensions.get('window');

export default function LoginScreen() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState('');
  
  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  
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
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // For demo purposes, just navigate to the main app
      router.replace('/(tabs)');
      
    } catch (error) {
      Alert.alert(
        'Authentication Error',
        'There was a problem authenticating. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle social sign-in
  const handleSocialSignIn = async (provider) => {
    try {
      setSocialLoading(provider);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // For demo purposes, just navigate to the main app
      router.replace('/(tabs)');
      
    } catch (error) {
      Alert.alert(
        'Authentication Error',
        `There was a problem signing in with ${provider}. Please try again.`
      );
    } finally {
      setSocialLoading('');
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
    <View style={styles.container}>
      {/* Background Image */}
      <Image 
        source={require('@/assets/images/cover-dresscode.png')} 
        style={styles.backgroundImage}
        resizeMode="cover"
      />
      
      {/* Blur Overlay */}
      <BlurView 
        intensity={10} 
        style={StyleSheet.absoluteFill} 
        tint="dark"
      />
      
      {/* Gradient Overlay */}
      <LinearGradient
        colors={['rgba(0,0,0,0.3)', 'rgba(0,0,0,0.7)']}
        style={StyleSheet.absoluteFill}
      />
      
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Logo and App Name */}
          <View style={styles.logoContainer}>
            <IconSymbol size={60} name="tshirt" color="#cca702" />
            <Text style={styles.appName}>DressCode</Text>
            <Text style={styles.tagline}>Your Personal Style Assistant</Text>
          </View>
          
          {/* Auth Form */}
          <View style={styles.formContainer}>
            <Text style={styles.formTitle}>
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </Text>
            
            {/* Name Input (Sign Up only) */}
            {!isLogin && (
              <View style={styles.inputContainer}>
                <IconSymbol size={20} name="person.fill" color="#999" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Full Name"
                  placeholderTextColor="#999"
                  value={name}
                  onChangeText={setName}
                  autoCapitalize="words"
                />
              </View>
            )}
            
            {/* Email Input */}
            <View style={styles.inputContainer}>
              <IconSymbol size={20} name="envelope.fill" color="#999" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Email Address"
                placeholderTextColor="#999"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
            
            {/* Password Input */}
            <View style={styles.inputContainer}>
              <IconSymbol size={20} name="lock.fill" color="#999" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#999"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!passwordVisible}
              />
              <TouchableOpacity 
                style={styles.passwordToggle}
                onPress={() => setPasswordVisible(!passwordVisible)}
              >
                <IconSymbol 
                  size={20} 
                  name={passwordVisible ? "eye.slash.fill" : "eye.fill"} 
                  color="#999" 
                />
              </TouchableOpacity>
            </View>
            
            {/* Forgot Password (Login only) */}
            {isLogin && (
              <TouchableOpacity style={styles.forgotPasswordContainer}>
                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
              </TouchableOpacity>
            )}
            
            {/* Submit Button */}
            <TouchableOpacity 
              style={styles.submitButton}
              onPress={handleAuth}
              disabled={isLoading || !!socialLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.submitButtonText}>
                  {isLogin ? 'Sign In' : 'Create Account'}
                </Text>
              )}
            </TouchableOpacity>
            
            {/* Social Sign-In Divider */}
            <View style={styles.dividerContainer}>
              <View style={styles.divider} />
              <Text style={styles.dividerText}>or continue with</Text>
              <View style={styles.divider} />
            </View>
            
            {/* Social Sign-In Buttons */}
            <View style={styles.socialButtonsContainer}>
              {/* Apple Sign-In */}
              <TouchableOpacity 
                style={styles.socialButton}
                onPress={() => handleSocialSignIn('Apple')}
                disabled={isLoading || !!socialLoading}
              >
                {socialLoading === 'Apple' ? (
                  <ActivityIndicator color="#000" size="small" />
                ) : (
                  <IconSymbol size={24} name="apple.logo" color="#000" />
                )}
              </TouchableOpacity>
              
              {/* Google Sign-In */}
              <TouchableOpacity 
                style={styles.socialButton}
                onPress={() => handleSocialSignIn('Google')}
                disabled={isLoading || !!socialLoading}
              >
                {socialLoading === 'Google' ? (
                  <ActivityIndicator color="#4285F4" size="small" />
                ) : (
                  <Image 
                    source={require('@/assets/images/google-logo.png')} 
                    style={styles.googleLogo}
                    resizeMode="contain"
                  />
                )}
              </TouchableOpacity>
            </View>
            
            {/* Toggle Auth Mode */}
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
            
            {/* Skip Button (for demo) */}
            <TouchableOpacity 
              style={styles.skipButton}
              onPress={handleSkip}
            >
              <Text style={styles.skipButtonText}>Skip for now</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  appName: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 10,
  },
  tagline: {
    fontSize: 16,
    color: '#cca702',
    marginTop: 5,
  },
  formContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    padding: 25,
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  formTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    marginBottom: 15,
    paddingHorizontal: 15,
    backgroundColor: '#f8f8f8',
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 15,
    fontSize: 16,
    color: '#333',
  },
  passwordToggle: {
    padding: 10,
  },
  forgotPasswordContainer: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  forgotPasswordText: {
    color: '#cca702',
    fontSize: 14,
  },
  submitButton: {
    backgroundColor: '#cca702',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 10,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#ddd',
  },
  dividerText: {
    color: '#999',
    paddingHorizontal: 10,
    fontSize: 14,
  },
  socialButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginBottom: 10,
  },
  socialButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  googleLogo: {
    width: 24,
    height: 24,
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  toggleText: {
    color: '#666',
    fontSize: 14,
  },
  toggleButton: {
    color: '#cca702',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 5,
  },
  skipButton: {
    alignSelf: 'center',
    marginTop: 20,
    padding: 10,
  },
  skipButtonText: {
    color: '#999',
    fontSize: 14,
  },
}); 