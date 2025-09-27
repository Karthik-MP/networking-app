// client/components/profile/ChipGroup.jsx
import React, { useState } from "react";
import { View, Text, TouchableOpacity, TextInput } from "react-native";

export default function ChipGroup({ options=[], value=[], onChange, multi=true, freeInput=false, placeholder="Add item" }) {
  const [custom, setCustom] = useState("");

  const toggle = (id) => {
    if (multi) {
      onChange(value.includes(id) ? value.filter(v=>v!==id) : [...value, id]);
    } else {
      onChange([id]);
    }
  };

  return (
    <View>
      <View className="flex-row flex-wrap gap-2">
        {options.map(o=>(
          <TouchableOpacity key={o.id} onPress={()=>toggle(o.id)} className={`px-3 py-2 rounded-full border ${value.includes(o.id) ? "bg-blue-600 border-blue-600" : "border-gray-300 bg-white"}`}>
            <Text className={`${value.includes(o.id) ? "text-white" : "text-gray-800"}`}>{o.label}</Text>
          </TouchableOpacity>
        ))}
        {freeInput && (
          <View className="flex-row items-center gap-2 mt-2 w-full">
            <TextInput
              value={custom}
              onChangeText={setCustom}
              placeholder={placeholder}
              className="flex-1 bg-white border border-gray-200 rounded-2xl px-4 py-2"
            />
            <TouchableOpacity
              onPress={()=>{
                if (!custom.trim()) return;
                const id = custom.trim();
                onChange([...value, id]);
                setCustom("");
              }}
              className="px-4 py-2 rounded-2xl bg-gray-200"
            >
              <Text className="text-gray-800 font-medium">Add</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {value.length > 0 && (
        <View className="flex-row flex-wrap gap-2 mt-3">
          {value.map(v=>(
            <TouchableOpacity key={v} onPress={()=>onChange(value.filter(x=>x!==v))} className="px-3 py-2 rounded-full bg-gray-100">
              <Text className="text-gray-700">{v} ×</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}
