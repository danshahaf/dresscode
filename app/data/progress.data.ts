export interface Outfit {
  id: number;
  user_id: string;
  imageUrl: string;  // Map from the database field "image_url"
  score: number;
  date: string;      // Map from the "created_at" column, formatted as needed
}

export interface DailyScore {
  date: string;
  score: number | null;
  isLatest?: boolean; // Optional property to mark the latest point
  isBeforeChart?: boolean; // Optional property to mark the point before the chart range
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
  textAnalysis?: string;
  suggestions?: string[];
} 