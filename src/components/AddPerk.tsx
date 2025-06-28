import React, { useState } from 'react';
import { Save, X, Calendar, Package, Link as LinkIcon, Tag, CheckCircle, Sparkles, TrendingUp } from 'lucide-react';
import { usePerks } from '../hooks/usePerks';
import { Perk } from '../types';
import { motion } from 'framer-motion';

interface AddPerkProps {
  onSuccess: () => void;
}

export const AddPerk: React.FC<AddPerkProps> = ({ onSuccess }) => {
  const { addPerk } = usePerks();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
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
      
      setFormData({
        name: '',
        description: '',
        link: '',
        expiryDate: '',
        category: '',
        provider: '',
        value: ''
      });

      setTimeout(() => {
        onSuccess();
      }, 2000);
      
    } catch (error) {
      console.error('Error adding perk:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const quickSuggestions = [
    { name: 'AWS Credits', category: 'Cloud Platform', value: '$1000', provider: 'Amazon Web Services', icon: '☁️' },
    { name: 'GitHub Copilot', category: 'AI Development Tool', value: '$10/month', provider: 'GitHub', icon: '⚡' },
    { name: 'Vercel Pro', category: 'Hosting Platform', value: '$20/month', provider: 'Vercel', icon: '🌐' },
    { name: 'OpenAI API Credits', category: 'AI Platform', value: '$500', provider: 'OpenAI', icon: '🤖' }
  ];

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
            Investment Added Successfully! 🎉
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
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Hero Section */}
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
              Acquire New Asset
            </h1>
            <p className="text-slate-400 text-lg">Add a valuable tech resource to your portfolio</p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Form */}
        <motion.div 
          className="lg:col-span-2"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <form onSubmit={handleSubmit} className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-3xl p-8 space-y-8">
            {/* Basic Info Section */}
            <div className="space-y-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                  <Package size={20} className="text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white">Asset Details</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-3">
                    Asset Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    disabled={isSubmitting}
                    className="w-full bg-black/40 border border-white/20 rounded-2xl px-6 py-4 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 disabled:opacity-50"
                    placeholder="e.g., AWS Credits, GitHub Copilot"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-3">
                    Provider
                  </label>
                  <input
                    type="text"
                    name="provider"
                    value={formData.provider}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                    className="w-full bg-black/40 border border-white/20 rounded-2xl px-6 py-4 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 disabled:opacity-50"
                    placeholder="e.g., Amazon, GitHub, Vercel"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-3">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  disabled={isSubmitting}
                  rows={4}
                  className="w-full bg-black/40 border border-white/20 rounded-2xl px-6 py-4 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 resize-none disabled:opacity-50"
                  placeholder="Describe the value and capabilities this asset provides..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-3">
                    Asset Value
                  </label>
                  <input
                    type="text"
                    name="value"
                    value={formData.value}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                    className="w-full bg-black/40 border border-white/20 rounded-2xl px-6 py-4 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 disabled:opacity-50"
                    placeholder="e.g., $100, 6 months free"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-3">
                    Expiry Date *
                  </label>
                  <input
                    type="date"
                    name="expiryDate"
                    value={formData.expiryDate}
                    onChange={handleInputChange}
                    required
                    disabled={isSubmitting}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full bg-black/40 border border-white/20 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 disabled:opacity-50"
                  />
                </div>
              </div>
            </div>

            {/* Category Selection */}
            <div className="space-y-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                  <Tag size={20} className="text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white">Category & Access</h3>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-3">
                  Category *
                </label>
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
                <label className="block text-sm font-semibold text-slate-300 mb-3">
                  Access Link
                </label>
                <div className="relative">
                  <LinkIcon size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-500" />
                  <input
                    type="url"
                    name="link"
                    value={formData.link}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                    className="w-full bg-black/40 border border-white/20 rounded-2xl pl-12 pr-6 py-4 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 disabled:opacity-50"
                    placeholder="https://platform.com/your-account"
                  />
                </div>
              </div>
            </div>

            {/* Actions */}
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
                onClick={() => setFormData({
                  name: '',
                  description: '',
                  link: '',
                  expiryDate: '',
                  category: '',
                  provider: '',
                  value: ''
                })}
                className="flex items-center space-x-2 px-6 py-4 text-slate-400 hover:text-slate-300 disabled:opacity-50 transition-colors duration-200"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <X size={18} />
                <span>Clear Form</span>
              </motion.button>
            </div>
          </form>
        </motion.div>

        {/* Quick Suggestions Sidebar */}
        <motion.div 
          className="space-y-6"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-3xl p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
                <TrendingUp size={20} className="text-white" />
              </div>
              <h3 className="text-xl font-bold text-white">Popular Assets</h3>
            </div>
            
            <div className="space-y-4">
              {quickSuggestions.map((suggestion, index) => (
                <motion.button
                  key={index}
                  disabled={isSubmitting}
                  onClick={() => setFormData(prev => ({
                    ...prev,
                    name: suggestion.name,
                    category: suggestion.category,
                    value: suggestion.value,
                    provider: suggestion.provider
                  }))}
                  className="w-full text-left p-4 bg-black/20 hover:bg-black/40 border border-white/10 hover:border-white/20 rounded-2xl transition-all duration-200 disabled:opacity-50 group"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                >
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">{suggestion.icon}</div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-white group-hover:text-blue-400 transition-colors duration-200">
                        {suggestion.name}
                      </h4>
                      <p className="text-sm text-slate-400">{suggestion.category}</p>
                      <p className="text-sm text-emerald-400 font-semibold">{suggestion.value}</p>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Pro Tips */}
          <div className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 border border-blue-500/30 rounded-3xl p-6">
            <h4 className="text-lg font-bold text-blue-400 mb-4">💡 Pro Tips</h4>
            <ul className="space-y-3 text-sm text-blue-200">
              <li className="flex items-start space-x-2">
                <span className="text-blue-400 mt-1">•</span>
                <span>Set expiry dates accurately to get timely reminders</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-blue-400 mt-1">•</span>
                <span>Include the monetary value to track your portfolio worth</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-blue-400 mt-1">•</span>
                <span>Add direct links for quick access when you need them</span>
              </li>
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  );
};