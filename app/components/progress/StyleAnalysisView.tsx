import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Share, Alert, Linking } from 'react-native';
import { StyleAnalysis } from '@/app/data/progress.data';
import { progressStyles } from '@/app/styles/progress.styles';
import { calculateOverallScore } from '@/app/utils/style-analysis';
import { ScoreMeter } from './ScoreMeter';
import { IconSymbol } from '@/components/ui/IconSymbol';
// TODO: Create StyleAnalysisChart component
import { StyleAnalysisChart } from './StyleAnalysisChart';

interface StyleAnalysisViewProps {
  analysis: StyleAnalysis;
  onBack: () => void;
  scrollProps?: any;
}

export const StyleAnalysisView: React.FC<StyleAnalysisViewProps> = ({ 
  analysis, 
  onBack,
  scrollProps 
}) => {
  // Mock data for the chart
  const styleData = [
    { category: 'Strength', value: 85 },
    { category: 'Endurance', value: 65 },
    { category: 'Flexibility', value: 70 },
    { category: 'Balance', value: 60 },
    { category: 'Power', value: 75 },
  ];
  
  const handleShareToInstagram = async () => {
    try {
      // Check if Instagram is installed
      const instagramURL = 'instagram://';
      const canOpenInstagram = await Linking.canOpenURL(instagramURL);
      
      if (canOpenInstagram) {
        // In a real app, you would generate an image here and share it
        // For this demo, we'll just show an alert
        Alert.alert(
          'Share to Instagram',
          'In a real app, this would capture your style analysis chart and open Instagram to share it.',
          [{ text: 'OK' }]
        );
        
        // This is a placeholder for the actual Instagram sharing logic
        // Linking.openURL('instagram://camera');
      } else {
        Alert.alert(
          'Instagram Not Installed',
          'Instagram is not installed on your device. Please install it to use this feature.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('Error sharing to Instagram:', error);
    }
  };
  
  return (
    <ScrollView 
      style={progressStyles.aiAnalysisContainer} 
      showsVerticalScrollIndicator={false}
      {...scrollProps}
    >
      <View style={progressStyles.header}>
        <Text style={progressStyles.title}>Style Analysis</Text>
        <TouchableOpacity 
          style={progressStyles.shareButton}
          onPress={handleShareToInstagram}
        >
          <IconSymbol name="square.and.arrow.up" size={18} color="#fff" />
          <Text style={progressStyles.shareButtonText}>Share</Text>
        </TouchableOpacity>
      </View>
      
      <View style={progressStyles.chartContainer}>
        <StyleAnalysisChart data={styleData} />
      </View>
      
      
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
          <ScoreMeter label="Color Harmony" data={analysis.colorHarmony} />
          <ScoreMeter label="Fit & Silhouette" data={analysis.fitAndSilhouette} />
        </View>
        
        <View style={progressStyles.metricsRow}>
          <ScoreMeter label="Style Coherence" data={analysis.styleCoherence} />
          <ScoreMeter label="Accessorizing" data={analysis.accessorizing} />
        </View>
        
        <View style={progressStyles.metricsRow}>
          <ScoreMeter label="Occasion Match" data={analysis.occasionMatch} />
          <ScoreMeter label="Trend Awareness" data={analysis.trendAwareness} />
        </View>
      </View>
      
      {/* Overall score */}
      <View style={progressStyles.overallScoreContainer}>
        <Text style={progressStyles.overallScoreLabel}>Overall Style Score</Text>
        <View style={progressStyles.overallScoreCircle}>
          <Text style={progressStyles.overallScoreText}>
            {calculateOverallScore(analysis)}
          </Text>
        </View>
        <Text style={progressStyles.overallCritique}>
          A strong outfit with thoughtful color choices and good style coherence. 
          Consider adding more distinctive accessories to make it truly exceptional.
        </Text>
      </View>
      
      {/* Back button */}
      <TouchableOpacity 
        style={progressStyles.backButton}
        onPress={onBack}
      >
        <Text style={progressStyles.backButtonText}>Back to Outfit</Text>
      </TouchableOpacity>
      
      {/* Extra padding at bottom for better scrolling */}
      <View style={{ height: 20 }} />
    </ScrollView>
  );
}; 