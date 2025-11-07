import { useTheme } from "@hooks/useTheme";
import { Modal, Text, TouchableOpacity, View } from "react-native";

export function EditorModalLayout({
  visible,
  title,
  onClose,
  onSave,
  children,
}) {
  const { backgroundColor, textColor, border, colors } = useTheme();
  // console.log(backgroundColor.primary)
  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose} >
      <View className="flex-1 p-4" style={{ backgroundColor: colors.background }}>
        {/* Title */}
        <Text className={`text-lg font-semibold mb-3 ${textColor.primary}`}>
          {title}
        </Text>

        {/* Content */}
        <View className="flex-1">{children}</View>

        {/* Actions */}
        <View className="mt-4 flex-row justify-end gap-3">
          {/* Cancel */}
          <TouchableOpacity
            onPress={onClose}
            className={`px-4 py-3 rounded-2xl border ${border.primary} ${backgroundColor.cardSecondary}`}
          >
            <Text className={`font-medium ${textColor.secondary}`}>Cancel</Text>
          </TouchableOpacity>

          {/* Save */}
          <TouchableOpacity
            onPress={onSave}
            className={`px-5 py-3 rounded-2xl ${backgroundColor.buttonPrimary}`}
          >
            {/* Keep white for contrast on violet */}
            <Text className="font-semibold text-white">Save</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
