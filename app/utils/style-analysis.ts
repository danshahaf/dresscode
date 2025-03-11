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

export const calculateChartPath = (
  dailyScores: DailyScore[],
  effectiveWidth: number,
  chartHeight: number,
  leftPadding: number
) => {
  // There are 7 days, so 6 intervals.
  const pointSpacing = effectiveWidth / 6;
  
  // Map dailyScores to 7 points.
  // If score is null, set y to baseline (chartHeight).
  const points = dailyScores.map((ds, index) => {
    const y = ds.score !== null ? chartHeight - (ds.score / 100) * chartHeight : chartHeight;
    return { x: leftPadding + index * pointSpacing, y, score: ds.score };
  });

  let pathD = '';
  // Filter out points with valid (non-null) scores
  const validPoints = points.filter(p => p.score !== null);
  if (validPoints.length > 1) {
    pathD = `M ${validPoints[0].x} ${validPoints[0].y} `;
    for (let i = 0; i < validPoints.length - 1; i++) {
      const p0 = validPoints[i];
      const p1 = validPoints[i + 1];
      const cp1x = p0.x + (p1.x - p0.x) / 2;
      const cp1y = p0.y;
      const cp2x = p0.x + (p1.x - p0.x) / 2;
      const cp2y = p1.y;
      pathD += `C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p1.x} ${p1.y} `;
    }
  }

  
  return { pathD, points };
};