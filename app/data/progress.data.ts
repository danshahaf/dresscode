// Types and interfaces
export interface DailyScore {
  date: string;
  score: number;
}

export interface Outfit {
  id: number;
  user_id: string;
  imageUrl: string;  // Map from the database field "image_url"
  score: number;
  date: string;      // Map from the "created_at" column, formatted as needed
}


export interface StyleCritique {
  score: number;
  critique: string;
}

export interface StyleAnalysis {
  colorHarmony: StyleCritique;
  fitAndSilhouette: StyleCritique;
  styleCoherence: StyleCritique;
  accessorizing: StyleCritique;
  occasionMatch: StyleCritique;
  trendAwareness: StyleCritique;
}

// Mock data
export const mockDailyScores: DailyScore[] = [
  { date: 'Mon', score: 78 },
  { date: 'Tue', score: 85 },
  { date: 'Wed', score: 72 },
  { date: 'Thu', score: 91 }
];


export const mockStyleAnalysis: StyleAnalysis = {
  colorHarmony: {
    score: 8.5,
    critique: "Great color coordination with complementary tones. The warm neutrals work well together, creating a cohesive palette that's visually appealing."
  },
  fitAndSilhouette: {
    score: 7.8,
    critique: "The silhouette flatters your body type, though the top could be slightly more tailored at the waist to enhance your natural shape."
  },
  styleCoherence: {
    score: 9.2,
    critique: "Excellent style coherence. Each piece works together to create a unified aesthetic that feels intentional and well-curated."
  },
  accessorizing: {
    score: 6.5,
    critique: "Accessories are minimal. Consider adding a statement piece like a bold necklace or structured bag to elevate the look."
  },
  occasionMatch: {
    score: 8.9,
    critique: "This outfit is well-suited for casual to semi-formal settings. Versatile enough for daytime events while maintaining a polished appearance."
  },
  trendAwareness: {
    score: 7.3,
    critique: "Incorporates some current trends while maintaining a timeless quality. The silhouette is contemporary without being overly trend-focused."
  }
}; 