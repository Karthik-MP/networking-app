import { INDUSTRIES, IT_SUB } from "@constants/interests"; // adjust path if needed
import { useTheme } from "@hooks/useTheme";
import { useUserProfile } from "@hooks/useUserProfile";
import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { Text, View } from "react-native";
import ChipGroup from "./ChipGroup";

export default function InterestsEditor({ visible, onSave }) {
  const { profile } = useUserProfile();
  const { textColor, backgroundColor } = useTheme();

  const { watch, setValue, reset, getValues, control } = useForm({
    defaultValues: {
      industries: profile?.interests?.industries || [],
      it_sub: profile?.interests?.it_sub || [],
      hobbies: profile?.interests?.hobbies || [],
    },
  });

  useEffect(() => {
    if (visible) {
      reset({
        industries: profile?.interests?.industries || [],
        it_sub: profile?.interests?.it_sub || [],
        hobbies: profile?.interests?.hobbies || [],
      });
    }
  }, [visible, profile, reset]);

  // Expose getValues to parent via onSave prop
  useEffect(() => {
    if (onSave && visible) {
      onSave.current = () => getValues();
    }
  }, [onSave, getValues, visible]);

  return (
    <View className={`flex-1 p-4 ${backgroundColor.primary}`}>
      {/* Industries */}
      <Text className={`font-semibold text-base mb-2 ${textColor.primary}`}>
        Industries
      </Text>
      <Controller
        control={control}
        name="industries"
        render={({ field: { onChange, value } }) => (
          <ChipGroup
            multi
            options={INDUSTRIES}
            value={value}
            onChange={onChange}
          />
        )}
      />

      {/* IT Sub-Interests */}
      <View className="h-4" />
      <Text className={`font-semibold text-base mb-2 ${textColor.primary}`}>
        IT Sub-Interests
      </Text>
      <Controller
        control={control}
        name="it_sub"
        render={({ field: { onChange, value } }) => (
          <ChipGroup
            multi
            options={IT_SUB.map((s) => ({ id: s, label: s }))}
            value={value}
            onChange={onChange}
          />
        )}
      />

      {/* Hobbies */}
      <View className="h-4" />
      <Text className={`font-semibold text-base mb-2 ${textColor.primary}`}>
        Hobbies
      </Text>
      <Controller
        control={control}
        name="hobbies"
        render={({ field: { onChange, value } }) => (
          <ChipGroup
            multi
            freeInput
            placeholder="Type a hobby and add"
            options={[]}
            value={value}
            onChange={onChange}
          />
        )}
      />
    </View>
  );
}
