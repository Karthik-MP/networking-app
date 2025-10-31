import { useContext, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  Image,
  Alert,
  Platform,
  Modal,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import * as ImagePicker from "expo-image-picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";

import AuthContext from "../context/AuthContext";
import LocationPicker from "../components/Location/LocationPicker";
import Dropdown from "../components/Dropdown";
import {
  createEventWithUploads
} from "../services/eventService";

const EVENT_TYPES = [
  { id: "meetup", label: "Meetup" },
  { id: "function", label: "Function" },
  { id: "knowledge_sharing", label: "Knowledge Sharing" },
];

const VENUE_MODES = [
  { id: "in_person", label: "In person" },
  { id: "online", label: "Online" },
];

const TIMEZONES = [
  // keep short for now; you can expand
  { id: "Asia/Kolkata", label: "Asia/Kolkata (IST)" },
  { id: "America/New_York", label: "America/New_York (ET)" },
  { id: "America/Los_Angeles", label: "America/Los_Angeles (PT)" },
  { id: "UTC", label: "UTC" },
];

export default function EventCreateScreen({ navigation }) {
  const { user } = useContext(AuthContext) || {};

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    getValues,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      type: "meetup",
      name: "",
      venue: {
        mode: "in_person",
        location: { country: "", state: "", city: "", zip: "" }, // for in_person
        meetingLink: "", // for online
      },
      timezone: "Asia/Kolkata", // ask user
      eventDate: null,
      eventTime: null,
      postersLocal: [], // local URIs (upload on save)
      description: "",
      hostName: "",
      guest: "",
      capacity: "",
      commentsEnabled: true,
      // temp picker for LocationPicker (won’t be saved directly)
      // venueTemp: { country: "", state: "", city: "", zip: "" },
    },
    mode: "onSubmit",
  });

  const venueMode = watch("venue.mode");
  const postersLocal = watch("postersLocal");
  const eventDate = watch("eventDate");
  const eventTime = watch("eventTime");

  // ---- Date & time pickers (no flicker) ----
  const DateField = ({ name, label, minDate }) => {
    const value = watch(name);
    const [show, setShow] = useState(false);
    const onChange = (_, selectedDate) => {
      if (Platform.OS === "android") setShow(false);
      if (selectedDate) setValue(name, selectedDate, { shouldValidate: true });
    };
    return (
      <View className="mb-4">
        <Text className="font-semibold mb-2">
          {label} <Text className="text-red-500">*</Text>
        </Text>
        <Pressable
          onPress={() => setShow(true)}
          className="h-12 rounded-2xl border border-black px-4 flex-row items-center justify-between bg-white"
        >
          <Text>{value ? new Date(value).toDateString() : "Select date..."}</Text>
          <Ionicons name="calendar-outline" size={18} color="#6b7280" />
        </Pressable>
        {show && (Platform.OS === "ios" ? (
          <Modal transparent animationType="fade" visible={show}>
            <Pressable className="flex-1 bg-black/40" onPress={() => setShow(false)} />
            <View className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl p-3">
              <View className="h-1 w-12 bg-gray-300 self-center rounded-full my-2" />
              <DateTimePicker
                value={value || new Date()}
                mode="date"
                display="spinner"
                minimumDate={minDate}
                onChange={onChange}
              />
              <Pressable onPress={() => setShow(false)} className="mt-2 p-4 rounded-xl bg-black items-center">
                <Text className="text-white">Done</Text>
              </Pressable>
            </View>
          </Modal>
        ) : (
          <DateTimePicker
            value={value || new Date()}
            mode="date"
            display="default"
            minimumDate={minDate}
            onChange={onChange}
          />
        ))}
        {errors?.[name]?.message ? (
          <Text className="text-red-600 text-sm mt-1">{errors[name].message}</Text>
        ) : null}
      </View>
    );
  };

  const TimeField = ({ name, label }) => {
    const value = watch(name);
    const [show, setShow] = useState(false);
    const onChange = (_, selectedDate) => {
      if (Platform.OS === "android") setShow(false);
      if (selectedDate) setValue(name, selectedDate, { shouldValidate: true });
    };
    return (
      <View className="mb-4">
        <Text className="font-semibold mb-2">
          {label} <Text className="text-red-500">*</Text>
        </Text>
        <Pressable
          onPress={() => setShow(true)}
          className="h-12 rounded-2xl border border-black px-4 flex-row items-center justify-between bg-white"
        >
          <Text>
            {value ? new Date(value).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "Select time..."}
          </Text>
          <Ionicons name="time-outline" size={18} color="#6b7280" />
        </Pressable>
        {show && (Platform.OS === "ios" ? (
          <Modal transparent animationType="fade" visible={show}>
            <Pressable className="flex-1 bg-black/40" onPress={() => setShow(false)} />
            <View className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl p-3">
              <View className="h-1 w-12 bg-gray-300 self-center rounded-full my-2" />
              <DateTimePicker
                value={value || new Date()}
                mode="time"
                display="spinner"
                onChange={onChange}
              />
              <Pressable onPress={() => setShow(false)} className="mt-2 p-4 rounded-xl bg-black items-center">
                <Text className="text-white">Done</Text>
              </Pressable>
            </View>
          </Modal>
        ) : (
          <DateTimePicker
            value={value || new Date()}
            mode="time"
            display="default"
            onChange={onChange}
          />
        ))}
        {errors?.[name]?.message ? (
          <Text className="text-red-600 text-sm mt-1">{errors[name].message}</Text>
        ) : null}
      </View>
    );
  };

  // ---- Posters (JPEG only, <= 3MB) ----
  const pickPoster = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (perm.status !== "granted") {
      Alert.alert("Permission required", "Please allow media library access.");
      return;
    }
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: false, // pick one-at-a-time for consistency
      quality: 0.9,
    });
    if (res.canceled) return;

    const asset = res.assets?.[0];
    if (!asset) return;

    // Validate JPEG and size
    const uri = asset.uri || "";
    const fileName = uri.split("/").pop() || "poster.jpg";
    const lower = fileName.toLowerCase();
    if (!(lower.endsWith(".jpg") || lower.endsWith(".jpeg"))) {
      Alert.alert("Invalid file", "Please select a JPEG (.jpg or .jpeg).");
      return;
    }

    // We can’t always read size from asset; try fetch HEAD
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      const sizeMB = blob.size / (1024 * 1024);
      if (sizeMB > 3) {
        Alert.alert("Too large", "Max size is 3 MB.");
        return;
      }
    } catch {
      // If size check fails for local asset, let it pass conservatively
    }

    const next = [...(postersLocal || []), { uri, fileName }];
    setValue("postersLocal", next, { shouldValidate: true });
  };

  const removePosterAt = (idx) => {
    const next = (postersLocal || []).filter((_, i) => i !== idx);
    setValue("postersLocal", next, { shouldValidate: true });
  };

  // ---- Venue helpers ----
  // const venueTempPrefix = "venueTemp";
  // const applyVenueFromPicker = () => {
  //   const temp = {
  //     country: watch(`${venueTempPrefix}.country`),
  //     state: watch(`${venueTempPrefix}.state`),
  //     city: watch(`${venueTempPrefix}.city`),
  //     zip: watch(`${venueTempPrefix}.zip`),
  //   };
  //   if (!temp.country || !temp.state || !temp.city || !temp.zip) {
  //     Alert.alert("Location", "Fill country, state, city, and zip first.");
  //     return;
  //   }
  //   const label = [temp.city, temp.state, temp.country].filter(Boolean).join(", ") + ` ${temp.zip}`;
  //   setValue("venue.location", { ...temp, label }, { shouldValidate: true });

  //   // reset temp fields
  //   setValue(`${venueTempPrefix}.country`, "");
  //   setValue(`${venueTempPrefix}.state`, "");
  //   setValue(`${venueTempPrefix}.city`, "");
  //   setValue(`${venueTempPrefix}.zip`, "");
  //   clearErrors([`${venueTempPrefix}.country`, `${venueTempPrefix}.state`, `${venueTempPrefix}.city`, `${venueTempPrefix}.zip`]);
  // };

  // ---- Submit ----
  const onSubmit = async (values) => {
    // console.log("VALID EVENT SUBMIT:", JSON.stringify(values, null, 2));

    // Required: venue per mode
    if (values.venue.mode === "online") {
      try { new URL(values.venue.meetingLink); } catch {
        Alert.alert("Validation", "Please enter a valid meeting link URL.");
        return;
      }
    } else {
      if (!values.venue?.location) {
        Alert.alert("Validation", "Please set venue location (and tap Apply).");
        return;
      }
    }

    // DateTime combine
    if (!values.eventDate || !values.eventTime) {
      Alert.alert("Validation", "Please select date and time.");
      return;
    }
    const date = new Date(values.eventDate);
    const time = new Date(values.eventTime);
    const eventAt = new Date(
      date.getFullYear(), date.getMonth(), date.getDate(),
      time.getHours(), time.getMinutes(), 0, 0
    );

    const capacityNum = Number(values.capacity);
    if (isNaN(capacityNum) || capacityNum <= 0) {
      Alert.alert("Validation", "Capacity must be a positive number.");
      return;
    }

    // Build payload
    const payload = {
      type: values.type,
      name: values.name.trim(),
      venue: {
        mode: values.venue.mode,
        location: values.venue.mode === "in_person" ? values.venue.location : null,
        meetingLink: values.venue.mode === "online" ? values.venue.meetingLink.trim() : null,
      },
      timezone: values.timezone,
      eventAt,                              // JS Date; service will convert to Timestamp
      description: values.description.trim(),
      hostName: values.hostName.trim(),
      guest: values.guest?.trim() || "",
      capacity: capacityNum,
      commentsEnabled: !!values.commentsEnabled,
      status: "active",
    };

    try {
      await createEventWithUploads(payload, postersLocal, user);
      Alert.alert("Success", "Event created.");
      navigation?.goBack?.();
    } catch (e) {
      console.error(e);
      Alert.alert("Error", "Failed to create event. Please try again.");
    }
  };

  const onInvalid = (errs) => {
    // console.log("INVALID EVENT SUBMIT:", JSON.stringify(getValues(), null, 2));
    // console.log("EVENT ERRORS:", JSON.stringify(errs, null, 2));
    Alert.alert("Validation", "Please fix the highlighted fields.");
  };

  return (
    <View className="flex-1 bg-white">
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text className="text-xl font-semibold mb-2">Create Event</Text>
        <Text className="text-gray-600 mb-4">Share meetups, functions, and knowledge sessions</Text>

        {/* Event Type */}
        <Controller
          control={control}
          name="type"
          rules={{ required: "Event type is required" }}
          render={({ field: { value, onChange } }) => (
            <View className="mb-3">
              <Text className="font-semibold mb-2">
                Type <Text className="text-red-500">*</Text>
              </Text>
              <Dropdown
                label="Select event type"
                items={EVENT_TYPES}
                value={value}
                onSelect={onChange}
              />
              {errors.type?.message && <Text className="text-red-600 text-sm mt-1">{errors.type.message}</Text>}
            </View>
          )}
        />

        {/* Event Name */}
        <Controller
          control={control}
          name="name"
          rules={{ required: "Event name is required" }}
          render={({ field: { value, onChange } }) => (
            <View className="mb-3">
              <Text className="font-semibold mb-2">
                Event Name <Text className="text-red-500">*</Text>
              </Text>
              <TextInput
                value={value}
                onChangeText={onChange}
                placeholder="e.g., Bengaluru Tech Meetup"
                className="h-12 rounded-2xl border border-black px-4 bg-white"
              />
              {errors.name?.message && <Text className="text-red-600 text-sm mt-1">{errors.name.message}</Text>}
            </View>
          )}
        />

        {/* Venue Mode */}
        <Controller
          control={control}
          name="venue.mode"
          rules={{ required: "Venue mode is required" }}
          render={({ field: { value, onChange } }) => (
            <View className="mb-3">
              <Text className="font-semibold mb-2">
                Venue <Text className="text-red-500">*</Text>
              </Text>
              <Dropdown
                label="Select venue"
                items={VENUE_MODES}
                value={value}
                onSelect={onChange}
              />
            </View>
          )}
        />

        {/* Venue Details */}
        {venueMode === "in_person" ? (
          <View className="mb-4">
            <LocationPicker
              control={control}
              setValue={setValue}
              watch={watch}
              namePrefix={`venue.location`}
              label="Venue Location"
              required={false} // temp fields, non-blocking
            />
            {/* <Pressable
              onPress={applyVenueFromPicker}
              className="mt-2 h-11 rounded-xl bg-black items-center justify-center"
            >
              <Text className="text-white font-medium">Apply Location</Text>
            </Pressable> */}

            {/* Display chosen label */}
            {/* {watch("venue.location.label") ? (
              <Text className="mt-2 text-gray-700">
                Selected: {watch("venue.location.label")}
              </Text>
            ) : null} */}
          </View>
        ) : (
          <Controller
            control={control}
            name="venue.meetingLink"
            rules={{ required: "Meeting link is required for online events" }}
            render={({ field: { value, onChange } }) => (
              <View className="mb-3">
                <Text className="font-semibold mb-2">
                  Meeting Link <Text className="text-red-500">*</Text>
                </Text>
                <TextInput
                  value={value}
                  onChangeText={onChange}
                  autoCapitalize="none"
                  keyboardType="url"
                  placeholder="https://meet.google.com/..."
                  className="h-12 rounded-2xl border border-black px-4 bg-white"
                />
                {errors?.venue?.meetingLink?.message && (
                  <Text className="text-red-600 text-sm mt-1">
                    {errors.venue.meetingLink.message}
                  </Text>
                )}
              </View>
            )}
          />
        )}

        {/* Timezone */}
        <Controller
          control={control}
          name="timezone"
          rules={{ required: "Timezone is required" }}
          render={({ field: { value, onChange } }) => (
            <View className="mb-3">
              <Text className="font-semibold mb-2">
                Timezone <Text className="text-red-500">*</Text>
              </Text>
              <Dropdown
                label="Select timezone"
                items={TIMEZONES}
                value={value}
                onSelect={onChange}
              />
              {errors.timezone?.message && <Text className="text-red-600 text-sm mt-1">{errors.timezone.message}</Text>}
            </View>
          )}
        />

        {/* Date & Time */}
        <DateField name="eventDate" label="Event Date" minDate={new Date()} />
        <TimeField name="eventTime" label="Event Time" />

        {/* Posters */}
        <View className="mb-4">
          <Text className="text-lg font-semibold mb-2">Event Posters</Text>
          <Pressable
            onPress={pickPoster}
            className="h-11 rounded-xl bg-black items-center justify-center mb-3"
          >
            <Text className="text-white font-medium">Add Poster (JPEG ≤ 3MB)</Text>
          </Pressable>

          <View className="flex-row flex-wrap">
            {(postersLocal || []).map((p, idx) => (
              <View key={`${p.uri}-${idx}`} className="mr-3 mb-3">
                <Image source={{ uri: p.uri }} style={{ width: 96, height: 96, borderRadius: 12 }} />
                <Pressable onPress={() => removePosterAt(idx)} className="mt-1 items-center">
                  <Text className="text-red-600">Remove</Text>
                </Pressable>
              </View>
            ))}
          </View>
        </View>

        {/* Description */}
        <Controller
          control={control}
          name="description"
          rules={{ required: "Description is required" }}
          render={({ field: { value, onChange } }) => (
            <View className="mb-4">
              <Text className="font-semibold mb-2">
                Description <Text className="text-red-500">*</Text>
              </Text>
              <TextInput
                value={value}
                onChangeText={onChange}
                placeholder="What is this event about?"
                multiline
                numberOfLines={5}
                textAlignVertical="top"
                className="min-h-[120px] rounded-2xl border border-black px-4 py-3 bg-white"
              />
              {errors.description?.message && (
                <Text className="text-red-600 text-sm mt-1">{errors.description.message}</Text>
              )}
            </View>
          )}
        />

        {/* Host & Guest */}
        <Controller
          control={control}
          name="hostName"
          rules={{ required: "Host name is required" }}
          render={({ field: { value, onChange } }) => (
            <View className="mb-3">
              <Text className="font-semibold mb-2">
                Host Name <Text className="text-red-500">*</Text>
              </Text>
              <TextInput
                value={value}
                onChangeText={onChange}
                placeholder="e.g., Karnataka Indian Student Org"
                className="h-12 rounded-2xl border border-black px-4 bg-white"
              />
              {errors.hostName?.message && <Text className="text-red-600 text-sm mt-1">{errors.hostName.message}</Text>}
            </View>
          )}
        />

        <Controller
          control={control}
          name="guest"
          render={({ field: { value, onChange } }) => (
            <View className="mb-3">
              <Text className="font-semibold mb-2">Guest (optional)</Text>
              <TextInput
                value={value}
                onChangeText={onChange}
                placeholder="e.g., Special Speaker"
                className="h-12 rounded-2xl border border-black px-4 bg-white"
              />
            </View>
          )}
        />

        {/* Capacity */}
        <Controller
          control={control}
          name="capacity"
          rules={{ required: "Capacity is required" }}
          render={({ field: { value, onChange } }) => (
            <View className="mb-3">
              <Text className="font-semibold mb-2">
                Limit number of spots <Text className="text-red-500">*</Text>
              </Text>
              <TextInput
                keyboardType="numeric"
                value={String(value ?? "")}
                onChangeText={onChange}
                placeholder="e.g., 100"
                className="h-12 rounded-2xl border border-black px-4 bg-white"
              />
              {errors.capacity?.message && <Text className="text-red-600 text-sm mt-1">{errors.capacity.message}</Text>}
            </View>
          )}
        />

        {/* Disable comments */}
        <Controller
          control={control}
          name="commentsEnabled"
          render={({ field: { value, onChange } }) => (
            <View className="mb-6 flex-row items-center justify-between">
              <Text className="font-semibold">Enable comments</Text>
              <Pressable
                onPress={() => onChange(!value)}
                className={`w-12 h-7 rounded-full ${value ? "bg-green-600" : "bg-gray-300"} items-${value ? "end" : "start"} justify-center px-1`}
              >
                <View className="w-5 h-5 bg-white rounded-full" />
              </Pressable>
            </View>
          )}
        />

        {/* Save */}
        <Pressable
          disabled={isSubmitting}
          onPress={handleSubmit(onSubmit, (e) => {
            // console.log("INVALID EVENT SUBMIT:", JSON.stringify(getValues(), null, 2));
            // console.log("EVENT ERRORS:", JSON.stringify(e, null, 2));
            Alert.alert("Validation", "Please fix the highlighted fields.");
          })}
          className="h-12 rounded-2xl bg-black items-center justify-center mb-8"
        >
          <Text className="text-white font-medium">
            {isSubmitting ? "Saving..." : "Create Event"}
          </Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}
