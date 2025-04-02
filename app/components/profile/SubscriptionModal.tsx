import React, { useState } from 'react';
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


// Define types for our helper function parameters.
interface PaymentIntentParams {
  amount: number;
  gateway: string;
}

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

  // Extract everything from useStripe() only once
  const { presentApplePay, confirmApplePayPayment, isApplePaySupported } = useStripe() as any;
  console.log('presentApplePay:', presentApplePay);

  // Set up local state for payment loading.
  const [paymentLoading, setPaymentLoading] = useState(false);

  // API URL from your environment variable for your Edge Function.
  const API_URL = process.env.EXPO_PUBLIC_STRIPE_FUNCTION_API || '';


  // Helper function to fetch the PaymentIntent client secret from your Edge Function.
  const fetchPaymentIntentClientSecret = async ({ amount, gateway }: PaymentIntentParams): Promise<string | undefined> => {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          amount: (amount * 100).toString(), // Stripe expects the amount in cents.
          currency: 'USD', // Processing in dollars.
          gateway: gateway,
        }),
      });
      const data = await response.json();
      return data?.client_secret;
    } catch (error) {
      console.log('Error fetching PaymentIntent:', error);
    }
  };

  // Helper function for showing error messages.
  const showErrorMessage = (message: string, amount: number) => {
    Alert.alert("Payment Error", message);
  };

  // Helper function for handling success.
  const onSuccess = (message: string) => {
    Alert.alert("Payment Successful", message);
  };

  // Example implementation of the applePay function.
  const applePay = async ({ amount }: { amount: number }): Promise<void> => {
    if (!isApplePaySupported || paymentLoading) return;
    setPaymentLoading(true);

    // Show the Apple Pay sheet.
    const { error } = await presentApplePay({
      cartItems: [{ label: 'Top Up', amount: amount.toString(), type: 'final' }],
      country: 'US',
      currency: 'USD',
    });

    if (error) {
      showErrorMessage(error?.message || '', amount);
      setPaymentLoading(false);
      return;
    }

    // Fetch the PaymentIntent client secret from your Edge Function.
    const clientSecret = await fetchPaymentIntentClientSecret({ amount, gateway: 'applepay' });

    if (clientSecret) {
      const { error: confirmError } = await confirmApplePayPayment(clientSecret);
      if (confirmError) {
        showErrorMessage(confirmError?.localizedMessage || '', amount);
      } else {
        onSuccess(`Payment of USD ${amount} is successful!`);
      }
    }
    setPaymentLoading(false);
  };

  // Existing functions for monthly and yearly plans.
  const handleApplePayMonthly = async () => {
    if (!user) {
      Alert.alert('Error', 'User not logged in');
      return;
    }
    // Check if Apple Pay is supported
    if (!isApplePaySupported) {
      Alert.alert('Apple Pay', 'Apple Pay is not supported on this device. Please test on a real iOS device.');
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
    // Continue with subscription update
    const currentDate = new Date();
    const expiresAt = new Date(currentDate.setMonth(currentDate.getMonth() + 1));
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
    if (!isApplePaySupported) {
      Alert.alert('Apple Pay', 'Apple Pay is not supported on this device. Please test on a real iOS device.');
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
  

  const handleCancelSubscription = async () => {
    console.log('Cancel Subscription button pressed');
    const currentDate = new Date();
    let expiresAt: Date;
    if (currentPlan.includes('Monthly')) {
      expiresAt = new Date(currentDate.setMonth(currentDate.getMonth() + 1));
    } else if (currentPlan.includes('Yearly')) {
      expiresAt = new Date(currentDate.setFullYear(currentDate.getFullYear() + 1));
    } else {
      expiresAt = new Date();
    }
    
    const updated = await updateSubscriptionStatus('cancelled', expiresAt.toISOString());
    if (updated) {
      Alert.alert('Subscription Cancelled', 'Your subscription is cancelled. You will retain premium access until your current period expires.');
      onClose();
    }
  };

  const updateSubscriptionStatus = async (newStatus: string, expiresAt: string): Promise<boolean> => {
    if (!user) return false;
    const { error } = await supabase
      .from('profiles')
      .update({ 
        subscription_status: newStatus,
        subscription_expires_at: expiresAt,
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
              Cancel Subscription
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};
