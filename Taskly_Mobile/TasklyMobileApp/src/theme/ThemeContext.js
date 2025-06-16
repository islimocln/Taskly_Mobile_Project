import React, { createContext, useContext, useState } from 'react';

const themes = {
  light: {
    background: '#FCF6EC',
    card: '#fff',
    text: '#1A73E8',
    textSecondary: '#222',
    border: '#eee',
    icon: '#1A73E8',
    modalBg: 'rgba(0,0,0,0.2)',
    button: '#1A73E8',
    buttonText: '#fff',
  },
  dark: {
    background: '#181818',
    card: '#232323',
    text: '#90caf9',
    textSecondary: '#fff',
    border: '#333',
    icon: '#90caf9',
    modalBg: 'rgba(0,0,0,0.7)',
    button: '#90caf9',
    buttonText: '#181818',
  }
};

const ThemeContext = createContext();
export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const [mode, setMode] = useState('light');
  const toggleTheme = () => setMode(m => (m === 'light' ? 'dark' : 'light'));
  return (
    <ThemeContext.Provider value={{ theme: themes[mode], mode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}; 