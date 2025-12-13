import React from "react";
import { TouchableOpacity, Text } from "react-native";

export default function Button({ title, onPressFunction, type }) {
  return (
    <TouchableOpacity
      className={`px-8 py-3 rounded-full mt-2 self-center ${type}`}
      onPress={onPressFunction}
    >
      <Text className="text-white text-lg font-bold">{title}</Text>
    </TouchableOpacity>
  );
}
