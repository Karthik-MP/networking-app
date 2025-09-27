import React from "react";
import { TouchableOpacity, Text } from "react-native";

export default function Button({ title, type = "primary", onPressFunction }) {
  // Define a mapping of type to Tailwind classes
  const typeStyles = {
    primary: "bg-[#137fec]",
    secondary: "bg-gray-500",
    warning: "bg-yellow-500",
    success: "bg-green-500",
    error: "bg-red-500",
  };

  const backgroundColorClass = typeStyles[type] || typeStyles.primary;

  return (
    <TouchableOpacity
      className={`${backgroundColorClass} px-8 py-4 rounded-full mt-10 self-center`}
      onPress={onPressFunction}
    >
      <Text className="text-white text-lg font-bold">{title}</Text>
    </TouchableOpacity>
  );
}
