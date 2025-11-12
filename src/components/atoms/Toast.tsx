import React from "react";
import { Text } from "react-native";
import { Snackbar } from "react-native-paper";
import { useThemeMode } from "../../context/ThemeContext";

interface ToastProps {
  visible: boolean;
  message: string;
  onDismiss: () => void;
  type?: "success" | "error" | "warning" | "info";
  duration?: number;
}

export default function Toast({
  visible,
  message,
  onDismiss,
  type = "info",
  duration = 4000,
}: ToastProps) {
  const { isDarkMode } = useThemeMode();

  const getBackgroundColor = () => {
    switch (type) {
      case "success":
        return isDarkMode ? "#2d5a2d" : "#d4edda";
      case "error":
        return isDarkMode ? "#5a2d2d" : "#f8d7da";
      case "warning":
        return isDarkMode ? "#5a4d2d" : "#fff3cd";
      case "info":
      default:
        return isDarkMode ? "#2d3e5a" : "#d1ecf1";
    }
  };

  const getTextColor = () => {
    switch (type) {
      case "success":
        return isDarkMode ? "#a3d9a3" : "#155724";
      case "error":
        return isDarkMode ? "#f5a5a5" : "#721c24";
      case "warning":
        return isDarkMode ? "#f5d982" : "#856404";
      case "info":
      default:
        return isDarkMode ? "#a3c4f3" : "#0c5460";
    }
  };

  return (
    <Snackbar
      visible={visible}
      onDismiss={onDismiss}
      duration={duration}
      wrapperStyle={{
        top: 50,
        bottom: undefined,
        zIndex: 9999,
        elevation: 9999,
      }}
      style={{
        backgroundColor: getBackgroundColor(),
        borderLeftWidth: 4,
        borderLeftColor:
          type === "error"
            ? "#dc3545"
            : type === "success"
            ? "#28a745"
            : type === "warning"
            ? "#ffc107"
            : "#17a2b8",
        zIndex: 9999,
        elevation: 9999,
      }}
    >
      <Text style={{ color: getTextColor(), fontWeight: "500" }}>
        {message}
      </Text>
    </Snackbar>
  );
}
