import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Linking } from 'react-native';
import { infoModalStyles } from './InfoModal';

export const HelpSupportContent = () => {
  console.log('Rendering HelpSupportContent');

  return (
    <View style={{ paddingVertical: 20, paddingHorizontal: 5 }}>
      <Text style={infoModalStyles.paragraph}>
        Welcome to the Dresscode Help & Support center. Here you can find answers to common questions about uploading outfits, receiving rankings, and managing your account.
      </Text>
      
      <Text style={infoModalStyles.sectionTitle}>Frequently Asked Questions</Text>
      
      <View style={infoModalStyles.bulletPoint}>
        <Text style={infoModalStyles.bullet}>•</Text>
        <Text style={infoModalStyles.bulletText}>
          <Text style={{ fontWeight: 'bold' }}>How do I upload an outfit?</Text>
          {'\n'}
          Go to the Scan tab and tap the camera icon to capture or select an outfit photo.
        </Text>
      </View>
      
      <View style={infoModalStyles.bulletPoint}>
        <Text style={infoModalStyles.bullet}>•</Text>
        <Text style={infoModalStyles.bulletText}>
          <Text style={{ fontWeight: 'bold' }}>How do I view my outfit rankings?</Text>
          {'\n'}
          Visit the Looks tab to see AI-generated rankings and feedback on your uploaded outfits.
        </Text>
      </View>
      
      <View style={infoModalStyles.bulletPoint}>
        <Text style={infoModalStyles.bullet}>•</Text>
        <Text style={infoModalStyles.bulletText}>
          <Text style={{ fontWeight: 'bold' }}>How can I edit my profile?</Text>
          {'\n'}
          Go to the Profile tab and tap on the edit button to update your details and preferences.
        </Text>
      </View>
      
      <View style={infoModalStyles.bulletPoint}>
        <Text style={infoModalStyles.bullet}>•</Text>
        <Text style={infoModalStyles.bulletText}>
          <Text style={{ fontWeight: 'bold' }}>How do I upgrade my subscription?</Text>
          {'\n'}
          Navigate to Profile → Account → Manage Subscription to view available plans and upgrade options.
        </Text>
      </View>
      
      <Text style={infoModalStyles.sectionTitle}>Tips for Using Dresscode</Text>
      
      <View style={infoModalStyles.bulletPoint}>
        <Text style={infoModalStyles.bullet}>•</Text>
        <Text style={infoModalStyles.bulletText}>
          <Text style={{ fontWeight: 'bold' }}>Upload Clear Images:</Text> Ensure your outfit photos are well-lit and focused for accurate AI evaluations.
        </Text>
      </View>
      
      <View style={infoModalStyles.bulletPoint}>
        <Text style={infoModalStyles.bullet}>•</Text>
        <Text style={infoModalStyles.bulletText}>
          <Text style={{ fontWeight: 'bold' }}>Explore Different Styles:</Text> Experiment with various looks and trends to see how the AI ranks your creativity.
        </Text>
      </View>
      
      {/* <Text style={infoModalStyles.sectionTitle}>Contact Support</Text>
      
      <Text style={infoModalStyles.paragraph}>
        If you need additional assistance, our support team is here to help:
      </Text>
      
      <View style={infoModalStyles.bulletPoint}>
        <Text style={infoModalStyles.bullet}>•</Text>
        <Text style={infoModalStyles.bulletText}>
          Email: support@dresscodeapp.com
        </Text>
      </View>
      
      <View style={infoModalStyles.bulletPoint}>
        <Text style={infoModalStyles.bullet}>•</Text>
        <Text style={infoModalStyles.bulletText}>
          Phone: (555) 987-6543 (Mon-Fri, 9am-5pm EST)
        </Text>
      </View>
      
      <TouchableOpacity 
        style={styles.supportButton}
        onPress={() => Linking.openURL('mailto:support@dresscodeapp.com')}
      >
        <Text style={styles.supportButtonText}>Email Support</Text>
      </TouchableOpacity> */}
    </View>
  );
};

const styles = StyleSheet.create({
  supportButton: {
    backgroundColor: '#cca702',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  supportButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
