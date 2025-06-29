import { useState } from 'react';
import { aiDataExtraction, ExtractedPerkData, WebSearchResult } from '../services/aiDataExtraction';
import { useAISettings } from './useAISettings';
import { Perk } from '../types';

export const useAIDataExtraction = () => {
  const { settings, isConfigured } = useAISettings();
  const [isExtracting, setIsExtracting] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isValidating, setIsValidating] = useState(false);

  // Update API key when settings change
  if (isConfigured() && settings.apiKey) {
    aiDataExtraction.updateApiKey(settings.apiKey);
  }

  const extractPerkData = async (rawText: string): Promise<ExtractedPerkData | null> => {
    if (!isConfigured()) {
      throw new Error('AI not configured. Please set up your Google AI API key.');
    }

    setIsExtracting(true);
    try {
      const result = await aiDataExtraction.extractPerkData(rawText);
      return result;
    } catch (error) {
      console.error('Error extracting perk data:', error);
      throw error;
    } finally {
      setIsExtracting(false);
    }
  };

  const searchWebOffers = async (query: string): Promise<WebSearchResult[]> => {
    if (!isConfigured()) {
      throw new Error('AI not configured. Please set up your Google AI API key.');
    }

    setIsSearching(true);
    try {
      const results = await aiDataExtraction.searchWebOffers(query);
      return results;
    } catch (error) {
      console.error('Error searching web offers:', error);
      throw error;
    } finally {
      setIsSearching(false);
    }
  };

  const validatePerkStatus = async (perk: Perk) => {
    if (!isConfigured()) {
      throw new Error('AI not configured. Please set up your Google AI API key.');
    }

    setIsValidating(true);
    try {
      const result = await aiDataExtraction.validatePerkStatus(perk);
      return result;
    } catch (error) {
      console.error('Error validating perk status:', error);
      throw error;
    } finally {
      setIsValidating(false);
    }
  };

  const generateOptimizationSuggestions = async (perks: Perk[]): Promise<string[]> => {
    if (!isConfigured()) {
      throw new Error('AI not configured. Please set up your Google AI API key.');
    }

    try {
      const suggestions = await aiDataExtraction.generateOptimizationSuggestions(perks);
      return suggestions;
    } catch (error) {
      console.error('Error generating optimization suggestions:', error);
      throw error;
    }
  };

  return {
    extractPerkData,
    searchWebOffers,
    validatePerkStatus,
    generateOptimizationSuggestions,
    isExtracting,
    isSearching,
    isValidating,
    isConfigured: isConfigured()
  };
};