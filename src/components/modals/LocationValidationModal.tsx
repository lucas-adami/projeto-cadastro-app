import React from "react";
import { Modal, View, Text, StyleSheet, Animated } from "react-native";
import { Button } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialIcons";

interface LocationValidationModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isDarkMode?: boolean;
  isValid: boolean;
  message: string;
  locationName?: string;
  distance?: number;
}

const LocationValidationModal: React.FC<LocationValidationModalProps> = ({
  visible,
  onClose,
  onConfirm,
  isDarkMode = false,
  isValid,
  message,
  locationName,
  distance,
}) => {
  const [scaleAnim] = React.useState(new Animated.Value(0));

  React.useEffect(() => {
    if (visible) {
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }).start();
    } else {
      scaleAnim.setValue(0);
    }
  }, [visible]);

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Animated.View
          style={[
            styles.container,
            {
              backgroundColor: isDarkMode ? "#232323" : "#fff",
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          {/* Ícone de status */}
          <View
            style={[
              styles.iconContainer,
              {
                backgroundColor: isValid
                  ? "rgba(40, 167, 69, 0.1)"
                  : "rgba(220, 53, 69, 0.1)",
              },
            ]}
          >
            <Icon
              name={isValid ? "check-circle" : "location-off"}
              size={80}
              color={isValid ? "#28a745" : "#dc3545"}
            />
          </View>

          {/* Título */}
          <Text
            style={[
              styles.title,
              {
                color: isDarkMode ? "#fff" : "#000",
              },
            ]}
          >
            {isValid ? "✅ Localização Validada!" : "📍 Localização Inválida"}
          </Text>

          {/* Mensagem */}
          <Text
            style={[
              styles.message,
              {
                color: isDarkMode ? "#ccc" : "#666",
              },
            ]}
          >
            {message}
          </Text>

          {/* Informações adicionais */}
          {isValid && locationName && (
            <View
              style={[
                styles.infoBox,
                {
                  backgroundColor: isDarkMode ? "#1a1a1a" : "#f8f9fa",
                  borderColor: isDarkMode ? "#444" : "#e9ecef",
                },
              ]}
            >
              <Icon
                name="location-on"
                size={20}
                color="#28a745"
                style={styles.infoIcon}
              />
              <Text
                style={[
                  styles.infoText,
                  { color: isDarkMode ? "#fff" : "#000" },
                ]}
              >
                {locationName}
              </Text>
            </View>
          )}

          {distance !== undefined && (
            <View
              style={[
                styles.infoBox,
                {
                  backgroundColor: isDarkMode ? "#1a1a1a" : "#f8f9fa",
                  borderColor: isDarkMode ? "#444" : "#e9ecef",
                },
              ]}
            >
              <Icon
                name="navigation"
                size={20}
                color={isValid ? "#28a745" : "#dc3545"}
                style={styles.infoIcon}
              />
              <Text
                style={[
                  styles.infoText,
                  { color: isDarkMode ? "#fff" : "#000" },
                ]}
              >
                Distância: {distance}m
              </Text>
            </View>
          )}

          {/* Botões */}
          <View style={styles.buttonContainer}>
            {isValid ? (
              <Button
                mode="contained"
                onPress={onConfirm}
                style={[styles.button, { backgroundColor: "#28a745" }]}
                labelStyle={styles.buttonLabel}
              >
                Continuar
              </Button>
            ) : (
              <Button
                mode="contained"
                onPress={onClose}
                style={[styles.button, { backgroundColor: "#dc3545" }]}
                labelStyle={styles.buttonLabel}
              >
                Entendi
              </Button>
            )}
          </View>

          {isValid && (
            <Text
              style={[
                styles.footerText,
                { color: isDarkMode ? "#888" : "#999" },
              ]}
            >
              Próximo passo: Verificação de voz 🎤
            </Text>
          )}
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    width: "90%",
    maxWidth: 450,
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 12,
  },
  message: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 24,
    paddingHorizontal: 8,
  },
  infoBox: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 12,
    width: "100%",
  },
  infoIcon: {
    marginRight: 8,
  },
  infoText: {
    fontSize: 14,
    fontWeight: "500",
  },
  buttonContainer: {
    width: "100%",
    marginTop: 8,
  },
  button: {
    borderRadius: 10,
    paddingVertical: 8,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: "bold",
  },
  footerText: {
    fontSize: 12,
    textAlign: "center",
    marginTop: 16,
  },
});

export default LocationValidationModal;
