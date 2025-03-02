import React, { useRef, useState } from 'react';
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
  ScrollView
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Outfit } from '@/app/data/progress.data';
import { progressStyles } from '@/app/styles/progress.styles';
import { StyleAnalysisView } from './StyleAnalysisView';
import { mockStyleAnalysis } from '@/app/data/progress.data';
import { ScoreMeter } from './ScoreMeter';
import { calculateOverallScore } from '@/app/utils/style-analysis';

interface OutfitDetailModalProps {
  visible: boolean;
  outfit: Outfit | null;
  onClose: () => void;
}

export const OutfitDetailModal = ({ visible, outfit, onClose }: OutfitDetailModalProps) => {
  const [aiAnalysisVisible, setAiAnalysisVisible] = useState(false);
  const [aiAnalysisLoading, setAiAnalysisLoading] = useState(false);
  
  // Animation values
  const modalY = useRef(new Animated.Value(0)).current;
  const modalOpacity = useRef(new Animated.Value(1)).current;
  const scrollY = useRef(new Animated.Value(0)).current;
  
  // Calculate image height based on scroll position
  const fullImageHeight = Dimensions.get('window').height * 0.65;
  const collapsedImageHeight = Dimensions.get('window').height * 0.3;
  
  // Create a sticky header effect
  const imageHeight = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [fullImageHeight, collapsedImageHeight],
    extrapolate: 'clamp'
  });
  
  // Handle AI critique button press
  const handleAiCritique = () => {
    setAiAnalysisLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      setAiAnalysisLoading(false);
      setAiAnalysisVisible(true);
    }, 1500);
  };
  
  // Enhanced pan responder for swipe to dismiss
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (evt, gestureState) => {
        if (gestureState.dy > 0) { // Only allow downward swipes
          modalY.setValue(gestureState.dy);
          // Gradually reduce opacity as user swipes down
          const newOpacity = 1 - (gestureState.dy / 400);
          modalOpacity.setValue(newOpacity > 0 ? newOpacity : 0);
        }
      },
      onPanResponderRelease: (evt, gestureState) => {
        if (gestureState.dy > 100) { // Threshold to dismiss
          // Continue the animation to slide out
          Animated.parallel([
            Animated.timing(modalY, {
              toValue: Dimensions.get('window').height,
              duration: 300,
              useNativeDriver: true
            }),
            Animated.timing(modalOpacity, {
              toValue: 0,
              duration: 300,
              useNativeDriver: true
            })
          ]).start(() => {
            onClose();
            setAiAnalysisVisible(false);
            // Reset animation values
            modalY.setValue(0);
            modalOpacity.setValue(1);
            scrollY.setValue(0);
          });
        } else {
          // Spring back to original position
          Animated.parallel([
            Animated.spring(modalY, {
              toValue: 0,
              friction: 8,
              useNativeDriver: true
            }),
            Animated.timing(modalOpacity, {
              toValue: 1,
              duration: 150,
              useNativeDriver: true
            })
          ]).start();
        }
      }
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
            { 
              transform: [{ translateY: modalY }],
              opacity: modalOpacity
            }
          ]}
        >
          {/* Swipe indicator at top of modal */}
          <View style={progressStyles.swipeIndicatorContainer}>
            <View style={progressStyles.swipeIndicator} />
          </View>
          
          {/* Main content with collapsible header */}
          {!aiAnalysisVisible ? (
            // Regular view when AI analysis is not visible
            <>
              {/* Full-width image container */}
              <View style={progressStyles.modalImageFullContainer}>
                <Image 
                  source={{ uri: outfit.image }} 
                  style={progressStyles.modalImageFull} 
                  resizeMode="cover"
                />
                
                {/* Gradient overlay on image */}
                <LinearGradient
                  colors={['transparent', 'rgba(0,0,0,0.7)']}
                  style={progressStyles.imageGradient}
                >
                  {/* Date display */}
                  <View style={progressStyles.dateContainer}>
                    <IconSymbol size={16} name="calendar" color="#fff" />
                    <Text style={progressStyles.dateText}>
                      {new Date(outfit.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </Text>
                  </View>
                  
                  {/* Score circle */}
                  <View style={progressStyles.scoreCircleContainer}>
                    <View style={progressStyles.modalScoreCircle}>
                      <Text style={progressStyles.modalScoreText}>{outfit.score}</Text>
                    </View>
                  </View>
                </LinearGradient>
              </View>
              
              {/* Bottom section with AI critique button */}
              <View style={progressStyles.modalBottomSection}>
                <Text style={progressStyles.outfitTitle}>Outfit Details</Text>
                <Text style={progressStyles.outfitDescription}>
                  This outfit was captured on {outfit.date}. Tap the button below to get a detailed AI analysis of your style.
                </Text>
                <TouchableOpacity 
                  style={progressStyles.aiCritiqueButton}
                  onPress={handleAiCritique}
                  disabled={aiAnalysisLoading}
                >
                  {aiAnalysisLoading ? (
                    <ActivityIndicator color="#fff" style={{ marginRight: 10 }} />
                  ) : (
                    <IconSymbol size={20} name="sparkles" color="#fff" style={{ marginRight: 10 }} />
                  )}
                  <Text style={progressStyles.aiCritiqueText}>
                    {aiAnalysisLoading ? "Analyzing your outfit..." : "Analyze with AI"}
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            // Fixed header layout with scrollable content
            <View style={progressStyles.fixedHeaderLayout}>
              {/* Fixed image header that stays at 30% height */}
              <Animated.View 
                style={[
                  progressStyles.collapsibleImageContainer, 
                  { height: imageHeight, position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10 }
                ]}
              >
                <Image 
                  source={{ uri: outfit.image }} 
                  style={progressStyles.modalImageFull} 
                  resizeMode="cover"
                />
                
                {/* Gradient overlay on image */}
                <LinearGradient
                  colors={['transparent', 'rgba(0,0,0,0.7)']}
                  style={progressStyles.imageGradient}
                >
                  {/* Date display */}
                  <View style={progressStyles.dateContainer}>
                    <IconSymbol size={16} name="calendar" color="#fff" />
                    <Text style={progressStyles.dateText}>
                      {new Date(outfit.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </Text>
                  </View>
                  
                  {/* Score circle */}
                  <View style={progressStyles.scoreCircleContainer}>
                    <View style={progressStyles.modalScoreCircle}>
                      <Text style={progressStyles.modalScoreText}>{outfit.score}</Text>
                    </View>
                  </View>
                </LinearGradient>
              </Animated.View>
              
              {/* Scrollable content with padding to account for fixed header */}
              <Animated.ScrollView
                style={progressStyles.collapsibleScrollView}
                contentContainerStyle={{ 
                  paddingTop: imageHeight, // Dynamic padding based on header height
                  minHeight: Dimensions.get('window').height * 0.9 // Ensure enough content to scroll
                }}
                showsVerticalScrollIndicator={false}
                scrollEventThrottle={16}
                onScroll={Animated.event(
                  [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                  { useNativeDriver: false }
                )}
                {...panResponder.panHandlers}
              >
                {/* AI Analysis Content */}
                <View style={progressStyles.analysisContentContainer}>
                  <Text style={progressStyles.aiAnalysisTitle}>Style Analysis</Text>
                  
                  {/* AI Summary */}
                  <View style={progressStyles.aiSummaryContainer}>
                    <Text style={progressStyles.aiSummaryText}>
                      This outfit shows a good understanding of color coordination and style coherence. 
                      The proportions work well for your body type, though there's room for improvement 
                      in accessorizing to elevate the overall look.
                    </Text>
                  </View>
                  
                  {/* Score meters in a two-column grid */}
                  <View style={progressStyles.metricsGridContainer}>
                    <View style={progressStyles.metricsRow}>
                      <ScoreMeter label="Color Harmony" data={mockStyleAnalysis.colorHarmony} />
                      <ScoreMeter label="Fit & Silhouette" data={mockStyleAnalysis.fitAndSilhouette} />
                    </View>
                    
                    <View style={progressStyles.metricsRow}>
                      <ScoreMeter label="Style Coherence" data={mockStyleAnalysis.styleCoherence} />
                      <ScoreMeter label="Accessorizing" data={mockStyleAnalysis.accessorizing} />
                    </View>
                    
                    <View style={progressStyles.metricsRow}>
                      <ScoreMeter label="Occasion Match" data={mockStyleAnalysis.occasionMatch} />
                      <ScoreMeter label="Trend Awareness" data={mockStyleAnalysis.trendAwareness} />
                    </View>
                  </View>
                  
                  {/* Suggestions section */}
                  <View style={progressStyles.suggestionsContainer}>
                    <Text style={progressStyles.suggestionsTitle}>Suggestions</Text>
                    <View style={progressStyles.suggestionItem}>
                      <View style={progressStyles.bulletPoint} />
                      <Text style={progressStyles.suggestionText}>
                        Add a statement accessory like a bold necklace or structured bag to elevate the look.
                      </Text>
                    </View>
                    <View style={progressStyles.suggestionItem}>
                      <View style={progressStyles.bulletPoint} />
                      <Text style={progressStyles.suggestionText}>
                        Consider slightly more tailoring at the waist to enhance your natural silhouette.
                      </Text>
                    </View>
                    <View style={progressStyles.suggestionItem}>
                      <View style={progressStyles.bulletPoint} />
                      <Text style={progressStyles.suggestionText}>
                        Experiment with one trend element to add contemporary flair while maintaining your personal style.
                      </Text>
                    </View>
                  </View>
                  
                  {/* Back button */}
                  <TouchableOpacity 
                    style={progressStyles.backButton}
                    onPress={() => {
                      setAiAnalysisVisible(false);
                      scrollY.setValue(0);
                    }}
                  >
                    <Text style={progressStyles.backButtonText}>Back to Outfit</Text>
                  </TouchableOpacity>
                  
                  {/* Extra padding at bottom for better scrolling */}
                  <View style={{ height: 40 }} />
                </View>
              </Animated.ScrollView>
            </View>
          )}
        </Animated.View>
      </View>
    </Modal>
  );
}; 