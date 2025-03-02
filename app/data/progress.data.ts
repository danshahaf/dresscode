// Types and interfaces
export interface DailyScore {
  date: string;
  score: number;
}

export interface Outfit {
  id: number;
  imageUrl: string;
  date: string;
  score: number;
  occasion: string;
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
    id: 1,
    imageUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    score: 92,
    date: 'Today',
    occasion: 'Casual'
  },
  {
    id: 2,
    imageUrl: 'https://images.unsplash.com/photo-1554412933-514a83d2f3c8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    score: 85,
    date: 'May 16',
    occasion: 'Semi-Formal'
  },
  {
    id: 3,
    imageUrl: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    score: 78,
    date: 'May 15',
    occasion: 'Business'
  },
  {
    id: 4,
    imageUrl: 'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    score: 89,
    date: 'May 14',
    occasion: 'Casual'
  },
  {
    id: 5,
    imageUrl: 'https://images.unsplash.com/photo-1583759136431-9d70db2eb04c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    score: 76,
    date: 'May 13',
    occasion: 'Casual'
  },
  {
    id: 6,
    imageUrl: 'https://images.unsplash.com/photo-1475180098004-ca77a66827be?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    score: 94,
    date: 'May 12',
    occasion: 'Formal'
  },
  {
    id: 7,
    imageUrl: 'https://images.unsplash.com/photo-1550614000-4895a10e1bfd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    score: 88,
    date: 'May 11',
    occasion: 'Business Casual'
  },
  {
    id: 8,
    imageUrl: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    score: 91,
    date: 'May 10',
    occasion: 'Evening'
  },
  {
    id: 9,
    imageUrl: 'https://images.unsplash.com/photo-1485462537746-965f33f7f6a7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    score: 83,
    date: 'May 9',
    occasion: 'Smart Casual'
  },
  {
    id: 10,
    imageUrl: 'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    score: 87,
    date: 'May 8',
    occasion: 'Cocktail'
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