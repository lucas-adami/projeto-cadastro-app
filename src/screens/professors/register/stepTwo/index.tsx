"use client";

import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  ScrollView,
  Text,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import {
  Card,
  Button,
  ProgressBar,
  MD3Colors,
  Modal,
  Portal,
} from "react-native-paper";
import ListPicker from "../../../../components/atoms/ListPicker";
import HamburgerMenu from "../../../../components/HamburgerMenu";
import { useRoute, useNavigation } from "@react-navigation/native";
import { RouteParamsProps } from "../../../../routes/rootStackParamList ";
import { FormStyles } from "../../../../style/FormStyles";
import { postProfessor } from "../../../../services/professors/professorService";
import {
  Referencia,
  StatusAtividade,
} from "../../../../enums/professors/professorEnum";
import { useProfessor } from "../../../../context/ProfessorContext";
import { professorRegisterStep2Schema } from "../../../../validations/professorsRegisterValidations";
import { SuggestionSwitch } from "../../../../components/SuggestionSwitch";
import { useSuggestionSwitch } from "../../../../context/SuggestionSwitchContext";
import { sugerirProfessorIA } from "../../../../services/ia/iaService";
import { FieldSuggestionButton } from "../../../../components/FieldSuggestionButton";
import { useThemeMode } from "../../../../context/ThemeContext";
import { getPlaceholderColor } from "../../../../utils/getPlaceholderColor";
import { useToast } from "../../../../utils/useToast";
import Toast from "../../../../components/atoms/Toast";

