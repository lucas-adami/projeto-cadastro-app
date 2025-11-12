import {
    View, Image, Text, StyleSheet, KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
} from "react-native";
import { FormStyles } from "../../../style/FormStyles";
import { Card, Button } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { OtpInput } from "react-native-otp-entry";
import { compareCode } from "../../../services/users/authService";
import { useThemeMode } from "../../../context/ThemeContext";
import ThemeSwitch from "../../../components/ThemeSwitch";

const ForgetPasswordStepTwo = () => {
    const navigation = useNavigation()
    const [code, setCode] = useState("")
    const [loading, setLoading] = useState(false);
    const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});

    const { isDarkMode, toggleTheme } = useThemeMode();

    const handleSubmit = async () => {
        setFieldErrors({});
        setLoading(true);

        await new Promise((resolve) => setTimeout(resolve, 2000));

        try {
            await compareCode(code)
            navigation.navigate("ForgetPasswordStepThree" as never)
        } catch (error: any) {
            if (error.name === "ValidationError") {
                const errors: { [key: string]: string } = {};
                error.inner.forEach((err: any) => {
                    if (err.path) errors[err.path] = err.message;
                });
                setFieldErrors(errors);
            } else {
                setFieldErrors({
                    api: error.response?.data?.mensagem || "Erro ao seguir com a recuperação de senha",
                });
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <KeyboardAvoidingView
            style={{ flex: 1, backgroundColor: isDarkMode ? "#181818" : "#fff" }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <View style={styles.fullScreenContainer}>
                <View style={styles.switchContainer}>
                    <ThemeSwitch isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
                </View>
                <Card style={[FormStyles.card, styles.card, { backgroundColor: isDarkMode ? "#232323" : "#fff" }]} mode="elevated">
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
                        <Text style={[FormStyles.title, { color: isDarkMode ? "#fff" : "#000" }]}>Recuperar Senha</Text>
                        <Text style={[FormStyles.description, { color: isDarkMode ? "#fff" : "#000" }]}>
                            Insira o código enviado no seu e-mail
                        </Text>
                        {fieldErrors.api && (
                            <Text style={styles.errorText}>{fieldErrors.api}</Text>
                        )}
                        <OtpInput
                            numberOfDigits={6}
                            onTextChange={(text) => console.log(text)}
                            placeholder="******"
                            blurOnFilled={true}
                            autoFocus={false}
                            onFilled={(text) => setCode(text)}
                        />;
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
                                style={[FormStyles.button, { marginTop: 30 }]}
                                onPress={handleSubmit}
                            >
                                Verificar
                            </Button>
                        )}
                        <Button
                            onPress={() => navigation.navigate("Login" as never)}
                            style={[FormStyles.button, { marginTop: 10, backgroundColor: "transparent" }]}
                            labelStyle={{ color: isDarkMode ? "#fff" : "black" }}
                        >
                            Cancelar
                        </Button>
                    </Card.Content>
                </Card>
            </View>
        </KeyboardAvoidingView>
    )
}

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
});

export default ForgetPasswordStepTwo;