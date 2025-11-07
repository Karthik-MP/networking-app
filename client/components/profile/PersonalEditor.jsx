import { useTheme } from "@hooks/useTheme";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { TextInput } from "react-native";
import { useUserProfile } from "../../hooks/useUserProfile";
import LocationPicker from "../Location/LocationPicker";
import PhoneInput from "./PhoneInput";

export default function PersonalEditor({ visible }) {
  const { profile } = useUserProfile();
  const { dark, backgroundColor, border, colors } = useTheme();
  const { control, setValue, reset, handleSubmit, watch } = useForm({
    defaultValues: {
      first_name: profile?.full_name?.first_name || "",
      last_name: profile?.full_name?.last_name || "",
      email_address: profile?.email_address || "",
      phone_number: profile?.phone_number || { country_code: "+1", number: "" },
      native_location: profile?.native_location || {
        country: "",
        state: "",
        city: "",
        zip: "",
      },
    },
  });

  useEffect(() => {
    if (visible) {
      reset({
        first_name: profile?.full_name?.first_name || "",
        last_name: profile?.full_name?.last_name || "",
        email_address: profile?.email_address || "",
        phone_number: profile?.phone_number || {
          country_code: "+1",
          number: "",
        },
        native_location: profile?.native_location || {
          country: "",
          state: "",
          city: "",
          zip: "",
        },
      });
    }
  }, [visible]);

   const inputClass =
    `rounded-2xl px-5 py-3 mb-2 border ` +
    `${backgroundColor.input} ${border.primary}`;
  const placeholderColor = dark ? "#6B7280" : "#9CA3AF";

  return (
    <>
      {/* First Name */}
      <Controller
        control={control}
        name="first_name"
        rules={{ required: "First name is required" }}
        render={({ field: { onChange, value } }) => (
          <TextInput
            placeholder="First name"
            value={value}
            onChangeText={onChange}
            className={inputClass}
            placeholderTextColor={placeholderColor}
            style={{ color: colors.text }}
          />
        )}
      />

      {/* Last Name */}
      <Controller
        control={control}
        name="last_name"
        rules={{ required: "Last name is required" }}
        render={({ field: { onChange, value } }) => (
          <TextInput
            placeholder="Last name"
            value={value}
            onChangeText={onChange}
            className={inputClass}
            placeholderTextColor={placeholderColor}
            style={{ color: colors.text }}
          />
        )}
      />

      {/* Email (read-only) */}
      <Controller
        control={control}
        name="email_address"
        rules={{ required: "Email is required" }}
        render={({ field: { onChange, value } }) => (
          <TextInput
            placeholder="Email"
            value={value}
            onChangeText={onChange}
            keyboardType="email-address"
            editable={false} // disable editing
            className={inputClass}
            placeholderTextColor={placeholderColor}
            style={{ color: colors.text, opacity: 0.7 }}
          />
        )}
      />

      {/* Phone */}
      <Controller
        control={control}
        name="phone_number"
        render={({ field: { value, onChange } }) => (
          <PhoneInput value={value} onChange={onChange} />
        )}
      />

      {/* Location */}
      <LocationPicker
        control={control}
        setValue={setValue}
        watch={watch}
        namePrefix="native_location"
        label="Location"
        required
      />
    </>
  );
}
