import React from 'react';
import { View, Text } from 'react-native';
import Svg, { Path, Circle, Line, Text as SvgText } from 'react-native-svg';
import { DailyScore } from '@/app/data/progress.data';
import { progressStyles, chartDimensions } from '@/app/styles/progress.styles';
import { calculateChartPath } from '@/app/utils/style-analysis';

interface ProgressChartProps {
  dailyScores: DailyScore[];
}

export const ProgressChart = ({ dailyScores }: ProgressChartProps) => {
  const { pathD, points } = calculateChartPath(
    dailyScores,
    chartDimensions.width,
    chartDimensions.height
  );

  return (
    <View style={progressStyles.chartContainer}>
      <View style={progressStyles.chartHeader}>
        <Text style={progressStyles.chartTitle}>Style Progress</Text>
        <Text style={progressStyles.chartLegend}>Last 7 days</Text>
      </View>
      
      <Svg style={progressStyles.svgContainer} viewBox={`0 0 ${chartDimensions.width} ${chartDimensions.height + 30}`}>
        {/* Horizontal grid lines */}
        <Line x1="0" y1={chartDimensions.height * 0.25} x2={chartDimensions.width} y2={chartDimensions.height * 0.25} stroke="#eee" strokeWidth="1" />
        <Line x1="0" y1={chartDimensions.height * 0.5} x2={chartDimensions.width} y2={chartDimensions.height * 0.5} stroke="#eee" strokeWidth="1" />
        <Line x1="0" y1={chartDimensions.height * 0.75} x2={chartDimensions.width} y2={chartDimensions.height * 0.75} stroke="#eee" strokeWidth="1" />
        
        {/* Score labels */}
        <SvgText x="-5" y={chartDimensions.height * 0.25 + 4} fontSize="10" fill="#999" textAnchor="start">75</SvgText>
        <SvgText x="-5" y={chartDimensions.height * 0.5 + 4} fontSize="10" fill="#999" textAnchor="start">50</SvgText>
        <SvgText x="-5" y={chartDimensions.height * 0.75 + 4} fontSize="10" fill="#999" textAnchor="start">25</SvgText>
        <SvgText x="-5" y={chartDimensions.height + 4} fontSize="10" fill="#999" textAnchor="start">0</SvgText>
        
        {/* Chart line */}
        <Path d={pathD} fill="none" stroke="#cca702" strokeWidth="2" />
        
        {/* Data points */}
        {points.map((point, index) => (
          <Circle 
            key={index}
            cx={point.x}
            cy={point.y}
            r="4"
            fill="#fff"
            stroke="#cca702"
            strokeWidth="2"
          />
        ))}
        
        {/* Date labels */}
        {dailyScores.map((score, index) => (
          <SvgText 
            key={index}
            x={index * (chartDimensions.width / (dailyScores.length - 1))}
            y={chartDimensions.height + 20}
            fontSize="10"
            fill="#999"
            textAnchor="middle"
          >
            {score.date}
          </SvgText>
        ))}
      </Svg>
    </View>
  );
}; 