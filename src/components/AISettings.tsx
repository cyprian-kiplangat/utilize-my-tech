import React, { useState } from 'react';
import { Settings, Eye, EyeOff, ExternalLink, Key, Zap } from 'lucide-react';
import { useAISettings } from '../hooks/useAISettings';

interface AISettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AISettings: React.FC<AISettingsProps> = ({ isOpen, onClose }) => {
  const { settings, updateSettings, geminiModels, getSelectedModel } = useAISettings();
  const [showApiKey, setShowApiKey] = useState(false);
  const [testingConnection, setTestingConnection] = useState(false);

  if (!isOpen) return null;

  const handleApiKeyChange = (apiKey: string) => {
    updateSettings({ apiKey });
  };

  const handleModelChange = (selectedModel: string) => {
    updateSettings({ selectedModel });
  };

  const testConnection = async () => {
    if (!settings.apiKey) return;
    
    setTestingConnection(true);
    try {
      // Test the API key with a simple request
      const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/' + settings.selectedModel + ':generateContent?key=' + settings.apiKey, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: 'Hello! Please respond with just "Connection successful!" to test this API key.'
            }]
          }],
          generationConfig: {
            temperature: 0.1,
            maxOutputTokens: 50,
          }
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
        if (responseText.includes('Connection successful') || responseText.includes('Hello')) {
          alert('✅ Connection successful! API key is working.');
        } else {
          alert('✅ API key is valid and responding.');
        }
      } else {
        const errorData = await response.json();
        alert(`❌ Connection failed: ${errorData.error?.message || 'Please check your API key.'}`);
      }
    } catch (error) {
      alert('❌ Connection failed. Please check your API key and internet connection.');
    } finally {
      setTestingConnection(false);
    }
  };

  const selectedModel = getSelectedModel();

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Zap size={20} className="text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">AI Assistant Settings</h2>
              <p className="text-sm text-slate-400">Configure Google Gemini AI</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-800 rounded-lg transition-colors duration-200"
          >
            <span className="text-slate-400 text-xl">×</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Introduction */}
          <div className="bg-blue-900/20 border border-blue-800/30 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-blue-400 mb-2">Google Gemini AI</h3>
            <p className="text-blue-200 text-sm mb-3">
              Get personalized learning assistance powered by Google's advanced AI models. Your API key is stored securely in your browser.
            </p>
            <div className="flex items-center space-x-2 text-sm text-blue-300">
              <span>✨ Free tier includes generous usage limits</span>
            </div>
          </div>

          {/* API Key Setup */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">API Configuration</h3>
            
            {/* Setup Instructions */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
              <h4 className="text-white font-medium mb-3">How to get your Google AI API key:</h4>
              <ol className="text-sm text-slate-300 space-y-2">
                <li className="flex items-start space-x-2">
                  <span className="text-blue-400 font-medium">1.</span>
                  <span>Visit Google AI Studio</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-blue-400 font-medium">2.</span>
                  <span>Sign in with your Google account</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-blue-400 font-medium">3.</span>
                  <span>Click "Get API Key" in the left sidebar</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-blue-400 font-medium">4.</span>
                  <span>Click "Create API Key" and copy it</span>
                </li>
              </ol>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 mt-3 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm transition-colors duration-200"
              >
                <ExternalLink size={14} />
                <span>Open Google AI Studio</span>
              </a>
            </div>

            {/* API Key Input */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Google AI API Key
              </label>
              <div className="relative">
                <Key size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500" />
                <input
                  type={showApiKey ? 'text' : 'password'}
                  value={settings.apiKey}
                  onChange={(e) => handleApiKeyChange(e.target.value)}
                  placeholder="AIza..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-12 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors duration-200"
                />
                <button
                  type="button"
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-slate-400"
                >
                  {showApiKey ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {settings.apiKey && (
                <div className="flex justify-end mt-2">
                  <button
                    onClick={testConnection}
                    disabled={testingConnection}
                    className="px-3 py-1 bg-green-600 hover:bg-green-700 disabled:bg-slate-700 rounded text-sm transition-colors duration-200"
                  >
                    {testingConnection ? 'Testing...' : 'Test Connection'}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Model Selection */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Model Selection</h3>
            <div className="space-y-3">
              {geminiModels.map((model) => (
                <label key={model.id} className="flex items-start space-x-3 cursor-pointer p-3 bg-slate-800/30 hover:bg-slate-800/50 rounded-lg border border-slate-700/50 transition-colors duration-200">
                  <input
                    type="radio"
                    name="selectedModel"
                    checked={settings.selectedModel === model.id}
                    onChange={() => handleModelChange(model.id)}
                    className="mt-1 text-blue-600 focus:ring-blue-500 focus:ring-offset-0"
                  />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-white font-medium">{model.name}</span>
                      {model.id === 'gemini-2.0-flash-lite' && (
                        <span className="px-2 py-1 bg-green-600/20 text-green-400 text-xs rounded-full">
                          Default
                        </span>
                      )}
                      {model.id === 'gemini-2.5-pro' && (
                        <span className="px-2 py-1 bg-purple-600/20 text-purple-400 text-xs rounded-full">
                          Most Capable
                        </span>
                      )}
                      {model.id === 'gemini-2.5-flash' && (
                        <span className="px-2 py-1 bg-blue-600/20 text-blue-400 text-xs rounded-full">
                          Latest
                        </span>
                      )}
                    </div>
                    <p className="text-slate-400 text-sm mt-1">{model.description}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Advanced Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Advanced Settings</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Temperature (Creativity)
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={settings.temperature}
                  onChange={(e) => updateSettings({ temperature: parseFloat(e.target.value) })}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-slate-500 mt-1">
                  <span>Focused (0)</span>
                  <span className="text-blue-400">{settings.temperature}</span>
                  <span>Creative (1)</span>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Max Tokens
                </label>
                <input
                  type="number"
                  min="100"
                  max="4000"
                  step="100"
                  value={settings.maxTokens}
                  onChange={(e) => updateSettings({ maxTokens: parseInt(e.target.value) })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Current Configuration */}
          {settings.apiKey && (
            <div className="bg-green-900/20 border border-green-800/30 rounded-lg p-4">
              <h4 className="text-green-400 font-medium mb-2">✅ Configuration Active</h4>
              <div className="text-green-200 text-sm space-y-1">
                <p>• Model: {selectedModel.name}</p>
                <p>• Temperature: {settings.temperature}</p>
                <p>• Max Tokens: {settings.maxTokens}</p>
                <p>• API Key: {settings.apiKey.substring(0, 8)}...</p>
              </div>
            </div>
          )}

          {/* Security Notice */}
          <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-4">
            <h4 className="text-slate-300 font-medium mb-2">🔒 Security & Privacy</h4>
            <ul className="text-slate-400 text-sm space-y-1">
              <li>• API key stored locally in your browser only</li>
              <li>• Never transmitted to our servers</li>
              <li>• Direct communication with Google AI</li>
              <li>• You control your usage and billing</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end p-6 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors duration-200"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};