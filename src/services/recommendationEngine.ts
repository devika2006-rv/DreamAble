import placesData from '../data/places.json';
import type { JourneyProfile, PlaceRecord, Recommendation } from '../types';

const places = placesData as PlaceRecord[];

const categoryOrder = ['Hotels', 'Restaurants', 'Hospitals', 'Parking', 'Colleges', 'Transport', 'Accessible Toilets', 'Public Places'];

export const buildRecommendations = (profile: JourneyProfile, answers: string[]): Recommendation[] => {
  const filtered = places.filter((place) => {
    const destinationMatch = place.destination.toLowerCase() === profile.destination.toLowerCase();
    const purposeMatch = place.purpose.toLowerCase() === profile.goal.toLowerCase() || place.purpose.toLowerCase() === 'vacation' || profile.goal.toLowerCase() === 'solo trip';
    const accessibilityMatch = place.accessibilityTags.some((tag) => profile.accessibilityNeeds.includes(tag) || profile.profileTags.includes(tag));
    return destinationMatch && purposeMatch && accessibilityMatch;
  });

  const scored = filtered
    .map((place) => {
      let confidence = place.confidence;
      confidence += place.accessibilityTags.filter((tag) => profile.accessibilityNeeds.includes(tag)).length * 3;
      confidence += profile.profileTags.filter((tag) => place.accessibilityTags.includes(tag)).length * 2;
      if (answers.some((answer) => answer.toLowerCase().includes('quiet'))) confidence += 3;
      if (answers.some((answer) => answer.toLowerCase().includes('medical') || answer.toLowerCase().includes('care'))) confidence += 3;
      if (profile.goal === 'Conference' || profile.goal === 'Business Meeting') confidence += 2;
      if (profile.goal === 'Hospital Visit') confidence += 4;

      return {
        ...place,
        confidence: Math.min(99, confidence),
        tags: place.accessibilityTags.slice(0, 4),
        matchTags: profile.profileTags.filter((tag) => place.accessibilityTags.includes(tag)),
        supportiveNeeds: profile.accessibilityNeeds.filter((need) => place.accessibilityTags.includes(need)),
        goalSignals: [profile.goal],
      } as Recommendation;
    })
    .sort((a, b) => b.confidence - a.confidence);

  const grouped = categoryOrder.reduce((acc, category) => {
    const categoryItems = scored.filter((item) => item.category === category);
    if (categoryItems.length) acc.push(...categoryItems);
    return acc;
  }, [] as Recommendation[]);

  return (grouped.length ? grouped : scored).slice(0, 3);
};
