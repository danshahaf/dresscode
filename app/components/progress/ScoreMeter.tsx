import React from 'react';
import { View, Text } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { progressStyles } from '@/app/styles/progress.styles';
import { getScoreColor } from '@/app/utils/style-analysis';
import { StyleCritique } from '@/app/data/progress.data';

interface ScoreMeterProps {
  label: string;
  data: StyleCritique;
}

export const ScoreMeter = ({ label, data }: ScoreMeterProps) => {
  const size = 50; // Slightly larger for better visibility
  const strokeWidth = 5; // More prominent stroke width
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  // Ensure score is between 0-100
  const score = Math.round(data.score);
  const progress = (score / 100) * circumference;
  const strokeDashoffset = circumference - progress;

  const getBorderColor = (score: number) => {
    if (score >= 85) return '#297534'; // green
    if (score >= 70) return '#cca702'; // gold yellow
    return '#b81d23'; // red
  };
  
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
              stroke={getBorderColor(score)}
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
            <Text style={[progressStyles.circularScoreText, { color: getBorderColor(score) }]}>
              {score}
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
