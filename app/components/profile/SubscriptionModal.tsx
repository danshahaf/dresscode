import React from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  Modal 
} from 'react-native';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { subscriptionStyles } from '@/app/styles/profile.styles';

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
            >
              <View style={subscriptionStyles.planOptionHeader}>
                <Text style={subscriptionStyles.planName}>Premium Monthly</Text>
                <Text style={subscriptionStyles.planPrice}>$9.99/month</Text>
              </View>
              <Text style={subscriptionStyles.planDescription}>
                Full access to all features with monthly billing
              </Text>
              {/* {currentPlan === 'Premium Plan' && (
                <View style={subscriptionStyles.currentPlanBadge}>
                  <Text style={subscriptionStyles.currentPlanBadgeText}>Current Plan</Text>
                </View>
              )} */}
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                subscriptionStyles.planOption, 
                currentPlan === 'Premium Yearly' && subscriptionStyles.selectedPlan
              ]}
            >
              <View style={subscriptionStyles.planOptionHeader}>
                <Text style={subscriptionStyles.planName}>Premium Yearly</Text>
                <Text style={subscriptionStyles.planPrice}>$89.99/year</Text>
              </View>
              <Text style={subscriptionStyles.planDescription}>
                Save 25% with annual billing
              </Text>
              {currentPlan === 'Premium Yearly' && (
                <View style={subscriptionStyles.currentPlanBadge}>
                  <Text style={subscriptionStyles.currentPlanBadgeText}>Current Plan</Text>
                </View>
              )}
              {/* {currentPlan !== 'Premium Yearly' && (
                <View style={subscriptionStyles.savingBadge}>
                  <Text style={subscriptionStyles.savingBadgeText}>Save 25%</Text>
                </View>
              )} */}
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