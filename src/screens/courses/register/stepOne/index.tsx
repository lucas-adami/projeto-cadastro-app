"use client";

import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  ScrollView,
  Text,
  TextInput,
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { Card, Button, ProgressBar, MD3Colors } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { FormStyles } from "../../../../style/FormStyles";
import { coursesRegisterSchema, siglaValidationSchema, codigoValidationSchema } from "../../../../validations/coursesRegisterValidations";
import { NavigationProp } from "../../../../routes/rootStackParamList ";
import { useThemeMode } from "../../../../context/ThemeContext";
import { useToast } from "../../../../utils/useToast";
import Toast from "../../../../components/atoms/Toast";

export default function StepOne() {
  const navigation = useNavigation<NavigationProp>();

  const [nome, setNome] = useState("");
  const [sigla, setSigla] = useState("");
  const [codigo, setCodigo] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});

  const { isDarkMode } = useThemeMode();
  const { toast, showWarning, hideToast } = useToast();

  const validateSigla = (value: string) => {
    if (value.length > 0) {
      try {
        siglaValidationSchema.validateSync(value);
      } catch (error: any) {
        showWarning(error.message);
      }
    }
  };

  const validateCodigo = (value: string) => {
    if (value.length > 0) {
      try {
        codigoValidationSchema.validateSync(value);
      } catch (error: any) {
        showWarning(error.message);
      }
    }
  };

  const handleSiglaChange = (value: string) => {
    setSigla(value);
    validateSigla(value);
  };

  const handleCodigoChange = (value: string) => {
    setCodigo(value);
    validateCodigo(value);
  };

  const handleAdvance = () => {
    try {
      setFieldErrors({});
      coursesRegisterSchema.validateSync(
        { nome, sigla, codigo },
        { abortEarly: false }
      );
      const partialDataCurso = {
        nome,
        sigla,
        codigo,
      };

      navigation.navigate("RegisterCourseStepTwo", { partialDataCurso });
    } catch (error: any) {
      if (error.name === "ValidationError") {
        const errors: { [key: string]: string } = {};
        error.inner.forEach((err: any) => {
          if (err.path) errors[err.path] = err.message;
        });
        setFieldErrors(errors);
      }
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: isDarkMode ? "#181818" : "#fff" }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <SafeAreaView style={[
          FormStyles.safeArea,
          { backgroundColor: isDarkMode ? "#181818" : "#fff" }
        ]}>
          <View style={FormStyles.container}>
            <ScrollView
              contentContainerStyle={[FormStyles.scrollContent, styles.scrollPadding]}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              <Card style={[
                FormStyles.card,
                { backgroundColor: isDarkMode ? "#232323" : "#fff" },
                styles.cardMargin
              ]} mode="elevated">
                <Card.Content>
                  <Text style={[
                    FormStyles.title,
                    { color: isDarkMode ? "#fff" : "#000" }
                  ]}>
                    Cadastro de Curso
                  </Text>

                  <Text style={[
                    FormStyles.description,
                    { color: isDarkMode ? "#fff" : "#000" }
                  ]}>
                    Insira os dados do Curso para registrá-lo no sistema
                  </Text>

                  <Text style={[
                    FormStyles.label,
                    { color: isDarkMode ? "#fff" : "#000" }
                  ]}>
                    Nome do Curso
                  </Text>
                  {fieldErrors.nome && (
                    <Text style={styles.errorText}>{fieldErrors.nome}</Text>
                  )}
                  <TextInput
                    placeholder="Nome do Curso"
                    placeholderTextColor={isDarkMode ? "#aaa" : "#888"}
                    style={[
                      FormStyles.input,
                      { color: isDarkMode ? "#fff" : "#000", borderColor: isDarkMode ? "#444" : "#ccc" },
                      fieldErrors.nome ? styles.inputError : null,
                    ]}
                    value={nome}
                    onChangeText={setNome}
                    returnKeyType="next"
                  />

                  <View style={styles.rowContainer}>
                    <View style={styles.halfInput}>
                      <Text style={[
                        FormStyles.label,
                        { color: isDarkMode ? "#fff" : "#000" }
                      ]}>
                        Sigla
                      </Text>
                      {fieldErrors.sigla && (
                        <Text style={styles.errorText}>{fieldErrors.sigla}</Text>
                      )}
                      <TextInput
                        placeholder="Sigla"
                        placeholderTextColor={isDarkMode ? "#aaa" : "#888"}
                        style={[
                          FormStyles.input,
                          { color: isDarkMode ? "#fff" : "#000", borderColor: isDarkMode ? "#444" : "#ccc" },
                          fieldErrors.sigla ? styles.inputError : null,
                        ]}
                        onChangeText={handleSiglaChange}
                        value={sigla}
                        returnKeyType="next"
                      />
                    </View>
                    <View style={styles.halfInput}>
                      <Text style={[
                        FormStyles.label,
                        { color: isDarkMode ? "#fff" : "#000" }
                      ]}>
                        Código
                      </Text>
                      {fieldErrors.codigo && (
                        <Text style={styles.errorText}>{fieldErrors.codigo}</Text>
                      )}
                      <TextInput
                        placeholder="Código"
                        placeholderTextColor={isDarkMode ? "#aaa" : "#888"}
                        style={[
                          FormStyles.input,
                          { color: isDarkMode ? "#fff" : "#000", borderColor: isDarkMode ? "#444" : "#ccc" },
                          fieldErrors.codigo ? styles.inputError : null,
                        ]}
                        onChangeText={handleCodigoChange}
                        value={codigo}
                        keyboardType="numeric"
                        returnKeyType="done"
                      />
                    </View>
                  </View>
                </Card.Content>

                <Card.Actions>
                  <Button
                    labelStyle={{ color: "white" }}
                    style={FormStyles.button}
                    onPress={handleAdvance}
                  >
                    Avançar
                  </Button>
                </Card.Actions>

                <ProgressBar progress={0.5} color={MD3Colors.neutral40} />
              </Card>
            </ScrollView>
          </View>

          <Toast
            visible={toast.visible}
            message={toast.message}
            type={toast.type}
            onDismiss={hideToast}
          />
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  errorText: {
    color: "red",
    alignSelf: "flex-start",
    marginBottom: 8,
    marginLeft: 2,
    fontSize: 12,
  },
  inputError: {
    borderColor: "red",
    borderWidth: 1,
  },
  scrollPadding: {
    paddingVertical: 20,
    paddingBottom: Platform.OS === 'ios' ? 100 : 80,
    flexGrow: 1,
  },
  cardMargin: {
    marginHorizontal: 16,
    marginVertical: 10,
  },
  rowContainer: {
    flexDirection: "row", 
    gap: 8,
    marginTop: 8,
  },
  halfInput: {
    flex: 1,
  },
});