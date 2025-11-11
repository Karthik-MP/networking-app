import { Ionicons } from "@expo/vector-icons";
import { useMemo } from "react";
import { Pressable, Text, View } from "react-native";
import { useTheme } from "@hooks/useTheme";

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

export default function JobCard({ job, onPress }) {
  const title = `${job.position || ""}`.trim();
  const company = job.company?.name || "";
  const locations = (job.company?.locations || []).join(" • ");
  const salary = useMemo(() => formatSalary(job.salary), [job.salary]);
  const { textColor, border, backgroundColor } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      className={`rounded-2xl p-4 mb-3 border ${border.primary} ${backgroundColor.cardPrimary}`}
    >
      <Text
        className={`text-lg font-semibold ${textColor.primary}`}
        numberOfLines={1}
      >
        {title}
      </Text>
      <Text className={`${textColor.primary} text-lg  mt-1`} numberOfLines={1}>
        {company}
      </Text>
      <View className="flex-row items-center mt-2">
        <Ionicons name="location-outline" size={16} color="#6b7280" />
        <Text
          className={`${textColor.secondary} ml-1 flex-1`}
          numberOfLines={1}
        >
          {locations || "—"}
        </Text>
      </View>
      {!!salary && (
        <View className="flex-row items-center mt-1">
          <Ionicons name="cash-outline" size={16} color="#6b7280" />
          <Text className={`${textColor.secondary} ml-1`}>{salary}</Text>
        </View>
      )}
    </Pressable>
  );
}
