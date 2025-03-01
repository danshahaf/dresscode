import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  Image, 
  StyleSheet, 
  ScrollView, 
  Dimensions, 
  TouchableOpacity,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Pressable
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Picker } from '@react-native-picker/picker';

export default function ProfileScreen() {
  // Get screen dimensions
  const screenWidth = Dimensions.get('window').width;
  const headerHeight = Dimensions.get('window').height / 2.5; // Larger header (40% of screen)

  // State for modal visibility
  const [modalVisible, setModalVisible] = useState(false);
  // State for height picker visibility
  const [heightPickerVisible, setHeightPickerVisible] = useState(false);
  
  // Mock user data - in a real app, this would come from your user state or API
  const [user, setUser] = useState({
    firstName: 'Mary',
    lastName: 'Jane',
    profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    height: '5\'7"',
    location: 'New York, NY',
    subscription: 'Premium Plan',
    email: 'mary.jane@example.com'
  });
  
  // Parse height into feet and inches
  const [feet, setFeet] = useState('5');
  const [inches, setInches] = useState('7');
  
  useEffect(() => {
    // Parse height when user data changes
    if (user.height) {
      const heightMatch = user.height.match(/(\d+)'(\d+)"/);
      if (heightMatch) {
        setFeet(heightMatch[1]);
        setInches(heightMatch[2]);
      }
    }
  }, [user.height]);
  
  // State for form inputs
  const [formData, setFormData] = useState({
    firstName: user.firstName,
    lastName: user.lastName,
    location: user.location,
    profileImage: user.profileImage
  });
  
  // Handle form input changes
  const handleChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };
  
  // Format height for display
  const getFormattedHeight = () => {
    return `${feet}'${inches}"`;
  };
  
  // Handle form submission
  const handleSubmit = () => {
    // Format height string
    const formattedHeight = getFormattedHeight();
    
    setUser({
      ...user,
      firstName: formData.firstName,
      lastName: formData.lastName,
      height: formattedHeight,
      location: formData.location,
      profileImage: formData.profileImage
    });
    setModalVisible(false);
  };

  // Generate feet options (4-7 feet)
  const feetOptions = [];
  for (let i = 4; i <= 7; i++) {
    feetOptions.push(i.toString());
  }

  // Generate inches options (0-11 inches)
  const inchesOptions = [];
  for (let i = 0; i <= 11; i++) {
    inchesOptions.push(i.toString());
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header Image Section */}
        <View style={[styles.headerImageContainer, { height: headerHeight }]}>
          <Image 
            source={{ uri: user.profileImage }} 
            style={styles.headerImage} 
          />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.5)', 'rgba(0,0,0,0.8)']}
            style={styles.gradient}
          >
            <View style={styles.nameRow}>
              <Text style={styles.userName}>{user.firstName} {user.lastName}</Text>
              <TouchableOpacity 
                style={styles.editButton}
                onPress={() => setModalVisible(true)}
              >
                <IconSymbol size={20} name="pencil" color="#fff" />
              </TouchableOpacity>
            </View>
            
            {/* Info Widgets inside header */}
            <View style={styles.headerWidgetsContainer}>
              <View style={styles.headerWidget}>
                <IconSymbol size={14} name="ruler.fill" color="#fff" />
                <Text style={styles.headerWidgetText}>{user.height}</Text>
              </View>
              
              <View style={styles.headerWidget}>
                <IconSymbol size={14} name="mappin" color="#fff" />
                <Text style={styles.headerWidgetText}>{user.location}</Text>
              </View>
            </View>
          </LinearGradient>
        </View>
        
        {/* Account Settings */}
        <View style={styles.content}>
          {/* Subscription Section */}
          <View style={styles.settingsSection}>
            <Text style={styles.settingsSectionTitle}>Subscription</Text>
            
            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <IconSymbol size={20} name="crown.fill" color="#cca702" />
                <View style={styles.settingTextContainer}>
                  <Text style={styles.settingLabel}>Current Plan</Text>
                  <Text style={styles.settingValue}>{user.subscription}</Text>
                </View>
              </View>
              <IconSymbol size={16} name="chevron.right" color="#999" />
            </View>
            
            <TouchableOpacity style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <IconSymbol size={20} name="creditcard" color="#333" />
                <View style={styles.settingTextContainer}>
                  <Text style={styles.settingLabel}>Manage Subscription</Text>
                </View>
              </View>
              <IconSymbol size={16} name="chevron.right" color="#999" />
            </TouchableOpacity>
            
            <TouchableOpacity style={[styles.settingItem, styles.dangerItem]}>
              <View style={styles.settingInfo}>
                <IconSymbol size={20} name="xmark.circle" color="#d9534f" />
                <View style={styles.settingTextContainer}>
                  <Text style={[styles.settingLabel, styles.dangerText]}>Cancel Subscription</Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
          
          {/* Account Section */}
          <View style={styles.settingsSection}>
            <Text style={styles.settingsSectionTitle}>Account</Text>
            
            <TouchableOpacity style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <IconSymbol size={20} name="envelope" color="#333" />
                <View style={styles.settingTextContainer}>
                  <Text style={styles.settingLabel}>Email</Text>
                  <Text style={styles.settingValue}>{user.email}</Text>
                </View>
              </View>
              <IconSymbol size={16} name="chevron.right" color="#999" />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <IconSymbol size={20} name="lock" color="#333" />
                <View style={styles.settingTextContainer}>
                  <Text style={styles.settingLabel}>Change Password</Text>
                </View>
              </View>
              <IconSymbol size={16} name="chevron.right" color="#999" />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <IconSymbol size={20} name="bell" color="#333" />
                <View style={styles.settingTextContainer}>
                  <Text style={styles.settingLabel}>Notifications</Text>
                </View>
              </View>
              <IconSymbol size={16} name="chevron.right" color="#999" />
            </TouchableOpacity>
          </View>
          
          {/* Support Section */}
          <View style={styles.settingsSection}>
            <Text style={styles.settingsSectionTitle}>Support</Text>
            
            <TouchableOpacity style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <IconSymbol size={20} name="questionmark.circle" color="#333" />
                <View style={styles.settingTextContainer}>
                  <Text style={styles.settingLabel}>Help Center</Text>
                </View>
              </View>
              <IconSymbol size={16} name="chevron.right" color="#999" />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <IconSymbol size={20} name="bubble.left.and.bubble.right" color="#333" />
                <View style={styles.settingTextContainer}>
                  <Text style={styles.settingLabel}>Contact Support</Text>
                </View>
              </View>
              <IconSymbol size={16} name="chevron.right" color="#999" />
            </TouchableOpacity>
          </View>
          
          {/* Logout Button */}
          <TouchableOpacity style={styles.logoutButton}>
            <Text style={styles.logoutText}>Log Out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      
      {/* Edit Profile Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.modalContainer}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Edit Profile</Text>
                <TouchableOpacity 
                  style={styles.closeButton}
                  onPress={() => setModalVisible(false)}
                >
                  <IconSymbol size={20} name="xmark" color="#333" />
                </TouchableOpacity>
              </View>
              
              {/* Profile Image */}
              <View style={styles.imageSection}>
                <Image 
                  source={{ uri: formData.profileImage }}
                  style={styles.profileImagePreview}
                />
                <TouchableOpacity style={styles.changeImageButton}>
                  <Text style={styles.changeImageText}>Change Photo</Text>
                </TouchableOpacity>
              </View>
              
              <ScrollView>
                {/* First Name */}
                <View style={styles.formGroup}>
                  <Text style={styles.label}>First Name</Text>
                  <TextInput
                    style={styles.input}
                    value={formData.firstName}
                    onChangeText={(text) => handleChange('firstName', text)}
                    placeholder="First Name"
                  />
                </View>
                
                {/* Last Name */}
                <View style={styles.formGroup}>
                  <Text style={styles.label}>Last Name</Text>
                  <TextInput
                    style={styles.input}
                    value={formData.lastName}
                    onChangeText={(text) => handleChange('lastName', text)}
                    placeholder="Last Name"
                  />
                </View>
                
                {/* Height Selector */}
                <View style={styles.formGroup}>
                  <Text style={styles.label}>Height</Text>
                  <Pressable 
                    style={styles.heightDisplay}
                    onPress={() => setHeightPickerVisible(true)}
                  >
                    <Text style={styles.heightDisplayText}>{getFormattedHeight()}</Text>
                    <IconSymbol size={16} name="chevron.down" color="#999" />
                  </Pressable>
                </View>
                
                {/* Location */}
                <View style={styles.formGroup}>
                  <Text style={styles.label}>Location</Text>
                  <TextInput
                    style={styles.input}
                    value={formData.location}
                    onChangeText={(text) => handleChange('location', text)}
                    placeholder="Location"
                  />
                </View>
              </ScrollView>
              
              {/* Save Button */}
              <TouchableOpacity 
                style={styles.saveButton}
                onPress={handleSubmit}
              >
                <Text style={styles.saveButtonText}>Save Changes</Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </Modal>
      
      {/* Height Picker Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={heightPickerVisible}
        onRequestClose={() => setHeightPickerVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setHeightPickerVisible(false)}>
          <View style={styles.pickerModalOverlay}>
            <TouchableWithoutFeedback onPress={() => {}}>
              <View style={styles.pickerContainer}>
                <View style={styles.pickerHeader}>
                  <TouchableOpacity 
                    onPress={() => setHeightPickerVisible(false)}
                    style={styles.pickerCancelButton}
                  >
                    <Text style={styles.pickerCancelText}>Cancel</Text>
                  </TouchableOpacity>
                  
                  <Text style={styles.pickerTitle}>Select Height</Text>
                  
                  <TouchableOpacity 
                    onPress={() => setHeightPickerVisible(false)}
                    style={styles.pickerDoneButton}
                  >
                    <Text style={styles.pickerDoneText}>Done</Text>
                  </TouchableOpacity>
                </View>
                
                <View style={styles.pickerContent}>
                  {/* Feet Picker */}
                  <View style={styles.pickerColumn}>
                    <Picker
                      selectedValue={feet}
                      onValueChange={(itemValue) => setFeet(itemValue)}
                      style={styles.picker}
                      itemStyle={styles.pickerItem}
                    >
                      {feetOptions.map((value) => (
                        <Picker.Item key={`feet-${value}`} label={`${value} ft`} value={value} />
                      ))}
                    </Picker>
                  </View>
                  
                  {/* Inches Picker */}
                  <View style={styles.pickerColumn}>
                    <Picker
                      selectedValue={inches}
                      onValueChange={(itemValue) => setInches(itemValue)}
                      style={styles.picker}
                      itemStyle={styles.pickerItem}
                    >
                      {inchesOptions.map((value) => (
                        <Picker.Item key={`inches-${value}`} label={`${value} in`} value={value} />
                      ))}
                    </Picker>
                  </View>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  headerImageContainer: {
    width: '100%',
    position: 'relative',
  },
  headerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '60%', // Increased gradient height
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingBottom: 15, // Reduced bottom padding
  },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  userName: {
    fontSize: 32, // Larger font
    fontWeight: 'bold',
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
    flex: 1,
  },
  editButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
  headerWidgetsContainer: {
    flexDirection: 'row',
    marginBottom: 8, // Reduced spacing
  },
  headerWidget: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  headerWidgetText: {
    color: '#fff',
    marginLeft: 5,
    fontSize: 12,
    fontWeight: '500',
    opacity: 0.9,
  },
  content: {
    padding: 20,
  },
  settingsSection: {
    marginBottom: 25,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
    overflow: 'hidden',
  },
  settingsSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
    paddingHorizontal: 15,
    paddingTop: 15,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingTextContainer: {
    marginLeft: 12,
  },
  settingLabel: {
    fontSize: 15,
    color: '#333',
  },
  settingValue: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  dangerItem: {
    borderBottomWidth: 0,
  },
  dangerText: {
    color: '#d9534f',
  },
  logoutButton: {
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 30,
  },
  logoutText: {
    color: '#d9534f',
    fontSize: 16,
    fontWeight: '600',
  },
  
  // Modal Styles
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
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
  imageSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImagePreview: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  changeImageButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
  },
  changeImageText: {
    color: '#333',
    fontWeight: '500',
    fontSize: 14,
  },
  formGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: '#cca702',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: Platform.OS === 'ios' ? 30 : 10,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  
  // Height Display
  heightDisplay: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    backgroundColor: '#fff',
  },
  heightDisplayText: {
    fontSize: 16,
    color: '#333',
  },
  
  // Picker Modal
  pickerModalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  pickerContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
  },
  pickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingHorizontal: 15,
    paddingVertical: 15,
  },
  pickerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  pickerCancelButton: {
    paddingHorizontal: 10,
  },
  pickerCancelText: {
    color: '#999',
    fontSize: 16,
  },
  pickerDoneButton: {
    paddingHorizontal: 10,
  },
  pickerDoneText: {
    color: '#cca702',
    fontSize: 16,
    fontWeight: '600',
  },
  pickerContent: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingBottom: Platform.OS === 'ios' ? 30 : 10,
  },
  pickerColumn: {
    flex: 1,
    alignItems: 'center',
  },
  picker: {
    width: 150,
    height: 200,
  },
  pickerItem: {
    fontSize: 18,
  },
});