export type PlaceCategory = 
  | 'ghats'
  | 'temples'
  | 'food'
  | 'cafes'
  | 'hospitals'
  | 'pharmacies'
  | 'atms'
  | 'transport'
  | 'parks'
  | 'libraries'
  | 'hotels'
  | 'toilets'
  | 'parking';

export interface Coordinates {
  lat: number;
  lng: number;
}

export type PlaceStatus = 'curated' | 'verified' | 'community';

export interface Place {
  id: string;
  name: string;
  hindiName?: string;
  category: PlaceCategory;
  subCategory?: string;
  address: string;
  coordinates: Coordinates;
  description: string;
  visitorTip?: string;
  timing: string;
  openNow?: boolean;
  rating: number;
  reviewCount: number;
  entryFee?: string;
  coverImage: string;
  images?: string[];
  amenities: string[];
  status: PlaceStatus;
  lastUpdated: string;
  sourceUrl?: string;
  sourceName?: string;
  verifiedAt?: string;
  contactPhone?: string;
  officialWebsite?: string;
  isFeatured?: boolean;
}

export interface CategoryInfo {
  id: PlaceCategory;
  name: string;
  hindiName: string;
  description: string;
  iconName: string;
  color: string;
  badgeBg: string;
  badgeText: string;
  count?: number;
}

export interface WeatherData {
  temp: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  weatherCode: number;
  weatherText: string;
  sunrise: string;
  sunset: string;
  isDay: boolean;
  lastUpdated: string;
  source: 'open-meteo' | 'fallback';
}

export type AirQualityStatus = 'Good' | 'Moderate' | 'Poor' | 'Unhealthy';

export interface AirQualityData {
  aqi: number;
  pm25: number;
  pm10: number;
  status: AirQualityStatus;
  statusText: string;
  healthRecommendation: string;
  badgeColor: string;
  lastUpdated: string;
  source: 'open-meteo' | 'fallback';
}

export interface EventSchedule {
  id: string;
  title: string;
  hindiTitle: string;
  locationName: string;
  locationId: string;
  coordinates: Coordinates;
  description: string;
  summerTiming: string;
  winterTiming: string;
  currentEffectiveTiming: string;
  bestViewingSpot: string;
  durationMinutes: number;
  isDaily: boolean;
  ticketType: 'Free' | 'Paid' | 'Donation';
  lastUpdated: string;
  sourceUrl?: string;
  sourceName?: string;
}

export interface EmergencyNumberInfo {
  name: string;
  hindiName: string;
  number: string;
  secondaryNumber?: string;
  description: string;
  icon: string;
  color: string;
  sourceUrl?: string;
  sourceName?: string;
}

export interface EmergencyService {
  id: string;
  name: string;
  category: 'hospital' | 'pharmacy' | 'police' | 'atm' | 'toilet' | 'helpline';
  categoryLabel: string;
  phone: string;
  secondaryPhone?: string;
  address: string;
  landmark?: string;
  coordinates: Coordinates;
  openHours: string;
  is24x7: boolean;
  status: 'curated' | 'verified';
  lastUpdated: string;
  sourceUrl?: string;
  sourceName?: string;
  verifiedAt?: string;
  specialty?: string;
}

export interface SavedPlaceItem {
  id?: string;
  placeId: string;
  listId: string;
  savedAt: string;
  notes?: string;
}

export interface PlaceList {
  id: string;
  name: string;
  description: string;
  iconName: string;
  isDefault: boolean;
  createdAt: string;
}

export interface UserProfile {
  id: string;
  email?: string;
  displayName?: string;
  avatarUrl?: string;
}
