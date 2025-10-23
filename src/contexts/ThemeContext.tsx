import React, { useState, useEffect } from 'react';
import { themes, type Theme } from '../styles/designTokens';
import { ThemeContext } from './ThemeContextValue';
import { getLocalSettings, saveLocalSettings } from '../lib/localStorage';

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: Theme;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ 
  children, 
  defaultTheme = 'light' 
}) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    // Check localStorage for saved theme
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme') as Theme;
      if (saved && (saved === 'light' || saved === 'dark')) {
        return saved;
      }
      // Check system preference
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
      }
    }
    return defaultTheme;
  });

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', newTheme);
      saveLocalSettings({ theme: newTheme });
      document.documentElement.classList.toggle('dark', newTheme === 'dark');
    }
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.documentElement.classList.toggle('dark', theme === 'dark');
      // 환경설정에서 테마 불러오기
      const appSettings = getLocalSettings();
      if (appSettings.theme && appSettings.theme !== theme) {
        setThemeState(appSettings.theme);
      }
    }
  }, [theme]);

  const currentColors = themes[theme];

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme, currentColors }}>
      {children}
    </ThemeContext.Provider>
  );
};