import { ThemeContext } from "@contexts/ThemeContext";
import { useContext, useEffect } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useUserProfile } from "../../hooks/useUserProfile";
import LocationPicker from "../Location/LocationPicker";
import Select from "../Select";
import YearRangePicker from "./YearRangePicker";
import { useTheme } from "@hooks/useTheme";

export default function EducationEditor({ visible, onSave }) {
  const { profile } = useUserProfile();
  const { dark, backgroundColor, textColor, border } = useTheme(); // ✅ unified theme access

  const placeholderColor = dark ? "#6B7280" : "#9CA3AF";

  const baseInputClass = `border rounded-2xl px-4 py-3 mb-2 ${backgroundColor.input} ${border.primary}`;

  const { control, setValue, reset, watch, getValues } = useForm({
    defaultValues: {
      education: profile?.education?.length ? profile.education : [],
    },
    mode: "onChange",
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "education",
  });

  useEffect(() => {
    if (visible) {
      reset({
        education: profile?.education || [],
      });
    }
  }, [visible, profile, reset]);

  // Expose getValues to parent via onSave prop
  useEffect(() => {
    if (onSave && visible) {
      // This allows parent to call the function to get current form data
      onSave.current = () => getValues();
    }
  }, [onSave, getValues, visible]);

  const addRow = () =>
    append({
      degree: "Undergrad",
      university_name: "",
      location: { country: "", state: "", city: "", zip: "" },
      duration: { start_year: "", end_year: "" },
      gpa: { grade: "", scale: "4" },
    });

  return (
    <ScrollView
      contentContainerStyle={{ padding: 12 }}
      keyboardShouldPersistTaps="handled"
    >
      <View className="flex-1">
        {/* Add button if no fields */}
        {fields.length === 0 && (
          <TouchableOpacity
            onPress={addRow}
            className={`mb-4 px-4 py-3 rounded-2xl self-start border ${border.primary} ${backgroundColor.cardPrimary}`}
          >
            <Text className={`font-medium ${textColor.primary}`}>
              Add Education
            </Text>
          </TouchableOpacity>
        )}

        {fields.map((f, idx) => (
          <View key={f.id} className={`rounded-2xl p-3 mb-3`}>
            {/* Degree */}
            <Select
              label="Degree"
              items={[
                { id: "Undergrad", label: "Undergrad" },
                { id: "Grad", label: "Grad" },
              ]}
              value={watch(`education.${idx}.degree`) || "Undergrad"}
              onSelect={(v) =>
                setValue(`education.${idx}.degree`, v, { shouldDirty: true })
              }
            />

            {/* University name */}
            <Controller
              control={control}
              name={`education.${idx}.university_name`}
              rules={{ required: "University name is required" }}
              render={({ field: { onChange, value } }) => (
                <TextInput
                  placeholder="University name"
                  value={value}
                  onChangeText={onChange}
                  className={baseInputClass}
                  placeholderTextColor={placeholderColor}
                  style={{ color: dark ? "#f9fafb" : "#111827" }}
                />
              )}
            />

            {/* Location */}
            <LocationPicker
              control={control}
              setValue={setValue}
              watch={watch}
              namePrefix={`education.${idx}.location`}
              label="University Location"
              required
            />

            {/* Duration */}
            <YearRangePicker
              label="Duration"
              start={watch(`education.${idx}.duration.start_year`)}
              end={watch(`education.${idx}.duration.end_year`)}
              onChange={(s, e) => {
                setValue(`education.${idx}.duration.start_year`, s, {
                  shouldDirty: true,
                });
                setValue(`education.${idx}.duration.end_year`, e, {
                  shouldDirty: true,
                });
              }}
            />

            {/* GPA + Scale */}
            <View className="flex-row justify-between mt-2">
              <View className="flex-1 mr-2">
                <Text
                  className={`text-sm font-semibold mb-1 ${textColor.secondary}`}
                >
                  Grade
                </Text>
                <Controller
                  control={control}
                  name={`education.${idx}.gpa.grade`}
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      placeholder="GPA / Grade"
                      value={value}
                      onChangeText={onChange}
                      className={`${baseInputClass.replace(" mb-2", "")}`}
                      placeholderTextColor={placeholderColor}
                      style={{ color: dark ? "#f9fafb" : "#111827" }}
                    />
                  )}
                />
              </View>

              <View className="flex-1 ml-2">
                <Select
                  label="Scale"
                  items={[
                    { id: "4", label: "/4" },
                    { id: "10", label: "/10" },
                  ]}
                  value={watch(`education.${idx}.gpa.scale`) || "4"}
                  onSelect={(v) =>
                    setValue(`education.${idx}.gpa.scale`, v, {
                      shouldDirty: true,
                    })
                  }
                />
              </View>
            </View>

            {/* Add / Remove buttons */}
            <View className="flex-row justify-between mt-3">
              {idx === fields.length - 1 && (
                <TouchableOpacity
                  onPress={addRow}
                  className={`px-3 py-2 rounded-xl ${
                    dark ? "bg-slate-800" : "bg-gray-200"
                  }`}
                >
                  <Text className={`font-medium ${textColor.primary}`}>
                    Add another
                  </Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                onPress={() => remove(idx)}
                className={`ml-auto px-3 py-2 rounded-xl ${
                  dark ? "bg-red-900/40" : "bg-red-100"
                }`}
              >
                <Text className="text-red-500 font-medium">Remove</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
