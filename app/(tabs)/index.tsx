import React, { useState, useRef, useEffect } from 'react';
import { Image, StyleSheet, TouchableOpacity, Text, View, Dimensions, Modal, Platform, Alert, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useRouter } from 'expo-router';
import { BlurView } from 'expo-blur';
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';

import { styles  } from '@/app/styles/scan';


import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

// Import the upload function
import { uploadOutfitImage } from '@/lib/storage';
import { useAuth } from '@/lib/auth';

// Helper function to detect if running on a simulator
const isSimulator = () => {
  return (
    Platform.OS === 'ios' && 
    Constants.executionEnvironment === 'simulator' as any
  ) || (
    Platform.OS === 'android' && 
    Constants.executionEnvironment === 'storeClient' as any &&
    !Constants.isDevice
  );
};

export default function HomeScreen() {
  const router = useRouter();
  const screenHeight = Dimensions.get('window').height;
  
  // State for selected image and modal visibility
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // State for camera - using string literals instead of enum
  const [cameraVisible, setCameraVisible] = useState(false);
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const cameraRef = useRef(null);
  
  // Add these state variables
  const { user } = useAuth();
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  
  // Handle scan outfit button press
  const handleScanOutfit = async () => {
    try {
      setIsLoading(true);
      
      // Check if running on simulator
      if (isSimulator()) {
        setIsLoading(false);
        
        // Show alert about simulator limitations
        Alert.alert(
          'Simulator Detected',
          'Camera is not available on simulators. Would you like to select a photo from the library instead?',
          [
            {
              text: 'Cancel',
              style: 'cancel'
            },
            {
              text: 'Select Photo',
              onPress: handleUploadPhoto
            }
          ]
        );
        return;
      }
      
      // Check if we're running in a browser (web)
      if (Platform.OS === 'web') {
        Alert.alert(
          'Not Supported',
          'Camera functionality is not available in web browser.',
          [{ text: 'OK' }]
        );
        setIsLoading(false);
        return;
      }
      
      // Use a simpler approach with ImagePicker
      let result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 1,
      });
      
      console.log('Camera result:', result);
      
      setIsLoading(false);
      
      if (!result.canceled && result.assets && result.assets.length > 0) {
        setSelectedImage(result.assets[0].uri);
        setModalVisible(true);
      }
    } catch (error: any) {
      console.error('Camera error:', error);
      setIsLoading(false);
      Alert.alert(
        'Camera Error',
        'There was a problem accessing the camera: ' + (error.message || 'Unknown error'),
        [{ text: 'OK' }]
      );
    }
  };
  
  // Handle upload photo button press
  const handleUploadPhoto = async () => {
    try {
      setIsLoading(true);
      
      // Request media library permissions
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Please allow access to your photo library to upload photos.',
          [{ text: 'OK' }]
        );
        setIsLoading(false);
        return;
      }
      
      // Open image picker with modified options to prevent forced cropping
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 1,
      });
      
      setIsLoading(false);
      
      if (!result.canceled) {
        // Set the selected image and show modal
        setSelectedImage(result.assets[0].uri);
        setModalVisible(true);
      }
    } catch (error) {
      setIsLoading(false);
      console.error('Error in handleUploadPhoto:', error);
      Alert.alert(
        'Error',
        'There was a problem accessing your photos. Please try again.',
        [{ text: 'OK' }]
      );
    }
  };
  
  // Close the image preview modal
  const handleCloseModal = () => {
    setModalVisible(false);
  };
  
  // Analyze the selected outfit
  const handleAnalyzeOutfit = async () => {
    if (!selectedImage) {
      Alert.alert('No Image', 'Please select an image first');
      return;
    }
    
    if (!user) {
      Alert.alert('Not Logged In', 'Please log in to analyze outfits');
      return;
    }
    
    try {
      setIsAnalyzing(true);
      
      // Upload the image to Supabase
      const result = await uploadOutfitImage(
        selectedImage,
        user.id,
        'Uploaded via app'
      );
      
      if (!result.success) {
        throw new Error(result.error?.message || 'Failed to upload image');
      }
      
      // Set the analysis result
      setAnalysisResult(result.data);
      
      // Show success message
      Alert.alert(
        'Analysis Complete',
        `Your outfit scored ${result.data.score} out of 100!`,
        [
          {
            text: 'View Details',
            onPress: () => {
              // Navigate to the progress tab to see the outfit
              router.push('/(tabs)/progress');
            }
          },
          {
            text: 'OK',
            onPress: () => {
              // Close the modal and reset
              handleCloseModal();
              setSelectedImage(null);
              setAnalysisResult(null);
            }
          }
        ]
      );
      
    } catch (error) {
      console.error('Error analyzing outfit:', error);
      Alert.alert('Error', 'Failed to analyze outfit. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
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
        intensity={15} 
        style={StyleSheet.absoluteFill} 
        tint="default"
      />
      
      {/* Gradient Overlay */}
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.7)']}
        style={styles.gradient}
      />
      
      {/* Content Container */}
      <View style={styles.contentContainer}>
        {/* App Logo or Title could go here */}
        
        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.primaryButton}
            onPress={handleScanOutfit}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" style={styles.buttonIcon} />
            ) : (
              <IconSymbol size={20} name="camera.fill" color="#fff" style={styles.buttonIcon} />
            )}
            <Text style={styles.primaryButtonText}>Scan Outfit</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.secondaryButton}
            onPress={handleUploadPhoto}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#cca702" style={styles.buttonIcon} />
            ) : (
              <IconSymbol size={20} name="photo" color="#cca702" style={styles.buttonIcon} />
            )}
            <Text style={styles.secondaryButtonText}>Upload Photo</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      {/* Image Preview Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Preview Outfit</Text>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={handleCloseModal}
                disabled={isAnalyzing}
              >
                <IconSymbol size={20} name="xmark" color="#333" />
              </TouchableOpacity>
            </View>
            
            {selectedImage && (
              <View style={styles.imagePreviewContainer}>
                <Image 
                  source={{ uri: selectedImage }} 
                  style={styles.imagePreview} 
                  resizeMode="contain"
                />
                
                {isAnalyzing && (
                  <View style={styles.loadingOverlay}>
                    <ActivityIndicator size="large" color="#cca702" />
                    <Text style={styles.loadingText}>Analyzing your outfit...</Text>
                  </View>
                )}
              </View>
            )}
            
            <TouchableOpacity 
              style={[
                styles.analyzeButton,
                isAnalyzing && styles.disabledButton
              ]}
              onPress={handleAnalyzeOutfit}
              disabled={isAnalyzing || !selectedImage}
            >
              {isAnalyzing ? (
                <Text style={styles.analyzeButtonText}>Analyzing...</Text>
              ) : (
                <>
                  <IconSymbol size={20} name="sparkles" color="#fff" style={styles.buttonIcon} />
                  <Text style={styles.analyzeButtonText}>Analyze Outfit</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

