import { AntDesign } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useTheme } from "../hooks/useTheme"; // ✅ your theme hook

export default function Select({
  label,
  items = [],
  value,
  onSelect,
  placeholder = "Select...",
  disabled = false,
  containerClassName,
}) {
  const { dark, backgroundColor, textColor, border } = useTheme(); // ✅ useTheme integration
  const [open, setOpen] = useState(false);

  const selectedItem = useMemo(
    () => items.find((i) => i.id === value),
    [items, value]
  );

  const placeholderColor = dark ? "#9CA3AF" : "#6B7280";

  const handleSelect = (id) => {
    onSelect?.(id);
    setOpen(false);
  };

  return (
    <View className={`relative ${containerClassName ?? "w-full mb-3"}`}>
      {/* Label */}
      {label ? (
        <Text className={`text-sm font-semibold mb-1 ${textColor.secondary}`}>
          {label}
        </Text>
      ) : null}

      {/* Field */}
      <TouchableOpacity
        disabled={disabled}
        onPress={() => !disabled && setOpen((prev) => !prev)}
        activeOpacity={0.8}
        className={`flex-row items-center justify-between rounded-xl border px-4 py-3 ${backgroundColor.input} ${border.primary} ${
          disabled ? "opacity-60" : ""
        }`}
      >
        <Text
          numberOfLines={1}
          className={`flex-1 mr-2 text-base ${
            selectedItem ? textColor.primary : ""
          }`}
          style={!selectedItem ? { color: placeholderColor } : undefined}
        >
          {selectedItem?.label || placeholder}
        </Text>

        <AntDesign
          name={open ? "up" : "down"}
          size={14}
          color={dark ? "#94a3b8" : "#475569"}
        />
      </TouchableOpacity>

      {/* Dropdown list */}
      {open && (
        <View
          className={`absolute top-[100%] left-0 right-0 mt-2 z-50 rounded-xl border shadow-lg ${backgroundColor.cardPrimary} ${border.primary}`}
        >
          <ScrollView style={{ maxHeight: 220 }} nestedScrollEnabled>
            {items.map((item) => {
              const isActive = item.id === value;
              return (
                <TouchableOpacity
                  key={String(item.id)}
                  onPress={() => handleSelect(item.id)}
                  className={`px-4 py-3 ${
                    isActive ? (dark ? "bg-slate-800" : "bg-gray-100") : ""
                  }`}
                >
                  <Text
                    className={`text-base ${
                      isActive ? textColor.primary : textColor.secondary
                    }`}
                  >
                    {item.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      )}
    </View>
  );
}
