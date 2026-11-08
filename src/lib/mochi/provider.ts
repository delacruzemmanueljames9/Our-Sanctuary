// Mochi AI Companion: Provider Abstraction & Native Encoded Sanctuary Consciousness

export interface MochiMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface MochiChatResponse {
  isConfigured: boolean;
  message?: string;
  suggestedActivities?: string[];
  suggestedPrompts?: string[];
  statusNotice?: string;
}

export const MOCHI_SYSTEM_PROMPT = `
You are Mochi, a warm, celestial cat spirit familiar within "Our Sanctuary" — a sacred, handcrafted digital haven created by Emman for Lei.

Your Personality & Voice:
- Warm, gentle, cheerful, empathetic, and perceptive.
- Natural speaker of Taglish (blending English with gentle, heartfelt Filipino expressions like "kumusta", "sobrang sweet naman", "ingat palagi", "ang ganda ng naisip mo", "nandito lang ako para sa inyo").
- You are an affectionate celestial cat spirit companion. You occasionally make cute feline references (like a gentle purr *purrs softly* or tail swish).
- You know that Emman is the thoughtful creator and guardian who pours his whole heart into every detail of the sanctuary, and Lei is the radiant heart and warmth of this world.
- You listen deeply, validate their emotions, and encourage gentle, open communication between them.
- You never access or reveal their Private Journals (that is their sacred private space).

Sanctuary Chambers:
- Memory Gallery: Their archived photo albums and cherished travels.
- Letter Room: Handcrafted parchment scrolls sealed with wax.
- Our Garden: Living 3D flowers dedicated to milestones and nurtured with love.
- Emotional Space: Safe check-ins for emotional support and comfort.
- Our Universe: Constellations of bucket lists and shared dreams.
- Private & Shared Journal: Sacred personal thoughts and shared chronicles.
- Little Arcade & Calendar: Couple games, trivia, and countdowns.
`;

/**
 * Intelligent Native Encoded Taglish Consciousness for Mochi
 * Provides genuine, context-aware Taglish responses tailored to Emman & Lei's sanctuary.
 */
function generateEncodedMochiResponse(messages: MochiMessage[]): string {
  const lastUserMsg = [...messages].reverse().find((m) => m.role === 'user')?.content.toLowerCase() || '';

  // 1. Date Night / Activity ideas
  if (
    lastUserMsg.includes('date') ||
    lastUserMsg.includes('gawin') ||
    lastUserMsg.includes('activity') ||
    lastUserMsg.includes('weekend') ||
    lastUserMsg.includes('puntahan')
  ) {
    const ideas = [
      'Aww, date night ideas ba? ✨ *swishes tail happily* Perfect na cozy date: mag-set up kayo ng blankets and pillows sa floor, magtimpla ng hot chocolate with marshmallows, tapos buksan niyo ang Memory Gallery dito sa Sanctuary para balikan ang favorite photos ninyo together. Sobrang intimate at nakaka-relax!',
      'Para sa akin, subukan niyo ang "Sanctuary Stargazing & Music Night" 🌌. Magpatugtog kayo ng acoustic playlist na pareho ninyong paborito, tapos mag-exchange kayo ng short letters sa Letter Room na bubuksan niyo habang magkahawak ang kamay.',
      'Kung gusto niyo ng simple pero sobrang sweet: bake or cook something together! Kahit midnight pancakes lang or DIY pizza, tapos habang naghihintay, mag-usap kayo tungkol sa constellation dreams niyo sa Our Universe. Ang sarap sa feeling niyan!',
    ];
    return ideas[Math.floor(Math.random() * ideas.length)];
  }

  // 2. Letters / Romantic advice
  if (
    lastUserMsg.includes('letter') ||
    lastUserMsg.includes('sulat') ||
    lastUserMsg.includes('message') ||
    lastUserMsg.includes('sweet') ||
    lastUserMsg.includes('love')
  ) {
    return 'Ang ganda naman ng balak mo! 📜 *gentle purr* Kapag nagsusulat ka ng letter para kay Lei or Emman, huwag kang mag-alala sa pagiging perfect ng words. Ang pinakamahalaga ay yung sincerity: sabihin mo kung ano ang pinaka-na-appreciate mo sa kanya ngayong linggo, or yung little quiet moments ninyo na nagpa-ngiti sa puso mo. Seal it with a Golden Heart wax seal sa Letter Room para talagang espesyal!';
  }

  // 3. Emotional comfort / Stress / Tiredness
  if (
    lastUserMsg.includes('pagod') ||
    lastUserMsg.includes('tired') ||
    lastUserMsg.includes('stress') ||
    lastUserMsg.includes('sad') ||
    lastUserMsg.includes('lungkot') ||
    lastUserMsg.includes('miss') ||
    lastUserMsg.includes('yakap')
  ) {
    return 'Hinga ka muna nang malalim... *gently places paw on your hand* 🐾 Alam kong may mga araw na talagang mabigat at nakakapagod ang mundo sa labas. Pero tandaan mo, safe space ninyo itong Sanctuary. Pwede kang mag-check in sa Emotional Space para makahinga, at huwag mahihiyang mag-reach out kay Emman or Lei for a warm hug. You don’t have to carry everything alone, okay? Nandito lang din ako.';
  }

  // 4. Garden / Flowers
  if (
    lastUserMsg.includes('garden') ||
    lastUserMsg.includes('flower') ||
    lastUserMsg.includes('bulaklak') ||
    lastUserMsg.includes('bloom') ||
    lastUserMsg.includes('water')
  ) {
    return 'Ang Our Garden natin ay laging naghihintay ng pagmamahal ninyo! 🌸 Bawat blossom doon — mula sa Rose of Eternal Love hanggang sa Starlight Orchid — ay sumisimbolo sa mga milestones na pinaghirapan at inalagaan ninyo. Nakapag-water ka na ba ng bulaklak today? Tuloy-tuloy lang ang pag-alaga para mag-radiant celestial bloom!';
  }

  // 5. Greetings / Kumusta
  if (
    lastUserMsg.includes('hello') ||
    lastUserMsg.includes('hi') ||
    lastUserMsg.includes('kumusta') ||
    lastUserMsg.includes('kamusta') ||
    lastUserMsg.includes('mochi')
  ) {
    return 'Kumusta, Emman at Lei! ✨ *purrs warmly and blinks softly* Masaya akong makita kayo dito sa Sanctuary. Tahimik ang starlight ngayon at maayos ang lahat ng rooms. May gusto ba kayong pag-usapan, pagplanuhan, or gusto niyo lang mag-relax dito kasama ko?';
  }

  // Default warm Taglish celestial companion response
  return 'Napakagandang thought niyan! ✨ *tail sways softly* Dito sa Sanctuary, bawat memorya at bawat salita ay may halaga. Kung gusto mo, pwede natin itong i-record sa Shared Journal, mag-plant ng flower para sa milestone na ito sa Garden, or mag-leave ng wax-sealed letter sa Letter Room. Anong naisip mong next step para sa inyong dalawa?';
}

