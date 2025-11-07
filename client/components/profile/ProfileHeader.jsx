import ProfileAvatar from "@components/ProfileAvatar";
import { useUserProfile } from "@hooks/useUserProfile";
import { Text, View } from "react-native";
import { useTheme } from "@hooks/useTheme";

export default function ProfileHeader() {
  const { profile } = useUserProfile();
  const { textColor, backgroundColor } = useTheme();
  const name =
    `${profile?.full_name?.first_name || ""} ${profile?.full_name?.last_name || ""}`.trim();

  return (
    <View className={`items-center mb-4 ${backgroundColor.primary}`}>
      <ProfileAvatar size={108} showCompletion />

      {/* Name */}
      <Text className={`mt-3 text-xl font-semibold ${textColor.primary}`}>
        {name || "Your Name"}
      </Text>

      {/* Email */}
      <Text className={`${textColor.secondary}`}>
        {profile?.email_address || ""}
      </Text>

      {/* Optional completion line */}
      {/* <Text className={`mt-1 ${textColor.tertiary}`}>{completion}% complete</Text> */}
    </View>
  );
}
