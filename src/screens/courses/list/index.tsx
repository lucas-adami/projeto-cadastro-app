import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  TextInput,
  Text,
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import HamburgerMenu from "../../../components/HamburgerMenu";
import { useCourse } from "../../../context/CourseContext";
import {
  deleteCourse,
  getCourses,
} from "../../../services/course/cursoService";
import { showConfirmDialog } from "../../../components/atoms/ConfirmAlert";
import { NavigationProp } from "../../../routes/rootStackParamList ";
import { useNavigation } from "@react-navigation/native";
import { TableStyle } from "../../../style/TableStyle";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useProfessor } from "../../../context/ProfessorContext";
import { InteractBtn } from "../../../components/atoms/InteractBtn";
import { shareDataToPdfFile } from "../../../services/file/fileService";
import ColumnSelectionModal from "../../../components/ColumnSelectionModal";
import { courseLabels } from "../../../utils/translateObject";
import ProximityNotification from "../../../components/ProximityNotification";
import { buscarOuCacheUnidadeProxima } from "../../../services/unit-location/unitService";
import { useThemeMode } from "../../../context/ThemeContext"; // Importa o contexto do tema
import { useToast } from "../../../utils/useToast";
import Toast from "../../../components/atoms/Toast";

const ListCoursesScreen = () => {
  const navigation = useNavigation<NavigationProp>();

  const [nome, setNome] = useState("");
  const [modalidades, setModalidades] = useState<{ [key: string]: boolean }>(
    {}
  );
  const [showModalidades, setShowModalidades] = useState(false);
  const [expandedCard, setExpandedCard] = useState<number | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [unidadeNome, setUnidadeNome] = useState<string | null>(null);
  const [courses, setCourses] = useState<any[]>([]);
  const [allCourses, setAllCourses] = useState<any[]>([]);

  const { refreshCoursesData } = useCourse();

  const { isDarkMode } = useThemeMode();
  const { toast, showError, showSuccess, hideToast } = useToast();

  const columnOptions = Object.keys(courses[0] || {}).filter(
    (key) => key !== "id" && key !== "coordenadorId"
  );

  useEffect(() => {
    refreshCoursesData();
  }, []);

  useEffect(() => {
    const fetchUnidade = async () => {
      try {
        const unidade = await buscarOuCacheUnidadeProxima();
        setUnidadeNome(unidade?.nome ?? null);
      } catch {
        setUnidadeNome(null);
      }
    };
    fetchUnidade();
    const interval = setInterval(fetchUnidade, 180000);
    return () => clearInterval(interval);
  }, []);

  const fetchCourses = async () => {
    setIsLoading(true);
    try {
      const data = await getCourses();
      setAllCourses(data);

      // Extrair modalidades únicas dos cursos
      const uniqueModalidades = [
        ...new Set(data.map((course: any) => course.modelo).filter(Boolean)),
      ] as string[];

      // Inicializar todas as modalidades como selecionadas
      const initialModalidades: { [key: string]: boolean } = {};
      uniqueModalidades.forEach((modalidade: string) => {
        initialModalidades[modalidade] = true;
      });
      setModalidades(initialModalidades);

      setCourses(data);
    } catch (e) {
      setAllCourses([]);
      setCourses([]);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  // Aplicar filtros quando nome ou modalidades mudarem
  useEffect(() => {
    if (allCourses.length === 0) return;

    let filteredCourses = allCourses;

    // Filtro por nome
    if (nome.trim()) {
      filteredCourses = filteredCourses.filter(
        (course: any) =>
          course.nome.toLowerCase().includes(nome.toLowerCase()) ||
          course.codigo.toLowerCase().includes(nome.toLowerCase()) ||
          course.sigla.toLowerCase().includes(nome.toLowerCase())
      );
    }

    // Filtro por modalidades selecionadas
    const selectedModalidades = Object.entries(modalidades)
      .filter(([_, isSelected]) => isSelected)
      .map(([modalidade, _]) => modalidade);

    // Se existem modalidades e pelo menos uma está selecionada, aplicar o filtro
    if (Object.keys(modalidades).length > 0 && selectedModalidades.length > 0) {
      filteredCourses = filteredCourses.filter((course: any) =>
        selectedModalidades.includes(course.modelo)
      );
    } else if (
      Object.keys(modalidades).length > 0 &&
      selectedModalidades.length === 0
    ) {
      // Se nenhuma modalidade está selecionada, mostrar array vazio
      filteredCourses = [];
    }

    setCourses(filteredCourses);
  }, [nome, modalidades, allCourses]);

  const handleExportClick = () => {
    setIsModalVisible(true);
  };

  const handleShareData = async () => {
    try {
      setIsLoading(true);
      await shareDataToPdfFile(courses, selectedColumns, "course");
      showSuccess("Arquivo compartilhado com sucesso!");
    } catch (error: any) {
      const errorMessage = error?.message || "Erro ao compartilhar arquivo";
      showError(errorMessage);
    } finally {
      setIsModalVisible(false);
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteCourse(id);
      showSuccess("Curso excluído com sucesso!");
      await fetchCourses();
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.mensagem || "Erro ao excluir curso";
      showError(errorMessage);
    }
  };

  const renderCheckbox = (
    label: string,
    checked: boolean,
    onChange: (val: boolean) => void,
    key?: string
  ) => (
    <TouchableOpacity
      key={key}
      style={TableStyle.checkboxContainer}
      onPress={() => onChange(!checked)}
      activeOpacity={0.7}
    >
      <Text style={[TableStyle.checkbox, checked && TableStyle.checked]}>
        {checked ? "☑" : "☐"}
      </Text>
      <Text>{label}</Text>
    </TouchableOpacity>
  );

  const toggleCardExpansion = (id: number | undefined) => {
    if (id !== undefined) {
      setExpandedCard((prev) => (prev === id ? null : id));
    }
  };

  const toggleAllModalidades = () => {
    const allSelected = Object.values(modalidades).every((value) => value);
    const newModalidades: { [key: string]: boolean } = {};
    Object.keys(modalidades).forEach((key) => {
      newModalidades[key] = !allSelected;
    });
    setModalidades(newModalidades);
  };

  return (
    <SafeAreaView
      style={[
        TableStyle.container,
        { backgroundColor: isDarkMode ? "#181818" : "#fff" },
      ]}
    >
      <View style={TableStyle.menuContainer}>
        <HamburgerMenu />
      </View>

      {unidadeNome && <ProximityNotification unidadeNome={unidadeNome} />}

      <ScrollView contentContainerStyle={TableStyle.scrollContent}>
        <Text
          style={[TableStyle.title, { color: isDarkMode ? "#fff" : "#000" }]}
        >
          Cursos
        </Text>

        <TextInput
          placeholder="Nome, Código ou Sigla do Curso"
          placeholderTextColor={isDarkMode ? "#aaa" : "#888"}
          value={nome}
          onChangeText={setNome}
          style={[
            TableStyle.input,
            {
              color: isDarkMode ? "#fff" : "#000",
              borderColor: isDarkMode ? "#444" : "#ccc",
            },
          ]}
        />

        <View style={TableStyle.filterRow}>
          <View style={TableStyle.filterGroup}>
            <TouchableOpacity
              onPress={() => setShowModalidades((prev) => !prev)}
            >
              <Text
                style={[
                  TableStyle.filterText,
                  { color: isDarkMode ? "#fff" : "#000" },
                ]}
              >
                Modalidades ▼
              </Text>
            </TouchableOpacity>
            {showModalidades && (
              <View style={TableStyle.submenuOverlay}>
                <View style={TableStyle.submenu}>
                  {Object.entries(modalidades).map(([mod, checked]) =>
                    renderCheckbox(
                      mod,
                      checked,
                      (val) =>
                        setModalidades((prev) => ({ ...prev, [mod]: val })),
                      mod
                    )
                  )}
                  <TouchableOpacity
                    onPress={toggleAllModalidades}
                    style={{
                      padding: 8,
                      borderTopWidth: 1,
                      borderTopColor: isDarkMode ? "#444" : "#eee",
                      marginTop: 5,
                    }}
                  >
                    <Text
                      style={{
                        color: isDarkMode ? "#fff" : "#000",
                        textAlign: "center",
                        fontWeight: "bold",
                      }}
                    >
                      {Object.values(modalidades).every(Boolean)
                        ? "Desmarcar Todas"
                        : "Marcar Todas"}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        </View>

        <View style={TableStyle.cardList}>
          {courses.length === 0 ? (
            <Text
              style={[
                TableStyle.emptyText,
                { color: isDarkMode ? "#fff" : "#000" },
              ]}
            >
              Nenhum Curso Encontrado
            </Text>
          ) : (
            courses.map((curso, idx) => (
              <View key={idx} style={TableStyle.cardContainer}>
                {curso.id && (
                  <TouchableOpacity
                    onPress={() => toggleCardExpansion(curso.id)}
                    style={[
                      TableStyle.card,
                      { backgroundColor: isDarkMode ? "#232323" : "#fff" },
                    ]}
                  >
                    <Text
                      style={[
                        TableStyle.cardTitle,
                        { color: isDarkMode ? "#fff" : "#000" },
                      ]}
                    >
                      {curso.nome}
                    </Text>
                    <Text
                      style={[
                        TableStyle.cardSubtitle,
                        { color: isDarkMode ? "#ccc" : "#333" },
                      ]}
                    >
                      {curso.sigla}
                    </Text>
                    <Text
                      style={[
                        TableStyle.cardSubtitle,
                        { color: isDarkMode ? "#ccc" : "#333" },
                      ]}
                    >
                      {curso.codigo}
                    </Text>
                  </TouchableOpacity>
                )}
                {expandedCard === curso.id && (
                  <View style={TableStyle.cardActionsContainer}>
                    <TouchableOpacity
                      style={[TableStyle.actionButton, TableStyle.editButton]}
                      onPress={() =>
                        curso.id &&
                        navigation.navigate("EditCourses", { id: curso.id })
                      }
                    >
                      <Icon name="edit" size={24} color="#fff" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[TableStyle.actionButton, TableStyle.deleteButton]}
                      onPress={() =>
                        showConfirmDialog({
                          message: `Deseja realmente excluir ${curso.nome}?`,
                          onConfirm: () => {
                            if (curso.id) handleDelete(curso.id);
                          },
                        })
                      }
                    >
                      <Icon name="delete" size={24} color="#fff" />
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            ))
          )}
        </View>
      </ScrollView>

      {courses.length > 0 && (
        <View style={styles.fabContainer}>
          <InteractBtn name="share" onPressFn={handleExportClick} />
        </View>
      )}

      <ColumnSelectionModal
        isVisible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        columnOptions={columnOptions}
        selectedColumns={selectedColumns}
        setSelectedColumns={setSelectedColumns}
        onConfirm={handleShareData}
        labels={courseLabels}
        loading={isLoading}
      />

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
  fabContainer: {
    position: "absolute",
    bottom: 38,
    right: 35,
    zIndex: 20,
  },
});

export default ListCoursesScreen;
