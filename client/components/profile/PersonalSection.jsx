import { useTheme } from "@hooks/useTheme";
import { useUserProfile } from "@hooks/useUserProfile";
import { useState } from "react";
import { Text, View } from "react-native";
import { EditorModalLayout } from "../EditorModalLayout";
import PersonalEditor from "./PersonalEditor";
import SectionCard from "./SectionCard";

export default function PersonalSection() {
  const { profile, saveProfile } = useUserProfile();
  const [open, setOpen] = useState(false);
  const { textColor } = useTheme();
  const onSave = async (vals) => {
    console.log("Updating the Profle");
    await saveProfile({
      full_name: { first_name: vals.first_name, last_name: vals.last_name },
      email_address: vals.email_address,
      phone_number: vals.phone_number,
      native_location: vals.native_location,
    });
    setOpen(false);
  };

  return (
    <>
      <SectionCard title="Personal" onEdit={() => setOpen(true)}>
        <View className="h-2" />

        {/* Phone */}
        <View className="flex-row items-center">
          <Text className={`font-semibold mr-2 ${textColor.secondary}`}>
            Phone:
          </Text>
          <Text className={`${textColor.primary}`}>
            {profile?.phone_number
              ? `${profile.phone_number.country_code} ${profile.phone_number.number}`
              : "—"}
          </Text>
        </View>

        <View className="h-2" />

        {/* Location */}
        <View className="flex-row items-center mt-1">
          <Text className={`font-semibold mr-2 ${textColor.secondary}`}>
            Location:
          </Text>
          <Text className={`${textColor.primary}`}>
            {[
              profile?.native_location?.city,
              profile?.native_location?.state,
              profile?.native_location?.country,
            ]
              .filter(Boolean)
              .join(", ") || "—"}
          </Text>
        </View>
      </SectionCard>
      <EditorModalLayout
        visible={open}
        title="Edit Personal"
        onSave={onSave}
        onClose={() => setOpen(false)}
      >
        <PersonalEditor visible={open} onClose={() => setOpen(false)} onSave={onSave}/>
      </EditorModalLayout>
    </>
  );
}
