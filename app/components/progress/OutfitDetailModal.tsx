import React, { useRef, useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  Image, 
  TouchableOpacity, 
  Modal, 
  Animated, 
  ActivityIndicator,
  Dimensions,
  ScrollView
} from 'react-native';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Outfit } from '@/app/data/progress.data';
import { progressStyles } from '@/app/styles/progress.styles';
import { ScoreMeter } from './ScoreMeter';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth';
import { generateStyleAnalysis, StyleAnalysis } from '@/lib/openai';
import { SubscriptionModal } from '@/app/components/profile/SubscriptionModal';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';

interface OutfitDetailModalProps {
  visible: boolean;
  outfit: Outfit | null;
  onClose: () => void;
}

export const OutfitDetailModal = ({ visible, outfit, onClose }: OutfitDetailModalProps) => {
  // Get safe area insets to handle notches and home indicators
  const insets = useSafeAreaInsets();
  
  // States for style analysis and subscription
  const [styleAnalysis, setStyleAnalysis] = useState<StyleAnalysis | null>(null);
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [subscriptionPlan, setSubscriptionPlan] = useState<string | null>(null);
  const [subscriptionModalVisible, setSubscriptionModalVisible] = useState(false);

  // State to control whether the AI analysis view is active.
  const [aiAnalysisVisible, setAiAnalysisVisible] = useState(false);
  const [aiAnalysisLoading, setAiAnalysisLoading] = useState(false);
  
  // Animation values
  const modalY = useRef(new Animated.Value(0)).current;
  const modalOpacity = useRef(new Animated.Value(1)).current;
  const scrollY = useRef(new Animated.Value(0)).current;
  
  // Calculate image heights
  const windowHeight = Dimensions.get('window').height;
  const fullImageHeight = windowHeight * 0.7;
  const collapsedImageHeight = windowHeight * 0.3;
  
  // Calculate style analysis section heights
  const initialAnalysisHeight = windowHeight * 0.4;
  const expandedAnalysisHeight = windowHeight * 0.7;
  
  // Interpolate image height based on scroll position
  const imageHeight = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [fullImageHeight, collapsedImageHeight],
    extrapolate: 'clamp',
  });
  
  // Interpolate analysis section height based on scroll position
  const analysisHeight = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [initialAnalysisHeight, expandedAnalysisHeight],
    extrapolate: 'clamp',
  });
  
  // Interpolate analysis section top position based on scroll position
  const analysisTop = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [windowHeight * 0.6, windowHeight * 0.3],
    extrapolate: 'clamp',
  });
  
  // store current outfit in a state
  const [currentOutfit, setCurrentOutfit] = useState<Outfit | null>(outfit);
  
  // Update currentOutfit when outfit prop changes
  useEffect(() => {
    if (outfit) {
      setCurrentOutfit(outfit);
      // Reset analysis state when outfit changes
      setStyleAnalysis(null);
      setAiAnalysisVisible(false);
    }
  }, [outfit]);
  
  // Add a simple function to close the modal
  const closeModal = () => {
    // Reset all state
    setStyleAnalysis(null);
    setAiAnalysisVisible(false);
    modalY.setValue(0);
    modalOpacity.setValue(1);
    
    // Call onClose to close the modal in the parent component
    onClose();
  };
  
  // Reset state when modal visibility changes
  useEffect(() => {
    if (visible) {
      // Reset animation values when modal becomes visible
      modalY.setValue(0);
      modalOpacity.setValue(1);
      // Reset scroll position to ensure style analysis section starts at 40% height
      scrollY.setValue(0);
    }
  }, [visible]);
  
  // Fetch the current subscription plan for the user
  const { user } = useAuth();
  useEffect(() => {
    async function fetchSubscriptionPlan() {
      if (!user) return;
      const { data, error } = await supabase
        .from('profiles')
        .select('subscription_plan, subscription_status, subscription_expires_at')
        .eq('user_id', user.id)
        .single();
      if (error) {return;}
      setSubscriptionPlan(data.subscription_plan);
    }
    fetchSubscriptionPlan();
  }, []);

  useEffect(() => {
    if (styleAnalysis) {
      setTimeout(() => {
        setStyleAnalysis({ ...styleAnalysis });
      }, 100);
    }
  }, [styleAnalysis]);
  

  // Fetch or generate style analysis when modal opens and outfit is set
  useEffect(() => {
    async function fetchStyleAnalysis() {
      if (!outfit || styleAnalysis !== null) return; // ✅ Only fetch if analysis is missing
      setCurrentOutfit((prev) => prev || outfit); // ✅ Preserve currentOutfit  
  
  
      const { data, error } = await supabase
        .from('style_analysis')
        .select('*')
        .eq('outfit_id', outfit.id)
        .single();
  
      if (data) {
  
        const analysis: StyleAnalysis = {
          textAnalysis: data.style_analysis,
          colorHarmony: { score: data.color_harmony, critique: "" },
          fitAndSilhouette: { score: data.fit_and_silhouette, critique: "" },
          styleCoherence: { score: data.style_coherence, critique: "" },
          accessorizing: { score: data.accessorizing, critique: "" },
          occasionMatch: { score: data.occasion_match, critique: "" },
          trendAwareness: { score: data.trend_awareness, critique: "" },
          suggestions: data.suggestions,
        };
  
        setStyleAnalysis(analysis);
      } else {
        if (subscriptionPlan && subscriptionPlan !== 'Free') {
          setAnalysisLoading(true);
          try {
            const newAnalysis = await generateStyleAnalysis(outfit.imageUrl);
            setStyleAnalysis(newAnalysis);
            setAiAnalysisVisible(true);
  
            const { error: insertError } = await supabase
              .from('style_analysis')
              .insert({
                outfit_id: outfit.id,
                color_harmony: newAnalysis.colorHarmony.score,
                fit_and_silhouette: newAnalysis.fitAndSilhouette.score,
                style_coherence: newAnalysis.styleCoherence.score,
                accessorizing: newAnalysis.accessorizing.score,
                occasion_match: newAnalysis.occasionMatch,
                trend_awareness: newAnalysis.trendAwareness,
                style_analysis: newAnalysis.textAnalysis,
                suggestions: newAnalysis.suggestions,
              });
  
          } catch (error) {
            console.error('Error generating style analysis:', error);
          } finally {
            setAnalysisLoading(false);
          }
        }
      }
    }
  
    if (visible && outfit) {
      fetchStyleAnalysis();
    }
  }, [visible, outfit, subscriptionPlan]);
  


  // Handle AI critique button press for manual trigger
  const handleAiCritique = () => {
    setAiAnalysisLoading(true);
    // Simulate API call delay if needed
    setTimeout(() => {
      setAiAnalysisLoading(false);
      setAiAnalysisVisible(true);
    }, 1500);
  };
  
  // Reset state when modal visibility changes
  useEffect(() => {
    if (visible) {
      // Reset animation values when modal becomes visible
      modalY.setValue(0);
      modalOpacity.setValue(1);
    }
  }, [visible]);
  
  if (!outfit) return null;
  
  return (
    <SafeAreaProvider>
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={() => {
        onClose();
        setAiAnalysisVisible(false);
      }}
    >
      <View style={[progressStyles.modalContainer, { paddingBottom: 0 }]}>
        <Animated.View 
          style={[
            progressStyles.modalContent,
            { transform: [{ translateY: modalY }], opacity: modalOpacity, height: '100%' }
          ]}
          // Remove the panResponder handlers
        >
          {/* Swipe indicator at top of modal */}
          <View style={progressStyles.swipeIndicatorContainer}>
            <View style={progressStyles.swipeIndicator} />
          </View>
          
          {/* Main content with collapsible header */}
          {!aiAnalysisVisible && !styleAnalysis ? (
            // INITIAL VIEW: No analysis available yet
            <>
              <Animated.View 
                style={[
                  progressStyles.modalImageFullContainer,
                  { transform: [{ translateY: modalY }], opacity: modalOpacity }
                ]}
                // Remove the panResponder handlers
              >
                <Image 
                  key={currentOutfit?.imageUrl} 
                  source={{ uri: currentOutfit?.imageUrl || outfit?.imageUrl || "" }} 
                  style={progressStyles.modalImageFull} 
                  resizeMode="cover"
                />

                <View style = {progressStyles.basicInfoContainer}>
                  <View style={progressStyles.dateContainer}>
                    <IconSymbol size={16} name="calendar" color="#fff" />
                    <Text style={progressStyles.dateText}>
                      {typeof outfit.date === 'string' && outfit.date.match(/^\d{4}-\d{2}-\d{2}/)
                        ? new Date(outfit.date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })
                        : outfit.date
                      }
                    </Text>
                  </View>
                  <View style={progressStyles.scoreCircleContainer}>
                    <View style={progressStyles.modalScoreCircle}>
                      <Text style={progressStyles.modalScoreText}>{outfit.score}</Text>
                    </View>
                  </View>
                </View>
              </Animated.View>
              
              <View style={progressStyles.modalBottomSection}>
                <Text style={progressStyles.outfitTitle}>Outfit Details</Text>
                <Text style={progressStyles.outfitDescription}>
                  This outfit was captured on {outfit.date}.{" "}
                  {subscriptionPlan !== 'Free'
                    ? 'Tap below to get a detailed AI analysis of your style.'
                    : 'Subscribe to Premium to unlock detailed AI analysis.'}
                </Text>
                <TouchableOpacity 
                  style={progressStyles.aiCritiqueButton}
                  onPress={() => {
                    if (subscriptionPlan === 'Free') {
                      // Trigger subscription modal 
                      setSubscriptionModalVisible(true);
                    } else {
                      // For Premium users, trigger analysis manually
                      handleAiCritique();
                    }
                  }}
                  disabled={analysisLoading}
                >
                  {analysisLoading ? (
                    <ActivityIndicator color="#fff" style={{ marginRight: 10 }} />
                  ) : (
                    <IconSymbol size={20} name="sparkles" color="#fff" style={{ marginRight: 10 }} />
                  )}
                  <Text style={progressStyles.aiCritiqueText}>
                    {analysisLoading
                      ? "Analyzing your outfit..."
                      : subscriptionPlan === 'Free'
                      ? "Analyze Outfit"
                      : "Generate Analysis"}
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            // ANALYSIS VIEW: Show the detailed AI analysis with fixed header image
            <View style={{ flex: 1 }}>
              {/* Fixed image header */}
              <Animated.View 
                style={[
                  progressStyles.collapsibleImageContainer, 
                  { 
                    height: imageHeight, 
                    position: 'absolute', 
                    top: 0, left: 0, right: 0, zIndex: 1 
                  }
                ]}
              >
                <Image
                  source={{ uri: currentOutfit?.imageUrl || outfit?.imageUrl || "" }} 
                  style={progressStyles.modalImageFull} 
                  resizeMode="cover"
                />
                <View style = {progressStyles.basicInfoContainer}>
                  <View style={progressStyles.dateContainer}>
                    <IconSymbol size={16} name="calendar" color="#fff" />
                    <Text style={progressStyles.dateText}>
                      {typeof outfit.date === 'string' && outfit.date.match(/^\d{4}-\d{2}-\d{2}/)
                        ? new Date(outfit.date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })
                        : outfit.date
                      }
                    </Text>
                  </View>
                  <View style={progressStyles.scoreCircleContainer}>
                    <View style={progressStyles.modalScoreCircle}>
                      <Text style={progressStyles.modalScoreText}>{outfit.score}</Text>
                    </View>
                  </View>
                </View>
              </Animated.View>
              
              {/* Scrollable analysis content - STYLE ANALYSIS SECTION */}
              <Animated.View style={{
                position: 'absolute',
                top: analysisTop,
                left: 0,
                right: 0,
                height: analysisHeight,
                backgroundColor: 'white',
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
                zIndex: 10,
              }}>
                <ScrollView
                  style={{ flex: 1 }}
                  contentContainerStyle={{ paddingBottom: 40 }}
                  showsVerticalScrollIndicator={false}
                  onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                    { useNativeDriver: false }
                  )}
                  scrollEventThrottle={16}
                >
                  <View style={[progressStyles.analysisContentContainer, { paddingTop: 20 }]}>
                    <Text style={progressStyles.aiAnalysisTitle}>Dresscode AI</Text>
                    
                    {subscriptionPlan !== 'Free' ? (
                      <>
                        <View style={progressStyles.aiSummaryContainer}>
                          <Text style={progressStyles.suggestionsTitle}>Overview</Text>
                          <Text style={progressStyles.aiSummaryText}>
                            {styleAnalysis!.textAnalysis}
                          </Text>
                        </View>
                        <View style={progressStyles.metricsGridContainer}>
                          <View style={progressStyles.metricsRow}>
                            <ScoreMeter label="Color Harmony" data={styleAnalysis!.colorHarmony} />
                            <ScoreMeter label="Fit & Silhouette" data={styleAnalysis!.fitAndSilhouette} />
                          </View>
                          <View style={progressStyles.metricsRow}>
                            <ScoreMeter label="Style Coherence" data={styleAnalysis!.styleCoherence} />
                            <ScoreMeter label="Accessories" data={styleAnalysis!.accessorizing} />
                          </View>
                          <View style={progressStyles.metricsRow}>
                            <ScoreMeter label="Occasion Match" data={styleAnalysis!.occasionMatch} />
                            <ScoreMeter label="Trend Awareness" data={styleAnalysis!.trendAwareness} />
                          </View>
                        </View>
                        {/* Suggestions Section */}
                        <View style={progressStyles.suggestionsContainer}>
                          <Text style={progressStyles.suggestionsTitle}>AI Suggestions</Text>
                          <Text style={progressStyles.suggestionsText}>
                            {styleAnalysis?.suggestions}
                          </Text>
                        </View>
                      </>
                    ) : (
                      <View style={progressStyles.aiSummaryContainer}>
                        <Text style={progressStyles.suggestionsTitle}>Premium Feature</Text>
                        <Text style={progressStyles.aiSummaryText}>
                          Upgrade to Premium to unlock detailed AI analysis of your outfit, including color harmony, fit & silhouette, style coherence, and personalized suggestions.
                        </Text>
                        <TouchableOpacity 
                          style={[progressStyles.aiCritiqueButton, { marginTop: 20 }]}
                          onPress={() => setSubscriptionModalVisible(true)}
                        >
                          <IconSymbol size={20} name="sparkles" color="#fff" style={{ marginRight: 10 }} />
                          <Text style={progressStyles.aiCritiqueText}>Upgrade to Premium</Text>
                        </TouchableOpacity>
                      </View>
                    )}
                    
                    <TouchableOpacity 
                      style={[progressStyles.backButton, {
                        backgroundColor: '#f5f5f5',
                        paddingVertical: 15,
                        borderRadius: 12,
                        width: '100%',
                        alignItems: 'center',
                        marginTop: 20,
                      }]}
                      onPress={closeModal}
                    >
                      <Text style={[progressStyles.backButtonText, {
                        color: '#333',
                        fontSize: 16,
                        fontWeight: '500',
                      }]}>Back to Outfits</Text>
                    </TouchableOpacity>
                  </View>
                </ScrollView>
              </Animated.View>
            </View>
          )}
          
        </Animated.View>
      </View>
      {subscriptionModalVisible && (
        <SubscriptionModal 
          visible={subscriptionModalVisible}
          onClose={() => setSubscriptionModalVisible(false)}
          currentPlan={subscriptionPlan + ' Plan' || 'Free Plan'}
          onSubscriptionSuccess={() => {
            // Optionally update the subscription plan state or trigger any post-subscription logic.
            setSubscriptionModalVisible(false);
            // For example, you might want to re-fetch the subscription plan here.
          }}
        />
      )}

    </Modal>
    </SafeAreaProvider>
    
  );
};