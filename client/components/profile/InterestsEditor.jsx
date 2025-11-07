import { INDUSTRIES, IT_SUB } from "@constants/interests"; // adjust path if needed
import { useTheme } from "@hooks/useTheme";
import { useUserProfile } from "@hooks/useUserProfile";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Text, View } from "react-native";
import ChipGroup from "./ChipGroup";

export default function InterestsEditor({ visible }) {
  const { profile } = useUserProfile();
  const { textColor, backgroundColor } = useTheme();

  const { watch, setValue, reset } = useForm({
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

  return (
    <View className={`flex-1 p-4 ${backgroundColor.primary}`}>
      {/* Industries */}
      <Text className={`font-semibold text-base mb-2 ${textColor.primary}`}>
        Industries
      </Text>
      <ChipGroup
        multi
        options={INDUSTRIES}
        value={watch("industries")}
        onChange={(v) => setValue("industries", v, { shouldDirty: true })}
      />

      {/* IT Sub-Interests */}
      <View className="h-4" />
      <Text className={`font-semibold text-base mb-2 ${textColor.primary}`}>
        IT Sub-Interests
      </Text>
      <ChipGroup
        multi
        options={IT_SUB.map((s) => ({ id: s, label: s }))}
        value={watch("it_sub")}
        onChange={(v) => setValue("it_sub", v, { shouldDirty: true })}
      />

      {/* Hobbies */}
      <View className="h-4" />
      <Text className={`font-semibold text-base mb-2 ${textColor.primary}`}>
        Hobbies
      </Text>
      <ChipGroup
        multi
        freeInput
        placeholder="Type a hobby and add"
        options={[]}
        value={watch("hobbies")}
        onChange={(v) => setValue("hobbies", v, { shouldDirty: true })}
      />
    </View>
  );
}
