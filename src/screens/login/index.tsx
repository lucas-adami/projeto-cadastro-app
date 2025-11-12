import React, { useState, useEffect } from "react";
import {
  View,
  Image,
  Text,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  TouchableOpacity,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";

import { Card, Button, IconButton } from "react-native-paper";

import { useAuth } from "../../context/AuthContext";
import { login as loginService } from "../../services/users/authService";
import { userLoginSchema } from "../../validations/usersValidations";
import { FormStyles } from "../../style/FormStyles";
import { useThemeMode } from "../../context/ThemeContext";
import ThemeSwitch from "../../components/ThemeSwitch";
import { useToast } from "../../utils/useToast";
import Toast from "../../components/atoms/Toast";
import { authEventEmitter } from "../../events/AuthEventEmitter";

const LoginScreen = ({ navigation }: any) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  const { login: authLogin, user, userRole } = useAuth();

  const { isDarkMode, toggleTheme, theme } = useThemeMode();
  const { toast, showError, showInfo, hideToast } = useToast();

  // Escuta o evento de logout por token expirado
  useEffect(() => {
    const handleTokenExpired = () => {
      showInfo("Sua sessão expirou. Por favor, faça login novamente.");
    };

    authEventEmitter.on("logout", handleTokenExpired);

    return () => {
      authEventEmitter.off("logout", handleTokenExpired);
    };
  }, [showInfo]);

  const handleLogin = async () => {
    setFieldErrors({});
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    try {
      await userLoginSchema.validate(
        { email, senha: password },
        { abortEarly: false }
      );
      const loginResponse = await loginService(email, password);

      await authLogin(loginResponse.token, loginResponse.user);
    } catch (error: any) {
      if (error.name === "ValidationError") {
        const errors: { [key: string]: string } = {};
        error.inner.forEach((err: any) => {
          if (err.path) errors[err.path] = err.message;
        });
        setFieldErrors(errors);
      } else {
        // Mostra toast de erro para credenciais inválidas
        showError(
          "Email ou senha incorretos. Verifique suas credenciais e tente novamente."
        );
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
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
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
                Login
              </Text>
              <Text
                style={[
                  FormStyles.description,
                  { color: theme.colors.onBackground },
                ]}
              >
                Entre com seu e-mail e senha para acessar o sistema.
              </Text>
            </Card.Content>

            <Card.Actions style={{ flexDirection: "column", marginTop: 10 }}>
              {fieldErrors.email && (
                <Text style={styles.errorText}>{fieldErrors.email}</Text>
              )}
              {fieldErrors.senha && (
                <Text style={styles.errorText}>{fieldErrors.senha}</Text>
              )}

              <TextInput
                placeholder="E-mail"
                placeholderTextColor={theme.colors.outline}
                style={[
                  FormStyles.input,
                  {
                    width: "100%",
                    color: theme.colors.onBackground,
                    borderColor: theme.colors.outline,
                  },
                ]}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                autoComplete="email"
              />

              <View style={styles.passwordContainer}>
                <TextInput
                  placeholder="Senha"
                  placeholderTextColor={theme.colors.outline}
                  style={[
                    FormStyles.input,
                    {
                      flex: 1,
                      color: theme.colors.onBackground,
                      borderColor: theme.colors.outline,
                      backgroundColor: theme.colors.background,
                    },
                  ]}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
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
                  onPress={handleLogin}
                >
                  Entrar
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
                    onPress={() => navigation.navigate("ForgetPasswordStepOne")}
                  >
                    <Text style={styles.linkText}>Esqueceu sua senha?</Text>
                  </TouchableOpacity>
                </Card>
                <Card
                  style={[
                    styles.linkCard,
                    { backgroundColor: isDarkMode ? "#444" : "#a1a1a1" },
                  ]}
                  mode="elevated"
                >
                  <TouchableOpacity
                    onPress={() => navigation.navigate("Register")}
                  >
                    <Text style={styles.linkText}>
                      Não tem uma conta? Cadastre-se aqui
                    </Text>
                  </TouchableOpacity>
                </Card>
              </View>
            </Card.Actions>
          </Card>
        </View>
      </TouchableWithoutFeedback>

      <Toast
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
        onDismiss={hideToast}
      />
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
    color: "#fff", // Mantém o texto branco original
    textAlign: "center",
    fontSize: 14,
  },
});

export default LoginScreen;
