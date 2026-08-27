/**
 * ==============================================================================
 * Mapporae Bilingual Localization Dictionary (English & Hindi)
 * ==============================================================================
 * Comprehensive translations for Kashi / Varanasi civic and travel navigation.
 */

export type Language = 'en' | 'hi';

export interface Translations {
  [key: string]: {
    en: string;
    hi: string;
  };
}

export const translations = {
  // Navigation & Header
  'nav.home': { en: 'Home', hi: 'मुख्य पृष्ठ' },
  'nav.explore': { en: 'Explore & Map', hi: 'अन्वेषण और मानचित्र' },
  'nav.tours': { en: 'Tours & Boats', hi: 'पदयात्रा व नौका' },
  'nav.services': { en: 'Essential Services', hi: 'आवश्यक सेवाएं' },
  'nav.saved': { en: 'Saved Places', hi: 'सहेजे गए स्थान' },
  'nav.search': { en: 'Search Kashi', hi: 'काशी में खोजें' },
  'nav.emergency': { en: '112 / Help', hi: '112 / सहायता' },
  'nav.gps': { en: 'GPS Location', hi: 'जीपीएस स्थान' },
  'nav.reference_spot': { en: 'Set Reference Spot', hi: 'संदर्भ स्थान चुनें' },

  // Hero & Taglines
  'hero.title': { en: 'Your Varanasi City Companion', hi: 'आपका वाराणसी शहर साथी' },
  'hero.subtitle': { 
    en: 'Discover sacred ghats, ancient temples, authentic street chaat, and emergency services.', 
    hi: 'पवित्र घाटों, प्राचीन मंदिरों, प्रामाणिक चाट और आपातकालीन सेवाओं को आसानी से खोजें।' 
  },
  'hero.search_placeholder': { 
    en: 'Search ghats, temples, chaat, emergency...', 
    hi: 'घाट, मंदिर, चाट, आपातकालीन सेवाएं खोजें...' 
  },

  // Environmental & Live Signals
  'env.title': { en: 'Live City Signals', hi: 'लाइव पर्यावरणीय संकेत' },
  'env.weather': { en: 'Weather', hi: 'मौसम' },
  'env.temp': { en: 'Temperature', hi: 'तापमान' },
  'env.humidity': { en: 'Humidity', hi: 'नमी' },
  'env.wind': { en: 'Wind', hi: 'हवा की गति' },
  'env.aqi': { en: 'Air Quality (AQI)', hi: 'वायु गुणवत्ता सूचकांक' },
  'env.aqi_pm25': { en: 'PM2.5 Realtime', hi: 'PM2.5 रीयलटाइम' },
  'env.sunrise': { en: 'Sunrise', hi: 'सूर्योदय' },
  'env.sunset': { en: 'Sunset', hi: 'सूर्यास्त' },
  'env.subah_e_banaras': { en: 'Subah-e-Banaras Aarti', hi: 'सुबह-ए-बनारस आरती' },
  'env.sandhya_aarti': { en: 'Sandhya Ganga Aarti', hi: 'संध्या गंगा आरती' },

  // Categories
  'cat.all': { en: 'All Places', hi: 'सभी स्थान' },
  'cat.ghats': { en: 'Sacred Ghats', hi: 'पवित्र घाट' },
  'cat.temples': { en: 'Ancient Temples', hi: 'प्राचीन मंदिर' },
  'cat.food': { en: 'Street Food & Chaat', hi: 'स्ट्रीट फूड व चाट' },
  'cat.cafes': { en: 'Riverside Cafes', hi: 'गंगा किनारे कैफे' },
  'cat.hospitals': { en: '24x7 Hospitals', hi: '24x7 अस्पताल' },
  'cat.pharmacies': { en: 'Chemists & Pharmacy', hi: 'दवा की दुकानें' },
  'cat.atms': { en: '24x7 ATMs', hi: 'एटीएम केंद्र' },
  'cat.transport': { en: 'Boats & Transport', hi: 'नौका व परिवहन' },

  // Place Card & Details
  'place.open_now': { en: 'Open Now', hi: 'खुला है' },
  'place.closed': { en: 'Closed', hi: 'बंद है' },
  'place.verified': { en: 'Verified by Mapporae', hi: 'सत्यापित जानकारी' },
  'place.save': { en: 'Save', hi: 'सहेजें' },
  'place.saved': { en: 'Saved', hi: 'सहेजा गया' },
  'place.directions': { en: 'Directions', hi: 'दिशा-निर्देश' },
  'place.share': { en: 'Share', hi: 'साझा करें' },
  'place.details': { en: 'View Details', hi: 'विवरण देखें' },
  'place.timing': { en: 'Timings', hi: 'समय' },
  'place.entry': { en: 'Entry Fee', hi: 'प्रवेश शुल्क' },
  'place.rating': { en: 'Rating', hi: 'रेटिंग' },
  'place.reviews': { en: 'reviews', hi: 'समीक्षाएं' },
  'place.visitor_tip': { en: 'Visitor Tip', hi: 'यात्री सुझाव' },

  // Saved Places & Auth
  'saved.title': { en: 'Saved Places & Custom Lists', hi: 'सहेजे गए स्थान और सूचियां' },
  'saved.empty': { en: 'No places saved in this list yet.', hi: 'इस सूची में अभी कोई स्थान नहीं है।' },
  'saved.create_list': { en: 'Create New List', hi: 'नई सूची बनाएं' },
  'saved.list_name': { en: 'List Name', hi: 'सूची का नाम' },
  'saved.list_desc': { en: 'Description (optional)', hi: 'विवरण (वैकल्पिक)' },
  'saved.import_local': { en: 'Import Local Bookmarks to Cloud', hi: 'स्थानीय बुकमार्क क्लाउड में आयात करें' },
  'saved.sign_in_prompt': { 
    en: 'Sign in to sync your saved Varanasi itineraries across all your devices.', 
    hi: 'अपने सभी उपकरणों पर वाराणसी यात्रा सूची सिंक करने के लिए साइन इन करें।' 
  },
  'saved.sign_in_btn': { en: 'Sign In with Email', hi: 'ईमेल से साइन इन करें' },
  'saved.sign_out': { en: 'Sign Out', hi: 'साइन आउट' },

  // Emergency Desk
  'emergency.title': { en: 'Civic & Emergency Desk', hi: 'नागरिक एवं आपातकालीन सहायता' },
  'emergency.police': { en: 'Police Control Room', hi: 'पुलिस नियंत्रण कक्ष' },
  'emergency.ambulance': { en: 'Ambulance & Medical', hi: 'एंबुलेंस एवं चिकित्सा' },
  'emergency.tourist_helpline': { en: 'Tourist Police Helpline', hi: 'पर्यटक पुलिस हेल्पलाइन' },
  'emergency.women_helpline': { en: 'Women Safety Helpline', hi: 'महिला सुरक्षा हेल्पलाइन' },
  'emergency.river_safety': { en: 'Ganga River Police', hi: 'गंगा रिवर पुलिस (जल पुलिस)' },

  // Offline & PWA
  'pwa.offline_title': { en: 'You are currently offline', hi: 'आप वर्तमान में ऑफ़लाइन हैं' },
  'pwa.offline_desc': { 
    en: 'Mapporae continues working offline with cached map tiles and emergency numbers.', 
    hi: 'मैपोरे कैश्ड मैप और आपातकालीन नंबरों के साथ ऑफ़लाइन भी काम कर रहा है।' 
  },
  'pwa.install': { en: 'Install App', hi: 'ऐप इंस्टॉल करें' },
  'pwa.installed': { en: 'App Ready Offline', hi: 'ऑफ़लाइन उपलब्ध' },
} as const;

export type TranslationKey = keyof typeof translations;
