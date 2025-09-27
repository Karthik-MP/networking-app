// client/components/profile/Dropdown.jsx
import React, { useMemo, useState } from "react";
import { View, Text, TouchableOpacity, Modal, TextInput, FlatList } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function Dropdown({ label, items=[], value, onSelect, disabled=false }) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");

  const selectedLabel = useMemo(()=>{
    const found = items.find(i=>i.id===value);
    return found?.label || value || "";
  }, [items, value]);

  const filtered = useMemo(()=>{
    const qq = q.trim().toLowerCase();
    return items.filter(i=>i.label.toLowerCase().includes(qq));
  }, [q, items]);

  return (
    <View className="mb-3">
      {label ? <Text className="text-gray-700 mb-1">{label}</Text> : null}
      <TouchableOpacity
        disabled={disabled}
        onPress={()=>setOpen(true)}
        className={`border rounded-2xl px-4 py-3 flex-row justify-between items-center ${disabled ? "bg-gray-100 border-gray-100" : "bg-white border-gray-200"}`}
      >
        <Text className={`${selectedLabel ? "text-gray-900" : "text-gray-400"}`}>
          {selectedLabel || "Select..."}
        </Text>
        <Ionicons name="chevron-down" size={18} color="#6b7280" />
      </TouchableOpacity>

      <Modal visible={open} animationType="slide" onRequestClose={()=>setOpen(false)}>
        <View className="flex-1 bg-white">
          <View className="px-4 py-3 border-b border-gray-100 flex-row items-center justify-between">
            <Text className="text-lg font-semibold">{label || "Select"}</Text>
            <TouchableOpacity onPress={()=>setOpen(false)}><Text className="text-blue-600 font-medium">Close</Text></TouchableOpacity>
          </View>
          <View className="px-4 py-2">
            <TextInput
              placeholder="Search..."
              value={q}
              onChangeText={setQ}
              className="bg-gray-50 border border-gray-200 px-4 py-3 rounded-2xl"
            />
          </View>
          <FlatList
            data={filtered}
            keyExtractor={(i)=>String(i.id)}
            renderItem={({item})=>(
              <TouchableOpacity
                onPress={()=>{
                  onSelect(item.id);
                  setOpen(false);
                  setQ("");
                }}
                className="px-4 py-3 border-b border-gray-100"
              >
                <Text className="text-gray-900">{item.label}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </Modal>
    </View>
  );
}
