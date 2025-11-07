// theme.js

// Light theme (navigation-compatible + Tailwind classes)
export const LightTheme = {
  dark: false,

  // 👇 React Navigation theme shape
  colors: {
    primary: "#8b5cf6",      // violet-600
    background: "#f8fafc",   // slate-50
    card: "#ffffff",         // white
    text: "#020617",         // slate-950
    border: "#e5e7eb",       // gray-200
    notification: "#f97316", // orange-400
    secondary: "#000000"
  },

  // 👇 Font weights
  fonts: {
    regular: { fontWeight: "400" },
    medium: { fontWeight: "500" },
    semibold: { fontWeight: "600" },
    bold: { fontWeight: "700" },
  },

  // 👇 Your existing structure for className usage
  backgroundColor: {
    primary: "bg-slate-50",        // app background
    secondary: "bg-white",         // sections
    cardPrimary: "bg-white",       // main cards
    cardSecondary: "bg-slate-100", // subtle cards
    buttonPrimary: "bg-violet-600",
    buttonSecondary: "bg-slate-200",
    input: "bg-white",
  },

  textColor: {
    primary: "text-slate-900",  // main headings
    secondary: "text-slate-800",
    tertiary: "text-slate-600",
    quaternary: "text-slate-500",
  },

  border: {
    primary: "border-slate-300",
  },
};

// Dark theme (navigation-compatible + Tailwind classes)
export const DarkTheme = {
  dark: true,

  // 👇 React Navigation theme shape
  colors: {
    primary: "#8b5cf6",      // violet-600
    background: "#020617",   // slate-950
    card: "#020617",         // same as bg for full-dark cards
    text: "#f9fafb",         // gray-50
    border: "#1f2937",       // gray-800
    notification: "#f97316", // orange-400
    secondary: "#fff"
  },

  // 👇 Font weights
  fonts: {
    regular: { fontWeight: "400" },
    medium: { fontWeight: "500" },
    semibold: { fontWeight: "600" },
    bold: { fontWeight: "700" },
  },

  // 👇 Your existing structure for className usage
  backgroundColor: {
    primary: "bg-slate-950",       // page background
    secondary: "bg-slate-900",     // sections
    cardPrimary: "bg-slate-900",   // main card (login block)
    cardSecondary: "bg-slate-800", // subtle cards
    buttonPrimary: "bg-violet-600",
    buttonSecondary: "bg-slate-800",
    input: "bg-slate-900",
  },

  textColor: {
    primary: "text-white",       // main headings
    secondary: "text-slate-100",
    tertiary: "text-slate-400",
    quaternary: "text-slate-500",
  },

  border: {
    primary: "border-slate-700",
  },
};
