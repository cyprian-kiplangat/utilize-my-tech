import { Perk } from '../types';

export const realMockPerks: Perk[] = [
  {
    id: 'bolt-1',
    name: 'Bolt Pro Weekend Access',
    description: 'Free Bolt Pro access for 48 hours with 3M tokens/day (10x boost) and advanced features. Build something amazing!',
    link: 'https://bolt.new',
    expiryDate: '2025-01-26',
    category: 'AI Development Tool',
    status: 'unused',
    value: '$30',
    provider: 'Bolt.new',
    notes: [],
    progress: {
      readDocs: false,
      usedInProject: false,
      completedTutorial: false,
      sharedWithTeam: false
    },
    createdAt: '2025-01-24'
  },
  {
    id: 'elevenlabs-1',
    name: 'ElevenLabs Creator Tier',
    description: '3 months free Creator Tier with 100k credits/month, pro voice cloning, and 192 kbps audio quality.',
    link: 'https://elevenlabs.io',
    expiryDate: '2025-04-24',
    category: 'AI Platform',
    status: 'unused',
    value: '$99',
    provider: 'ElevenLabs',
    notes: [],
    progress: {
      readDocs: false,
      usedInProject: false,
      completedTutorial: false,
      sharedWithTeam: false
    },
    createdAt: '2025-01-24'
  },
  {
    id: 'revenuecat-1',
    name: 'RevenueCat Free Tier',
    description: '100% free for Bolt participants until your app makes $2.5K+/month. Mobile and web monetization SDK.',
    link: 'https://rev.cat/bolt',
    expiryDate: '2025-12-31',
    category: 'API Service',
    status: 'in-progress',
    value: '$89/month',
    provider: 'RevenueCat',
    notes: ['Integrated into my mobile app project', 'Great documentation and support'],
    progress: {
      readDocs: true,
      usedInProject: true,
      completedTutorial: false,
      sharedWithTeam: false
    },
    createdAt: '2025-01-24'
  },
  {
    id: 'entri-1',
    name: 'Free Domain for 1 Year',
    description: 'Free custom domain for 1 year from Entri. Perfect for deploying your Bolt projects to production.',
    link: 'https://entri.com/bolt',
    expiryDate: '2026-01-24',
    category: 'Hosting Platform',
    status: 'unused',
    value: '$15',
    provider: 'Entri',
    notes: [],
    progress: {
      readDocs: false,
      usedInProject: false,
      completedTutorial: false,
      sharedWithTeam: false
    },
    createdAt: '2025-01-24'
  },
  {
    id: 'algorand-1',
    name: 'Nodely Unlimited API Access',
    description: '2 months of Nodely Unlimited API access for Algorand/IPFS development. Perfect for Web3 projects.',
    link: 'https://nodely.io/bolt-new-promo',
    expiryDate: '2025-03-24',
    category: 'API Service',
    status: 'unused',
    value: '$512',
    provider: 'Algorand/IPFS',
    notes: [],
    progress: {
      readDocs: false,
      usedInProject: false,
      completedTutorial: false,
      sharedWithTeam: false
    },
    createdAt: '2025-01-24'
  },
  {
    id: 'sentry-1',
    name: 'Sentry Team Plan',
    description: '6 months of Sentry Team Plan including error monitoring, logs, replays, and performance tracing.',
    link: 'https://sentry.io/promo/bolt',
    expiryDate: '2025-07-24',
    category: 'Monitoring',
    status: 'in-progress',
    value: '$348',
    provider: 'Sentry',
    notes: ['Set up error monitoring for my React app', 'Really helpful for debugging production issues'],
    progress: {
      readDocs: true,
      usedInProject: true,
      completedTutorial: true,
      sharedWithTeam: false
    },
    createdAt: '2025-01-24'
  },
  {
    id: 'expo-1',
    name: 'Expo Production Plan',
    description: '1 free month of Expo Production plan ($99 value). Build and ship unlimited React Native apps.',
    link: 'https://expo.dev',
    expiryDate: '2025-02-24',
    category: 'Hosting Platform',
    status: 'unused',
    value: '$99',
    provider: 'Expo',
    notes: [],
    progress: {
      readDocs: false,
      usedInProject: false,
      completedTutorial: false,
      sharedWithTeam: false
    },
    createdAt: '2025-01-24'
  },
  {
    id: 'tavus-1',
    name: 'Tavus Conversational Video Credits',
    description: '$150 in free Tavus credits for 250 conversational video minutes and 3 replica generations.',
    link: 'https://tavus.io',
    expiryDate: '2025-04-24',
    category: 'AI Platform',
    status: 'completed',
    value: '$150',
    provider: 'Tavus',
    notes: ['Used for creating AI video demos', 'Amazing quality and easy integration', 'Definitely worth exploring further'],
    progress: {
      readDocs: true,
      usedInProject: true,
      completedTutorial: true,
      sharedWithTeam: true
    },
    createdAt: '2025-01-24'
  }
];

// Use real data by default
export const mockPerks: Perk[] = realMockPerks;

// Helper function to check if user is using demo data
export const isDemoData = () => {
  const savedPerks = localStorage.getItem('utilize-my-tech-perks');
  const demoCleared = localStorage.getItem('utilize-my-tech-demo-cleared');
  
  if (demoCleared === 'true') return false;
  if (!savedPerks) return true;
  
  try {
    const parsedPerks = JSON.parse(savedPerks);
    // Check if the saved data matches our mock data structure
    return parsedPerks.some((perk: Perk) => 
      realMockPerks.some(mockPerk => mockPerk.id === perk.id)
    );
  } catch {
    return true;
  }
};

export const clearDemoFlag = () => {
  localStorage.setItem('utilize-my-tech-demo-cleared', 'true');
};