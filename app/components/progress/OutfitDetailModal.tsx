import React, { useRef, useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  Image, 
  TouchableOpacity, 
  Modal, 
  Animated, 
  PanResponder,
  ActivityIndicator,
  Dimensions
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Outfit, mockStyleAnalysis } from '@/app/data/progress.data';
import { progressStyles } from '@/app/styles/progress.styles';
import { ScoreMeter } from './ScoreMeter';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth';
import { generateStyleAnalysis, StyleAnalysis } from '@/lib/openai';
import { SubscriptionModal } from '@/app/components/profile/SubscriptionModal';

interface OutfitDetailModalProps {
  visible: boolean;
  outfit: Outfit | null;
  onClose: () => void;
}

export const OutfitDetailModal = ({ visible, outfit, onClose }: OutfitDetailModalProps) => {
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
  const fullImageHeight = Dimensions.get('window').height * 0.65;
  const collapsedImageHeight = Dimensions.get('window').height * 0.3;

  // store current outfit in a state
  const [currentOutfit, setCurrentOutfit] = useState<Outfit | null>(outfit);
  useEffect(() => {
    if (outfit && outfit.imageUrl) {
      setCurrentOutfit((prev) => {
        if (prev?.id === outfit.id) return prev; // ✅ Prevent re-renders
        return { ...outfit, imageUrl: prev?.imageUrl || outfit.imageUrl }; // ✅ ENSURE IMAGEURL IS NEVER LOST
      });
    }
  }, [outfit, styleAnalysis]); // ✅ TRIGGER THIS WHEN STYLE ANALYSIS UPDATES
  
  
  
  
  // Collapsible image height based on scroll
  const imageHeight = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [fullImageHeight, collapsedImageHeight],
    extrapolate: 'clamp'
  });

    
  const { user } = useAuth();
  // Fetch the current subscription plan for the user
  useEffect(() => {
    async function fetchSubscriptionPlan() {
      
      if (!user) return;
      const { data, error } = await supabase
        .from('profiles')
        .select('subscription_plan')
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
  
  // Create panResponder for swipe-to-dismiss gesture
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => {
        const { locationY } = evt.nativeEvent;
        return locationY <= fullImageHeight * 0.4;
      },
      onPanResponderMove: (evt, gestureState) => {
        if (gestureState.dy > 0) {
          modalY.setValue(gestureState.dy);
          const newOpacity = 1 - gestureState.dy / 400;
          modalOpacity.setValue(newOpacity > 0 ? newOpacity : 0);
        }
      },
      onPanResponderRelease: (evt, gestureState) => {
        if (gestureState.dy > 100) {
          Animated.parallel([
            Animated.timing(modalY, {
              toValue: Dimensions.get('window').height,
              duration: 300,
              useNativeDriver: true,
            }),
            Animated.timing(modalOpacity, {
              toValue: 0,
              duration: 300,
              useNativeDriver: true,
            }),
          ]).start(() => {
            onClose();
            modalY.setValue(0);
            modalOpacity.setValue(1);
            scrollY.setValue(0);
          });
        } else {
          Animated.parallel([
            Animated.spring(modalY, {
              toValue: 0,
              friction: 8,
              useNativeDriver: true,
            }),
            Animated.timing(modalOpacity, {
              toValue: 1,
              duration: 150,
              useNativeDriver: true,
            }),
          ]).start();
        }
      },
    })
  ).current;
  
  if (!outfit) return null;
  
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={() => {
        onClose();
        setAiAnalysisVisible(false);
      }}
    >
      <View style={progressStyles.modalContainer}>
        <Animated.View 
          style={[
            progressStyles.modalContent,
            { transform: [{ translateY: modalY }], opacity: modalOpacity }
          ]}
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
                {...panResponder.panHandlers}
              >
                <Image 
                  key={currentOutfit?.imageUrl} // ✅ FORCES REACT TO RELOAD IMAGE
                  source={{ uri: currentOutfit?.imageUrl || outfit?.imageUrl || "" }} 
                  style={progressStyles.modalImageFull} 
                  resizeMode="cover"
                />

                <LinearGradient
                  colors={['transparent', 'rgba(0,0,0,0.7)']}
                  style={progressStyles.imageGradient}
                >
                  <View style={progressStyles.dateContainer}>
                    <IconSymbol size={16} name="calendar" color="#fff" />
                    <Text style={progressStyles.dateText}>
                      {typeof outfit.date === 'string' && outfit.date.match(/^\d{4}-\d{2}-\d{2}/)
                        ? new Date(outfit.date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })
                        : outfit.date}
                    </Text>
                  </View>
                  <View style={progressStyles.scoreCircleContainer}>
                    <View style={progressStyles.modalScoreCircle}>
                      <Text style={progressStyles.modalScoreText}>{outfit.score}</Text>
                    </View>
                  </View>
                </LinearGradient>
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
            <View style={progressStyles.fixedHeaderLayout}>
              {/* Fixed image header */}
              <Animated.View 
                style={[
                  progressStyles.collapsibleImageContainer, 
                  { 
                    height: imageHeight, 
                    position: 'absolute', 
                    top: 0, left: 0, right: 0, zIndex: 10 
                  }
                ]}
                {...panResponder.panHandlers}  // Attach panResponder to the fixed header if needed
              >
                <Image 
                  key={currentOutfit?.imageUrl} // Ensure image reloads when URL changes
                  source={{ uri: currentOutfit?.imageUrl || outfit?.imageUrl || "" }} 
                  style={progressStyles.modalImageFull} 
                  resizeMode="cover"
                />
                <LinearGradient
                  colors={['transparent', 'rgba(0,0,0,0.7)']}
                  style={progressStyles.imageGradient}
                >
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
                </LinearGradient>
              </Animated.View>
              {/* Scrollable analysis content */}
              <Animated.ScrollView
                style={progressStyles.collapsibleScrollView}
                contentContainerStyle={{ 
                  paddingTop: imageHeight,
                  minHeight: Dimensions.get('window').height * 0.9
                }}
                showsVerticalScrollIndicator={false}
                scrollEventThrottle={16}
                onScroll={Animated.event(
                  [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                  { useNativeDriver: false }
                )}
              >
                <View style={progressStyles.analysisContentContainer}>
                  <Text style={progressStyles.aiAnalysisTitle}>Style Analysis</Text>
                  <View style={progressStyles.aiSummaryContainer}>
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
                  <View>
                    
                  </View>
                  <View style={progressStyles.suggestionsContainer}>
                    <Text style={progressStyles.suggestionsTitle}>AI Suggestions</Text>
                    <Text style={progressStyles.suggestionsText}>
                      {styleAnalysis?.suggestions}
                    </Text>
                  </View>
                  <TouchableOpacity 
                    style={progressStyles.backButton}
                    onPress={() => {
                      setAiAnalysisVisible(false);
                      scrollY.setValue(0);
                    }}
                  >
                    <Text style={progressStyles.backButtonText}>Back to Outfit</Text>
                  </TouchableOpacity>
                  <View style={{ height: 40 }} />
                </View>
              </Animated.ScrollView>
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
    
  );
};
