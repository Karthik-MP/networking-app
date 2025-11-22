import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@hooks/useTheme";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useContext, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Alert,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import AuthContext from "../contexts/AuthContext";
import { createJobReferral } from "../services/jobReferralService";

import Dropdown from "../components/Dropdown";
import LocationPicker from "../components/Location/LocationPicker";
import MultiEntryList from "../components/profile/MultiEntryList";

import {
  CURRENCY_OPTIONS,
  POSITION_OPTIONS,
  SALARY_PERIOD_OPTIONS,
  WORK_MODE_OPTIONS,
} from "../constants/JobConstant";
import { ScreenScroll } from "../components/layout/Screen";

export default function JobReferralCreateScreen({ navigation }) {
  const { user } = useContext(AuthContext) || {};

  const { dark, backgroundColor, border, textColor } = useTheme();

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      company: {
        name: "",
        locations: [],
        industry: "",
      },
      position: "",
      positionOther: "",
      workMode: "",
      salary: { amount: "", currency: "USD", period: "year" },
      jobDescription: "",
      referralApplicantsLimit: "",
      jobLink: "",
      referralDeadline: null,
      jobDeadline: null,

      // used only by LocationPicker
      jobLocations: { country: "", state: "", city: "", zip: "" },
    },
    mode: "onSubmit",
  });

  const locations = watch("company.locations");
  const position = watch("position");
  const referralDeadline = watch("referralDeadline");
  const jobLocations = "jobLocations";

  // ---- Location helpers ----
  const removeLocationAt = (idx) => {
    const next = (locations || []).filter((_, i) => i !== idx);
    setValue("company.locations", next, { shouldValidate: true });
  };

  const formatPickedLocation = (loc) => {
    if (!loc) return "";
    const { city, state, country, zip } = loc;
    const left = [city, state, country].filter(Boolean).join(", ");
    return zip ? `${left} ${zip}` : left;
  };

  const onAddLocationFromPicker = () => {
    const loc = {
      country: watch(`${jobLocations}.country`),
      state: watch(`${jobLocations}.state`),
      city: watch(`${jobLocations}.city`),
      zip: watch(`${jobLocations}.zip`),
    };
    if (!loc.country || !loc.state || !loc.city || !loc.zip) {
      Alert.alert("Add Location", "Fill country, state, city, and zip first.");
      return;
    }
    const label = formatPickedLocation(loc);
    const next = [...(locations || []), label];
    setValue("company.locations", next, { shouldValidate: true });
    // reset the picker inputs
    setValue(`${jobLocations}.country`, "");
    setValue(`${jobLocations}.state`, "");
    setValue(`${jobLocations}.city`, "");
    setValue(`${jobLocations}.zip`, "");
  };
  // console.log(getValues("company.locations"))

  // ---- Date field (no auto-open, no flicker) ----
  const DateField = ({ name, label, minDate }) => {
    const value = watch(name);
    const [show, setShow] = useState(false);

    const onChange = (_, selectedDate) => {
      if (Platform.OS === "android") setShow(false);
      if (selectedDate) setValue(name, selectedDate, { shouldValidate: true });
    };

    return (
      <View className="mb-4">
        <Text className={`font-semibold mb-2 ${textColor?.quaternary}`}>
          {label} <Text className="text-red-500">*</Text>
        </Text>

        <Pressable
          onPress={() => setShow(true)}
          className={`h-12 rounded-2xl border px-4 flex-row items-center justify-between ${border.primary} ${backgroundColor?.primary}`}
        >
          <Text className={`${textColor?.tertiary}`}>
            {value ? new Date(value).toDateString() : "Select date..."}
          </Text>
          <Ionicons name="calendar-outline" size={18} color="#6b7280" />
        </Pressable>

        {/* ANDROID: popup; iOS: use a simple modal wrapper so it doesn't render inline and flicker */}
        {show &&
          (Platform.OS === "ios" ? (
            <Modal transparent animationType="fade" visible={show}>
              <Pressable
                className="flex-1 bg-black/40"
                onPress={() => setShow(false)}
              />
              <View className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl p-3">
                <View className="h-1 w-12 bg-gray-300 self-center rounded-full my-2" />
                <DateTimePicker
                  value={value || new Date()}
                  mode="date"
                  display="spinner"
                  minimumDate={minDate}
                  onChange={onChange}
                />
                <Pressable
                  onPress={() => setShow(false)}
                  className="mt-2 p-4 rounded-xl bg-black items-center"
                >
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

        {/* error */}
        {errors?.[name]?.message ? (
          <Text className="text-red-600 text-sm mt-1">
            {errors[name].message}
          </Text>
        ) : null}
      </View>
    );
  };

  // ---- Submit handlers ----
  const onSubmit = async (values) => {
    // will only run when form is valid
    console.log("VALID SUBMIT values:", JSON.stringify(values, null, 2));

    // extra guards (kept from your logic)
    const amountNum = Number(values.salary?.amount);
    const referralLimitNum = Number(values.referralApplicantsLimit);
    const finalPosition =
      values.position === "Other" && values.positionOther
        ? values.positionOther.trim()
        : values.position;

    // URL check
    try {
      new URL(values.jobLink);
    } catch {
      Alert.alert("Validation", "Enter a valid job link URL.");
      return;
    }

    const payload = {
      company: {
        name: values.company.name.trim(),
        locations: values.company.locations.map((s) => String(s).trim()),
        industry: values.company.industry.trim(),
      },
      position: finalPosition,
      workMode: values.workMode,
      salary: {
        amount: amountNum,
        currency: values.salary.currency,
        period: values.salary.period,
      },
      jobDescription: values.jobDescription.trim(),
      referralApplicantsLimit: referralLimitNum,
      jobLink: values.jobLink.trim(),
      referralDeadline: values.referralDeadline,
      jobDeadline: values.jobDeadline,
    };

    try {
      await createJobReferral(payload, user);
      Alert.alert("Success", "Job referral created.");
      navigation?.goBack?.();
    } catch (e) {
      console.error(e);
      Alert.alert("Error", "Failed to create job referral. Please try again.");
    }
  };

  const onInvalid = (formErrors) => {
    // will run when form is invalid
    const currentValues = getValues();
    console.log(
      "INVALID SUBMIT values:",
      JSON.stringify(currentValues, null, 2)
    );
    console.log("ERRORS:", JSON.stringify(formErrors, null, 2));
    Alert.alert("Validation", "Please fix the highlighted fields.");
  };

  return (
    <ScreenScroll className="flex-1">
      <View className="flex-1">
        <View className="px-4 pt-4 pb-2">
          <Text className={`text-xl font-semibold ${textColor?.quaternary}`}>
            Create Job Referral
          </Text>
          <Text className={`text-sm ${textColor?.tertiary}`}>
            Share a referral opportunity with the community
          </Text>
        </View>

        <View className="h-[1px] my-3" />

        <View className="px-4">
          {/* Position (primary) */}
          <Controller
            control={control}
            name="position"
            rules={{ required: "Position is required" }}
            render={({ field: { value, onChange } }) => (
              <View className="mb-2">
                <Text className={`font-semibold mb-2 ${textColor?.quaternary}`}>
                  Position <Text className="text-red-500">*</Text>
                </Text>
                <Dropdown
                  label="Select position"
                  items={POSITION_OPTIONS.map((p) => ({ id: p, label: p }))}
                  value={value}
                  onSelect={onChange}
                />
                {errors.position?.message ? (
                  <Text className="text-red-600 text-sm mt-1">
                    {errors.position.message}
                  </Text>
                ) : null}
              </View>
            )}
          />

          {position === "Other" && (
            <Controller
              control={control}
              name="positionOther"
              rules={{ required: "Please specify the position" }}
              render={({ field: { value, onChange } }) => (
                <View className="mb-4">
                  <Text
                    className={`font-semibold mb-2 ${textColor?.quaternary}`}
                  >
                    Specify Position <Text className="text-red-500">*</Text>
                  </Text>
                  <TextInput
                    value={value}
                    onChangeText={onChange}
                    placeholder="e.g., ML Platform Engineer"
                    className="h-12 rounded-2xl border border-black px-4 bg-white"
                  />
                  {errors.positionOther?.message ? (
                    <Text className="text-red-600 text-sm mt-1">
                      {errors.positionOther.message}
                    </Text>
                  ) : null}
                </View>
              )}
            />
          )}

          {/* Company */}
          <Text
            className={`text-lg font-semibold mb-2 ${textColor?.quaternary}`}
          >
            Company
          </Text>

          <Controller
            control={control}
            name="company.name"
            rules={{ required: "Company name is required" }}
            render={({ field: { value, onChange } }) => (
              <View className="mb-4">
                <Text className={`font-semibold mb-2 ${textColor?.quaternary}`}>
                  Company Name <Text className="text-red-500">*</Text>
                </Text>
                <TextInput
                  value={value}
                  onChangeText={onChange}
                  placeholder="e.g., Google"
                  placeholderTextColor={dark ? "#6B7280" : "#9CA3AF"}
                  className={`h-12 rounded-2xl border px-4 ${border.primary} ${backgroundColor?.primary}`}
                />
                {errors?.company?.name?.message ? (
                  <Text className="text-red-600 text-sm mt-1">
                    {errors?.company?.name?.message}
                  </Text>
                ) : null}
              </View>
            )}
          />

          <Controller
            control={control}
            name="company.industry"
            rules={{ required: "Industry is required" }}
            render={({ field: { value, onChange } }) => (
              <View className="mb-4">
                <Text className={`font-semibold mb-2 ${textColor?.quaternary}`}>
                  Industry <Text className="text-red-500">*</Text>
                </Text>
                <TextInput
                  value={value}
                  onChangeText={onChange}
                  placeholder="e.g., FinTech, AI, E-commerce"
                  placeholderTextColor={dark ? "#6B7280" : "#9CA3AF"}
                  className={`h-12 rounded-2xl border px-4 ${border.primary} ${backgroundColor?.primary}`}
                />
                {errors?.company?.industry?.message ? (
                  <Text className="text-red-600 text-sm mt-1">
                    {errors?.company?.industry?.message}
                  </Text>
                ) : null}
              </View>
            )}
          />

          {/* Locations: LocationPicker + list (ONLY ONE add button) */}
          <View className="mb-4">
            <Text className="text-lg font-semibold mb-2">Locations</Text>

            <LocationPicker
              control={control}
              setValue={setValue}
              watch={watch}
              namePrefix={jobLocations}
              label="Add a location"
              required={false}
            />

            {/* <Pressable
              onPress={onAddLocationFromPicker}
              className="mt-2 h-11 rounded-xl bg-black items-center justify-center"
            >
              <Text className="text-white font-medium">Add Location</Text>
            </Pressable> */}

            <View className="mt-4">
              <MultiEntryList
                title=""
                emptyHint="No locations added yet. Use the picker above and tap Add Location."
                entries={locations || []}
                onAdd={onAddLocationFromPicker}
                // IMPORTANT: do NOT pass onAdd -> avoids the second 'Add' button
                renderItem={(loc, index) => (
                  <View
                    key={`${loc}-${index}`}
                    className={`flex-row items-center justify-between ${border.primary} ${backgroundColor?.primary} border rounded-xl px-3 py-2 mb-2`}
                  >
                    <Text className="text-black">{loc}</Text>
                    <Pressable onPress={() => removeLocationAt(index)}>
                      <Ionicons name="close-circle" size={18} color="#a1a1aa" />
                    </Pressable>
                  </View>
                )}
              />
              {(!locations || locations.length === 0) && (
                <Text className="text-red-600 text-sm mt-1">
                  At least one location is required
                </Text>
              )}
            </View>
          </View>

          <View className="h-[1px] bg-gray-200 my-3" />

          {/* Work Mode */}
          <Controller
            control={control}
            name="workMode"
            rules={{ required: "Work mode is required" }}
            render={({ field: { value, onChange } }) => (
              <View className="mb-2">
                <Text className={`font-semibold mb-2 ${textColor?.quaternary}`}>
                  Work Mode <Text className="text-red-500">*</Text>
                </Text>
                <Dropdown
                  label="Select work mode"
                  items={WORK_MODE_OPTIONS.map((p) => ({ id: p, label: p }))}
                  value={value}
                  onSelect={onChange}
                />
                {errors.workMode?.message ? (
                  <Text className="text-red-600 text-sm mt-1">
                    {errors.workMode.message}
                  </Text>
                ) : null}
              </View>
            )}
          />

          {/* Salary */}
          <Text className="text-lg font-semibold mt-4 mb-2">Salary</Text>
          <Controller
            control={control}
            name="salary.amount"
            rules={{ required: "Salary amount is required" }}
            render={({ field: { value, onChange } }) => (
              <View className="mb-3">
                <Text className={`font-semibold mb-2 ${textColor?.quaternary}`}>
                  Amount <Text className="text-red-500">*</Text>
                </Text>
                <TextInput
                  keyboardType="numeric"
                  value={String(value ?? "")}
                  onChangeText={onChange}
                  placeholder="e.g., 150000"
                  placeholderTextColor={dark ? "#6B7280" : "#9CA3AF"}
                  className={`h-12 rounded-2xl border px-4 ${border.primary} ${backgroundColor?.primary}`}
                />
                {errors?.salary?.amount?.message ? (
                  <Text className="text-red-600 text-sm mt-1">
                    {errors?.salary?.amount?.message}
                  </Text>
                ) : null}
              </View>
            )}
          />
          <Controller
            control={control}
            name="salary.currency"
            rules={{ required: "Currency is required" }}
            render={({ field: { value, onChange } }) => (
              <View className="mb-3">
                <Text className={`font-semibold mb-2 ${textColor?.quaternary}`}>
                  Currency <Text className="text-red-500">*</Text>
                </Text>
                <Dropdown
                  label="Select currency"
                  items={CURRENCY_OPTIONS.map((p) => ({ id: p, label: p }))}
                  value={value}
                  onSelect={onChange}
                />
                {errors?.salary?.currency?.message ? (
                  <Text className="text-red-600 text-sm mt-1">
                    {errors?.salary?.currency?.message}
                  </Text>
                ) : null}
              </View>
            )}
          />
          <Controller
            control={control}
            name="salary.period"
            rules={{ required: "Salary period is required" }}
            render={({ field: { value, onChange } }) => (
              <View className="mb-3">
                <Text className={`font-semibold mb-2 ${textColor?.quaternary}`}>
                  Period <Text className="text-red-500">*</Text>
                </Text>
                <Dropdown
                  label="Select period"
                  items={SALARY_PERIOD_OPTIONS.map((p) => ({
                    id: p,
                    label: p,
                  }))}
                  value={value}
                  onSelect={onChange}
                />
                {errors?.salary?.period?.message ? (
                  <Text className="text-red-600 text-sm mt-1">
                    {errors?.salary?.period?.message}
                  </Text>
                ) : null}
              </View>
            )}
          />

          {/* Job Description */}
          <Controller
            control={control}
            name="jobDescription"
            rules={{ required: "Job description is required" }}
            render={({ field: { value, onChange } }) => (
              <View className="mb-4">
                <Text
                  className={`text-lg font-semibold mb-2 ${textColor?.quaternary}`}
                >
                  Job Description <Text className="text-red-500">*</Text>
                </Text>
                <TextInput
                  value={value}
                  onChangeText={onChange}
                  placeholder="Add a concise, clear description and responsibilities"
                  multiline
                  numberOfLines={5}
                  textAlignVertical="top"
                  placeholderTextColor={dark ? "#6B7280" : "#9CA3AF"}
                  className={`h-12 rounded-2xl border px-4 ${border.primary} ${backgroundColor?.primary}`}
                />
                {errors.jobDescription?.message ? (
                  <Text className="text-red-600 text-sm mt-1">
                    {errors.jobDescription?.message}
                  </Text>
                ) : null}
              </View>
            )}
          />

          {/* Referral Applicants Limit */}
          <Controller
            control={control}
            name="referralApplicantsLimit"
            rules={{ required: "Referral applicants limit is required" }}
            render={({ field: { value, onChange } }) => (
              <View className="mb-4">
                <Text className={`font-semibold mb-2 ${textColor?.quaternary}`}>
                  Referral Applicants Limit{" "}
                  <Text className="text-red-500">*</Text>
                </Text>
                <TextInput
                  keyboardType="numeric"
                  value={String(value ?? "")}
                  onChangeText={onChange}
                  placeholder="e.g., 10"
                  placeholderTextColor={dark ? "#6B7280" : "#9CA3AF"}
                  className={`h-12 rounded-2xl border px-4 ${border.primary} ${backgroundColor?.primary}`}
                />
                {errors.referralApplicantsLimit?.message ? (
                  <Text className="text-red-600 text-sm mt-1">
                    {errors.referralApplicantsLimit?.message}
                  </Text>
                ) : null}
              </View>
            )}
          />

          {/* Job Link */}
          <Controller
            control={control}
            name="jobLink"
            rules={{ required: "Job link is required" }}
            render={({ field: { value, onChange } }) => (
              <View className="mb-4">
                <Text className={`font-semibold mb-2 ${textColor?.quaternary}`}>
                  Job Link <Text className="text-red-500">*</Text>
                </Text>
                <TextInput
                  value={value}
                  onChangeText={onChange}
                  autoCapitalize="none"
                  keyboardType="url"
                  placeholder="https://careers.company.com/job/12345"
                  placeholderTextColor={dark ? "#6B7280" : "#9CA3AF"}
                  className={`h-12 rounded-2xl border px-4 ${border.primary} ${backgroundColor?.primary}`}
                />
                {errors.jobLink?.message ? (
                  <Text className="text-red-600 text-sm mt-1">
                    {errors.jobLink?.message}
                  </Text>
                ) : null}
              </View>
            )}
          />

          {/* Deadlines */}
          <Text
            className={`text-lg font-semibold mt-2 mb-2 ${textColor?.quaternary}`}
          >
            Deadlines
          </Text>
          <View className="flex-row">
            <View className="flex-1 mx-1">
              <DateField
                name="referralDeadline"
                label="Referral Deadline"
                minDate={new Date()}
              />
            </View>
            <View className="flex-1 mx-1">
              <DateField
                name="jobDeadline"
                label="Job Deadline"
                minDate={referralDeadline || new Date()}
              />
            </View>
          </View>
          <View className="h-6" />
        </View>

        {/* Save */}
        <View className="px-4 py-3">
          <Pressable
            disabled={isSubmitting}
            onPress={handleSubmit(onSubmit, onInvalid)}
            className={`h-12 rounded-2xl bg-black items-center justify-center ${backgroundColor?.buttonPrimary}`}
          >
            <Text className="text-white font-medium">
              {isSubmitting ? "Saving..." : "Save Referral"}
            </Text>
          </Pressable>
        </View>
      </View>
    </ScreenScroll>
  );
}
