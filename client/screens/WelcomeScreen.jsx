// screens/WelcomeScreen.jsx
import { AntDesign, Feather } from "@expo/vector-icons";
import { useTheme } from "@hooks/useTheme";
import { useNavigation } from "@react-navigation/native";
import { auth } from "@services/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { showToast } from "@components/toast";

export default function WelcomeScreen() {
  const navigation = useNavigation();
  const { dark, backgroundColor, textColor, border, colors } = useTheme();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [secure, setSecure] = useState(true);

  const onGoogle = () => {};
  const onLinkedIn = () => {};

  const onLogin = async () => {
    if (!email || !password) {
      showToast("error", "Invalid email or password");
      // showToast("error", "Please enter both email and password");
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      showToast("success", "Login successful");
    } catch (error) {
      showToast("error", "Invalid email or password");
      console.error("Login error:", error);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={24}
      className={`flex-1 ${backgroundColor.primary}`}
    >
      <View className="flex-1 items-center justify-center px-8">
        {/* Title */}
        <Text
          className={`text-4xl font-extrabold mb-2 text-center ${textColor.primary}`}
        >
          Login
        </Text>
        <Text className={`text-sm mb-6 ${textColor.secondary}`}>
          Sign in with
        </Text>

        {/* Social buttons */}
        <View className="flex-row w-full justify-center mb-6">
          {/* Google – light pill on dark background */}
          <Pressable
            onPress={onGoogle}
            className={`flex-1 rounded-xl py-3 mx-1 items-center flex-row justify-center ${
              dark ? "bg-slate-300" : "bg-slate-100"
            }`}
          >
            <AntDesign
              name="google"
              size={18}
              color={dark ? "#111827" : "#111827"}
            />
            <Text className="ml-2 font-semibold text-lg text-slate-900">
              Google
            </Text>
          </Pressable>

          {/* LinkedIn – dark pill with border */}
          <Pressable
            onPress={onLinkedIn}
            className={`flex-1 rounded-xl py-3 mx-1 items-center flex-row justify-center border ${border.primary} ${backgroundColor.cardPrimary}`}
          >
            <AntDesign
              name="linkedin"
              size={18}
              color={dark ? "#f9fafb" : "#111827"}
            />
            <Text className={`ml-2 font-semibold text-lg ${textColor.primary}`}>
              LinkedIn
            </Text>
          </Pressable>
        </View>

        {/* Divider */}
        <View className="flex-row items-center w-full my-4">
          <View
            className="flex-1 h-px"
            style={{ backgroundColor: colors.border }}
          />
          <Text className={`mx-3 text-xs ${textColor.tertiary}`}>
            or continue with
          </Text>
          <View
            className="flex-1 h-px"
            style={{ backgroundColor: colors.border }}
          />
        </View>

        {/* Inputs */}
        <View className="w-full mt-2">
          <Text className={`text-sm mb-2 ${textColor.secondary}`}>
            Email or Username
          </Text>
          <View
            className={`rounded-xl px-4 py-3 mb-4 ${backgroundColor.input} border ${border.primary}`}
          >
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="example@mail.com"
              className={`text-base ${textColor.primary}`}
              placeholderTextColor={dark ? "#9ca3af" : "#6b7280"}
              autoCapitalize="none"
              keyboardType="email-address"
              returnKeyType="next"
            />
          </View>

          <Text className={`text-sm mb-2 ${textColor.secondary}`}>
            Password
          </Text>
          <View
            className={`rounded-xl px-4 py-3 mb-1 flex-row items-center ${backgroundColor.input} border ${border.primary}`}
          >
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="••••••••••••••••"
              placeholderTextColor={dark ? "#9ca3af" : "#6b7280"}
              className={`flex-1 text-base pr-8 ${textColor.primary}`}
              secureTextEntry={secure}
            />
            <Pressable onPress={() => setSecure((s) => !s)} hitSlop={10}>
              <Feather
                name={secure ? "eye-off" : "eye"}
                size={18}
                color={dark ? "#e5e7eb" : "#374151"}
              />
            </Pressable>
          </View>
        </View>

        {/* Forgot password */}
        <Pressable
          className="self-end mt-2 mb-6"
          onPress={() => navigation.navigate("ForgotPassword")}
        >
          <Text className={`text-xs ${textColor.tertiary}`}>
            Forgot password?
          </Text>
        </Pressable>

        {/* Primary button */}
        <Pressable
          onPress={onLogin}
          className={`rounded-xl py-4 w-36 items-center mb-4 ${backgroundColor?.buttonPrimary}`}
        >
          {/* Button text is always white to match violet pill in mock */}
          <Text className="text-base font-bold text-white">Login</Text>
        </Pressable>

        {/* Footer */}
        <Pressable
          onPress={() => navigation.navigate("Signup")}
          className="mt-1"
        >
          <Text className={`text-sm ${textColor.tertiary}`}>
            Don’t have an account?{" "}
            <Text className={`font-bold ${textColor.primary}`}>Sign up</Text>
          </Text>
        </Pressable>

        <Text
          className={`mt-10 text-lg font-bold text-center ${textColor.primary}`}
        >
          Indian Professionals Network
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
}
