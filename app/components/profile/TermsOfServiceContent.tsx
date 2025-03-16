import React from 'react';
import { View, Text } from 'react-native';
import { infoModalStyles } from './InfoModal';

export const TermsOfServiceContent = () => {
  return (
    <View style={{ paddingVertical: 20, paddingHorizontal: 5 }}>
      <Text style={infoModalStyles.paragraph}>
        Last Updated: March 15, 2025
      </Text>
      
      <Text style={infoModalStyles.paragraph}>
        Please read these Terms of Service ("Terms") carefully before using Dresscode (the "Service"). By accessing or using the Service, you agree to be bound by these Terms. If you do not agree with any part of these Terms, please discontinue using the Service.
      </Text>
      
      <Text style={infoModalStyles.sectionTitle}>1. Acceptance of Terms</Text>
      <Text style={infoModalStyles.paragraph}>
        By using the Service, you confirm that you have read, understood, and agree to these Terms in full.
      </Text>
      
      <Text style={infoModalStyles.sectionTitle}>2. Service Description</Text>
      <Text style={infoModalStyles.paragraph}>
        Dresscode is a platform that allows users to upload images of their outfits and receive AI-generated rankings based on various style metrics. The Service leverages the OpenAI API for outfit evaluations.
      </Text>
      <Text style={infoModalStyles.paragraph}>
        All images and information you provide are stored securely in our database. Rest assured, your content remains private and is not shared with any third parties.
      </Text>
      
      <Text style={infoModalStyles.sectionTitle}>3. User Content and Privacy</Text>
      <Text style={infoModalStyles.paragraph}>
        You retain full ownership of the images and information you submit. By using the Service, you grant us permission to store, process, and display your content solely to operate and improve the Service.
      </Text>
      <Text style={infoModalStyles.paragraph}>
        We are committed to protecting your privacy. Your content will remain confidential and will not be disclosed to any external parties without your explicit consent.
      </Text>
      
      <Text style={infoModalStyles.sectionTitle}>4. Use of AI and Data Processing</Text>
      <Text style={infoModalStyles.paragraph}>
        The Service utilizes the OpenAI API to analyze and rank outfits based on criteria determined by our algorithms. While we strive for accuracy, these AI-generated evaluations are provided for informational purposes only.
      </Text>
      <Text style={infoModalStyles.paragraph}>
        You acknowledge that the results may vary and that the AI processing is automated. We are not liable for any discrepancies or errors in the ranking.
      </Text>
      
      <Text style={infoModalStyles.sectionTitle}>5. Account Registration and Security</Text>
      <Text style={infoModalStyles.paragraph}>
        Certain features of the Service require you to register for an account. You agree to provide accurate information during registration and to maintain the confidentiality of your login credentials. You are responsible for all activities under your account.
      </Text>
      <Text style={infoModalStyles.paragraph}>
        Please notify us immediately if you suspect any unauthorized access to your account.
      </Text>
      
      <Text style={infoModalStyles.sectionTitle}>6. Prohibited Conduct</Text>
      <Text style={infoModalStyles.paragraph}>
        You agree not to:
      </Text>
      <View style={infoModalStyles.bulletPoint}>
        <Text style={infoModalStyles.bullet}>•</Text>
        <Text style={infoModalStyles.bulletText}>Engage in any unlawful or fraudulent activity</Text>
      </View>
      <View style={infoModalStyles.bulletPoint}>
        <Text style={infoModalStyles.bullet}>•</Text>
        <Text style={infoModalStyles.bulletText}>Infringe on the rights of others or post unauthorized content</Text>
      </View>
      <View style={infoModalStyles.bulletPoint}>
        <Text style={infoModalStyles.bullet}>•</Text>
        <Text style={infoModalStyles.bulletText}>Attempt to disrupt or interfere with the Service or its infrastructure</Text>
      </View>
      <View style={infoModalStyles.bulletPoint}>
        <Text style={infoModalStyles.bullet}>•</Text>
        <Text style={infoModalStyles.bulletText}>Misuse the AI functionality for purposes beyond the intended scope of the Service</Text>
      </View>
      
      <Text style={infoModalStyles.sectionTitle}>7. Termination</Text>
      <Text style={infoModalStyles.paragraph}>
        We reserve the right to suspend or terminate your account and access to the Service immediately, without notice, if you breach these Terms. Upon termination, your right to use the Service will cease immediately.
      </Text>
      
      <Text style={infoModalStyles.sectionTitle}>8. Limitation of Liability</Text>
      <Text style={infoModalStyles.paragraph}>
        To the fullest extent permitted by law, Dresscode and its developers shall not be liable for any indirect, incidental, consequential, or punitive damages arising from your use of, or inability to use, the Service.
      </Text>
      
      <Text style={infoModalStyles.sectionTitle}>9. Modifications to the Terms</Text>
      <Text style={infoModalStyles.paragraph}>
        We may update these Terms from time to time. Significant changes will be communicated by updating the "Last Updated" date and posting a notice within the app. Your continued use of the Service after such changes constitutes your acceptance of the updated Terms.
      </Text>
      
      <Text style={infoModalStyles.sectionTitle}>10. Governing Law</Text>
      <Text style={infoModalStyles.paragraph}>
        These Terms shall be governed by and construed in accordance with the laws applicable in your jurisdiction, without regard to its conflict of law provisions.
      </Text>
      
      {/* <Text style={infoModalStyles.sectionTitle}>11. Contact Us</Text>
      <Text style={infoModalStyles.paragraph}>
        If you have any questions or concerns about these Terms, please contact us at support@dresscodeapp.com.
      </Text> */}
    </View>
  );
};
