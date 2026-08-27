export type BoatType = 'rowing' | 'motor' | 'bajra' | 'cruise';
export type TripType = 'ghat_hop' | 'sunrise_cruise' | 'aarti_anchor' | 'full_circuit';

export interface BoatEstimateInput {
  boatType: BoatType;
  tripType: TripType;
  passengers: number;
  isPrivate: boolean;
}

export interface BoatEstimateResult {
  minPrice: number;
  maxPrice: number;
  recommendedPrice: number;
  govtBenchmarkRate: number;
  pricePerPerson: number;
  durationMinutes: number;
  distanceKm: number;
  tips: string[];
  hindiTips: string[];
}

export const BOAT_TYPES = [
  {
    id: 'rowing' as BoatType,
    name: 'Traditional Hand-rowed Boat (नाव)',
    hindiName: 'पारंपरिक हाथ की नाव (चप्पू वाली नाव)',
    capacity: '1 - 6 persons',
    description: 'Eco-friendly, serene, and allows gliding close to the historic stone ghat steps.',
    hindiDescription: 'पर्यावरण अनुकूल, शांत और घाटों के बिल्कुल पास से देखने के लिए सर्वोत्तम।',
  },
  {
    id: 'motor' as BoatType,
    name: 'Motor Boat (मोटर बोट)',
    hindiName: 'मोटर चालित नाव',
    capacity: '6 - 25 persons',
    description: 'Fast and stable. Covers large distances across all 84 ghats quickly.',
    hindiDescription: 'तेज गति और सभी 84 घाटों को कम समय में देखने के लिए उपयुक्त।',
  },
  {
    id: 'bajra' as BoatType,
    name: 'Royal Heritage Bajra (बजड़ा)',
    hindiName: 'शाही बनारसी बजड़ा',
    capacity: '15 - 50 persons',
    description: 'Large two-tier wooden boat with open roof-deck for family groups and Aarti watching.',
    hindiDescription: 'पारिवारिक समूहों और छत से भव्य आरती देखने के लिए बड़ा दो-मंजिला बजड़ा।',
  },
  {
    id: 'cruise' as BoatType,
    name: 'Alaknanda Luxury Electric Cruise (क्रूज़)',
    hindiName: 'अलकनंदा लग्जरी इलेक्ट्रिक क्रूज़',
    capacity: 'Up to 100 persons',
    description: 'Fully air-conditioned luxury cruise with audio commentary and refreshments.',
    hindiDescription: 'वातानुकूलित आधुनिक क्रूज़ जिसमें ऑडियो गाइड और जलपान की सुविधा है।',
  },
];

export const TRIP_TYPES = [
  {
    id: 'sunrise_cruise' as TripType,
    name: 'Subah-e-Banaras Sunrise Cruise (सुबह की नौका यात्रा)',
    hindiName: 'सुबह-ए-बनारस सूर्योदय नौका विहार',
    duration: '1.5 – 2.0 hours',
    route: 'Assi Ghat ↔ Manikarnika Ghat (Round-trip)',
  },
  {
    id: 'aarti_anchor' as TripType,
    name: 'Evening Ganga Aarti Anchor (संध्या आरती दर्शन)',
    hindiName: 'संध्या महा गंगा आरती दर्शन',
    duration: '1.5 hours',
    route: 'Ghat departure → Anchoring directly in front of Dashashwamedh Ghat',
  },
  {
    id: 'ghat_hop' as TripType,
    name: 'Short Ghat-to-Ghat Hop (एक घाट से दूसरे घाट)',
    hindiName: 'घाट से घाट एकतरफा यात्रा',
    duration: '20 – 30 mins',
    route: 'Point-to-point (e.g., Assi to Dashashwamedh or Kashi Vishwanath)',
  },
  {
    id: 'full_circuit' as TripType,
    name: 'Complete 84 Ghats Grand Circuit (संपूर्ण 84 घाट दर्शन)',
    hindiName: 'संपूर्ण 84 घाट भव्य परिक्रमा',
    duration: '2.5 – 3.0 hours',
    route: 'Assi Ghat ↔ Namo / Raj Ghat ↔ Return',
  },
];

/**
 * Calculates accurate, fair tariff estimates for boat rides in Varanasi
 */
