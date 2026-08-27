import { Coordinates } from '@/lib/types';

export interface TrailStop {
  id: string;
  name: string;
  hindiName?: string;
  coordinates: Coordinates;
  description: string;
  hindiDescription?: string;
  significance: string;
  recommendedTime: string;
  placeId?: string;
}

export interface HeritageTrail {
  id: string;
  title: string;
  hindiTitle: string;
  subtitle: string;
  hindiSubtitle: string;
  description: string;
  hindiDescription: string;
  distanceKm: number;
  estimatedDurationMins: number;
  difficulty: 'Easy' | 'Moderate' | 'Challenging';
  bestTimeToWalk: string;
  hindiBestTime: string;
  coverImage: string;
  stops: TrailStop[];
}

export const HERITAGE_TRAILS: HeritageTrail[] = [
  {
    id: 'sacred-riverfront',
    title: 'Sacred Riverfront Odyssey (Assi to Dashashwamedh)',
    hindiTitle: 'पवित्र घाट पदयात्रा (अस्सी से दशाश्वमेध)',
    subtitle: 'A soulful 3.2 km sunrise or twilight walk across 12 iconic ghats.',
    hindiSubtitle: '12 ऐतिहासिक घाटों से होकर गुजरने वाली 3.2 किमी की आध्यात्मिक पदयात्रा।',
    description:
      'Experience the eternal spirit of Kashi along the crescent-shaped Ganga riverfront. From the cultural mornings at Assi to the vibrant Ganga Aarti at Dashashwamedh, this route passes historic palaces, South Indian shrines, and royal forts.',
    hindiDescription:
      'अस्सी घाट की सुबह-ए-बनारस से शुरू होकर दशाश्वमेध घाट की भव्य गंगा आरती तक की सबसे प्रसिद्ध और मनमोहक नदी तट पदयात्रा।',
    distanceKm: 3.2,
    estimatedDurationMins: 55,
    difficulty: 'Easy',
    bestTimeToWalk: '5:30 AM – 7:30 AM or 4:30 PM – 6:30 PM',
    hindiBestTime: 'सुबह 5:30 से 7:30 या शाम 4:30 से 6:30',
    coverImage: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?q=80&w=1200&auto=format&fit=crop',
    stops: [
      {
        id: 'assi-stop',
        name: 'Assi Ghat',
        hindiName: 'अस्सी घाट',
        coordinates: { lat: 25.2885, lng: 83.0064 },
        description: 'Southernmost major ghat, famous for Subah-e-Banaras morning aarti, yoga, and river tranquility.',
        hindiDescription: 'सुबह-ए-बनारस, वैदिक मंत्रोच्चार और योग के लिए विख्यात दक्षिणतम प्रमुख घाट।',
        significance: 'Confluence of sacred River Assi and Ganga.',
        recommendedTime: '15 mins',
        placeId: 'assi-ghat',
      },
      {
        id: 'tulsi-stop',
        name: 'Tulsi Ghat',
        hindiName: 'तुलसी घाट',
        coordinates: { lat: 25.2912, lng: 83.0071 },
        description: 'Where saint-poet Goswami Tulsidas composed the epic Ramcharitmanas.',
        hindiDescription: 'वह पावन स्थल जहाँ गोस्वामी तुलसीदास जी ने रामचरितमानस की रचना की।',
        significance: 'Historic house and manuscripts of saint Tulsidas.',
        recommendedTime: '10 mins',
      },
      {
        id: 'chet-singh-stop',
        name: 'Chet Singh Fort Ghat',
        hindiName: 'चेत सिंह किला घाट',
        coordinates: { lat: 25.2965, lng: 83.0078 },
        description: 'Fortified stone palace that witnessed Raja Chet Singh’s fierce battle against Warren Hastings in 1781.',
        hindiDescription: 'भव्य पाषाण दुर्ग जिसने 1781 में अंग्रेजों के विरुद्ध ऐतिहासिक संघर्ष देखा।',
        significance: 'Architectural marvel of 18th-century Rajput-Mughal style.',
        recommendedTime: '10 mins',
      },
      {
        id: 'harishchandra-stop',
        name: 'Harishchandra Ghat',
        hindiName: 'हरिश्चंद्र घाट',
        coordinates: { lat: 25.2998, lng: 83.0088 },
        description: 'Ancient cremation ghat named after legendary King Harishchandra known for unyielding truth.',
        hindiDescription: 'सत्यवादी राजा हरिश्चंद्र के नाम पर बना प्राचीन मोक्ष घाट।',
        significance: 'One of the two sacred cremation ghats in Varanasi.',
        recommendedTime: '5 mins',
      },
      {
        id: 'kedar-stop',
        name: 'Kedar Ghat',
        hindiName: 'केदार घाट',
        coordinates: { lat: 25.3032, lng: 83.0095 },
        description: 'Striking red-and-white striped South Indian-style ghat with the revered Sri Gauri Kedareshwar Shiva temple.',
        hindiDescription: 'लाल और सफेद धारियों वाला सुंदर दक्षिण भारतीय शैली का घाट और श्री गौरी केदारेश्वर मंदिर।',
        significance: 'Sacred equivalent to Kedarnath in Kashi.',
        recommendedTime: '10 mins',
      },
      {
        id: 'dashashwamedh-stop',
        name: 'Dashashwamedh Ghat',
        hindiName: 'दशाश्वमेध घाट',
        coordinates: { lat: 25.3072, lng: 83.0104 },
        description: 'The vibrant heart of Varanasi, famous worldwide for the grand Sandhya Ganga Aarti.',
        hindiDescription: 'काशी का मुख्य केंद्र, जहाँ प्रतिदिन संध्या समय दिव्य महा गंगा आरती होती है।',
        significance: 'Site where Lord Brahma performed ten horse sacrifices.',
        recommendedTime: '20 mins',
        placeId: 'dashashwamedh-ghat',
      },
    ],
  },
  {
    id: 'vishwanath-galis',
    title: 'Kashi Vishwanath & Ancient Galis Trail',
    hindiTitle: 'काशी विश्वनाथ एवं प्राचीन गलियाँ परिक्रमा',
    subtitle: 'A mystical 1.8 km labyrinth walk through silk weavers, street chaat, and sacred shrines.',
    hindiSubtitle: 'रेशम बुनकरों, लस्सी, चाट और प्राचीन मंदिरों से होकर गुजरती 1.8 किमी की गलियों की यात्रा।',
    description:
      'Venture deep into the timeless alleyways of Old Kashi. Walk through sweet-smelling Thatheri Bazaar, visit the Golden Temple corridor, savor authentic blue lassi, and reach the eternal fire of Manikarnika.',
    hindiDescription:
      'पुरानी काशी की जीवंत गलियों, ठठेरी बाजार, नीली लस्सी और भव्य श्री काशी विश्वनाथ धाम से मणिकर्णिका तक की प्रामाणिक यात्रा।',
    distanceKm: 1.8,
    estimatedDurationMins: 45,
    difficulty: 'Moderate',
    bestTimeToWalk: '8:00 AM – 11:00 AM or 3:30 PM – 5:30 PM',
    hindiBestTime: 'सुबह 8:00 से 11:00 या दोपहर 3:30 से 5:30',
    coverImage: 'https://images.unsplash.com/photo-1609766857041-ed402ea8069a?q=80&w=1200&auto=format&fit=crop',
    stops: [
      {
        id: 'godowlia-stop',
        name: 'Godowlia Crossing',
        hindiName: 'गोदौलिया चौराहा',
        coordinates: { lat: 25.3088, lng: 83.0075 },
        description: 'The energetic entry gate into old Banaras pedestrian lanes filled with cycle rickshaws and street vendors.',
        hindiDescription: 'काशी की गलियों का मुख्य प्रवेश द्वार एवं वाणिज्यिक केंद्र।',
        significance: 'Gateway to Vishwanath corridor and ghats.',
        recommendedTime: '5 mins',
      },
      {
        id: 'thatheri-stop',
        name: 'Thatheri Bazaar & Kachori Gali',
        hindiName: 'ठठेरी बाजार एवं कचौरी गली',
        coordinates: { lat: 25.3102, lng: 83.0092 },
        description: 'Narrow lane famous for steaming morning kachori-sabzi, jalebi, and master brass metalworkers.',
        hindiDescription: 'गरमा-गरम कचौरी, जलेबी और पारंपरिक पीतल शिल्पकारों की ऐतिहासिक गली।',
        significance: 'Centuries-old culinary and handicraft artery.',
        recommendedTime: '15 mins',
        placeId: 'ram-bhandar',
      },
      {
        id: 'vishwanath-temple-stop',
        name: 'Kashi Vishwanath Corridor',
        hindiName: 'श्री काशी विश्वनाथ धाम',
        coordinates: { lat: 25.3109, lng: 83.0107 },
        description: 'One of the 12 sacred Jyotirlingas of Lord Shiva, crowned with pure gold spires.',
        hindiDescription: 'द्वादश ज्योतिर्लिंगों में प्रमुख भगवान शिव का परम पावन स्वर्ण शिखर मंदिर।',
        significance: 'Spiritual epicenter of Hinduism and cosmic salvation.',
        recommendedTime: '30 mins',
        placeId: 'kashi-vishwanath',
      },
      {
        id: 'manikarnika-stop',
        name: 'Manikarnika Ghat (Mahashmashana)',
        hindiName: 'मणिकर्णिका घाट (महाश्मशान)',
        coordinates: { lat: 25.3108, lng: 83.0139 },
        description: 'The primary sacred cremation ghat where the eternal pyre has burned continuously for millennia.',
        hindiDescription: 'काशी का मुख्य मोक्ष महाश्मशान जहाँ अनंत काल से पवित्र चिता प्रज्वलित रहती है।',
        significance: 'Believed by Hindus to grant instantaneous Moksha (liberation).',
        recommendedTime: '10 mins',
        placeId: 'manikarnika-ghat',
      },
    ],
  },
  {
    id: 'panchganga-serenity',
    title: 'Panchganga & Northern Heritage Walk',
    hindiTitle: 'पंचगंगा एवं उत्तरी शांत घाट पदयात्रा',
    subtitle: 'A serene 2.4 km journey through quiet historical ghats and leaning temples.',
    hindiSubtitle: 'झुके हुए शिव मंदिर, पंचगंगा और ऐतिहासिक मठों की 2.4 किमी की शांतिपूर्ण यात्रा।',
    description:
      'Away from the bustling main ghats, this tranquil walk explores the northern riverfront. Marvel at the leaning Ratneshwar Shiva Temple at Scindia Ghat, the confluence at Panchganga, and the sweeping terrace of Alamgir.',
    hindiDescription:
      'सिंधिया घाट पर झुके रत्नेश्वर महादेव मंदिर, पंचगंगा संगम और राजघाट तक की शांत और अद्वितीय विरासत यात्रा।',
    distanceKm: 2.4,
    estimatedDurationMins: 45,
    difficulty: 'Easy',
    bestTimeToWalk: '6:00 AM – 8:30 AM or 4:00 PM – 6:00 PM',
    hindiBestTime: 'सुबह 6:00 से 8:30 या शाम 4:00 से 6:00',
    coverImage: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?q=80&w=1200&auto=format&fit=crop',
    stops: [
      {
        id: 'scindia-stop',
        name: 'Scindia Ghat & Leaning Temple',
        hindiName: 'सिंधिया घाट एवं रत्नेश्वर महादेव',
        coordinates: { lat: 25.3122, lng: 83.0152 },
        description: 'Famous for the 500-year-old Ratneshwar Mahadev Temple leaning sharply into the river water.',
        hindiDescription: 'गंगा की लहरों में 9 डिग्री झुका हुआ प्रसिद्ध 500 वर्ष पुराना रत्नेश्वर महादेव मंदिर।',
        significance: 'Architectural wonder leaning more than the Tower of Pisa.',
        recommendedTime: '15 mins',
      },
      {
        id: 'panchganga-stop',
        name: 'Panchganga Ghat',
        hindiName: 'पंचगंगा घाट',
        coordinates: { lat: 25.3155, lng: 83.0182 },
        description: 'The mystical confluence of 5 sacred streams: Ganga, Yamuna, Saraswati, Kirana, and Dhutpapa.',
        hindiDescription: 'पाँच पवित्र नदियों का आध्यात्मिक संगम स्थल जहाँ संत कबीर और तैलंग स्वामी ने साधना की।',
        significance: 'Spiritual initiation spot of Saint Kabir and Guru Ramananda.',
        recommendedTime: '15 mins',
        placeId: 'panchganga-ghat',
      },
      {
        id: 'alamgir-stop',
        name: 'Alamgir Mosque & Dharahara',
        hindiName: 'आलमगीर मस्जिद',
        coordinates: { lat: 25.3168, lng: 83.0194 },
        description: 'Dramatic architectural terrace overlooking the sweeping bend of the Ganga River.',
        hindiDescription: 'गंगा के विहंगम मोड़ का अद्भुत दृश्य प्रस्तुत करने वाला ऐतिहासिक स्थापत्य।',
        significance: 'Highest panoramic viewpoint on the northern riverfront.',
        recommendedTime: '10 mins',
      },
    ],
  },
];
