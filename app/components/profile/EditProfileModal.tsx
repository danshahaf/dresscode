import React, { useState } from 'react';
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
  Keyboard
} from 'react-native';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { editProfileStyles } from '@/app/styles/profile.styles';

interface EditProfileModalProps {
  visible: boolean;
  onClose: () => void;
  user: {
    firstName: string;
    lastName: string;
    profileImage: string;
    height: string;
    location: string;
  };
  onSave: (userData: {
    firstName: string;
    lastName: string;
    location: string;
    profileImage: string;
  }) => void;
  onHeightPress: () => void;
  formattedHeight: string;
}

export const EditProfileModal = ({ 
  visible, 
  onClose, 
  user, 
  onSave,
  onHeightPress,
  formattedHeight
}: EditProfileModalProps) => {
  const [formData, setFormData] = useState({
    firstName: user.firstName,
    lastName: user.lastName,
    location: user.location,
    profileImage: user.profileImage
  });
  
  const handleChange = (field: string, value: string) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };
  
  const handleSubmit = () => {
    onSave(formData);
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
            <View style={editProfileStyles.modalContent}>
              <View style={editProfileStyles.modalHeader}>
                <Text style={editProfileStyles.modalTitle}>Edit Profile</Text>
                <TouchableOpacity onPress={onClose} style={editProfileStyles.closeButton}>
                  <IconSymbol name="xmark" size={24} color="#333" />
                </TouchableOpacity>
              </View>
              
              <View style={editProfileStyles.profileImageContainer}>
                <Image 
                  source={{ uri: formData.profileImage }} 
                  style={editProfileStyles.profileImage} 
                />
                <TouchableOpacity style={editProfileStyles.changeImageButton}>
                  <Text style={editProfileStyles.changeImageText}>Change Photo</Text>
                </TouchableOpacity>
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
                  style={editProfileStyles.heightDisplay}
                  onPress={onHeightPress}
                >
                  <Text style={editProfileStyles.heightDisplayText}>{formattedHeight}</Text>
                  <IconSymbol name="chevron.down" size={16} color="#999" />
                </TouchableOpacity>
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
              >
                <Text style={editProfileStyles.saveButtonText}>Save Changes</Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}; 