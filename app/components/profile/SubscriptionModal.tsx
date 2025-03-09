import React from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  Modal, 
  Alert 
} from 'react-native';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { subscriptionStyles } from '@/app/styles/profile.styles';
import { useStripe } from '@stripe/stripe-react-native';

interface SubscriptionModalProps {
  visible: boolean;
  onClose: () => void;
  currentPlan: string;
}

export const SubscriptionModal = ({ 
  visible, 
  onClose, 
  currentPlan 
}: SubscriptionModalProps) => {
  // Cast useStripe() to any so that presentApplePay is recognized.
  const { presentApplePay } = useStripe() as any;

  // Handler for monthly plan
  const handleApplePayMonthly = async () => {
    console.log('Monthly Apple Pay button pressed');
    const { error } = await presentApplePay({
      cartItems: [
        { label: 'Premium Monthly Subscription', amount: '5.99', type: 'final' }
      ],
      country: 'US',
      currency: 'USD',
    });

    if (error) {
      console.error('Apple Pay error:', error);
      Alert.alert('Error', 'Apple Pay failed. Please try again.');
      return;
    }
    Alert.alert('Success', 'Apple Pay completed for Monthly plan. Proceeding to create subscription...');
  };

  // Handler for yearly plan
  const handleApplePayYearly = async () => {
    console.log('Yearly Apple Pay button pressed');
    const { error } = await presentApplePay({
      cartItems: [
        { label: 'Premium Yearly Subscription', amount: '59.99', type: 'final' }
      ],
      country: 'US',
      currency: 'USD',
    });

    if (error) {
      console.error('Apple Pay error:', error);
      Alert.alert('Error', 'Apple Pay failed. Please try again.');
      return;
    }
    Alert.alert('Success', 'Apple Pay completed for Yearly plan. Proceeding to create subscription...');
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={subscriptionStyles.modalOverlay}>
        <View style={subscriptionStyles.modalContent}>
          <View style={subscriptionStyles.modalHeader}>
            <Text style={subscriptionStyles.modalTitle}>Subscription Plans</Text>
            <TouchableOpacity 
              onPress={onClose}
              style={subscriptionStyles.closeButton}
            >
              <IconSymbol name="xmark" size={24} color="#333" />
            </TouchableOpacity>
          </View>
          
          {/* Current Plan */}
          <View style={subscriptionStyles.currentPlanContainer}>
            <Text style={subscriptionStyles.currentPlanLabel}>Current Plan:</Text>
            <Text style={subscriptionStyles.currentPlanValue}>{currentPlan}</Text>
          </View>
          
          {/* Plan Options */}
          <View style={subscriptionStyles.planOptionsContainer}>
            <TouchableOpacity 
              style={[
                subscriptionStyles.planOption, 
                currentPlan === 'Premium Plan' && subscriptionStyles.selectedPlan
              ]}
              onPress={handleApplePayMonthly}
            >
              <View style={subscriptionStyles.planOptionHeader}>
                <Text style={subscriptionStyles.planName}>Premium Monthly</Text>
                <Text style={subscriptionStyles.planPrice}>$5.99/month</Text>
              </View>
              <Text style={subscriptionStyles.planDescription}>
                Full access to all features with monthly billing
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                subscriptionStyles.planOption, 
                currentPlan === 'Premium Yearly' && subscriptionStyles.selectedPlan
              ]}
              onPress={handleApplePayYearly}
            >
              <View style={subscriptionStyles.planOptionHeader}>
                <Text style={subscriptionStyles.planName}>Premium Yearly</Text>
                <Text style={subscriptionStyles.planPrice}>$59.99/year</Text>
              </View>
              <Text style={[subscriptionStyles.planDescription, { color: 'green', fontWeight: 'bold' }]}>
                Save 17% with annual billing
              </Text>
              {currentPlan === 'Premium Yearly' && (
                <View style={subscriptionStyles.currentPlanBadge}>
                  <Text style={subscriptionStyles.currentPlanBadgeText}>Current Plan</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
          
          {/* Cancel Subscription Button */}
          <TouchableOpacity style={subscriptionStyles.cancelSubscriptionButton}>
            <Text style={subscriptionStyles.cancelSubscriptionText}>Cancel Subscription</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};
