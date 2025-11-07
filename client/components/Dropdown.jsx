import { AntDesign } from "@expo/vector-icons";
import { useTheme } from "@hooks/useTheme";
import { useMemo, useState } from "react";
import {
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Dropdown({
  label,
  items = [],
  value,
  onSelect,
  placeholder = "Select...",
  disabled = false,
  containerClassName,
  labelClassName,
  fieldClassName,
  fieldTextClassName,
  placeholderTextColor,
}) {
  const { dark, backgroundColor, textColor, border } = useTheme();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");

  const selectedLabel = useMemo(
    () => items.find((i) => i.id === value)?.label ?? "",
    [items, value]
  );

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    return items.filter((i) => i.label.toLowerCase().includes(s));
  }, [q, items]);

  const phColor = placeholderTextColor ?? (dark ? "#6B7280" : "#9CA3AF");

  // unified field styles
  const fieldBase = `rounded-xl border px-4 py-3 flex-row items-center justify-between ${border.primary} ${backgroundColor.input}`;
  const textBase = `flex-1 mr-2 ${textColor.primary}`;
  const labelBase = `text-sm font-semibold mb-2 ${textColor.secondary}`;

  return (
    <View className={containerClassName}>
      {label ? (
        <Text className={labelClassName ?? labelBase}>{label}</Text>
      ) : null}

      <TouchableOpacity
        disabled={disabled}
        onPress={() => setOpen(true)}
        className={`${fieldClassName ?? fieldBase} ${
          disabled ? "opacity-60" : ""
        }`}
        activeOpacity={0.7}
      >
        <Text
          className={fieldTextClassName ?? textBase}
          style={!selectedLabel ? { color: phColor } : undefined}
          numberOfLines={1}
        >
          {selectedLabel || placeholder}
        </Text>
        <AntDesign
          name="arrowright"
          size={16}
          color={dark ? "#94a3b8" : "#475569"}
        />
      </TouchableOpacity>

      {/* ---- Modal ---- */}
      <Modal
        visible={open}
        animationType="slide"
        onRequestClose={() => setOpen(false)}
      >
        <SafeAreaView
          style={[
            styles.flex1,
            { backgroundColor: dark ? "#0F172A" : "#FFFFFF" },
          ]}
        >
          {/* Header */}
          <View
            style={[
              styles.header,
              { borderBottomColor: dark ? "#334155" : "#E5E7EB" },
            ]}
          >
            <Text
              style={[
                styles.headerTitle,
                { color: dark ? "#E2E8F0" : "#111827" },
              ]}
            >
              {label || "Select"}
            </Text>
            <TouchableOpacity onPress={() => setOpen(false)}>
              <Text
                style={[styles.link, { color: dark ? "#60A5FA" : "#2563EB" }]}
              >
                Close
              </Text>
            </TouchableOpacity>
          </View>

          {/* Search */}
          <View style={styles.searchWrap}>
            <TextInput
              placeholder="Search..."
              value={q}
              onChangeText={setQ}
              placeholderTextColor={phColor}
              style={[
                styles.searchInput,
                {
                  backgroundColor: dark ? "#0B1220" : "#FFFFFF",
                  color: dark ? "#F1F5F9" : "#111827",
                  borderColor: dark ? "#334155" : "#E5E7EB",
                },
              ]}
            />
          </View>

          {/* List */}
          <FlatList
            data={filtered}
            keyExtractor={(item) => String(item.id)}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => {
                  onSelect?.(item.id);
                  setOpen(false);
                  setQ("");
                }}
                style={[
                  styles.row,
                  { backgroundColor: dark ? "#0F172A" : "#FFFFFF" },
                ]}
              >
                <Text style={{ color: dark ? "#E5E7EB" : "#111827" }}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            )}
            ItemSeparatorComponent={() => (
              <View
                style={{
                  height: 1,
                  backgroundColor: dark ? "#334155" : "#F1F5F9",
                }}
              />
            )}
          />
        </SafeAreaView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  flex1: { flex: 1 },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  headerTitle: { fontSize: 16, fontWeight: "700" },
  link: { fontWeight: "600" },

  searchWrap: { paddingHorizontal: 16, paddingVertical: 8 },
  searchInput: {
    height: 48,
    borderRadius: 12,
    paddingHorizontal: 14,
    fontSize: 16,
    borderWidth: 1,
  },
  row: { paddingHorizontal: 16, paddingVertical: 14 },
});
