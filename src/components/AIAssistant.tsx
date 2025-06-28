import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Lightbulb, BookOpen, Code, Settings } from 'lucide-react';
import { usePerks } from '../hooks/usePerks';
import { useAISettings } from '../hooks/useAISettings';
import { AISettings } from './AISettings';
import { MarkdownRenderer } from './MarkdownRenderer';

export const AIAssistant: React.FC = () => {
  const { perks } = usePerks();
  const { settings, isConfigured, getSelectedModel } = useAISettings();
  const [showSettings, setShowSettings] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: '1',
      role: 'assistant' as const,
      content: "Hi! I'm your learning assistant. I can help you make the most of your tech perks by suggesting learning paths, project ideas, and best practices. What would you like to explore today?"
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const selectedModel = getSelectedModel();

  // Create system prompt based on user's perks
  const createSystemPrompt = () => {
    const activePerks = perks.filter(p => p.status !== 'expired');
    const unusedPerks = perks.filter(p => p.status === 'unused');
    const inProgressPerks = perks.filter(p => p.status === 'in-progress');

    return `You are a helpful AI learning assistant for UtilizeMyTech, a platform that helps developers maximize their free tech perks and trials.

Current user context:
- Total active perks: ${activePerks.length}
- Unused perks: ${unusedPerks.map(p => p.name).join(', ') || 'None'}
- In-progress perks: ${inProgressPerks.map(p => p.name).join(', ') || 'None'}

Your role:
- Help users learn and apply their tech perks effectively
- Suggest practical project ideas based on available perks
- Provide learning paths and best practices
- Keep responses well-formatted using markdown for better readability
- Use headers, lists, code blocks, and emphasis appropriately
- Ask follow-up questions to understand their goals
- Focus on hands-on learning and real-world applications

Format your responses with proper markdown:
- Use ## for main sections
- Use ### for subsections
- Use **bold** for emphasis
- Use \`code\` for inline code
- Use \`\`\`language for code blocks
- Use - or * for bullet points
- Use 1. 2. 3. for numbered lists

Be encouraging, practical, and focus on helping them get the most value from their perks before they expire.`;
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
      // Simulate AI response using Google Gemini
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
    { icon: Lightbulb, text: "Suggest project ideas", action: "What projects can I build with my current perks?" },
    { icon: BookOpen, text: "Create learning path", action: "Help me create a learning path" },
    { icon: Code, text: "Best practices", action: "What are the best practices for my tech stack?" }
  ];

  const handleQuickAction = (action: string) => {
    if (!isConfigured()) {
      setShowSettings(true);
      return;
    }
    setInput(action);
  };

  return (
    <>
      <div className="flex flex-col h-[calc(100vh-12rem)]">
        {/* Header */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-t-xl px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Bot size={20} className="text-white" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">AI Learning Assistant</h2>
                <p className="text-sm text-slate-400">
                  {isConfigured() 
                    ? `Powered by ${selectedModel.name}` 
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
                    <MarkdownRenderer content={message.content} />
                  ) : (
                    <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
          
          {isLoading && (
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
            <div className="flex flex-wrap gap-2">
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <button
                    key={index}
                    onClick={() => handleQuickAction(action.action)}
                    className="flex items-center space-x-2 px-3 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm text-slate-300 transition-colors duration-200"
                  >
                    <Icon size={14} />
                    <span>{action.text}</span>
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
              placeholder={isConfigured() ? "Ask me anything about your tech perks..." : "Configure Google AI first..."}
              disabled={!isConfigured() || isLoading}
              className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors duration-200 disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!input.trim() || !isConfigured() || isLoading}
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
                Configure Google AI to enable chat →
              </button>
            </div>
          )}
        </div>
      </div>

      <AISettings isOpen={showSettings} onClose={() => setShowSettings(false)} />
    </>
  );
};