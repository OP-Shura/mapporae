import { EventSchedule } from '@/lib/types';

/**
 * Configurable event schedules for Varanasi rituals, cultural programmes, and tours.
 * Timings are dynamically adjusted based on seasonal sunset/sunrise variations
 * or manual administrative overrides.
 */
export const EVENT_SCHEDULES_CONFIG: EventSchedule[] = [
  {
    id: 'dashashwamedh-ganga-aarti',
    title: 'Maha Ganga Aarti at Dashashwamedh Ghat',
    hindiTitle: 'दशाश्वमेध महा गंगा आरती',
    locationName: 'Dashashwamedh Ghat, Godowlia',
    locationId: 'dashashwamedh-ghat',
    coordinates: { lat: 25.3072, lng: 83.0104 },
    description: 'The iconic grand evening synchronized prayer ritual by priests adorned in vibrant silken robes with brass lamps, conch shells, and incense along the sacred river.',
    summerTiming: '07:00 PM – 07:45 PM',
    winterTiming: '06:00 PM – 06:45 PM',
    currentEffectiveTiming: '06:30 PM (Evening)',
    bestViewingSpot: 'Hire a wooden boat in the river 30 mins before or secure a platform seat by 5:45 PM.',
    durationMinutes: 45,
    isDaily: true,
    ticketType: 'Free',
    lastUpdated: '2026-08-25T12:00:00Z',
  },
  {
    id: 'assi-subah-e-banaras',
    title: 'Subah-e-Banaras & Morning Aarti at Assi Ghat',
    hindiTitle: 'सुबह-ए-बनारस (अस्सी घाट)',
    locationName: 'Assi Ghat, Southern Waterfront',
    locationId: 'assi-ghat',
    coordinates: { lat: 25.2891, lng: 83.0066 },
    description: 'Dawn spiritual programme featuring Vedic chanting, morning Ganga Aarti at sunrise, traditional Hindustani classical music / Shehnai, and group Yogasana.',
    summerTiming: '05:00 AM – 06:30 AM',
    winterTiming: '05:45 AM – 07:15 AM',
    currentEffectiveTiming: '05:30 AM (Sunrise)',
    bestViewingSpot: 'Upper steps of Assi Ghat amphitheatre directly facing the rising sun across the Ganga.',
    durationMinutes: 90,
    isDaily: true,
    ticketType: 'Free',
    lastUpdated: '2026-08-25T12:00:00Z',
  },
  {
    id: 'sunrise-wooden-boat-tour',
    title: 'Historic Ghat Sunrise Rowing Tour',
    hindiTitle: 'प्रातःकालीन नौका विहार',
    locationName: 'Assi Ghat to Manikarnika Ghat',
    locationId: 'assi-ghat',
    coordinates: { lat: 25.2950, lng: 83.0080 },
    description: 'Classic wooden rowing boat tour gliding past 84 ghats bathed in golden morning light, witnessing rituals, pilgrims, and historic palatial ghat architecture.',
    summerTiming: '05:15 AM – 07:00 AM',
    winterTiming: '06:00 AM – 07:45 AM',
    currentEffectiveTiming: '05:45 AM (Dawn)',
    bestViewingSpot: 'Boat boarding from Assi or Dashashwamedh jetty.',
    durationMinutes: 60,
    isDaily: true,
    ticketType: 'Paid',
    lastUpdated: '2026-08-24T18:00:00Z',
  },
  {
    id: 'godowlia-chowk-night-heritage-walk',
    title: 'Godowlia to Chowk Street Food & Heritage Crawl',
    hindiTitle: 'गोदौलिया - चौक रात्रि भ्रमण',
    locationName: 'Godowlia Crossing to Vishwanath Gali',
    locationId: 'kashi-chaat-bhandar',
    coordinates: { lat: 25.3090, lng: 83.0060 },
    description: 'Evening pedestrian-only walking route exploring historic alleys, aromatic chaat corners, brass shops, and famous Banarasi silk weavers.',
    summerTiming: '07:30 PM – 10:30 PM',
    winterTiming: '06:30 PM – 09:30 PM',
    currentEffectiveTiming: '07:00 PM – 10:00 PM',
    bestViewingSpot: 'Start at Godowlia intersection and stroll along Dashashwamedh Road.',
    durationMinutes: 120,
    isDaily: true,
    ticketType: 'Free',
    lastUpdated: '2026-08-24T18:00:00Z',
  }
];

export function getEffectiveEventSchedule(id: string): EventSchedule | undefined {
  return EVENT_SCHEDULES_CONFIG.find(event => event.id === id);
}
