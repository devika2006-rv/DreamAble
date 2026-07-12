import type { CompanionQuestion, Recommendation } from '../types/index';

export const journeyGoals = [
  'Solo Trip',
  'Conference',
  'College',
  'Vacation',
  'Temple Visit',
  'Business Meeting',
  'Adventure',
  'Hospital Visit',
  'Family Trip',
  'Other',
];

export const accessibilityProfiles = [
  'Wheelchair User',
  'Temporary Injury',
  'Walking Difficulty',
  'Visual Impairment',
  'Hearing Impairment',
  'Neurodivergent',
  'Senior Citizen',
  'Pregnancy Support',
];

export const accessibilityNeeds = [
  'Accessible Toilet',
  'Adult Changing Facility',
  'Lift Required',
  'Ramp Required',
  'Accessible Parking',
  'Pharmacy Nearby',
  'Hospital Nearby',
  'Spacious Room',
  'Quiet Environment',
  'Emergency Assistance',
  'Companion Friendly',
];

export const getCompanionQuestions = (goal: string): CompanionQuestion[] => {
  const baseQuestions: CompanionQuestion[] = [
    {
      prompt: 'What matters most for your comfort on this trip?',
      choices: ['Step-free ease', 'Quiet surroundings', 'Medical support nearby', 'Flexible arrival access'],
    },
    {
      prompt: 'How do you want your support plan to feel?',
      choices: ['Independent and self-paced', 'Gentle and reassuring', 'Highly assisted', 'Social and companion-friendly'],
    },
  ];

  if (goal === 'Hospital Visit' || goal === 'Conference' || goal === 'Business Meeting') {
    return [
      ...baseQuestions,
      {
        prompt: 'Would you like nearby care or a calmer environment to be prioritized?',
        choices: ['Nearby care', 'Calmer environment', 'Balanced approach'],
      },
    ];
  }

  if (goal === 'Vacation' || goal === 'Adventure' || goal === 'Temple Visit') {
    return [
      ...baseQuestions,
      {
        prompt: 'Would you like the plan to feel more scenic or more practical?',
        choices: ['More scenic', 'More practical', 'Balanced comfort'],
      },
    ];
  }

  return [
    ...baseQuestions,
    {
      prompt: 'Would you prefer a plan that feels more relaxed or more efficient?',
      choices: ['More relaxed', 'More efficient', 'Balanced'],
    },
  ];
};

export const recommendations: Recommendation[] = [
  {
    id: 1,
    name: 'Harbor View Residence',
    category: 'Hotels',
    distance: '1.2 km',
    rating: 4.8,
    confidence: 96,
    tags: ['Accessible Toilet', 'Lift', 'Wheelchair Parking', 'Hospital Nearby', 'Pharmacy Nearby', 'Community Verified'],
    image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80',
    description: 'A calm, well-reviewed stay with step-free access and nearby medical support.',
    verified: true,
    reviewCount: 42,
    matchTags: ['Wheelchair User', 'Temporary Injury', 'Walking Difficulty', 'Senior Citizen'],
    supportiveNeeds: ['Accessible Toilet', 'Lift Required', 'Accessible Parking', 'Hospital Nearby', 'Pharmacy Nearby'],
    goalSignals: ['Conference', 'Business Meeting', 'Hospital Visit', 'Solo Trip'],
  },
  {
    id: 2,
    name: 'Lumen Wellness Hotel',
    category: 'Hotels',
    distance: '2.1 km',
    rating: 4.7,
    confidence: 91,
    tags: ['Ramp Required', 'Quiet Environment', 'Companion Friendly', 'Accessible Parking'],
    image: 'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=900&q=80',
    description: 'Soft lighting, spacious rooms, and strong accessibility support for quieter stays.',
    verified: true,
    reviewCount: 31,
    matchTags: ['Visual Impairment', 'Neurodivergent', 'Temporary Injury', 'Pregnancy Support'],
    supportiveNeeds: ['Quiet Environment', 'Spacious Room', 'Companion Friendly', 'Accessible Parking', 'Ramp Required'],
    goalSignals: ['Vacation', 'Solo Trip', 'Family Trip', 'Temple Visit'],
  },
  {
    id: 3,
    name: 'Seaside Care Suites',
    category: 'Hotels',
    distance: '3.6 km',
    rating: 4.3,
    confidence: 68,
    tags: ['Accessible Toilet', 'Hospital Nearby', 'Emergency Assistance'],
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=900&q=80',
    description: 'Good medical proximity and supportive staff, though some travelers may prefer more space.',
    verified: false,
    reviewCount: 17,
    matchTags: ['Wheelchair User', 'Visual Impairment', 'Pregnancy Support', 'Senior Citizen'],
    supportiveNeeds: ['Accessible Toilet', 'Hospital Nearby', 'Emergency Assistance', 'Spacious Room'],
    goalSignals: ['Hospital Visit', 'Conference', 'Family Trip'],
  },
];
