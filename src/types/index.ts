export interface Perk {
  id: string;
  name: string;
  description: string;
  link?: string;
  expiryDate: string;
  category: string;
  status: 'unused' | 'in-progress' | 'completed' | 'expired';
  value?: string;
  provider?: string;
  notes: string[];
  progress: {
    readDocs: boolean;
    usedInProject: boolean;
    completedTutorial: boolean;
    sharedWithTeam: boolean;
  };
  createdAt: string;
}

export interface AIMessage {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: string;
  relatedPerkId?: string;
}

export interface LearningNote {
  id: string;
  content: string;
  perkId: string;
  createdAt: string;
  isFromAI: boolean;
}

export interface GeminiModel {
  id: string;
  name: string;
  description: string;
}

export interface AISettings {
  apiKey: string;
  selectedModel: string;
  temperature: number;
  maxTokens: number;
}