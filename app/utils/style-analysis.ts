import { StyleAnalysis } from '@/app/data/progress.data';
import { DailyScore } from '@/app/data/progress.data';

// Calculate overall score from style analysis
export const calculateOverallScore = (analysis: StyleAnalysis): string => {
  const scores = [
    analysis.colorHarmony.score,
    analysis.fitAndSilhouette.score,
    analysis.styleCoherence.score,
    analysis.accessorizing.score,
    analysis.occasionMatch.score,
    analysis.trendAwareness.score
  ];
  return (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1);
};

// Get color based on score
export const getScoreColor = (value: number): string => {
  if (value >= 8.5) return '#4CAF50'; // Green for high scores - update this color
  if (value >= 7) return '#CCA702';   // Gold for medium scores - matches app theme
  return '#E53935';                   // Red for low scores - update this color
};

export function calculateChartPath(
  dailyScores: DailyScore[],
  width: number,
  height: number,
  leftPadding: number
): { pathD: string; points: { x: number; y: number; isBeforeChart?: boolean; isLatest?: boolean; score: number | null; }[]; yMin: number; yMax: number } {
  const numPoints = dailyScores.length;
  const pointSpacing = width / (numPoints - 1);
  
  // Filter out points with null scores, but keep the point before the chart range
  const validScores = dailyScores.filter(score => score.score !== null || score.isBeforeChart);
  
  // Calculate the min and max scores for the y-axis
  let minScore = 0;
  let maxScore = 100;
  
  if (validScores.length > 0) {
    // Find the minimum and maximum scores
    const scores = validScores.map(score => score.score).filter(score => score !== null) as number[];
    if (scores.length > 0) {
      minScore = Math.max(0, Math.min(...scores) - 10);
      maxScore = Math.max(100, Math.max(...scores) + 10);
    }
  }
  
  const points = dailyScores.map((score, index) => ({
    x: leftPadding + index * pointSpacing,
    y: height - ((score.score || 0) - minScore) / (maxScore - minScore) * height,
    score: score.score,
    isLatest: score.isLatest,
    isBeforeChart: score.isBeforeChart
  }));
  
  // Filter out points with null scores, but keep the point before the chart range
  const validPoints = points.filter(point => point.score !== null || point.isBeforeChart);
  
  let pathD = '';
  if (validPoints.length > 1) {
    pathD = `M ${validPoints[0].x} ${validPoints[0].y}`;
    for (let i = 1; i < validPoints.length; i++) {
      const prev = validPoints[i - 1];
      const curr = validPoints[i];
      const cp1x = prev.x + (curr.x - prev.x) / 3;
      const cp1y = prev.y;
      const cp2x = curr.x - (curr.x - prev.x) / 3;
      const cp2y = curr.y;
      pathD += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${curr.x} ${curr.y}`;
    }
  }
  
  return { pathD, points, yMin: minScore, yMax: maxScore };
}