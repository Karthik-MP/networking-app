import React, { useEffect, useState, useMemo } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Linking,
  Alert,
} from "react-native";
import { doc, getDoc } from "firebase/firestore";
import { Ionicons } from "@expo/vector-icons";
import { db } from "../services/firebase";
import { useTheme } from "../hooks/useTheme";

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

export default function JobDetailScreen({ route }) {
  const { textColor, border, backgroundColor } = useTheme();

  const jobId = route?.params?.jobId;
  const [job, setJob] = useState(null);
  // console.log("jobId", jobId);

  useEffect(() => {
    const load = async (jobId) => {
      if (!jobId) return;
      const snap = await getDoc(doc(db, "job_referrals", jobId));
      if (snap.exists()) setJob({ id: snap.id, ...snap.data() });
    };
    load(jobId);
  }, [jobId]);

  const salary = useMemo(() => formatSalary(job?.salary), [job]);

  if (!job)
    return (
      <View className="flex-1 items-center justify-center">
        <Text>Loading...</Text>
      </View>
    );

  const openExternal = async () => {
    const url = job.jobLink;
    if (!url) return;
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) await Linking.openURL(url);
      else Alert.alert("Cannot open link", url);
    } catch (e) {
      Alert.alert("Cannot open link", "Please try again.");
    }
  };

  const onApply = () => {
    // no-op for now as requested
  };

  return (
    <ScrollView
      contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
      className={`${backgroundColor.primary}`}
    >
      {/* White card container */}
      <View className={`${backgroundColor.cardPrimary} rounded-2xl p-5`}>
        {/* Job Title */}
        <Text
          className={`text-2xl font-bold ${textColor.primary}`}
          numberOfLines={2}
        >
          {job.position}
        </Text>

        {/* Company Name */}
        <Text className={`${textColor.primary} text-lg text-purple-800 font-bold mt-1`}>
          {job.company?.name || ""}
        </Text>

        {/* Location */}
        <View className="flex-row items-center mt-3">
          <Ionicons name="location-outline" size={18} color="#6b7280" />
          <Text
            className={`${textColor.secondary} ml-2 flex-1 text-lg`}
            numberOfLines={2}
          >
            {(job.company?.locations || []).join(" • ") || "—"}
          </Text>
        </View>

        {/* Work Mode */}
        {!!job.workMode && (
          <View className="flex-row items-center mt-2">
            <Ionicons name="briefcase-outline" size={18} color="#6b7280" />
            <Text className={`${textColor.secondary} ml-2 text-lg`}>
              {job.workMode}
            </Text>
          </View>
        )}

        {/* Salary */}
        {!!salary && (
          <View className="flex-row items-center mt-2">
            <Ionicons name="cash-outline" size={18} color="#6b7280" />
            <Text className={`${textColor.secondary} ml-2 text-lg`}>
              {salary}
            </Text>
          </View>
        )}

        {/* Divider */}
      </View>
      <View className={`${backgroundColor.cardPrimary} rounded-2xl p-5 mt-5`}>
        {/* About the job section */}
        <Text className={`text-lg font-semibold mb-2 ${textColor.primary}`}>
          About the job
        </Text>
        <Text
          className={`${textColor.secondary} text-lg`}
          style={{ lineHeight: 22 }}
        >
          {job.jobDescription || "No description provided."}
        </Text>

        {/* Action Buttons */}
        <View className="mt-6 flex-row gap-3">
          <Pressable
            onPress={openExternal}
            className={`px-5 py-3 rounded-xl ${backgroundColor.cardSecondary}`}
          >
            <Text className={`${textColor.primary} font-medium`}>
              Open Job Link
            </Text>
          </Pressable>
          <Pressable
            onPress={onApply}
            className={`px-5 py-3 rounded-xl ${backgroundColor.buttonPrimary}`}
          >
            <Text className="text-white font-medium">Apply</Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
}
