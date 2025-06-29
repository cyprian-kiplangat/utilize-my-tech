import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Lightbulb, BookOpen, Code, Settings, Zap, Search, TrendingUp } from 'lucide-react';
import { usePerks } from '../hooks/usePerks';
import { useAISettings } from '../hooks/useAISettings';
import { useAIDataExtraction } from '../hooks/useAIDataExtraction';
import { AISettings } from './AISettings';
import { MarkdownRenderer } from './MarkdownRenderer';

export const AIAssistant: React.FC = () => {
  const { perks } = usePerks();
  const { settings, isConfigured, getSelectedModel } = useAISettings();
  const { generateOptimizationSuggestions } = useAIDataExtraction();
  const [showSettings, setShowSettings] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: '1',
      role: 'assistant' as const,
      content: "Hi! I'm your AI investment advisor. I can help you maximize your tech portfolio by suggesting optimization strategies, project ideas, and learning paths. I can also search for new opportunities and extract data from offers. What would you like to explore today?"
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingSuggestions, setIsGeneratingSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const selectedModel = getSelectedModel();

  // Create system prompt based on user's perks
  const createSystemPrompt = () => {
    const activePerks = perks.filter(p => p.status !== 'expired');
    const unusedPerks = perks.filter(p => p.status === 'unused');
    const inProgressPerks = perks.filter(p => p.status === 'in-progress');
    const expiringPerks = perks.filter(perk => {
      const now = new Date();
      const expiryDate = new Date(perk.expiryDate);
      const daysUntilExpiry = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      return daysUntilExpiry <= 7 && daysUntilExpiry > 0;
    });

    return `You are an AI investment advisor for UtilizeMyTech, helping developers maximize their tech portfolio ROI.

Current portfolio context:
- Total active assets: ${activePerks.length}
- Unused assets: ${unusedPerks.map(p => `${p.name} (${p.provider}, expires ${p.expiryDate})`).join(', ') || 'None'}
- In-progress assets: ${inProgressPerks.map(p => `${p.name} (${p.provider})`).join(', ') || 'None'}
- Expiring soon: ${expiringPerks.map(p => `${p.name} (expires ${p.expiryDate})`).join(', ') || 'None'}

Your capabilities:
- Portfolio optimization advice
- Project ideas using available resources
- Learning path recommendations
- ROI maximization strategies
- Technology stack suggestions
- Integration opportunities

Focus on:
- Actionable, specific advice
- Maximizing value before expiration
- Strategic combinations of tools
- Real-world project applications
- Professional development opportunities

Use markdown formatting for better readability. Be encouraging and strategic in your advice.`;
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !isConfigured() || isLoading) return;

    const userMessage = {
      id: Date.now().toString(),
      role: 'user' as const,
      content: input.trim()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/' + settings.selectedModel + ':generateContent?key=' + settings.apiKey, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: createSystemPrompt() + '\n\nUser: ' + input.trim()
            }]
          }],
          generationConfig: {
            temperature: settings.temperature,
            maxOutputTokens: settings.maxTokens,
          }
        })
      });

      if (!response.ok) {
        throw new Error('Failed to get AI response');
      }

      const data = await response.json();
      const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Sorry, I could not generate a response.';

      const assistantMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant' as const,
        content: aiResponse
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('AI response error:', error);
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant' as const,
        content: 'Sorry, I encountered an error. Please check your API key configuration and try again.'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickActions = [
    { icon: TrendingUp, text: "Optimize my portfolio", action: "Analyze my current portfolio and suggest optimization strategies" },
    { icon: Lightbulb, text: "Suggest project ideas", action: "What projects can I build with my current perks?" },
    { icon: BookOpen, text: "Create learning path", action: "Help me create a learning path based on my available resources" },
    { icon: Code, text: "Integration opportunities", action: "What are the best ways to combine my current tools?" },
    { icon: Zap, text: "Urgent actions", action: "What should I prioritize with my expiring perks?" },
    { icon: Search, text: "Find new opportunities", action: "What new perks or offers should I look for?" }
  ];

  const handleQuickAction = async (action: string) => {
    if (!isConfigured()) {
      setShowSettings(true);
      return;
    }

    // Special handling for portfolio optimization
    if (action === "Analyze my current portfolio and suggest optimization strategies") {
      setIsGeneratingSuggestions(true);
      
      const userMessage = {
        id: Date.now().toString(),
        role: 'user' as const,
        content: action
      };
      setMessages(prev => [...prev, userMessage]);

      try {
        const optimizationSuggestions = await generateOptimizationSuggestions(perks);
        setSuggestions(optimizationSuggestions);
        
        const suggestionText = optimizationSuggestions.length > 0 
          ? `Here are my optimization suggestions for your portfolio:\n\n${optimizationSuggestions.map((s, i) => `${i + 1}. ${s}`).join('\n')}`
          : 'I couldn\'t generate specific optimization suggestions at the moment. Please try again or ask me specific questions about your portfolio.';

        const assistantMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant' as const,
          content: suggestionText
        };
        setMessages(prev => [...prev, assistantMessage]);
      } catch (error) {
        console.error('Error generating suggestions:', error);
        const errorMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant' as const,
          content: 'Sorry, I encountered an error while generating optimization suggestions. This might be due to API rate limits. Please try again later or ask me specific questions about your portfolio.'
        };
        setMessages(prev => [...prev, errorMessage]);
      } finally {
        setIsGeneratingSuggestions(false);
      }
    } else {
      setInput(action);
    }
  };

  return (
    <>
      <div className="flex flex-col h-[calc(100vh-8rem)]">
        {/* Header */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-t-xl px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Bot size={20} className="text-white" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">AI Investment Advisor</h2>
                <p className="text-sm text-slate-400">
                  {isConfigured() 
                    ? `Powered by ${selectedModel.name} • Portfolio value optimization` 
                    : 'Configure Google AI to get started'
                  }
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowSettings(true)}
              className="p-2 hover:bg-slate-800 rounded-lg transition-colors duration-200"
            >
              <Settings size={20} className="text-slate-400" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 bg-slate-900/30 border-x border-slate-800 overflow-y-auto p-6 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex space-x-3 max-w-4xl ${message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  message.role === 'user' 
                    ? 'bg-blue-600' 
                    : 'bg-gradient-to-r from-blue-500 to-purple-600'
                }`}>
                  {message.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                </div>
                <div className={`rounded-xl px-4 py-3 ${
                  message.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-800 text-slate-200 border border-slate-700'
                }`}>
                  {message.role === 'assistant' ? (
                    <div className="text-sm">
                      <MarkdownRenderer content={message.content} />
                    </div>
                  ) : (
                    <p className="whitespace-pre-wrap leading-relaxed text-sm">{message.content}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
          
          {(isLoading || isGeneratingSuggestions) && (
            <div className="flex justify-start">
              <div className="flex space-x-3 max-w-4xl">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 bg-gradient-to-r from-blue-500 to-purple-600">
                  <Bot size={16} />
                </div>
                <div className="bg-slate-800 text-slate-200 border border-slate-700 rounded-xl px-4 py-3">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Actions */}
        {isConfigured() && (
          <div className="bg-slate-900/30 border-x border-slate-800 px-6 py-3">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <button
                    key={index}
                    onClick={() => handleQuickAction(action.action)}
                    disabled={isGeneratingSuggestions && action.text === "Optimize my portfolio"}
                    className="flex items-center space-x-2 px-3 py-2 bg-slate-800 hover:bg-slate-700 disabled:bg-slate-700 disabled:opacity-50 rounded-lg text-sm text-slate-300 transition-colors duration-200 text-left"
                  >
                    <Icon size={14} />
                    <span className="truncate">{action.text}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-b-xl p-4">
          <form onSubmit={handleSubmit} className="flex space-x-3">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={isConfigured() ? "Ask me about optimizing your tech portfolio..." : "Configure Google AI first..."}
              disabled={!isConfigured() || isLoading || isGeneratingSuggestions}
              className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors duration-200 disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!input.trim() || !isConfigured() || isLoading || isGeneratingSuggestions}
              className="px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 disabled:text-slate-500 rounded-lg transition-colors duration-200"
            >
              <Send size={18} />
            </button>
          </form>
          
          {!isConfigured() && (
            <div className="mt-3 text-center">
              <button
                onClick={() => setShowSettings(true)}
                className="text-blue-400 hover:text-blue-300 text-sm transition-colors duration-200"
              >
                Configure Google AI to enable advanced features →
              </button>
            </div>
          )}
        </div>
      </div>

      <AISettings isOpen={showSettings} onClose={() => setShowSettings(false)} />
    </>
  );
};