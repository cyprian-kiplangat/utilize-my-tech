import React from 'react';
import { Calendar, ExternalLink, Clock, CheckCircle, AlertTriangle, TrendingUp, Zap } from 'lucide-react';
import { Perk } from '../types';
import { motion } from 'framer-motion';

interface PerkCardProps {
  perk: Perk;
  onClick: () => void;
  showExpiryWarning?: boolean;
  priority?: 'high' | 'medium' | 'low';
}

export const PerkCard: React.FC<PerkCardProps> = ({ perk, onClick, showExpiryWarning = false, priority = 'medium' }) => {
  const getDaysUntilExpiry = () => {
    const now = new Date();
    const expiryDate = new Date(perk.expiryDate);
    return Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  };

  const getStatusConfig = () => {
    switch (perk.status) {
      case 'completed':
        return {
          color: 'text-emerald-400',
          bg: 'bg-emerald-500/20',
          border: 'border-emerald-500/30',
          icon: CheckCircle,
          gradient: 'from-emerald-500 to-teal-600'
        };
      case 'in-progress':
        return {
          color: 'text-yellow-400',
          bg: 'bg-yellow-500/20',
          border: 'border-yellow-500/30',
          icon: Clock,
          gradient: 'from-yellow-500 to-orange-500'
        };
      case 'expired':
        return {
          color: 'text-red-400',
          bg: 'bg-red-500/20',
          border: 'border-red-500/30',
          icon: AlertTriangle,
          gradient: 'from-red-500 to-orange-600'
        };
      default:
        return {
          color: 'text-blue-400',
          bg: 'bg-blue-500/20',
          border: 'border-blue-500/30',
          icon: Zap,
          gradient: 'from-blue-500 to-indigo-600'
        };
    }
  };

  const getPriorityBorder = () => {
    switch (priority) {
      case 'high':
        return 'border-red-500/50 hover:border-red-400/70';
      case 'medium':
        return 'border-blue-500/30 hover:border-blue-400/50';
      case 'low':
        return 'border-green-500/30 hover:border-green-400/50';
      default:
        return 'border-white/10 hover:border-white/20';
    }
  };

  const daysUntilExpiry = getDaysUntilExpiry();
  const isExpiringSoon = daysUntilExpiry <= 7 && daysUntilExpiry > 0;
  const statusConfig = getStatusConfig();
  const StatusIcon = statusConfig.icon;
  const progressPercentage = (Object.values(perk.progress).filter(Boolean).length / 4) * 100;

  return (
    <motion.div
      onClick={onClick}
      className={`relative group cursor-pointer`}
      whileHover={{ scale: 1.02, y: -5 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      {/* Glow Effect */}
      <div className={`absolute -inset-0.5 bg-gradient-to-r ${statusConfig.gradient} rounded-3xl blur opacity-20 group-hover:opacity-40 transition-opacity duration-300`} />
      
      {/* Main Card */}
      <div className={`relative bg-black/40 backdrop-blur-xl border ${getPriorityBorder()} rounded-3xl p-6 transition-all duration-300 group-hover:bg-black/60`}>
        {/* Urgent Badge */}
        {isExpiringSoon && showExpiryWarning && (
          <motion.div 
            className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center shadow-lg"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <AlertTriangle size={12} className="text-white" />
          </motion.div>
        )}

        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-slate-300 group-hover:bg-clip-text transition-all duration-300">
              {perk.name}
            </h3>
            <p className="text-sm text-slate-400 mt-1 font-medium">{perk.provider}</p>
          </div>
          <div className="flex items-center space-x-2">
            {perk.link && (
              <motion.div
                whileHover={{ scale: 1.1, rotate: 15 }}
                className="p-2 bg-white/10 rounded-xl"
              >
                <ExternalLink size={16} className="text-slate-400 group-hover:text-white transition-colors duration-300" />
              </motion.div>
            )}
          </div>
        </div>

        {/* Value Badge */}
        {perk.value && (
          <div className="inline-block px-3 py-1 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 border border-emerald-500/30 rounded-full mb-4">
            <span className="text-emerald-400 font-bold text-sm">💰 {perk.value}</span>
          </div>
        )}

        {/* Description */}
        <p className="text-slate-300 text-sm mb-6 line-clamp-2 leading-relaxed">
          {perk.description}
        </p>

        {/* Status and Progress */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className={`flex items-center space-x-2 px-3 py-2 rounded-xl border ${statusConfig.bg} ${statusConfig.border}`}>
              <StatusIcon size={16} className={statusConfig.color} />
              <span className={`text-sm font-semibold ${statusConfig.color} capitalize`}>
                {perk.status.replace('-', ' ')}
              </span>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-500 uppercase tracking-wide">Progress</p>
              <p className="text-lg font-bold text-white">{Math.round(progressPercentage)}%</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="w-full bg-slate-800/50 rounded-full h-2 overflow-hidden">
              <motion.div
                className={`h-full bg-gradient-to-r ${statusConfig.gradient} rounded-full`}
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
              />
            </div>
            <div className="flex justify-between text-xs text-slate-500">
              <span>Start</span>
              <span>Maximize Value</span>
            </div>
          </div>
        </div>

        {/* Expiry Info */}
        <div className="mt-4 pt-4 border-t border-white/10">
          <div className="flex items-center space-x-2 text-sm">
            <Calendar size={14} className="text-slate-500" />
            <span className={`${isExpiringSoon ? 'text-red-400 font-semibold' : 'text-slate-400'}`}>
              {isExpiringSoon
                ? `⚠️ ${daysUntilExpiry} day${daysUntilExpiry === 1 ? '' : 's'} left!`
                : `Expires ${new Date(perk.expiryDate).toLocaleDateString()}`
              }
            </span>
          </div>
        </div>

        {/* ROI Indicator */}
        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="flex items-center space-x-1 px-2 py-1 bg-black/60 backdrop-blur-xl rounded-lg border border-white/20">
            <TrendingUp size={12} className="text-emerald-400" />
            <span className="text-xs text-emerald-400 font-semibold">ROI</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};