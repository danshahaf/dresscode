import React, { useState, useRef, useEffect } from 'react';
import { Image, StyleSheet, TouchableOpacity, Text, View, Dimensions, Modal, Platform, Alert, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useRouter } from 'expo-router';
import { BlurView } from 'expo-blur';
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

// Helper function to detect if running on a simulator
const isSimulator = () => {
  return (
    Platform.OS === 'ios' && 
    Constants.executionEnvironment === 'simulator'
  ) || (
    Platform.OS === 'android' && 
    Constants.executionEnvironment === 'storeClient' &&
    !Constants.isDevice
  );
};

export default function HomeScreen() {
  const router = useRouter();
  const screenHeight = Dimensions.get('window').height;
  
  // State for selected image and modal visibility
  const [selectedImage, setSelectedImage] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // State for camera - using string literals instead of enum
  const [cameraVisible, setCameraVisible] = useState(false);
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const cameraRef = useRef(null);
  
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
    } catch (error) {
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
  const handleAnalyzeOutfit = () => {
    // In a real app, you would send the image to your backend for analysis
    setModalVisible(false);
    
    // Show a loading indicator or navigate to a results page
    Alert.alert(
      "Analyzing Outfit",
      "Your outfit is being analyzed. Results will be available soon.",
      [{ text: "OK" }]
    );
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
              </View>
            )}
            
            <TouchableOpacity 
              style={styles.analyzeButton}
              onPress={handleAnalyzeOutfit}
            >
              <IconSymbol size={20} name="sparkles" color="#fff" style={styles.buttonIcon} />
              <Text style={styles.analyzeButtonText}>Analyze Outfit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '50%',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 0,
  },
  buttonContainer: {
    width: '100%',
    paddingHorizontal: 30,
    gap: 15,
  },
  primaryButton: {
    backgroundColor: '#cca702',
    borderColor: '#cca702',
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  secondaryButtonText: {
    color: '#cca702',
    fontSize: 18,
    fontWeight: '600',
  },
  buttonIcon: {
    marginRight: 10,
  },
  
  // Modal Styles
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imagePreviewContainer: {
    width: '100%',
    height: 400,
    marginBottom: 20,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#f8f8f8',
  },
  imagePreview: {
    width: '100%',
    height: '100%',
  },
  analyzeButton: {
    backgroundColor: '#cca702',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginTop: 10,
  },
  analyzeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
