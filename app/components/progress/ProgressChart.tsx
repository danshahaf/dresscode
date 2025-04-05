import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Path, Circle, Line, Text as SvgText, G } from 'react-native-svg';
import { DailyScore } from '@/app/data/progress.data';
import { progressStyles, chartDimensions } from '@/app/styles/progress.styles';
import { calculateChartPath } from '@/app/utils/style-analysis';

interface ProgressChartProps {
  dailyScores: DailyScore[];
}

export const ProgressChart = ({ dailyScores }: ProgressChartProps) => {
  // Left padding for the chart
  const leftPadding = 30;
  // Compute effective width for plotting the points
  const effectiveWidth = chartDimensions.width - leftPadding - 10;

  // Calculate the chart path and points
  const { pathD, points, yMin, yMax } = calculateChartPath(
    dailyScores,
    chartDimensions.width - leftPadding - 10,
    chartDimensions.height - 40,
    leftPadding
  );

  // Find the point before the chart range and the leftmost point in the chart
  const beforeChartPoint = points.find(point => point.isBeforeChart);
  const leftmostPoint = points.find(point => !point.isBeforeChart);

  // Create a dashed path from the point before the chart range to the leftmost point
  let dashedPathD = '';
  if (beforeChartPoint && leftmostPoint && beforeChartPoint.score !== null && leftmostPoint.score !== null) {
    dashedPathD = `M ${beforeChartPoint.x} ${beforeChartPoint.y} L ${leftmostPoint.x} ${leftmostPoint.y}`;
  }

  // Format date to display actual date instead of "Yesterday"
  const formatDate = (dateStr: string) => {
    // If the date is "Yesterday", replace it with the actual date
    if (dateStr === "Yesterday") {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const day = yesterday.getDate();
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      return `${day} ${monthNames[yesterday.getMonth()]}`;
    }
    return dateStr;
  };

  // Calculate point spacing based on the number of points
  const pointSpacing = useMemo(() => {
    return (chartDimensions.width - leftPadding - 10) / (dailyScores.length - 1);
  }, [chartDimensions.width, leftPadding, dailyScores.length]);

  // Calculate y-axis label values
  const yAxisLabels = useMemo(() => {
    const range = yMax - yMin;
    const step = Math.ceil(range / 4);
    const labels = [];
    
    for (let i = 0; i <= 4; i++) {
      const value = yMin + (step * i);
      if (value <= yMax) {
        labels.push(value);
      }
    }
    
    return labels;
  }, [yMin, yMax]);

  return (
    <View style={[progressStyles.chartContainer, styles.customChartContainer]}>
      <View style={progressStyles.chartHeader}>
        <Text style={progressStyles.chartTitle}>Style Progress</Text>
        <Text style={progressStyles.chartLegend}>Last 7 days</Text>
      </View>
      
      <Svg style={styles.customSvgContainer} viewBox={`0 0 ${chartDimensions.width} ${chartDimensions.height + 20}`}>
        {/* Draw horizontal grid lines */}
        {yAxisLabels.map((label, index) => {
          const y = chartDimensions.height - ((label - yMin) / (yMax - yMin) * chartDimensions.height);
          return (
            <Line 
              key={`grid-${index}`}
              x1={leftPadding} 
              y1={y} 
              x2={chartDimensions.width} 
              y2={y} 
              stroke="#eee" 
              strokeWidth="1" 
            />
          );
        })}
        
        {/* Score labels */}
        {yAxisLabels.map((label, index) => {
          const y = chartDimensions.height - ((label - yMin) / (yMax - yMin) * chartDimensions.height);
          return (
            <SvgText 
              key={`label-${index}`}
              x="0" 
              y={y + 4} 
              fontSize="10" 
              fill="#999" 
              textAnchor="start"
            >
              {Math.round(label)}
            </SvgText>
          );
        })}
        
        {/* Draw the dashed line from the point before the chart range to the leftmost point */}
        {dashedPathD !== '' && (
          <Path d={dashedPathD} fill="none" stroke="#cca702" strokeWidth="2" strokeDasharray="5,5" />
        )}
        
        {/* Draw the main chart line */}
        {pathD !== '' && (
          <Path d={pathD} fill="none" stroke="#cca702" strokeWidth="2" />
        )}
        
        {/* Draw data points, score labels, and date labels */}
        {points.map((point, index) => (
          <G key={index}>
            {/* Only draw the circle for points that are not the virtual point */}
            {dailyScores[index].score !== null && !point.isBeforeChart && (
              <Circle 
                cx={point.x}
                cy={point.y}
                r="4"
                fill="#fff"
                stroke="#cca702"
                strokeWidth="2"
              />
            )}
            {/* Only display score and date labels if index is not 0 and not the virtual point */}
            {index !== 0 && !point.isBeforeChart && (
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

const styles = StyleSheet.create({
  customChartContainer: {
    marginHorizontal: 5, // Reduced from 10 to 5 to provide more space
    paddingRight: 15, // Added extra padding on the right to ensure "Today" is visible
  },
  customSvgContainer: {
    height: 140,
    width: '100%',
  },
});
