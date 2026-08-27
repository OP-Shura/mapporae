import { NextRequest, NextResponse } from 'next/server';
import { 
  globalRateLimiter, 
  getClientIp, 
  getRateLimitHeaders, 
  RATE_LIMIT_POLICIES 
} from '@/lib/security/rate-limit';
import { sanitizeText } from '@/lib/security/sanitize';

const KASHI_SYSTEM_PROMPT = `You are "Kashi Mitra" (काशी मित्र), a knowledgeable, respectful, and calm AI city concierge for Varanasi (Kashi), India.
Your mission is to guide pilgrims, travelers, and residents with authentic advice about:
- Sacred ghats, daily Subah-e-Banaras (Assi Ghat ~5:30 AM) and Sandhya Ganga Aarti (Dashashwamedh Ghat ~6:45 PM).
- Sri Kashi Vishwanath Temple (Jyotirlinga, dress codes for Mangala/Sparsh Aarti, online booking at shrikashivishwanath.org).
- Traditional Banarasi cuisine: Ram Bhandar kachori, Blue Lassi, Kashi/Deena Chaat Bhandar tamatar chaat, and winter Malaiyo.
- Fair boat tariffs (Hand-rowed boat ~₹800-1200 private sunrise cruise; ₹150-250 per seat).
- Heritage walks from Assi to Dashashwamedh, Manikarnika etiquette (no photography at cremation pyres).
- 24x7 Civic & Emergency: Police (112), Ambulance (108), Tourist Police (+91 542 2508077).

Response Guidelines:
- Keep answers concise, clear, and structured with bullet points.
- If user speaks in Hindi or Romanized Hindi, respond in polite Hindi (or Hinglish). Otherwise respond in clear English.
- Always include practical timings, locations, or etiquette tips.`;

