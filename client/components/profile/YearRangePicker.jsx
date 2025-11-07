import { Text, TextInput, View } from "react-native";
import { useTheme } from "@hooks/useTheme"; // ✅ new unified theme hook

export default function YearRangePicker({ label, start, end, onChange }) {
  const { dark, textColor, backgroundColor, border } = useTheme();

  const placeholderColor = dark ? "#6B7280" : "#9CA3AF";

  return (
    <View className="mt-3">
      {label && (
        <Text className={`text-sm font-semibold mb-2 ${textColor.secondary}`}>
          {label}
        </Text>
      )}

      <View className="flex-row gap-3">
        {/* Start Year */}
        <TextInput
          placeholder="Start Year"
          value={start}
          onChangeText={(t) => onChange?.(t, end)}
          keyboardType="numeric"
          placeholderTextColor={placeholderColor}
          className={`flex-1 rounded-2xl px-4 py-3 border ${backgroundColor.input} ${textColor.primary} ${border.primary}`}
        />

        {/* End Year */}
        <TextInput
          placeholder="End Year"
          value={end}
          onChangeText={(t) => onChange?.(start, t)}
          keyboardType="numeric"
          placeholderTextColor={placeholderColor}
          className={`flex-1 rounded-2xl px-4 py-3 border ${backgroundColor.input} ${textColor.primary} ${border.primary}`}
        />
      </View>
    </View>
  );
}