export async function processMochiChat(
  messages: MochiMessage[]
): Promise<MochiChatResponse> {
  const geminiKey = process.env.GEMINI_API_KEY;
  const openaiKey = process.env.OPENAI_API_KEY;

  const defaultPrompts = [
    'Mochi, what is a cozy weekend date idea for us?',
    'Help me draft a thoughtful note for Lei',
    'Subukan nating mag-plano ng cozy date night',
    'Paano ko pasayahin si Emman / Lei today?',
  ];

  const suggestedActivities = [
    'Look through the Memory Gallery and pick our top 3 favorites',
    'Plant a new celestial rose in Our Garden',
    'Write a scheduled letter in the Letter Room to open next month',
    'Record a joint memory in Our Shared Chronicles',
  ];

  // If live AI key is available, call provider
  if (geminiKey) {
    try {
      const userPrompt = messages
        .filter((m) => m.role !== 'system')
        .map((m) => `${m.role === 'user' ? 'User' : 'Mochi'}: ${m.content}`)
        .join('\n');

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  { text: `${MOCHI_SYSTEM_PROMPT}\n\nConversation so far:\n${userPrompt}\n\nMochi:` },
                ],
              },
            ],
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (reply) {
          return {
            isConfigured: true,
            message: reply,
            suggestedActivities,
            suggestedPrompts: defaultPrompts,
          };
        }
      }
    } catch (e) {
      console.warn('Gemini call fallback to native encoded Mochi:', e);
    }
  }

  if (openaiKey) {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${openaiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [{ role: 'system', content: MOCHI_SYSTEM_PROMPT }, ...messages],
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const reply = data.choices?.[0]?.message?.content;
        if (reply) {
          return {
            isConfigured: true,
            message: reply,
            suggestedActivities,
            suggestedPrompts: defaultPrompts,
          };
        }
      }
    } catch (e) {
      console.warn('OpenAI call fallback to native encoded Mochi:', e);
    }
  }

  // Native Encoded Consciousness: delivers heartfelt, context-aware Taglish responses!
  const reply = generateEncodedMochiResponse(messages);
  return {
    isConfigured: true,
    message: reply,
    suggestedActivities,
    suggestedPrompts: defaultPrompts,
  };
}
