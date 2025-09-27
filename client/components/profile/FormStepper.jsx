// client/components/profile/FormStepper.jsx
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

export default function FormStepper({ steps, activeStep, onChange }) {
  return (
    <View className="px-4 py-3">
      <View className="flex-row items-center justify-between">
        {steps.map((s, i) => {
          const active = i === activeStep;
          const done = i < activeStep;
          return (
            <TouchableOpacity key={s} onPress={()=>onChange(i)} className="flex-1 items-center">
              <View className={`w-9 h-9 rounded-full items-center justify-center ${active ? "bg-blue-600" : done ? "bg-green-500" : "bg-gray-200"}`}>
                <Text className="text-white font-bold">{i+1}</Text>
              </View>
              <Text className={`mt-1 text-xs ${active ? "text-blue-600 font-semibold" : "text-gray-500"}`}>{s}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
      <View className="mt-3 h-1 bg-gray-100 rounded-full">
        <View className="h-1 bg-blue-600 rounded-full" style={{ width: `${(activeStep/(steps.length-1))*100}%` }} />
      </View>
    </View>
  );
}
