import React, { useMemo } from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import Dropdown from "../Dropdown"; // your existing modal dropdown

export default function LocationPickerLite({
  label = "Location",
  value = { country: "", state: "", city: "", zip: "" },
  onChange,
  required = true, // visual only here
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
  const selectedCountry = value?.country || "";
  const states = useMemo(
    () => (selectedCountry ? (statesByCountry[selectedCountry] || []) : []),
    [selectedCountry, statesByCountry]
  );

  const set = (patch) => onChange?.({ ...value, ...patch });

  return (
    <View style={{ marginTop: 12, marginBottom: 6 }}>
      <Text style={styles.sectionTitle}>{label}</Text>

      <Dropdown
        label="Country"
        items={countries}
        value={value.country}
        onSelect={(v) => set({ country: v, state: "" })}
      />

      <Dropdown
        label="State"
        disabled={!selectedCountry}
        items={states.map((s) => ({ id: s, label: s }))}
        value={value.state}
        onSelect={(v) => set({ state: v })}
      />

      <TextInput
        placeholder="City"
        value={value.city}
        onChangeText={(t) => set({ city: t })}
        style={styles.input}
      />

      <TextInput
        placeholder="Zip / Postal Code"
        value={value.zip}
        onChangeText={(t) => set({ zip: t })}
        style={styles.input}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 14, fontWeight: "600", color: "#374151", marginBottom: 8,
  },
  input: {
    width: "100%", height: 48, borderColor: "#e5e7eb", borderWidth: 1,
    borderRadius: 12, marginBottom: 10, paddingHorizontal: 14, fontSize: 16,
    backgroundColor: "#fff",
  },
});
