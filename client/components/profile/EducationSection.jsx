// client/components/profile/EducationSection.jsx
import { ThemeContext } from "@contexts/ThemeContext";
import { useContext, useState } from "react";
import { Text, View } from "react-native";
import { useUserProfile } from "@hooks/useUserProfile";
import EducationEditor from "./EducationEditor";
import SectionCard from "./SectionCard";
import { EditorModalLayout } from "../EditorModalLayout";
import { useTheme } from "@hooks/useTheme";

export default function EducationSection() {
  const { profile, saveProfile } = useUserProfile();
  const rows = profile?.education || [];
  const [open, setOpen] = useState(false);
  const { textColor } = useTheme(); // ✅ theme-based text colors

  const onSave = async (vals) => {
    console.log("Saving Profile");

    // if no rows, clear on backend
    if (!vals.education || vals.education.length === 0) {
      await saveProfile({ education: [] });
      setOpen(false);
      return;
    }

    // validate required fields for each row
    for (let i = 0; i < vals.education.length; i++) {
      const row = vals.education[i];
      if (!row.university_name?.trim()) {
        return alert(`Education #${i + 1}: University name is required`);
      }
      if (!row.location?.country) {
        return alert(`Education #${i + 1}: Country is required`);
      }
      if (!row.location?.state) {
        return alert(`Education #${i + 1}: State is required`);
      }
      if (!row.location?.city?.trim()) {
        return alert(`Education #${i + 1}: City is required`);
      }
      if (!row.location?.zip?.trim()) {
        return alert(`Education #${i + 1}: Zip/Postal code is required`);
      }
      if (!row.duration?.start_year || !row.duration?.end_year) {
        return alert(
          `Education #${i + 1}: Duration (start & end year) is required`
        );
      }
    }

    await saveProfile({ education: vals.education });
    setOpen(false); // ✅ fixed: close modal here
  };

  return (
    <>
      <SectionCard title="Education" onEdit={() => setOpen(true)}>
        {rows.length === 0 ? (
          <Text className={`text-sm ${textColor.secondary}`}>
            Add your education
          </Text>
        ) : (
          rows.map((ed, i) => (
            <View key={i} className="mb-2">
              <Text
                className={`text-sm font-semibold ${textColor.primary}`}
              >
                {ed?.university_name?.toUpperCase() || ""}
              </Text>
              <Text className={`text-sm ${textColor.secondary}`}>
                {ed.degree} • {ed.duration?.start_year}–{ed.duration?.end_year}
              </Text>
            </View>
          ))
        )}
      </SectionCard>

      <EditorModalLayout
        visible={open}
        title="Edit Education"
        onSave={onSave}
        onClose={() => setOpen(false)}
      >
        <EducationEditor visible={open} onClose={() => setOpen(false)} />
      </EditorModalLayout>
    </>
  );
}