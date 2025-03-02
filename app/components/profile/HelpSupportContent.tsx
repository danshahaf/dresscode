import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Linking } from 'react-native';
import { infoModalStyles } from './InfoModal';

export const HelpSupportContent = () => {
  console.log('Rendering HelpSupportContent');

  return (
    <View style={{ paddingVertical: 20, paddingHorizontal: 5 }}>
      <Text style={infoModalStyles.paragraph}>
        Welcome to our Help & Support center. Here you can find answers to common questions about your fitness journey and ways to contact our support team.
      </Text>
      
      <Text style={infoModalStyles.sectionTitle}>Frequently Asked Questions</Text>
      
      <View style={infoModalStyles.bulletPoint}>
        <Text style={infoModalStyles.bullet}>•</Text>
        <Text style={infoModalStyles.bulletText}>
          <Text style={{ fontWeight: 'bold' }}>How do I track my workouts?</Text>
          {'\n'}
          Go to the Workout tab and tap "Start Workout". Choose your workout type and follow the prompts to track your sets, reps, and weights.
        </Text>
      </View>
      
      <View style={infoModalStyles.bulletPoint}>
        <Text style={infoModalStyles.bullet}>•</Text>
        <Text style={infoModalStyles.bulletText}>
          <Text style={{ fontWeight: 'bold' }}>How do I view my progress?</Text>
          {'\n'}
          Visit the Progress tab to see charts and statistics about your fitness journey, including weight lifted, body measurements, and workout frequency.
        </Text>
      </View>
      
      <View style={infoModalStyles.bulletPoint}>
        <Text style={infoModalStyles.bullet}>•</Text>
        <Text style={infoModalStyles.bulletText}>
          <Text style={{ fontWeight: 'bold' }}>How do I set fitness goals?</Text>
          {'\n'}
          In the Progress tab, tap "Set Goals" to establish targets for weight, measurements, or workout performance.
        </Text>
      </View>
      
      <View style={infoModalStyles.bulletPoint}>
        <Text style={infoModalStyles.bullet}>•</Text>
        <Text style={infoModalStyles.bulletText}>
          <Text style={{ fontWeight: 'bold' }}>How do I upgrade my subscription?</Text>
          {'\n'}
          Go to Profile → Account → Manage Subscription to view available plans and upgrade options.
        </Text>
      </View>
      
      <Text style={infoModalStyles.sectionTitle}>Workout Tips</Text>
      
      <View style={infoModalStyles.bulletPoint}>
        <Text style={infoModalStyles.bullet}>•</Text>
        <Text style={infoModalStyles.bulletText}>
          <Text style={{ fontWeight: 'bold' }}>Rest between workouts:</Text> Allow 48 hours of recovery for muscle groups you've trained intensely.
        </Text>
      </View>
      
      <View style={infoModalStyles.bulletPoint}>
        <Text style={infoModalStyles.bullet}>•</Text>
        <Text style={infoModalStyles.bulletText}>
          <Text style={{ fontWeight: 'bold' }}>Progressive overload:</Text> Gradually increase weight, reps, or sets to continue making progress.
        </Text>
      </View>
      
      <View style={infoModalStyles.bulletPoint}>
        <Text style={infoModalStyles.bullet}>•</Text>
        <Text style={infoModalStyles.bulletText}>
          <Text style={{ fontWeight: 'bold' }}>Proper form:</Text> Focus on technique before increasing weights to prevent injury.
        </Text>
      </View>
      
      <Text style={infoModalStyles.sectionTitle}>Contact Support</Text>
      
      <Text style={infoModalStyles.paragraph}>
        If you need additional help, our fitness support team is available:
      </Text>
      
      <View style={infoModalStyles.bulletPoint}>
        <Text style={infoModalStyles.bullet}>•</Text>
        <Text style={infoModalStyles.bulletText}>
          Email: support@fitnessapp.com
        </Text>
      </View>
      
      <View style={infoModalStyles.bulletPoint}>
        <Text style={infoModalStyles.bullet}>•</Text>
        <Text style={infoModalStyles.bulletText}>
          Phone: (555) 123-4567 (Mon-Fri, 9am-5pm EST)
        </Text>
      </View>
      
      <TouchableOpacity 
        style={styles.supportButton}
        onPress={() => Linking.openURL('mailto:support@fitnessapp.com')}
      >
        <Text style={styles.supportButtonText}>Email Support</Text>
      </TouchableOpacity>
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