import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
  TextInput,
} from "react-native";
import { Card, Button, IconButton } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { useThemeMode } from "../../context/ThemeContext";
import { changePassword } from "../../services/users/authService";
import { userPasswordSchema } from "../../validations/usersValidations";
import { FormStyles } from "../../style/FormStyles";

const SettingsScreen = () => {
  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmNovaSenha, setConfirmNovaSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});
  const [showSenhaAtual, setShowSenhaAtual] = useState(false);
  const [showNovaSenha, setShowNovaSenha] = useState(false);
  const [showConfirmSenha, setShowConfirmSenha] = useState(false);

  const navigation = useNavigation();
  const { theme } = useThemeMode();

  const handleChangePassword = async () => {
    setFieldErrors({});
    setLoading(true);

    try {
      // Validar se as senhas coincidem
      if (novaSenha !== confirmNovaSenha) {
        setFieldErrors({ novaSenha: "As senhas não coincidem" });
        setLoading(false);
        return;
      }

      // Validar formato da nova senha
      await userPasswordSchema.validate(
        { senha: novaSenha },
        { abortEarly: false }
      );

      // Chamar API para alterar senha
      const response = await changePassword(senhaAtual, novaSenha);

      Alert.alert(
        "Sucesso",
        response.mensagem || "Senha alterada com sucesso!"
      );

      // Limpar campos
      setSenhaAtual("");
      setNovaSenha("");
      setConfirmNovaSenha("");
    } catch (error: any) {
      if (error.name === "ValidationError") {
        const errors: { [key: string]: string } = {};
        error.inner.forEach((err: any) => {
          if (err.path) errors[err.path] = err.message;
        });
        setFieldErrors(errors);
      } else {
        setFieldErrors({
          api: error.response?.data?.mensagem || "Erro ao alterar senha",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <Card
            style={[styles.card, { backgroundColor: theme.colors.surface }]}
            mode="elevated"
          >
            <Card.Content>
              <View style={styles.header}>
                <IconButton
                  icon="arrow-left"
                  size={24}
                  onPress={() => navigation.goBack()}
                  iconColor={theme.colors.onBackground}
                />
                <Text
                  style={[styles.title, { color: theme.colors.onBackground }]}
                >
                  Configurações
                </Text>
                <View style={{ width: 40 }} />
              </View>

              <Text
                style={[
                  styles.sectionTitle,
                  { color: theme.colors.onBackground },
                ]}
              >
                Alterar Senha
              </Text>

              {fieldErrors.api && (
                <Text style={styles.errorText}>{fieldErrors.api}</Text>
              )}

              <Text
                style={[styles.label, { color: theme.colors.onBackground }]}
              >
                Senha Atual
              </Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  placeholder="Digite sua senha atual"
                  placeholderTextColor={theme.colors.outline}
                  secureTextEntry={!showSenhaAtual}
                  style={[
                    FormStyles.input,
                    {
                      flex: 1,
                      color: theme.colors.onBackground,
                      borderColor: theme.colors.outline,
                    },
                  ]}
                  value={senhaAtual}
                  onChangeText={setSenhaAtual}
                />
                <IconButton
                  icon={showSenhaAtual ? "eye-off" : "eye"}
                  size={20}
                  onPress={() => setShowSenhaAtual(!showSenhaAtual)}
                  iconColor={theme.colors.outline}
                  style={styles.eyeIcon}
                />
              </View>

              <Text
                style={[styles.label, { color: theme.colors.onBackground }]}
              >
                Nova Senha
              </Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  placeholder="Digite sua nova senha"
                  placeholderTextColor={theme.colors.outline}
                  secureTextEntry={!showNovaSenha}
                  style={[
                    FormStyles.input,
                    {
                      flex: 1,
                      color: theme.colors.onBackground,
                      borderColor: theme.colors.outline,
                    },
                  ]}
                  value={novaSenha}
                  onChangeText={setNovaSenha}
                />
                <IconButton
                  icon={showNovaSenha ? "eye-off" : "eye"}
                  size={20}
                  onPress={() => setShowNovaSenha(!showNovaSenha)}
                  iconColor={theme.colors.outline}
                  style={styles.eyeIcon}
                />
              </View>
              {fieldErrors.senha && (
                <Text style={styles.errorText}>{fieldErrors.senha}</Text>
              )}

              <Text
                style={[styles.label, { color: theme.colors.onBackground }]}
              >
                Confirmar Nova Senha
              </Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  placeholder="Confirme sua nova senha"
                  placeholderTextColor={theme.colors.outline}
                  secureTextEntry={!showConfirmSenha}
                  style={[
                    FormStyles.input,
                    {
                      flex: 1,
                      color: theme.colors.onBackground,
                      borderColor: theme.colors.outline,
                    },
                  ]}
                  value={confirmNovaSenha}
                  onChangeText={setConfirmNovaSenha}
                />
                <IconButton
                  icon={showConfirmSenha ? "eye-off" : "eye"}
                  size={20}
                  onPress={() => setShowConfirmSenha(!showConfirmSenha)}
                  iconColor={theme.colors.outline}
                  style={styles.eyeIcon}
                />
              </View>
              {fieldErrors.novaSenha && (
                <Text style={styles.errorText}>{fieldErrors.novaSenha}</Text>
              )}

              {loading ? (
                <ActivityIndicator
                  size="large"
                  color="#D32719"
                  style={styles.loader}
                />
              ) : (
                <Button
                  mode="contained"
                  buttonColor="#D32719"
                  labelStyle={{ color: "white" }}
                  style={styles.button}
                  onPress={handleChangePassword}
                  disabled={!senhaAtual || !novaSenha || !confirmNovaSenha}
                >
                  Alterar Senha
                </Button>
              )}
            </Card.Content>
          </Card>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 16,
  },
  card: {
    width: "100%",
    maxWidth: 500,
    alignSelf: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
    marginTop: 8,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  eyeIcon: {
    marginLeft: -8,
    marginTop: -8,
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginBottom: 8,
  },
  button: {
    marginTop: 24,
    paddingVertical: 8,
  },
  loader: {
    marginTop: 24,
  },
});

export default SettingsScreen;
