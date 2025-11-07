import { Text, View, Alert } from "react-native";
import Toast from "react-native-toast-message";

// NativeWind handles tailwind-like classes
// (make sure you've installed & configured nativewind)

export const toastConfig = {
  // 🔘 Gray Pill Toast
  grayPill: ({ text1 }) => (
    <View 
      className="bg-neutral-600 rounded-full px-5 py-2"
      style={{ 
        elevation: 10000, 
        zIndex: 10000,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
      }}
    >
      <Text className="text-white text-base text-center">{text1}</Text>
    </View>
  ),

  // ✅ Success Toast
  success: ({ text1 }) => (
    <View 
      className="bg-green-600 rounded-full px-5 py-2"
      style={{ 
        elevation: 10000, 
        zIndex: 10000,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
      }}
    >
      <Text className="text-white text-base text-center">{text1}</Text>
    </View>
  ),

  // ⚠️ Warning Toast
  warning: ({ text1 }) => (
    <View 
      className="bg-yellow-500 rounded-full px-5 py-2"
      style={{ 
        elevation: 10000, 
        zIndex: 10000,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
      }}
    >
      <Text className="text-black text-base text-center">{text1}</Text>
    </View>
  ),

  // ❌ Error Toast
  error: ({ text1 }) => (
    <View 
      className="bg-red-600 rounded-full px-5 py-2"
      style={{ 
        elevation: 10000, 
        zIndex: 10000,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
      }}
    >
      <Text className="text-white text-base text-center">{text1}</Text>
    </View>
  ),
};

export const showToast = (type, msg, useAlert = false) => {
  // If useAlert is true (e.g., inside a modal), use native Alert
  if (useAlert) {
    Alert.alert(
      type === 'error' ? 'Error' : type === 'success' ? 'Success' : type === 'warning' ? 'Warning' : 'Info',
      msg,
      [{ text: 'OK' }]
    );
    return;
  }

  Toast.show({
    type: type,
    text1: msg,
    position: "bottom",
    visibilityTime: 2000,
    autoHide: true,
    topOffset: 60,
    bottomOffset: 60,
  });
};
