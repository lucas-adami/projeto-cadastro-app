"use client";

import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  ScrollView,
  Text,
  TextInput,
  StyleSheet,
  Keyboard,
  TouchableWithoutFeedback,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import { Card, Button, ProgressBar, MD3Colors } from "react-native-paper";
import ListPicker from "../../../../components/atoms/ListPicker";
import { useNavigation, useRoute } from "@react-navigation/native";
import { NavigationProp, RouteParamsProps } from "../../../../routes/rootStackParamList ";
import { FormStyles } from "../../../../style/FormStyles";
import { Titulacao } from "../../../../enums/professors/professorEnum";
import { professorRegisterSchema } from "../../../../validations/professorsRegisterValidations";
import HamburgerMenu from "../../../../components/HamburgerMenu";

import AsyncStorage from "@react-native-async-storage/async-storage";
import locationAnimation from "../../../../../assets/location-icon.json";
import { UnitSuggestionButton } from "../../../../components/UnitSuggestionButton";
import { SuggestionSwitch } from "../../../../components/SuggestionSwitch";
import { sugerirProfessorIA } from "../../../../services/ia/iaService";
import { FieldSuggestionButton } from "../../../../components/FieldSuggestionButton";
import { useSuggestionSwitch } from "../../../../context/SuggestionSwitchContext";

import { useThemeMode } from "../../../../context/ThemeContext";
import { getPlaceholderColor } from "../../../../utils/getPlaceholderColor";

