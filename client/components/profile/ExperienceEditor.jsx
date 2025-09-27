import React, { useEffect } from "react";
import { Modal, View, Text, TouchableOpacity, TextInput } from "react-native";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { useUserProfile } from "../../hooks/useUserProfile";
import Dropdown from "../Dropdown";
import LocationPicker from "../Location/LocationPicker";
import YearRangePicker from "./YearRangePicker";

const COUNTRIES = [{id:"US",label:"United States"},{id:"IN",label:"India"},{id:"CA",label:"Canada"},{id:"UK",label:"United Kingdom"}];
const STATES  = { US:["New York","California","Texas","Massachusetts"], IN:["Karnataka","Maharashtra","Tamil Nadu","Telangana"], CA:["Ontario","Quebec","British Columbia"], UK:["England","Scotland","Wales"] };
const ROLES   = ["Intern","Junior","Mid","Senior","Lead","Manager","Founder","CEO","CTO","Other"];
const INDUSTRIES = [
  { id:"it", label:"IT / Software" }, { id:"finance", label:"Finance" },
  { id:"fashion", label:"Fashion" },   { id:"healthcare", label:"Healthcare" },
  { id:"education", label:"Education" }
];

export default function ExperienceEditor({ visible, onClose }) {
  const { profile, saveProfile } = useUserProfile();
  const { control, setValue, reset, watch, handleSubmit } = useForm({
    defaultValues: { experience: profile?.experience || [] }
  });
  const { fields, append, remove } = useFieldArray({ control, name: "experience" });

  useEffect(() => {
    if (visible) reset({ experience: profile?.experience || [] });
  }, [visible]);

  const onSave = async (vals) => { await saveProfile({ experience: vals.experience }); onClose(); };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View className="flex-1 bg-white p-4">
        <Text className="text-lg font-semibold mb-3">Edit Experience</Text>

        {fields.map((f, idx) => (
          <View key={f.id} className="bg-gray-50 rounded-2xl p-3 mb-3">
            <Controller
              control={control}
              name={`experience.${idx}.company_name`}
              rules={{ required: "Company name is required" }}
              render={({ field: { onChange, value } }) => (
                <TextInput placeholder="Company name" value={value} onChangeText={onChange}
                  className="bg-white border border-gray-200 rounded-2xl px-4 py-3 mb-2" />
              )}
            />
            <Dropdown
              label="Role / Position"
              items={ROLES.map(r=>({id:r,label:r}))}
              value={watch(`experience.${idx}.role`) || "Senior"}
              onSelect={(v)=>setValue(`experience.${idx}.role`, v, { shouldDirty:true })}
            />
            <Dropdown
              label="Industry"
              items={INDUSTRIES}
              value={watch(`experience.${idx}.industry`) || "it"}
              onSelect={(v)=>setValue(`experience.${idx}.industry`, v, { shouldDirty:true })}
            />
            <LocationPicker
              control={control}
              setValue={setValue}
              watch={watch}
              namePrefix={`experience.${idx}.location`}
              label="Work Location"
              countries={COUNTRIES}
              statesByCountry={STATES}
              required
            />
            <YearRangePicker
              label="Duration"
              start={watch(`experience.${idx}.duration.start_year`)}
              end={watch(`experience.${idx}.duration.end_year`)}
              onChange={(s,e)=>{
                setValue(`experience.${idx}.duration.start_year`, s, { shouldDirty:true });
                setValue(`experience.${idx}.duration.end_year`, e, { shouldDirty:true });
              }}
            />
            <TouchableOpacity onPress={()=>remove(idx)} className="mt-2 self-end px-3 py-2 rounded-xl bg-red-100">
              <Text className="text-red-600 font-medium">Remove</Text>
            </TouchableOpacity>
          </View>
        ))}

        <View className="flex-row justify-between mt-1">
          <TouchableOpacity onPress={()=>append({
            company_name:"", role:"Senior", industry:"it",
            location:{country:"",state:"",city:"",zip:""},
            duration:{start_year:"",end_year:""}
          })} className="px-4 py-3 rounded-2xl bg-gray-200">
            <Text className="text-gray-800 font-medium">Add Experience</Text>
          </TouchableOpacity>

          <View className="flex-row gap-3">
            <TouchableOpacity onPress={onClose} className="px-4 py-3 rounded-2xl bg-gray-100">
              <Text className="text-gray-800 font-medium">Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleSubmit(onSave)} className="px-5 py-3 rounded-2xl bg-blue-600">
              <Text className="text-white font-semibold">Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
