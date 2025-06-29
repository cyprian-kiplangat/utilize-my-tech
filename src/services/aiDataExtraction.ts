import { GoogleGenerativeAI } from '@google/generative-ai';
import { Perk } from '../types';

export interface ExtractedPerkData {
  name?: string;
  description?: string;
  provider?: string;
  value?: string;
  category?: string;
  expiryDate?: string;
  link?: string;
  confidence: number;
}

export interface WebSearchResult {
  title: string;
  url: string;
  snippet: string;
  relevanceScore: number;
}

export class AIDataExtractionService {
  private genAI: GoogleGenerativeAI | null = null;

  constructor(apiKey?: string) {
    if (apiKey) {
      this.genAI = new GoogleGenerativeAI(apiKey);
    }
  }

  updateApiKey(apiKey: string) {
    this.genAI = new GoogleGenerativeAI(apiKey);
  }

  async extractPerkData(rawText: string): Promise<ExtractedPerkData> {
    if (!this.genAI) {
      throw new Error('Google AI API key not configured');
    }

    const model = this.genAI.getGenerativeModel({ 
      model: "gemini-2.0-flash-lite",
      generationConfig: {
        temperature: 0.1,
        maxOutputTokens: 1000,
      }
    });

    const prompt = `
Extract perk/offer information from the following text and return ONLY a valid JSON object with these fields:
- name: string (concise name for the offer)
- description: string (detailed description)
- provider: string (company/service name)
- value: string (monetary value like "$100", "6 months free", etc.)
- category: string (one of: "Cloud Platform", "AI Platform", "Hosting Platform", "Database", "AI Development Tool", "Analytics", "Monitoring", "API Service", "Design Tool", "Communication", "Other")
- expiryDate: string (YYYY-MM-DD format, calculate from relative dates like "48 hours", "next week", etc. Use today as ${new Date().toISOString().split('T')[0]})
- link: string (any URL mentioned or inferred)
- confidence: number (0-1, how confident you are in the extraction)

Text to analyze:
${rawText}

Return only the JSON object, no other text:`;

    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Clean up the response to extract JSON
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No valid JSON found in response');
      }

      const extractedData = JSON.parse(jsonMatch[0]);
      
      // Validate and set defaults
      return {
        name: extractedData.name || '',
        description: extractedData.description || '',
        provider: extractedData.provider || '',
        value: extractedData.value || '',
        category: extractedData.category || 'Other',
        expiryDate: extractedData.expiryDate || '',
        link: extractedData.link || '',
        confidence: Math.min(Math.max(extractedData.confidence || 0.5, 0), 1)
      };
    } catch (error) {
      console.error('Error extracting perk data:', error);
      return {
        confidence: 0,
        name: '',
        description: rawText.substring(0, 200) + '...',
        provider: '',
        value: '',
        category: 'Other',
        expiryDate: '',
        link: ''
      };
    }
  }

  async searchWebOffers(query: string): Promise<WebSearchResult[]> {
    if (!this.genAI) {
      throw new Error('Google AI API key not configured');
    }

    const model = this.genAI.getGenerativeModel({ 
      model: "gemini-2.0-flash-lite",
      tools: [{
        googleSearchRetrieval: {
          dynamicRetrievalConfig: {
            mode: "MODE_DYNAMIC",
            dynamicThreshold: 0.7
          }
        }
      }]
    });

    const searchPrompt = `
Search for current developer perks, free trials, and credits related to: "${query}"

Focus on:
- Active offers and promotions
- Free tiers and trial periods  
- Developer-specific benefits
- Startup credits and programs

Return the results as a JSON array with objects containing:
- title: string
- url: string  
- snippet: string (brief description)
- relevanceScore: number (0-1)

Limit to top 5 most relevant results.`;

    try {
      const result = await model.generateContent(searchPrompt);
      const response = await result.response;
      const text = response.text();
      
      // Extract JSON from response
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (!jsonMatch) {
        return [];
      }

      const searchResults = JSON.parse(jsonMatch[0]);
      return searchResults.map((result: any) => ({
        title: result.title || '',
        url: result.url || '',
        snippet: result.snippet || '',
        relevanceScore: Math.min(Math.max(result.relevanceScore || 0.5, 0), 1)
      }));
    } catch (error) {
      console.error('Error searching web offers:', error);
      return [];
    }
  }

  async validatePerkStatus(perk: Perk): Promise<{ isValid: boolean; message: string; updatedInfo?: Partial<Perk> }> {
    if (!this.genAI) {
      throw new Error('Google AI API key not configured');
    }

    const model = this.genAI.getGenerativeModel({ 
      model: "gemini-2.0-flash-lite",
      tools: [{
        googleSearchRetrieval: {
          dynamicRetrievalConfig: {
            mode: "MODE_DYNAMIC",
            dynamicThreshold: 0.7
          }
        }
      }]
    });

    const validationPrompt = `
Check if this perk/offer is still valid and active:

Name: ${perk.name}
Provider: ${perk.provider}
Description: ${perk.description}
Current Value: ${perk.value}
Link: ${perk.link}

Search for current information about this offer and return a JSON object with:
- isValid: boolean (true if offer is still active)
- message: string (explanation of status)
- updatedInfo: object with any updated fields (value, expiryDate, description, link)

Focus on finding the most recent information about this specific offer.`;

    try {
      const result = await model.generateContent(validationPrompt);
      const response = await result.response;
      const text = response.text();
      
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        return { isValid: true, message: 'Could not validate status' };
      }

      const validation = JSON.parse(jsonMatch[0]);
      return {
        isValid: validation.isValid !== false,
        message: validation.message || 'Status checked',
        updatedInfo: validation.updatedInfo || undefined
      };
    } catch (error) {
      console.error('Error validating perk status:', error);
      return { isValid: true, message: 'Validation failed' };
    }
  }

  async generateOptimizationSuggestions(perks: Perk[]): Promise<string[]> {
    if (!this.genAI) {
      throw new Error('Google AI API key not configured');
    }

    const model = this.genAI.getGenerativeModel({ 
      model: "gemini-2.0-flash-lite",
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1500,
      }
    });

    const portfolioSummary = perks.map(perk => ({
      name: perk.name,
      provider: perk.provider,
      category: perk.category,
      status: perk.status,
      value: perk.value,
      expiryDate: perk.expiryDate,
      progress: Object.values(perk.progress).filter(Boolean).length
    }));

    const prompt = `
Analyze this tech portfolio and provide 5 specific, actionable optimization suggestions:

Portfolio: ${JSON.stringify(portfolioSummary, null, 2)}

Focus on:
- Expiring resources that need immediate attention
- Underutilized assets with high potential
- Strategic combinations of tools
- Learning opportunities to maximize ROI
- Project ideas using available resources

Return as a JSON array of strings, each being a specific actionable suggestion.`;

    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (!jsonMatch) {
        return ['Review your expiring perks and prioritize high-value ones'];
      }

      const suggestions = JSON.parse(jsonMatch[0]);
      return Array.isArray(suggestions) ? suggestions : [suggestions];
    } catch (error) {
      console.error('Error generating optimization suggestions:', error);
      return ['Review your portfolio for optimization opportunities'];
    }
  }
}

// Singleton instance
export const aiDataExtraction = new AIDataExtractionService();