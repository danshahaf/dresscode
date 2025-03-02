import React from 'react';
import { View, Text } from 'react-native';
import { infoModalStyles } from './InfoModal';

export const PrivacyPolicyContent = () => {
  return (
    <View style={{ paddingVertical: 20, paddingHorizontal: 5 }}>
      <Text style={infoModalStyles.paragraph}>
        Last Updated: August 15, 2023
      </Text>
      
      <Text style={infoModalStyles.paragraph}>
        This Privacy Policy describes how we collect, use, and disclose your information when you use our fitness tracking application (the "Service").
      </Text>
      
      <Text style={infoModalStyles.sectionTitle}>1. Information We Collect</Text>
      <Text style={infoModalStyles.paragraph}>
        We collect several types of information to provide and improve our fitness tracking Service:
      </Text>
      
      <View style={infoModalStyles.bulletPoint}>
        <Text style={infoModalStyles.bullet}>•</Text>
        <Text style={infoModalStyles.bulletText}>
          <Text style={{ fontWeight: 'bold' }}>Account Information:</Text> When you register, we collect your name, email address, and password.
        </Text>
      </View>
      
      <View style={infoModalStyles.bulletPoint}>
        <Text style={infoModalStyles.bullet}>•</Text>
        <Text style={infoModalStyles.bulletText}>
          <Text style={{ fontWeight: 'bold' }}>Profile Information:</Text> We collect information you provide in your profile, such as height, weight, age, gender, and fitness goals.
        </Text>
      </View>
      
      <View style={infoModalStyles.bulletPoint}>
        <Text style={infoModalStyles.bullet}>•</Text>
        <Text style={infoModalStyles.bulletText}>
          <Text style={{ fontWeight: 'bold' }}>Fitness Data:</Text> We collect data about your workouts, including exercises performed, sets, reps, weights, duration, and frequency.
        </Text>
      </View>
      
      <View style={infoModalStyles.bulletPoint}>
        <Text style={infoModalStyles.bullet}>•</Text>
        <Text style={infoModalStyles.bulletText}>
          <Text style={{ fontWeight: 'bold' }}>Body Measurements:</Text> We store body measurements you enter, such as weight, body fat percentage, and circumference measurements.
        </Text>
      </View>
      
      <View style={infoModalStyles.bulletPoint}>
        <Text style={infoModalStyles.bullet}>•</Text>
        <Text style={infoModalStyles.bulletText}>
          <Text style={{ fontWeight: 'bold' }}>Usage Data:</Text> We collect information about how you interact with our Service, including features used and time spent.
        </Text>
      </View>
      
      <View style={infoModalStyles.bulletPoint}>
        <Text style={infoModalStyles.bullet}>•</Text>
        <Text style={infoModalStyles.bulletText}>
          <Text style={{ fontWeight: 'bold' }}>Device Information:</Text> We collect information about your device, including model, operating system, and unique identifiers.
        </Text>
      </View>
      
      <Text style={infoModalStyles.sectionTitle}>2. How We Use Your Information</Text>
      <Text style={infoModalStyles.paragraph}>
        We use your information for the following purposes:
      </Text>
      
      <View style={infoModalStyles.bulletPoint}>
        <Text style={infoModalStyles.bullet}>•</Text>
        <Text style={infoModalStyles.bulletText}>To provide personalized workout recommendations and track your fitness progress</Text>
      </View>
      
      <View style={infoModalStyles.bulletPoint}>
        <Text style={infoModalStyles.bullet}>•</Text>
        <Text style={infoModalStyles.bulletText}>To analyze trends and improve our Service based on user behavior</Text>
      </View>
      
      <View style={infoModalStyles.bulletPoint}>
        <Text style={infoModalStyles.bullet}>•</Text>
        <Text style={infoModalStyles.bulletText}>To communicate with you about your account, updates, and new features</Text>
      </View>
      
      <View style={infoModalStyles.bulletPoint}>
        <Text style={infoModalStyles.bullet}>•</Text>
        <Text style={infoModalStyles.bulletText}>To process subscription payments and manage your account</Text>
      </View>
      
      <Text style={infoModalStyles.sectionTitle}>3. Health Data</Text>
      <Text style={infoModalStyles.paragraph}>
        We understand the sensitive nature of health and fitness data. We implement appropriate security measures to protect this information and will not use it for advertising purposes. We may use anonymized, aggregated fitness data for research and to improve our Service.
      </Text>
      
      <Text style={infoModalStyles.sectionTitle}>4. Sharing Your Information</Text>
      <Text style={infoModalStyles.paragraph}>
        We may share your information in the following circumstances:
      </Text>
      
      <View style={infoModalStyles.bulletPoint}>
        <Text style={infoModalStyles.bullet}>•</Text>
        <Text style={infoModalStyles.bulletText}>
          <Text style={{ fontWeight: 'bold' }}>Service Providers:</Text> We work with third-party services for hosting, payment processing, and analytics.
        </Text>
      </View>
      
      <View style={infoModalStyles.bulletPoint}>
        <Text style={infoModalStyles.bullet}>•</Text>
        <Text style={infoModalStyles.bulletText}>
          <Text style={{ fontWeight: 'bold' }}>Legal Requirements:</Text> We may disclose information if required by law or to protect rights and safety.
        </Text>
      </View>
      
      <View style={infoModalStyles.bulletPoint}>
        <Text style={infoModalStyles.bullet}>•</Text>
        <Text style={infoModalStyles.bulletText}>
          <Text style={{ fontWeight: 'bold' }}>Business Transfers:</Text> If our company is acquired or merged, your information may be transferred.
        </Text>
      </View>
      
      <Text style={infoModalStyles.sectionTitle}>5. Data Retention</Text>
      <Text style={infoModalStyles.paragraph}>
        We retain your information as long as your account is active or as needed to provide services. You can request deletion of your account and associated data at any time.
      </Text>
      
      <Text style={infoModalStyles.sectionTitle}>6. Your Rights</Text>
      <Text style={infoModalStyles.paragraph}>
        Depending on your location, you may have rights to:
      </Text>
      
      <View style={infoModalStyles.bulletPoint}>
        <Text style={infoModalStyles.bullet}>•</Text>
        <Text style={infoModalStyles.bulletText}>Access and receive a copy of your personal data</Text>
      </View>
      
      <View style={infoModalStyles.bulletPoint}>
        <Text style={infoModalStyles.bullet}>•</Text>
        <Text style={infoModalStyles.bulletText}>Correct inaccurate data</Text>
      </View>
      
      <View style={infoModalStyles.bulletPoint}>
        <Text style={infoModalStyles.bullet}>•</Text>
        <Text style={infoModalStyles.bulletText}>Request deletion of your data</Text>
      </View>
      
      <View style={infoModalStyles.bulletPoint}>
        <Text style={infoModalStyles.bullet}>•</Text>
        <Text style={infoModalStyles.bulletText}>Restrict or object to certain processing</Text>
      </View>
      
      <Text style={infoModalStyles.sectionTitle}>7. Children's Privacy</Text>
      <Text style={infoModalStyles.paragraph}>
        Our Service is not intended for children under 13. We do not knowingly collect information from children under 13. If you believe we have collected information from a child under 13, please contact us.
      </Text>
      
      <Text style={infoModalStyles.sectionTitle}>8. Changes to This Privacy Policy</Text>
      <Text style={infoModalStyles.paragraph}>
        We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.
      </Text>
      
      <Text style={infoModalStyles.sectionTitle}>9. Contact Us</Text>
      <Text style={infoModalStyles.paragraph}>
        If you have any questions about this Privacy Policy or our data practices, please contact us at privacy@fitnessapp.com.
      </Text>
    </View>
  );
}; 