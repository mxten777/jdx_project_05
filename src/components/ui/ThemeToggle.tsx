import React from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { themes } from '../../styles/designTokens';

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme, setTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className="flex items-center gap-2">
      <motion.button
        onClick={toggleTheme}
        className={`
          relative p-2 rounded-full transition-all duration-300
          ${isDark 
            ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700' 
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        `}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      >
        <motion.div
          initial={false}
          animate={{ rotate: isDark ? 180 : 0 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        >
          {isDark ? (
            <Moon className="w-5 h-5" />
          ) : (
            <Sun className="w-5 h-5" />
          )}
        </motion.div>
      </motion.button>
      <select
        value={theme}
        onChange={e => setTheme(e.target.value as keyof typeof themes)}
        className="ml-2 px-2 py-1 rounded border bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 focus:outline-none"
        aria-label="테마 선택"
      >
        {Object.keys(themes).map(key => (
          <option key={key} value={key}>{key === 'light' ? '라이트' : '다크'}</option>
        ))}
      </select>
    </div>
  );
};

export default ThemeToggle;