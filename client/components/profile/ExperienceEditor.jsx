import { useEffect } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { useTheme } from "@hooks/useTheme";
import { useUserProfile } from "@hooks/useUserProfile";
import Dropdown from "../Dropdown";
import LocationPicker from "../Location/LocationPicker";
import YearRangePicker from "./YearRangePicker";
import { ScreenScroll } from "../layout/Screen";
const ROLES = [
  "Intern",
  "Junior",
  "Mid",
  "Senior",
  "Lead",
  "Manager",
  "Founder",
  "CEO",
  "CTO",
  "Other",
];

const INDUSTRIES = [
  { id: "it", label: "IT / Software" },
  { id: "finance", label: "Finance" },
  { id: "fashion", label: "Fashion" },
  { id: "healthcare", label: "Healthcare" },
  { id: "education", label: "Education" },
];

export default function ExperienceEditor({ visible }) {
  const { profile } = useUserProfile();
  const { dark, backgroundColor, textColor, border } = useTheme(); // ✅ unified theme

  const placeholderColor = dark ? "#6B7280" : "#9CA3AF";
  const baseInputClass = `border rounded-2xl px-4 py-3 mb-2 ${backgroundColor.input} ${border.primary}`;

  const { control, setValue, reset, watch } = useForm({
    defaultValues: { experience: profile?.experience || [] },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "experience",
  });

  useEffect(() => {
    if (visible) {
      reset({ experience: profile?.experience || [] });
    }
  }, [visible, profile?.experience, reset]);

  return (
    <ScreenScroll
      contentContainerStyle={{ padding: 12 }}
      keyboardShouldPersistTaps="handled"
    >
      <View className="flex-1">
        {fields.map((f, idx) => (
          <View
            key={f.id}
            className={`rounded-2xl p-3 mb-3`}
          >
            {/* Company name */}
            <Controller
              control={control}
              name={`experience.${idx}.company_name`}
              rules={{ required: "Company name is required" }}
              render={({ field: { onChange, value } }) => (
                <TextInput
                  placeholder="Company name"
                  value={value}
                  onChangeText={onChange}
                  placeholderTextColor={placeholderColor}
                  className={baseInputClass}
                  style={{ color: dark ? "#f9fafb" : "#111827" }}
                />
              )}
            />

            {/* Role / Position */}
            <Dropdown
              label="Role / Position"
              items={ROLES.map((r) => ({ id: r, label: r }))}
              value={watch(`experience.${idx}.role`) || "Senior"}
              onSelect={(v) =>
                setValue(`experience.${idx}.role`, v, { shouldDirty: true })
              }
            />

            {/* Industry */}
            <Dropdown
              label="Industry"
              items={INDUSTRIES}
              value={watch(`experience.${idx}.industry`) || "it"}
              onSelect={(v) =>
                setValue(`experience.${idx}.industry`, v, { shouldDirty: true })
              }
            />

            {/* Work Location */}
            <LocationPicker
              control={control}
              setValue={setValue}
              watch={watch}
              namePrefix={`experience.${idx}.location`}
              label="Work Location"
              required
            />

            {/* Duration */}
            <YearRangePicker
              label="Duration"
              start={watch(`experience.${idx}.duration.start_year`)}
              end={watch(`experience.${idx}.duration.end_year`)}
              onChange={(s, e) => {
                setValue(`experience.${idx}.duration.start_year`, s, {
                  shouldDirty: true,
                });
                setValue(`experience.${idx}.duration.end_year`, e, {
                  shouldDirty: true,
                });
              }}
            />

            {/* Remove Button */}
            <TouchableOpacity
              onPress={() => remove(idx)}
              className="mt-2 self-end px-3 py-2 rounded-xl"
              style={{
                backgroundColor: dark ? "#7f1d1d33" : "#fee2e2",
              }}
            >
              <Text className="text-red-500 font-medium">Remove</Text>
            </TouchableOpacity>
          </View>
        ))}

        {/* Add Experience */}
        <View className="flex-row justify-between mt-1">
          <TouchableOpacity
            onPress={() =>
              append({
                company_name: "",
                role: "Senior",
                industry: "it",
                location: { country: "", state: "", city: "", zip: "" },
                duration: { start_year: "", end_year: "" },
              })
            }
            className={`px-4 py-3 rounded-2xl border ${border.primary} ${backgroundColor.cardSecondary}`}
          >
            <Text className={`font-medium ${textColor.secondary}`}>
              Add Experience
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScreenScroll>
  );
}
