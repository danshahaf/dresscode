import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { StyleAnalysis } from '@/app/data/progress.data';
import { progressStyles } from '@/app/styles/progress.styles';
import { calculateOverallScore } from '@/app/utils/style-analysis';
import { ScoreMeter } from './ScoreMeter';

interface StyleAnalysisViewProps {
  analysis: StyleAnalysis;
  onBack: () => void;
  scrollProps?: any;
}

export const StyleAnalysisView = ({ 
  analysis, 
  onBack,
  scrollProps 
}: StyleAnalysisViewProps) => {
  return (
    <ScrollView 
      style={progressStyles.aiAnalysisContainer} 
      showsVerticalScrollIndicator={false}
      {...scrollProps}
    >
      <Text style={progressStyles.aiAnalysisTitle}>Style Analysis</Text>
      
      {/* AI Summary */}
      <View style={progressStyles.aiSummaryContainer}>
        <Text style={progressStyles.aiSummaryText}>
          This outfit shows a good understanding of color coordination and style coherence. 
          The proportions work well for your body type, though there's room for improvement 
          in accessorizing to elevate the overall look.
        </Text>
      </View>
      
      {/* Score meters with critique text */}
      <ScoreMeter label="Color Harmony" data={analysis.colorHarmony} />
      <ScoreMeter label="Fit & Silhouette" data={analysis.fitAndSilhouette} />
      <ScoreMeter label="Style Coherence" data={analysis.styleCoherence} />
      <ScoreMeter label="Accessorizing" data={analysis.accessorizing} />
      <ScoreMeter label="Occasion Match" data={analysis.occasionMatch} />
      <ScoreMeter label="Trend Awareness" data={analysis.trendAwareness} />
      
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
    </ScrollView>
  );
}; 