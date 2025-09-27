import React, { useState } from "react";
import { View, Text } from "react-native";
import SectionCard from "./SectionCard";
import { useUserProfile } from "../../hooks/useUserProfile";
import PersonalEditor from "./PersonalEditor";

export default function PersonalSection() {
  const { profile } = useUserProfile();
  const [open, setOpen] = useState(false);

  return (
    <>
      <SectionCard title="Personal" onEdit={()=>setOpen(true)}>
        {/* <Text className="text-gray-500">Name</Text>
        <Text className="text-gray-900 font-medium">
          {(profile?.full_name?.first_name || "") + " " + (profile?.full_name?.last_name || "")}
        </Text>

        <View className="h-2" />
        <Text className="text-gray-500">Email</Text>
        <Text className="text-gray-900 font-medium">{profile?.email_address || "—"}</Text> */}

        <View className="h-2" />
        <Text className="text-gray-500">Phone</Text>
        <Text className="text-gray-900 font-medium">
          {profile?.phone_number ? `${profile.phone_number.country_code} ${profile.phone_number.number}` : "—"}
        </Text>

        <View className="h-2" />
        <Text className="text-gray-500">Location</Text>
        <Text className="text-gray-900 font-medium">
          {[profile?.native_location?.city, profile?.native_location?.state, profile?.native_location?.country]
            .filter(Boolean).join(", ") || "—"}
        </Text>
      </SectionCard>
      <PersonalEditor visible={open} onClose={()=>setOpen(false)} />
    </>
  );
}
