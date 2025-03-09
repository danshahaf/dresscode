import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  Image, 
  TouchableOpacity, 
  Modal, 
  TextInput,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  Dimensions
} from 'react-native';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { editProfileStyles } from '@/app/styles/profile.styles';
import * as ImagePicker from 'expo-image-picker';
import { supabase } from '@/lib/supabase';
import * as FileSystem from 'expo-file-system';

interface EditProfileModalProps {
  visible: boolean;
  onClose: () => void;
  user: any;
  onSave: (data: any) => void;
  feet: string;
  inches: string;
  onFeetChange: (value: string) => void;
  onInchesChange: (value: string) => void;
  formattedHeight: string;
}

export const EditProfileModal = ({ 
  visible, 
  onClose, 
  user, 
  onSave,
  feet,
  inches,
  onFeetChange,
  onInchesChange,
  formattedHeight
}: EditProfileModalProps) => {
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    location: user?.location || '',
    profileImage: user?.profileImage || null,
  });
  const [loading, setLoading] = useState(false);
  const [showHeightPicker, setShowHeightPicker] = useState(false);
  
  // Reset form data when user changes
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        location: user.location || '',
        profileImage: user.profileImage || null,
      });
    }
  }, [user]);
  
  // Handle form field changes
  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  
  // Pick an image from the gallery
  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });
      
      if (!result.canceled && result.assets && result.assets.length > 0) {
        console.log('Image picked:', result.assets[0].uri);
        // Add a timestamp to force React to recognize this as a new image
        handleChange('profileImage', { 
          uri: result.assets[0].uri,
          timestamp: Date.now() // Add timestamp to ensure React sees this as a new object
        });
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image');
    }
  };
  
  // Handle form submission with Supabase update
  const handleSubmit = async () => {
    try {
      setLoading(true);
      
      // Get current user
      const { data: userData, error: userError } = await supabase.auth.getUser();
      
      if (userError) {
        throw new Error('Failed to get current user');
      }
      
      const userId = userData.user?.id;
      
      if (!userId) {
        throw new Error('User ID not found');
      }
      
      // Prepare update data
      const updateData: any = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        location: formData.location,
        height_feet: parseInt(feet) || null,
        height_inches: parseInt(inches) || null,
      };
      
      let profileImageUrl = null;
      
      // Handle profile image upload if it's a new image (has uri property)
      if (formData.profileImage && formData.profileImage.uri) {
        try {
          console.log('Uploading new profile image...', formData.profileImage);
          
          // Get file extension
          const fileExt = formData.profileImage.uri.split('.').pop();
          const fileName = `${userId}.${fileExt}`;  // Use just the user ID as the filename
          const filePath = `${fileName}`;  // No subfolder needed
          
          // Read the file as base64
          const fileBase64 = await FileSystem.readAsStringAsync(formData.profileImage.uri, {
            encoding: FileSystem.EncodingType.Base64,
          });
          
          console.log('Uploading to profile_images bucket, path:', filePath);
          
          // First try to remove any existing file to avoid conflicts
          try {
            await supabase.storage
              .from('profile_images')
              .remove([filePath]);
            console.log('Removed existing image if any');
          } catch (removeError) {
            // Ignore errors from remove - file might not exist
            console.log('No existing file to remove or error removing:', removeError);
          }
          
          // Upload to Supabase Storage - use 'profile_images' bucket
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('profile_images')  // Changed from 'profiles' to 'profile_images'
            .upload(filePath, decode(fileBase64), {
              contentType: `image/${fileExt}`,
              upsert: true,  // Overwrite if exists
            });
            
          if (uploadError) {
            console.error('Error uploading image:', uploadError);
            console.error('Upload error details:', JSON.stringify(uploadError));
            // Continue with the update even if image upload fails
          } else {
            console.log('Image uploaded successfully:', uploadData);
            
            // Get public URL from the correct bucket
            const { data: urlData } = supabase.storage
              .from('profile_images')  // Changed from 'profiles' to 'profile_images'
              .getPublicUrl(filePath);
              
            profileImageUrl = urlData.publicUrl;
            console.log('Profile image URL:', profileImageUrl);
            updateData.profile_image = profileImageUrl;
          }
        } catch (imageError) {
          console.error('Error processing image:', imageError);
          console.error('Error details:', JSON.stringify(imageError));
          // Continue with the update even if image processing fails
        }
      }
      
      // Update profile in database
      const { error: updateError } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('user_id', userId);
        
      if (updateError) {
        console.error('Error updating profile in database:', updateError);
        throw new Error('Failed to update profile');
      }
      
      // Format the data for the parent component without requiring a fetch
      const updatedUserData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        location: formData.location,
        height: `${feet}'${inches}"`,
        profileImage: profileImageUrl 
          ? `${profileImageUrl}?t=${Date.now()}`  // Add cache-busting parameter
          : formData.profileImage && formData.profileImage.uri 
            ? formData.profileImage.uri 
            : null,
      };
      
      console.log('Sending updated user data to parent:', updatedUserData);
      
      // Call the onSave callback with updated data
      onSave(updatedUserData);
      
      // Close the modal
      onClose();
      
    } catch (error: any) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', error.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };
  
  // Generate arrays for feet and inches pickers
  const feetArray = Array.from({ length: 8 }, (_, i) => (i + 4).toString());
  const inchesArray = Array.from({ length: 12 }, (_, i) => i.toString());
  
  // Helper function to decode base64 for Supabase storage
  const decode = (base64: string) => {
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  };
  
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={editProfileStyles.modalOverlay}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1, justifyContent: 'center' }}
          >
            <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center'}}>
              <View style={editProfileStyles.modalContent}>
                <View style={styles.headerContainer}>
                  <View style={styles.profileImageHeader}>
                    <View style={[styles.imageWrapper, { overflow: 'visible' }]}>
                      <Image 
                        source={
                          typeof formData.profileImage === 'object' && formData.profileImage.uri ? 
                            { uri: formData.profileImage.uri } : formData.profileImage
                        } 
                        style={styles.profileImage} 
                      />
                      <TouchableOpacity 
                        style={styles.editImageButton}
                        onPress={pickImage}
                      >
                        <IconSymbol name="camera" size={20} color="#fff" />
                      </TouchableOpacity>
                    </View>
                  </View>
                  <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                    <IconSymbol name="xmark" size={24} color="#333" />
                  </TouchableOpacity>
                </View>
                
                <View style={styles.nameInputContainer}>
                  <View style={styles.nameInputHalf}>
                    <Text style={editProfileStyles.label}>First Name</Text>
                    <TextInput
                      style={editProfileStyles.input}
                      value={formData.firstName}
                      onChangeText={(text) => handleChange('firstName', text)}
                      placeholder="First Name"
                    />
                  </View>
                  <View style={styles.nameInputSpacer} />
                  <View style={styles.nameInputHalf}>
                    <Text style={editProfileStyles.label}>Last Name</Text>
                    <TextInput
                      style={editProfileStyles.input}
                      value={formData.lastName}
                      onChangeText={(text) => handleChange('lastName', text)}
                      placeholder="Last Name"
                    />
                  </View>
                </View>
                
                <View style={editProfileStyles.formGroup}>
                  <Text style={editProfileStyles.label}>Height</Text>
                  <TouchableOpacity 
                    style={editProfileStyles.input}
                    onPress={() => setShowHeightPicker(!showHeightPicker)}
                  >
                    <Text>{formattedHeight || 'Select Height'}</Text>
                  </TouchableOpacity>
                </View>
                
                {showHeightPicker && (
                  <View style={styles.pickerContainer}>
                    <View style={styles.pickerColumn}>
                      <Text style={styles.pickerLabel}>Feet</Text>
                      <ScrollView style={styles.picker}>
                        {feetArray.map((ft) => (
                          <TouchableOpacity
                            key={`feet-${ft}`}
                            style={[
                              styles.pickerItem,
                              feet === ft && styles.selectedPickerItem
                            ]}
                            onPress={() => onFeetChange(ft)}
                          >
                            <Text 
                              style={[
                                styles.pickerItemText,
                                feet === ft && styles.selectedPickerItemText
                              ]}
                            >
                              {ft}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </ScrollView>
                    </View>
                    
                    <View style={styles.pickerColumn}>
                      <Text style={styles.pickerLabel}>Inches</Text>
                      <ScrollView style={styles.picker}>
                        {inchesArray.map((inch) => (
                          <TouchableOpacity
                            key={`inch-${inch}`}
                            style={[
                              styles.pickerItem,
                              inches === inch && styles.selectedPickerItem
                            ]}
                            onPress={() => onInchesChange(inch)}
                          >
                            <Text 
                              style={[
                                styles.pickerItemText,
                                inches === inch && styles.selectedPickerItemText
                              ]}
                            >
                              {inch}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </ScrollView>
                    </View>
                  </View>
                )}
                
                <View style={editProfileStyles.formGroup}>
                  <Text style={editProfileStyles.label}>Location</Text>
                  <TextInput
                    style={editProfileStyles.input}
                    value={formData.location}
                    onChangeText={(text) => handleChange('location', text)}
                    placeholder="City, State"
                  />
                </View>
                
                <TouchableOpacity 
                  style={editProfileStyles.saveButton}
                  onPress={handleSubmit}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color="#fff" size="small" />
                  ) : (
                    <Text style={editProfileStyles.saveButtonText}>Save Changes</Text>
                  )}
                </TouchableOpacity>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}; 

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
    paddingTop: 5,
  },
  profileImageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  imageWrapper: {
    position: 'relative',
    width: 120,
    height: 120,
    borderRadius: 35,
    overflow: 'hidden',
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 65,
  },
  editImageButton: {
    position: 'absolute',
    zIndex: 10, 
    elevation: 10,
    bottom: 0,
    right: 0,
    backgroundColor: '#cca702',
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff'
  },
  closeButton: {
    padding: 5,
    marginTop: 5,
  },
  nameInputContainer: {
    flexDirection: 'row',
    marginBottom: 15,
    justifyContent: 'space-between',
  },
  nameInputHalf: {
    width: '48%',
  },
  nameInputSpacer: {
    width: '4%',
  },
  pickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 1,
    marginBottom: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 10,
  },
  pickerColumn: {
    alignItems: 'center', 
    width: width * 0.3,
  },
  pickerLabel: {
    fontSize: 16,
    color: '#666',
    marginBottom: 6,
  },
  picker: {
    height: 100,
  },
  pickerItem: {
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
    width: width * 0.3,
  },
  selectedPickerItem: {
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  pickerItemText: {
    fontSize: 18,
    color: '#333',
  },
  selectedPickerItemText: {
    fontWeight: 'bold',
    color: '#cca702',
  },
  modalContainer: {
    flex: 1,
    maxHeight: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center', // centers vertically
    alignItems: 'center',     // centers horizontally
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
});