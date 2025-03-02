import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { StyleCritique } from '@/app/data/progress.data';
import { progressStyles } from '@/app/styles/progress.styles';
import { getScoreColor } from '@/app/utils/style-analysis';
import Svg, { Circle } from 'react-native-svg';

interface ScoreMeterProps {
  label: string;
  data: StyleCritique;
}

export const ScoreMeter = ({ label, data }: ScoreMeterProps) => {
  // Calculate the circle parameters
  const size = 40; // Even smaller circle
  const strokeWidth = 3; // Slightly thinner stroke
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (data.score / 10) * circumference;
  const strokeDashoffset = circumference - progress;
  
  return (
    <View style={progressStyles.circularMeterContainer}>
      <View style={progressStyles.meterHeaderRow}>
        <View style={progressStyles.circularMeterInner}>
          <Svg width={size} height={size} style={progressStyles.circularSvg}>
            {/* Background circle */}
            <Circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="#EEEEEE"
              strokeWidth={strokeWidth}
              fill="transparent"
            />
            
            {/* Progress circle */}
            <Circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke={getScoreColor(data.score)}
              strokeWidth={strokeWidth}
              fill="transparent"
              strokeDasharray={`${circumference} ${circumference}`}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              transform={`rotate(-90, ${size / 2}, ${size / 2})`}
            />
          </Svg>
          
          {/* Score text in the center */}
          <View style={progressStyles.circularScoreTextContainer}>
            <Text style={[progressStyles.circularScoreText, { color: getScoreColor(data.score) }]}>
              {data.score.toFixed(1)}
            </Text>
          </View>
        </View>
        
        {/* Label next to the circle */}
        <View style={progressStyles.meterLabelContainer}>
          <Text style={progressStyles.circularMeterLabel} numberOfLines={2}>
            {label}
          </Text>
        </View>
      </View>
      
      {/* Critique text below */}
      <Text style={progressStyles.critiqueFeedback}>{data.critique}</Text>
    </View>
  );
}; 