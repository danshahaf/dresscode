// Types and interfaces
export interface DailyScore {
  date: string;
  score: number;
}

export interface Outfit {
  id: string;
  image: string;
  score: number;
  date: string;
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

export const mockOutfits: Outfit[] = [
  {
    id: '1',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    score: 92,
    date: 'Today'
  },
  {
    id: '2',
    image: 'https://images.unsplash.com/photo-1554412933-514a83d2f3c8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    score: 85,
    date: 'Yesterday'
  },
  {
    id: '3',
    image: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    score: 78,
    date: 'May 15'
  },
  {
    id: '4',
    image: 'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    score: 89,
    date: 'May 14'
  },
  {
    id: '5',
    image: 'https://images.unsplash.com/photo-1583759136431-9d70db2eb04c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    score: 76,
    date: 'May 13'
  },
  {
    id: '6',
    image: 'https://images.unsplash.com/photo-1475180098004-ca77a66827be?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    score: 94,
    date: 'May 12'
  }
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