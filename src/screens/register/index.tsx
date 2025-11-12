import * as React from "react";
import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Keyboard,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
  Image,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { Card, Button, IconButton } from "react-native-paper";

import { signUp } from "../../services/users/userService";
import { userRegisterSchema } from "../../validations/usersValidations";
import { FormStyles } from "../../style/FormStyles";
import { useThemeMode } from "../../context/ThemeContext";
import ThemeSwitch from "../../components/ThemeSwitch";
import { useToast } from "../../utils/useToast";
import Toast from "../../components/atoms/Toast";

const RegisterScreen = ({ navigation }: any) => {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  const { isDarkMode, toggleTheme, theme } = useThemeMode();
  const { toast, showSuccess, showError, hideToast } = useToast();

  const handleRegister = async () => {
    setFieldErrors({});
    setIsLoading(true);
    try {
      await userRegisterSchema.validate(
        { nome, email, senha },
        { abortEarly: false }
      );
      await signUp({ nome, email, senha });
      showSuccess("Cadastro realizado com sucesso!");
      setTimeout(() => {
        navigation.navigate("Login");
      }, 1500);
    } catch (error: any) {
      if (error.name === "ValidationError") {
        const errors: { [key: string]: string } = {};
        error.inner.forEach((err: any) => {
          if (err.path) errors[err.path] = err.message;
        });
        
        setFieldErrors(errors);
      } else {
        
        const errorMessage =
          error.response?.data?.mensagem || "Erro ao cadastrar";
        showError(errorMessage);
        console.log("Erros de validação:", error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: theme.colors.background }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.fullScreenContainer}>
          <View style={styles.switchContainer}>
            <ThemeSwitch isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
          </View>
          <Card
            style={[
              FormStyles.card,
              styles.card,
              { backgroundColor: theme.colors.background },
            ]}
            mode="elevated"
          >
            <Card.Content>
              <Image
                source={
                  isDarkMode
                    ? require("../../../assets/logoFatecCapi_lightCapivara2.png")
                    : require("../../../assets/logoFatecCapi.png")
                }
                style={styles.logo}
                resizeMode="contain"
              />
              <Text
                style={[FormStyles.title, { color: theme.colors.onBackground }]}
              >
                Cadastro
              </Text>
              <Text
                style={[
                  FormStyles.description,
                  { color: theme.colors.onBackground },
                ]}
              >
                Preencha os campos para criar sua conta.
              </Text>
            </Card.Content>
            <Card.Actions style={{ flexDirection: "column", marginTop: 10 }}>
              {fieldErrors.nome && (
                <Text style={styles.errorText}>{fieldErrors.nome}</Text>
              )}
              <TextInput
                style={[
                  FormStyles.input,
                  {
                    width: "100%",
                    color: theme.colors.onBackground,
                    borderColor: theme.colors.outline,
                  },
                  fieldErrors.nome ? styles.inputError : null,
                ]}
                placeholder="Nome"
                placeholderTextColor={theme.colors.outline}
                value={nome}
                onChangeText={setNome}
              />
              {fieldErrors.email && (
                <Text style={styles.errorText}>{fieldErrors.email}</Text>
              )}
              <TextInput
                style={[
                  FormStyles.input,
                  {
                    width: "100%",
                    color: theme.colors.onBackground,
                    borderColor: theme.colors.outline,
                  },
                  fieldErrors.email ? styles.inputError : null,
                ]}
                placeholder="E-mail"
                placeholderTextColor={theme.colors.outline}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                autoComplete="email"
              />
              {fieldErrors.senha && (
                <Text style={styles.errorText}>{fieldErrors.senha}</Text>
              )}
              <View style={styles.passwordContainer}>
                <TextInput
                  style={[
                    FormStyles.input,
                    { flex: 1 },
                    {
                      width: "100%",
                      color: theme.colors.onBackground,
                      borderColor: theme.colors.outline,
                    },
                    fieldErrors.senha ? styles.inputError : null,
                  ]}
                  placeholder="Senha"
                  placeholderTextColor={theme.colors.outline}
                  secureTextEntry={!showPassword}
                  value={senha}
                  onChangeText={setSenha}
                />
                <IconButton
                  icon={showPassword ? "eye-off" : "eye"}
                  size={20}
                  onPress={() => setShowPassword(!showPassword)}
                  style={{
                    marginRight: 4,
                    marginBottom: 12,
                    backgroundColor: "transparent",
                  }}
                  iconColor={theme.colors.outline}
                />
              </View>
              {fieldErrors.api && (
                <Text style={styles.errorText}>{fieldErrors.api}</Text>
              )}
              {isLoading ? (
                <ActivityIndicator
                  size="large"
                  color="#D32719"
                  style={{ marginBottom: 20, marginTop: 10 }}
                />
              ) : (
                <Button
                  mode="contained"
                  buttonColor="#D32719"
                  labelStyle={{ color: "white" }}
                  style={FormStyles.button}
                  onPress={handleRegister}
                >
                  Cadastrar
                </Button>
              )}
              <View style={styles.linksContainer}>
                <Card
                  style={[
                    styles.linkCard,
                    { backgroundColor: isDarkMode ? "#444" : "#a1a1a1" },
                  ]}
                  mode="elevated"
                >
                  <TouchableOpacity
                    onPress={() => navigation.navigate("Login")}
                  >
                    <Text style={styles.linkText}>
                      Já tem uma conta? Entrar
                    </Text>
                  </TouchableOpacity>
                </Card>
              </View>
            </Card.Actions>
          </Card>

          <Toast
            visible={toast.visible}
            message={toast.message}
            type={toast.type}
            onDismiss={hideToast}
          />
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  fullScreenContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  switchContainer: {
    position: "absolute",
    top: 40,
    right: 24,
    flexDirection: "row",
    alignItems: "center",
    zIndex: 2,
  },
  card: {
    width: "100%",
    maxWidth: 400,
    padding: 10,
  },
  logo: {
    width: 300,
    height: 200,
    alignSelf: "center",
    marginBottom: 10,
  },
  errorText: {
    color: "red",
    alignSelf: "flex-start",
    marginBottom: 8,
    marginLeft: 2,
    fontSize: 12,
  },
  inputError: {
    borderColor: "red",
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginBottom: 10,
  },
  linksContainer: {
    width: "100%",
    marginTop: 10,
    gap: 8,
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
  },
  linkText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 14,
  },
});

export default RegisterScreen;
