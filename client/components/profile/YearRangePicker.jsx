// client/components/profile/YearRangePicker.jsx
import React from "react";
import { View, Text, TextInput } from "react-native";

const years = Array.from({length: 60}, (_,i)=>String(1980 + i));

export default function YearRangePicker({ label, start, end, onChange }) {
  return (
    <View className="mt-1">
      {label ? <Text className="text-gray-700 mb-1">{label}</Text> : null}
      <View className="flex-row gap-3">
        <View className="flex-1">
          <TextInput
            placeholder="Start Year"
            value={start}
            onChangeText={(t)=>onChange(t, end)}
            keyboardType="numeric"
            className="bg-white border border-gray-200 rounded-2xl px-4 py-3"
            maxLength={4}
          />
        </View>
        <View className="flex-1">
          <TextInput
            placeholder="End Year"
            value={end}
            onChangeText={(t)=>onChange(start, t)}
            keyboardType="numeric"
            className="bg-white border border-gray-200 rounded-2xl px-4 py-3"
            maxLength={4}
          />
        </View>
      </View>
    </View>
  );
}
