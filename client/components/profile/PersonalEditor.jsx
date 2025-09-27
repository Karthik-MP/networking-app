import React, { useEffect } from "react";
import { Modal, View, Text, TouchableOpacity, TextInput } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { useUserProfile } from "../../hooks/useUserProfile";
import LocationPicker from "../Location/LocationPicker";
import PhoneInput from "./PhoneInput";

export default function PersonalEditor({ visible, onClose }) {
  const { profile, saveProfile } = useUserProfile();
  const { control, setValue, reset, handleSubmit } = useForm({
    defaultValues: {
      first_name: profile?.full_name?.first_name || "",
      last_name:  profile?.full_name?.last_name || "",
      email_address: profile?.email_address || "",
      phone_number: profile?.phone_number || { country_code:"+1", number:"" },
      native_location: profile?.native_location || { country:"",state:"",city:"",zip:"" }
    }
  });

  useEffect(() => {
    if (visible) {
      reset({
        first_name: profile?.full_name?.first_name || "",
        last_name:  profile?.full_name?.last_name || "",
        email_address: profile?.email_address || "",
        phone_number: profile?.phone_number || { country_code:"+1", number:"" },
        native_location: profile?.native_location || { country:"",state:"",city:"",zip:"" }
      });
    }
  }, [visible]);

  const onSave = async (vals) => {
    await saveProfile({
      full_name: { first_name: vals.first_name, last_name: vals.last_name },
      email_address: vals.email_address,
      phone_number: vals.phone_number,
      native_location: vals.native_location
    });
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View className="flex-1 bg-white p-4">
        <Text className="text-lg font-semibold mb-3">Edit Personal</Text>

        <Controller
          control={control}
          name="first_name"
          rules={{ required: "First name is required" }}
          render={({ field: { onChange, value } }) => (
            <TextInput placeholder="First name" value={value} onChangeText={onChange}
              className="bg-white border border-gray-200 rounded-2xl px-4 py-3 mb-2" />
          )}
        />
        <Controller
          control={control}
          name="last_name"
          rules={{ required: "Last name is required" }}
          render={({ field: { onChange, value } }) => (
            <TextInput placeholder="Last name" value={value} onChangeText={onChange}
              className="bg-white border border-gray-200 rounded-2xl px-4 py-3 mb-2" />
          )}
        />
        <Controller
          control={control}
          name="email_address"
          rules={{ required: "Email is required" }}
          render={({ field: { onChange, value } }) => (
            <TextInput placeholder="Email" value={value} onChangeText={onChange}
              keyboardType="email-address"
              editable={false} // disable editing
              className="bg-gray-100 border border-gray-200 rounded-2xl px-4 py-3 mb-2" />
          )}
        />

        <Controller
          control={control}
          name="phone_number"
          render={({ field: { value, onChange } }) => (
            <PhoneInput value={value} onChange={onChange} />
          )}
        />

        <LocationPicker
          control={control}
          setValue={setValue}
          watch={(name)=>null}
          namePrefix="native_location"
          label="Location"
          required
        />

        <View className="mt-auto flex-row justify-end gap-3">
          <TouchableOpacity onPress={onClose} className="px-4 py-3 rounded-2xl bg-gray-100">
            <Text className="text-gray-800 font-medium">Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleSubmit(onSave)} className="px-5 py-3 rounded-2xl bg-blue-600">
            <Text className="text-white font-semibold">Save</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
