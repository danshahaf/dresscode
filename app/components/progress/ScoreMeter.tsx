import React from 'react';
import { View, Text } from 'react-native';
import { StyleCritique } from '@/app/data/progress.data';
import { progressStyles } from '@/app/styles/progress.styles';
import { getScoreColor } from '@/app/utils/style-analysis';

interface ScoreMeterProps {
  label: string;
  data: StyleCritique;
}

export const ScoreMeter = ({ label, data }: ScoreMeterProps) => {
  return (
    <View style={progressStyles.scoreMeterContainer}>
      <View style={progressStyles.scoreMeterLabelContainer}>
        <Text style={progressStyles.scoreMeterLabel}>{label}</Text>
        <Text 
          style={[
            progressStyles.scoreMeterValue, 
            { color: getScoreColor(data.score) }
          ]}
        >
          {data.score.toFixed(1)}
        </Text>
      </View>
      <View style={progressStyles.scoreMeterTrack}>
        <View 
          style={[
            progressStyles.scoreMeterFill, 
            { 
              width: `${(data.score / 10) * 100}%`,
              backgroundColor: getScoreColor(data.score)
            }
          ]} 
        />
      </View>
      <Text style={progressStyles.critiqueFeedback}>{data.critique}</Text>
    </View>
  );
}; 