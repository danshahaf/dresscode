import React from 'react';
import { View, Text, Image, TouchableOpacity, Dimensions, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { profileStyles } from '@/app/styles/profile.styles';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface ProfileHeaderProps {
  user: {
    firstName: string;
    lastName: string;
    profileImage: any; // Accept any type for profileImage
    height: string;
    location: string;
  };
  onEditPress: () => void;
  headerHeight: number;
}

export const ProfileHeader = ({ user, onEditPress, headerHeight }: ProfileHeaderProps) => {
  const insets = useSafeAreaInsets();
  const statusBarHeight = StatusBar.currentHeight || insets.top;

  // Handle different types of profile images (string URL or require object)
  const getProfileImageSource = () => {
    try {
      if (typeof user.profileImage === 'string') {
        return { uri: user.profileImage };
      } else {
        return user.profileImage;
      }
    } catch (error) {
      console.error('Error getting profile image source:', error);
      return require('@/assets/images/dummy-profile-image.png');
    }
  };

  // Debug log to check what values we have
  console.log('User height:', user.height);
  console.log('User location:', user.location);

  return (
    <View style={[profileStyles.headerImageContainer, { height: headerHeight }]}>
      <Image 
        source={getProfileImageSource()} 
        style={profileStyles.headerImage}
        defaultSource={require('@/assets/images/dummy-profile-image.png')}
        onError={(e) => {
          console.error('Image loading error:', e.nativeEvent.error);
        }}
      />
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.5)', 'rgba(0,0,0,0.8)']}
        style={[profileStyles.gradient, { paddingTop: statusBarHeight + 20 }]}
      >
        <View style={profileStyles.nameRow}>
          <Text style={profileStyles.userName}>{user.firstName} {user.lastName}</Text>
          <TouchableOpacity 
            style={profileStyles.editButton}
            onPress={onEditPress}
          >
            <IconSymbol size={20} name="pencil" color="#fff" />
          </TouchableOpacity>
        </View>
        
        {/* Info Widgets inside header - always show these */}
        <View style={profileStyles.headerWidgetsContainer}>
          <View style={profileStyles.headerWidget}>
            <IconSymbol size={14} name="ruler" color="#cca702" />
            <Text style={profileStyles.headerWidgetText}>{user.height}</Text>
          </View>
          
          <View style={profileStyles.headerWidget}>
            <IconSymbol size={14} name="location" color="#cca702" />
            <Text style={profileStyles.headerWidgetText}>{user.location}</Text>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
}; 