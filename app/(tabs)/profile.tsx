import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity,
  StatusBar,
  Image,
  Switch,
  ActivityIndicator,
  Alert,
  StyleSheet
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ProfileHeader } from '@/app/components/profile/ProfileHeader';
import { SettingsSection, SettingItem, ToggleSetting } from '@/app/components/profile/SettingsSection';
import { SubscriptionSection } from '@/app/components/profile/SubscriptionSection';
import { EditProfileModal } from '@/app/components/profile/EditProfileModal';
import { SubscriptionModal } from '@/app/components/profile/SubscriptionModal';
import { InfoModal } from '@/app/components/profile/InfoModal';
import { HelpSupportContent } from '@/app/components/profile/HelpSupportContent';
import { TermsOfServiceContent } from '@/app/components/profile/TermsOfServiceContent';
import { PrivacyPolicyContent } from '@/app/components/profile/PrivacyPolicyContent';
import { ChangePasswordModal } from '@/app/components/profile/ChangePasswordModal';
import { profileScreenStyles, dimensions } from '@/app/styles/profile.screen.styles';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth';

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

// Import the local default profile image
const DEFAULT_PROFILE_IMAGE = require('@/assets/images/dummy-profile-image.png');



export default function ProfileScreen() {

  const { user, signOut } = useAuth();

  
  const router = useRouter();
  
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState<string>('');
  const [userProfile, setUserProfile] = useState<any>(null);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(true);

  // State for modal 
  const [modalVisible, setModalVisible] = useState(false);
  const [helpSupportVisible, setHelpSupportVisible] = useState(false);
  const [termsVisible, setTermsVisible] = useState(false);
  const [privacyVisible, setPrivacyVisible] = useState(false);
  
  // Set status bar to transparent
  useEffect(() => {
    StatusBar.setBarStyle('light-content');
    return () => {
      StatusBar.setBarStyle('dark-content');
    };
  }, []);
  
  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        
        // Get user email from auth
        const { data: userData } = await supabase.auth.getUser();
        if (userData?.user?.email) {
          setUserEmail(userData.user.email);
        }
        
        // Get user profile data
        if (userData?.user?.id) {
          const { data: profileData, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('user_id', userData.user.id)
            .single();
            
          if (error && error.code !== 'PGRST116') {
            throw error;
          }
          
          if (profileData) {
            setUserProfile(profileData);
            // if notifications_enabled is not undefined, set notificationsEnabled to true or false
            if (profileData.notifications_enabled !== undefined) {
              setNotificationsEnabled(profileData.notifications_enabled);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        Alert.alert('Error', 'Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, []);
  
  // Extract name from user metadata or use default
  const getUserName = () => {
    const fullName = user?.user_metadata?.full_name || '';
    if (fullName) {
      const nameParts = fullName.split(' ');
      return {
        firstName: nameParts[0] || 'User',
        lastName: nameParts.length > 1 ? nameParts.slice(1).join(' ') : ''
      };
    }
    return { firstName: 'User', lastName: '' };
  };
  
  const { firstName, lastName } = getUserName();
  
  // Prepare user data with profile image handling
  const getUserProfileImage = () => {
    try {
      console.log('Profile image URL from DB:', userProfile?.profile_image);
      
      if (userProfile?.profile_image) {
        // Make sure the URL is valid and add cache-busting parameter
        const imageUrl = `${userProfile.profile_image}?t=${Date.now()}`;
        console.log('Using profile image URL with cache-busting:', imageUrl);
        return { uri: imageUrl };
      }
      // Return the default image
      console.log('Using default profile image');
      return DEFAULT_PROFILE_IMAGE;
    } catch (error) {
      console.error('Error getting profile image:', error);
      return DEFAULT_PROFILE_IMAGE;
    }
  };
  
  // Format height from feet and inches
  const formatHeightFromDB = (feetVal: number | null, inchesVal: number | null) => {
    if (feetVal === null || inchesVal === null) return '-';
    return `${feetVal}'${inchesVal}"`;
  };
  
  // Mock user data - in a real app, this would come from your user state or API
  const [userData, setUserData] = useState({
    firstName: firstName,
    lastName: lastName,
    profileImage: getUserProfileImage(),
    height: formatHeightFromDB(userProfile?.height_feet, userProfile?.height_inches),
    location: userProfile?.location || '-',
    subscription: userProfile?.subscription_plan || 'Missing',
    email: userEmail
  });
  
  // Update user data when profile is loaded
  useEffect(() => {
    if (userProfile || userEmail) {
      console.log('Profile data loaded:', userProfile);
      console.log('Height feet from DB:', userProfile?.height_feet);
      console.log('Height inches from DB:', userProfile?.height_inches);
      
      setUserData({
        firstName: userProfile?.first_name || firstName,
        lastName: userProfile?.last_name || lastName,
        profileImage: getUserProfileImage(),
        height: formatHeightFromDB(userProfile?.height_feet, userProfile?.height_inches),
        location: userProfile?.location || '-',
        subscription: userProfile?.subscription_plan + ' Plan' || 'Missing Plan',
        email: userEmail
      });
      
      // Update feet and inches state from database values
      if (userProfile?.height_feet !== null && userProfile?.height_feet !== undefined) {
        setFeet(userProfile.height_feet.toString());
        console.log('Setting feet to:', userProfile.height_feet.toString());
      }
      
      if (userProfile?.height_inches !== null && userProfile?.height_inches !== undefined) {
        setInches(userProfile.height_inches.toString());
        console.log('Setting inches to:', userProfile.height_inches.toString());
      }
    }
  }, [userProfile, userEmail]);
  
  // Parse height into feet and inches
  const [feet, setFeet] = useState('5');
  const [inches, setInches] = useState('7');
  
  useEffect(() => {
    // Parse height when user data changes
    if (userData.height && userData.height !== '-') {
      const heightMatch = userData.height.match(/(\d+)'(\d+)"/);
      if (heightMatch) {
        setFeet(heightMatch[1]);
        setInches(heightMatch[2]);
      }
    }
  }, [userData.height]);
  
  // State for form data
  const [formData, setFormData] = useState<FormData>({
    firstName: userData.firstName,
    lastName: userData.lastName,
    location: userData.location,
    profileImage: typeof userData.profileImage === 'string' ? userData.profileImage : '',
    notifications: true,
    darkMode: true,
    currentPlan: userData.subscription
  });
  
  // Update form data when user data changes
  useEffect(() => {
    setFormData({
      firstName: userData.firstName,
      lastName: userData.lastName,
      location: userData.location,
      profileImage: typeof userData.profileImage === 'string' ? userData.profileImage : '',
      notifications: notificationsEnabled,
      darkMode: darkModeEnabled,
      currentPlan: userData.subscription
    });
  }, [userData]);
  
  // Handle form input changes
  const handleChange = async (field: keyof FormData, value: any) => {
    setFormData({
      ...formData,
      [field]: value
    });
    // If it's the notifications field, update the DB
    if (field === 'notifications') {
      setNotificationsEnabled(value);

      if (user) {
        // Update the profiles table
        const { error } = await supabase
          .from('profiles')
          .update({ notifications_enabled: value })
          .eq('user_id', user.id);

        if (error) {
          console.error('Error updating notifications_enabled:', error);
          Alert.alert('Error', 'Could not update notifications preference.');
        }
      }
    }
  };
  
  // Format height for display
  const getFormattedHeight = () => {
    if (!feet || !inches) return '-';
    return `${feet}'${inches}"`;
  };
  
  // Handle form submission
  const handleSubmit = async (updatedData: {
    firstName: string;
    lastName: string;
    location: string;
    profileImage: any; // Changed from string to any to handle object with uri
  }) => {
    try {
      setLoading(true);
      
      console.log('Received updated data:', updatedData);
      
      // Format height string
      const formattedHeight = getFormattedHeight();
      
      // Determine profile image (could be a string URL or an object with uri)
      let profileImageValue;
      
      if (updatedData.profileImage) {
        if (typeof updatedData.profileImage === 'string') {
          profileImageValue = updatedData.profileImage;
          console.log('Profile image is a string URL:', profileImageValue);
        } else if (updatedData.profileImage.uri) {
          profileImageValue = updatedData.profileImage.uri;
          console.log('Profile image is an object with URI:', profileImageValue);
        } else {
          profileImageValue = DEFAULT_PROFILE_IMAGE;
          console.log('Using default profile image (no valid image found)');
        }
      } else {
        profileImageValue = DEFAULT_PROFILE_IMAGE;
        console.log('No profile image provided, using default');
      }
      
      // Update local state
      setUserData({
        ...userData,
        firstName: updatedData.firstName,
        lastName: updatedData.lastName,
        height: formattedHeight,
        location: updatedData.location,
        profileImage: typeof profileImageValue === 'string' 
          ? { uri: profileImageValue } 
          : profileImageValue
      });
      
      // Update form data
      setFormData({
        ...formData,
        firstName: updatedData.firstName,
        lastName: updatedData.lastName,
        location: updatedData.location,
        profileImage: typeof profileImageValue === 'string' ? profileImageValue : ''
      });
      
      // Update profile in database if user is logged in
      if (user) {
        const heightFeet = formattedHeight !== '-' ? parseInt(feet) : null;
        const heightInches = formattedHeight !== '-' ? parseInt(inches) : null;
          
        console.log('Updating profile with height:', heightFeet, 'feet,', heightInches, 'inches');
        console.log('User location:', updatedData.location);
        
        // Check if profile exists
        const { data: existingProfile, error: checkError } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', user.id);
          
        if (checkError) {
          console.error('Error checking profile existence:', checkError);
        }
        
        const profileExists = existingProfile && existingProfile.length > 0;
        console.log('Profile exists:', profileExists);
        
        // Prepare profile data
        const profileData = {
          first_name: updatedData.firstName,
          last_name: updatedData.lastName,
          location: updatedData.location,
          height_feet: heightFeet,
          height_inches: heightInches,
          // Always update profile image if it's provided as a string URL
          ...(typeof profileImageValue === 'string' ? 
             { profile_image: profileImageValue } : {})
        };
        
        console.log('Profile data to update:', profileData);
        
        let error;
        
        if (profileExists) {
          // Update existing profile
          const { error: updateError } = await supabase
            .from('profiles')
            .update(profileData)
            .eq('user_id', user.id);
            
          error = updateError;
        } else {
          // Create new profile
          const { error: insertError } = await supabase
            .from('profiles')
            .insert([
              {
                user_id: user.id,
                ...profileData
              }
            ]);
            
          error = insertError;
        }
          
        if (error) {
          console.error('Supabase update/insert error:', error);
          throw error;
        }
        
        // Refresh user profile data after update
        const { data: refreshedProfile, error: refreshError } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', user.id);
          
        if (refreshError) {
          console.error('Error refreshing profile:', refreshError);
        } else if (refreshedProfile && refreshedProfile.length > 0) {
          setUserProfile(refreshedProfile[0]);
          console.log('Updated profile:', refreshedProfile[0]);
        } else {
          console.log('No profile found after update/insert');
        }
      }
      
      setModalVisible(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };
  
  // Handle logout
  const handleLogout = async () => {
    try {
      await signOut();
      router.replace('/(auth)/login');
    } catch (error) {
      console.error('Error signing out:', error);
      Alert.alert('Error', 'Failed to sign out');
    }
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

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#cca702" />
      </SafeAreaView>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <StatusBar translucent backgroundColor="transparent" />
      
      <ScrollView style={profileScreenStyles.scrollView}>
        {/* Profile Header */}
        <ProfileHeader 
          user={userData} 
          onEditPress={() => setModalVisible(true)} 
          headerHeight={dimensions.headerHeight} 
        />
        
        <SafeAreaView style={profileScreenStyles.content} edges={['bottom', 'left', 'right']}>
          
          {/* Account Settings */}
          <SettingsSection title="Account">
            <SettingItem 
              icon="envelope" 
              label="Email" 
              value={userEmail || '-'}
              showArrow={false}
            />
            
            {/* Subscription Section */}
            <SubscriptionSection 
              subscription={userData.subscription}
              onManagePress={() => setShowSubscriptionModal(true)}
            />

            <ToggleSetting 
              icon="bell" 
              label="Notifications" 
              value={formData.notifications}
              onValueChange={(value) => handleChange('notifications', value)}
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
        user={userData}
        onSave={handleSubmit}
        feet={feet}
        inches={inches}
        onFeetChange={(value) => {
          console.log('Feet changed to:', value);
          setFeet(value);
        }}
        onInchesChange={(value) => {
          console.log('Inches changed to:', value);
          setInches(value);
        }}
        formattedHeight={getFormattedHeight()}
      />
      
      {/* Subscription Modal */}
      <SubscriptionModal 
        visible={showSubscriptionModal}
        onClose={() => setShowSubscriptionModal(false)}
        currentPlan={userData.subscription}
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
        visible={showChangePasswordModal}
        onClose={() => setShowChangePasswordModal(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
  },
});