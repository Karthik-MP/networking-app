import { DarkTheme, LightTheme } from "@constants/theme";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Appearance } from "react-native";

const STORAGE_KEY = "app_theme"; // 'light' | 'dark' | 'system'

export const ThemeContext = createContext({
  theme: LightTheme,
  scheme: "light", // 'light' | 'dark' | 'system'
  setScheme: (_s) => {},
  toggle: () => {},
});

export const ThemeProvider = ({ children, followSystemByDefault = true }) => {
  const [scheme, setSchemeState] = useState(
    followSystemByDefault ? "system" : "light"
  );
  const [system, setSystem] = useState(Appearance.getColorScheme() || "light");

  // react to system changes if scheme === 'system'
  useEffect(() => {
    const sub = Appearance.addChangeListener(({ colorScheme }) => {
      setSystem(colorScheme || "light");
    });
    return () => sub.remove();
  }, []);

  // load persisted preference
  useEffect(() => {
    (async () => {
      const saved = await AsyncStorage.getItem(STORAGE_KEY);
      if (saved) {
        setSchemeState(saved);
      }
    })();
  }, []);

  const setScheme = useCallback(async (value) => {
    setSchemeState(value);
    await AsyncStorage.setItem(STORAGE_KEY, value);
  }, []);

  const effective = scheme === "system" ? system : scheme;
  // console.log(scheme, effective)
  const theme = effective === "dark" ? DarkTheme : LightTheme;

  const toggle = useCallback(() => {
    setScheme((prev) => {
      const next =
        prev === "system"
          ? system === "dark"
            ? "light"
            : "dark"
          : prev === "dark"
            ? "light"
            : "dark";
      return next;
    });
  }, [setScheme, system]);

  const value = useMemo(
    () => ({ theme, scheme, setScheme, toggle }),
    [theme, scheme, setScheme, toggle]
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};
