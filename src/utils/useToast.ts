import { useState } from "react";

export type ToastType = "success" | "error" | "warning" | "info";

interface ToastState {
  visible: boolean;
  message: string;
  type: ToastType;
}

export const useToast = () => {
  const [toast, setToast] = useState<ToastState>({
    visible: false,
    message: "",
    type: "info",
  });

  const showToast = (message: string, type: ToastType = "info") => {
    setToast({
      visible: true,
      message,
      type,
    });
  };

  const hideToast = () => {
    setToast((prev) => ({
      ...prev,
      visible: false,
    }));
  };

  const showError = (message: string) => showToast(message, "error");
  const showSuccess = (message: string) => showToast(message, "success");
  const showWarning = (message: string) => showToast(message, "warning");
  const showInfo = (message: string) => showToast(message, "info");

  return {
    toast,
    showToast,
    hideToast,
    showError,
    showSuccess,
    showWarning,
    showInfo,
  };
};
