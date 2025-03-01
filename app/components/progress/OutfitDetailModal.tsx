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
  Dimensions
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Outfit } from '@/app/data/progress.data';
import { progressStyles } from '@/app/styles/progress.styles';
import { StyleAnalysisView } from './StyleAnalysisView';
import { mockStyleAnalysis } from '@/app/data/progress.data';

interface OutfitDetailModalProps {
  visible: boolean;
  outfit: Outfit | null;
  onClose: () => void;
}

export const OutfitDetailModal = ({ visible, outfit, onClose }: OutfitDetailModalProps) => {
  const [aiAnalysisVisible, setAiAnalysisVisible] = useState(false);
  const [aiAnalysisLoading, setAiAnalysisLoading] = useState(false);
  
  // Animation values for modal
  const modalY = useRef(new Animated.Value(0)).current;
  const modalOpacity = useRef(new Animated.Value(1)).current;
  
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
          {...panResponder.panHandlers}
        >
          {/* Swipe indicator at top of modal */}
          <View style={progressStyles.swipeIndicatorContainer}>
            <View style={progressStyles.swipeIndicator} />
          </View>
          
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
            {!aiAnalysisVisible ? (
              <>
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
              </>
            ) : (
              <StyleAnalysisView 
                analysis={mockStyleAnalysis} 
                onBack={() => setAiAnalysisVisible(false)}
                scrollProps={{
                  onScroll: ({ nativeEvent }) => {
                    // Enable/disable pan responder based on scroll position
                    if (nativeEvent.contentOffset.y <= 0) {
                      panResponder.panHandlers.onStartShouldSetPanResponder = () => true;
                    } else {
                      panResponder.panHandlers.onStartShouldSetPanResponder = () => false;
                    }
                  },
                  scrollEventThrottle: 16
                }}
              />
            )}
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}; 