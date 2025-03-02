import React from 'react';
import { View, Text } from 'react-native';
import Svg, { Path, Circle, Line, Text as SvgText, G } from 'react-native-svg';
import { DailyScore } from '@/app/data/progress.data';
import { progressStyles, chartDimensions } from '@/app/styles/progress.styles';
import { calculateChartPath } from '@/app/utils/style-analysis';

interface ProgressChartProps {
  dailyScores: DailyScore[];
}

export const ProgressChart = ({ dailyScores }: ProgressChartProps) => {
  // Define padding for the chart
  const leftPadding = 20;
  const rightPadding = 10;
  const effectiveWidth = chartDimensions.width - leftPadding - rightPadding;
  
  // Calculate path with adjusted dimensions
  const { pathD, points } = calculateChartPath(
    dailyScores,
    effectiveWidth,
    chartDimensions.height,
    leftPadding
  );

  // Format date for better display
  const formatDate = (dateStr: string) => {
    // Convert from "MM/DD" to a more readable format if needed
    return dateStr;
  };

  return (
    <View style={progressStyles.chartContainer}>
      <View style={progressStyles.chartHeader}>
        <Text style={progressStyles.chartTitle}>Style Progress</Text>
        <Text style={progressStyles.chartLegend}>Last 7 days</Text>
      </View>
      
      <Svg style={progressStyles.svgContainer} viewBox={`0 0 ${chartDimensions.width} ${chartDimensions.height + 30}`}>
        {/* Horizontal grid lines */}
        <Line x1={leftPadding} y1={chartDimensions.height * 0.25} x2={chartDimensions.width} y2={chartDimensions.height * 0.25} stroke="#eee" strokeWidth="1" />
        <Line x1={leftPadding} y1={chartDimensions.height * 0.5} x2={chartDimensions.width} y2={chartDimensions.height * 0.5} stroke="#eee" strokeWidth="1" />
        <Line x1={leftPadding} y1={chartDimensions.height * 0.75} x2={chartDimensions.width} y2={chartDimensions.height * 0.75} stroke="#eee" strokeWidth="1" />
        
        {/* Score labels */}
        <SvgText x="0" y={chartDimensions.height * 0.25 + 4} fontSize="10" fill="#999" textAnchor="start">75</SvgText>
        <SvgText x="0" y={chartDimensions.height * 0.5 + 4} fontSize="10" fill="#999" textAnchor="start">50</SvgText>
        <SvgText x="0" y={chartDimensions.height * 0.75 + 4} fontSize="10" fill="#999" textAnchor="start">25</SvgText>
        <SvgText x="0" y={chartDimensions.height + 4} fontSize="10" fill="#999" textAnchor="start">0</SvgText>
        
        {/* Chart line */}
        <Path d={pathD} fill="none" stroke="#cca702" strokeWidth="2" />
        
        {/* Data points with score and date labels */}
        {points.map((point, index) => (
          <G key={index}>
            {/* Data point */}
            <Circle 
              cx={point.x}
              cy={point.y}
              r="4"
              fill="#fff"
              stroke="#cca702"
              strokeWidth="2"
            />
            
            {/* Score label above point */}
            <SvgText 
              x={point.x}
              y={point.y - 10}
              fontSize="9"
              fill="#666"
              textAnchor="middle"
              fontWeight="bold"
            >
              {dailyScores[index].score}
            </SvgText>
            
            {/* Date label below chart */}
            <SvgText 
              x={point.x}
              y={chartDimensions.height + 20}
              fontSize="10"
              fill="#999"
              textAnchor="middle"
            >
              {formatDate(dailyScores[index].date)}
            </SvgText>
          </G>
        ))}
        
        {/* Vertical tick marks for date alignment */}
        {points.map((point, index) => (
          <Line 
            key={`tick-${index}`}
            x1={point.x}
            y1={chartDimensions.height}
            x2={point.x}
            y2={chartDimensions.height + 5}
            stroke="#eee"
            strokeWidth="1"
          />
        ))}
      </Svg>
      
      {/* Optional: Add a legend or explanation here */}
    </View>
  );
}; 