// client/components/profile/PhoneInput.jsx
import React, { useState } from "react";
import { View, TextInput, Text } from "react-native";
import Dropdown from "../Dropdown";

const CODES = [
  { id: "+1", label: "+1 (US/CA)" },
  { id: "+91", label: "+91 (IN)" },
  { id: "+44", label: "+44 (UK)" },
];

export default function PhoneInput({ value, onChange }) {
  const [local, setLocal] = useState(value?.number || "");
  return (
    <View className="flex-row items-center gap-3">
      <View className="w-40">
        <Dropdown
          label="Code"
          items={CODES}
          value={value?.country_code || "+1"}
          disabled={true}
          onSelect={(v)=>onChange({ ...value, country_code: v, number: local })}
        />
      </View>
      <View className="flex-1">
        <Text className="text-gray-700 mb-1">Phone</Text>
        <View className="bg-gray-100 border border-gray-200 rounded-2xl px-4 py-3">
          <TextInput
            keyboardType="phone-pad"
            placeholder="Number"
            value={value?.number}
            editable={false} // <-- This disables editing
          />
        </View>
      </View>
    </View>
  );
}
