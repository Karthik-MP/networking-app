import React from "react";
import { View, Text } from "react-native";
import ProfileAvatar from "../ProfileAvatar";
import { useUserProfile } from "../../hooks/useUserProfile";

export default function ProfileHeader() {
  const { profile } = useUserProfile();
  const name = `${profile?.full_name?.first_name || ""} ${profile?.full_name?.last_name || ""}`.trim();

  return (
    <View className="items-center mb-4">
      <ProfileAvatar size={108} showCompletion />
      <Text className="mt-3 text-xl font-semibold text-gray-900">{name || "Your Name"}</Text>
      <Text className="text-gray-500">{profile?.email_address || ""}</Text>
      {/* <Text className="mt-1 text-gray-700">{completion}% complete</Text> */}
    </View>
  );
}
