import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  Image,
  Platform
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { supabase } from '@/lib/supabase';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

export default function ProfileSetupScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [age, setAge] = useState('');
  const [gender, setGender] = useState<'male' | 'female' | 'other' | null>(null);
  const [height, setHeight] = useState('');
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  // Check if user is authenticated
  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        // If no user, redirect to login
        router.replace('/(auth)/login');
        return;
      }
      setUserId(data.user.id);
    };

    checkUser();
  }, []);

  // Handle image picking
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please grant permission to access your photos');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  // Handle profile submission
  const handleSubmit = async () => {
    // Validate required fields
    if (!age) {
      Alert.alert('Required Field', 'Please enter your age');
      return;
    }
    
    if (!gender) {
      Alert.alert('Required Field', 'Please select your gender');
      return;
    }

    if (!userId) {
      Alert.alert('Error', 'User ID not found. Please try logging in again.');
      return;
    }

    try {
      setLoading(true);

      // Upload profile image if selected
      let profileImageUrl = null;
      if (profileImage) {
        const fileExt = profileImage.split('.').pop();
        const fileName = `${userId}-${Date.now()}.${fileExt}`;
        const filePath = `profiles/${fileName}`;

        // Convert image to blob
        const response = await fetch(profileImage);
        const blob = await response.blob();

        // Upload to Supabase Storage
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('profiles')
          .upload(filePath, blob);

        if (uploadError) {
          console.error('Error uploading image:', uploadError);
        } else {
          // Get public URL
          const { data: urlData } = supabase.storage
            .from('profiles')
            .getPublicUrl(filePath);
          
          profileImageUrl = urlData.publicUrl;
        }
      }

      // Create user profile in database
      const { error } = await supabase
        .from('user_profiles')
        .insert({
          user_id: userId,
          age: parseInt(age),
          gender,
          height: height ? parseInt(height) : null,
          profile_image_url: profileImageUrl
        });

      if (error) throw error;

      // Navigate to main app
      router.replace('/(tabs)');
      
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to save profile');
    } finally {
      setLoading(false);
    }
  };

  // Skip profile setup
  const handleSkip = async () => {
    if (!userId) {
      Alert.alert('Error', 'User ID not found. Please try logging in again.');
      return;
    }

    try {
      setLoading(true);
      
      // Create minimal profile with just required fields
      const { error } = await supabase
        .from('user_profiles')
        .insert({
          user_id: userId,
          age: age ? parseInt(age) : 25, // Default age
          gender: gender || 'other', // Default gender
        });

      if (error) throw error;
      
      // Navigate to main app
      router.replace('/(tabs)');
      
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to save profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Image
        source={{ uri: 'https://images.unsplash.com/photo-1445205170230-053b83016050?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1471&q=80' }}
        style={styles.backgroundImage}
      />
      
      <LinearGradient
        colors={['rgba(0,0,0,0.3)', 'rgba(0,0,0,0.7)']}
        style={styles.gradient}
      />
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <BlurView intensity={30} tint="dark" style={styles.formContainer}>
          <Text style={styles.title}>Complete Your Profile</Text>
          <Text style={styles.subtitle}>Tell us a bit about yourself to personalize your experience</Text>
          
          {/* Profile Image */}
          <View style={styles.imageContainer}>
            <TouchableOpacity style={styles.imagePickerButton} onPress={pickImage}>
              {profileImage ? (
                <Image source={{ uri: profileImage }} style={styles.profileImage} />
              ) : (
                <View style={styles.imagePlaceholder}>
                  <IconSymbol name="camera" size={30} color="#fff" />
                  <Text style={styles.imagePlaceholderText}>Add Photo</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
          
          {/* Age Input - Required */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Age <Text style={styles.required}>*</Text></Text>
            <TextInput
              style={styles.input}
              value={age}
              onChangeText={setAge}
              placeholder="Enter your age"
              placeholderTextColor="rgba(255,255,255,0.5)"
              keyboardType="number-pad"
            />
          </View>
          
          {/* Gender Selection - Required */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Gender <Text style={styles.required}>*</Text></Text>
            <View style={styles.genderOptions}>
              <TouchableOpacity
                style={[
                  styles.genderOption,
                  gender === 'male' && styles.selectedGender
                ]}
                onPress={() => setGender('male')}
              >
                <Text style={[
                  styles.genderText,
                  gender === 'male' && styles.selectedGenderText
                ]}>Male</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.genderOption,
                  gender === 'female' && styles.selectedGender
                ]}
                onPress={() => setGender('female')}
              >
                <Text style={[
                  styles.genderText,
                  gender === 'female' && styles.selectedGenderText
                ]}>Female</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.genderOption,
                  gender === 'other' && styles.selectedGender
                ]}
                onPress={() => setGender('other')}
              >
                <Text style={[
                  styles.genderText,
                  gender === 'other' && styles.selectedGenderText
                ]}>Other</Text>
              </TouchableOpacity>
            </View>
          </View>
          
          {/* Height Input - Optional */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Height (cm)</Text>
            <TextInput
              style={styles.input}
              value={height}
              onChangeText={setHeight}
              placeholder="Enter your height"
              placeholderTextColor="rgba(255,255,255,0.5)"
              keyboardType="number-pad"
            />
          </View>
          
          {/* Submit Button */}
          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.submitButtonText}>Complete Setup</Text>
            )}
          </TouchableOpacity>
          
          {/* Skip Button */}
          <TouchableOpacity
            style={styles.skipButton}
            onPress={handleSkip}
            disabled={loading}
          >
            <Text style={styles.skipButtonText}>Skip for now</Text>
          </TouchableOpacity>
        </BlurView>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  backgroundImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  formContainer: {
    borderRadius: 20,
    padding: 20,
    overflow: 'hidden',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
    marginBottom: 30,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  imagePickerButton: {
    width: 120,
    height: 120,
    borderRadius: 60,
    overflow: 'hidden',
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePlaceholderText: {
    color: '#fff',
    marginTop: 5,
    fontSize: 14,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 8,
  },
  required: {
    color: '#cca702',
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 8,
    padding: 12,
    color: '#fff',
    fontSize: 16,
  },
  genderOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  genderOption: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  selectedGender: {
    backgroundColor: '#cca702',
  },
  genderText: {
    color: '#fff',
    fontSize: 16,
  },
  selectedGenderText: {
    fontWeight: 'bold',
  },
  submitButton: {
    backgroundColor: '#cca702',
    borderRadius: 30,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  skipButton: {
    marginTop: 15,
    padding: 10,
    alignItems: 'center',
  },
  skipButtonText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 14,
  },
}); 