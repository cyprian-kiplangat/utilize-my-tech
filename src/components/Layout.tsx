import React from 'react';
import { Home, Plus, Bot, Settings, TrendingUp, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

interface LayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onNavigate: (page: string) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, currentPage, onNavigate }) => {
  const navigationItems = [
    { id: 'dashboard', label: 'Portfolio', icon: TrendingUp, gradient: 'from-emerald-500 to-teal-600' },
    { id: 'add-perk', label: 'Acquire', icon: Plus, gradient: 'from-violet-500 to-purple-600' },
    { id: 'ai-assistant', label: 'Advisor', icon: Bot, gradient: 'from-orange-500 to-red-600' },
    { id: 'settings', label: 'Configure', icon: Settings, gradient: 'from-slate-500 to-slate-600' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-500/10 to-purple-600/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-emerald-500/10 to-teal-600/10 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>

      {/* Header */}
      <header className="relative z-10 bg-black/20 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Left side - Logo */}
            <motion.div 
              className="flex items-center space-x-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="relative">
                <motion.div 
                  className="w-12 h-12 bg-gradient-to-br from-emerald-400 via-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl"
                  whileHover={{ scale: 1.05, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Zap className="text-white" size={24} />
                </motion.div>
                <motion.div
                  className="absolute -inset-1 bg-gradient-to-br from-emerald-400 via-blue-500 to-purple-600 rounded-2xl blur opacity-30"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                />
              </div>
              <div>
                <h1 className="text-2xl font-black bg-gradient-to-r from-white via-emerald-200 to-blue-200 bg-clip-text text-transparent">
                  UtilizeMyTech
                </h1>
                <p className="text-xs text-emerald-400 font-medium tracking-wider uppercase">
                  Tech Investment Advisor
                </p>
              </div>
            </motion.div>

            {/* Center - Bolt.new Badge (Desktop) */}
            <div className="hidden lg:block">
              <motion.a 
                href="https://bolt.new/?rid=os72mi" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="block"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-3 shadow-2xl hover:bg-white/10 transition-all duration-300">
                  <img 
                    src="https://storage.bolt.army/logotext_poweredby_360w.png" 
                    alt="Powered by Bolt.new badge" 
                    className="h-6 w-auto opacity-90 hover:opacity-100 transition-opacity duration-300"
                  />
                </div>
              </motion.a>
            </div>
            
            {/* Right side - Desktop Navigation */}
            <nav className="hidden md:flex space-x-2">
              {navigationItems.map((item, index) => {
                const Icon = item.icon;
                const isActive = currentPage === item.id;
                return (
                  <motion.button
                    key={item.id}
                    onClick={() => onNavigate(item.id)}
                    className={`relative flex items-center space-x-3 px-6 py-3 rounded-2xl transition-all duration-300 group ${
                      isActive
                        ? 'bg-white/10 text-white shadow-2xl backdrop-blur-xl'
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {isActive && (
                      <motion.div
                        className={`absolute inset-0 bg-gradient-to-r ${item.gradient} rounded-2xl opacity-20`}
                        layoutId="activeTab"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                    <div className={`relative z-10 p-2 rounded-xl ${isActive ? `bg-gradient-to-r ${item.gradient}` : 'bg-white/10'} transition-all duration-300`}>
                      <Icon size={18} />
                    </div>
                    <span className="relative z-10 font-semibold tracking-wide">{item.label}</span>
                  </motion.button>
                );
              })}
            </nav>

            {/* Mobile Badge */}
            <div className="md:hidden">
              <motion.a 
                href="https://bolt.new/?rid=os72mi" 
                target="_blank" 
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-xl p-2 shadow-xl">
                  <img 
                    src="https://storage.bolt.army/logotext_poweredby_360w.png" 
                    alt="Powered by Bolt.new badge" 
                    className="h-4 w-auto opacity-90"
                  />
                </div>
              </motion.a>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {children}
        </motion.div>
      </main>

      {/* Mobile Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-20 bg-black/40 backdrop-blur-2xl border-t border-white/10">
        <div className="flex justify-around py-3">
          {navigationItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <motion.button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`flex flex-col items-center space-y-1 px-4 py-2 rounded-2xl transition-all duration-300 ${
                  isActive ? 'text-white' : 'text-slate-500 hover:text-slate-300'
                }`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className={`p-2 rounded-xl transition-all duration-300 ${
                  isActive ? `bg-gradient-to-r ${item.gradient}` : 'bg-white/10'
                }`}>
                  <Icon size={20} />
                </div>
                <span className="text-xs font-medium tracking-wide">{item.label}</span>
              </motion.button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};