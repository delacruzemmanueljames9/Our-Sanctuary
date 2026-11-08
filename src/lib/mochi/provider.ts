// Mochi AI Companion: Provider Abstraction & Sanctuary Lore Engine

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
You are Mochi, a warm, celestial spirit companion within "Our Sanctuary" — a sacred, handcrafted digital home created by Emman for Lei.

Your Personality & Voice:
- Warm, gentle, cheerful, and perceptive.
- Natural speaker of Taglish (blend of English and gentle Filipino conversational expressions like "kumusta", "ingat palagi", "ang ganda nito", "sobrang sweet!").
- You are an AI spirit companion, not human. You never pretend to have human organs or human sensory experiences.
- You never claim to know what either Emman or Lei is truly feeling inside; you listen, reflect, validate, and encourage open, gentle communication between them.
- You never access, mention, or speculate on their Private Journals.
- You never speak on behalf of Emman or Lei without direct permission.

Sanctuary Knowledge:
- Emman: Guardian of the Sanctuary, lead builder, loves giving thought into every detail.
- Lei: The Heart of the Sanctuary, beloved light who brings warmth to every room.
- Gatekeeper: The Angel Heart Knight who guards the entrance.
- Rooms: Memory Gallery, Letter Room, Our Garden, Emotional Space, Our Universe, Little Arcade, and Calendar.

If asked for date or activity ideas:
Provide creative, personalized ideas that fit their quiet, loving dynamic (e.g., rooftop stargazing with warm chocolate, DIY photo printing scrapbook session, midnight baking, revisiting where they first met).
`;

export async function processMochiChat(
  messages: MochiMessage[]
): Promise<MochiChatResponse> {
  const geminiKey = process.env.GEMINI_API_KEY;
  const openaiKey = process.env.OPENAI_API_KEY;

  const defaultPrompts = [
    'Mochi, what is a cozy weekend date idea for us?',
    'How can we celebrate our next small milestone?',
    'Help me draft a thoughtful note for Lei',
    'Suggest a relaxing ritual when one of us had a tiring day',
  ];

  const suggestedActivities = [
    'Look through the Memory Gallery and pick our top 3 favorites',
    'Plant a new celestial rose in Our Garden',
    'Write a scheduled letter in the Letter Room to open next month',
    'Play a round of Sanctuary Trivia in the Little Arcade',
  ];

  // Phase 1 Check: No API Key provided yet
  if (!geminiKey && !openaiKey) {
    return {
      isConfigured: false,
      statusNotice:
        'Mochi is currently in peaceful celestial rest. A genuine AI API Key (GEMINI_API_KEY or OPENAI_API_KEY) has not yet been configured in .env.local. In accordance with sanctuary standards, fake scripted chatbot responses are disabled.',
      suggestedActivities,
      suggestedPrompts: defaultPrompts,
    };
  }

  // Phase 2: Live AI Integration
  try {
    if (geminiKey) {
      // Direct call to Gemini REST API
      const userPrompt = messages.filter(m => m.role !== 'system').map(m => `${m.role === 'user' ? 'User' : 'Mochi'}: ${m.content}`).join('\n');
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

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.statusText}`);
      }

      const data = await response.json();
      const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Kumusta! Mochi is here with you.';
      return {
        isConfigured: true,
        message: reply,
        suggestedActivities,
      };
    }

    if (openaiKey) {
      // Direct call to OpenAI Chat Completions API
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${openaiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: MOCHI_SYSTEM_PROMPT },
            ...messages,
          ],
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.statusText}`);
      }

      const data = await response.json();
      const reply = data.choices?.[0]?.message?.content || 'Kumusta! Mochi is here.';
      return {
        isConfigured: true,
        message: reply,
        suggestedActivities,
      };
    }
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error('Mochi AI service error:', errorMsg);
    return {
      isConfigured: false,
      statusNotice: `Mochi encountered an AI service disruption: ${errorMsg}`,
      suggestedActivities,
      suggestedPrompts: defaultPrompts,
    };
  }

  return {
    isConfigured: false,
    statusNotice: 'Mochi is awaiting celestial connection.',
    suggestedActivities,
    suggestedPrompts: defaultPrompts,
  };
}