export default function ProfessorFormStepTwo() {
  const navigation = useNavigation();
  const { refreshProfessorsData } = useProfessor();
  const route = useRoute<RouteParamsProps<"RegisterProfessorsStepTwo">>();
  const { suggestionEnabled, setSuggestionEnabled } = useSuggestionSwitch();
  const { partialDataProfessor } = route.params;

  const [lattes, setLattes] = useState(partialDataProfessor?.lattes || "");
  const [referencia, setReferencia] = useState(
    partialDataProfessor?.referencia || ""
  );
  const [statusAtividade, setStatusAtividade] = useState(
    partialDataProfessor?.statusAtividade || ""
  );
  const [observacoes, setObservacoes] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMsg, setModalMsg] = useState("");
  const [missingFields, setMissingFields] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<{
    lattes?: string;
    referencia?: string;
    statusAtividade?: string;
    observacoes?: string;
  }>({});
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);

  const { isDarkMode } = useThemeMode();
  const { toast, showError, showSuccess, hideToast } = useToast();

  useEffect(() => {
    let isMounted = true;
    let timeout: NodeJS.Timeout;
    const fetchInitialSuggestions = async () => {
      if (!suggestionEnabled) {
        setSuggestions({});
        return;
      }
      setLoadingSuggestions(true);
      try {
        const data = await sugerirProfessorIA(partialDataProfessor);
        if (isMounted) {
          timeout = setTimeout(() => {
            setSuggestions(data);
          }, 600);
        }
      } catch {
        if (isMounted) setSuggestions({});
      } finally {
        if (isMounted) setLoadingSuggestions(false);
      }
    };
    fetchInitialSuggestions();
    return () => {
      isMounted = false;
      if (timeout) clearTimeout(timeout);
    };
  }, [suggestionEnabled]);

  const fetchSuggestions = async (fieldChanged: string, value: string) => {
    if (!suggestionEnabled) return;
    setLoadingSuggestions(true);
    try {
      const partial: Record<string, any> = { ...partialDataProfessor };
      if (fieldChanged === "lattes" && value) partial.lattes = value;
      else if (lattes) partial.lattes = lattes;
      if (fieldChanged === "referencia" && value) partial.referencia = value;
      else if (referencia) partial.referencia = referencia;
      if (fieldChanged === "statusAtividade" && value)
        partial.statusAtividade = value;
      else if (statusAtividade) partial.statusAtividade = statusAtividade;
      if (fieldChanged === "observacoes" && value) partial.observacoes = value;
      else if (observacoes) partial.observacoes = observacoes;
      const data = await sugerirProfessorIA(partial);
      setSuggestions(data);
    } catch {
      setSuggestions({});
    } finally {
      setLoadingSuggestions(false);
    }
  };

  const handleSubmit = async () => {
    try {
      setFieldErrors({});
      setMissingFields([]);
      await professorRegisterStep2Schema.validate(
        { lattes, referencia, observacoes, statusAtividade },
        { abortEarly: false }
      );
      const professor = {
        ...partialDataProfessor,
        lattes,
        referencia,
        observacoes,
        statusAtividade,
      };
      const response = await postProfessor(professor);
      if (response?.sucesso === false) {
        setModalMsg(
          response?.erro ||
            "Erro ao criar professor. Verifique os campos e tente novamente."
        );
        setModalVisible(true);
        return;
      }
      refreshProfessorsData();
      showSuccess("Professor cadastrado com sucesso!");
      setTimeout(() => {
        navigation.navigate("RegisterProfessorsFinished" as never);
      }, 1500);
    } catch (error: any) {
      if (error.name === "ValidationError") {
        const errors: { [key: string]: string } = {};
        const missing: string[] = [];
        error.inner.forEach((err: any) => {
          if (err.path) {
            errors[err.path] = err.message;
            missing.push(err.message);
          }
        });
        setFieldErrors(errors);
        setMissingFields(missing);
        setModalMsg("");
        setModalVisible(true);
      } else {
        setModalMsg("Erro inesperado. Tente novamente.");
        setMissingFields([]);
        setModalVisible(true);
      }
      const errorMessage =
        error.response?.data?.mensagem || "Erro ao cadastrar professor";
      showError(errorMessage);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <SafeAreaView
          style={[
            [
              FormStyles.safeArea,
              { backgroundColor: isDarkMode ? "#181818" : "#fff" },
            ],
            { backgroundColor: isDarkMode ? "#181818" : "#fff" },
          ]}
        >
          <View style={FormStyles.menuContainer}>
            <HamburgerMenu />
          </View>
          <Button
            mode="outlined"
            onPress={() => navigation.goBack()}
            style={FormStyles.goBackButton}
            labelStyle={{ color: "white" }}
          >
            Voltar
          </Button>
          <View style={FormStyles.container}>
            <ScrollView
              contentContainerStyle={FormStyles.scrollContent}
              keyboardShouldPersistTaps="handled"
            >
              <Card
                style={[
                  FormStyles.card,
                  { backgroundColor: isDarkMode ? "#232323" : "#fff" },
                  { backgroundColor: isDarkMode ? "#232323" : "#fff" },
                ]}
                mode="elevated"
              >
                <Card.Content>
                  <Text
                    style={[
                      [
                        FormStyles.title,
                        { color: isDarkMode ? "#fff" : "#000" },
                      ],
                      { color: isDarkMode ? "#fff" : "#000" },
                    ]}
                  >
                    2º Etapa
                  </Text>
                  <Text
                    style={[
                      [
                        FormStyles.description,
                        { color: isDarkMode ? "#fff" : "#000" },
                      ],
                      { color: isDarkMode ? "#fff" : "#000" },
                    ]}
                  >
                    Insira os dados do professor para registrá-lo no sistema
                  </Text>
                  <Text
                    style={[
                      FormStyles.label,
                      { color: isDarkMode ? "#fff" : "#000" },
                    ]}
                  >
                    Lattes
                  </Text>
                  {fieldErrors.lattes && (
                    <Text style={styles.errorText}>{fieldErrors.lattes}</Text>
                  )}
                  <View style={styles.inputRow}>
                    <TextInput
                      placeholder={
                        !lattes && suggestions.lattes && suggestionEnabled
                          ? suggestions.lattes
                          : "ex: http://lattes.cnpq.br/7144753485915650"
                      }
                      style={[
                        FormStyles.input,
                        styles.inputFlex,
                        {
                          color: isDarkMode ? "#fff" : "#000",
                          borderColor: isDarkMode ? "#444" : "#ccc",
                        },
                        fieldErrors.lattes ? styles.inputError : null,
                        !lattes && suggestions.lattes && suggestionEnabled
                          ? styles.suggestionPlaceholder
                          : null,
                      ]}
                      value={lattes}
                      onChangeText={(text) => {
                        setLattes(text);
                        if (fieldErrors.lattes)
                          setFieldErrors((prev) => {
                            const updated = { ...prev };
                            delete updated.lattes;
                            return updated;
                          });
                      }}
                      onBlur={() => fetchSuggestions("lattes", lattes)}
                      placeholderTextColor={getPlaceholderColor({
                        isDarkMode,
                        suggestionEnabled,
                        hasSuggestion: !lattes && !!suggestions.lattes,
                      })}
                    />
                    {!lattes && suggestions.lattes && suggestionEnabled && (
                      <FieldSuggestionButton
                        onPress={() => setLattes(suggestions.lattes!)}
                      />
                    )}
                  </View>
                  <Text
                    style={[
                      FormStyles.label,
                      { color: isDarkMode ? "#fff" : "#000" },
                    ]}
                  >
                    Referência
                  </Text>
                  {fieldErrors.referencia && (
                    <Text style={styles.errorText}>
                      {fieldErrors.referencia}
                    </Text>
                  )}
                  <View style={styles.inputRow}>
                    <View style={styles.pickerFlex}>
                      <ListPicker
                        items={Object.values(Referencia)}
                        selected={referencia}
                        onSelect={(ref: Referencia) => {
                          setReferencia(ref);
                          if (fieldErrors.referencia)
                            setFieldErrors((prev) => {
                              const updated = { ...prev };
                              delete updated.referencia;
                              return updated;
                            });
                          fetchSuggestions("referencia", ref);
                        }}
                        suggestedLabel={
                          !referencia &&
                          suggestions.referencia &&
                          suggestionEnabled
                            ? suggestions.referencia
                            : undefined
                        }
                        suggestionStyle={{
                          fontStyle: "italic",
                          color: "#D32719",
                        }}
                        backgroundColor={isDarkMode ? "#202020" : "#fff"}
                      />
                    </View>
                    {!referencia &&
                      suggestions.referencia &&
                      suggestionEnabled && (
                        <FieldSuggestionButton
                          onPress={() => setReferencia(suggestions.referencia!)}
                        />
                      )}
                  </View>
                  <Text
                    style={[
                      FormStyles.label,
                      { color: isDarkMode ? "#fff" : "#000" },
                    ]}
                  >
                    Observações
                  </Text>
                  {fieldErrors.observacoes && (
                    <Text style={styles.errorText}>
                      {fieldErrors.observacoes}
                    </Text>
                  )}
                  <View style={styles.inputRow}>
                    <TextInput
                      placeholder={
                        !observacoes &&
                        suggestions.observacoes &&
                        suggestionEnabled
                          ? suggestions.observacoes
                          : "Professor de licença..."
                      }
                      style={[
                        FormStyles.input,
                        styles.inputFlex,
                        {
                          color: isDarkMode ? "#fff" : "#000",
                          borderColor: isDarkMode ? "#444" : "#ccc",
                        },
                        fieldErrors.observacoes ? styles.inputError : null,
                        !observacoes &&
                        suggestions.observacoes &&
                        suggestionEnabled
                          ? styles.suggestionPlaceholder
                          : null,
                      ]}
                      onChangeText={(text) => {
                        setObservacoes(text);
                        if (fieldErrors.observacoes)
                          setFieldErrors((prev) => {
                            const updated = { ...prev };
                            delete updated.observacoes;
                            return updated;
                          });
                      }}
                      value={observacoes}
                      onBlur={() =>
                        fetchSuggestions("observacoes", observacoes)
                      }
                      placeholderTextColor={getPlaceholderColor({
                        isDarkMode,
                        suggestionEnabled,
                        hasSuggestion:
                          !observacoes && !!suggestions.observacoes,
                      })}
                    />
                    {!observacoes &&
                      suggestions.observacoes &&
                      suggestionEnabled && (
                        <FieldSuggestionButton
                          onPress={() =>
                            setObservacoes(suggestions.observacoes!)
                          }
                        />
                      )}
                  </View>
                  <Text
                    style={[
                      FormStyles.label,
                      { color: isDarkMode ? "#fff" : "#000" },
                    ]}
                  >
                    Professor está ativo?
                  </Text>
                  {fieldErrors.statusAtividade && (
                    <Text style={styles.errorText}>
                      {fieldErrors.statusAtividade}
                    </Text>
                  )}
                  <View style={styles.inputRow}>
                    <View style={styles.pickerFlex}>
                      <ListPicker
                        items={Object.values(StatusAtividade)}
                        selected={statusAtividade}
                        onSelect={(status) => {
                          setStatusAtividade(status);
                          if (fieldErrors.statusAtividade)
                            setFieldErrors((prev) => {
                              const updated = { ...prev };
                              delete updated.statusAtividade;
                              return updated;
                            });
                          fetchSuggestions("statusAtividade", status);
                        }}
                        suggestedLabel={
                          !statusAtividade &&
                          suggestions.statusAtividade &&
                          suggestionEnabled
                            ? suggestions.statusAtividade
                            : undefined
                        }
                        suggestionStyle={{
                          fontStyle: "italic",
                          color: "#D32719",
                        }}
                        backgroundColor={isDarkMode ? "#202020" : "#fff"}
                      />
                    </View>
                    {!statusAtividade &&
                      suggestions.statusAtividade &&
                      suggestionEnabled && (
                        <FieldSuggestionButton
                          onPress={() =>
                            setStatusAtividade(suggestions.statusAtividade!)
                          }
                        />
                      )}
                  </View>
                </Card.Content>
                <Card.Actions>
                  <Button
                    labelStyle={{ color: "white" }}
                    style={FormStyles.button}
                    onPress={handleSubmit}
                  >
                    Finalizar
                  </Button>
                </Card.Actions>
                <ProgressBar progress={0.8} color={MD3Colors.neutral40} />
              </Card>
              <View style={{ marginTop: 16 }}>
                <SuggestionSwitch
                  value={suggestionEnabled}
                  onValueChange={setSuggestionEnabled}
                  label={`Sugestões de \n     Cadastro`}
                  labelColor={isDarkMode ? "#ccc" : "#333"}
                />
              </View>
            </ScrollView>
          </View>
          <Portal>
            <Modal
              visible={modalVisible}
              onDismiss={() => setModalVisible(false)}
              contentContainerStyle={{
                backgroundColor: isDarkMode ? "#232323" : "white",
                padding: 20,
                margin: 20,
                borderRadius: 10,
              }}
            >
              <Text
                style={[
                  styles.modalTitle,
                  { color: isDarkMode ? "#fff" : "#000" },
                ]}
              >
                Erro ao cadastrar professor
              </Text>
              {missingFields.length > 0 ? (
                <>
                  <Text
                    style={{
                      marginBottom: 10,
                      color: isDarkMode ? "#fff" : "#000",
                    }}
                  >
                    Preencha corretamente os campos obrigatórios:
                  </Text>
                  {missingFields.map((msg, idx) => (
                    <Text key={idx} style={{ color: "red", marginBottom: 2 }}>
                      - {msg}
                    </Text>
                  ))}
                  <View style={{ height: 15 }} />
                </>
              ) : (
                <Text
                  style={{
                    marginBottom: 35,
                    color: isDarkMode ? "#fff" : "#000",
                  }}
                >
                  {modalMsg}
                </Text>
              )}
              <Button
                mode="contained"
                buttonColor={FormStyles.button.backgroundColor}
                labelStyle={{ color: "white" }}
                style={FormStyles.button}
                onPress={() => setModalVisible(false)}
              >
                Fechar
              </Button>
            </Modal>
          </Portal>

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
  modalTitle: {
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 10,
    textAlign: "left",
  },
  suggestionPlaceholder: {
    fontStyle: "italic",
    color: "#D32719",
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  inputFlex: {
    flex: 1,
  },
  pickerFlex: {
    flex: 1,
  },
});
