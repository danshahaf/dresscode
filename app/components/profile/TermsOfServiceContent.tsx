import React from 'react';
import { View, Text } from 'react-native';
import { infoModalStyles } from './InfoModal';

export const TermsOfServiceContent = () => {
  return (
    <View style={{ paddingVertical: 20, paddingHorizontal: 5 }}>
      <Text style={infoModalStyles.paragraph}>
        Last Updated: August 15, 2023
      </Text>
      
      <Text style={infoModalStyles.paragraph}>
        Please read these Terms of Service ("Terms") carefully before using our fitness tracking application (the "Service").
      </Text>
      
      <Text style={infoModalStyles.sectionTitle}>1. Acceptance of Terms</Text>
      <Text style={infoModalStyles.paragraph}>
        By accessing or using the Service, you agree to be bound by these Terms. If you disagree with any part of the terms, you may not access the Service.
      </Text>
      
      <Text style={infoModalStyles.sectionTitle}>2. Fitness Disclaimer</Text>
      <Text style={infoModalStyles.paragraph}>
        The content provided through our Service is for informational purposes only and is not intended as medical advice, diagnosis, or treatment. Always consult with a qualified healthcare provider before beginning any exercise program, especially if you have any medical conditions or injuries.
      </Text>
      
      <Text style={infoModalStyles.paragraph}>
        You acknowledge that there are risks associated with physical activity and that you are voluntarily participating in these activities. Our Service does not replace professional fitness training or medical advice.
      </Text>
      
      <Text style={infoModalStyles.sectionTitle}>3. Account Registration</Text>
      <Text style={infoModalStyles.paragraph}>
        To use certain features of our Service, you must register for an account. You agree to provide accurate information and keep it updated. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
      </Text>
      
      <Text style={infoModalStyles.sectionTitle}>4. Subscription Services</Text>
      <Text style={infoModalStyles.paragraph}>
        Some features of our Service require a paid subscription. Subscription fees are billed in advance on a recurring basis according to the plan you select. You can cancel your subscription at any time, but we do not provide refunds for partial subscription periods.
      </Text>
      
      <Text style={infoModalStyles.paragraph}>
        Premium features include personalized workout plans, advanced progress tracking, and nutrition guidance. Free features may be limited in scope and functionality.
      </Text>
      
      <Text style={infoModalStyles.sectionTitle}>5. User Content</Text>
      <Text style={infoModalStyles.paragraph}>
        Our Service allows you to post, store, and share information related to your fitness journey. You retain ownership of your content, but grant us a license to use, reproduce, and display it in connection with providing and improving the Service.
      </Text>
      
      <Text style={infoModalStyles.paragraph}>
        You are solely responsible for your content and agree not to post anything that infringes on others' rights, is illegal, or violates these Terms.
      </Text>
      
      <Text style={infoModalStyles.sectionTitle}>6. Prohibited Activities</Text>
      <Text style={infoModalStyles.paragraph}>
        You agree not to:
      </Text>
      
      <View style={infoModalStyles.bulletPoint}>
        <Text style={infoModalStyles.bullet}>•</Text>
        <Text style={infoModalStyles.bulletText}>Use the Service for any illegal purpose</Text>
      </View>
      
      <View style={infoModalStyles.bulletPoint}>
        <Text style={infoModalStyles.bullet}>•</Text>
        <Text style={infoModalStyles.bulletText}>Attempt to gain unauthorized access to any part of the Service</Text>
      </View>
      
      <View style={infoModalStyles.bulletPoint}>
        <Text style={infoModalStyles.bullet}>•</Text>
        <Text style={infoModalStyles.bulletText}>Interfere with or disrupt the Service or servers</Text>
      </View>
      
      <View style={infoModalStyles.bulletPoint}>
        <Text style={infoModalStyles.bullet}>•</Text>
        <Text style={infoModalStyles.bulletText}>Share your account credentials with others</Text>
      </View>
      
      <Text style={infoModalStyles.sectionTitle}>7. Termination</Text>
      <Text style={infoModalStyles.paragraph}>
        We may terminate or suspend your account immediately, without prior notice, if you breach these Terms. Upon termination, your right to use the Service will cease immediately.
      </Text>
      
      <Text style={infoModalStyles.sectionTitle}>8. Limitation of Liability</Text>
      <Text style={infoModalStyles.paragraph}>
        To the maximum extent permitted by law, we shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use or inability to use the Service.
      </Text>
      
      <Text style={infoModalStyles.sectionTitle}>9. Changes to Terms</Text>
      <Text style={infoModalStyles.paragraph}>
        We reserve the right to modify these Terms at any time. We will provide notice of significant changes by posting the updated Terms on our Service. Your continued use of the Service after such changes constitutes your acceptance of the new Terms.
      </Text>
      
      <Text style={infoModalStyles.sectionTitle}>10. Contact Us</Text>
      <Text style={infoModalStyles.paragraph}>
        If you have any questions about these Terms, please contact us at legal@fitnessapp.com.
      </Text>
    </View>
  );
}; 