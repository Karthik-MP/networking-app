// components/CreateMenuSheet.jsx
import React, { useCallback } from "react";
import { Modal, View, Pressable, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function CreateMenuSheet({
  visible,
  onClose,
  onCreateJobReferral,
  onCreateEvent,
}) {
  const close = useCallback(() => onClose?.(), [onClose]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={close}
    >
      {/* Backdrop */}
      <Pressable className="flex-1 bg-black/40" onPress={close} />

      {/* Sheet */}
      <View className="absolute bottom-0 left-0 right-0 rounded-t-3xl bg-white dark:bg-zinc-900 p-5">
        <View className="h-1 w-12 bg-zinc-300 dark:bg-zinc-700 self-center rounded-full mb-4" />

        <Text className="text-xl font-semibold text-zinc-900 dark:text-white mb-2">
          Create
        </Text>
        <Text className="text-zinc-500 dark:text-zinc-400 mb-4">
          Choose what you want to share with the community
        </Text>

        <Pressable
          onPress={onCreateJobReferral}
          className="flex-row items-center gap-3 p-4 rounded-2xl bg-zinc-100 dark:bg-zinc-800 mb-3"
        >
          <View className="w-10 h-10 rounded-xl bg-zinc-900 dark:bg-white items-center justify-center">
            <Ionicons name="briefcase-outline" size={22} color="#fff" />
          </View>
          <View className="flex-1">
            <Text className="text-base font-medium text-zinc-900 dark:text-white">
              Create a job referral
            </Text>
            <Text className="text-sm text-zinc-500 dark:text-zinc-400">
              Post details (title, company, location, JD, dates, limits…)
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#a1a1aa" />
        </Pressable>

        <Pressable
          onPress={onCreateEvent}
          className="flex-row items-center gap-3 p-4 rounded-2xl bg-zinc-100 dark:bg-zinc-800"
        >
          <View className="w-10 h-10 rounded-xl bg-zinc-900 dark:bg-white items-center justify-center">
            <Ionicons name="calendar-outline" size={22} color="#fff" />
          </View>
          <View className="flex-1">
            <Text className="text-base font-medium text-zinc-900 dark:text-white">
              Create an event
            </Text>
            <Text className="text-sm text-zinc-500 dark:text-zinc-400">
              Share meetups, workshops, info sessions
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#a1a1aa" />
        </Pressable>

        <Pressable
          onPress={close}
          className="mt-4 py-4 rounded-2xl bg-zinc-200 dark:bg-zinc-800 items-center"
        >
          <Text className="text-base font-medium text-zinc-800 dark:text-zinc-200">
            Cancel
          </Text>
        </Pressable>
      </View>
    </Modal>
  );
}
