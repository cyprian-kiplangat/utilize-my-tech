import { useState, useEffect } from 'react';
import { AISettings, GeminiModel } from '../types';

export const geminiModels: GeminiModel[] = [
  {
    id: 'gemini-2.5-flash',
    name: 'Gemini 2.5 Flash',
    description: 'Latest flash model with enhanced speed and capabilities'
  },
  {
    id: 'gemini-2.5-flash-lite-preview-06-17',
    name: 'Gemini 2.5 Flash Lite Preview',
    description: 'Lightweight preview version for fast responses'
  },
  {
    id: 'gemini-2.0-flash',
    name: 'Gemini 2.0 Flash',
    description: 'Fast and efficient model with good performance'
  },
  {
    id: 'gemini-2.0-flash-lite',
    name: 'Gemini 2.0 Flash Lite',
    description: 'Lightweight model optimized for speed (Default)'
  },
  {
    id: 'gemini-2.5-pro',
    name: 'Gemini 2.5 Pro',
    description: 'Most capable model for complex reasoning and analysis'
  }
];

const defaultSettings: AISettings = {
  apiKey: '',
  selectedModel: 'gemini-2.0-flash-lite',
  temperature: 0.7,
  maxTokens: 1000
};

export const useAISettings = () => {
  const [settings, setSettings] = useState<AISettings>(defaultSettings);

  useEffect(() => {
    const savedSettings = localStorage.getItem('utilize-my-tech-ai-settings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings(prev => ({ ...prev, ...parsed }));
      } catch (error) {
        console.error('Failed to parse AI settings:', error);
      }
    }
  }, []);

  const saveSettings = (newSettings: AISettings) => {
    setSettings(newSettings);
    localStorage.setItem('utilize-my-tech-ai-settings', JSON.stringify(newSettings));
  };

  const updateSettings = (updates: Partial<AISettings>) => {
    const newSettings = { ...settings, ...updates };
    saveSettings(newSettings);
  };

  const isConfigured = () => {
    return settings.apiKey.trim().length > 0;
  };

  const getSelectedModel = () => {
    return geminiModels.find(model => model.id === settings.selectedModel) || geminiModels[3]; // Default to gemini-2.0-flash-lite
  };

  return {
    settings,
    saveSettings,
    updateSettings,
    isConfigured,
    getSelectedModel,
    geminiModels
  };
};