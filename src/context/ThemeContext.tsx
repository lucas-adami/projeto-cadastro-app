import React, { createContext, useContext, useState, ReactNode } from "react";
import { MD3DarkTheme, MD3LightTheme } from "react-native-paper";

// Definindo tema customizado com cores vermelhas
const customLightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: "#d32f2f", // Vermelho principal
    primaryContainer: "#ffcdd2", // Vermelho claro para containers
    secondary: "#f44336", // Vermelho secundário
    secondaryContainer: "#ffebee", // Vermelho muito claro
    tertiary: "#e53935", // Vermelho terciário
    onPrimary: "#ffffff", // Texto branco sobre vermelho
    onPrimaryContainer: "#b71c1c", // Texto vermelho escuro sobre container
  },
};

const customDarkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: "#ef5350", // Vermelho mais claro para modo escuro
    primaryContainer: "#c62828", // Vermelho escuro para containers
    secondary: "#ff5722", // Vermelho laranja secundário
    secondaryContainer: "#bf360c", // Vermelho escuro secundário
    tertiary: "#ff1744", // Vermelho vibrante
    onPrimary: "#ffffff", // Texto branco sobre vermelho
    onPrimaryContainer: "#ffcdd2", // Texto vermelho claro sobre container
  },
};

type ThemeContextType = {
  isDarkMode: boolean;
  toggleTheme: () => void;
  theme: typeof customLightTheme;
};

const ThemeContext = createContext<ThemeContextType>({
  isDarkMode: false,
  toggleTheme: () => {},
  theme: customLightTheme,
});

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const theme = isDarkMode ? customDarkTheme : customLightTheme;

  const toggleTheme = () => setIsDarkMode((v) => !v);

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme, theme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useThemeMode = () => useContext(ThemeContext);
