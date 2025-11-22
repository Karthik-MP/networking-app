import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { TextInput, TouchableOpacity, View, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@hooks/useTheme";
import { useUserProfile } from "@hooks/useUserProfile";

export default function Header({ onCreatePress }) {
  const navigation = useNavigation();
  const { theme, dark, backgroundColor } = useTheme(); // ✅ useTheme instead of useContext
  const { profile } = useUserProfile();

  const navigateToProfile = () => {
    navigation.navigate("Profile");
  };

  return (
    <SafeAreaView
      edges={["top"]}
      className={`border-b ${backgroundColor.primary}`}
      style={{ borderColor: theme.colors.border }}
    >
      <View
        className="flex-row items-center px-3 py-2 h-[60px]"
        style={{
          backgroundColor: theme.colors.card,
        }}
      >
        {/* Profile Button */}
        <TouchableOpacity onPress={navigateToProfile} className="mr-2">
          {profile?.photoURL ? (
            <Image
              source={{ uri: profile.photoURL }}
              className="w-9 h-9 rounded-full"
              style={{ 
                width: 36, 
                height: 36, 
                borderRadius: 18,
                borderWidth: 2,
                borderColor: theme.colors.border
              }}
            />
          ) : (
            <Ionicons name="person-circle" size={36} color={theme.colors.text} />
          )}
        </TouchableOpacity>

        {/* Search Bar */}
        <View
          className="flex-1 flex-row items-center rounded-full px-3 h-10 border"
          style={{
            borderColor: theme.colors.border,
            backgroundColor: dark
              ? theme.backgroundColor.cardSecondary
              : theme.backgroundColor.cardPrimary,
          }}
        >
          <Ionicons
            name="search"
            size={20}
            color={dark ? "#9ca3af" : "#4b5563"} // slate-400 / gray-600
            style={{ marginRight: 8 }}
          />
          <TextInput
            className="flex-1 text-base p-0"
            style={{ color: theme.colors.text }}
            placeholder="Search"
            placeholderTextColor={dark ? "#9ca3af" : "#6b7280"}
          />
        </View>

        {/* Create Button */}
        <TouchableOpacity onPress={onCreatePress} className="ml-2">
          <Ionicons
            name="add-circle-outline"
            size={30}
            color={theme.colors.secondary} // violet-600 brand color
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
