import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@hooks/useTheme";
import { useMemo } from "react";
import { Pressable, Text, View } from "react-native";

function formatSalary(salary) {
  if (!salary || !salary.amount) return "";
  const amt = Number(salary.amount);
  const symbol =
    salary.currency === "USD"
      ? "$"
      : salary.currency === "INR"
        ? "₹"
        : `${salary.currency} `;
  const pretty = amt >= 1000 ? `${Math.round(amt / 1000)}k` : amt;
  const per = salary.period || "year";
  return `${symbol}${pretty}/${per}`;
}

export default function JobCard({ item, onPressFn }) {
  // Support both 'job' and 'item' props for flexibility
  console.log(item?.position);
  const title = item?.position
  const company = item?.company?.name || "";
  const locations = (item?.company?.locations || []).join(" • ");
  const workMode = item?.workMode ? ` • ${item.workMode}` : "";
  const salary = useMemo(() => formatSalary(item?.salary), [item?.salary]);
  const { textColor, border, backgroundColor } = useTheme();

  return (
    <Pressable
      onPress={() => onPressFn(item)}
      className={`rounded-2xl p-4 mb-3 ${backgroundColor.cardPrimary}`}
    >
      <Text
        className={`text-lg font-semibold text-black`}
        numberOfLines={1}
      >
        {title}
      </Text>
      <Text className={`${textColor.primary} text-lg mt-1`} numberOfLines={1}>
        {company}
      </Text>
      <View className="flex-row items-center mt-2">
        <Ionicons name="location-outline" size={16} color="#6b7280" />
        <Text
          className={`${textColor.secondary} ml-1 flex-1`}
          numberOfLines={1}
        >
          {locations || "—"}
          {workMode}
        </Text>
      </View>
      {!!salary && (
        <View className="flex-row items-center mt-1">
          <Ionicons name="cash-outline" size={16} color="#6b7280" />
          <Text className={`${textColor.secondary} ml-1`}>{salary}</Text>
        </View>
      )}
      {/* {item?.jobDescription && (
        <Text
          className={`${textColor.tertiary} text-sm mt-2`}
          numberOfLines={2}
        >
          {item.jobDescription}
        </Text>
      )} */}
    </Pressable>
  );
}
