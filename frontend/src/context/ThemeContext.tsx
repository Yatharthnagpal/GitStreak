'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

export type ThemeAccent = 'cyan' | 'emerald' | 'purple' | 'amber';

interface ThemeContextType {
  theme: ThemeAccent;
  setTheme: (theme: ThemeAccent) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'cyan',
  setTheme: () => {},
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeAccent>('cyan');

  useEffect(() => {
    const savedTheme = (localStorage.getItem('gitstreak_theme') as ThemeAccent) || 'cyan';
    setThemeState(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  const setTheme = (newTheme: ThemeAccent) => {
    setThemeState(newTheme);
    localStorage.setItem('gitstreak_theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
