import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import SectionCard from "./SectionCard";
import { useUserProfile } from "../../hooks/useUserProfile";
import ExperienceEditor from "./ExperienceEditor";

export default function ExperienceSection() {
  const { profile } = useUserProfile();
  const [open, setOpen] = useState(false);
  const rows = profile?.experience || [];
  const hasRows = rows.length > 0;
  return (
    <>
      <SectionCard
        title="Experience"
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
          <Text className="text-gray-500">Add your experience</Text>
        ) : (
          rows.map((ex, i) => (
            <View key={i} className="mb-3">
              <Text className="font-semibold text-gray-900">
                {ex.company_name || "Company"}
              </Text>
              <Text className="text-gray-600">
                {ex.role || ""} • {ex.duration?.start_year || "—"}–
                {ex.duration?.end_year || "—"}
              </Text>
              {!!ex.location?.country && (
                <Text className="text-gray-500">
                  {[ex.location.city, ex.location.state, ex.location.country]
                    .filter(Boolean)
                    .join(", ")}
                </Text>
              )}
            </View>
          ))
        )}
      </SectionCard>
      <ExperienceEditor visible={open} onClose={() => setOpen(false)} />
    </>
  );
}
