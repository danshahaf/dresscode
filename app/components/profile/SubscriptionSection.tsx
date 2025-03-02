import React from 'react';
import { View, Text } from 'react-native';
import { SettingItem } from './SettingsSection';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { profileStyles } from '@/app/styles/profile.styles';

interface SubscriptionSectionProps {
  subscription: string;
  onManagePress: () => void;
}

export const SubscriptionSection = ({ subscription, onManagePress }: SubscriptionSectionProps) => {
  return (
    <SettingItem 
      icon="creditcard" 
      label="Manage Subscription"
      onPress={onManagePress}
      subtitle={
        <View style={profileStyles.planSubtitleContainer}>
          <IconSymbol size={12} name="star.fill" color="#cca702" />
          <Text style={profileStyles.planSubtitleText}>{subscription}</Text>
        </View>
      }
    />
  );
}; 