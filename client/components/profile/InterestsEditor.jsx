import React, { useEffect } from "react";
import { Modal, View, Text, TouchableOpacity } from "react-native";
import { useForm } from "react-hook-form";
import { useUserProfile } from "../../hooks/useUserProfile";
import ChipGroup from "./ChipGroup";

const IT_SUB = ["GenAI","Full-Stack","Mobile","Data Engineering","Cloud","Security"];
const INDUSTRIES = [
  { id:"it", label:"IT / Software" }, { id:"finance", label:"Finance" },
  { id:"fashion", label:"Fashion" },   { id:"healthcare", label:"Healthcare" },
  { id:"education", label:"Education" }
];

export default function InterestsEditor({ visible, onClose }) {
  const { profile, saveProfile } = useUserProfile();
  const { watch, setValue, reset, handleSubmit } = useForm({
    defaultValues: {
      industries: profile?.interests?.industries || [],
      it_sub:     profile?.interests?.it_sub || [],
      hobbies:    profile?.interests?.hobbies || []
    }
  });

  useEffect(() => {
    if (visible) {
      reset({
        industries: profile?.interests?.industries || [],
        it_sub:     profile?.interests?.it_sub || [],
        hobbies:    profile?.interests?.hobbies || []
      });
    }
  }, [visible]);

  const onSave = async (vals) => {
    await saveProfile({ interests: vals });
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View className="flex-1 bg-white p-4">
        <Text className="text-lg font-semibold mb-3">Edit Interests</Text>

        <Text className="text-gray-900 font-semibold mb-2">Industries</Text>
        <ChipGroup
          multi options={INDUSTRIES}
          value={watch("industries")}
          onChange={(v)=>setValue("industries", v, { shouldDirty:true })}
        />

        <View className="h-3" />
        <Text className="text-gray-900 font-semibold mb-2">IT Sub-Interests</Text>
        <ChipGroup
          multi options={IT_SUB.map(s=>({id:s,label:s}))}
          value={watch("it_sub")}
          onChange={(v)=>setValue("it_sub", v, { shouldDirty:true })}
        />

        <View className="h-3" />
        <Text className="text-gray-900 font-semibold mb-2">Hobbies</Text>
        <ChipGroup
          multi freeInput placeholder="Type a hobby and add"
          options={[]}
          value={watch("hobbies")}
          onChange={(v)=>setValue("hobbies", v, { shouldDirty:true })}
        />

        <View className="mt-auto flex-row justify-end gap-3">
          <TouchableOpacity onPress={onClose} className="px-4 py-3 rounded-2xl bg-gray-100">
            <Text className="text-gray-800 font-medium">Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleSubmit(onSave)} className="px-5 py-3 rounded-2xl bg-blue-600">
            <Text className="text-white font-semibold">Save</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
