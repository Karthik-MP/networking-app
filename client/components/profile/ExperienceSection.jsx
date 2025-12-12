import { useRef, useState } from "react";
import { Text, View } from "react-native";
import { useTheme } from "../../hooks/useTheme"; // ✅ useTheme instead of ThemeContext
import { useUserProfile } from "../../hooks/useUserProfile";
import { EditorModalLayout } from "../EditorModalLayout";
import { showToast } from "../toast";
import ExperienceEditor from "./ExperienceEditor";
import SectionCard from "./SectionCard";

export default function ExperienceSection({ profileData, isCurrentUser }) {
  const { profile: currentUserProfile, saveProfile } = useUserProfile();
  const [profile] = useState(profileData || currentUserProfile);
  const [open, setOpen] = useState(false);
  const rows = profile?.experience || [];
  const { textColor } = useTheme();
  const editorRef = useRef(null);

  const onSave = async () => {
    console.log("Saving Experience");

    // Get form values from the editor
    const vals = editorRef.current ? editorRef.current() : { experience: [] };
    console.log("Form values:", vals);

    // if no rows, clear on backend
    if (!vals.experience || vals.experience.length === 0) {
      await saveProfile({ experience: [] });
      setOpen(false);
      return;
    }

    // validate required fields for each row
    for (let i = 0; i < vals.experience.length; i++) {
      const row = vals.experience[i];

      if (!row.company_name?.trim()) {
        return showToast(
          "warning",
          `Experience #${i + 1}: Company name is required`
        );
      }

      if (!row.role?.trim()) {
        return showToast(
          "warning",
          `Experience #${i + 1}: Role/Position is required`
        );
      }

      if (!row.location?.country) {
        return showToast(
          "warning",
          `Experience #${i + 1}: Country is required`
        );
      }

      if (!row.location?.state) {
        return showToast("warning", `Experience #${i + 1}: State is required`);
      }

      if (!row.location?.city?.trim()) {
        return showToast("warning", `Experience #${i + 1}: City is required`);
      }

      if (!row.location?.zip?.trim()) {
        return showToast(
          "warning",
          `Experience #${i + 1}: Zip/Postal code is required`
        );
      }

      if (!row.duration?.start_year || !row.duration?.end_year) {
        return showToast(
          "warning",
          `Experience #${i + 1}: Duration (start & end year) is required`
        );
      }
    }

    await saveProfile({ experience: vals.experience });
    setOpen(false);
  };

  return (
    <>
      <SectionCard
        title="Experience"
        onEdit={isCurrentUser ? () => setOpen(true) : false}
      >
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
        <ExperienceEditor
          visible={open}
          onSave={editorRef}
          onClose={() => setOpen(false)}
        />
      </EditorModalLayout>
    </>
  );
}
