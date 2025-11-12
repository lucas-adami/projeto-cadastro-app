import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Animated,
  Platform,
  PermissionsAndroid,
  Alert,
  Linking,
} from "react-native";
import { Button } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialIcons";
import {
  useAudioRecorder,
  setAudioModeAsync,
  requestRecordingPermissionsAsync,
} from "expo-audio";

interface VoiceRecognitionModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
  isDarkMode?: boolean;
  userName: string;
}

// Frases aleatórias para o usuário ler (reduzidas e mais curtas)
const FRASES_VALIDACAO = [
  "Confirmo minha presença.",
  "Registro meu ponto.",
  "Estou no trabalho.",
  "Autenticando entrada.",
  "Verificando identidade.",
];

const VoiceRecognitionModal: React.FC<VoiceRecognitionModalProps> = ({
  visible,
  onClose,
  onSuccess,
  isDarkMode = false,
  userName,
}) => {
  // Configuração para expo-audio com opções específicas de plataforma
  const audioRecorder = useAudioRecorder({
    android: {
      extension: ".m4a",
      outputFormat: "mpeg4",
      audioEncoder: "aac",
    },
    ios: {
      extension: ".m4a",
      audioQuality: 0x7f, // High quality (valor numérico correto)
    },
  } as any); // Temporário até que os tipos sejam atualizados

  const [hasRecorded, setHasRecorded] = useState(false);
  const [fraseAtual, setFraseAtual] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [pulseAnim] = useState(new Animated.Value(1));

  // Função para solicitar permissão de microfone (Android e iOS)
  const requestMicrophonePermission = async (): Promise<boolean> => {
    try {
      // Usar expo-audio que funciona em ambas plataformas
      const permission = await requestRecordingPermissionsAsync();

      if (!permission.granted) {
        if (permission.canAskAgain) {
          Alert.alert(
            "Permissão Necessária",
            "Este aplicativo precisa acessar seu microfone para validação de voz.",
            [
              { text: "Cancelar", style: "cancel" },
              {
                text: "Permitir",
                onPress: async () => {
                  await requestRecordingPermissionsAsync();
                },
              },
            ]
          );
        } else {
          Alert.alert(
            "Permissão Negada",
            "Por favor, habilite a permissão de microfone nas configurações do aplicativo.",
            [
              { text: "Cancelar", style: "cancel" },
              {
                text: "Abrir Configurações",
                onPress: () => Linking.openSettings(),
              },
            ]
          );
        }
        return false;
      }

      return true;
    } catch (err) {
      console.error("Erro ao solicitar permissão:", err);
      Alert.alert("Erro", "Não foi possível solicitar permissão de microfone.");
      return false;
    }
  };

  useEffect(() => {
    if (visible) {
      // Seleciona uma frase aleatória quando o modal abre
      const randomIndex = Math.floor(Math.random() * FRASES_VALIDACAO.length);
      setFraseAtual(FRASES_VALIDACAO[randomIndex]);
      setHasRecorded(false);
      setIsRecording(false);

      // Habilitar modo de gravação
      setAudioModeAsync({
        allowsRecording: true,
        playsInSilentMode: true,
      });
    }
  }, [visible]);

  useEffect(() => {
    if (isRecording) {
      // Animação de pulsação durante a gravação
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [isRecording]);

  const startRecording = async () => {
    try {
      // Solicitar permissão antes de gravar
      const hasPermission = await requestMicrophonePermission();
      if (!hasPermission) {
        alert(
          "Permissão de microfone negada. Por favor, habilite nas configurações do aplicativo."
        );
        return;
      }

      setIsRecording(true);
      await audioRecorder.record();
    } catch (error) {
      console.error("Erro ao iniciar gravação:", error);
      setIsRecording(false);
      alert("Erro ao iniciar gravação. Verifique as permissões do microfone.");
    }
  };

  const stopRecording = async () => {
    try {
      const uri = await audioRecorder.stop();
      setIsRecording(false);

      // TODO: Quando o backend estiver pronto, enviar o áudio para validação
      // await enviarAudioParaValidacao(uri);

      setHasRecorded(true);
    } catch (error) {
      console.error("Erro ao parar gravação:", error);
      setIsRecording(false);
      alert("Erro ao parar gravação.");
    }
  };
  const handleConfirm = () => {
    if (hasRecorded) {
      setIsLoading(true);
      // Simula processamento (quando backend estiver pronto, validar aqui)
      setTimeout(() => {
        setIsLoading(false);
        onSuccess();
      }, 1000);
    }
  };

  const handleRecordToggle = async () => {
    if (isRecording) {
      await stopRecording();
    } else {
      await startRecording();
    }
  };
  return (
    <Modal
      visible={visible}
      animationType="fade"
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
              VERIFICAÇÃO DE VOZ
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Icon
                name="close"
                size={24}
                color={isDarkMode ? "#fff" : "#000"}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.content}>
            <Icon
              name="mic"
              size={60}
              color={isDarkMode ? "#4CAF50" : "#28a745"}
              style={styles.micIcon}
            />

            <Text
              style={[styles.userName, { color: isDarkMode ? "#fff" : "#000" }]}
            >
              {userName}
            </Text>

            <Text
              style={[
                styles.instruction,
                { color: isDarkMode ? "#ccc" : "#666" },
              ]}
            >
              Para confirmar sua identidade, por favor leia a frase abaixo em
              voz alta:
            </Text>

            <View
              style={[
                styles.fraseContainer,
                {
                  backgroundColor: isDarkMode ? "#1a1a1a" : "#f5f5f5",
                  borderColor: isDarkMode ? "#444" : "#ddd",
                },
              ]}
            >
              <Icon
                name="format-quote"
                size={24}
                color={isDarkMode ? "#666" : "#999"}
                style={styles.quoteIcon}
              />
              <Text
                style={[styles.frase, { color: isDarkMode ? "#fff" : "#000" }]}
              >
                {fraseAtual}
              </Text>
            </View>

            <Animated.View
              style={[
                styles.recordButtonContainer,
                { transform: [{ scale: pulseAnim }] },
              ]}
            >
              <TouchableOpacity
                style={[
                  styles.recordButton,
                  {
                    backgroundColor: isRecording ? "#dc3545" : "#28a745",
                  },
                ]}
                onPress={handleRecordToggle}
                disabled={isLoading}
              >
                <Icon
                  name={isRecording ? "stop" : "mic"}
                  size={40}
                  color="#fff"
                />
              </TouchableOpacity>
            </Animated.View>

            <Text
              style={[
                styles.recordStatus,
                { color: isDarkMode ? "#ccc" : "#666" },
              ]}
            >
              {isRecording
                ? "🔴 Gravando... Toque para parar"
                : hasRecorded
                ? "✅ Gravação concluída"
                : "🎤 Toque para começar a gravar"}
            </Text>

            <View style={styles.buttonContainer}>
              <Button
                mode="contained"
                style={[
                  styles.confirmButton,
                  {
                    backgroundColor: hasRecorded ? "#28a745" : "#ccc",
                  },
                ]}
                onPress={handleConfirm}
                disabled={!hasRecorded || isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  "CONFIRMAR IDENTIDADE"
                )}
              </Button>
            </View>

            <Text
              style={[styles.infoText, { color: isDarkMode ? "#888" : "#999" }]}
            >
              ℹ️ Esta gravação será usada apenas para validação de identidade
            </Text>
          </View>
        </View>
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
    maxWidth: 500,
    borderRadius: 12,
    padding: 24,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  closeButton: {
    padding: 4,
  },
  content: {
    alignItems: "center",
  },
  micIcon: {
    marginBottom: 16,
  },
  userName: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  instruction: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  fraseContainer: {
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 24,
    width: "100%",
    minHeight: 80,
    justifyContent: "center",
  },
  quoteIcon: {
    position: "absolute",
    top: 8,
    left: 8,
  },
  frase: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: "center",
    fontStyle: "italic",
    paddingHorizontal: 8,
  },
  recordButtonContainer: {
    marginVertical: 20,
  },
  recordButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  disabledButton: {
    opacity: 0.5,
  },
  recordStatus: {
    fontSize: 14,
    marginBottom: 24,
    textAlign: "center",
  },
  buttonContainer: {
    width: "100%",
    marginBottom: 16,
  },
  confirmButton: {
    borderRadius: 8,
    paddingVertical: 4,
  },
  infoText: {
    fontSize: 12,
    textAlign: "center",
    paddingHorizontal: 16,
  },
  warningText: {
    color: "#ff9800",
    fontSize: 14,
    marginBottom: 16,
    textAlign: "center",
  },
});

export default VoiceRecognitionModal;
