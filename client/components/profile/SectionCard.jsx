import { useTheme } from "@hooks/useTheme";
import { Text, TouchableOpacity, View } from "react-native";

export default function SectionCard({ title, onEdit, children, right }) {
  const { textColor, border, backgroundColor } = useTheme();
  return (
    <View
      className={`rounded-3xl p-4 mb-4 border ${border.primary} ${backgroundColor.cardPrimary}`}
    >
      {/* Header Row */}
      <View className="flex-row items-center justify-between mb-2">
        <Text className={`text-lg font-semibold ${textColor.primary}`}>
          {title}
        </Text>

        <View className="flex-row items-center gap-3">
          {right}

          {onEdit && (
            <TouchableOpacity
              onPress={onEdit}
              className={`px-3 py-1.5 rounded-xl border ${border.primary} ${backgroundColor.cardSecondary}`}
            >
              <Text className={`font-medium ${textColor.secondary}`}>Edit</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Content */}
      {children}
    </View>
  );
}
