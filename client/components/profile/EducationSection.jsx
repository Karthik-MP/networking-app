// client/components/profile/EducationSection.jsx
import SectionCard from "./SectionCard";
import { useUserProfile } from "../../hooks/useUserProfile";
import { View, Text, TouchableOpacity } from "react-native";
import EducationEditor from "./EducationEditor";
import { useState } from "react";

export default function EducationSection() {
  const { profile } = useUserProfile();
  // console.log("Education profile data", profile);
  const rows = profile?.education || [];
  const hasRows = rows.length > 0;
  const [open, setOpen] = useState(false);
  return (
    <>
      <SectionCard
        title="Education"
        right={
          <TouchableOpacity
            onPress={() => setOpen(true)}
            className="px-3 py-1.5 rounded-xl bg-gray-200"
          >
            <Text className="text-gray-800 font-medium">
              {hasRows ? "Edit" : "Add"}
            </Text>
          </TouchableOpacity>
        }
      >
        {rows.length === 0 ? (
          <Text style={{ color: "#6b7280" }}>Add your education</Text>
        ) : (
          rows.map((ed, i) => (
            <View key={i} style={{ marginBottom: 8 }}>
              <Text style={{ fontWeight: "600" }}>{ed.university_name}</Text>
              <Text style={{ color: "#6b7280" }}>
                {ed.degree} • {ed.duration?.start_year}–{ed.duration?.end_year}
              </Text>
            </View>
          ))
        )}
      </SectionCard>
      <EducationEditor visible={open} onClose={() => setOpen(false)} />
    </>
  );
}
