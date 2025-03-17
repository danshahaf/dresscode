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
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth';

interface SubscriptionModalProps {
  visible: boolean;
  onClose: () => void;
  currentPlan: string;
  onSubscriptionSuccess?: () => void;
}


export const SubscriptionModal = ({ 
  visible, 
  onClose, 
  currentPlan,
  onSubscriptionSuccess,
}: SubscriptionModalProps) => {
  const { user } = useAuth();

  // Cast useStripe() to any so that presentApplePay is recognized.
  const { presentApplePay } = useStripe() as any;
  console.log('presentApplePay:', presentApplePay);
  
  const updateSubscriptionStatus = async (newStatus: string, expiresAt: string): Promise<boolean> => {
    if (!user) return false;
    const { error } = await supabase
      .from('profiles')
      .update({ 
        subscription_status: newStatus,
        subscription_expires_at: expiresAt, // ISO string date
      })
      .eq('user_id', user.id);
    if (error) {
      console.error('Error updating subscription status:', error);
      Alert.alert('Error', 'Failed to update subscription status.');
      return false;
    }
    return true;
  };
  

  const updateSubscriptionPlan = async (newPlan: string): Promise<boolean> => {
    if (!user) return false;
    const { error } = await supabase
      .from('profiles')
      .update({ subscription_plan: newPlan })
      .eq('user_id', user.id);
    if (error) {
      console.error('Error updating subscription plan:', error);
      Alert.alert('Error', 'Failed to update subscription plan.');
      return false;
    }

    return true;
  };

  // Handler for monthly plan
  const handleApplePayMonthly = async () => {
    if (!user) {
      Alert.alert('Error', 'User not logged in');
      return;
    }
    console.log('Monthly Apple Pay button pressed');
    const { error } = await presentApplePay({
      cartItems: [{ label: 'Premium Monthly Subscription', amount: '5.99', type: 'final' }],
      country: 'US',
      currency: 'USD',
    });
  
    if (error) {
      console.error('Apple Pay error:', error);
      Alert.alert('Error', 'Apple Pay failed. Please try again.');
      return;
    }
  
    const currentDate = new Date();
    const expiresAt = new Date(currentDate.setMonth(currentDate.getMonth() + 1));
  
    // Update subscription_plan, subscription_status, and subscription_expires_at
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        subscription_plan: 'Premium Monthly',
        subscription_status: 'active',
        subscription_expires_at: expiresAt.toISOString(),
      })
      .eq('user_id', user.id);
  
    if (updateError) {
      console.error('Error updating subscription:', updateError);
      Alert.alert('Error', 'Failed to update subscription');
      return;
    }
  
    Alert.alert('Success', 'Subscription updated to Premium Monthly.');
    onClose();
    if (onSubscriptionSuccess) onSubscriptionSuccess();
  };
  
  
  
  const handleApplePayYearly = async () => {
    if (!user) {
      Alert.alert('Error', 'User not logged in');
      return;
    }
    console.log('Yearly Apple Pay button pressed');
    const { error } = await presentApplePay({
      cartItems: [{ label: 'Premium Yearly Subscription', amount: '59.99', type: 'final' }],
      country: 'US',
      currency: 'USD',
    });
  
    if (error) {
      console.error('Apple Pay error:', error);
      Alert.alert('Error', 'Apple Pay failed. Please try again.');
      return;
    }
  
    const currentDate = new Date();
    const expiresAt = new Date(currentDate.setFullYear(currentDate.getFullYear() + 1));
  
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        subscription_plan: 'Premium Yearly',
        subscription_status: 'active',
        subscription_expires_at: expiresAt.toISOString(),
      })
      .eq('user_id', user.id);
  
    if (updateError) {
      console.error('Error updating subscription:', updateError);
      Alert.alert('Error', 'Failed to update subscription');
      return;
    }
  
    Alert.alert('Success', 'Subscription updated to Premium Yearly.');
    onClose();
    if (onSubscriptionSuccess) onSubscriptionSuccess();
  };
  
  
  //handling canceling subscription
  const handleCancelSubscription = async () => {
    console.log('Cancel Subscription button pressed');
    // Example: Calculate expiration date (in production, retrieve this from Stripe via webhook or API)
    const currentDate = new Date();
    let expiresAt: Date;
    if (currentPlan.includes('Monthly')) {
      expiresAt = new Date(currentDate.setMonth(currentDate.getMonth() + 1));
    } else if (currentPlan.includes('Yearly')) {
      expiresAt = new Date(currentDate.setFullYear(currentDate.getFullYear() + 1));
    } else {
      // Fallback or if already free:
      expiresAt = new Date();
    }
    
    const updated = await updateSubscriptionStatus('cancelled', expiresAt.toISOString());
    if (updated) {
      Alert.alert('Subscription Cancelled', 'Your subscription is cancelled. You will retain premium access until your current period expires.');
      onClose();
    }
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
                currentPlan === 'Premium Monthly Plan' && subscriptionStyles.selectedPlan,
                currentPlan === 'Premium Monthly Plan' && subscriptionStyles.disabledButton 
              ]}
              onPress={handleApplePayMonthly}
              disabled={currentPlan === 'Premium Monthly Plan'}
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
                currentPlan === 'Premium Yearly Plan' && subscriptionStyles.selectedPlan,
                currentPlan === 'Premium Yearly Plan' && subscriptionStyles.disabledButton
              ]}
              disabled={currentPlan === 'Premium Yearly Plan'}
              onPress={handleApplePayYearly}
            >
              <View style={subscriptionStyles.planOptionHeader}>
                <Text style={subscriptionStyles.planName}>Premium Yearly</Text>
                <Text style={subscriptionStyles.planPrice}>$59.99/year</Text>
              </View>
              <Text style={[subscriptionStyles.planDescription, { color: 'green', fontWeight: 'bold' }]}>
                Save 17% with annual billing
              </Text>
              {currentPlan === 'Premium Yearly Plan' && (
                <View style={subscriptionStyles.currentPlanBadge}>
                  <Text style={subscriptionStyles.currentPlanBadgeText}>Current Plan</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
          
          {/* Cancel Subscription Button */}
          <TouchableOpacity 
            style={[
              subscriptionStyles.cancelSubscriptionButton,
              currentPlan === 'Free Plan' && subscriptionStyles.disabledButton
            ]}          
            onPress={handleCancelSubscription}
            disabled={currentPlan === 'Free Plan'}
          >
            
            <Text style={subscriptionStyles.cancelSubscriptionText}>
              Cancel Subscription</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};
