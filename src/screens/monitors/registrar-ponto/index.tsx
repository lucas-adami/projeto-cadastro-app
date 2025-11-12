import React, { useState } from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Button } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialIcons";

interface RegistroPontoModalProps {
  visible: boolean;
  onClose: () => void;
  monitorNome: string;
  isDarkMode?: boolean;
  onConfirm: (entrada: string, saida: string) => void;
  tipo: "entrada" | "saida";
}

const pad = (n: number) => n.toString().padStart(2, "0");

const RegistroPontoModal: React.FC<RegistroPontoModalProps> = ({
  visible,
  onClose,
  monitorNome,
  isDarkMode = false,
  onConfirm,
  tipo,
}) => {
  const [currentTime, setCurrentTime] = useState<string>("");

  // Atualiza o horário a cada segundo
  React.useEffect(() => {
    if (visible) {
      const updateTime = () => {
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, "0");
        const minutes = now.getMinutes().toString().padStart(2, "0");
        const seconds = now.getSeconds().toString().padStart(2, "0");
        setCurrentTime(`${hours}:${minutes}:${seconds}`);
      };

      updateTime(); // Atualiza imediatamente
      const interval = setInterval(updateTime, 1000);

      return () => clearInterval(interval);
    }
  }, [visible]);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View
          style={[
            styles.container,
            { backgroundColor: isDarkMode ? "#232323" : "#fff" },
          ]}
        >
          <View style={styles.modalHeader}>
            <Text
              style={[
                styles.modalTitle,
                { color: isDarkMode ? "#fff" : "#000" },
              ]}
            >
              {tipo === "entrada" ? "REGISTRAR ENTRADA" : "REGISTRAR SAÍDA"}
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Icon
                name="close"
                size={24}
                color={isDarkMode ? "#fff" : "#000"}
              />
            </TouchableOpacity>
          </View>

          <Text
            style={[
              styles.monitorName,
              { color: isDarkMode ? "#fff" : "#000" },
            ]}
          >
            {monitorNome}
          </Text>

          <View style={styles.iconContainer}>
            <Icon
              name={tipo === "entrada" ? "login" : "logout"}
              size={60}
              color={tipo === "entrada" ? "#28a745" : "#dc3545"}
            />
          </View>

          <Text
            style={[styles.infoText, { color: isDarkMode ? "#ccc" : "#666" }]}
          >
            {tipo === "entrada"
              ? "Você está registrando sua entrada"
              : "Você está registrando sua saída"}
          </Text>

          {/* Exibição do horário atual (não editável) */}
          <View style={styles.timeDisplayContainer}>
            <Text
              style={[
                styles.timeLabel,
                { color: isDarkMode ? "#ccc" : "#666" },
              ]}
            >
              Horário do registro:
            </Text>
            <Text
              style={[
                styles.currentTimeDisplay,
                { color: isDarkMode ? "#fff" : "#000" },
              ]}
            >
              {currentTime}
            </Text>
          </View>

          <Text
            style={[styles.noteText, { color: isDarkMode ? "#888" : "#999" }]}
          >
            ℹ️ O horário será registrado automaticamente pelo sistema
          </Text>

          <View style={styles.buttonContainer}>
            <Button
              mode="contained"
              style={{
                backgroundColor: tipo === "entrada" ? "#28a745" : "#dc3545",
                borderRadius: 8,
              }}
              onPress={() => onConfirm(currentTime, currentTime)}
            >
              {tipo === "entrada" ? "CONFIRMAR ENTRADA" : "CONFIRMAR SAÍDA"}
            </Button>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    width: "90%",
    maxWidth: 450,
    borderRadius: 12,
    padding: 24,
    alignItems: "center",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    width: "100%",
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
  closeButton: {
    padding: 4,
  },
  monitorName: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#000",
  },
  iconContainer: {
    marginVertical: 20,
  },
  infoText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 24,
  },
  timeDisplayContainer: {
    alignItems: "center",
    marginVertical: 20,
    padding: 20,
    backgroundColor: "rgba(40, 167, 69, 0.1)",
    borderRadius: 12,
    width: "100%",
  },
  timeLabel: {
    fontSize: 14,
    marginBottom: 8,
    textAlign: "center",
  },
  currentTimeDisplay: {
    fontSize: 48,
    fontWeight: "bold",
    fontFamily: "monospace",
    letterSpacing: 2,
  },
  noteText: {
    fontSize: 12,
    textAlign: "center",
    marginBottom: 20,
    paddingHorizontal: 16,
  },
  buttonContainer: {
    padding: 16,
    width: "100%",
  },
});

export default RegistroPontoModal;
