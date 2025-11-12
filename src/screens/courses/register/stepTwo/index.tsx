"use client";

import React, { useState } from "react";

import {
  SafeAreaView,
  View,
  ScrollView,
  Text,
  StyleSheet,
  Modal,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
} from "react-native";
import {
  Card,
  Button,
  ProgressBar,
  MD3Colors,
  TextInput,
} from "react-native-paper";

import ListPicker from "../../../../components/atoms/ListPicker";
import HamburgerMenu from "../../../../components/HamburgerMenu";
import AddMateriaModal from "../../../../components/AddMateriaModal";
import Toast from "../../../../components/atoms/Toast";

import { useRoute } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";
import { FormStyles } from "../../../../style/FormStyles";
import { postCourse } from "../../../../services/course/cursoService";
import { ModeloCurso } from "../../../../enums/courses/courseEnum";
import { useCourse } from "../../../../context/CourseContext";
import { useProfessor } from "../../../../context/ProfessorContext";
import { coursesRegisterStep2Schema } from "../../../../validations/coursesRegisterValidations";
import { RouteParamsProps } from "../../../../routes/rootStackParamList ";
import { Materia } from "../../../../types/materia";
import { useThemeMode } from "../../../../context/ThemeContext";
import { TouchableOpacity } from "react-native";
import { useToast } from "../../../../utils/useToast";


export default function StepTwo() {
  const navigation = useNavigation();
  const { refreshCoursesData } = useCourse();
  const { professors } = useProfessor();
  const route = useRoute<RouteParamsProps<"RegisterCourseStepTwo">>();
  const { partialDataCurso } = route.params;

  const [modelo, setModelo] = useState<ModeloCurso>();
  const [coordenadorId, setCoordenadorId] = useState();
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});

  const [isMateriaModalVisible, setMateriaModalVisible] = useState(false);
  const [materias, setMaterias] = useState<Materia[]>([]);

  const { toast, showError, hideToast } = useToast();

  const handleAddMateria = (materia: Materia) => {
    setMaterias([...materias, materia]);
  };
  const { isDarkMode } = useThemeMode();

  const handleSubmit = async () => {
    try {
      setFieldErrors({});
      coursesRegisterStep2Schema.validateSync(
        { modelo, coordenadorId },
        { abortEarly: false }
      );
      const curso = {
        modelo,
        coordenadorId,
        materias,
        ...partialDataCurso,
      };

      await postCourse(curso);
      refreshCoursesData();
      navigation.navigate("RegisterCursosFinished" as never);
    } catch (error: any) {
      if (error.name === "ValidationError") {
        const errors: { [key: string]: string } = {};
        error.inner.forEach((err: any) => {
          if (err.path) errors[err.path] = err.message;
        });
        setFieldErrors(errors);
      }
      const errorMessage =
        error.response?.data?.mensagem ||
        "Erro ao cadastrar curso. Tente novamente.";
      showError(errorMessage);
    }
  };

  return (
    <SafeAreaView
      style={[
        FormStyles.safeArea,
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
          contentContainerStyle={[FormStyles.scrollContent, styles.scrollPadding]} // ADICIONADO: Padding customizado
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false} // ADICIONADO: Remove indicador
        >
          {/* MODIFICADO: Removido cardWrapper e usado margin direta no card */}
          <Card
            style={[
              FormStyles.card,
              { backgroundColor: isDarkMode ? "#232323" : "#fff" },
              styles.cardMargin // ADICIONADO: Margem customizada
            ]}
            mode="elevated"
          >
            <Card.Content>
              <Text
                style={[
                  FormStyles.title,
                  { color: isDarkMode ? "#fff" : "#000" },
                ]}
              >
                2º Etapa
              </Text>

              <Text
                style={[
                  FormStyles.description,
                  { color: isDarkMode ? "#fff" : "#000" },
                ]}
              >
                Insira os dados do curso para registrá-lo no sistema
              </Text>

              <Text
                style={[
                  FormStyles.label,
                  { color: isDarkMode ? "#fff" : "#000" },
                ]}
              >
                Modalidade
              </Text>
              {fieldErrors.modelo && (
                <Text style={styles.errorText}>{fieldErrors.modelo}</Text>
              )}
              <ListPicker
                items={Object.values(ModeloCurso)}
                onSelect={(modelo) => {
                  setModelo(modelo);
                  if (fieldErrors.modelo)
                    setFieldErrors((prev) => {
                      const updated = { ...prev };
                      delete updated.modelo;
                      return updated;
                    });
                }}
                backgroundColor={isDarkMode ? "#202020" : "#fff"}
              />

              <Text
                style={[
                  FormStyles.label,
                  { color: isDarkMode ? "#fff" : "#000" },
                ]}
              >
                Coordenador
              </Text>
              {fieldErrors.coordenadorId && (
                <Text style={styles.errorText}>
                  {fieldErrors.coordenadorId}
                </Text>
              )}
              <ListPicker
                items={professors}
                onSelect={(id) => {
                  setCoordenadorId(id);

                  if (fieldErrors.coordenadorId)
                    setFieldErrors((prev) => {
                      const updated = { ...prev };
                      delete updated.coordenadorId;
                      return updated;
                    });
                }}
                getLabel={(prof) => prof.nome}
                getValue={(prof) => prof.id}
                backgroundColor={isDarkMode ? "#202020" : "#fff"}
              />
              {materias.length > 0 && (
                <>
                  <Text style={[
                    FormStyles.label,
                    { color: isDarkMode ? "#fff" : "#000" }
                  ]}>
                    Matérias Adicionadas
                  </Text>
                  {materias.map((materia, index) => (
                    <Text 
                      key={index} 
                      style={[
                        styles.materiaItem,
                        { color: isDarkMode ? "#fff" : "#000" }
                      ]}
                    >
                      {materia.nome} - {materia.cargaHoraria}h
                    </Text>
                  ))}
                </>
              )}

              <Card
                style={[
                  styles.linkCard,
                  { backgroundColor: isDarkMode ? "#444" : "#a1a1a1", marginTop: 16 }
                ]}
                mode="elevated"
              >
                <TouchableOpacity onPress={() => setMateriaModalVisible(true)}>
                  <Text style={styles.linkText}>Adicionar Matéria</Text>
                </TouchableOpacity>
              </Card>

              <AddMateriaModal
                visible={isMateriaModalVisible}
                onClose={() => setMateriaModalVisible(false)}
                onAddMateria={handleAddMateria}
                professors={professors}
                isDarkMode={isDarkMode}
                buttonColor={FormStyles.button.backgroundColor}
              />
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
        </ScrollView>
      </View>

      <Toast
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
        onDismiss={hideToast}
      />
    </SafeAreaView>
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
  // REMOVIDO: centerContainer que estava centralizando
  // REMOVIDO: cardWrapper que era desnecessário
  
  // ADICIONADO: Novos estilos para melhor controle do layout
  scrollPadding: {
    paddingVertical: 20, // Padding superior e inferior
    paddingBottom: Platform.OS === 'ios' ? 100 : 80, // Padding extra
    flexGrow: 1, // Permite que o scroll funcione corretamente
  },
  cardMargin: {
    marginHorizontal: 16, // Margem lateral para o card
    marginVertical: 10, // Margem vertical
  },
  materiaItem: {
    fontSize: 14,
    marginVertical: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalCard: {
    width: "90%",
    maxHeight: "80%",
    borderRadius: 8,
    overflow: "hidden",
  },
  closeButton: {
    alignSelf: "flex-end",
    margin: 10,
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
