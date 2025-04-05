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
  Dimensions,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Outfit } from '@/app/data/progress.data';
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

const DISMISS_THRESHOLD = 100;

export const OutfitDetailModal = ({ visible, outfit, onClose }: OutfitDetailModalProps) => {
  // Analysis and subscription states
  const [styleAnalysis, setStyleAnalysis] = useState<StyleAnalysis | null>(null);
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [subscriptionPlan, setSubscriptionPlan] = useState<string | null>(null);
  const [subscriptionModalVisible, setSubscriptionModalVisible] = useState(false);
  const [aiAnalysisVisible, setAiAnalysisVisible] = useState(false);

  // Animated values for dismissing the modal
  const modalY = useRef(new Animated.Value(0)).current;
  const modalOpacity = useRef(new Animated.Value(1)).current;
  // scrollY will drive the header resize in analysis view
  const scrollY = useRef(new Animated.Value(0)).current;

  // Define modal height as 95% of screen height
  const modalHeight = Dimensions.get('window').height * 0.95;
  // When fully expanded, header is 70% of modal; when collapsed, header is 30%.
  const fullHeaderHeight = modalHeight * 0.7;
  const collapsedHeaderHeight = modalHeight * 0.3;
  // Interpolate header height based on scrollY.
  const headerHeight = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [fullHeaderHeight, collapsedHeaderHeight],
    extrapolate: 'clamp',
  });

  const [currentOutfit, setCurrentOutfit] = useState<Outfit | null>(outfit);

  // Reset animated values and analysis state when modal is hidden.
  useEffect(() => {
    if (!visible) {
      modalY.setValue(0);
      modalOpacity.setValue(1);
      scrollY.setValue(0);
      setStyleAnalysis(null);
      setAiAnalysisVisible(false);
    }
  }, [visible]);

  useEffect(() => {
    if (outfit) setCurrentOutfit(outfit);
  }, [outfit]);

  const { user } = useAuth();
  useEffect(() => {
    async function fetchSubscriptionPlan() {
      if (!user) return;
      const { data, error } = await supabase
        .from('profiles')
        .select('subscription_plan')
        .eq('user_id', user.id)
        .single();
      if (!error) setSubscriptionPlan(data.subscription_plan);
    }
    fetchSubscriptionPlan();
  }, [user]);

  useEffect(() => {
    async function fetchStyleAnalysis() {
      if (!outfit || styleAnalysis !== null) return;
      const { data } = await supabase
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
      } else if (subscriptionPlan && subscriptionPlan !== 'Free') {
        setAnalysisLoading(true);
        try {
          const newAnalysis = await generateStyleAnalysis(outfit.imageUrl);
          setStyleAnalysis(newAnalysis);
          setAiAnalysisVisible(true);
          await supabase.from('style_analysis').insert({
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
          console.error(error);
        } finally {
          setAnalysisLoading(false);
        }
      }
    }
    if (visible && outfit) fetchStyleAnalysis();
  }, [visible, outfit, subscriptionPlan, styleAnalysis]);

  const handleAiCritique = () => {
    setTimeout(() => setAiAnalysisVisible(true), 1500);
  };

  // PanResponder for modal dismissal.
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: (_, gestureState) =>
        gestureState.y0 <= fullHeaderHeight && !aiAnalysisVisible,
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          modalY.setValue(gestureState.dy);
          const newOpacity = 1 - gestureState.dy / 400;
          modalOpacity.setValue(newOpacity > 0 ? newOpacity : 0);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > DISMISS_THRESHOLD) {
          Animated.parallel([
            Animated.timing(modalY, {
              toValue: Dimensions.get('window').height,
              duration: 150,
              useNativeDriver: true,
            }),
            Animated.timing(modalOpacity, {
              toValue: 0,
              duration: 150,
              useNativeDriver: true,
            }),
          ]).start(() => onClose());
        } else {
          Animated.parallel([
            Animated.timing(modalY, {
              toValue: 0,
              duration: 150,
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
      transparent
      visible={visible}
      onRequestClose={() => {
        onClose();
        setAiAnalysisVisible(false);
      }}
    >
      <Animated.View
        {...panResponder.panHandlers}
        style={[progressStyles.modalContainer, { opacity: modalOpacity }]}
      >
        <Animated.View style={[progressStyles.modalContent, { transform: [{ translateY: modalY }] }]}>
          <View style={progressStyles.modalInner}>
            <View style={progressStyles.swipeIndicatorContainer}>
              <View style={progressStyles.swipeIndicator} />
            </View>
            { !aiAnalysisVisible && !styleAnalysis ? (
              // Initial view (before analysis is fetched)
              <View style={progressStyles.modalImageFullContainer}>
                <Image
                  key={currentOutfit?.imageUrl}
                  source={{ uri: currentOutfit?.imageUrl || outfit?.imageUrl || '' }}
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
                            year: 'numeric',
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
              </View>
            ) : (
              // Analysis view: header height driven by scrollY, content scrolls.
              <View style={progressStyles.fixedHeaderLayout}>
                <Animated.View
                  style={[
                    progressStyles.collapsibleImageContainer,
                    {
                      height: headerHeight,
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      zIndex: 10,
                    },
                  ]}
                >
                  <Image
                    key={currentOutfit?.imageUrl}
                    source={{ uri: currentOutfit?.imageUrl || outfit?.imageUrl || '' }}
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
                              year: 'numeric',
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
                <Animated.ScrollView
                  onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                    { useNativeDriver: false }
                  )}
                  scrollEventThrottle={16}
                  contentContainerStyle={{
                    paddingTop: headerHeight,
                    minHeight: Dimensions.get('window').height * 0.9,
                  }}
                  nestedScrollEnabled
                >
                  <View style={progressStyles.analysisContentContainer}>
                    <Text style={progressStyles.aiAnalysisTitle}>Style Analysis</Text>
                    <View style={progressStyles.aiSummaryContainer}>
                      <Text style={progressStyles.aiSummaryText}>{styleAnalysis?.textAnalysis}</Text>
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
                    <View style={progressStyles.suggestionsContainer}>
                      <Text style={progressStyles.suggestionsTitle}>AI Suggestions</Text>
                      <Text style={progressStyles.suggestionsText}>{styleAnalysis?.suggestions}</Text>
                    </View>
                    <TouchableOpacity
                      style={progressStyles.backButton}
                      onPress={() => setAiAnalysisVisible(false)}
                    >
                      <Text style={progressStyles.backButtonText}>Back to Outfit</Text>
                    </TouchableOpacity>
                    <View style={{ height: 20 }} />
                  </View>
                </Animated.ScrollView>
              </View>
            )}
          </View>
        </Animated.View>
      </Animated.View>
      {subscriptionModalVisible && (
        <SubscriptionModal
          visible={subscriptionModalVisible}
          onClose={() => setSubscriptionModalVisible(false)}
          currentPlan={subscriptionPlan + ' Plan' || 'Free Plan'}
          onSubscriptionSuccess={() => setSubscriptionModalVisible(false)}
        />
      )}
    </Modal>
  );
};

export default OutfitDetailModal;