export function calculateBoatFare(input: BoatEstimateInput): BoatEstimateResult {
  const { boatType, tripType, passengers, isPrivate } = input;
  const safePax = Math.max(1, Math.min(passengers || 1, 60));

  let baseMin = 300;
  let baseMax = 500;
  let govtRate = 250;
  let duration = 60;
  let distance = 3.5;

  switch (tripType) {
    case 'ghat_hop':
      duration = 25;
      distance = 2.0;
      if (boatType === 'rowing') {
        baseMin = isPrivate ? 250 : 50 * safePax;
        baseMax = isPrivate ? 400 : 70 * safePax;
        govtRate = isPrivate ? 200 : 40 * safePax;
      } else if (boatType === 'motor') {
        baseMin = isPrivate ? 500 : 100 * safePax;
        baseMax = isPrivate ? 800 : 150 * safePax;
        govtRate = isPrivate ? 450 : 80 * safePax;
      } else {
        baseMin = 1500;
        baseMax = 2500;
        govtRate = 1200;
      }
      break;

    case 'sunrise_cruise':
      duration = 90;
      distance = 5.0;
      if (boatType === 'rowing') {
        baseMin = isPrivate ? 800 : 150 * safePax;
        baseMax = isPrivate ? 1200 : 250 * safePax;
        govtRate = isPrivate ? 700 : 120 * safePax;
      } else if (boatType === 'motor') {
        baseMin = isPrivate ? 1500 : 200 * safePax;
        baseMax = isPrivate ? 2200 : 300 * safePax;
        govtRate = isPrivate ? 1200 : 180 * safePax;
      } else if (boatType === 'bajra') {
        baseMin = isPrivate ? 4000 : 350 * safePax;
        baseMax = isPrivate ? 6000 : 500 * safePax;
        govtRate = isPrivate ? 3500 : 300 * safePax;
      } else {
        // Cruise
        baseMin = 750 * safePax;
        baseMax = 1000 * safePax;
        govtRate = 750 * safePax;
      }
      break;

    case 'aarti_anchor':
      duration = 90;
      distance = 3.0;
      if (boatType === 'rowing') {
        baseMin = isPrivate ? 1000 : 200 * safePax;
        baseMax = isPrivate ? 1500 : 300 * safePax;
        govtRate = isPrivate ? 800 : 150 * safePax;
      } else if (boatType === 'motor') {
        baseMin = isPrivate ? 1800 : 250 * safePax;
        baseMax = isPrivate ? 2800 : 400 * safePax;
        govtRate = isPrivate ? 1500 : 200 * safePax;
      } else if (boatType === 'bajra') {
        baseMin = isPrivate ? 5000 : 400 * safePax;
        baseMax = isPrivate ? 8000 : 600 * safePax;
        govtRate = isPrivate ? 4500 : 350 * safePax;
      } else {
        // Cruise
        baseMin = 850 * safePax;
        baseMax = 1200 * safePax;
        govtRate = 850 * safePax;
      }
      break;

    case 'full_circuit':
      duration = 150;
      distance = 12.0;
      if (boatType === 'rowing') {
        baseMin = isPrivate ? 1500 : 300 * safePax;
        baseMax = isPrivate ? 2200 : 450 * safePax;
        govtRate = isPrivate ? 1200 : 250 * safePax;
      } else if (boatType === 'motor') {
        baseMin = isPrivate ? 2500 : 400 * safePax;
        baseMax = isPrivate ? 3800 : 600 * safePax;
        govtRate = isPrivate ? 2200 : 350 * safePax;
      } else if (boatType === 'bajra') {
        baseMin = isPrivate ? 7000 : 600 * safePax;
        baseMax = isPrivate ? 11000 : 900 * safePax;
        govtRate = isPrivate ? 6500 : 550 * safePax;
      } else {
        baseMin = 1200 * safePax;
        baseMax = 1600 * safePax;
        govtRate = 1200 * safePax;
      }
      break;
  }

  const recommendedPrice = Math.round((baseMin * 0.6 + baseMax * 0.4) / 50) * 50;
  const pricePerPerson = Math.round((isPrivate ? recommendedPrice / safePax : recommendedPrice / safePax));

  const tips = [
    'Always agree on the complete total price and exact drop-off ghat before boarding.',
    'Life jackets are mandatory by Varanasi Jal Police regulations — ensure jackets are worn before departure.',
    'For evening Ganga Aarti, board 45 minutes prior to secure front-row water anchorage at Dashashwamedh.',
    'Early morning sunrise boats are quietest between 5:30 AM and 6:30 AM from Assi Ghat.',
  ];

  const hindiTips = [
    'नाव पर बैठने से पहले कुल किराया और वापसी का घाट निश्चित कर लें।',
    'जल पुलिस के नियमानुसार लाइफ जैकेट पहनना अनिवार्य है।',
    'संध्या आरती के लिए आरती शुरू होने से 45 मिनट पहले पहुंचे ताकि अच्छी जगह मिल सके।',
    'अस्सी घाट से सुबह 5:30 से 6:30 के बीच सूर्योदय नौकायन का सर्वोत्तम समय है।',
  ];

  return {
    minPrice: baseMin,
    maxPrice: baseMax,
    recommendedPrice,
    govtBenchmarkRate: govtRate,
    pricePerPerson,
    durationMinutes: duration,
    distanceKm: distance,
    tips,
    hindiTips,
  };
}
