// client/components/profile/ProgressHeader.jsx
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function ProgressHeader({ title, percent, saving, onClose }) {
  return (
    <View className="px-4 pb-3 border-b border-gray-100 bg-white">
      <View className="flex-row items-center justify-between">
        <TouchableOpacity onPress={onClose} className="p-1 -ml-2">
          <Ionicons name="arrow-back" size={22} />
        </TouchableOpacity>
        <Text className="text-lg font-semibold">{title}</Text>
        <View className="w-6" />
      </View>
      <View className="mt-3">
        <View className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <View className="h-2 bg-blue-600" style={{ width: `${percent}%` }} />
        </View>
        <View className="flex-row justify-between mt-1">
          <Text className="text-xs text-gray-500">{percent}% Complete</Text>
          {saving ? <Text className="text-xs text-gray-500">Saving…</Text> : null}
        </View>
      </View>
    </View>
  );
}
