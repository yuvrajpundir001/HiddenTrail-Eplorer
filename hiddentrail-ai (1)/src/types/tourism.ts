export type CategoryType =
  | 'heritage'
  | 'nature'
  | 'culture'
  | 'adventure'
  | 'food'
  | 'religious'
  | 'beach'
  | 'hill_station'
  | 'wildlife';

export type TravelGroupType = 'solo' | 'friends' | 'family' | 'couple';

export type SeasonType = 'Winter' | 'Monsoon' | 'Summer' | 'All Year';

export interface SourceLink {
  title: string;
  url: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface CuratedGuide {
  era: string;
  architectural_style: string;
  story: string;
}

export interface Destination {
  id: string;
  name: string;
  state: string;
  city: string;
  region: string;
  location: string;
  distance_from_gurugram_center_km?: number;
  category: CategoryType;
  categories: CategoryType[];
  description: string;
  historical_significance: string;
  best_time_to_visit: string;
  season: SeasonType;
  is_hidden_gem: boolean;
  estimated_duration_hours: number;
  estimated_budget_inr: number;
  budget_tier: string;
  opening_hours: string;
  opening_hours_verified: boolean;
  visitor_tips: string[];
  latitude: number;
  longitude: number;
  source_links: SourceLink[];
  image_url: string;
  suitable_for: TravelGroupType[];
  highlights: string[];
  what_to_observe: string[];
  famous_food: string[];
  local_traditions: string;
  responsible_tourism_tips: string[];
  faq: FAQItem[];
  curated_guide: CuratedGuide;
}

export interface RecommendationResult extends Destination {
  recommendation_score: number;
  why_recommended: string;
  matched_interests: string[];
}

export interface UserPreferences {
  starting_city: string;
  interests: CategoryType[];
  budget: number;
  available_hours: number;
  duration_days?: number;
  travel_group: TravelGroupType;
  preferred_season?: SeasonType;
  target_state?: string;
  experience_style?: 'relaxed' | 'immersive' | 'fast-paced';
}

export interface TimelineStop {
  stop_number: number;
  day_number?: number;
  destination: Destination;
  distance_from_prev_km: number;
  transit_minutes: number;
  transit_window: string;
  arrival_time: string;
  departure_time: string;
  visit_duration_hours: number;
  estimated_budget_inr: number;
  accommodation_suggestion?: string;
  food_recommendation?: string;
}

export interface ItineraryPlan {
  stops: TimelineStop[];
  total_duration_hours: number;
  total_days: number;
  total_budget_inr: number;
  total_transit_km: number;
  advice: string[];
  destinations: Destination[];
}
