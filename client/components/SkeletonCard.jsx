import { View } from "react-native";

export default function SkeletonCard() {
  return (
    <View className="bg-white rounded-2xl p-4 mb-4 border border-gray-200">
      <View className="w-full h-40 rounded-xl bg-gray-200 animate-pulse mb-4" />
      <View className="h-4 bg-gray-200 rounded mb-2 animate-pulse" />
      <View className="h-4 bg-gray-200 rounded w-2/3 mb-4 animate-pulse" />
      <View className="flex-row gap-2">
        <View className="h-8 w-20 bg-gray-200 rounded-lg animate-pulse" />
        <View className="h-8 w-20 bg-gray-200 rounded-lg animate-pulse" />
        <View className="h-8 w-20 bg-gray-200 rounded-lg animate-pulse" />
      </View>
    </View>
  );
}
