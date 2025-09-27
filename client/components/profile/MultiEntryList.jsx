// client/components/profile/MultiEntryList.jsx
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

export default function MultiEntryList({
  title,
  emptyHint,
  entries,
  onAdd,
  renderItem,
}) {
  return (
    <View className="pb-4">
      <View className="flex-row items-center justify-between mb-2 px-1">
        <Text className="text-gray-900 font-semibold text-base">{title}</Text>
        <TouchableOpacity
          onPress={onAdd}
          className="px-3 py-2 rounded-xl bg-blue-600"
        >
          <Text className="text-white font-medium">Add</Text>
        </TouchableOpacity>
      </View>

      {entries.length === 0 ? (
        <View className="bg-gray-50 rounded-2xl p-4 border border-dashed border-gray-300">
          <Text className="text-gray-500">{emptyHint}</Text>
        </View>
      ) : (
        <View className="gap-3">
          {entries.map((item, idx) => {
            const update = (updated) => {
              const copy = [...entries];
              copy[idx] = updated;
              onAdd.__update(copy);
            };
            const remove = () => {
              const copy = entries.filter((_, i) => i !== idx);
              onAdd.__update(copy);
            };
            return (
              <View key={idx}>{renderItem(item, idx, update, remove)}</View>
            );
          })}
        </View>
      )}
    </View>
  );
}
