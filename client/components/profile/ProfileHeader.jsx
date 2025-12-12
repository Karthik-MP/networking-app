import ProfileAvatar from "@components/ProfileAvatar";
import { useTheme } from "@hooks/useTheme";
import { useUserProfile } from "@hooks/useUserProfile";
import { Text, View } from "react-native";

export default function ProfileHeader({ profileData, isCurrentUser }) {
  const { profile: currentUserProfile } = useUserProfile();
  const { textColor, backgroundColor } = useTheme();

  // Use profileData if provided (viewing another user), otherwise use current user's profile
  const profile = profileData || currentUserProfile;

  const name =
    `${profile?.full_name?.first_name || ""} ${profile?.full_name?.last_name || ""}`.trim();

  return (
    <View className={`items-center mb-4 ${backgroundColor.primary}`}>
      <ProfileAvatar
        size={108}
        profileData={profile}
        isCurrentUser={isCurrentUser}
      />

      {/* Name */}
      <Text className={`mt-3 text-xl font-semibold ${textColor.primary}`}>
        {name || "Your Name"}
      </Text>

      {/* Email */}
      <Text className={`${textColor.secondary}`}>
        {profile?.email_address || ""}
      </Text>
    </View>
  );
}