export default function ProfessorFormStepOne() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteParamsProps<"RegisterProfessorsStepOne">>();
  const iaData = route.params?.iaData;

  const { suggestionEnabled, setSuggestionEnabled } = useSuggestionSwitch();

  const [nome, setNome] = useState(iaData?.nome || "");
  const [email, setEmail] = useState(iaData?.email || "");
  const [titulacao, setTitulacao] = useState(iaData?.titulacao || "");
  const [idUnidade, setIdUnidade] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});
  const [unidadeSugerida, setUnidadeSugerida] = useState<{ id: string; nome: string } | null>(null);
  const [showSuggestion, setShowSuggestion] = useState(false);
  const [suggestions, setSuggestions] = useState<{ nome?: string; email?: string; titulacao?: string }>({});
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  
  // ADICIONADO: Estado para controlar a visibilidade do menu hambúrguer
  const [showHamburgerMenu, setShowHamburgerMenu] = useState(true);

  // ADICIONADO: Listeners do teclado para controlar a visibilidade do menu
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      setShowHamburgerMenu(false); // Esconde o menu quando o teclado aparecer
    });

    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setShowHamburgerMenu(true); // Mostra o menu quando o teclado sumir
    });

    return () => {
      keyboardDidShowListener?.remove();
      keyboardDidHideListener?.remove();
    };
  }, []);

  // ADICIONADO: Função para esconder o menu ao focar em input
  const handleInputFocus = () => {
    setShowHamburgerMenu(false);
  };

  // ADICIONADO: Função para mostrar o menu ao desfocar de input (opcional)
  const handleInputBlur = (fieldChanged?: string, value?: string) => {
    // Só mostra o menu novamente se o teclado não estiver visível
    // Você pode remover essa linha se quiser que o menu só apareça quando o teclado sumir
    // setShowHamburgerMenu(true);
    
    // Mantém a função de sugestões existente
    if (fieldChanged && value !== undefined) {
      fetchSuggestions(fieldChanged, value);
    }
  };

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
        const partial: Record<string, any> = {};
        if (nome) partial.nome = nome;
        if (email) partial.email = email;
        if (titulacao) partial.titulacao = titulacao;
        const data = await sugerirProfessorIA(partial);
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

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (suggestionEnabled) {
      AsyncStorage.getItem("@unidade_sugerida").then((data) => {
        if (data) {
          try {
            const unidade = JSON.parse(data);
            timeout = setTimeout(() => {
              setUnidadeSugerida({ id: unidade.id, nome: unidade.nome });
              setShowSuggestion(true);
            }, 600);
          } catch {  }
        }
      });
    } else {
      setShowSuggestion(false);
    }
    return () => clearTimeout(timeout);
  }, [suggestionEnabled]);

  const fetchSuggestions = async (fieldChanged: string, value: string) => {
    if (!suggestionEnabled) return;
    setLoadingSuggestions(true);
    try {
      const partial: Record<string, any> = {};
      if (fieldChanged === "nome" && value) partial.nome = value;
      else if (nome) partial.nome = nome;
      if (fieldChanged === "email" && value) partial.email = value;
      else if (email) partial.email = email;
      if (fieldChanged === "titulacao" && value) partial.titulacao = value;
      else if (titulacao) partial.titulacao = titulacao;
      const data = await sugerirProfessorIA(partial); 
      setSuggestions(data);
    } catch (e) {
      setSuggestions({});
    } finally {
      setLoadingSuggestions(false);
    }
  };

  const { isDarkMode } = useThemeMode();

  const handleAdvance = () => {
    try {
      setFieldErrors({});
      professorRegisterSchema.validateSync(
        { nome, email, titulacao, idUnidade },
        { abortEarly: false }
      );
      navigation.navigate("RegisterProfessorsStepTwo", {
        partialDataProfessor: {
          nome,
          email,
          titulacao,
          idUnidade,
          referencia: iaData?.referencia,
          statusAtividade: iaData?.statusAtividade,
          lattes: iaData?.lattes,
        },
      });
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
        >
          
    <SafeAreaView style={[
      FormStyles.safeArea,
      { backgroundColor: isDarkMode ? "#181818" : "#fff" }
    ]}>

      {/* MODIFICADO: Menu só aparece se showHamburgerMenu for true */}
      {showHamburgerMenu && (
        <View style={FormStyles.menuContainer}>
          <HamburgerMenu />
        </View>
      )}

      <Button
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
        
          <Card style={[
            FormStyles.card,
            { backgroundColor: isDarkMode ? "#232323" : "#fff" }
          ]} mode="elevated">
            <Card.Content>
              <Text style={[
                FormStyles.title,
                { color: isDarkMode ? "#fff" : "#000" }
              ]}>Cadastro de Professor</Text>
              <Text style={[
                FormStyles.description,
                { color: isDarkMode ? "#fff" : "#000" }
              ]}>
                Insira os dados do professor para registrá-lo no sistema
              </Text>
              <Text style={[
                FormStyles.label,
                { color: isDarkMode ? "#fff" : "#000" }
              ]}>Nome</Text>
              {fieldErrors.nome && (
                <Text style={styles.errorText}>{fieldErrors.nome}</Text>
              )}

              <View style={styles.inputRow}>
                <TextInput
                  placeholder={
                    !nome && suggestions.nome && suggestionEnabled
                      ? suggestions.nome
                      : "ex: José Maria da Silva"
                  }
                  style={[
                    FormStyles.input,
                    { color: isDarkMode ? "#fff" : "#000", borderColor: isDarkMode ? "#444" : "#ccc" },
                    styles.inputFlex,
                    fieldErrors.nome ? styles.inputError : null,
                    !nome && suggestions.nome && suggestionEnabled ? styles.suggestionPlaceholder : null,
                  ]}
                  placeholderTextColor={getPlaceholderColor({
                    isDarkMode,
                    suggestionEnabled,
                    hasSuggestion: !nome && !!suggestions.nome,
                  })}
                  value={nome}
                  onChangeText={(text) => {
                    setNome(text);
                    if (fieldErrors.nome)
                      setFieldErrors((prev) => {
                        const updated = { ...prev };
                        delete updated.nome;
                        return updated;
                      });
                  }}
                  onFocus={handleInputFocus} // ADICIONADO: Esconde menu ao focar
                  onBlur={() => handleInputBlur("nome", nome)} // MODIFICADO: Usa nova função
                />
                {!nome && suggestions.nome && suggestionEnabled && (
                  <FieldSuggestionButton onPress={() => setNome(suggestions.nome!)} />
                )}
              </View>
              <Text style={[FormStyles.label, { color: isDarkMode ? "#fff" : "#000" }]}>Email</Text>
              {fieldErrors.email && (
                <Text style={styles.errorText}>{fieldErrors.email}</Text>
              )}
              <View style={styles.inputRow}>
                <TextInput
                  placeholder={
                    !email && suggestions.email && suggestionEnabled
                      ? suggestions.email
                      : "ex: jose.maria@fatec.sp.gov.br"
                  }
                  style={[
                    FormStyles.input,
                    styles.inputFlex,
                    { color: isDarkMode ? "#fff" : "#000", borderColor: isDarkMode ? "#444" : "#ccc" },
                    fieldErrors.email ? styles.inputError : null,
                    !email && suggestions.email && suggestionEnabled ? styles.suggestionPlaceholder : null, // CORRIGIDO: usando email ao invés de nome
                  ]}
                  onChangeText={(text) => {
                    setEmail(text);
                    if (fieldErrors.email)
                      setFieldErrors((prev) => {
                        const updated = { ...prev };
                        delete updated.email;
                        return updated;
                      });
                  }}
                  value={email}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  autoComplete="email"
                  onFocus={handleInputFocus} // ADICIONADO: Esconde menu ao focar
                  onBlur={() => handleInputBlur("email", email)} // MODIFICADO: Usa nova função
                  placeholderTextColor={
                    !email && suggestions.email && suggestionEnabled ? "#D32719" : "#888"
                  }
                />
                {!email && suggestions.email && suggestionEnabled && (
                  <FieldSuggestionButton onPress={() => setEmail(suggestions.email!)} />
                )}
              </View>
              <Text style={[FormStyles.label, { color: isDarkMode ? "#fff" : "#000" }]}>Titulação</Text>
              {fieldErrors.titulacao && (
                <Text style={styles.errorText}>{fieldErrors.titulacao}</Text>
              )}
              <View style={styles.inputRow}>
                <View style={styles.pickerFlex}>
                  <ListPicker
                    items={Object.values(Titulacao)}
                    selected={titulacao}
                    onSelect={(titulacao: Titulacao) => {
                      setTitulacao(titulacao);
                      if (fieldErrors.titulacao)
                        setFieldErrors((prev) => {
                          const updated = { ...prev };
                          delete updated.titulacao;
                          return updated;
                        });
                    }}
                    suggestedLabel={
                      !titulacao && suggestions.titulacao && suggestionEnabled
                        ? suggestions.titulacao
                        : undefined
                    }
                    suggestionStyle={{ fontStyle: "italic", color: "#D32719" }}
                    backgroundColor={isDarkMode ? "#202020" : "#fff"}
                  />
                </View>
                {!titulacao && suggestions.titulacao && suggestionEnabled && (
                  <FieldSuggestionButton onPress={() => setTitulacao(suggestions.titulacao!)} />
                )}
              </View>
              <Text style={[FormStyles.label, { color: isDarkMode ? "#fff" : "#000" }]}>Código da Unidade</Text>
              {fieldErrors.idUnidade && (
                <Text style={styles.errorText}>{fieldErrors.idUnidade}</Text>
              )}
              <View style={styles.inputRow}>
                <TextInput
                  placeholder={
                    showSuggestion && unidadeSugerida?.id
                      ? `${unidadeSugerida.id}`
                      : "ex: 301"
                  }
                  style={[
                    FormStyles.input,
                    styles.inputFlex,
                    { width: "100%", color: isDarkMode ? "#fff" : "#000", borderColor: isDarkMode ? "#444" : "#ccc" },
                    !idUnidade && showSuggestion && unidadeSugerida?.id
                      ? styles.suggestionPlaceholder
                      : null,
                    fieldErrors.idUnidade ? styles.inputError : null,
                  ]}
                  placeholderTextColor={
                    showSuggestion && unidadeSugerida?.id
                      ? "#D32719"
                      : "#888"
                  }
                  onChangeText={(text) => {
                    setIdUnidade(text);
                    if (fieldErrors.idUnidade)
                      setFieldErrors((prev) => {
                        const updated = { ...prev };
                        delete updated.idUnidade;
                        return updated;
                      });
                  }}
                  value={idUnidade}
                  onFocus={handleInputFocus} // ADICIONADO: Esconde menu ao focar
                  onBlur={() => handleInputBlur()} // ADICIONADO: Controla visibilidade do menu
                />
                {showSuggestion && unidadeSugerida?.id && !idUnidade && (
                  <UnitSuggestionButton
                    onPress={() => setIdUnidade(unidadeSugerida.id)}
                    lottieSource={locationAnimation}
                  />
                )}
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
          <SuggestionSwitch
            value={suggestionEnabled}
            onValueChange={setSuggestionEnabled}
            label={`Sugestões de \n     Cadastro`}
            labelColor={isDarkMode ? "#ccc" : "#333"}
          />
        </ScrollView>
      </View>
      
    </SafeAreaView>
    
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
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  inputFlex: {
    flex: 1,
  },
  suggestionPlaceholder: {
    fontStyle: "italic",
    color: "#D32719",
  },
  pickerFlex: {
    flex: 1,
  },
});