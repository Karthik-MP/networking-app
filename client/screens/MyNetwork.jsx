import { useNavigation } from "@react-navigation/native";
import { limit, where } from "firebase/firestore";
import { Image, Text, TouchableOpacity, View } from "react-native";
import CustomFlatList from "../components/CustomFlatList";
import { useTheme } from "../hooks/useTheme";
import { useUserProfile } from "../hooks/useUserProfile";

export default function MyNetwork() {
  const { profile } = useUserProfile();

  const constraints = [where("uid", "!=", profile?.uid || ""), limit(10)];

  return (
    <CustomFlatList
      queryKey={"my_network"}
      Component={Card}
      collection_name={"users"}
      constraints={constraints}
    />
  );
}

const Card = ({ item }) => {
  const { backgroundColor, textColor } = useTheme();
  const navigation = useNavigation();
  const handlePress = () => {
    // Navigate to UserProfile screen with the userId as a parameter
    navigation.navigate("UserProfile", { profileUser: { uid: item?.uid } });
  };
  const defaultImage = require("../assets/avatar.jpg");
  return (
    <TouchableOpacity onPress={handlePress}>
      <View
        className={`${backgroundColor.cardPrimary} p-5 rounded-3xl mx-2 mb-4`}
      >
        {/* User row */}
        <View className="flex-row items-center space-x-4">
          {/* Profile Image */}
          <View className="w-16 h-16 rounded-full overflow-hidden mx-1">
            <Image
              source={item?.photoURL ? { uri: item.photoURL } : defaultImage}
              className="w-full h-full"
              resizeMode="cover"
            />
          </View>

          {/* User info */}
          <View className="flex-1">
            <Text className={`${textColor.primary} font-bold text-lg`}>
              {item?.full_name
                ? `${item.full_name.first_name || ""} ${item.full_name.last_name || ""}`.trim()
                : "User"}
            </Text>
            <Text
              className={`${textColor.secondary} text-sm`}
              numberOfLines={2}
            >
              {item?.experience?.[0]?.role
                ? `${item.experience[0].role}${item.experience[0].company_name ? ` at ${item.experience[0].company_name}` : ""}`
                : item?.education?.[0]?.degree
                  ? `${item.education[0].degree}${item.education[0].university_name ? ` - ${item.education[0].university_name}` : ""}`
                  : "Member"}
            </Text>
          </View>

          {/* Connect button */}
          {/* <TouchableOpacity className="bg-blue-600 px-4 py-2 rounded-full" onPress={()=> }>
            <Text className="text-white font-semibold">Connect</Text>
          </TouchableOpacity> */}
        </View>
      </View>
    </TouchableOpacity>
  );
};
