import React from 'react';
import { View, Text, TouchableOpacity, Switch } from 'react-native';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { profileStyles } from '@/app/styles/profile.styles';

interface SettingsSectionProps {
  title: string;
  children: React.ReactNode;
}

export const SettingsSection = ({ title, children }: SettingsSectionProps) => {
  return (
    <View style={profileStyles.settingsSection}>
      <Text style={profileStyles.settingsSectionTitle}>{title}</Text>
      {children}
    </View>
  );
};

interface SettingItemProps {
  icon: string;
  label: string;
  value?: string;
  subtitle?: React.ReactNode;
  showArrow?: boolean;
  onPress?: () => void;
  children?: React.ReactNode;
}

export const SettingItem = ({ 
  icon, 
  label, 
  value, 
  subtitle,
  showArrow = true, 
  onPress, 
  children 
}: SettingItemProps) => {
  return (
    <TouchableOpacity 
      style={profileStyles.settingItem}
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={profileStyles.settingInfo}>
        <IconSymbol size={20} name={icon} color={icon === "star.fill" ? "#cca702" : "#333"} />
        <View style={profileStyles.settingTextContainer}>
          <Text style={profileStyles.settingLabel}>{label}</Text>
          {subtitle && subtitle}
          {value && <Text style={profileStyles.settingValue}>{value}</Text>}
        </View>
      </View>
      {children}
      {showArrow && onPress && <IconSymbol size={16} name="chevron.right" color="#999" />}
    </TouchableOpacity>
  );
};

interface ToggleSettingProps {
  icon: string;
  label: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
}

export const ToggleSetting = ({ icon, label, value, onValueChange }: ToggleSettingProps) => {
  return (
    <View style={profileStyles.settingItem}>
      <View style={profileStyles.settingInfo}>
        <IconSymbol size={20} name={icon} color="#333" />
        <View style={profileStyles.settingTextContainer}>
          <Text style={profileStyles.settingLabel}>{label}</Text>
        </View>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: '#d1d1d1', true: '#cca702' }}
        thumbColor="#fff"
      />
    </View>
  );
}; 