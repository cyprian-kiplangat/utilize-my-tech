import React from 'react';
import { PerkCard } from './PerkCard';
import { usePerks } from '../hooks/usePerks';
import { AlertTriangle, Zap, Play, CheckCircle, Loader, TrendingUp, DollarSign, Clock, Target } from 'lucide-react';
import { motion } from 'framer-motion';

interface DashboardProps {
  onPerkClick: (perkId: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onPerkClick }) => {
  const { categorizePerks, isLoaded, perks } = usePerks();
  
  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center py-16">
        <motion.div 
          className="flex items-center space-x-3 text-slate-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Loader size={24} className="animate-spin" />
          <span>Loading your tech portfolio...</span>
        </motion.div>
      </div>
    );
  }

  const { expiringSoon, unused, inProgress, completed } = categorizePerks();

  // Calculate total value
  const totalValue = perks.reduce((sum, perk) => {
    if (perk.value) {
      const numericValue = parseFloat(perk.value.replace(/[^0-9.]/g, ''));
      return sum + (isNaN(numericValue) ? 0 : numericValue);
    }
    return sum;
  }, 0);

  const stats = [
    {
      title: 'Portfolio Value',
      value: `$${totalValue.toLocaleString()}`,
      icon: DollarSign,
      gradient: 'from-emerald-500 to-teal-600',
      description: 'Total value of active perks'
    },
    {
      title: 'At Risk',
      value: expiringSoon.length,
      icon: AlertTriangle,
      gradient: 'from-red-500 to-orange-600',
      description: 'Expiring within 7 days'
    },
    {
      title: 'Untapped',
      value: unused.length,
      icon: Zap,
      gradient: 'from-blue-500 to-indigo-600',
      description: 'Ready to activate'
    },
    {
      title: 'ROI Achieved',
      value: `${Math.round((completed.length / Math.max(perks.length, 1)) * 100)}%`,
      icon: Target,
      gradient: 'from-purple-500 to-pink-600',
      description: 'Completion rate'
    },
  ];

  const sections = [
    {
      title: '🚨 Urgent Action Required',
      subtitle: 'These perks expire soon - act now!',
      perks: expiringSoon,
      icon: AlertTriangle,
      gradient: 'from-red-500 to-orange-600',
      priority: 'high'
    },
    {
      title: '⚡ Ready to Activate',
      subtitle: 'Untapped potential waiting for you',
      perks: unused,
      icon: Zap,
      gradient: 'from-blue-500 to-indigo-600',
      priority: 'medium'
    },
    {
      title: '🔄 In Progress',
      subtitle: 'Keep the momentum going',
      perks: inProgress,
      icon: Play,
      gradient: 'from-yellow-500 to-orange-500',
      priority: 'medium'
    },
    {
      title: '✅ Value Realized',
      subtitle: 'Successfully maximized perks',
      perks: completed,
      icon: CheckCircle,
      gradient: 'from-green-500 to-emerald-600',
      priority: 'low'
    },
  ];

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <motion.div 
        className="text-center space-y-6"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="space-y-4">
          <motion.h1 
            className="text-5xl md:text-6xl font-black bg-gradient-to-r from-emerald-400 via-blue-400 to-purple-400 bg-clip-text text-transparent"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Your Tech Investment Portfolio
          </motion.h1>
          <motion.p 
            className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Transform free trials and credits into <span className="text-emerald-400 font-semibold">real business value</span>. 
            Track, optimize, and maximize every opportunity before it expires.
          </motion.p>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div 
        className="grid grid-cols-2 lg:grid-cols-4 gap-6"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
      >
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.title}
              className="relative group"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-3xl p-6 hover:border-white/20 transition-all duration-300">
                <div className="flex items-center space-x-4">
                  <div className={`p-3 rounded-2xl bg-gradient-to-r ${stat.gradient} shadow-lg`}>
                    <Icon className="text-white" size={24} />
                  </div>
                  <div>
                    <p className="text-3xl font-black text-white">{stat.value}</p>
                    <p className="text-sm font-medium text-slate-400">{stat.title}</p>
                  </div>
                </div>
                <p className="text-xs text-slate-500 mt-3">{stat.description}</p>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Perk Sections */}
      {sections.map((section, sectionIndex) => {
        if (section.perks.length === 0) return null;

        const Icon = section.icon;
        return (
          <motion.div 
            key={section.title} 
            className="space-y-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.2 + sectionIndex * 0.2 }}
          >
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="flex items-center space-x-4">
                  <div className={`p-3 rounded-2xl bg-gradient-to-r ${section.gradient} shadow-lg`}>
                    <Icon className="text-white" size={24} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">{section.title}</h2>
                    <p className="text-slate-400">{section.subtitle}</p>
                  </div>
                </div>
              </div>
              <motion.div 
                className={`px-4 py-2 rounded-full bg-gradient-to-r ${section.gradient} text-white font-bold text-lg shadow-lg`}
                whileHover={{ scale: 1.05 }}
              >
                {section.perks.length}
              </motion.div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {section.perks.map((perk, index) => (
                <motion.div
                  key={perk.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <PerkCard
                    perk={perk}
                    onClick={() => onPerkClick(perk.id)}
                    showExpiryWarning={section.title.includes('Urgent')}
                    priority={section.priority}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        );
      })}

      {/* Empty State */}
      {sections.every(section => section.perks.length === 0) && (
        <motion.div 
          className="text-center py-20"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          <div className="w-32 h-32 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-full flex items-center justify-center mx-auto mb-8 backdrop-blur-xl border border-white/10">
            <TrendingUp size={48} className="text-blue-400" />
          </div>
          <h3 className="text-3xl font-bold text-white mb-4">Ready to Build Your Tech Portfolio?</h3>
          <p className="text-slate-400 text-lg mb-8 max-w-md mx-auto">
            Start tracking your free trials, credits, and perks to maximize their value before they expire.
          </p>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="inline-block px-8 py-4 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-2xl text-white font-bold text-lg shadow-2xl cursor-pointer">
              Add Your First Perk
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};