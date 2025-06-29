import React, { useState } from 'react';
import { Save, X, Sparkles, Wand2, Search, AlertCircle, CheckCircle, Loader, Copy, ExternalLink } from 'lucide-react';
import { usePerks } from '../hooks/usePerks';
import { useAIDataExtraction } from '../hooks/useAIDataExtraction';
import { Perk } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

interface SmartAddPerkProps {
  onSuccess: () => void;
}

export const SmartAddPerk: React.FC<SmartAddPerkProps> = ({ onSuccess }) => {
  const { addPerk } = usePerks();
  const { extractPerkData, searchWebOffers, isExtracting, isSearching, isConfigured } = useAIDataExtraction();
  
  const [mode, setMode] = useState<'extract' | 'search' | 'manual'>('extract');
  const [rawText, setRawText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [extractedData, setExtractedData] = useState<any>(null);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    link: '',
    expiryDate: '',
    category: '',
    provider: '',
    value: ''
  });

  const categories = [
    { name: 'Cloud Platform', icon: '☁️', color: 'from-blue-500 to-cyan-500' },
    { name: 'AI Platform', icon: '🤖', color: 'from-purple-500 to-pink-500' },
    { name: 'Hosting Platform', icon: '🌐', color: 'from-green-500 to-emerald-500' },
    { name: 'Database', icon: '🗄️', color: 'from-orange-500 to-red-500' },
    { name: 'AI Development Tool', icon: '⚡', color: 'from-yellow-500 to-orange-500' },
    { name: 'Analytics', icon: '📊', color: 'from-indigo-500 to-purple-500' },
    { name: 'Monitoring', icon: '📈', color: 'from-teal-500 to-blue-500' },
    { name: 'API Service', icon: '🔌', color: 'from-pink-500 to-rose-500' },
    { name: 'Design Tool', icon: '🎨', color: 'from-violet-500 to-purple-500' },
    { name: 'Communication', icon: '💬', color: 'from-blue-500 to-indigo-500' },
    { name: 'Other', icon: '🔧', color: 'from-slate-500 to-gray-500' }
  ];

  const handleExtractData = async () => {
    if (!rawText.trim()) return;
    
    setError(null);
    try {
      const result = await extractPerkData(rawText);
      if (result && result.confidence > 0.3) {
        setExtractedData(result);
        setFormData({
          name: result.name || '',
          description: result.description || '',
          link: result.link || '',
          expiryDate: result.expiryDate || '',
          category: result.category || '',
          provider: result.provider || '',
          value: result.value || ''
        });
      } else {
        setError('Could not extract meaningful data from the text. Please try manual entry.');
      }
    } catch (error: any) {
      setError(error.message || 'Failed to extract data');
    }
  };

  const handleSearchOffers = async () => {
    if (!searchQuery.trim()) return;
    
    setError(null);
    try {
      const results = await searchWebOffers(searchQuery);
      setSearchResults(results);
    } catch (error: any) {
      setError(error.message || 'Failed to search offers');
    }
  };

  const handleSelectSearchResult = (result: any) => {
    setFormData({
      name: result.title,
      description: result.snippet,
      link: result.url,
      expiryDate: '',
      category: 'Other',
      provider: '',
      value: ''
    });
    setMode('manual');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const newPerk: Omit<Perk, 'id' | 'createdAt'> = {
        ...formData,
        status: 'unused',
        notes: [],
        progress: {
          readDocs: false,
          usedInProject: false,
          completedTutorial: false,
          sharedWithTeam: false
        }
      };

      addPerk(newPerk);
      setShowSuccess(true);
      
      // Reset form
      setFormData({
        name: '',
        description: '',
        link: '',
        expiryDate: '',
        category: '',
        provider: '',
        value: ''
      });
      setRawText('');
      setExtractedData(null);
      setSearchResults([]);

      setTimeout(() => {
        onSuccess();
      }, 2000);
      
    } catch (error) {
      console.error('Error adding perk:', error);
      setError('Failed to add perk');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (showSuccess) {
    return (
      <motion.div 
        className="max-w-2xl mx-auto"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center py-20">
          <motion.div 
            className="w-32 h-32 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
          >
            <CheckCircle size={64} className="text-white" />
          </motion.div>
          <motion.h2 
            className="text-4xl font-bold text-white mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            Asset Added Successfully! 🎉
          </motion.h2>
          <motion.p 
            className="text-slate-400 text-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            Your new tech asset is now being tracked in your portfolio...
          </motion.p>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <motion.div 
        className="text-center space-y-6"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="flex items-center justify-center space-x-4 mb-6">
          <motion.div 
            className="w-16 h-16 bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl"
            whileHover={{ scale: 1.05, rotate: 5 }}
          >
            <Sparkles size={32} className="text-white" />
          </motion.div>
          <div className="text-left">
            <h1 className="text-4xl font-black bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
              Smart Asset Acquisition
            </h1>
            <p className="text-slate-400 text-lg">AI-powered data extraction and discovery</p>
          </div>
        </div>
      </motion.div>

      {/* AI Configuration Notice */}
      {!isConfigured && (
        <motion.div 
          className="bg-gradient-to-r from-orange-900/20 to-red-900/20 border border-orange-500/30 rounded-3xl p-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center space-x-3">
            <AlertCircle size={24} className="text-orange-400" />
            <div>
              <h3 className="text-orange-400 font-semibold">AI Features Disabled</h3>
              <p className="text-orange-200 text-sm">Configure Google AI in the AI Assistant settings to enable smart data extraction and web search.</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Mode Selection */}
      <div className="flex justify-center space-x-4">
        {[
          { id: 'extract', label: 'Smart Extract', icon: Wand2, desc: 'Paste text to extract data' },
          { id: 'search', label: 'Web Discovery', icon: Search, desc: 'Search for current offers' },
          { id: 'manual', label: 'Manual Entry', icon: Save, desc: 'Traditional form input' }
        ].map((modeOption) => {
          const Icon = modeOption.icon;
          const isActive = mode === modeOption.id;
          const isDisabled = !isConfigured && modeOption.id !== 'manual';
          
          return (
            <motion.button
              key={modeOption.id}
              onClick={() => !isDisabled && setMode(modeOption.id as any)}
              disabled={isDisabled}
              className={`flex flex-col items-center space-y-2 p-4 rounded-2xl transition-all duration-300 ${
                isActive
                  ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-2xl'
                  : isDisabled
                  ? 'bg-slate-800/30 text-slate-600 cursor-not-allowed'
                  : 'bg-slate-800/50 text-slate-300 hover:bg-slate-700/50'
              }`}
              whileHover={!isDisabled ? { scale: 1.02 } : {}}
              whileTap={!isDisabled ? { scale: 0.98 } : {}}
            >
              <Icon size={24} />
              <div className="text-center">
                <div className="font-semibold">{modeOption.label}</div>
                <div className="text-xs opacity-75">{modeOption.desc}</div>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Error Display */}
      <AnimatePresence>
        {error && (
          <motion.div 
            className="bg-red-900/20 border border-red-500/30 rounded-2xl p-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="flex items-center space-x-3">
              <AlertCircle size={20} className="text-red-400" />
              <p className="text-red-300">{error}</p>
              <button
                onClick={() => setError(null)}
                className="ml-auto text-red-400 hover:text-red-300"
              >
                <X size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <div className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
            
            {/* Smart Extract Mode */}
            {mode === 'extract' && (
              <motion.div 
                className="space-y-6"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <h3 className="text-2xl font-bold text-white mb-4">🤖 Smart Data Extraction</h3>
                
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-3">
                    Paste Email, Announcement, or Offer Text
                  </label>
                  <textarea
                    value={rawText}
                    onChange={(e) => setRawText(e.target.value)}
                    placeholder="Paste the text containing perk information here..."
                    rows={8}
                    className="w-full bg-black/40 border border-white/20 rounded-2xl px-6 py-4 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 resize-none"
                  />
                </div>

                <button
                  onClick={handleExtractData}
                  disabled={!rawText.trim() || isExtracting || !isConfigured}
                  className="flex items-center space-x-3 px-6 py-3 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 disabled:from-slate-700 disabled:to-slate-700 disabled:text-slate-500 rounded-2xl font-bold transition-all duration-200"
                >
                  {isExtracting ? <Loader size={20} className="animate-spin" /> : <Wand2 size={20} />}
                  <span>{isExtracting ? 'Extracting...' : 'Extract Data'}</span>
                </button>

                {extractedData && (
                  <motion.div 
                    className="bg-green-900/20 border border-green-500/30 rounded-2xl p-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div className="flex items-center space-x-3 mb-4">
                      <CheckCircle size={20} className="text-green-400" />
                      <h4 className="text-green-400 font-semibold">
                        Data Extracted (Confidence: {Math.round(extractedData.confidence * 100)}%)
                      </h4>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div><span className="text-slate-400">Name:</span> <span className="text-white">{extractedData.name}</span></div>
                      <div><span className="text-slate-400">Provider:</span> <span className="text-white">{extractedData.provider}</span></div>
                      <div><span className="text-slate-400">Value:</span> <span className="text-white">{extractedData.value}</span></div>
                      <div><span className="text-slate-400">Category:</span> <span className="text-white">{extractedData.category}</span></div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* Web Search Mode */}
            {mode === 'search' && (
              <motion.div 
                className="space-y-6"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <h3 className="text-2xl font-bold text-white mb-4">🌐 Web Discovery</h3>
                
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-3">
                    Search for Current Offers
                  </label>
                  <div className="flex space-x-3">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="e.g., AWS credits, GitHub Copilot, hosting trials..."
                      className="flex-1 bg-black/40 border border-white/20 rounded-2xl px-6 py-4 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                    />
                    <button
                      onClick={handleSearchOffers}
                      disabled={!searchQuery.trim() || isSearching || !isConfigured}
                      className="flex items-center space-x-2 px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-slate-700 disabled:to-slate-700 disabled:text-slate-500 rounded-2xl font-bold transition-all duration-200"
                    >
                      {isSearching ? <Loader size={20} className="animate-spin" /> : <Search size={20} />}
                      <span>{isSearching ? 'Searching...' : 'Search'}</span>
                    </button>
                  </div>
                </div>

                {searchResults.length > 0 && (
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-white">Search Results</h4>
                    {searchResults.map((result, index) => (
                      <motion.div
                        key={index}
                        className="bg-slate-800/30 border border-slate-700 rounded-2xl p-4 hover:bg-slate-700/30 transition-colors duration-200 cursor-pointer"
                        onClick={() => handleSelectSearchResult(result)}
                        whileHover={{ scale: 1.01 }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h5 className="font-semibold text-white mb-2">{result.title}</h5>
                            <p className="text-slate-300 text-sm mb-2">{result.snippet}</p>
                            <div className="flex items-center space-x-2 text-xs text-slate-400">
                              <span>Relevance: {Math.round(result.relevanceScore * 100)}%</span>
                              <ExternalLink size={12} />
                            </div>
                          </div>
                          <button className="p-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors duration-200">
                            <Copy size={16} className="text-white" />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* Manual Entry Form */}
            {(mode === 'manual' || extractedData) && (
              <motion.form 
                onSubmit={handleSubmit}
                className="space-y-6"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <h3 className="text-2xl font-bold text-white mb-4">
                  {extractedData ? '✏️ Review & Edit' : '📝 Manual Entry'}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-3">Asset Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full bg-black/40 border border-white/20 rounded-2xl px-6 py-4 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                      placeholder="e.g., AWS Credits, GitHub Copilot"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-3">Provider</label>
                    <input
                      type="text"
                      name="provider"
                      value={formData.provider}
                      onChange={handleInputChange}
                      className="w-full bg-black/40 border border-white/20 rounded-2xl px-6 py-4 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                      placeholder="e.g., Amazon, GitHub, Vercel"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-3">Description *</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    rows={4}
                    className="w-full bg-black/40 border border-white/20 rounded-2xl px-6 py-4 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 resize-none"
                    placeholder="Describe the value and capabilities this asset provides..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-3">Asset Value</label>
                    <input
                      type="text"
                      name="value"
                      value={formData.value}
                      onChange={handleInputChange}
                      className="w-full bg-black/40 border border-white/20 rounded-2xl px-6 py-4 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                      placeholder="e.g., $100, 6 months free"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-3">Expiry Date *</label>
                    <input
                      type="date"
                      name="expiryDate"
                      value={formData.expiryDate}
                      onChange={handleInputChange}
                      required
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full bg-black/40 border border-white/20 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-3">Category *</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {categories.map((category) => (
                      <motion.label
                        key={category.name}
                        className={`relative cursor-pointer p-4 rounded-2xl border-2 transition-all duration-200 ${
                          formData.category === category.name
                            ? `bg-gradient-to-r ${category.color} border-white/30 text-white`
                            : 'bg-black/20 border-white/10 text-slate-300 hover:border-white/20'
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <input
                          type="radio"
                          name="category"
                          value={category.name}
                          checked={formData.category === category.name}
                          onChange={handleInputChange}
                          className="sr-only"
                        />
                        <div className="text-center">
                          <div className="text-2xl mb-2">{category.icon}</div>
                          <div className="text-xs font-semibold">{category.name}</div>
                        </div>
                      </motion.label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-3">Access Link</label>
                  <input
                    type="url"
                    name="link"
                    value={formData.link}
                    onChange={handleInputChange}
                    className="w-full bg-black/40 border border-white/20 rounded-2xl px-6 py-4 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                    placeholder="https://platform.com/your-account"
                  />
                </div>

                <div className="flex items-center space-x-4 pt-6">
                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 disabled:from-slate-700 disabled:to-slate-700 disabled:text-slate-500 rounded-2xl font-bold text-lg transition-all duration-200 shadow-2xl"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Save size={20} />
                    <span>{isSubmitting ? 'Adding Asset...' : 'Add to Portfolio'}</span>
                  </motion.button>
                  
                  <motion.button
                    type="button"
                    disabled={isSubmitting}
                    onClick={() => {
                      setFormData({
                        name: '',
                        description: '',
                        link: '',
                        expiryDate: '',
                        category: '',
                        provider: '',
                        value: ''
                      });
                      setExtractedData(null);
                      setRawText('');
                    }}
                    className="flex items-center space-x-2 px-6 py-4 text-slate-400 hover:text-slate-300 disabled:opacity-50 transition-colors duration-200"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <X size={18} />
                    <span>Clear Form</span>
                  </motion.button>
                </div>
              </motion.form>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* AI Features Info */}
          <div className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 border border-blue-500/30 rounded-3xl p-6">
            <h4 className="text-lg font-bold text-blue-400 mb-4">🤖 AI-Powered Features</h4>
            <ul className="space-y-3 text-sm text-blue-200">
              <li className="flex items-start space-x-2">
                <span className="text-blue-400 mt-1">•</span>
                <span><strong>Smart Extract:</strong> Paste any text to automatically extract perk data</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-blue-400 mt-1">•</span>
                <span><strong>Web Discovery:</strong> Search for current offers and promotions</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-blue-400 mt-1">•</span>
                <span><strong>Auto-Fill:</strong> Forms populate automatically with high accuracy</span>
              </li>
            </ul>
          </div>

          {/* Example Text */}
          <div className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-3xl p-6">
            <h4 className="text-lg font-bold text-white mb-4">📝 Example Text</h4>
            <div className="bg-slate-800/50 rounded-2xl p-4 text-sm text-slate-300">
              <p className="mb-2 font-semibold">Try pasting this:</p>
              <p className="text-xs leading-relaxed">
                "Get $500 in OpenAI API credits for new developers. This offer includes access to GPT-4, DALL-E, and Whisper APIs. Valid for 3 months from signup. Sign up at openai.com/developers"
              </p>
            </div>
            <button
              onClick={() => {
                setRawText("Get $500 in OpenAI API credits for new developers. This offer includes access to GPT-4, DALL-E, and Whisper APIs. Valid for 3 months from signup. Sign up at openai.com/developers");
                setMode('extract');
              }}
              className="mt-3 text-blue-400 hover:text-blue-300 text-sm transition-colors duration-200"
            >
              Use this example →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};