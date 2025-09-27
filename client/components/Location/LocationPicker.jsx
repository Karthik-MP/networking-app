// client/components/profile/LocationPicker.jsx
import React, { useMemo } from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import { Controller } from "react-hook-form";
import Dropdown from "../Dropdown"; // <- same Dropdown you already have

/**
 * props:
 * - control, setValue, watch  -> from react-hook-form
 * - namePrefix                -> e.g., "native_location" or "foreign_residence"
 * - label                     -> section title (string)
 * - required                  -> boolean (default true)
 */
export default function LocationPicker({
  control,
  setValue,
  watch,
  namePrefix = "native_location",
  label = "Location",
  required = true
}) {
  const countries = [
    { id: "US", label: "United States" },
    { id: "IN", label: "India" },
    { id: "CA", label: "Canada" },
    { id: "UK", label: "United Kingdom" },
  ];
  const statesByCountry = {
    US: ["New York", "California", "Texas", "Massachusetts"],
    IN: ["Karnataka", "Maharashtra", "Tamil Nadu", "Telangana"],
    CA: ["Ontario", "Quebec", "British Columbia"],
    UK: ["England", "Scotland", "Wales"],
  };
  const selectedCountry = watch?.(`${namePrefix}.country`);
  const states = useMemo(
    () => (selectedCountry ? statesByCountry[selectedCountry] || [] : []),
    [selectedCountry, statesByCountry]
  );

  const requiredMsg = (f) => (required ? { required: `${f} is required` } : {});

  return (
    <View style={{ marginTop: 12, marginBottom: 6 }}>
      <Text style={styles.sectionTitle}>{label}</Text>

      {/* Country */}
      <Controller
        control={control}
        name={`${namePrefix}.country`}
        rules={requiredMsg("Country")}
        render={({ field: { value } }) => (
          <Dropdown
            label="Country"
            items={countries}
            value={value}
            onSelect={(v) => {
              setValue(`${namePrefix}.country`, v);
              setValue(`${namePrefix}.state`, ""); // reset state if country changes
            }}
          />
        )}
      />

      {/* State */}
      <Controller
        control={control}
        name={`${namePrefix}.state`}
        rules={requiredMsg("State")}
        render={({ field: { value } }) => (
          <Dropdown
            label="State"
            disabled={!selectedCountry}
            items={states.map((s) => ({ id: s, label: s }))}
            value={value}
            onSelect={(v) => setValue(`${namePrefix}.state`, v)}
          />
        )}
      />

      {/* City */}
      <Controller
        control={control}
        name={`${namePrefix}.city`}
        rules={requiredMsg("City")}
        render={({ field: { value, onChange } }) => (
          <TextInput
            placeholder="City"
            value={value}
            onChangeText={onChange}
            style={styles.input}
          />
        )}
      />

      {/* Zip */}
      <Controller
        control={control}
        name={`${namePrefix}.zip`}
        rules={{
          ...requiredMsg("Zip/Postal code"),
          pattern: {
            value: /^[A-Za-z0-9-\s]{3,10}$/,
            message: "Invalid zip/postal code",
          },
        }}
        render={({ field: { value, onChange } }) => (
          <TextInput
            placeholder="Zip / Postal Code"
            value={value}
            onChangeText={onChange}
            style={styles.input}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },
  input: {
    width: "100%",
    height: 48,
    borderColor: "#e5e7eb",
    borderWidth: 1,
    borderRadius: 12,
    marginBottom: 10,
    paddingHorizontal: 14,
    fontSize: 16,
    backgroundColor: "#fff",
  },
});
