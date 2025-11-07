// client/components/profile/PhoneInput.jsx
import { useEffect, useState } from "react";
import { Text, TextInput, View } from "react-native";
import Dropdown from "../Dropdown";
import { useTheme } from "@hooks/useTheme";

const CODES = [
  { id: "+1", label: "+1 (US/CA)" },
  { id: "+91", label: "+91 (IN)" },
  { id: "+44", label: "+44 (UK)" },
];
export default function PhoneInput({ value, onChange }) {
  const { dark, textColor, backgroundColor, border } = useTheme();
  const [local, setLocal] = useState(value?.number || "");

  // keep local in sync if parent changes value
  useEffect(() => {
    setLocal(value?.number || "");
  }, [value?.number]);

  const placeholderColor = dark ? "#6B7280" : "#9CA3AF";

  return (
    <View className="flex-row items-center gap-3">
      {/* Country Code Dropdown */}
      <View className="w-40">
        <Dropdown
          label="Code"
          items={CODES}
          value={value?.country_code || "+1"}
          disabled={true}
          onSelect={(v) =>
            onChange({ ...value, country_code: v, number: local })
          }
        />
      </View>

      {/* Phone Number (read-only for now) */}
      <View className="flex-1">
        <Text className={`mb-1 text-sm font-medium ${textColor.secondary}`}>
          Phone
        </Text>
        <View
          className={`rounded-2xl px-5 border ${backgroundColor.input} ${border.primary}`}
        >
          <TextInput
            keyboardType="phone-pad"
            placeholder="Number"
            value={value?.number}
            editable={false} // ⬅️ still read-only per your current logic
            placeholderTextColor={placeholderColor}
            className={`text-base ${textColor.primary}`}
          />
        </View>
      </View>
    </View>
  );
}
