import { useState } from "react";
import { Text, View } from "react-native";
import { useTheme } from "../../hooks/useTheme"; // ✅ useTheme instead of ThemeContext
import { useUserProfile } from "../../hooks/useUserProfile";
import { EditorModalLayout } from "../EditorModalLayout";
import ExperienceEditor from "./ExperienceEditor";
import SectionCard from "./SectionCard";

export default function ExperienceSection() {
  const { profile, saveProfile } = useUserProfile();
  const [open, setOpen] = useState(false);
  const rows = profile?.experience || [];
  const { textColor } = useTheme();

  const onSave = async (vals) => {
    await saveProfile({ experience: vals.experience });
    setOpen(false); // ✅ fixed onClose reference
  };

  return (
    <>
      <SectionCard title="Experience" onEdit={() => setOpen(true)}>
        {rows.length === 0 ? (
          <Text className={`text-sm ${textColor.secondary}`}>
            Add your experience
          </Text>
        ) : (
          rows.map((ex, i) => (
            <View key={i} className="mb-3">
              <Text className={`font-semibold text-base ${textColor.primary}`}>
                {ex.company_name || "Company"}
              </Text>

              <Text className={`text-sm ${textColor.secondary}`}>
                {ex.role || ""} • {ex.duration?.start_year || "—"}–
                {ex.duration?.end_year || "—"}
              </Text>

              {!!ex.location?.country && (
                <Text className={`text-sm ${textColor.tertiary}`}>
                  {[ex.location.city, ex.location.state, ex.location.country]
                    .filter(Boolean)
                    .join(", ")}
                </Text>
              )}
            </View>
          ))
        )}
      </SectionCard>

      <EditorModalLayout
        visible={open}
        title="Edit Experience"
        onSave={onSave}
        onClose={() => setOpen(false)}
      >
        <ExperienceEditor visible={open} onClose={() => setOpen(false)} />
      </EditorModalLayout>
    </>
  );
}
