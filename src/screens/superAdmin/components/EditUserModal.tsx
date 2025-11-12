import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { Modal, Portal, TextInput, Button, Switch } from "react-native-paper";
import { UsuarioResponse } from "../../../types/user";

interface EditUserModalProps {
  visible: boolean;
  user: UsuarioResponse | null;
  isDarkMode: boolean;
  themeColors: any;
  onDismiss: () => void;
  onSave: (userId: string, data: UpdateUserData) => Promise<void>;
}

export interface UpdateUserData {
  nome?: string;
  email?: string;
  role?: string;
  isActive?: boolean;
}

const EditUserModal: React.FC<EditUserModalProps> = ({
  visible,
  user,
  isDarkMode,
  themeColors,
  onDismiss,
  onSave,
}) => {
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    role: "",
    isActive: true,
  });

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        nome: user.nome,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
      });
    }
  }, [user]);

  const handleSave = async () => {
    if (!user) return;

    setSaving(true);
    try {
      await onSave(user.id, formData);
      onDismiss();
    } catch (error) {
      console.error("Erro ao salvar usuário:", error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        contentContainerStyle={[
          styles.modalContainer,
          { backgroundColor: isDarkMode ? "#232323" : "#fff" },
        ]}
      >
        <Text
          style={[styles.modalTitle, { color: isDarkMode ? "#fff" : "#000" }]}
        >
          Editar Usuário
        </Text>

        <ScrollView showsVerticalScrollIndicator={false}>
          <TextInput
            label="Nome"
            value={formData.nome}
            onChangeText={(text) => setFormData({ ...formData, nome: text })}
            mode="outlined"
            style={styles.input}
          />

          <TextInput
            label="Email"
            value={formData.email}
            onChangeText={(text) => setFormData({ ...formData, email: text })}
            mode="outlined"
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.input}
          />

          <View style={styles.infoContainer}>
            <Text
              style={[
                styles.infoLabel,
                { color: isDarkMode ? "#999" : "#666" },
              ]}
            >
              Role
            </Text>
            <Text
              style={[
                styles.infoValue,
                { color: isDarkMode ? "#fff" : "#000" },
              ]}
            >
              {formData.role}
            </Text>
          </View>

          <View style={styles.switchContainer}>
            <Text
              style={[
                styles.switchLabel,
                { color: isDarkMode ? "#fff" : "#000" },
              ]}
            >
              Usuário Ativo
            </Text>
            <Switch
              value={formData.isActive}
              onValueChange={(value) =>
                setFormData({ ...formData, isActive: value })
              }
            />
          </View>
        </ScrollView>

        <View style={styles.modalActions}>
          <Button mode="outlined" onPress={onDismiss} disabled={saving}>
            Cancelar
          </Button>
          <Button
            mode="contained"
            onPress={handleSave}
            loading={saving}
            disabled={saving}
          >
            Salvar
          </Button>
        </View>
      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    margin: 20,
    padding: 20,
    borderRadius: 12,
    maxHeight: "100%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  input: {
    marginBottom: 16,
  },
  infoContainer: {
    marginBottom: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  infoLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: "500",
  },
  switchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    paddingVertical: 8,
  },
  switchLabel: {
    fontSize: 16,
    fontWeight: "500",
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    gap: 2,
  },
});

export default EditUserModal;
