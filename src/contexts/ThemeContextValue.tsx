import { createContext } from 'react';
import type { Theme } from '../styles/designTokens';

export interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
  currentColors: typeof import('../styles/designTokens').themes.light | typeof import('../styles/designTokens').themes.dark;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);
