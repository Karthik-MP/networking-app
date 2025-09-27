import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

export default function SectionCard({ title, onEdit, children, right }) {
  return (
    <View className="bg-gray-50 rounded-2xl p-4 mb-4">
      <View className="flex-row items-center justify-between mb-2">
        <Text className="text-gray-900 font-semibold">{title}</Text>
        <View className="flex-row items-center gap-3">
          {right}
          {onEdit && (
            <TouchableOpacity onPress={onEdit} className="px-3 py-1.5 rounded-xl bg-gray-200">
              <Text className="text-gray-800 font-medium">Edit</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
      {children}
    </View>
  );
}
