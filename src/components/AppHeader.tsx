import React from 'react';
import { motion } from 'framer-motion';
import { ThemeToggle } from './ui';

interface AppHeaderProps {
  title?: string;
  subtitle?: string;
}

const AppHeader: React.FC<AppHeaderProps> = ({ 
  title = "공정한 팀 배정기",
  subtitle = "팀 배정, 기록 관리, 시각화까지 한 번에!"
}) => (
  <motion.header 
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
    className="w-full py-8 flex flex-col items-center relative bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 mb-8 rounded-3xl shadow-xl border border-white/20"
  >
    {/* Theme Toggle */}
    <div className="absolute top-4 right-4">
      <ThemeToggle />
    </div>

    {/* Main Content */}
    <motion.div 
      className="flex items-center gap-3 mb-3"
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.2, duration: 0.4 }}
    >
      <motion.span 
        className="text-4xl filter drop-shadow-lg"
        animate={{ 
          rotate: [0, -10, 10, -10, 0],
          scale: [1, 1.1, 1]
        }}
        transition={{ 
          duration: 2, 
          repeat: Infinity, 
          repeatDelay: 5,
          ease: "easeInOut"
        }}
      >
        🏆
      </motion.span>
      <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
        {title}
      </h1>
    </motion.div>
    
    <motion.p 
      className="text-gray-600 dark:text-gray-300 text-sm md:text-base text-center max-w-md"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.4, duration: 0.4 }}
    >
      {subtitle}
    </motion.p>

    {/* Decorative Elements */}
    <div className="absolute inset-0 overflow-hidden rounded-3xl">
      <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-xl"></div>
      <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-to-br from-indigo-400/20 to-blue-400/20 rounded-full blur-xl"></div>
    </div>
  </motion.header>
);

export default AppHeader;