import { Perk } from '../types';

export const mockPerks: Perk[] = [
  {
    id: '1',
    name: 'AWS Credits',
    description: '$1000 in AWS credits for compute, storage, and machine learning services',
    link: 'https://aws.amazon.com/credits/',
    expiryDate: '2025-03-15',
    category: 'Cloud Platform',
    status: 'unused',
    value: '$1000',
    provider: 'Amazon Web Services',
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
    id: '2',
    name: 'GitHub Copilot',
    description: 'AI-powered code completion and suggestions for faster development',
    link: 'https://github.com/copilot',
    expiryDate: '2025-02-28',
    category: 'AI Development Tool',
    status: 'in-progress',
    value: '$10/month',
    provider: 'GitHub',
    notes: ['Great for React components', 'Helps with TypeScript types'],
    progress: {
      readDocs: true,
      usedInProject: true,
      completedTutorial: false,
      sharedWithTeam: false
    },
    createdAt: '2025-01-05'
  },
  {
    id: '3',
    name: 'Vercel Pro',
    description: 'Premium hosting with advanced analytics and team collaboration features',
    link: 'https://vercel.com/pro',
    expiryDate: '2025-02-20',
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
    createdAt: '2025-01-08'
  },
  {
    id: '4',
    name: 'OpenAI API Credits',
    description: '$500 in API credits for GPT-4, DALL-E, and other AI models',
    link: 'https://openai.com/api/',
    expiryDate: '2025-04-01',
    category: 'AI Platform',
    status: 'in-progress',
    value: '$500',
    provider: 'OpenAI',
    notes: ['Used for chatbot project', 'Rate limits are generous'],
    progress: {
      readDocs: true,
      usedInProject: true,
      completedTutorial: true,
      sharedWithTeam: false
    },
    createdAt: '2025-01-01'
  },
  {
    id: '5',
    name: 'MongoDB Atlas',
    description: 'Free tier database with 512MB storage and shared cluster access',
    link: 'https://mongodb.com/atlas',
    expiryDate: '2024-12-31',
    category: 'Database',
    status: 'expired',
    value: '$9/month',
    provider: 'MongoDB',
    notes: ['Good for small projects'],
    progress: {
      readDocs: true,
      usedInProject: true,
      completedTutorial: false,
      sharedWithTeam: true
    },
    createdAt: '2024-11-15'
  }
];