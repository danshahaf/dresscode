import React, { useState, useEffect, useRef } from 'react';
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
  StyleSheet,
  RefreshControl
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
import { useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth';
import * as Notifications from 'expo-notifications';

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

// Simple profile interface
interface Profile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  profileImage: string | null;
  location: string | null;
  subscription: string;
  heightFeet: number | null;
  heightInches: number | null;
  notificationsEnabled: boolean;
  darkModeEnabled: boolean;
  pushToken: string | null;
}

export default function ProfileScreen() {
  // Replace useUserProfile with local state
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { user, signOut } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  
  const router = useRouter();
  
  const [loading, setLoading] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);

  // State for modal 
  const [modalVisible, setModalVisible] = useState(false);
  const [helpSupportVisible, setHelpSupportVisible] = useState(false);
  const [termsVisible, setTermsVisible] = useState(false);
  const [privacyVisible, setPrivacyVisible] = useState(false);

  // Use refs to track previous values and prevent unnecessary updates
  const prevProfileRef = useRef(profile);
  const isUpdatingRef = useRef(false);

  // Simple function to fetch profile data
  const fetchProfile = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();
        
      if (error) {
        console.error('Error fetching profile:', error);
        setError('Failed to load profile data');
        return;
      }
      
      if (data) {
        // Transform the data to match our Profile interface
        const profileData: Profile = {
          id: data.id,
          firstName: data.first_name || 'User',
          lastName: data.last_name || '',
          email: user.email || '',
          profileImage: data.profile_image,
          location: data.location,
          subscription: data.subscription_plan || 'Free Plan',
          heightFeet: data.height_feet,
          heightInches: data.height_inches,
          notificationsEnabled: data.notifications_enabled || false,
          darkModeEnabled: data.dark_mode_enabled || false,
          pushToken: data.push_token
        };
        
        setProfile(profileData);
        setNotificationsEnabled(profileData.notificationsEnabled);
        setDarkModeEnabled(profileData.darkModeEnabled);
      }
    } catch (err) {
      console.error('Error in fetchProfile:', err);
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Simple function to refresh profile
  const refreshProfile = async () => {
    await fetchProfile();
  };
  
  // Set status bar to transparent
  useEffect(() => {
    StatusBar.setBarStyle('light-content');
    return () => {
      StatusBar.setBarStyle('dark-content');
    };
  }, []);
  
  // Load profile data when component mounts or user changes
  useEffect(() => {
    if (user) {
      fetchProfile();
    } else {
      setProfile(null);
    }
  }, [user]);
  
  // Format height from feet and inches
  const formatHeightFromDB = (feetVal: number | null, inchesVal: number | null) => {
    if (feetVal === null || inchesVal === null) return '-';
    return `${feetVal}'${inchesVal}"`;
  };
  
  // User data from profile
  const userData = {
    firstName: profile?.firstName || 'User',
    lastName: profile?.lastName || '',
    profileImage: profile?.profileImage
      ? { uri: `${profile.profileImage}?t=${Date.now()}` }
      : DEFAULT_PROFILE_IMAGE,
    height: formatHeightFromDB(profile?.heightFeet || null, profile?.heightInches || null),
    location: profile?.location || '-',
    subscription: profile?.subscription || 'Free Plan',
    email: profile?.email || user?.email || '-'
  };
  
  // Parse height into feet and inches
  const [feet, setFeet] = useState(profile?.heightFeet?.toString() || '5');
  const [inches, setInches] = useState(profile?.heightInches?.toString() || '7');
  
  // Update feet and inches when profile changes - only when profile actually changes
  useEffect(() => {
    if (profile !== prevProfileRef.current) {
      prevProfileRef.current = profile;
      
      if (profile?.heightFeet !== null && profile?.heightFeet !== undefined) {
        setFeet(profile.heightFeet.toString());
      }
      
      if (profile?.heightInches !== null && profile?.heightInches !== undefined) {
        setInches(profile.heightInches.toString());
      }
      
      // Update notification and dark mode settings
      setNotificationsEnabled(profile?.notificationsEnabled || false);
      setDarkModeEnabled(profile?.darkModeEnabled || false);
    }
  }, [profile]);
  
  // State for form data
  const [formData, setFormData] = useState<FormData>({
    firstName: userData.firstName,
    lastName: userData.lastName,
    location: userData.location,
    profileImage: userData.profileImage && userData.profileImage.uri ? userData.profileImage.uri : '',
    notifications: notificationsEnabled,
    darkMode: darkModeEnabled,
    currentPlan: userData.subscription
  });
  
  // Update form data when user data changes - only when necessary
  useEffect(() => {
    if (profile !== prevProfileRef.current) {
      setFormData({
        firstName: userData.firstName,
        lastName: userData.lastName,
        location: userData.location,
        profileImage: userData.profileImage && userData.profileImage.uri
          ? userData.profileImage.uri
          : '',
        notifications: notificationsEnabled,
        darkMode: darkModeEnabled,
        currentPlan: userData.subscription
      });
    }
  }, [userData, notificationsEnabled, darkModeEnabled]);
  
  // Handle refresh
  const onRefresh = async () => {
    if (isUpdatingRef.current) return;
    
    setRefreshing(true);
    isUpdatingRef.current = true;
    try {
      await refreshProfile();
    } finally {
      setRefreshing(false);
      isUpdatingRef.current = false;
    }
  };
  
  // Handle form input changes
  const handleChange = async (field: keyof FormData, value: any) => {
    // Update the form data locally
    setFormData({
      ...formData,
      [field]: value
    });
    
    if (field === 'notifications' && user && !isUpdatingRef.current) {
      isUpdatingRef.current = true;
      try {
        // Simplified notification toggle - just update the database
        const { error } = await supabase
          .from('profiles')
          .update({ notifications_enabled: value })
          .eq('user_id', user.id);
          
        if (error) {
          console.error("Error updating notifications:", error);
        } else {
          setNotificationsEnabled(value);
          // Refresh profile to get updated settings
          await refreshProfile();
        }
      } finally {
        isUpdatingRef.current = false;
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
    if (isUpdatingRef.current) return;
    
    try {
      setLoading(true);
      isUpdatingRef.current = true;
      
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
        
        // Refresh profile data after update
        await refreshProfile();
      }
      
      setModalVisible(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Failed to update profile');
    } finally {
      setLoading(false);
      isUpdatingRef.current = false;
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
      <SafeAreaView style={profileScreenStyles.loadingContainer}>
        <ActivityIndicator size="large" color="#cca702" />
      </SafeAreaView>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <StatusBar translucent backgroundColor="transparent" />
      
      <ScrollView
        style={profileScreenStyles.scrollView}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh} 
            tintColor="#cca702" 
          />
        }
      >

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
              value={userData.email || '-'}
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
        formattedHeight={userData.height}
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