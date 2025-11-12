import { FormStyles } from "../../../style/FormStyles";
import { Card, Button, IconButton } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { resetPassword } from "../../../services/users/authService";
import { userPasswordSchema } from "../../../validations/usersValidations";
import {
  KeyboardAvoidingView,
  Platform,
  View,
  Image,
  Text,
  TextInput,
  ActivityIndicator,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { useThemeMode } from "../../../context/ThemeContext";
import ThemeSwitch from "../../../components/ThemeSwitch";

const ForgetPasswordStepThree = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigation = useNavigation();
  const { isDarkMode, toggleTheme, theme } = useThemeMode();

  const handleSubmit = async () => {
    setFieldErrors({});
    setLoading(true);
    try {
      const trimmedPassword = password.trim();
      const trimmedConfirmPassword = confirmPassword.trim();

      if (trimmedPassword !== trimmedConfirmPassword) {
        setFieldErrors({ senha: "Senhas não são iguais." });
        setLoading(false);
        return;
      }

      if (!trimmedPassword) {
        setFieldErrors({ senha: "Senha não pode estar vazia." });
        setLoading(false);
        return;
      }

      await userPasswordSchema.validate(
        { senha: trimmedPassword },
        { abortEarly: false }
      );

      await resetPassword(trimmedPassword);

      navigation.navigate("Login" as never);
    } catch (error: any) {
      if (error.name === "ValidationError") {
        const errors: { [key: string]: string } = {};
        error.inner.forEach((err: any) => {
          if (err.path) errors[err.path] = err.message;
        });
        setFieldErrors(errors);
      } else {
        const errorMessage =
          error.response?.data?.mensagem ||
          error.message ||
          "Erro ao resetar senha";
        setFieldErrors({
          api: errorMessage,
        });
      }
    } finally {
      setLoading(false);
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
                    ? require("../../../../assets/cps2.png")
                    : require("../../../../assets/cps.png")
                }
                style={{ width: 300, height: 200, alignSelf: "center" }}
                resizeMode="contain"
              />
              <Text
                style={[FormStyles.title, { color: theme.colors.onBackground }]}
              >
                Recuperar Senha
              </Text>
              <Text
                style={[
                  FormStyles.description,
                  { color: theme.colors.onBackground },
                ]}
              >
                Cadastre sua nova senha!
              </Text>
              {fieldErrors.senha && (
                <Text style={styles.errorText}>{fieldErrors.senha}</Text>
              )}
              {fieldErrors.api && (
                <Text style={styles.errorText}>{fieldErrors.api}</Text>
              )}
              <Text style={{ color: theme.colors.onBackground }}>Senha</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  placeholder="Senha"
                  placeholderTextColor={theme.colors.outline}
                  secureTextEntry={!showPassword}
                  style={[
                    FormStyles.input,
                    {
                      flex: 1,
                      color: theme.colors.onBackground,
                      borderColor: theme.colors.outline,
                    },
                  ]}
                  value={password}
                  onChangeText={setPassword}
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
              <Text style={{ color: theme.colors.onBackground }}>
                Confirmar Senha
              </Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  placeholder="Confirmar nova senha"
                  placeholderTextColor={theme.colors.outline}
                  secureTextEntry={!showConfirmPassword}
                  style={[
                    FormStyles.input,
                    {
                      flex: 1,
                      color: theme.colors.onBackground,
                      borderColor: theme.colors.outline,
                    },
                  ]}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                />
                <IconButton
                  icon={showConfirmPassword ? "eye-off" : "eye"}
                  size={20}
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={{
                    marginRight: 4,
                    marginBottom: 12,
                    backgroundColor: "transparent",
                  }}
                  iconColor={theme.colors.outline}
                />
              </View>
              {loading ? (
                <ActivityIndicator
                  size="large"
                  color="#D32719"
                  style={{ marginBottom: 20 }}
                />
              ) : (
                <Button
                  mode="contained"
                  buttonColor="#D32719"
                  labelStyle={{ color: "white" }}
                  style={[FormStyles.button, { marginTop: 20 }]}
                  onPress={handleSubmit}
                >
                  Concluir
                </Button>
              )}
            </Card.Content>
          </Card>
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
    marginBottom: 12,
  },
});

export default ForgetPasswordStepThree;