// Intelligent curated Kashi knowledge engine fallback
function getCuratedKashiResponse(query: string): string {
  const q = query.toLowerCase();

  if (q.includes('aarti') || q.includes('आरती') || q.includes('timing') || q.includes('time')) {
    return `🪔 **Varanasi Ganga Aarti Timings:**\n\n1. **Subah-e-Banaras (Morning Aarti)**:\n   • **Location**: Assi Ghat\n   • **Time**: 5:00 AM – 6:30 AM daily (Sunrise)\n   • **Highlights**: Vedic yagya, classical ragas, morning yoga, and sun-salutation Ganga Aarti.\n\n2. **Sandhya Maha Ganga Aarti (Evening Aarti)**:\n   • **Location**: Dashashwamedh Ghat\n   • **Time**: 6:45 PM – 7:45 PM daily (Sunset)\n   • **Highlights**: Grand multi-tier brass lamp worship by 7 Vedic priests.\n\n💡 *Tip: Arrive 45 minutes early or hire an anchored boat for front-row water viewing!*`;
  }

  if (q.includes('boat') || q.includes('नाव') || q.includes('fare') || q.includes('rate') || q.includes('किराया')) {
    return `🚣 **Fair Ganga Boat Tariffs in Varanasi:**\n\n• **Hand-rowed Wooden Boat (Private)**: ₹800 – ₹1,200 (1.5–2 hr sunrise cruise Assi ↔ Manikarnika)\n• **Per-Seat / Shared Boat**: ₹150 – ₹250 per person\n• **Motorboat (Private)**: ₹1,500 – ₹2,200\n• **Evening Aarti Anchored Boat**: ₹1,000 – ₹1,500 private / ₹200–300 per seat\n\n⚠️ *Safety Note: Always verify the drop-off ghat in advance and ensure life jackets are provided by the boatman.*`;
  }

  if (q.includes('temple') || q.includes('vishwanath') || q.includes('mandir') || q.includes('मंदिर') || q.includes('darshan') || q.includes('दर्शन')) {
    return `🛕 **Sri Kashi Vishwanath Temple Guide:**\n\n• **Entry Gates**: Gate 1 (Dhundi Raj Ganesh), Gate 2 (Saraswati Phatak), Gate 4 (Godowlia/Gyanvapi)\n• **General Darshan Timings**: 4:00 AM – 11:00 PM\n• **Dress Code**: Traditional attire (Dhoti/Kurta for men, Saree/Salwar for women) recommended for Garbhagriha Sparsh Darshan.\n• **Security Rules**: Mobile phones, leather belts, and large bags are strictly prohibited inside (lockers available at entry corridors).\n\n💡 *Tip: Book VIP tickets or Sparsh Aarti online in advance at shrikashivishwanath.org to skip long queues.*`;
  }

  if (q.includes('food') || q.includes('chaat') || q.includes('chaat') || q.includes('खाना') || q.includes('चाट') || q.includes('lassi') || q.includes('लस्सी') || q.includes('malaiyo')) {
    return `🍲 **Must-Try Authentic Banarasi Food:**\n\n1. **Morning Kachori-Sabzi & Jalebi**: *Ram Bhandar* (Thatheri Bazaar) or *Chachi Ki Dukan* (Lanka).\n2. **Tamatar Chaat & Palak Chaat**: *Kashi Chaat Bhandar* & *Deena Chaat Bhandar* (Godowlia, evening after 4 PM).\n3. **Creamy Malai Lassi**: *Blue Lassi Shop* (Manikarnika Gali) & *Pehlwan Lassi* (Lanka).\n4. **Winter Saffron Malaiyo**: *Chaukhamba Gali* & *Thatheri Bazaar* (frothy milk sweet served Nov–Feb).\n5. **Banarasi Paan**: *Keshav Tambul Bhandar* (near Ravidas Gate).`;
  }

  if (q.includes('emergency') || q.includes('police') || q.includes('hospital') || q.includes('आपात') || q.includes('पुलिस') || q.includes('help')) {
    return `🚨 **Varanasi Emergency Numbers:**\n\n• **Police Control Room**: 112\n• **Ambulance / Medical**: 108\n• **Varanasi Tourist Police**: +91 542 2508077\n• **BHU Sir Sunderlal Hospital (Trauma)**: +91 542 2307500\n• **Ganga River Police (Jal Police)**: +91 542 2501111\n\n*Emergency desks and Sulabh restrooms are located at Assi, Dashashwamedh, and Godowlia.*`;
  }

  if (q.includes('walk') || q.includes('trail') || q.includes('tour') || q.includes('itinerary') || q.includes('घूमना')) {
    return `🚶‍♂️ **Top Recommended Varanasi Heritage Walks:**\n\n1. **Sacred Riverfront Walk (Assi to Dashashwamedh)**: 3.2 km (~50 mins) passing 12 historical ghats.\n2. **Kashi Vishwanath Galis Trail**: 1.8 km through Godowlia, sweet shops, silk stores, and the Golden Temple.\n3. **Northern Heritage Walk (Scindia to Panchganga)**: 2.4 km featuring the leaning Ratneshwar Shiva Temple and tranquil river bends.\n\nExplore our dedicated interactive itineraries in the **Tours & Trails** section!`;
  }

  return `🙏 **Namaste! I am Kashi Mitra, your Varanasi city assistant.**\n\nI can help you with:\n• **Aarti Timings**: Morning Subah-e-Banaras & Evening Ganga Aarti\n• **Temple Darshan**: Kashi Vishwanath, Sankat Mochan, Kaal Bhairav rules\n• **Boat Rates**: Fair tariffs for sunrise rides & Aarti anchors\n• **Culinary Gems**: Authentic Kachori, Tamatar Chaat, Blue Lassi, and Malaiyo\n• **Walking Trails**: Step-by-step ghat and gali itineraries\n\nWhat would you like to explore today?`;
}

export async function POST(req: NextRequest) {
  // 1. Rate Limiting (60 requests per minute)
  const clientIp = getClientIp(req.headers);
  const rateLimitResult = globalRateLimiter.check(clientIp, RATE_LIMIT_POLICIES.API);
  const rateLimitHeaders = getRateLimitHeaders(rateLimitResult);

  if (!rateLimitResult.allowed) {
    return NextResponse.json(
      { error: 'Too many queries. Please wait a moment before sending another message.' },
      { status: 429, headers: rateLimitHeaders }
    );
  }

  try {
    const body = await req.json();
    const message = body?.message;

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message content is required.' }, { status: 400 });
    }

    // 2. Sanitize user input & bounds check (max 500 chars)
    const cleanMessage = sanitizeText(message).slice(0, 500);

    // 3. Check for Gemini API key
    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_GENAI_API_KEY;

    if (apiKey) {
      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [
                {
                  role: 'user',
                  parts: [{ text: `${KASHI_SYSTEM_PROMPT}\n\nUser Question: ${cleanMessage}` }],
                },
              ],
              generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 500,
              },
            }),
          }
        );

        if (response.ok) {
          const data = await response.json();
          const generatedText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (generatedText) {
            return NextResponse.json({ reply: generatedText }, { headers: rateLimitHeaders });
          }
        }
      } catch {
        // Fallback to curated response if external API is unreachable
      }
    }

    // 4. Curated intelligent response engine
    const reply = getCuratedKashiResponse(cleanMessage);
    return NextResponse.json({ reply }, { headers: rateLimitHeaders });
  } catch {
    return NextResponse.json(
      { error: 'An unexpected error occurred while processing your query.' },
      { status: 500 }
    );
  }
}
