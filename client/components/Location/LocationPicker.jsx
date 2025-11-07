import { useTheme } from "@hooks/useTheme";
import { useMemo } from "react";
import { Controller } from "react-hook-form";
import { Text, TextInput, View } from "react-native";
import Select from "../Select";
// ───────────────────────────────────────────────────────────
// Static data
// ───────────────────────────────────────────────────────────
const COUNTRIES = [
  { id: "US", label: "United States" },
  { id: "IN", label: "India" },
  { id: "CA", label: "Canada" },
  { id: "UK", label: "United Kingdom" },
];

const STATES_BY_COUNTRY = {
  US: ["New York", "California", "Texas", "Massachusetts"],
  IN: ["Karnataka", "Maharashtra", "Tamil Nadu", "Telangana"],
  CA: ["Ontario", "Quebec", "British Columbia"],
  UK: ["England", "Scotland", "Wales"],
};

export default function LocationPicker({
  control,
  setValue,
  watch,
  namePrefix = "native_location",
  label = "Location",
  required = true,
  containerClassName,
  labelClassName,
  inputWrapperClassName,
  inputTextClassName,
  placeholderTextColor,
}) {
  const { dark, backgroundColor, textColor, border } = useTheme();

  // ─────────────────────────────────────────────────────────
  // Styling defaults (now theme-based)
  // ─────────────────────────────────────────────────────────
  const inputWrapClass =
    inputWrapperClassName ??
    `rounded-xl px-4 border mb-2 ${backgroundColor.input} ${border.primary}`;

  const inputTextClass = inputTextClassName ?? `text-base ${textColor.primary}`;

  const labelTextClass =
    labelClassName ?? `text-sm font-semibold mb-2 ${textColor.secondary}`;

  const placeholderColor =
    placeholderTextColor ?? (dark ? "#6B7280" : "#9CA3AF");

  // ─────────────────────────────────────────────────────────
  // Dependent select data
  // ─────────────────────────────────────────────────────────
  const selectedCountry = watch?.(`${namePrefix}.country`);

  const stateItems = useMemo(() => {
    if (!selectedCountry) return [];
    const states = STATES_BY_COUNTRY[selectedCountry] || [];
    return states.map((s) => ({ id: s, label: s }));
  }, [selectedCountry]);

  const requiredRule = (field) =>
    required ? { required: `${field} is required` } : {};

  // ─────────────────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────────────────
  return (
    <View className={`mt-3 ${containerClassName || ""}`}>
      <Text className={labelTextClass}>{label}</Text>

      {/* Country */}
      <Controller
        control={control}
        name={`${namePrefix}.country`}
        rules={requiredRule("Country")}
        render={({ field: { value } }) => (
          <Select
            label="Country"
            items={COUNTRIES}
            value={value}
            onSelect={(v) => {
              setValue(`${namePrefix}.country`, v);
              setValue(`${namePrefix}.state`, ""); // reset state when country changes
            }}
          />
        )}
      />

      {/* State */}
      <Controller
        control={control}
        name={`${namePrefix}.state`}
        rules={requiredRule("State")}
        render={({ field: { value } }) => (
          <Select
            label="State"
            items={stateItems}
            value={value}
            disabled={!selectedCountry}
            onSelect={(v) => setValue(`${namePrefix}.state`, v)}
          />
        )}
      />

      {/* City */}
      <Controller
        control={control}
        name={`${namePrefix}.city`}
        rules={requiredRule("City")}
        render={({ field: { value, onChange } }) => (
          <View className={inputWrapClass}>
            <TextInput
              placeholder="City"
              value={value}
              onChangeText={onChange}
              className={inputTextClass}
              placeholderTextColor={placeholderColor}
              autoCapitalize="words"
            />
          </View>
        )}
      />

      {/* Zip / Postal Code */}
      <Controller
        control={control}
        name={`${namePrefix}.zip`}
        rules={{
          ...requiredRule("Zip/Postal code"),
          pattern: {
            value: /^[A-Za-z0-9-\s]{3,10}$/,
            message: "Invalid zip/postal code",
          },
        }}
        render={({ field: { value, onChange } }) => (
          <View className={inputWrapClass}>
            <TextInput
              placeholder="Zip / Postal Code"
              value={value}
              onChangeText={onChange}
              className={inputTextClass}
              placeholderTextColor={placeholderColor}
              autoCapitalize="characters"
            />
          </View>
        )}
      />
    </View>
  );
}
