import React, { useEffect } from "react";
import { Modal, View, Text, TouchableOpacity, TextInput, ScrollView } from "react-native";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { useUserProfile } from "../../hooks/useUserProfile";
import LocationPicker from "../Location/LocationPicker";
import Dropdown from "../Dropdown";
import YearRangePicker from "./YearRangePicker";

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

export default function EducationEditor({ visible, onClose }) {
  const { profile, saveProfile } = useUserProfile();

  const { control, setValue, reset, watch, handleSubmit, trigger } = useForm({
    defaultValues: {
      education: profile?.education?.length
        ? profile.education
        : [], // start empty; section shows “Add” initially
    },
    mode: "onChange",
  });

  const { fields, append, remove } = useFieldArray({ control, name: "education" });

  useEffect(() => {
    if (visible) {
      reset({
        education: profile?.education || [],
      });
    }
  }, [visible]);

  const addRow = () =>
    append({
      degree: "Undergrad",
      university_name: "",
      location: { country: "", state: "", city: "", zip: "" },
      duration: { start_year: "", end_year: "" },
      gpa: { grade: "", scale: "4" },
    });

  const onSave = async (vals) => {
    // basic guard: require at least one row before saving
    if (!vals.education || vals.education.length === 0) {
      // if no rows, just clear on backend
      await saveProfile({ education: [] });
      onClose();
      return;
    }

    // validate required fields for each row
    // we also have RHF “rules”; this ensures duration/location presence too
    for (let i = 0; i < vals.education.length; i++) {
      const row = vals.education[i];
      if (!row.university_name?.trim()) {
        return alert(`Education #${i + 1}: University name is required`);
      }
      if (!row.location?.country) {
        return alert(`Education #${i + 1}: Country is required`);
      }
      if (!row.location?.state) {
        return alert(`Education #${i + 1}: State is required`);
      }
      if (!row.location?.city?.trim()) {
        return alert(`Education #${i + 1}: City is required`);
      }
      if (!row.location?.zip?.trim()) {
        return alert(`Education #${i + 1}: Zip/Postal code is required`);
      }
      if (!row.duration?.start_year || !row.duration?.end_year) {
        return alert(`Education #${i + 1}: Duration (start & end year) is required`);
      }
    }

    await saveProfile({ education: vals.education });
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
        <ScrollView>
            <View className="flex-1 bg-white p-4">
                <Text className="text-lg font-semibold mb-3">Edit Education</Text>

                {fields.length === 0 ? (
                <TouchableOpacity onPress={addRow} className="mb-4 px-4 py-3 rounded-2xl bg-gray-200 self-start">
                    <Text className="text-gray-800 font-medium">Add Education</Text>
                </TouchableOpacity>
                ) : null}

                {fields.map((f, idx) => (
                <View key={f.id} className="bg-gray-50 rounded-2xl p-3 mb-3">
                    <Dropdown
                    label="Degree"
                    items={[
                        { id: "Undergrad", label: "Undergrad" },
                        { id: "Grad", label: "Grad" },
                    ]}
                    value={watch(`education.${idx}.degree`) || "Undergrad"}
                    onSelect={(v) => setValue(`education.${idx}.degree`, v, { shouldDirty: true })}
                    />

                    <Controller
                    control={control}
                    name={`education.${idx}.university_name`}
                    rules={{ required: "University name is required" }}
                    render={({ field: { onChange, value } }) => (
                        <TextInput
                        placeholder="University name"
                        value={value}
                        onChangeText={onChange}
                        className="bg-white border border-gray-200 rounded-2xl px-4 py-3 mb-2"
                        />
                    )}
                    />

                    {/* Required location */}
                    <LocationPicker
                    control={control}
                    setValue={setValue}
                    watch={watch}
                    namePrefix={`education.${idx}.location`}
                    label="University Location"
                    countries={COUNTRIES}
                    statesByCountry={STATES_BY_COUNTRY}
                    required
                    />

                    <YearRangePicker
                    label="Duration"
                    start={watch(`education.${idx}.duration.start_year`)}
                    end={watch(`education.${idx}.duration.end_year`)}
                    onChange={(s, e) => {
                        setValue(`education.${idx}.duration.start_year`, s, { shouldDirty: true });
                        setValue(`education.${idx}.duration.end_year`, e, { shouldDirty: true });
                    }}
                    />

                    <View className="flex-row gap-3 mt-2">
                    <Controller
                        control={control}
                        name={`education.${idx}.gpa.grade`}
                        render={({ field: { onChange, value } }) => (
                        <TextInput
                            placeholder="GPA / Grade"
                            value={value}
                            onChangeText={onChange}
                            className="flex-1 bg-white border border-gray-200 rounded-2xl px-4 py-3"
                        />
                        )}
                    />
                    <Dropdown
                        label="Scale"
                        items={[
                        { id: "4", label: "/4" },
                        { id: "10", label: "/10" },
                        ]}
                        value={watch(`education.${idx}.gpa.scale`) || "4"}
                        onSelect={(v) => setValue(`education.${idx}.gpa.scale`, v, { shouldDirty: true })}
                    />
                    </View>

                    <View className="flex-row justify-between mt-2">
                    {idx === fields.length - 1 && (
                        <TouchableOpacity
                        onPress={addRow}
                        className="px-3 py-2 rounded-xl bg-gray-200"
                        >
                        <Text className="text-gray-800 font-medium">Add another</Text>
                        </TouchableOpacity>
                    )}
                    <TouchableOpacity
                        onPress={() => remove(idx)}
                        className="ml-auto px-3 py-2 rounded-xl bg-red-100"
                    >
                        <Text className="text-red-600 font-medium">Remove</Text>
                    </TouchableOpacity>
                    </View>
                </View>
                ))}

                <View className="mt-auto flex-row justify-end gap-3">
                <TouchableOpacity onPress={onClose} className="px-4 py-3 rounded-2xl bg-gray-100">
                    <Text className="text-gray-800 font-medium">Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleSubmit(onSave)} className="px-5 py-3 rounded-2xl bg-blue-600">
                    <Text className="text-white font-semibold">Save</Text>
                </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    </Modal>
  );
}
