import { StyleAnalysis } from '@/app/data/progress.data';

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

// Calculate chart points and path
export const calculateChartPath = (
  dailyScores: DailyScore[],
  width: number,
  height: number,
  leftPadding: number = 0
) => {
  if (!dailyScores || dailyScores.length === 0) {
    return { pathD: '', points: [] };
  }

  const points = dailyScores.map((score, index) => {
    // Calculate x position with proper padding
    const x = leftPadding + (index * ((width - leftPadding) / (dailyScores.length - 1)));
    // Calculate y position (invert the y-axis since SVG 0,0 is top-left)
    const y = height - (score.score / 100 * height);
    return { x, y };
  });

  // Create the path data
  let pathD = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    pathD += ` L ${points[i].x} ${points[i].y}`;
  }

  return { pathD, points };
}; 