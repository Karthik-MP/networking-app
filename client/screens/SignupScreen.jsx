// screens/SignupScreen.jsx
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, serverTimestamp, setDoc, getDoc } from "firebase/firestore";
import { Controller, useForm } from "react-hook-form";
import { useTheme } from "@hooks/useTheme";
import {
    StyleSheet,
    Switch,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { Toast } from "toastify-react-native";
import Dropdown from "../components/Dropdown";
import { ScreenScroll } from "../components/layout/Screen";
import LocationPicker from "../components/Location/LocationPicker";
import { auth, db } from "../services/firebase";

const PHONE_CODES = [
  { id: "+1", label: "+1 (US/CA)" },
  { id: "+91", label: "+91 (IN)" },
  { id: "+44", label: "+44 (UK)" },
];

export default function SignupScreen({ navigation }) {
  const { dark, backgroundColor, textColor, border } = useTheme();

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      first_name: "",
      last_name: "",
      email_address: "",
      password: "",
      confirmPassword: "",
      phone_country_code: "+1",
      phone_number: "",
      native_location: { country: "", state: "", city: "", zip: "" },
      is_immigrant: false,
      foreign_residence: { country: "", state: "", city: "", zip: "" },
    },
  });

  const password = watch("password");
  const isImmigrant = watch("is_immigrant");

  const onSubmit = async (data) => {
    console.log("onSubmit...")
    try {
      const {
        email_address,
        password,
        first_name,
        last_name,
        phone_country_code,
        phone_number,
        native_location,
        is_immigrant,
        foreign_residence,
      } = data;

      // Create user account - Firebase Auth handles duplicate email prevention
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email_address,
        password
      );
      const user = userCredential.user;

      // Check if user document already exists in Firestore (extra safety)
      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);
      
      if (userDoc.exists()) {
        console.log("Account already exists. Please login instead.")
        Toast.warning("Account already exists. Please login instead.");
        navigation.reset({ index: 0, routes: [{ name: "Welcome" }] });
        return;
      }

      const payload = {
        uid: user.uid,
        email_address,
        full_name: { first_name, last_name },
        phone_number: {
          country_code: phone_country_code,
          number: phone_number,
        },
        native_location,
        immigrant: is_immigrant
          ? { is_immigrant: true, foreign_residence }
          : { is_immigrant: false },
        createdAt: serverTimestamp(),
      };

      await setDoc(userDocRef, payload, { merge: true });
      Toast.success("Signed up successfully!");
      navigation.reset({ index: 0, routes: [{ name: "Welcome" }] });
    } catch (e) {
      console.error(e);
      
      // Handle specific Firebase Auth errors
      if (e.code === "auth/email-already-in-use") {
        Toast.error("This email is already registered. Please login instead.");
      } else if (e.code === "auth/invalid-email") {
        Toast.error("Invalid email address.");
      } else if (e.code === "auth/weak-password") {
        Toast.error("Password is too weak. Use at least 6 characters.");
      } else if (e.code === "auth/network-request-failed") {
        Toast.error("Network error. Please check your connection.");
      } else {
        Toast.error("Error during signup. Please try again.");
      }
    }
  };

  /* ---- UI ---- */
  const inputBox = `rounded-xl border px-4 py-3 mb-2 ${backgroundColor.input} ${border.primary}`;
  const labelText = `text-xs mb-2 ${textColor.secondary}`;
  const inputText = `text-base ${textColor.primary}`;
  const errorText = "text-red-500 -mt-1 mb-2 text-xs";

  return (
    <ScreenScroll>
      <View className={`flex-1 px-6 py-8 ${backgroundColor.primary}`}>
        <View className="w-full max-w-xl self-center">
          {/* Heading */}
          <Text className={`text-2xl font-extrabold mb-1 ${textColor.primary}`}>
            Create your account
          </Text>
          <Text className={`mb-4 ${textColor.tertiary}`}>
            Let’s start with a few basics. You can complete the rest of your
            profile later.
          </Text>

          {/* Full Name */}
          <View className="mt-3">
            <Text className={labelText}>Full name</Text>
            <View className="flex-row">
              <View className="flex-1 mr-2">
                <Controller
                  control={control}
                  name="first_name"
                  rules={{ required: "First name is required" }}
                  render={({ field: { onChange, value } }) => (
                    <View className={inputBox}>
                      <TextInput
                        placeholder="First name"
                        value={value}
                        onChangeText={onChange}
                        placeholderTextColor={dark ? "#6B7280" : "#9CA3AF"}
                        className={inputText}
                      />
                    </View>
                  )}
                />
                {errors.first_name && (
                  <Text className={errorText}>{errors.first_name.message}</Text>
                )}
              </View>

              <View className="flex-1 ml-2">
                <Controller
                  control={control}
                  name="last_name"
                  rules={{ required: "Last name is required" }}
                  render={({ field: { onChange, value } }) => (
                    <View className={inputBox}>
                      <TextInput
                        placeholder="Last name"
                        value={value}
                        onChangeText={onChange}
                        placeholderTextColor={dark ? "#6B7280" : "#9CA3AF"}
                        className={inputText}
                      />
                    </View>
                  )}
                />
                {errors.last_name && (
                  <Text className={errorText}>{errors.last_name.message}</Text>
                )}
              </View>
            </View>
          </View>

          {/* Account */}
          <View className="mt-3">
            <Text className={labelText}>Account</Text>

            <Controller
              control={control}
              name="email_address"
              rules={{
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Enter a valid email",
                },
              }}
              render={({ field: { onChange, value } }) => (
                <View className={inputBox}>
                  <TextInput
                    placeholder="Email address"
                    value={value}
                    onChangeText={onChange}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    placeholderTextColor={dark ? "#6B7280" : "#9CA3AF"}
                    className={inputText}
                  />
                </View>
              )}
            />
            {errors.email_address && (
              <Text className={errorText}>{errors.email_address.message}</Text>
            )}

            <Controller
              control={control}
              name="password"
              rules={{
                required: "Password is required",
                minLength: { value: 6, message: "At least 6 characters" },
              }}
              render={({ field: { onChange, value } }) => (
                <View className={inputBox}>
                  <TextInput
                    placeholder="Password"
                    value={value}
                    onChangeText={onChange}
                    secureTextEntry
                    placeholderTextColor={dark ? "#6B7280" : "#9CA3AF"}
                    className={inputText}
                  />
                </View>
              )}
            />
            {errors.password && (
              <Text className={errorText}>{errors.password.message}</Text>
            )}

            <Controller
              control={control}
              name="confirmPassword"
              rules={{
                required: "Please confirm your password",
                validate: (v) => v === password || "Passwords do not match",
              }}
              render={({ field: { onChange, value } }) => (
                <View className={inputBox}>
                  <TextInput
                    placeholder="Confirm password"
                    value={value}
                    onChangeText={onChange}
                    secureTextEntry
                    placeholderTextColor={dark ? "#6B7280" : "#9CA3AF"}
                    className={inputText}
                  />
                </View>
              )}
            />
            {errors.confirmPassword && (
              <Text className={errorText}>
                {errors.confirmPassword.message}
              </Text>
            )}
          </View>

          {/* Phone */}
          <View className="mt-3">
            <Text className={labelText}>Phone Number</Text>
            <View className="flex-row items-center">
              <View style={{ width: 140 }} className="mr-2">
                <Controller
                  control={control}
                  name="phone_country_code"
                  render={({ field: { value } }) => (
                    <Dropdown
                      items={PHONE_CODES}
                      value={value}
                      onSelect={(v) => setValue("phone_country_code", v)}
                    />
                  )}
                />
              </View>
              <View className="flex-1 ml-2">
                <Controller
                  control={control}
                  name="phone_number"
                  rules={{
                    required: "Phone number is required",
                    pattern: {
                      value: /^[0-9]{6,15}$/,
                      message: "Use digits only (6–15)",
                    },
                  }}
                  render={({ field: { onChange, value } }) => (
                    <View className={inputBox}>
                      <TextInput
                        placeholder="Phone number"
                        value={value}
                        onChangeText={onChange}
                        keyboardType="phone-pad"
                        placeholderTextColor={dark ? "#6B7280" : "#9CA3AF"}
                        className={inputText}
                      />
                    </View>
                  )}
                />
                {errors.phone_number && (
                  <Text className={errorText}>
                    {errors.phone_number.message}
                  </Text>
                )}
              </View>
            </View>
          </View>

          {/* Native Location */}
          <LocationPicker
            control={control}
            setValue={setValue}
            watch={watch}
            namePrefix="native_location"
            label="Native Location"
          />

          {/* Immigration */}
          <View className="mt-3">
            <Text className={labelText}>Immigration</Text>
            <View className="flex-row items-center justify-between py-1 mb-1">
              <Text className={textColor.primary}>Are you an immigrant?</Text>
              <Controller
                control={control}
                name="is_immigrant"
                render={({ field: { onChange, value } }) => (
                  <Switch value={value} onValueChange={onChange} />
                )}
              />
            </View>

            {isImmigrant && (
              <LocationPicker
                control={control}
                setValue={setValue}
                watch={watch}
                namePrefix="foreign_residence"
                label="Foreign Country of Residence"
              />
            )}
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            disabled={isSubmitting}
            onPress={handleSubmit(onSubmit)}
            className={`mt-4 p-3 h-13 rounded-xl items-center justify-center ${
              isSubmitting ? "opacity-70" : ""
            } ${backgroundColor.buttonPrimary}`}
          >
            <Text className="text-white text-base font-bold">
              {isSubmitting ? "Please wait…" : "Sign Up"}
            </Text>
          </TouchableOpacity>

          <Text className={`text-center mt-3 text-xs ${textColor.tertiary}`}>
            By signing up you agree to our Terms and Privacy Policy.
          </Text>
        </View>
      </View>
    </ScreenScroll>
  );
}

const styles = StyleSheet.create({
  lightInput: {
    width: "100%",
    height: 48,
    borderColor: "#e5e7eb",
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    fontSize: 16,
    backgroundColor: "#fff",
    color: "#111827",
  },
});
