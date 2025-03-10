import React, { useState, useRef, useEffect } from 'react';
import { 
  Image, 
  StyleSheet, 
  TouchableOpacity, 
  Text, 
  View, 
  Dimensions, 
  Modal, 
  Platform, 
  Alert, 
  ActivityIndicator 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useRouter } from 'expo-router';
import { BlurView } from 'expo-blur';
import * as ImagePicker from 'expo-image-picker';
import Constants, { ExecutionEnvironment } from 'expo-constants';
import * as Camera from 'expo-camera';

import { styles } from '@/app/styles/scan';

// Import the upload function
import { uploadOutfitImage } from '@/lib/storage';
import { useAuth } from '@/lib/auth';

// Helper function to detect if running on a simulator
const isSimulator = () => {
  return (
    Platform.OS === 'ios' && 
    Constants.executionEnvironment !== ExecutionEnvironment.Bare && 
    !Constants.isDevice
  ) || (
    Platform.OS === 'android' && 
    !Constants.isDevice
  );
};

export default function HomeScreen() {
  const router = useRouter();
  const screenHeight = Dimensions.get('window').height;
  
  // State for selected image, modal, and analysis result
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // State for camera (if needed)
  const [cameraVisible, setCameraVisible] = useState(false);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const cameraRef = useRef(null);
  
  // Additional states for uploading/analyzing
  const { user } = useAuth();
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  
  // Separate loading states for each button
  const [isScanLoading, setIsScanLoading] = useState(false);
  const [isUploadLoading, setIsUploadLoading] = useState(false);
  
  // Image dimensions for proper display
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  
  // Handle scan outfit button press
  const handleScanOutfit = async () => {
    // Check if running on a simulator
    if (isSimulator()) {
      Alert.alert(
        'Simulator Detected',
        'Camera functionality is limited on simulators. Would you like to upload a photo instead?',
        [
          {
            text: 'Cancel',
            style: 'cancel'
          },
          {
            text: 'Upload Photo',
            onPress: handleUploadPhoto
          }
        ]
      );
      return;
    }
    
    try {
      setIsScanLoading(true); // Only set scan loading to true
      
      // Request camera permissions using the correct API
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      setHasCameraPermission(status === 'granted');
      
      if (status === 'granted') {
        // Launch camera
        const result = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 0.8,
        });
        
        if (!result.canceled && result.assets && result.assets.length > 0) {
          const imageUri = result.assets[0].uri;
          
          // Get image dimensions for proper display
          Image.getSize(imageUri, (width, height) => {
            const aspectRatio = width / height;
            let newHeight = height;
            let newWidth = width;
            
            if (height > 400) {
              newHeight = 400;
              newWidth = 400 * aspectRatio;
            }
            
            setImageSize({ width: newWidth, height: newHeight });
          });
          
          // Process the selected image
          await processSelectedImage(imageUri);
        }
      } else {
        Alert.alert('Permission Required', 'Camera access is needed to scan outfits.');
      }
    } catch (error) {
      console.error('Error in handleScanOutfit:', error);
      Alert.alert('Error', 'There was a problem accessing your camera. Please try again.');
    } finally {
      setIsScanLoading(false); // Reset scan loading state
    }
  };
  
  // Handle upload photo button press
  const handleUploadPhoto = async () => {
    try {
      setIsUploadLoading(true); // Only set upload loading to true
      
      // Request media library permissions
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Photo library access is needed to upload outfits.');
        return;
      }
      
      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });
      
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const imageUri = result.assets[0].uri;
        
        // Get image dimensions for proper display
        Image.getSize(imageUri, (width, height) => {
          const aspectRatio = width / height;
          let newHeight = height;
          let newWidth = width;
          
          if (height > 400) {
            newHeight = 400;
            newWidth = 400 * aspectRatio;
          }
          
          setImageSize({ width: newWidth, height: newHeight });
        });
        
        // Immediately process the selected image
        await processSelectedImage(imageUri);
      }
    } catch (error) {
      console.error('Error in handleUploadPhoto:', error);
      Alert.alert('Error', 'There was a problem accessing your photos. Please try again.');
    } finally {
      setIsUploadLoading(false); // Reset upload loading state
    }
  };
  
  // Process the selected image: upload and get score
  const processSelectedImage = async (imageUri: string) => {
    try {
      setSelectedImage(imageUri);
      setIsAnalyzing(true);
      setModalVisible(true); // Show modal immediately with loading state
      
      // Upload the image and retrieve analysis result
      const result = await uploadOutfitImage(imageUri, user?.id || '', 'Uploaded via app');
      
      if (!result.success) {
        throw new Error(result.error?.message || 'Failed to upload image');
      }
      
      setAnalysisResult(result.data); // result.data should include the score
    } catch (error) {
      console.error('Error analyzing outfit:', error);
      Alert.alert('Error', 'Failed to analyze outfit. Please try again.');
      setModalVisible(false); // Close modal on error
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  // Close the image preview modal
  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedImage(null);
    setAnalysisResult(null);
  };
  
  return (
    <View style={styles.container}>
      {/* Background Image */}
      <Image 
        source={require('@/assets/images/cover-dresscode-4.png')} 
        style={styles.backgroundImage}
        resizeMode="cover"
      />
      
      {/* Blur Overlay */}
      <BlurView intensity={15} style={StyleSheet.absoluteFill} tint="default" />
      
      {/* Gradient Overlay */}
      <LinearGradient colors={['transparent', 'rgba(0,0,0,0.7)']} style={styles.gradient} />
      
      {/* Content Container */}
      <View style={styles.contentContainer}>
        {/* Main Action Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.scanButton} 
            onPress={handleScanOutfit}
            disabled={isScanLoading || isUploadLoading}
          >
            {isScanLoading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <>
                <IconSymbol name="camera" size={24} color="#fff" style={styles.buttonIcon} />
                <Text style={styles.buttonText}>Scan Outfit</Text>
              </>
            )}
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.uploadButton} 
            onPress={handleUploadPhoto}
            disabled={isScanLoading || isUploadLoading}
          >
            {isUploadLoading ? (
              <ActivityIndicator color="#cca702" size="small" />
            ) : (
              <>
                <IconSymbol name="photo" size={24} color="#cca702" style={styles.buttonIcon} />
                <Text style={styles.uploadButtonText}>Upload Photo</Text>
              </>
            )}
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
        <View style={styles.modalContainer}>
          <BlurView intensity={10} style={StyleSheet.absoluteFill} tint="light" />
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Outfit Analysis</Text>
              <TouchableOpacity style={styles.closeButton} onPress={handleCloseModal}>
                <IconSymbol name="xmark" size={20} color="#333" />
              </TouchableOpacity>
            </View>
            
            <View style={[
              styles.imagePreviewContainer, 
              { height: imageSize.height > 0 ? imageSize.height : 400 }
            ]}>
              {selectedImage ? (
                <Image 
                  source={{ uri: selectedImage }} 
                  style={styles.imagePreview} 
                  resizeMode="contain"
                />
              ) : null}
              
              {isAnalyzing && (
                <View style={styles.loadingOverlay}>
                  <ActivityIndicator size="large" color="#cca702" />
                  <Text style={styles.loadingText}>Analyzing your outfit...</Text>
                </View>
              )}
            </View>
            
            {analysisResult && !isAnalyzing ? (
              <View style={styles.analysisResultContainer}>
                <View style={{flexDirection: 'row', alignItems: 'center', gap: 10}}>
                  <Text style={styles.scoreTitle}>Style Score</Text>
                  <View style={styles.scoreCircle}>
                    <Text style={styles.scoreText}>{analysisResult.score}</Text>
                  </View>
                </View>
                <TouchableOpacity 
                  style={styles.viewDetailsButton}
                  onPress={() => {
                    handleCloseModal();
                    router.push('/(tabs)/progress');
                  }}
                >
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <IconSymbol name="sparkles" size={16} color="#fff" style={{marginRight: 8}} />
                    <Text style={styles.viewDetailsText}>Vibe Check</Text>
                  </View>
                </TouchableOpacity>
              </View>
            ) : null}
          </View>
        </View>
      </Modal>
    </View>
  );
}
