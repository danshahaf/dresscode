import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Svg, { Polygon, Circle, Line, Text as SvgText } from 'react-native-svg';

interface ChartDataPoint {
  category: string;
  value: number;
}

interface StyleAnalysisChartProps {
  data: ChartDataPoint[];
}

export const StyleAnalysisChart: React.FC<StyleAnalysisChartProps> = ({ data }) => {
  const chartSize = Dimensions.get('window').width - 60;
  const centerX = chartSize / 2;
  const centerY = chartSize / 2;
  const radius = chartSize * 0.4;
  const categories = data.map(item => item.category);
  const maxValue = 100; // Assuming max value is 100
  
  // Calculate points for the radar chart
  const getPolygonPoints = () => {
    let points = '';
    data.forEach((item, index) => {
      const angle = (Math.PI * 2 * index) / data.length - Math.PI / 2;
      const x = centerX + (radius * item.value / maxValue) * Math.cos(angle);
      const y = centerY + (radius * item.value / maxValue) * Math.sin(angle);
      points += `${x},${y} `;
    });
    return points.trim();
  };
  
  // Calculate points for the background grid
  const getGridPoints = (percentage: number) => {
    let points = '';
    for (let i = 0; i < data.length; i++) {
      const angle = (Math.PI * 2 * i) / data.length - Math.PI / 2;
      const x = centerX + (radius * percentage) * Math.cos(angle);
      const y = centerY + (radius * percentage) * Math.sin(angle);
      points += `${x},${y} `;
    }
    return points.trim();
  };
  
  // Calculate positions for category labels
  const getCategoryPosition = (index: number) => {
    const angle = (Math.PI * 2 * index) / data.length - Math.PI / 2;
    const x = centerX + (radius + 20) * Math.cos(angle);
    const y = centerY + (radius + 20) * Math.sin(angle);
    return { x, y };
  };
  
  return (
    <View style={styles.container}>
      <Svg width={chartSize} height={chartSize}>
        {/* Background grid lines */}
        {[0.2, 0.4, 0.6, 0.8, 1].map((percentage) => (
          <Polygon
            key={`grid-${percentage}`}
            points={getGridPoints(percentage)}
            fill="none"
            stroke="#ddd"
            strokeWidth="1"
          />
        ))}
        
        {/* Axis lines */}
        {data.map((_, index) => {
          const angle = (Math.PI * 2 * index) / data.length - Math.PI / 2;
          const x = centerX + radius * Math.cos(angle);
          const y = centerY + radius * Math.sin(angle);
          return (
            <Line
              key={`axis-${index}`}
              x1={centerX}
              y1={centerY}
              x2={x}
              y2={y}
              stroke="#ddd"
              strokeWidth="1"
            />
          );
        })}
        
        {/* Data polygon */}
        <Polygon
          points={getPolygonPoints()}
          fill="rgba(204, 167, 2, 0.3)"
          stroke="#cca702"
          strokeWidth="2"
        />
        
        {/* Data points */}
        {data.map((item, index) => {
          const angle = (Math.PI * 2 * index) / data.length - Math.PI / 2;
          const x = centerX + (radius * item.value / maxValue) * Math.cos(angle);
          const y = centerY + (radius * item.value / maxValue) * Math.sin(angle);
          return (
            <Circle
              key={`point-${index}`}
              cx={x}
              cy={y}
              r={4}
              fill="#cca702"
            />
          );
        })}
        
        {/* Category labels */}
        {categories.map((category, index) => {
          const { x, y } = getCategoryPosition(index);
          return (
            <SvgText
              key={`label-${index}`}
              x={x}
              y={y}
              fontSize="12"
              fill="#555"
              textAnchor="middle"
              alignmentBaseline="middle"
            >
              {category}
            </SvgText>
          );
        })}
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
}); 