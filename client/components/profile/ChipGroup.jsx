import { useTheme } from "@hooks/useTheme"; // ✅ import your theme hook
import { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

export default function ChipGroup({
  options = [],
  value = [],
  onChange,
  multi = true,
  freeInput = false,
  placeholder = "Add item",
}) {
  const [custom, setCustom] = useState("");
  const { dark, backgroundColor, textColor, border } = useTheme(); // ✅ unified theme access

  const toggle = (id) => {
    if (multi) {
      onChange(
        value.includes(id) ? value.filter((v) => v !== id) : [...value, id]
      );
    } else {
      onChange([id]);
    }
  };

  const placeholderColor = dark ? "#6B7280" : "#9CA3AF";

  return (
    <View>
      {/* Option chips */}
      <View className="flex-row flex-wrap gap-2">
        {options.map((o) => {
          const selected = value.includes(o.id);
          return (
            <TouchableOpacity
              key={o.id}
              onPress={() => toggle(o.id)}
              className={`px-3 py-2 rounded-full border ${
                selected
                  ? "bg-violet-600 border-violet-600"
                  : `${backgroundColor.cardSecondary} ${border.primary}`
              }`}
            >
              <Text
                className={`text-sm ${
                  selected ? "text-white" : textColor.primary
                }`}
              >
                {o.label}
              </Text>
            </TouchableOpacity>
          );
        })}

        {/* Free text input + Add button */}
        {freeInput && (
          <View className="flex-row items-center gap-2 mt-3 w-full">
            <TextInput
              value={custom}
              onChangeText={setCustom}
              placeholder={placeholder}
              placeholderTextColor={placeholderColor}
              className={`flex-1 rounded-2xl border px-4 py-2 ${backgroundColor.input} ${border.primary} ${textColor.primary}`}
            />
            <TouchableOpacity
              onPress={() => {
                if (!custom.trim()) return;
                const id = custom.trim();
                onChange([...value, id]);
                setCustom("");
              }}
              className={`px-4 py-2 rounded-2xl ${backgroundColor.buttonSecondary}`}
            >
              <Text className={`font-medium ${textColor.primary}`}>Add</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Selected chips */}
      {value.length > 0 && (
        <View className="flex-row flex-wrap gap-2 mt-3">
          {value.map((v) => (
            <TouchableOpacity
              key={v.id || v}
              onPress={() => onChange(value.filter((x) => x !== v))}
              className={`px-3 py-2 rounded-full border ${backgroundColor.cardSecondary} ${border.primary}`}
            >
              <Text className={`text-sm ${textColor.secondary}`}>
                {v.label || v} ×
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}
