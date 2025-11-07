// components/layout/Screen.jsx
import React, { memo } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, ScrollView, StyleSheet } from "react-native";
import { useTheme } from "@hooks/useTheme";
import { LinearGradient } from "expo-linear-gradient";

/** Full-screen background (gradient in dark, white in light) */
function ThemedBackgroundBase({ children }) {
  const { dark } = useTheme();
  if (dark) {
    return (
      <LinearGradient
        colors={["#0B0F14", "#0F172A"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={StyleSheet.absoluteFill}
      >
        {children}
      </LinearGradient>
    );
  }
  return (
    <View style={[StyleSheet.absoluteFill, { backgroundColor: "#FFFFFF" }]}>
      {children}
    </View>
  );
}

export const ThemedBackground = memo(ThemedBackgroundBase);

/** Non-scroll screen with safe area + background */
export function Screen({ children, className, contentClassName }) {
  return (
    <SafeAreaView className={`flex-1 ${className || ""}`}>
      <ThemedBackgroundBase />
      <View className={`flex-1 ${contentClassName || ""}`}>{children}</View>
    </SafeAreaView>
  );
}

/** Scrollable screen with safe area + background */
export function ScreenScroll({
  children,
  className,
  contentClassName,
  contentContainerClassName,
  keyboardShouldPersistTaps = "handled",
}) {
  return (
    <SafeAreaView className={`flex-1 ${className || ""}`}>
      {/* <ThemedBackgroundBase /> */}
      <ScrollView
        className={`flex-1 ${contentClassName || ""}`}
        contentContainerStyle={{}}
        contentContainerClassName={contentContainerClassName}
        keyboardShouldPersistTaps={keyboardShouldPersistTaps}
      >
        {children}
      </ScrollView>
    </SafeAreaView>
  );
}
