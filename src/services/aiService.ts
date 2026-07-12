import type { JourneyProfile, Recommendation } from '../types';

export interface AiInsightResult {
  summary: string;
  explanation: string;
  confidence: number;
  isFallback: boolean;
  error?: string;
}

const fallbackSummary = (profile: JourneyProfile, recommendation: Recommendation, answers: string[]): AiInsightResult => ({
  summary: `DreamAble prepared a confidence-first plan for ${profile.destination} based on your selected accessibility needs and travel preferences.`,
  explanation: `The strongest fit for ${profile.goal.toLowerCase()} travel is ${recommendation.name}, chosen for accessibility support, calm arrival flow, and practical reassurance. ${answers.length ? 'Your companion responses were also used to shape the support level.' : 'Further details can be added later for a more tailored experience.'}`,
  confidence: Math.min(99, Math.max(72, recommendation.confidence - 4)),
  isFallback: true,
  error: 'Live Gemini response was unavailable, so DreamAble used its local guidance model.',
});

export async function generateJourneyInsights(
  profile: JourneyProfile,
  recommendation: Recommendation,
  answers: string[],
): Promise<AiInsightResult> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  if (!apiKey) {
    return fallbackSummary(profile, recommendation, answers);
  }

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [{
              text: `Create a short friendly accessibility travel summary for a traveler going to ${profile.destination} for ${profile.goal}. Their needs are ${profile.accessibilityNeeds.join(', ')}. Their profile tags are ${profile.profileTags.join(', ')}. Recommend ${recommendation.name} as the best fit. Keep it respectful and concise.`,
            }],
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`Gemini request failed (${response.status})`);
    }

    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';

    if (!text) {
      throw new Error('Gemini returned an empty response.');
    }

    return {
      summary: `DreamAble AI prepared a travel summary for ${profile.destination}.`,
      explanation: text.replace(/\n+/g, ' ').trim(),
      confidence: Math.min(99, recommendation.confidence),
      isFallback: false,
    };
  } catch (error) {
    return {
      ...fallbackSummary(profile, recommendation, answers),
      error: error instanceof Error ? error.message : 'Unable to reach the AI service right now.',
    };
  }
}
