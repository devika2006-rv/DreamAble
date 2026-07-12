export const getConfidenceLabel = (score: number): string => {
  if (score >= 95) return 'Very High Confidence';
  if (score >= 80) return 'High Confidence';
  if (score >= 60) return 'Moderate Confidence';
  return 'Verification Recommended';
};

export const formatProfileSummary = (profile: string[]): string => profile.join(' • ');
