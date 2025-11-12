import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Platform,
} from "react-native";
import {
  Card,
  Button,
  Modal,
  Portal,
  TextInput,
  FAB,
  IconButton,
} from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import HamburgerMenu from "../../components/HamburgerMenu";
import { useThemeMode } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../utils/useToast";
import Toast from "../../components/atoms/Toast";
import {
  getAllUsers,
  updateUserStatus,
  updateUserById,
} from "../../services/users/userService";
import {
  createMonitor,
  getAllMonitors,
  updateMonitor,
  deleteMonitor,
} from "../../services/monitors/monitorService";
import { UsuarioResponse } from "../../types/user";
import {
  MonitorResponse,
  TipoMonitor,
  DiaSemana,
  CreateHorarioTrabalhoDto,
} from "../../types/monitor";
import { useProfessor } from "../../context/ProfessorContext";
import EditUserModal, { UpdateUserData } from "./components/EditUserModal";
import MonitorModals from "./components/MonitorModals";
import { FormStyles } from "../../style/FormStyles";

const SuperAdminScreen = () => {
  const navigation = useNavigation();
  const { isDarkMode, theme } = useThemeMode();
  const { user } = useAuth();
  const { toast, showSuccess, showError, hideToast } = useToast();
  const { professors } = useProfessor();

  // Estados para usuários
  const [users, setUsers] = useState<UsuarioResponse[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [showEditUserModal, setShowEditUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UsuarioResponse | null>(
    null
  );

  // Estados para monitores
  const [monitors, setMonitors] = useState<MonitorResponse[]>([]);
  const [loadingMonitors, setLoadingMonitors] = useState(false);

  // Estados para modais
  const [showCreateMonitorModal, setShowCreateMonitorModal] = useState(false);
  const [showEditMonitorModal, setShowEditMonitorModal] = useState(false);
  const [selectedMonitor, setSelectedMonitor] =
    useState<MonitorResponse | null>(null);

  // Estados para formulário de monitor
  const [monitorForm, setMonitorForm] = useState({
    nome: "",
    email: "",
    tipo: TipoMonitor.MONITOR,
    nomePesquisaMonitoria: "",
    professorId: "",
    cargaHorariaSemanal: "",
  });

  // Estado para horários da semana
  const [weeklySchedule, setWeeklySchedule] = useState<{
    [key in DiaSemana]?: number;
  }>({});

  // Estado da aba ativa
  const [activeTab, setActiveTab] = useState<"users" | "monitors">("users");

  const clearMonitorForm = () => {
    setMonitorForm({
      nome: "",
      email: "",
      tipo: TipoMonitor.MONITOR,
      nomePesquisaMonitoria: "",
      professorId: "",
      cargaHorariaSemanal: "",
    });
    setWeeklySchedule({});
  };

  // Função para calcular total de horas da semana
  const getTotalHoras = () => {
    return Object.values(weeklySchedule).reduce(
      (sum, horas) => sum + (horas || 0),
      0
    );
  };

  // Função para converter horários para DTO
  const convertScheduleToHorarios = (): CreateHorarioTrabalhoDto[] => {
    return Object.entries(weeklySchedule)
      .filter(([_, horas]) => horas && horas > 0)
      .map(([dia, horas]) => ({
        diaSemana: dia as DiaSemana,
        horasTrabalho: horas || 0,
      }));
  };

  useEffect(() => {
    loadUsers();
    loadMonitors();
  }, []);

  const loadUsers = async () => {
    setLoadingUsers(true);
    try {
      const usersData = await getAllUsers();
      setUsers(usersData);
    } catch (error) {
      showError("Erro ao carregar usuários");
    } finally {
      setLoadingUsers(false);
    }
  };

  const loadMonitors = async () => {
    setLoadingMonitors(true);
    try {
      const monitorsData = await getAllMonitors();
      if (Array.isArray(monitorsData)) {
        setMonitors(monitorsData);
      } else {
        console.warn(
          "API retornou dados inválidos para monitores:",
          monitorsData
        );
        setMonitors([]);
      }
    } catch (error) {
      console.error("Erro ao carregar monitores:", error);
      showError("Erro ao carregar monitores");
      setMonitors([]);
    } finally {
      setLoadingMonitors(false);
    }
  };

  const handleToggleUserStatus = async (
    userId: string,
    currentStatus: boolean
  ) => {
    try {
      await updateUserStatus(userId, !currentStatus);
      await loadUsers();
      showSuccess(
        `Usuário ${!currentStatus ? "ativado" : "desativado"} com sucesso`
      );
    } catch (error) {
      showError("Erro ao atualizar status do usuário");
    }
  };

  const handleUpdateUser = async (userId: string, data: UpdateUserData) => {
    try {
      await updateUserById(userId, data);
      await loadUsers();
      showSuccess("Usuário atualizado com sucesso");
    } catch (error: any) {
      console.error("Erro ao atualizar usuário:", error);
      let errorMessage = "Erro ao atualizar usuário";

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.message) {
        errorMessage = error.message;
      }

      showError(errorMessage);
      throw error; // Re-throw para o modal não fechar
    }
  };

  const openEditUser = (user: UsuarioResponse) => {
    setSelectedUser(user);
    setShowEditUserModal(true);
  };

  const handleCreateMonitor = async () => {
    try {
      if (
        !monitorForm.nome ||
        !monitorForm.tipo ||
        !monitorForm.cargaHorariaSemanal
      ) {
        showError("Preencha todos os campos obrigatórios");
        return;
      }

      // Validação básica
      if (
        !monitorForm.nome ||
        !monitorForm.email ||
        !monitorForm.nomePesquisaMonitoria ||
        !monitorForm.professorId ||
        !monitorForm.cargaHorariaSemanal
      ) {
        showError("Todos os campos são obrigatórios");
        return;
      }

      // Validar se a carga horária bate com os horários distribuídos
      const totalDistribuido = getTotalHoras();
      const cargaTotal = parseInt(monitorForm.cargaHorariaSemanal);

      if (totalDistribuido !== cargaTotal) {
        showError(
          `A soma dos horários distribuídos (${totalDistribuido}h) deve ser igual à carga horária total (${cargaTotal}h)`
        );
        return;
      }

      await createMonitor({
        nome: monitorForm.nome,
        email: monitorForm.email,
        tipo: monitorForm.tipo,
        nomePesquisaMonitoria: monitorForm.nomePesquisaMonitoria,
        professorId: monitorForm.professorId,
        cargaHorariaSemanal: parseInt(monitorForm.cargaHorariaSemanal),
        horarios: convertScheduleToHorarios(),
      });

      setShowCreateMonitorModal(false);
      clearMonitorForm();
      await loadMonitors();
      showSuccess("Monitor criado com sucesso");
    } catch (error: any) {
      console.error("Erro ao criar monitor:", error);
      let errorMessage = "Erro ao criar monitor";

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.message) {
        errorMessage = error.message;
      }

      showError(errorMessage);
      // Não fechar o modal em caso de erro para o usuário corrigir
    }
  };

  const handleEditMonitor = async () => {
    if (!selectedMonitor) return;

    try {
      // Validação básica
      if (
        !monitorForm.nome ||
        !monitorForm.email ||
        !monitorForm.nomePesquisaMonitoria ||
        !monitorForm.professorId ||
        !monitorForm.cargaHorariaSemanal
      ) {
        showError("Todos os campos são obrigatórios");
        return;
      }

      // Validar se a carga horária bate com os horários distribuídos
      const totalDistribuido = getTotalHoras();
      const cargaTotal = parseInt(monitorForm.cargaHorariaSemanal);

      if (totalDistribuido !== cargaTotal) {
        showError(
          `A soma dos horários distribuídos (${totalDistribuido}h) deve ser igual à carga horária total (${cargaTotal}h)`
        );
        return;
      }

      await updateMonitor(selectedMonitor.id, {
        nome: monitorForm.nome,
        email: monitorForm.email,
        tipo: monitorForm.tipo,
        nomePesquisaMonitoria: monitorForm.nomePesquisaMonitoria,
        professorId: monitorForm.professorId,
        cargaHorariaSemanal: parseInt(monitorForm.cargaHorariaSemanal),
        horarios: convertScheduleToHorarios(),
      });

      setShowEditMonitorModal(false);
      setSelectedMonitor(null);
      clearMonitorForm();
      await loadMonitors();
      showSuccess("Monitor atualizado com sucesso");
    } catch (error: any) {
      console.error("Erro ao atualizar monitor:", error);
      let errorMessage = "Erro ao atualizar monitor";

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.message) {
        errorMessage = error.message;
      }

      showError(errorMessage);
      // Não fechar o modal em caso de erro para o usuário corrigir
    }
  };

  const handleDeleteMonitor = (monitor: MonitorResponse) => {
    Alert.alert(
      "Confirmar Exclusão",
      `Tem certeza que deseja excluir o monitor ${monitor.nome}?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteMonitor(monitor.id);
              await loadMonitors();
              showSuccess("Monitor excluído com sucesso");
            } catch (error) {
              showError("Erro ao excluir monitor");
            }
          },
        },
      ]
    );
  };

  const openEditMonitor = (monitor: MonitorResponse) => {
    setSelectedMonitor(monitor);
    setMonitorForm({
      nome: monitor.nome,
      email: monitor.email,
      tipo: monitor.tipo,
      nomePesquisaMonitoria: monitor.nomePesquisaMonitoria,
      professorId: monitor.professorId,
      cargaHorariaSemanal: monitor.cargaHorariaSemanal.toString(),
    });

    // Converter horários para o formato do weeklySchedule
    const schedule: { [key in DiaSemana]?: number } = {};
    monitor.horarios?.forEach((h) => {
      schedule[h.diaSemana] = h.horasTrabalho;
    });
    setWeeklySchedule(schedule);

    setShowEditMonitorModal(true);
  };

  const handleMonitorFormChange = (field: string, value: any) => {
    setMonitorForm({ ...monitorForm, [field]: value });
  };

  const handleScheduleChange = (dia: DiaSemana, horas: number) => {
    setWeeklySchedule({ ...weeklySchedule, [dia]: horas });
  };

  const renderUsersTab = () => (
    <ScrollView style={styles.content}>
      <Text
        style={[styles.sectionTitle, { color: isDarkMode ? "#fff" : "#000" }]}
      >
        Gerenciar Usuários
      </Text>

      {loadingUsers ? (
        <ActivityIndicator
          size="large"
          color={theme.colors.primary}
          style={{ marginTop: 50 }}
        />
      ) : users.length > 0 ? (
        users.map((user) => (
          <Card
            key={user.id}
            style={[
              styles.userCard,
              { backgroundColor: isDarkMode ? "#232323" : "#fff" },
            ]}
          >
            <Card.Content>
              <View style={styles.userHeader}>
                <View style={{ flex: 1 }}>
                  <Text
                    style={[
                      styles.userName,
                      { color: isDarkMode ? "#fff" : "#000" },
                    ]}
                  >
                    {user.nome}
                  </Text>
                  <Text
                    style={[
                      styles.userEmail,
                      { color: isDarkMode ? "#ccc" : "#666" },
                    ]}
                  >
                    {user.email}
                  </Text>
                </View>
                <IconButton
                  icon="pencil"
                  size={20}
                  iconColor={theme.colors.primary}
                  onPress={() => openEditUser(user)}
                />
              </View>
              <View style={styles.userInfo}>
                <View style={styles.userInfoItem}>
                  <Text
                    style={[
                      styles.userInfoLabel,
                      { color: isDarkMode ? "#999" : "#666" },
                    ]}
                  >
                    Cargo
                  </Text>
                  <Text
                    style={[
                      styles.userInfoValue,
                      { color: isDarkMode ? "#fff" : "#000" },
                    ]}
                  >
                    {user.role}
                  </Text>
                </View>
                <View style={styles.userInfoItem}>
                  <Text
                    style={[
                      styles.userInfoLabel,
                      { color: isDarkMode ? "#999" : "#666" },
                    ]}
                  >
                    Status
                  </Text>
                  <View
                    style={[
                      styles.statusBadge,
                      {
                        backgroundColor: user.isActive
                          ? "#4caf5020"
                          : isDarkMode
                          ? "#99999920"
                          : "#66666620",
                      },
                    ]}
                  >
                    <Text
                      style={{
                        color: user.isActive
                          ? "#4caf50"
                          : isDarkMode
                          ? "#999"
                          : "#666",
                        fontWeight: "600",
                        fontSize: 12,
                      }}
                    >
                      {user.isActive ? "Ativo" : "Inativo"}
                    </Text>
                  </View>
                </View>
              </View>
            </Card.Content>
          </Card>
        ))
      ) : (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            marginTop: 50,
          }}
        >
          <Text
            style={[
              styles.sectionTitle,
              { color: isDarkMode ? "#ccc" : "#666" },
            ]}
          >
            Nenhum usuário encontrado
          </Text>
        </View>
      )}
    </ScrollView>
  );

  const renderMonitorsTab = () => (
    <View style={{ flex: 1 }}>
      <ScrollView style={styles.content}>
        <Text
          style={[styles.sectionTitle, { color: isDarkMode ? "#fff" : "#000" }]}
        >
          Gerenciar Monitores
        </Text>

        {loadingMonitors ? (
          <ActivityIndicator
            size="large"
            color={theme.colors.primary}
            style={{ marginTop: 50 }}
          />
        ) : Array.isArray(monitors) && monitors.length > 0 ? (
          monitors.map((monitor) => (
            <Card
              key={monitor.id}
              style={[
                styles.monitorCard,
                { backgroundColor: isDarkMode ? "#232323" : "#fff" },
              ]}
            >
              <Card.Content>
                <View style={styles.monitorHeader}>
                  <Text
                    style={[
                      styles.monitorName,
                      { color: isDarkMode ? "#fff" : "#000" },
                    ]}
                  >
                    {monitor.nome}
                  </Text>
                  <View style={styles.monitorActions}>
                    <IconButton
                      icon="pencil"
                      size={20}
                      onPress={() => openEditMonitor(monitor)}
                    />
                    <IconButton
                      icon="delete"
                      size={20}
                      onPress={() => handleDeleteMonitor(monitor)}
                    />
                  </View>
                </View>
                <Text style={{ color: isDarkMode ? "#ccc" : "#666" }}>
                  Email: {monitor.email}
                </Text>
                <Text style={{ color: isDarkMode ? "#ccc" : "#666" }}>
                  Tipo: {monitor.tipo}
                </Text>
                <Text style={{ color: isDarkMode ? "#ccc" : "#666" }}>
                  Pesquisa/Monitoria: {monitor.nomePesquisaMonitoria}
                </Text>
                <Text style={{ color: isDarkMode ? "#ccc" : "#666" }}>
                  Professor: {monitor.professor?.nome}
                </Text>
                <Text style={{ color: isDarkMode ? "#ccc" : "#666" }}>
                  Carga Horária: {monitor.cargaHorariaSemanal}h/semana
                </Text>
                {monitor.horarios && monitor.horarios.length > 0 && (
                  <Text
                    style={{
                      color: isDarkMode ? "#ccc" : "#666",
                      marginTop: 4,
                    }}
                  >
                    Horários: {monitor.horarios.length} cadastrado(s)
                  </Text>
                )}
              </Card.Content>
            </Card>
          ))
        ) : (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              marginTop: 50,
            }}
          >
            <Text
              style={[
                styles.sectionTitle,
                { color: isDarkMode ? "#ccc" : "#666" },
              ]}
            >
              Nenhum monitor encontrado
            </Text>
          </View>
        )}
      </ScrollView>

      <FAB
        icon="plus"
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        onPress={() => setShowCreateMonitorModal(true)}
      />
    </View>
  );

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: isDarkMode ? "#181818" : "#fff" },
      ]}
    >
      <View style={FormStyles.menuContainer}>
        <HamburgerMenu />
      </View>
      <View style={styles.header}>
        <Text style={[styles.title, { color: isDarkMode ? "#fff" : "#000" }]}>
          Administração
        </Text>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === "users" && styles.activeTab,
            {
              backgroundColor:
                activeTab === "users" ? theme.colors.primary : "transparent",
            },
          ]}
          onPress={() => setActiveTab("users")}
        >
          <Text
            style={[
              styles.tabText,
              {
                color:
                  activeTab === "users" ? "#fff" : isDarkMode ? "#ccc" : "#666",
              },
            ]}
          >
            Usuários
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === "monitors" && styles.activeTab,
            {
              backgroundColor:
                activeTab === "monitors" ? theme.colors.primary : "transparent",
            },
          ]}
          onPress={() => setActiveTab("monitors")}
        >
          <Text
            style={[
              styles.tabText,
              {
                color:
                  activeTab === "monitors"
                    ? "#fff"
                    : isDarkMode
                    ? "#ccc"
                    : "#666",
              },
            ]}
          >
            Monitores
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === "users" ? renderUsersTab() : renderMonitorsTab()}

      <MonitorModals
        showCreateModal={showCreateMonitorModal}
        showEditModal={showEditMonitorModal}
        isDarkMode={isDarkMode}
        themeColors={theme.colors}
        monitorForm={monitorForm}
        weeklySchedule={weeklySchedule}
        professors={professors}
        onDismissCreate={() => {
          setShowCreateMonitorModal(false);
          clearMonitorForm();
        }}
        onDismissEdit={() => {
          setShowEditMonitorModal(false);
          setSelectedMonitor(null);
          clearMonitorForm();
        }}
        onCreate={handleCreateMonitor}
        onEdit={handleEditMonitor}
        onFormChange={handleMonitorFormChange}
        onScheduleChange={handleScheduleChange}
        getTotalHoras={getTotalHoras}
      />

      <EditUserModal
        visible={showEditUserModal}
        user={selectedUser}
        isDarkMode={isDarkMode}
        themeColors={theme.colors}
        onDismiss={() => {
          setShowEditUserModal(false);
          setSelectedUser(null);
        }}
        onSave={handleUpdateUser}
      />

      <Portal>
        <Toast
          visible={toast.visible}
          message={toast.message}
          type={toast.type}
          onDismiss={hideToast}
        />
      </Portal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: Platform.OS === "ios" ? 0 : 40, // Espaço para navbar do Android e FAB
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: Platform.OS === "ios" ? 40 : 90,
    paddingBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  tabContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    marginBottom: 16,
    zIndex: 10, // Acima do menu (zIndex 5)
    elevation: 10, // Para Android
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginHorizontal: 4,
    elevation: 10, // Elevação para Android
  },
  activeTab: {
    // backgroundColor definido dinamicamente
  },
  tabText: {
    textAlign: "center",
    fontWeight: "500",
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingBottom: 80, // Espaço para navbar do Android e FAB
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  card: {
    marginBottom: 16,
  },
  userCard: {
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  userHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  userName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 13,
  },
  userInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  userInfoItem: {
    flex: 1,
  },
  userInfoLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  userInfoValue: {
    fontSize: 14,
    fontWeight: "500",
  },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 12,
    alignSelf: "flex-start",
  },
  monitorCard: {
    marginBottom: 12,
  },
  monitorHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  monitorName: {
    fontSize: 16,
    fontWeight: "bold",
    flex: 1,
  },
  monitorActions: {
    flexDirection: "row",
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
  },
  modalContainer: {
    margin: 20,
    padding: 20,
    borderRadius: 12,
    maxHeight: "90%", // Limita altura máxima
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  input: {
    marginBottom: 16,
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    gap: 12, // Espaçamento entre botões
  },
  pickerContainer: {
    marginBottom: 16,
  },
  pickerLabel: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: "500",
  },
  pickerRow: {
    flexDirection: "row",
    gap: 8,
  },
  pickerOption: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  professorsScroll: {
    maxHeight: 60,
  },
  professorOption: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginRight: 8,
    minWidth: 100,
    alignItems: "center",
    justifyContent: "center",
  },
  scheduleContainer: {
    marginTop: 16,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  scheduleTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 12,
  },
  dayContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  dayLabel: {
    fontSize: 14,
    fontWeight: "500",
    flex: 1,
  },
  hourControls: {
    flexDirection: "row",
    alignItems: "center",
  },
  hourButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 8,
  },
  hourValue: {
    fontSize: 14,
    fontWeight: "bold",
    minWidth: 30,
    textAlign: "center",
  },
  scheduleWarning: {
    color: "#ff6b35",
    fontSize: 12,
    marginTop: 8,
    textAlign: "center",
    fontStyle: "italic",
  },
});

export default SuperAdminScreen;
