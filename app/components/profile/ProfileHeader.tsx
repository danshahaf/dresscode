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
    profileImage: string;
    height: string;
    location: string;
  };
  onEditPress: () => void;
  headerHeight: number;
}

export const ProfileHeader = ({ user, onEditPress, headerHeight }: ProfileHeaderProps) => {
  const insets = useSafeAreaInsets();
  const statusBarHeight = StatusBar.currentHeight || insets.top;
  
  return (
    <View style={[profileStyles.headerImageContainer, { height: headerHeight }]}>
      <Image 
        source={{ uri: user.profileImage }} 
        style={profileStyles.headerImage} 
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
        
        {/* Info Widgets inside header */}
        <View style={profileStyles.headerWidgetsContainer}>
          <View style={profileStyles.headerWidget}>
            <IconSymbol size={14} name="ruler.fill" color="#fff" />
            <Text style={profileStyles.headerWidgetText}>{user.height}</Text>
          </View>
          
          <View style={profileStyles.headerWidget}>
            <IconSymbol size={14} name="mappin" color="#fff" />
            <Text style={profileStyles.headerWidgetText}>{user.location}</Text>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
}; 