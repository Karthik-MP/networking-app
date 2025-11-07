import React, { useMemo, useState, useEffect } from "react";
import { View, Text, Image, Pressable, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@hooks/useTheme";
import AuthContext from "@contexts/AuthContext";
import { registerForEvent, reactToEvent } from "../services/eventService";
import { onSnapshot, doc } from "firebase/firestore";
import { db } from "@services/firebase";

export default function EventCard({ event }) {
  const { theme } = React.useContext(AuthContext) ?? {};
  const { dark, backgroundColor, textColor, border } = useTheme();

  const { user } = React.useContext(AuthContext) || {};
  const [liveEvent, setLiveEvent] = useState(event);

  // Live updates (Firebase snapshot)
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
      return `${d.toDateString()} • ${d.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })} ${liveEvent.timezone}`;
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
    <View
      className={`rounded-2xl mb-4 border ${backgroundColor.cardPrimary} ${border.primary}`}
    >
      {/* Poster image */}
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
        <View
          className={`w-full h-40 rounded-t-2xl items-center justify-center ${backgroundColor.cardSecondary}`}
        >
          <Ionicons
            name="image-outline"
            size={28}
            color={dark ? "#9ca3af" : "#64748b"}
          />
        </View>
      )}

      {/* Card content */}
      <View className="p-4">
        <Text className={`text-lg font-semibold mb-1 ${textColor.primary}`}>
          {liveEvent.name}
        </Text>
        <Text className={`mb-2 ${textColor.tertiary}`}>{dateStr}</Text>

        <Text className={`mb-1 ${textColor.secondary}`}>
          {liveEvent.venue?.mode === "online"
            ? `Online • ${liveEvent.venue?.meetingLink?.replace(/^https?:\/\//, "")}`
            : `Venue • ${liveEvent.venue?.location?.label}`}
        </Text>

        <Text className={`mb-3 ${textColor.tertiary}`}>
          Posted by {liveEvent.createdBy?.displayName || "Someone"}
        </Text>

        {/* Reaction row */}
        <View className="flex-row items-center justify-between">
          <View className="flex-row gap-3">
            {[
              { type: "like", icon: "thumbs-up-outline" },
              { type: "insightful", icon: "bulb-outline" },
              { type: "interested", icon: "eye-outline" },
            ].map((r) => (
              <Pressable
                key={r.type}
                onPress={() => doReact(r.type)}
                className={`flex-row items-center gap-1 px-3 py-2 rounded-xl ${backgroundColor.cardSecondary}`}
              >
                <Ionicons
                  name={r.icon}
                  size={18}
                  color={dark ? "#f1f5f9" : "#111827"}
                />
                <Text className={textColor.primary}>
                  {liveEvent.metrics?.reactions?.[r.type] || 0}
                </Text>
              </Pressable>
            ))}
          </View>

          <View className="flex-row gap-2">
            <Pressable
              onPress={() => Alert.alert("Comments", "Coming soon")}
              className={`px-3 py-2 rounded-xl ${backgroundColor.cardSecondary}`}
            >
              <Text className={textColor.secondary}>Comments</Text>
            </Pressable>
            <Pressable
              onPress={() => Alert.alert("Share", "Share sheet coming soon")}
              className={`px-3 py-2 rounded-xl ${backgroundColor.cardSecondary}`}
            >
              <Text className={textColor.secondary}>Share</Text>
            </Pressable>
          </View>
        </View>

        {/* Register button */}
        <View className="mt-3 flex-row items-center justify-between">
          <Text className={textColor.secondary}>
            Spots left: {spotsLeft}/{liveEvent.capacity}
          </Text>
          <Pressable
            disabled={spotsLeft <= 0}
            onPress={onRegister}
            className={`px-4 py-2 rounded-xl ${
              spotsLeft > 0
                ? backgroundColor.buttonPrimary
                : backgroundColor.buttonSecondary
            }`}
          >
            <Text
              className={`font-medium ${
                spotsLeft > 0 ? "text-white" : textColor.tertiary
              }`}
            >
              {spotsLeft > 0 ? "Register" : "Full"}
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
