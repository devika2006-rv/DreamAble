export interface JourneyProfile {
  goal: string;
  destination: string;
  accessibilityNeeds: string[];
  profileTags: string[];
  additionalRequirements: string;
}

export interface CompanionQuestion {
  prompt: string;
  choices: string[];
}

export interface Recommendation {
  id: number;
  name: string;
  category: string;
  distance: string;
  rating: number;
  confidence: number;
  tags: string[];
  image: string;
  description: string;
  verified: boolean;
  reviewCount: number;
  matchTags: string[];
  supportiveNeeds: string[];
  goalSignals: string[];
}

export interface PlaceRecord {
  id: number;
  name: string;
  category: string;
  destination: string;
  purpose: string;
  accessibilityTags: string[];
  distance: string;
  rating: number;
  confidence: number;
  image: string;
  description: string;
  verified: boolean;
  reviewCount: number;
}

export interface UserProfile {
  name: string;
  email: string;
  accessibilityProfile: string[];
  travelPreferences: string[];
  previousTrips: string[];
  favoritePlaces: string[];
  dreamAchieverBadge: boolean;
  savedAccessibilityPreferences: string[];
}

export interface AccessPassData {
  id: string;
  travelerName: string;
  destination: string;
  travelDate: string;
  journeyStatus: string;
  accessRequirements: string[];
  aiSummary: string;
  privacyNotice: string;
  qrValue: string;
}
