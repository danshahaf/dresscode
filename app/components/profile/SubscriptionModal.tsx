import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, Alert } from 'react-native';
import Constants from 'expo-constants';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { subscriptionStyles } from '@/app/styles/profile.styles';
import { useStripe } from '@stripe/stripe-react-native';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth';

interface PaymentIntentParams {
  amount: number;
  gateway: string;
}

interface SubscriptionModalProps {
  visible: boolean;
  onClose: () => void;
  currentPlan: string;
  renewalDate?: string;
  onSubscriptionSuccess?: () => void;
}

export const SubscriptionModal = ({
  visible,
  onClose,
  currentPlan,
  renewalDate,
  onSubscriptionSuccess,
}: SubscriptionModalProps) => {
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const { user } = useAuth();
  const [paymentLoading, setPaymentLoading] = useState(false);
  const API_URL = process.env.EXPO_PUBLIC_STRIPE_FUNCTION_API || '';

  const fetchPaymentIntentClientSecret = async ({
    amount,
    gateway,
  }: PaymentIntentParams): Promise<string | undefined> => {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          amount: (amount * 100).toString(),
          currency: 'USD',
          gateway,
        }),
      });
      const data = await response.json();
      return data?.client_secret;
    } catch (error) {
      console.log('Error fetching PaymentIntent:', error);
    }
  };

  const handlePaymentSheet = async (amount: number, planName: string) => {
    if (!user) {
      Alert.alert('Error', 'User not logged in');
      return;
    }
    setPaymentLoading(true);
    const clientSecret = await fetchPaymentIntentClientSecret({
      amount,
      gateway: 'paymentsheet',
    });
    if (!clientSecret) {
      setPaymentLoading(false);
      Alert.alert('Error', 'Failed to fetch payment parameters.');
      return;
    }
    const { error: initError } = await initPaymentSheet({
      paymentIntentClientSecret: clientSecret,
      merchantDisplayName: Constants.name || 'Dresscode AI',
    });
    if (initError) {
      setPaymentLoading(false);
      Alert.alert('Error', 'Failed to initialize payment sheet.');
      return;
    }
    const { error: presentError } = await presentPaymentSheet();
    if (presentError) {
      setPaymentLoading(false);
      Alert.alert('Payment Error', presentError.message);
    } else {
      const currentDate = new Date();
      let expiresAt: Date;
      if (planName === 'Premium Monthly') {
        expiresAt = new Date(currentDate.setMonth(currentDate.getMonth() + 1));
      } else if (planName === 'Premium Yearly') {
        expiresAt = new Date(currentDate.setFullYear(currentDate.getFullYear() + 1));
      } else {
        expiresAt = new Date();
      }
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          subscription_plan: planName,
          subscription_status: 'active',
          subscription_expires_at: expiresAt.toISOString(),
        })
        .eq('user_id', user.id);
      if (updateError) {
        Alert.alert('Error', 'Subscription update failed.');
      } else {
        Alert.alert('Success', `Subscription updated to ${planName}.`);
        onClose();
        if (onSubscriptionSuccess) onSubscriptionSuccess();
      }
    }
    setPaymentLoading(false);
  };

  const handlePaymentSheetMonthly = async () => {
    await handlePaymentSheet(5.99, 'Premium Monthly');
  };

  const handlePaymentSheetYearly = async () => {
    await handlePaymentSheet(59.99, 'Premium Yearly');
  };

  const handleCancelSubscription = async () => {
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
      Alert.alert(
        'Subscription Cancelled',
        'Your subscription is cancelled. You will retain premium access until your current period expires.'
      );
      onClose();
    }
  };

  const updateSubscriptionStatus = async (
    newStatus: string,
    expiresAt: string
  ): Promise<boolean> => {
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

  return (
    <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
      <View style={subscriptionStyles.modalOverlay}>
        <View style={subscriptionStyles.modalContent}>
          <View style={subscriptionStyles.modalHeader}>
            <Text style={subscriptionStyles.modalTitle}>Subscription Plans</Text>
            <TouchableOpacity onPress={onClose} style={subscriptionStyles.closeButton}>
              <IconSymbol name="xmark" size={24} color="#333" />
            </TouchableOpacity>
          </View>
          <View style={subscriptionStyles.currentPlanContainer}>
            <Text style={subscriptionStyles.currentPlanLabel}>Current Plan:</Text>
            <Text style={subscriptionStyles.currentPlanValue}>{currentPlan}</Text>
            {currentPlan !== 'Free Plan' && renewalDate && (
              <Text style={subscriptionStyles.renewalDateText}>
                Renews on: {new Date(renewalDate).toLocaleDateString()}
              </Text>
            )}
          </View>
          <View style={subscriptionStyles.planOptionsContainer}>
            <TouchableOpacity
              style={[
                subscriptionStyles.planOption,
                currentPlan === 'Premium Monthly' && subscriptionStyles.selectedPlan,
                currentPlan === 'Premium Monthly' && subscriptionStyles.disabledButton,
              ]}
              onPress={handlePaymentSheetMonthly}
              disabled={currentPlan === 'Premium Monthly' || paymentLoading}
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
                currentPlan === 'Premium Yearly' && subscriptionStyles.selectedPlan,
                currentPlan === 'Premium Yearly' && subscriptionStyles.disabledButton,
              ]}
              disabled={currentPlan === 'Premium Yearly' || paymentLoading}
              onPress={handlePaymentSheetYearly}
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
          <TouchableOpacity
            style={[
              subscriptionStyles.cancelSubscriptionButton,
              currentPlan === 'Free Plan' && subscriptionStyles.disabledButton,
            ]}
            onPress={handleCancelSubscription}
            disabled={currentPlan === 'Free Plan'}
          >
            <Text style={subscriptionStyles.cancelSubscriptionText}>Cancel Subscription</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};
