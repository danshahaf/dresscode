import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  Modal, 
  StyleSheet,
  TextInput,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { editProfileStyles } from '@/app/styles/profile.styles';

interface ChangePasswordModalProps {
  visible: boolean;
  onClose: () => void;
}

export const ChangePasswordModal = ({ 
  visible, 
  onClose
}: ChangePasswordModalProps) => {
  const insets = useSafeAreaInsets();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Reset form when modal closes
  const handleClose = () => {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setPasswordError('');
    onClose();
  };
  
  // Validate passwords and handle save
  const handleSave = () => {
    // Reset error message
    setPasswordError('');
    
    // Check if all fields are filled
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError('Please fill in all password fields');
      return;
    }
    
    // Check if new password and confirm password match
    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }
    
    // Check password strength
    if (newPassword.length < 8) {
      setPasswordError('New password must be at least 8 characters long');
      return;
    }
    
    if (!/[A-Z]/.test(newPassword)) {
      setPasswordError('Password must contain at least one uppercase letter');
      return;
    }
    
    if (!/[a-z]/.test(newPassword)) {
      setPasswordError('Password must contain at least one lowercase letter');
      return;
    }
    
    if (!/\d/.test(newPassword)) {
      setPasswordError('Password must contain at least one number');
      return;
    }
    
    // If all validations pass, proceed with password change
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      Alert.alert(
        'Success',
        'Your password has been updated successfully.',
        [{ text: 'OK', onPress: handleClose }]
      );
    }, 1000);
  };
  
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <View style={editProfileStyles.modalOverlay}>
          <View style={editProfileStyles.modalContent}>
            <View style={editProfileStyles.modalHeader}>
              <Text style={editProfileStyles.modalTitle}>Change Password</Text>
              <TouchableOpacity 
                onPress={handleClose}
                style={editProfileStyles.closeButton}
              >
                <IconSymbol name="xmark" size={24} color="#333" />
              </TouchableOpacity>
            </View>
            
            <ScrollView>
              {/* Current Password */}
              <View style={editProfileStyles.formGroup}>
                <Text style={editProfileStyles.label}>Current Password</Text>
                <TextInput
                  style={editProfileStyles.input}
                  secureTextEntry
                  value={currentPassword}
                  onChangeText={setCurrentPassword}
                  placeholder="Enter current password"
                />
              </View>
              
              {/* New Password */}
              <View style={editProfileStyles.formGroup}>
                <Text style={editProfileStyles.label}>New Password</Text>
                <TextInput
                  style={editProfileStyles.input}
                  secureTextEntry
                  value={newPassword}
                  onChangeText={setNewPassword}
                  placeholder="Enter new password"
                />
              </View>
              
              {/* Confirm New Password */}
              <View style={editProfileStyles.formGroup}>
                <Text style={editProfileStyles.label}>Confirm New Password</Text>
                <TextInput
                  style={[
                    editProfileStyles.input,
                    newPassword && confirmPassword && newPassword !== confirmPassword 
                      ? { borderColor: '#e53935' } 
                      : {}
                  ]}
                  secureTextEntry
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  placeholder="Confirm new password"
                />
              </View>
              
              {/* Password requirements */}
              <View style={styles.passwordRequirements}>
                <Text style={styles.requirementsTitle}>Password Requirements:</Text>
                <View style={styles.requirementItem}>
                  <IconSymbol 
                    name={newPassword.length >= 8 ? "checkmark.circle.fill" : "circle"} 
                    size={16} 
                    color={newPassword.length >= 8 ? "#4CAF50" : "#ccc"} 
                  />
                  <Text style={styles.requirementText}>At least 8 characters</Text>
                </View>
                <View style={styles.requirementItem}>
                  <IconSymbol 
                    name={/[A-Z]/.test(newPassword) ? "checkmark.circle.fill" : "circle"} 
                    size={16} 
                    color={/[A-Z]/.test(newPassword) ? "#4CAF50" : "#ccc"} 
                  />
                  <Text style={styles.requirementText}>At least 1 uppercase letter</Text>
                </View>
                <View style={styles.requirementItem}>
                  <IconSymbol 
                    name={/[a-z]/.test(newPassword) ? "checkmark.circle.fill" : "circle"} 
                    size={16} 
                    color={/[a-z]/.test(newPassword) ? "#4CAF50" : "#ccc"} 
                  />
                  <Text style={styles.requirementText}>At least 1 lowercase letter</Text>
                </View>
                <View style={styles.requirementItem}>
                  <IconSymbol 
                    name={/\d/.test(newPassword) ? "checkmark.circle.fill" : "circle"} 
                    size={16} 
                    color={/\d/.test(newPassword) ? "#4CAF50" : "#ccc"} 
                  />
                  <Text style={styles.requirementText}>At least 1 number</Text>
                </View>
              </View>
              
              {/* Password match indicator */}
              {newPassword && confirmPassword && (
                <View style={styles.matchIndicator}>
                  <IconSymbol 
                    name={newPassword === confirmPassword ? "checkmark.circle.fill" : "xmark.circle.fill"} 
                    size={16} 
                    color={newPassword === confirmPassword ? "#4CAF50" : "#e53935"} 
                  />
                  <Text 
                    style={[
                      styles.matchText,
                      { color: newPassword === confirmPassword ? "#4CAF50" : "#e53935" }
                    ]}
                  >
                    {newPassword === confirmPassword ? "Passwords match" : "Passwords do not match"}
                  </Text>
                </View>
              )}
              
              {/* Error message */}
              {passwordError ? (
                <Text style={styles.errorText}>{passwordError}</Text>
              ) : null}
              
              {/* Save Button */}
              <TouchableOpacity 
                style={editProfileStyles.saveButton}
                onPress={handleSave}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={editProfileStyles.saveButtonText}>Update Password</Text>
                )}
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  passwordRequirements: {
    marginTop: 10,
    marginBottom: 15,
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 8,
  },
  requirementsTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 10,
    color: '#555',
  },
  requirementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  requirementText: {
    fontSize: 14,
    color: '#555',
    marginLeft: 8,
  },
  matchIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  matchText: {
    marginLeft: 5,
    fontSize: 14,
  },
  errorText: {
    color: '#e53935',
    marginBottom: 15,
    fontSize: 14,
  }
}); 