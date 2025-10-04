import React, { useContext, useMemo, useState, useEffect } from "react";
import { View, Text, Image, Pressable, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AuthContext from "../context/AuthContext";
import { registerForEvent, reactToEvent } from "../services/eventService";
import { onSnapshot, doc } from "firebase/firestore";
import { db } from "../services/firebase";

export default function EventCard({ event }) {
  const { user } = useContext(AuthContext) || {};
  const [liveEvent, setLiveEvent] = useState(event);

  // Live updates (metrics)
  useEffect(() => {
    const unsub = onSnapshot(doc(db, "events", event.id), (snap) => {
      if (snap.exists()) setLiveEvent({ id: snap.id, ...snap.data() });
    });
    return unsub;
  }, [event.id]);

  const firstPoster = liveEvent.posters?.[0];
  const dateStr = useMemo(() => {
    try {
      const d = liveEvent.eventAt?.toDate
        ? liveEvent.eventAt.toDate()
        : new Date(liveEvent.eventAt);
      return `${d.toDateString()} • ${d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} ${liveEvent.timezone}`;
    } catch {
      return "";
    }
  }, [liveEvent.eventAt, liveEvent.timezone]);

  const spotsLeft = useMemo(() => {
    const reg = liveEvent.metrics?.registrations || 0;
    return Math.max(0, (liveEvent.capacity || 0) - reg);
  }, [liveEvent.metrics, liveEvent.capacity]);

  const onRegister = async () => {
    try {
      await registerForEvent(liveEvent.id, user);
      Alert.alert("Registered", "You're in!");
    } catch (e) {
      Alert.alert("Cannot register", e.message || "Please try again.");
    }
  };

  const doReact = async (type) => {
    try {
      await reactToEvent(liveEvent.id, user, type);
    } catch (e) {
      Alert.alert("Action failed", "Please try again.");
    }
  };

  return (
    <View className="bg-white rounded-2xl mb-4 border border-gray-200">
      {firstPoster ? (
        <Image
          source={{ uri: firstPoster }}
          style={{
            width: "100%",
            height: 180,
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
          }}
        />
      ) : (
        <View className="w-full h-40 bg-gray-100 rounded-t-2xl items-center justify-center">
          <Ionicons name="image-outline" size={28} color="#9ca3af" />
        </View>
      )}

      <View className="p-4">
        <Text className="text-lg font-semibold mb-1">{liveEvent.name}</Text>
        <Text className="text-gray-600 mb-2">{dateStr}</Text>

        <Text className="text-gray-700 mb-1">
          {liveEvent.venue?.mode === "online"
            ? `Online • ${liveEvent.venue?.meetingLink?.replace(/^https?:\/\//, "")}`
            : `Venue • ${liveEvent.venue?.location?.label}`}
        </Text>

        <Text className="text-gray-600 mb-3">
          Posted by {liveEvent.createdBy?.displayName || "Someone"}
        </Text>

        {/* CTA row */}
        <View className="flex-row items-center justify-between">
          <View className="flex-row gap-3">
            <Pressable
              onPress={() => doReact("like")}
              className="flex-row items-center gap-1 px-3 py-2 rounded-xl bg-gray-100"
            >
              <Ionicons name="thumbs-up-outline" size={18} color="#111827" />
              <Text>{liveEvent.metrics?.reactions?.like || 0}</Text>
            </Pressable>
            <Pressable
              onPress={() => doReact("insightful")}
              className="flex-row items-center gap-1 px-3 py-2 rounded-xl bg-gray-100"
            >
              <Ionicons name="bulb-outline" size={18} color="#111827" />
              <Text>{liveEvent.metrics?.reactions?.insightful || 0}</Text>
            </Pressable>
            <Pressable
              onPress={() => doReact("interested")}
              className="flex-row items-center gap-1 px-3 py-2 rounded-xl bg-gray-100"
            >
              <Ionicons name="eye-outline" size={18} color="#111827" />
              <Text>{liveEvent.metrics?.reactions?.interested || 0}</Text>
            </Pressable>
          </View>

          <View className="flex-row gap-2">
            {/* Dummy buttons for now */}
            <Pressable
              onPress={() => Alert.alert("Comments", "Coming soon")}
              className="px-3 py-2 rounded-xl bg-gray-100"
            >
              <Text>Comments</Text>
            </Pressable>
            <Pressable
              onPress={() => Alert.alert("Share", "Share sheet coming soon")}
              className="px-3 py-2 rounded-xl bg-gray-100"
            >
              <Text>Share</Text>
            </Pressable>
          </View>
        </View>

        {/* Register */}
        <View className="mt-3 flex-row items-center justify-between">
          <Text className="text-gray-700">
            Spots left: {spotsLeft}/{liveEvent.capacity}
          </Text>
          <Pressable
            disabled={spotsLeft <= 0}
            onPress={onRegister}
            className={`px-4 py-2 rounded-xl ${spotsLeft > 0 ? "bg-black" : "bg-gray-300"}`}
          >
            <Text
              className={`font-medium ${spotsLeft > 0 ? "text-white" : "text-gray-600"}`}
            >
              {spotsLeft > 0 ? "Register" : "Full"}
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
