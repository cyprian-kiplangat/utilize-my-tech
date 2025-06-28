import { Perk } from '../types';

export const mockPerks: Perk[] = [
  {
    id: '1',
    name: 'GitHub Copilot',
    description: 'AI-powered code completion and suggestions. Free for students and open source contributors.',
    link: 'https://github.com/copilot',
    expiryDate: '2025-02-28',
    category: 'AI Development Tool',
    status: 'in-progress',
    value: '$10/month',
    provider: 'GitHub',
    notes: ['Really helpful for React components', 'Saves about 30% of typing time'],
    progress: {
      readDocs: true,
      usedInProject: true,
      completedTutorial: false,
      sharedWithTeam: false
    },
    createdAt: '2025-01-05'
  },
  {
    id: '2',
    name: 'Vercel Pro Trial',
    description: '14-day free trial of Vercel Pro with advanced analytics, team collaboration, and priority support.',
    link: 'https://vercel.com/pro',
    expiryDate: '2025-01-25',
    category: 'Hosting Platform',
    status: 'unused',
    value: '$20/month',
    provider: 'Vercel',
    notes: [],
    progress: {
      readDocs: false,
      usedInProject: false,
      completedTutorial: false,
      sharedWithTeam: false
    },
    createdAt: '2025-01-11'
  },
  {
    id: '3',
    name: 'OpenAI API Credits',
    description: '$5 in free API credits for new accounts. Perfect for experimenting with GPT-4 and other models.',
    link: 'https://openai.com/api/',
    expiryDate: '2025-04-11',
    category: 'AI Platform',
    status: 'in-progress',
    value: '$5',
    provider: 'OpenAI',
    notes: ['Used for a chatbot prototype', 'Rate limits are pretty generous for testing'],
    progress: {
      readDocs: true,
      usedInProject: true,
      completedTutorial: true,
      sharedWithTeam: false
    },
    createdAt: '2025-01-11'
  },
  {
    id: '4',
    name: 'Railway Starter Credits',
    description: '$5 in free credits for new users. Great for deploying Node.js apps and databases.',
    link: 'https://railway.app',
    expiryDate: '2025-02-10',
    category: 'Hosting Platform',
    status: 'unused',
    value: '$5',
    provider: 'Railway',
    notes: [],
    progress: {
      readDocs: false,
      usedInProject: false,
      completedTutorial: false,
      sharedWithTeam: false
    },
    createdAt: '2025-01-10'
  },
  {
    id: '5',
    name: 'Supabase Pro Trial',
    description: '1-month free trial of Supabase Pro with advanced auth, real-time subscriptions, and priority support.',
    link: 'https://supabase.com/pricing',
    expiryDate: '2025-02-15',
    category: 'Database',
    status: 'unused',
    value: '$25/month',
    provider: 'Supabase',
    notes: [],
    progress: {
      readDocs: false,
      usedInProject: false,
      completedTutorial: false,
      sharedWithTeam: false
    },
    createdAt: '2025-01-15'
  },
  {
    id: '6',
    name: 'Figma Professional',
    description: '30-day free trial of Figma Professional with unlimited projects and advanced prototyping.',
    link: 'https://figma.com/pricing',
    expiryDate: '2025-01-30',
    category: 'Design Tool',
    status: 'completed',
    value: '$12/month',
    provider: 'Figma',
    notes: ['Used for designing the app UI', 'Great collaboration features', 'Definitely worth the subscription'],
    progress: {
      readDocs: true,
      usedInProject: true,
      completedTutorial: true,
      sharedWithTeam: true
    },
    createdAt: '2024-12-30'
  },
  {
    id: '7',
    name: 'Netlify Pro Trial',
    description: '14-day free trial with advanced build settings, form handling, and team collaboration.',
    link: 'https://netlify.com/pricing',
    expiryDate: '2025-01-22',
    category: 'Hosting Platform',
    status: 'unused',
    value: '$19/month',
    provider: 'Netlify',
    notes: [],
    progress: {
      readDocs: false,
      usedInProject: false,
      completedTutorial: false,
      sharedWithTeam: false
    },
    createdAt: '2025-01-08'
  },
  {
    id: '8',
    name: 'MongoDB Atlas Free Tier',
    description: 'Permanent free tier with 512MB storage. Great for learning and small projects.',
    link: 'https://mongodb.com/atlas',
    expiryDate: '2026-01-01',
    category: 'Database',
    status: 'in-progress',
    value: '$9/month equivalent',
    provider: 'MongoDB',
    notes: ['Using for a side project', 'Free tier is surprisingly generous'],
    progress: {
      readDocs: true,
      usedInProject: true,
      completedTutorial: false,
      sharedWithTeam: false
    },
    createdAt: '2024-12-20'
  }
];

// Helper function to check if user is using demo data
export const isDemoData = () => {
  const savedPerks = localStorage.getItem('utilize-my-tech-perks');
  if (!savedPerks) return true;
  
  try {
    const parsedPerks = JSON.parse(savedPerks);
    // Check if the saved data matches our mock data structure
    return parsedPerks.some((perk: Perk) => 
      mockPerks.some(mockPerk => mockPerk.id === perk.id)
    );
  } catch {
    return true;
  }
};