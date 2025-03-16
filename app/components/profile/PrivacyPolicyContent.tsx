import React from 'react';
import { View, Text } from 'react-native';
import { infoModalStyles } from './InfoModal';

export const PrivacyPolicyContent = () => {
  return (
    <View style={{ paddingVertical: 20, paddingHorizontal: 5 }}>
      <Text style={infoModalStyles.paragraph}>
        Last Updated: March 15, 2025
      </Text>
      
      <Text style={infoModalStyles.paragraph}>
        This Privacy Policy explains how Dresscode (“we”, “us”, or “our”) collects, uses, and safeguards your information when you use our app. Dresscode allows you to upload outfit photos and receive AI-powered style rankings. All data you provide is stored securely in our database and is never shared with third parties.
      </Text>
      
      <Text style={infoModalStyles.sectionTitle}>1. Information We Collect</Text>
      <Text style={infoModalStyles.paragraph}>
        We collect information to provide and improve the Service. This may include:
      </Text>
      
      <View style={infoModalStyles.bulletPoint}>
        <Text style={infoModalStyles.bullet}>•</Text>
        <Text style={infoModalStyles.bulletText}>
          <Text style={{ fontWeight: 'bold' }}>Account Information:</Text> When you register, we collect your name, email address, and other credentials.
        </Text>
      </View>
      
      <View style={infoModalStyles.bulletPoint}>
        <Text style={infoModalStyles.bullet}>•</Text>
        <Text style={infoModalStyles.bulletText}>
          <Text style={{ fontWeight: 'bold' }}>Uploaded Content:</Text> Photos of your outfits and associated metadata.
        </Text>
      </View>
      
      <View style={infoModalStyles.bulletPoint}>
        <Text style={infoModalStyles.bullet}>•</Text>
        <Text style={infoModalStyles.bulletText}>
          <Text style={{ fontWeight: 'bold' }}>Usage Data:</Text> Information about how you use the Service, including interactions and app performance.
        </Text>
      </View>
      
      <Text style={infoModalStyles.sectionTitle}>2. How We Use Your Information</Text>
      <Text style={infoModalStyles.paragraph}>
        We use your information for:
      </Text>
      
      <View style={infoModalStyles.bulletPoint}>
        <Text style={infoModalStyles.bullet}>•</Text>
        <Text style={infoModalStyles.bulletText}>Providing personalized outfit rankings and recommendations using AI.</Text>
      </View>
      
      <View style={infoModalStyles.bulletPoint}>
        <Text style={infoModalStyles.bullet}>•</Text>
        <Text style={infoModalStyles.bulletText}>Improving and optimizing the Service based on user behavior.</Text>
      </View>
      
      <View style={infoModalStyles.bulletPoint}>
        <Text style={infoModalStyles.bullet}>•</Text>
        <Text style={infoModalStyles.bulletText}>Communicating updates, new features, and important information regarding your account.</Text>
      </View>
      
      <Text style={infoModalStyles.sectionTitle}>3. Data Security and Privacy</Text>
      <Text style={infoModalStyles.paragraph}>
        All images and personal information you provide are stored securely in our database. We design our system so that your data remains private—no one else has access to your content.
      </Text>
      <Text style={infoModalStyles.paragraph}>
        We implement industry-standard security measures to protect your data from unauthorized access.
      </Text>
      
      <Text style={infoModalStyles.sectionTitle}>4. Sharing and Disclosure</Text>
      <Text style={infoModalStyles.paragraph}>
        We do not sell or share your personal information or uploaded content with third parties. Your data is used solely to operate and improve the Service.
      </Text>
      <Text style={infoModalStyles.paragraph}>
        We may share information if required by law, or if it is necessary to protect our rights or the safety of our users.
      </Text>
      
      <Text style={infoModalStyles.sectionTitle}>5. Use of AI</Text>
      <Text style={infoModalStyles.paragraph}>
        Dresscode uses the OpenAI API to generate outfit rankings and style evaluations. These AI-driven insights are for your informational purposes only and do not affect your ownership of any content you upload.
      </Text>
      
      <Text style={infoModalStyles.sectionTitle}>6. Data Retention</Text>
      <Text style={infoModalStyles.paragraph}>
        We retain your information as long as your account is active or as needed to provide the Service. You may request deletion of your account and its data at any time.
      </Text>
      
      <Text style={infoModalStyles.sectionTitle}>7. Your Rights</Text>
      <Text style={infoModalStyles.paragraph}>
        Depending on your jurisdiction, you may have rights regarding your personal data, including the right to access, correct, or delete your information.
      </Text>
      
      <Text style={infoModalStyles.sectionTitle}>8. Children's Privacy</Text>
      <Text style={infoModalStyles.paragraph}>
        Our Service is not intended for children under 13. We do not knowingly collect personal information from children under 13. If you believe we have inadvertently collected such data, please contact us.
      </Text>
      
      <Text style={infoModalStyles.sectionTitle}>9. Changes to This Privacy Policy</Text>
      <Text style={infoModalStyles.paragraph}>
        We may update this Privacy Policy from time to time. Significant changes will be communicated by updating the "Last Updated" date and posting a notice within the app.
      </Text>
      
      {/* <Text style={infoModalStyles.sectionTitle}>10. Contact Us</Text>
      <Text style={infoModalStyles.paragraph}>
        If you have any questions or concerns about this Privacy Policy or our data practices, please contact us at privacy@dresscodeapp.com.
      </Text> */}
    </View>
  );
};
