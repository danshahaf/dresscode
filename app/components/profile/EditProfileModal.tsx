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

interface EditProfileModalProps {
  visible: boolean;
  onClose: () => void;
  user: {
    firstName: string;
    lastName: string;
    profileImage: any;
    height: string;
    location: string;
  };
  onSave: (userData: {
    firstName: string;
    lastName: string;
    location: string;
    profileImage: string;
  }) => void;
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
  const [formData, setFormData] = useState<{
    firstName: string;
    lastName: string;
    location: string;
    profileImage: any;
  }>({
    firstName: user.firstName,
    lastName: user.lastName,
    location: user.location,
    profileImage: user.profileImage
  });
  const [loading, setLoading] = useState(false);
  const [showHeightPicker, setShowHeightPicker] = useState(false);
  
  // Generate feet options (3-8 feet)
  const feetOptions = Array.from({ length: 6 }, (_, i) => (i + 3).toString());
  
  // Generate inches options (0-11 inches)
  const inchesOptions = Array.from({ length: 12 }, (_, i) => i.toString());
  
  useEffect(() => {
    setFormData({
      firstName: user.firstName,
      lastName: user.lastName,
      location: user.location,
      profileImage: user.profileImage
    });
  }, [user, visible]);
  
  const handleChange = (field: string, value: string) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };
  
  const handleSubmit = () => {
    setLoading(true);
    
    const imageUri = typeof formData.profileImage === 'object' && formData.profileImage.uri ? 
      formData.profileImage.uri : '';
    
    onSave({
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      location: formData.location.trim() || '-',
      profileImage: imageUri
    });
    
    setLoading(false);
  };
  
  const pickImage = async () => {
    try {
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
        setFormData({
          ...formData,
          profileImage: { uri: result.assets[0].uri }
        });
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image');
    }
  };
  
  const toggleHeightPicker = () => {
    setShowHeightPicker(!showHeightPicker);
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
            <ScrollView>
              <View style={editProfileStyles.modalContent}>
                <View style={editProfileStyles.modalHeader}>
                  <Text style={editProfileStyles.modalTitle}>Edit Profile</Text>
                  <TouchableOpacity onPress={onClose} style={editProfileStyles.closeButton}>
                    <IconSymbol name="xmark" size={24} color="#333" />
                  </TouchableOpacity>
                </View>
                
                <View style={editProfileStyles.profileImageContainer}>
                  <View style={[editProfileStyles.imageWrapper, { overflow: 'visible' }]}>
                    <Image 
                      source={
                        typeof formData.profileImage === 'object' && formData.profileImage.uri ? 
                          { uri: formData.profileImage.uri } : formData.profileImage
                      } 
                      style={editProfileStyles.profileImage} 
                    />
                    <TouchableOpacity 
                      style={[editProfileStyles.editImageButton, { 
                        position: 'absolute',
                        zIndex: 10, 
                        elevation: 10,
                        bottom: 0,
                        right: 0,
                        borderWidth: 2,
                        borderColor: '#fff'
                      }]}
                      onPress={pickImage}
                    >
                      <IconSymbol name="camera" size={16} color="#fff" />
                    </TouchableOpacity>
                  </View>
                </View>
                
                <View style={editProfileStyles.formGroup}>
                  <Text style={editProfileStyles.label}>First Name</Text>
                  <TextInput
                    style={editProfileStyles.input}
                    value={formData.firstName}
                    onChangeText={(text) => handleChange('firstName', text)}
                    placeholder="First Name"
                  />
                </View>
                
                <View style={editProfileStyles.formGroup}>
                  <Text style={editProfileStyles.label}>Last Name</Text>
                  <TextInput
                    style={editProfileStyles.input}
                    value={formData.lastName}
                    onChangeText={(text) => handleChange('lastName', text)}
                    placeholder="Last Name"
                  />
                </View>
                
                <View style={editProfileStyles.formGroup}>
                  <Text style={editProfileStyles.label}>Height</Text>
                  <TouchableOpacity 
                    style={[editProfileStyles.heightDisplay, { 
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      borderWidth: 1,
                      borderColor: '#ddd',
                      borderRadius: 8,
                      paddingHorizontal: 15,
                      paddingVertical: 12,
                      backgroundColor: '#f9f9f9'
                    }]}
                    activeOpacity={0.7}
                    onPress={toggleHeightPicker}
                  >
                    <Text style={{ fontSize: 16, color: '#333' }}>
                      {formattedHeight === '-' ? 'Not set' : formattedHeight}
                    </Text>
                    <IconSymbol name={showHeightPicker ? "chevron.up" : "chevron.down"} size={16} color="#999" />
                  </TouchableOpacity>
                  
                  {showHeightPicker && (
                    <View style={styles.pickerContainer}>
                      <View style={styles.pickerColumn}>
                        <Text style={styles.pickerLabel}>Feet</Text>
                        <ScrollView style={styles.picker} showsVerticalScrollIndicator={false}>
                          {feetOptions.map((value) => (
                            <TouchableOpacity
                              key={`feet-${value}`}
                              style={[
                                styles.pickerItem,
                                feet === value && styles.selectedPickerItem
                              ]}
                              onPress={() => onFeetChange(value)}
                            >
                              <Text 
                                style={[
                                  styles.pickerItemText,
                                  feet === value && styles.selectedPickerItemText
                                ]}
                              >
                                {value}
                              </Text>
                            </TouchableOpacity>
                          ))}
                        </ScrollView>
                      </View>
                      
                      <View style={styles.pickerColumn}>
                        <Text style={styles.pickerLabel}>Inches</Text>
                        <ScrollView style={styles.picker} showsVerticalScrollIndicator={false}>
                          {inchesOptions.map((value) => (
                            <TouchableOpacity
                              key={`inches-${value}`}
                              style={[
                                styles.pickerItem,
                                inches === value && styles.selectedPickerItem
                              ]}
                              onPress={() => onInchesChange(value)}
                            >
                              <Text 
                                style={[
                                  styles.pickerItemText,
                                  inches === value && styles.selectedPickerItemText
                                ]}
                              >
                                {value}
                              </Text>
                            </TouchableOpacity>
                          ))}
                        </ScrollView>
                      </View>
                    </View>
                  )}
                </View>
                
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
  pickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 15,
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
    marginBottom: 10,
  },
  picker: {
    height: 150,
  },
  pickerItem: {
    paddingVertical: 12,
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
}); 