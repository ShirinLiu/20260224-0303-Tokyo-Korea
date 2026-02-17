
export enum EventType {
  FLIGHT = 'FLIGHT',
  TRAIN = 'TRAIN',
  STAY = 'STAY',
  ACTIVITY = 'ACTIVITY',
  TRANSFER = 'TRANSFER',
  SHOPPING = 'SHOPPING'
}

export interface Tag {
  label: string;
  type: 'food' | 'shopping' | 'reservation' | 'alert' | 'info';
}

export interface ItineraryItem {
  id: string;
  date: string;
  type: EventType;
  title: string;
  startLocation?: string;
  endLocation?: string;
  startTime?: string;
  endTime?: string;
  code?: string; // Flight number or Train number
  notes?: string;
  
  // New Enhanced Fields
  walkingRoute?: string; // Short summary
  detailedWalkingGuide?: { // Detailed steps
    steps: string[];
    mapImage?: string; // URL to station map or street view
  };
  attachments?: string[]; // URLs for booking confirmations/tickets (User uploaded)
  
  // AI Guide Specific Field
  guideRecommendation?: {
    mustOrder: string;
    tips: string;
  };

  tags?: Tag[]; // Structured tags from Gemini
}

export interface DailyPlan {
  date: string; // e.g., "2/24 (二)"
  items: ItineraryItem[];
  weather?: string; // Populated by Gemini
  summary?: string;
}

export interface Budget {
  id: string;
  category: string;
  item: string;
  amount: number;
  currency: 'TWD' | 'JPY' | 'KRW';
}

export interface AppState {
  view: 'itinerary' | 'tools' | 'settings';
  hasAnalyzed: boolean;
  isLoadingAI: boolean;
}
