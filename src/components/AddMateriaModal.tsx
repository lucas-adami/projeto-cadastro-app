import React, { useState } from "react";
import {
  Modal,
  TextInput,
  StyleSheet,
  View,
  Text,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Keyboard,
  Platform,
} from "react-native";
import { Button, Card } from "react-native-paper";
import ListPicker from "./atoms/ListPicker";
import { Materia } from "../types/materia";
import { FormStyles } from "../style/FormStyles";

interface AddMateriaModalProps {
  visible: boolean;
  onClose: () => void;
  onAddMateria: (materia: Materia) => void;
  professors: any[];
  isDarkMode: boolean;
  buttonColor?: string;
}

const AddMateriaModal: React.FC<AddMateriaModalProps> = ({
  visible,
  onClose,
  onAddMateria,
  professors,
  isDarkMode,
  buttonColor,
}) => {
  const [newMateria, setNewMateria] = useState<Materia>({
    nome: "",
    cargaHoraria: 0,
    professorId: null,
  });

  const handleAddMateria = () => {
    if (newMateria.nome.trim() === "") return;
    onAddMateria(newMateria);
    setNewMateria({ nome: "", cargaHoraria: 0, professorId: null });
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
      transparent={true}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <KeyboardAvoidingView
          style={styles.modalContainer}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <Card style={[
            styles.modalCard,
            { backgroundColor: isDarkMode ? "#232323" : "#fff" }
          ]}>
            <Card.Content>
              <View style={{ height: 16 }} />

              <Text
                style={[
                  styles.title,
                  {
                    fontSize: 22,
                    color: isDarkMode ? "#fff" : "#000",
                    textAlign: "center",
                    marginBottom: 18,
                    fontWeight: "bold",
                  },
                ]}
              >
                Adicionar Matéria
              </Text>

              <Text
                style={[
                  styles.label,
                  { color: isDarkMode ? "#fff" : "#000", fontSize: 15, fontWeight: "bold" }
                ]}
              >
                Nome da Matéria
              </Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    color: isDarkMode ? "#fff" : "#000",
                    borderColor: isDarkMode ? "#444" : "#ccc",
                    backgroundColor: isDarkMode ? "#232323" : "#fff",
                  },
                ]}
                placeholder="Digite o nome da matéria"
                placeholderTextColor={isDarkMode ? "#888" : "#888"}
                value={newMateria.nome}
                onChangeText={(text) =>
                  setNewMateria({ ...newMateria, nome: text })
                }
              />

              <Text
                style={[
                  styles.label,
                  { color: isDarkMode ? "#fff" : "#000", fontSize: 15, fontWeight: "bold" }
                ]}
              >
                Carga Horária
              </Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    color: isDarkMode ? "#fff" : "#000",
                    borderColor: isDarkMode ? "#444" : "#ccc",
                    backgroundColor: isDarkMode ? "#232323" : "#fff",
                  },
                ]}
                placeholder="Digite a carga horária"
                placeholderTextColor={isDarkMode ? "#888" : "#888"}
                value={newMateria.cargaHoraria ? newMateria.cargaHoraria.toString() : ""}
                onChangeText={(text) =>
                  setNewMateria({
                    ...newMateria,
                    cargaHoraria: parseInt(text, 10) || 0,
                  })
                }
                keyboardType="numeric"
              />

              <Text
                style={[
                  styles.label,
                  { color: isDarkMode ? "#fff" : "#000", fontSize: 15, fontWeight: "bold" }
                ]}
              >
                Professor
              </Text>
              <View style={{ marginBottom: 24 }}>
                <ListPicker
                  items={professors}
                  onSelect={(id) =>
                    setNewMateria({ ...newMateria, professorId: id })
                  }
                  getLabel={(prof) => prof.nome}
                  getValue={(prof) => prof.id}
                  backgroundColor={isDarkMode ? "#202020" : "#fff"}
                />
              </View>

              <Button
                mode="contained"
                buttonColor={buttonColor || "#D32719"}
                labelStyle={{ color: "white" }}
                style={[FormStyles.button, { marginTop: 8 }]}
                onPress={handleAddMateria}
              >
                Adicionar
              </Button>

              {/* MODIFICADO: Trocado TouchableWithoutFeedback por TouchableOpacity */}
              <TouchableOpacity
                style={[
                  styles.linkCard,
                  { backgroundColor: isDarkMode ? "#444" : "#a1a1a1", marginTop: 12 }
                ]}
                onPress={onClose} // MOVIDO: onPress diretamente no TouchableOpacity
                activeOpacity={0.7} // ADICIONADO: Feedback visual ao tocar
              >
                <Text style={styles.linkText}>Fechar</Text>
              </TouchableOpacity>
            </Card.Content>
          </Card>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalCard: {
    width: "90%",
    padding: 20,
    minHeight: 500,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  label: {
    fontSize: 14,
    marginBottom: 5,
    marginTop: 8,
  },
  input: {
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    borderRadius: 4,
  },
  linkCard: {
    backgroundColor: "#a1a1a1",
    borderRadius: 8,
    elevation: 2,
    paddingVertical: 6,
    paddingHorizontal: 8,
    marginBottom: 4,
    minHeight: 36,
    justifyContent: "center",
    alignItems: "center",
  },
  linkText: {
      color: "#fff",
      textAlign: "center",
      fontSize: 14,
      fontWeight: "bold",
    },
});

export default AddMateriaModal;