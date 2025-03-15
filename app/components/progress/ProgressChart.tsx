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
  // Left padding for the chart
  const leftPadding = 20;
  // Compute effective width for plotting the points
  const effectiveWidth = chartDimensions.width - leftPadding - 10;

  // Calculate the chart path and points
  const { pathD, points } = calculateChartPath(
    dailyScores,
    effectiveWidth,
    chartDimensions.height,
    leftPadding
  );

  // Use formatDate if needed; here we assume dailyScores.date is already formatted.
  const formatDate = (dateStr: string) => dateStr;

  return (
    <View style={progressStyles.chartContainer}>
      <View style={progressStyles.chartHeader}>
        <Text style={progressStyles.chartTitle}>Style Progress</Text>
        <Text style={progressStyles.chartLegend}>Last 7 days</Text>
      </View>
      
      <Svg style={progressStyles.svgContainer} viewBox={`0 0 ${chartDimensions.width} ${chartDimensions.height + 30}`}>
        {/* Draw horizontal grid lines */}
        <Line x1={leftPadding} y1={chartDimensions.height * 0.25} x2={chartDimensions.width} y2={chartDimensions.height * 0.25} stroke="#eee" strokeWidth="1" />
        <Line x1={leftPadding} y1={chartDimensions.height * 0.5} x2={chartDimensions.width} y2={chartDimensions.height * 0.5} stroke="#eee" strokeWidth="1" />
        <Line x1={leftPadding} y1={chartDimensions.height * 0.75} x2={chartDimensions.width} y2={chartDimensions.height * 0.75} stroke="#eee" strokeWidth="1" />
        
        {/* Score labels */}
        <SvgText x="0" y={chartDimensions.height * 0.25 + 4} fontSize="10" fill="#999" textAnchor="start">75</SvgText>
        <SvgText x="0" y={chartDimensions.height * 0.5 + 4} fontSize="10" fill="#999" textAnchor="start">50</SvgText>
        <SvgText x="0" y={chartDimensions.height * 0.75 + 4} fontSize="10" fill="#999" textAnchor="start">25</SvgText>
        <SvgText x="0" y={chartDimensions.height + 4} fontSize="10" fill="#999" textAnchor="start">0</SvgText>
        
        {/* Draw the chart line if path exists */}
        {pathD !== '' && (
          <Path d={pathD} fill="none" stroke="#cca702" strokeWidth="2" />
        )}
        
        {/* Draw data points, score labels, and date labels */}
        {points.map((point, index) => (
          <G key={index}>
            {/* Always draw the circle and score dot to have a continuous line */}
            {dailyScores[index].score !== null && (
              <Circle 
                cx={point.x}
                cy={point.y}
                r="4"
                fill="#fff"
                stroke="#cca702"
                strokeWidth="2"
              />
            )}
            {/* Only display score and date labels if index is not 0 */}
            {index !== 0 && (
              <>
                {dailyScores[index].score !== null && (
                  <SvgText 
                    x={point.x}
                    y={point.y - 10}
                    fontSize="9"
                    fill="#666"
                    textAnchor="middle"
                    fontWeight="bold"
                  >
                    {Math.round(dailyScores[index].score)}
                  </SvgText>
                )}
                <SvgText 
                  x={point.x}
                  y={chartDimensions.height + 20}
                  fontSize="10"
                  fill="#999"
                  textAnchor="middle"
                >
                  {formatDate(dailyScores[index].date)}
                </SvgText>
                <Line 
                  x1={point.x}
                  y1={chartDimensions.height}
                  x2={point.x}
                  y2={chartDimensions.height + 5}
                  stroke="#eee"
                  strokeWidth="1"
                />
              </>
            )}
          </G>
        ))}

      </Svg>
    </View>
  );
};
