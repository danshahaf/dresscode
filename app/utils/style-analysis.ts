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
  if (value >= 8.5) return '#4CAF50'; // Green for high scores
  if (value >= 7) return '#FFC107';   // Amber for medium scores
  return '#F44336';                   // Red for low scores
};

// Calculate chart points and path
export const calculateChartPath = (
  scores: { date: string; score: number }[],
  chartWidth: number,
  chartHeight: number
): { pathD: string; points: { x: number; y: number }[] } => {
  const pointSpacing = chartWidth / (scores.length - 1);
  let pathD = '';
  
  const points = scores.map((item, index) => {
    const x = index * pointSpacing;
    const y = chartHeight - (item.score / 100 * chartHeight);
    
    if (index === 0) {
      pathD += `M ${x} ${y}`;
    } else {
      pathD += ` L ${x} ${y}`;
    }
    
    return { x, y };
  });
  
  return { pathD, points };
}; 