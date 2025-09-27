// client/components/ProfileAvatar.jsx
import React, { useState } from "react";
import {
  View,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Text,
  StyleSheet,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import { useUserProfile } from "../hooks/useUserProfile";
import { auth } from "../services/firebase";
import ImageProcessor from "./ImageProcessor";

export default function ProfileAvatar({ size = 100, showCompletion = true }) {
  const { profile, uploadAvatar, completion } = useUserProfile();
  const [busy, setBusy] = useState(false);

  const onPick = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5, // Reduced quality
      allowsMultipleSelection: false,
    });

    if (result.canceled) return;

    try {
      setBusy(true);
      const uri = result.assets?.[0]?.uri;
      if (uri) await uploadAvatar(uri);
    } catch(error){
      console.error("Error uploading avatar", error);
    }finally {
      setBusy(false);
    }
  };

  const uri = profile?.photoURL;
  const defaultImage = require("../assets/avatar.jpg");
  const [pickedUri, setPickedUri] = useState(null);

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onPick} disabled={busy} activeOpacity={0.8}>
        <AnimatedCircularProgress
          size={size}
          width={6}
          fill={completion}
          tintColor="#00e0ff"
          backgroundColor="#e5e7eb"
          rotation={0}
          lineCap="round"
        >
          {() => (
            <View
              style={[
                styles.imageWrapper,
                { width: size, height: size, borderRadius: size / 2 },
              ]}
            >
              <Image
                source={uri ? { uri } : defaultImage}
                style={{ width: size, height: size, borderRadius: size / 2 }}
              />
              {busy && (
                <View style={styles.busyOverlay}>
                  <ActivityIndicator color="#fff" />
                </View>
              )}
            </View>
          )}
        </AnimatedCircularProgress>
      </TouchableOpacity>

      {/* ImageProcessor will run as a hidden component when pickedUri is set */}
      {pickedUri && (
        <ImageProcessor
          source={pickedUri}
          onProcessed={async (result) => {
            setBusy(true);
            try {
              const currentUser = auth.currentUser;
              const downloadURL = await uploadAvatar(
                result.uri,
                currentUser.uid
              );
              // clear pickedUri on success
              setPickedUri(null);
            } catch (e) {
              console.error("Error uploading processed image:", e);
              alert("Upload failed");
            } finally {
              setBusy(false);
            }
          }}
          onError={(e) => {
            console.error("Image processing error:", e);
            alert("Image processing failed.");
            setPickedUri(null);
          }}
        />
      )}

      {showCompletion && (
        <View style={styles.textWrapper}>
          {/* <Text style={styles.completionText}>{completion}% complete</Text> */}
          {!uri && (
            <Text style={styles.hintText}>
              Add a profile photo to unlock 100%
            </Text>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  imageWrapper: {
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  busyOverlay: {
    position: "absolute",
    inset: 0,
    backgroundColor: "rgba(0,0,0,0.35)",
    alignItems: "center",
    justifyContent: "center",
  },
  textWrapper: {
    marginTop: 10,
    alignItems: "center",
  },
  completionText: {
    color: "#374151",
    fontWeight: "600",
    fontSize: 14,
  },
  hintText: {
    color: "#6b7280",
    fontSize: 12,
    marginTop: 2,
  },
});
