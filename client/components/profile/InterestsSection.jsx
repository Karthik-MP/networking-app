import React, { useState } from "react";
import { View, Text } from "react-native";
import SectionCard from "./SectionCard";
import { useUserProfile } from "../../hooks/useUserProfile";
import InterestsEditor from "./InterestsEditor";

export default function InterestsSection() {
  const { profile } = useUserProfile();
  const [open, setOpen] = useState(false);
  const ind = profile?.interests?.industries || [];
  const it  = profile?.interests?.it_sub || [];
  const hob = profile?.interests?.hobbies || [];

  return (
    <>
      <SectionCard title="Interests" onEdit={() => setOpen(true)}>
        <Row label="Industries" values={ind} />
        <Row label="IT"         values={it} />
        <Row label="Hobbies"    values={hob} />
      </SectionCard>
      <InterestsEditor visible={open} onClose={() => setOpen(false)} />
    </>
  );
}

const Row = ({ label, values }) => (
  <View className="mb-2">
    <Text className="text-gray-500">{label}</Text>
    {values?.length ? (
      <View className="flex-row flex-wrap gap-2 mt-1">
        {values.map((v) => (
          <View key={v.id || v} className="px-3 py-1.5 rounded-full bg-white border border-gray-200">
            <Text className="text-gray-800">{v.label || v}</Text>
          </View>
        ))}
      </View>
    ) : (
      <Text className="text-gray-400 mt-1">—</Text>
    )}
  </View>
);
