import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ProfileHeader } from '@/app/components/profile/ProfileHeader';
import { SettingsSection, SettingItem, ToggleSetting } from '@/app/components/profile/SettingsSection';
import { SubscriptionSection } from '@/app/components/profile/SubscriptionSection';
import { EditProfileModal } from '@/app/components/profile/EditProfileModal';
import { HeightPickerModal } from '@/app/components/profile/HeightPickerModal';
import { SubscriptionModal } from '@/app/components/profile/SubscriptionModal';
import { InfoModal } from '@/app/components/profile/InfoModal';
import { HelpSupportContent } from '@/app/components/profile/HelpSupportContent';
import { TermsOfServiceContent } from '@/app/components/profile/TermsOfServiceContent';
import { PrivacyPolicyContent } from '@/app/components/profile/PrivacyPolicyContent';
import { ChangePasswordModal } from '@/app/components/profile/ChangePasswordModal';
import { profileScreenStyles, dimensions } from '@/app/styles/profile.screen.styles';

// Define types for form data
interface FormData {
  firstName: string;
  lastName: string;
  location: string;
  profileImage: string;
  notifications: boolean;
  darkMode: boolean;
  currentPlan: string;
}

export default function ProfileScreen() {
  // State for modal visibility
  const [modalVisible, setModalVisible] = useState(false);
  // State for height picker visibility
  const [heightPickerVisible, setHeightPickerVisible] = useState(false);
  // State for subscription modal
  const [subscriptionModalVisible, setSubscriptionModalVisible] = useState(false);
  // State for info modals
  const [helpSupportVisible, setHelpSupportVisible] = useState(false);
  const [termsVisible, setTermsVisible] = useState(false);
  const [privacyVisible, setPrivacyVisible] = useState(false);
  // State for change password modal
  const [changePasswordVisible, setChangePasswordVisible] = useState(false);
  
  // Set status bar to transparent
  useEffect(() => {
    StatusBar.setBarStyle('light-content');
    return () => {
      StatusBar.setBarStyle('dark-content');
    };
  }, []);
  
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
  
  // State for form data
  const [formData, setFormData] = useState<FormData>({
    firstName: user.firstName,
    lastName: user.lastName,
    location: user.location,
    profileImage: user.profileImage,
    notifications: true,
    darkMode: false,
    currentPlan: user.subscription
  });
  
  // Handle form input changes
  const handleChange = (field: keyof FormData, value: any) => {
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
  const handleSubmit = (updatedData: {
    firstName: string;
    lastName: string;
    location: string;
    profileImage: string;
  }) => {
    // Format height string
    const formattedHeight = getFormattedHeight();
    
    setUser({
      ...user,
      firstName: updatedData.firstName,
      lastName: updatedData.lastName,
      height: formattedHeight,
      location: updatedData.location,
      profileImage: updatedData.profileImage
    });
    setModalVisible(false);
  };
  
  // Handle height save
  const handleHeightSave = () => {
    setHeightPickerVisible(false);
  };

  // Handle logout
  const handleLogout = () => {
    console.log('Logging out...');
    // Implement logout logic here
  };

  // Add this to check if the modal is being triggered
  const handleHelpSupport = () => {
    console.log('Opening Help & Support modal');
    setHelpSupportVisible(true);
    
    // Add a timeout to check if the modal is visible
    setTimeout(() => {
      console.log('Help & Support modal visible:', helpSupportVisible);
    }, 500);
  };

  return (
    <View style={{ flex: 1 }}>
      <StatusBar translucent backgroundColor="transparent" />
      
      <ScrollView style={profileScreenStyles.scrollView}>
        {/* Profile Header */}
        <ProfileHeader 
          user={user} 
          onEditPress={() => setModalVisible(true)} 
          headerHeight={dimensions.headerHeight} 
        />
        
        <SafeAreaView style={profileScreenStyles.content} edges={['bottom', 'left', 'right']}>
          {/* App Settings */}
          <SettingsSection title="App Settings">
            <ToggleSetting 
              icon="bell" 
              label="Notifications" 
              value={formData.notifications}
              onValueChange={(value) => handleChange('notifications', value)}
            />
            
            <ToggleSetting 
              icon="moon" 
              label="Dark Mode" 
              value={formData.darkMode}
              onValueChange={(value) => handleChange('darkMode', value)}
            />
          </SettingsSection>
          
          {/* Account Settings */}
          <SettingsSection title="Account">
            <SettingItem 
              icon="envelope" 
              label="Email" 
              value={user.email}
              showArrow={false}
            />
            
            {/* Subscription Section */}
            <SubscriptionSection 
              subscription={user.subscription}
              onManagePress={() => setSubscriptionModalVisible(true)}
            />

            <SettingItem 
              icon="lock" 
              label="Change Password" 
              onPress={() => setChangePasswordVisible(true)}
            />
          </SettingsSection>
          
          {/* Support & About */}
          <SettingsSection title="Support & About">
            <SettingItem 
              icon="questionmark.circle" 
              label="Help & Support" 
              onPress={handleHelpSupport}
            />
            
            <SettingItem 
              icon="doc.text" 
              label="Terms of Service" 
              onPress={() => setTermsVisible(true)}
            />
            
            <SettingItem 
              icon="shield" 
              label="Privacy Policy" 
              onPress={() => setPrivacyVisible(true)}
            />
            
            <SettingItem 
              icon="info.circle" 
              label="About" 
              value="Version 1.0.0"
              showArrow={false}
            />
          </SettingsSection>
          
          {/* Logout Button */}
          <TouchableOpacity 
            style={profileScreenStyles.logoutButton}
            onPress={handleLogout}
          >
            <Text style={profileScreenStyles.logoutText}>Log Out</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </ScrollView>
      
      {/* Edit Profile Modal */}
      <EditProfileModal 
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        user={user}
        onSave={handleSubmit}
        onHeightPress={() => setHeightPickerVisible(true)}
        formattedHeight={getFormattedHeight()}
      />
      
      {/* Height Picker Modal */}
      <HeightPickerModal 
        visible={heightPickerVisible}
        onClose={() => setHeightPickerVisible(false)}
        feet={feet}
        inches={inches}
        onFeetChange={setFeet}
        onInchesChange={setInches}
        onSave={handleHeightSave}
      />
      
      {/* Subscription Modal */}
      <SubscriptionModal 
        visible={subscriptionModalVisible}
        onClose={() => setSubscriptionModalVisible(false)}
        currentPlan={user.subscription}
      />
      
      {/* Help & Support Modal */}
      <InfoModal
        visible={helpSupportVisible}
        onClose={() => setHelpSupportVisible(false)}
        title="Help & Support"
        content={<HelpSupportContent />}
      />
      
      {/* Terms of Service Modal */}
      <InfoModal
        visible={termsVisible}
        onClose={() => setTermsVisible(false)}
        title="Terms of Service"
        content={<TermsOfServiceContent />}
      />
      
      {/* Privacy Policy Modal */}
      <InfoModal
        visible={privacyVisible}
        onClose={() => setPrivacyVisible(false)}
        title="Privacy Policy"
        content={<PrivacyPolicyContent />}
      />
      
      {/* Change Password Modal */}
      <ChangePasswordModal
        visible={changePasswordVisible}
        onClose={() => setChangePasswordVisible(false)}
      />
    </View>
  );
}