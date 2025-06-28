import React, { useState } from 'react';
import { Settings, Target, Bell, TrendingUp, Shield, Zap, Calendar, DollarSign, AlertTriangle, CheckCircle, BarChart3, PieChart } from 'lucide-react';
import { motion } from 'framer-motion';
import { usePerks } from '../hooks/usePerks';

export const PortfolioConfig: React.FC = () => {
  const { perks } = usePerks();
  const [activeTab, setActiveTab] = useState('overview');

  // Calculate portfolio metrics
  const totalValue = perks.reduce((sum, perk) => {
    if (perk.value) {
      const numericValue = parseFloat(perk.value.replace(/[^0-9.]/g, ''));
      return sum + (isNaN(numericValue) ? 0 : numericValue);
    }
    return sum;
  }, 0);

  const completionRate = Math.round((perks.filter(p => p.status === 'completed').length / Math.max(perks.length, 1)) * 100);
  const expiringCount = perks.filter(perk => {
    const now = new Date();
    const expiryDate = new Date(perk.expiryDate);
    const daysUntilExpiry = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= 7 && daysUntilExpiry > 0;
  }).length;

  const tabs = [
    { id: 'overview', label: 'Portfolio Overview', icon: BarChart3 },
    { id: 'alerts', label: 'Smart Alerts', icon: Bell },
    { id: 'goals', label: 'Investment Goals', icon: Target },
    { id: 'security', label: 'Data Security', icon: Shield },
  ];

  const renderOverview = () => (
    <div className="space-y-8">
      {/* Portfolio Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div 
          className="bg-gradient-to-br from-emerald-900/20 to-teal-900/20 border border-emerald-500/30 rounded-2xl p-6"
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
              <DollarSign size={24} className="text-white" />
            </div>
            <div>
              <p className="text-emerald-400 font-semibold">Total Portfolio Value</p>
              <p className="text-3xl font-black text-white">${totalValue.toLocaleString()}</p>
            </div>
          </div>
          <p className="text-emerald-300 text-sm">Across {perks.length} active assets</p>
        </motion.div>

        <motion.div 
          className="bg-gradient-to-br from-blue-900/20 to-indigo-900/20 border border-blue-500/30 rounded-2xl p-6"
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
              <TrendingUp size={24} className="text-white" />
            </div>
            <div>
              <p className="text-blue-400 font-semibold">ROI Achievement</p>
              <p className="text-3xl font-black text-white">{completionRate}%</p>
            </div>
          </div>
          <p className="text-blue-300 text-sm">Value realization rate</p>
        </motion.div>

        <motion.div 
          className="bg-gradient-to-br from-red-900/20 to-orange-900/20 border border-red-500/30 rounded-2xl p-6"
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-orange-600 rounded-xl flex items-center justify-center">
              <AlertTriangle size={24} className="text-white" />
            </div>
            <div>
              <p className="text-red-400 font-semibold">At Risk Assets</p>
              <p className="text-3xl font-black text-white">{expiringCount}</p>
            </div>
          </div>
          <p className="text-red-300 text-sm">Expiring within 7 days</p>
        </motion.div>
      </div>

      {/* Category Breakdown */}
      <div className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
        <h3 className="text-2xl font-bold text-white mb-6">Asset Allocation</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from(new Set(perks.map(p => p.category))).map((category, index) => {
            const categoryPerks = perks.filter(p => p.category === category);
            const categoryValue = categoryPerks.reduce((sum, perk) => {
              if (perk.value) {
                const numericValue = parseFloat(perk.value.replace(/[^0-9.]/g, ''));
                return sum + (isNaN(numericValue) ? 0 : numericValue);
              }
              return sum;
            }, 0);
            const percentage = totalValue > 0 ? Math.round((categoryValue / totalValue) * 100) : 0;

            return (
              <div key={category} className="bg-black/20 border border-white/10 rounded-2xl p-4">
                <h4 className="font-semibold text-white text-sm mb-2">{category}</h4>
                <p className="text-2xl font-bold text-blue-400">{percentage}%</p>
                <p className="text-xs text-slate-400">{categoryPerks.length} assets</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  const renderAlerts = () => (
    <div className="space-y-6">
      <div className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
        <h3 className="text-2xl font-bold text-white mb-6">Intelligent Alert System</h3>
        
        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 bg-black/20 border border-white/10 rounded-2xl">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-orange-600 rounded-xl flex items-center justify-center">
                <AlertTriangle size={20} className="text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-white">Expiry Warnings</h4>
                <p className="text-sm text-slate-400">Get notified 7, 3, and 1 day before expiry</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 bg-black/20 border border-white/10 rounded-2xl">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                <TrendingUp size={20} className="text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-white">ROI Opportunities</h4>
                <p className="text-sm text-slate-400">Suggestions to maximize underutilized assets</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 bg-black/20 border border-white/10 rounded-2xl">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                <CheckCircle size={20} className="text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-white">Achievement Milestones</h4>
                <p className="text-sm text-slate-400">Celebrate when you complete asset utilization</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  const renderGoals = () => (
    <div className="space-y-6">
      <div className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
        <h3 className="text-2xl font-bold text-white mb-6">Investment Goals & Targets</h3>
        
        <div className="space-y-6">
          <div className="p-6 bg-gradient-to-br from-purple-900/20 to-pink-900/20 border border-purple-500/30 rounded-2xl">
            <h4 className="text-lg font-semibold text-purple-400 mb-4">Monthly ROI Target</h4>
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <div className="flex justify-between text-sm text-slate-400 mb-2">
                  <span>Current: 75%</span>
                  <span>Target: 90%</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-3">
                  <div className="bg-gradient-to-r from-purple-500 to-pink-600 h-3 rounded-full" style={{ width: '75%' }}></div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-white">75%</p>
                <p className="text-xs text-slate-400">Completion</p>
              </div>
            </div>
          </div>

          <div className="p-6 bg-gradient-to-br from-blue-900/20 to-indigo-900/20 border border-blue-500/30 rounded-2xl">
            <h4 className="text-lg font-semibold text-blue-400 mb-4">Portfolio Value Goal</h4>
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <div className="flex justify-between text-sm text-slate-400 mb-2">
                  <span>Current: ${totalValue.toLocaleString()}</span>
                  <span>Target: $10,000</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-3">
                  <div className="bg-gradient-to-r from-blue-500 to-indigo-600 h-3 rounded-full" style={{ width: `${Math.min((totalValue / 10000) * 100, 100)}%` }}></div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-white">{Math.round((totalValue / 10000) * 100)}%</p>
                <p className="text-xs text-slate-400">of Goal</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSecurity = () => (
    <div className="space-y-6">
      <div className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
        <h3 className="text-2xl font-bold text-white mb-6">Data Security & Privacy</h3>
        
        <div className="space-y-6">
          <div className="p-6 bg-gradient-to-br from-green-900/20 to-emerald-900/20 border border-green-500/30 rounded-2xl">
            <div className="flex items-center space-x-3 mb-4">
              <Shield size={24} className="text-green-400" />
              <h4 className="text-lg font-semibold text-green-400">Local Storage Only</h4>
            </div>
            <p className="text-slate-300 mb-4">Your portfolio data is stored locally in your browser. We never transmit or store your sensitive information on our servers.</p>
            <div className="flex items-center space-x-2 text-sm text-green-300">
              <CheckCircle size={16} />
              <span>✓ End-to-end privacy</span>
            </div>
          </div>

          <div className="p-6 bg-black/20 border border-white/10 rounded-2xl">
            <h4 className="text-lg font-semibold text-white mb-4">Data Management</h4>
            <div className="space-y-3">
              <button className="w-full p-3 bg-blue-600 hover:bg-blue-700 rounded-xl text-white font-medium transition-colors duration-200">
                Export Portfolio Data
              </button>
              <button className="w-full p-3 bg-slate-700 hover:bg-slate-600 rounded-xl text-white font-medium transition-colors duration-200">
                Import Portfolio Data
              </button>
              <button className="w-full p-3 bg-red-600 hover:bg-red-700 rounded-xl text-white font-medium transition-colors duration-200">
                Clear All Data
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

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
            className="w-16 h-16 bg-gradient-to-br from-slate-500 to-slate-600 rounded-2xl flex items-center justify-center shadow-2xl"
            whileHover={{ scale: 1.05, rotate: 5 }}
          >
            <Settings size={32} className="text-white" />
          </motion.div>
          <div className="text-left">
            <h1 className="text-4xl font-black bg-gradient-to-r from-slate-300 to-slate-400 bg-clip-text text-transparent">
              Portfolio Configuration
            </h1>
            <p className="text-slate-400 text-lg">Optimize your investment management experience</p>
          </div>
        </div>
      </motion.div>

      {/* Tab Navigation */}
      <div className="flex flex-wrap justify-center gap-2">
        {tabs.map((tab, index) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-3 px-6 py-3 rounded-2xl transition-all duration-300 ${
                isActive
                  ? 'bg-white/10 text-white shadow-2xl backdrop-blur-xl border border-white/20'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Icon size={18} />
              <span className="font-semibold">{tab.label}</span>
            </motion.button>
          );
        })}
      </div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'alerts' && renderAlerts()}
        {activeTab === 'goals' && renderGoals()}
        {activeTab === 'security' && renderSecurity()}
      </motion.div>
    </div>
  );
};