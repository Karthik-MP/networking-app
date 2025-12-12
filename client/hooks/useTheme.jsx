// hooks/useTheme.ts
import { LightTheme } from "@constants/theme";
import { ThemeContext } from "@contexts/ThemeContext";
import { useContext } from "react";

export const useTheme = () => {
  const context = useContext(ThemeContext);

  // Provide a fallback during initial render
  if (!context) {
    // console.warn("useTheme: ThemeContext is undefined. Using LightTheme as fallback.");
    return {
      dark: false,
      colors: LightTheme.colors,
      backgroundColor: LightTheme.backgroundColor,
      textColor: LightTheme.textColor,
      border: LightTheme.border,
      theme: LightTheme,
      scheme: "light",
      setScheme: () => {},
      toggle: () => {},
    };
  }

  const { theme, scheme, setScheme, toggle } = context;

  if (!theme) {
    // console.warn("useTheme: theme is undefined in context. Using LightTheme as fallback.");
    return {
      dark: false,
      colors: LightTheme.colors,
      backgroundColor: LightTheme.backgroundColor,
      textColor: LightTheme.textColor,
      border: LightTheme.border,
      theme: LightTheme,
      scheme: scheme || "light",
      setScheme: setScheme || (() => {}),
      toggle: toggle || (() => {}),
    };
  }

  return {
    dark: theme.dark,
    colors: theme.colors,
    backgroundColor: theme.backgroundColor,
    textColor: theme.textColor,
    border: theme.border,
    theme,
    scheme,
    setScheme,
    toggle,
  };
};
