// components/ConfirmDialog.ts
import { Alert } from "react-native";

type ConfirmDialogProps = {
  title?: string;
  message: string;
  onConfirm: () => void;
  confirmText?: string;
  cancelText?: string;
};

export const showConfirmDialog = ({
  title = "Confirmação",
  message,
  onConfirm,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
}: ConfirmDialogProps) => {
  Alert.alert(
    title,
    message,
    [
      {
        text: cancelText,
        style: "cancel",
      },
      {
        text: confirmText,
        onPress: onConfirm,
        style: "destructive",
      },
    ],
    { cancelable: true }
  );
};
