import { useState, useRef } from "react";
import { Text, View } from "react-native";
import { useTheme } from "@hooks/useTheme"; 
import { useUserProfile } from "@hooks/useUserProfile";
import { EditorModalLayout } from "../EditorModalLayout";
import InterestsEditor from "./InterestsEditor";
import SectionCard from "./SectionCard";

export default function InterestsSection() {
  const { profile, saveProfile } = useUserProfile();
  const [open, setOpen] = useState(false);
  const editorRef = useRef(null);

  const industries = profile?.interests?.industries || [];
  const itSub = profile?.interests?.it_sub || [];
  const hobbies = profile?.interests?.hobbies || [];

  const onSave = async () => {
    console.log("Saving Interests");
    
    // Get form values from the editor
    const vals = editorRef.current ? editorRef.current() : {};
    console.log("Form values:", vals);

    await saveProfile({ 
      interests: {
        industries: vals.industries || [],
        it_sub: vals.it_sub || [],
        hobbies: vals.hobbies || []
      }
    });
    setOpen(false);
  };

  return (
    <>
      <SectionCard title="Interests" onEdit={() => setOpen(true)}>
        <Row label="Industries" values={industries} />
        <Row label="IT" values={itSub} />
        <Row label="Hobbies" values={hobbies} />
      </SectionCard>

      <EditorModalLayout
        visible={open}
        title="Edit Interests"
        onSave={onSave}
        onClose={() => setOpen(false)}
      >
        <InterestsEditor visible={open} onSave={editorRef} onClose={() => setOpen(false)} />
      </EditorModalLayout>
    </>
  );
}

const Row = ({ label, values }) => {
  const { backgroundColor, textColor } = useTheme();

  return (
    <View className="mb-2">
      <Text className={`text-sm font-semibold ${textColor.secondary}`}>
        {label || ""}
      </Text>

      {values?.length > 0 ? (
        <View className="flex-row flex-wrap gap-2 mt-1">
          {values.map((v) => (
            <View
              key={v.id || v}
              className={`px-3 py-1.5 rounded-full ${backgroundColor.cardSecondary}`}
            >
              <Text className={`text-sm ${textColor.primary}`}>
                {v.label || v}
              </Text>
            </View>
          ))}
        </View>
      ) : (
        <Text className={`text-xs italic mt-1 ${textColor.tertiary}`}>
          None added
        </Text>
      )}
    </View>
  );
};
