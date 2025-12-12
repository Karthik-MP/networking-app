import { useTheme } from "@hooks/useTheme";
import { useUserProfile } from "@hooks/useUserProfile";
import { useRef, useState } from "react";
import { Text, View } from "react-native";
import { EditorModalLayout } from "../EditorModalLayout";
import InterestsEditor from "./InterestsEditor";
import SectionCard from "./SectionCard";

export default function InterestsSection({ profileData, isCurrentUser }) {
  const { profile: currentUserProfile, saveProfile } = useUserProfile();
  const [ profile ] = useState(profileData || currentUserProfile);
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
        hobbies: vals.hobbies || [],
      },
    });
    setOpen(false);
  };
  if (industries.length + itSub.length + hobbies.length < 1) {
    return;
  }

  return (
    <>
      <SectionCard
        title="Interests"
        onEdit={isCurrentUser ? () => setOpen(true) : false}
      >
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
        <InterestsEditor
          visible={open}
          onSave={editorRef}
          onClose={() => setOpen(false)}
        />
      </EditorModalLayout>
    </>
  );
}

const Row = ({ label, values }) => {
  const { backgroundColor, textColor } = useTheme();
  if (values?.length < 1) {
    return;
  }

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
