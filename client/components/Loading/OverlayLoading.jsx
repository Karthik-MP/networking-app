import { ThemeContext } from "@contexts/ThemeContext";
import { useContext } from "react";
import { ActivityIndicator, View } from "react-native";

export function OverlayLoading() {
  const { theme } = useContext(ThemeContext);

  return (
    <View
      className="absolute inset-0 justify-center items-center"
      style={{
        backgroundColor: theme.dark
          ? "rgba(0,0,0,0.5)"
          : "rgba(255,255,255,0.5)",
      }}
    >
      <ActivityIndicator size="large" color={theme.colors.primary} />
    </View>
  );
}
