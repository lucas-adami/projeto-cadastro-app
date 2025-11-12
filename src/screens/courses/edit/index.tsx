import React, { useEffect, useState } from "react";
import { useRoute, useNavigation } from "@react-navigation/native";
import {
  SafeAreaView,
  Text,
  View,
  ScrollView,
  TextInput,
  StyleSheet,
} from "react-native";
import HamburgerMenu from "../../../components/HamburgerMenu";
import AddMateriaModal from "../../../components/AddMateriaModal";
import { FormStyles } from "../../../style/FormStyles";
import { Button, Card } from "react-native-paper";
import { RouteParamsProps } from "../../../routes/rootStackParamList ";
import ListPicker from "../../../components/atoms/ListPicker";
import { useCourse } from "../../../context/CourseContext";
import { Course } from "../../../types/courses";
import { Materia } from "../../../types/materia";
import { updateCourse } from "../../../services/course/cursoService";
import { ModeloCurso } from "../../../enums/courses/courseEnum";
import { useProfessor } from "../../../context/ProfessorContext";
import { useThemeMode } from "../../../context/ThemeContext"; // Importa o contexto do tema
import { useToast } from "../../../utils/useToast";
import Toast from "../../../components/atoms/Toast";

const EditCourseScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<RouteParamsProps<"EditCourses">>();
  const { id } = route.params;

  const { getCourseById, refreshCoursesData } = useCourse();
  const course = getCourseById(id);

  const { professors, getProfessorById } = useProfessor();

  const [formData, setFormData] = useState<Course | null>(null);
  const [isMateriaModalVisible, setMateriaModalVisible] = useState(false);

  // Usa o contexto do tema
  const { isDarkMode } = useThemeMode();
  const { toast, showError, showSuccess, hideToast } = useToast();

  useEffect(() => {
    if (course) {
      const materiasExtraidas =
        course.materias?.map((item: any) => item.materia) || [];
      setFormData({
        ...course,
        materias: materiasExtraidas,
      });
    }
  }, [course]);

  const handleAddMateria = (materia: Materia) => {
    if (formData) {
      setFormData({
        ...formData,
        materias: [...(formData.materias || []), materia],
      });
    }
  };

  const handleRemoveMateria = (index: number) => {
    if (formData) {
      const updatedMaterias =
        formData.materias?.filter((_, i) => i !== index) || [];
      setFormData({
        ...formData,
        materias: updatedMaterias,
      });
    }
  };

  const handleUpdate = async () => {
    try {
      if (formData) {
        await updateCourse(id, formData);
        refreshCoursesData();
        showSuccess("Curso atualizado com sucesso!");
        setTimeout(() => {
          navigation.navigate("ListCourses" as never);
        }, 1500);
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.mensagem ||
        error.message ||
        "Erro ao atualizar curso";
      showError(errorMessage);
    }
  };

  const fetchCourseCoordinator = () => {
    if (formData?.coordenadorId)
      return getProfessorById(formData.coordenadorId);
  };

  if (!formData) {
    return (
      <SafeAreaView
        style={[
          FormStyles.safeArea,
          { backgroundColor: isDarkMode ? "#181818" : "#fff" },
        ]}
      >
        <Text
          style={[FormStyles.title, { color: isDarkMode ? "#fff" : "#000" }]}
        >
          Curso não encontrado
        </Text>
      </SafeAreaView>
    );
  }

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
        <Text
          style={[FormStyles.title, { color: isDarkMode ? "#fff" : "#000" }]}
        >
          Atualizar {course?.nome}
        </Text>
        <Text
          style={[
            FormStyles.description,
            { color: isDarkMode ? "#fff" : "#000" },
          ]}
        >
          Modifique os dados conforme necessário 🙂
        </Text>
        <ScrollView
          contentContainerStyle={FormStyles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <Card
            style={[
              FormStyles.card,
              { backgroundColor: isDarkMode ? "#232323" : "#fff" },
            ]}
          >
            <Card.Content>
              <Text
                style={[
                  FormStyles.label,
                  { color: isDarkMode ? "#fff" : "#000" },
                ]}
              >
                Nome
              </Text>
              <TextInput
                style={[
                  FormStyles.input,
                  {
                    color: isDarkMode ? "#fff" : "#000",
                    borderColor: isDarkMode ? "#444" : "#ccc",
                  },
                ]}
                placeholder="Digite o nome"
                placeholderTextColor={isDarkMode ? "#aaa" : "#888"}
                value={formData.nome}
                onChangeText={(e) => setFormData({ ...formData, nome: e })}
              />

              <Text
                style={[
                  FormStyles.label,
                  { color: isDarkMode ? "#fff" : "#000" },
                ]}
              >
                Sigla{" "}
              </Text>
              <TextInput
                style={[
                  FormStyles.input,
                  {
                    color: isDarkMode ? "#fff" : "#000",
                    borderColor: isDarkMode ? "#444" : "#ccc",
                  },
                ]}
                placeholder="Ex: DSM"
                placeholderTextColor={isDarkMode ? "#aaa" : "#888"}
                value={formData.sigla}
                onChangeText={(e) => setFormData({ ...formData, sigla: e })}
              />

              <Text
                style={[
                  FormStyles.label,
                  { color: isDarkMode ? "#fff" : "#000" },
                ]}
              >
                Código
              </Text>
              <TextInput
                style={[
                  FormStyles.input,
                  {
                    color: isDarkMode ? "#fff" : "#000",
                    borderColor: isDarkMode ? "#444" : "#ccc",
                  },
                ]}
                placeholder="ex: 412"
                placeholderTextColor={isDarkMode ? "#aaa" : "#888"}
                value={formData.codigo}
                onChangeText={(e) => setFormData({ ...formData, codigo: e })}
              />

              <Text
                style={[
                  FormStyles.label,
                  { color: isDarkMode ? "#fff" : "#000" },
                ]}
              >
                Modelo
              </Text>
              <ListPicker
                items={Object.values(ModeloCurso)}
                selected={formData.modelo}
                onSelect={(modelo: ModeloCurso) =>
                  setFormData({ ...formData, modelo })
                }
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
              <ListPicker
                items={professors}
                selected={fetchCourseCoordinator()}
                onSelect={(coordenadorId: string) =>
                  setFormData({ ...formData, coordenadorId })
                }
                getLabel={(professor) => professor.nome}
                getValue={(professor) => professor.id}
                backgroundColor={isDarkMode ? "#202020" : "#fff"}
              />

              <Text
                style={[
                  FormStyles.label,
                  { color: isDarkMode ? "#fff" : "#000" },
                ]}
              >
                Matérias
              </Text>

              {formData.materias && formData.materias.length > 0 ? (
                formData.materias.map((materia, index) => (
                  <View
                    key={index}
                    style={[
                      styles.materiaItem,
                      {
                        borderColor: isDarkMode ? "#444" : "#ddd",
                        backgroundColor: isDarkMode ? "#333" : "#f9f9f9",
                      },
                    ]}
                  >
                    <View style={styles.materiaInfo}>
                      <Text
                        style={[
                          styles.materiaText,
                          { color: isDarkMode ? "#fff" : "#000" },
                        ]}
                      >
                        {materia.nome} - {materia.cargaHoraria}h
                      </Text>
                      {materia.professorId && (
                        <Text
                          style={[
                            styles.materiaProf,
                            { color: isDarkMode ? "#ccc" : "#666" },
                          ]}
                        >
                          Professor:{" "}
                          {getProfessorById(materia.professorId)?.nome ||
                            "Não encontrado"}
                        </Text>
                      )}
                    </View>
                    <Button
                      mode="text"
                      onPress={() => handleRemoveMateria(index)}
                      style={styles.removeButton}
                      labelStyle={{ color: "red", fontSize: 12 }}
                    >
                      Remover
                    </Button>
                  </View>
                ))
              ) : (
                <Text
                  style={[
                    styles.noMaterias,
                    { color: isDarkMode ? "#ccc" : "#666" },
                  ]}
                >
                  Nenhuma matéria adicionada
                </Text>
              )}

              <Button
                mode="outlined"
                onPress={() => setMateriaModalVisible(true)}
                style={styles.addMateriaButton}
                labelStyle={{ color: isDarkMode ? "#fff" : "#000" }}
              >
                Adicionar Matéria
              </Button>

              <AddMateriaModal
                visible={isMateriaModalVisible}
                onClose={() => setMateriaModalVisible(false)}
                onAddMateria={handleAddMateria}
                professors={professors}
                isDarkMode={isDarkMode}
              />
            </Card.Content>
            <Card.Actions>
              <Button
                mode="outlined"
                onPress={handleUpdate}
                style={FormStyles.button}
                labelStyle={{ color: "white" }}
              >
                Atualizar
              </Button>
            </Card.Actions>
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
};

const styles = StyleSheet.create({
  materiaItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  materiaInfo: {
    flex: 1,
  },
  materiaText: {
    fontSize: 14,
    fontWeight: "500",
  },
  materiaProf: {
    fontSize: 12,
    marginTop: 2,
  },
  removeButton: {
    minWidth: 0,
    paddingHorizontal: 8,
  },
  noMaterias: {
    fontSize: 14,
    fontStyle: "italic",
    textAlign: "center",
    paddingVertical: 16,
  },
  addMateriaButton: {
    marginVertical: 10,
  },
});

export default EditCourseScreen;
