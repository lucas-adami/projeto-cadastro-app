import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  TextInput,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import HamburgerMenu from "../../../components/HamburgerMenu";
import { useNavigation } from "@react-navigation/native";
import { NavigationProp } from "../../../routes/rootStackParamList ";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Icon from "react-native-vector-icons/MaterialIcons";
import { Button } from "react-native-paper"; // ADICIONADO: Para o seletor

import { TableStyle } from "../../../style/TableStyle";
import { InteractBtn } from "../../../components/atoms/InteractBtn";
import { shareDataToPdfFile } from "../../../services/file/fileService";
import ColumnSelectionModal from "../../../components/ColumnSelectionModal";
import ProximityNotification from "../../../components/ProximityNotification";
import { buscarOuCacheUnidadeProxima } from "../../../services/unit-location/unitService";
import ListPicker from "../../../components/atoms/ListPicker"; // ADICIONADO: Para seleção

import { useThemeMode } from "../../../context/ThemeContext";
import { useToast } from "../../../utils/useToast";
import Toast from "../../../components/atoms/Toast";

// Interface para os registros de ponto
interface RegistroPonto {
  id: number;
  data: string;
  diaSemana: string;
  entrada: string;
  saida: string | null;
  totalHoras: number;
  status: 'completo' | 'incompleto' | 'falta';
  mes: number; // ADICIONADO: Mês do registro
  ano: number; // ADICIONADO: Ano do registro
}

const ListRegistrosPontoScreen = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
  const [expandedCard, setExpandedCard] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
  const [unidadeNome, setUnidadeNome] = useState<string | null>(null);
  const [registros, setRegistros] = useState<RegistroPonto[]>([]);
  const [todosRegistros, setTodosRegistros] = useState<RegistroPonto[]>([]); // ADICIONADO: Todos os registros
  const [mesAtual, setMesAtual] = useState("");
  const [totalHorasMes, setTotalHorasMes] = useState(0);
  
  // ADICIONADO: Estados para seleção de mês e ano
  const [mesSelecionado, setMesSelecionado] = useState<number>(new Date().getMonth() + 1);
  const [anoSelecionado, setAnoSelecionado] = useState<number>(new Date().getFullYear());
  const [showDateSelector, setShowDateSelector] = useState(false);

  const navigation = useNavigation<NavigationProp>();
  const { isDarkMode } = useThemeMode();
  const { toast, showError, showSuccess, hideToast } = useToast();

  // ADICIONADO: Opções para os seletores
  const meses = [
    { label: "Janeiro", value: 1 },
    { label: "Fevereiro", value: 2 },
    { label: "Março", value: 3 },
    { label: "Abril", value: 4 },
    { label: "Maio", value: 5 },
    { label: "Junho", value: 6 },
    { label: "Julho", value: 7 },
    { label: "Agosto", value: 8 },
    { label: "Setembro", value: 9 },
    { label: "Outubro", value: 10 },
    { label: "Novembro", value: 11 },
    { label: "Dezembro", value: 12 },
  ];

  const anos = Array.from({ length: 5 }, (_, i) => {
    const ano = new Date().getFullYear() - 2 + i;
    return { label: ano.toString(), value: ano };
  });

  // ADICIONADO: Dados mockados expandidos com mais meses
  const registrosMockados: RegistroPonto[] = [
    // Dezembro 2024
    {
      id: 1,
      data: "01/12/2024",
      diaSemana: "Domingo",
      entrada: "08:00",
      saida: "12:00",
      totalHoras: 4,
      status: "completo",
      mes: 12,
      ano: 2024
    },
    {
      id: 2,
      data: "02/12/2024", 
      diaSemana: "Segunda-feira",
      entrada: "08:30",
      saida: "12:30",
      totalHoras: 4,
      status: "completo",
      mes: 12,
      ano: 2024
    },
    {
      id: 3,
      data: "03/12/2024",
      diaSemana: "Terça-feira",
      entrada: "09:00",
      saida: "13:00",
      totalHoras: 4,
      status: "completo",
      mes: 12,
      ano: 2024
    },
    {
      id: 4,
      data: "04/12/2024",
      diaSemana: "Quarta-feira",
      entrada: "08:00",
      saida: "12:00",
      totalHoras: 4,
      status: "completo",
      mes: 12,
      ano: 2024
    },
    {
      id: 5,
      data: "05/12/2024",
      diaSemana: "Quinta-feira",
      entrada: "08:15",
      saida: "12:15",
      totalHoras: 4,
      status: "completo",
      mes: 12,
      ano: 2024
    },
    {
      id: 6,
      data: "06/12/2024",
      diaSemana: "Sexta-feira",
      entrada: "08:45",
      saida: null,
      totalHoras: 0,
      status: "incompleto",
      mes: 12,
      ano: 2024
    },
    // Novembro 2024
    {
      id: 11,
      data: "01/11/2024",
      diaSemana: "Sexta-feira",
      entrada: "08:00",
      saida: "12:00",
      totalHoras: 4,
      status: "completo",
      mes: 11,
      ano: 2024
    },
    {
      id: 12,
      data: "04/11/2024",
      diaSemana: "Segunda-feira",
      entrada: "08:30",
      saida: "12:30",
      totalHoras: 4,
      status: "completo",
      mes: 11,
      ano: 2024
    },
    {
      id: 13,
      data: "05/11/2024",
      diaSemana: "Terça-feira",
      entrada: "09:00",
      saida: "13:00",
      totalHoras: 4,
      status: "completo",
      mes: 11,
      ano: 2024
    },
    // Janeiro 2024
    {
      id: 21,
      data: "08/01/2024",
      diaSemana: "Segunda-feira",
      entrada: "08:00",
      saida: "12:00",
      totalHoras: 4,
      status: "completo",
      mes: 1,
      ano: 2024
    },
    {
      id: 22,
      data: "09/01/2024",
      diaSemana: "Terça-feira",
      entrada: "08:30",
      saida: "12:30",
      totalHoras: 4,
      status: "completo",
      mes: 1,
      ano: 2024
    },
  ];

  // ADICIONADO: Função para filtrar registros por mês e ano
  const filtrarRegistrosPorPeriodo = (mes: number, ano: number) => {
    return todosRegistros.filter(registro => registro.mes === mes && registro.ano === ano);
  };

  // ADICIONADO: Função para obter nome do mês
  const getNomeMes = (numeroMes: number) => {
    return meses.find(mes => mes.value === numeroMes)?.label || "";
  };

  // MODIFICADO: useEffect para carregar dados
  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setTodosRegistros(registrosMockados);
      
      // Filtrar registros do mês/ano selecionado
      const registrosFiltrados = registrosMockados.filter(
        registro => registro.mes === mesSelecionado && registro.ano === anoSelecionado
      );
      
      setRegistros(registrosFiltrados);
      setMesAtual(`${getNomeMes(mesSelecionado)} ${anoSelecionado}`);
      
      // Calcular total de horas do mês
      const total = registrosFiltrados.reduce((acc, registro) => acc + registro.totalHoras, 0);
      setTotalHorasMes(total);
      
      setIsLoading(false);
    }, 1000);
  }, [mesSelecionado, anoSelecionado]); // MODIFICADO: Dependências

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

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 800);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  // Filtrar registros baseado na busca
  const registrosFiltrados = registros.filter(registro =>
    registro.data.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
    registro.diaSemana.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
  );

  const toggleCardExpansion = (id: number) => {
    setExpandedCard((prev) => (prev === id ? null : id));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completo":
        return "#28a745";
      case "incompleto":
        return "#ffc107";
      case "falta":
        return "#dc3545";
      default:
        return "#6c757d";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "completo":
        return "Completo";
      case "incompleto":
        return "Incompleto";
      case "falta":
        return "Falta";
      default:
        return "Indefinido";
    }
  };

  const columnOptions = ["data", "diaSemana", "entrada", "saida", "totalHoras", "status"];

  const handleExportClick = () => {
    setIsModalVisible(true);
  };

  const handleShareData = async () => {
    try {
      setIsLoading(true);
      await shareDataToPdfFile(registrosFiltrados, selectedColumns, "registros-ponto" as any);
      showSuccess("Arquivo compartilhado com sucesso!");
    } catch (error: any) {
      const errorMessage = error?.message || "Erro ao compartilhar arquivo";
      showError(errorMessage);
    } finally {
      setIsLoading(false);
      setIsModalVisible(false);
    }
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
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
            Registros de Ponto
          </Text>

          {/* ADICIONADO: Seletor de Período */}
          <View
            style={[
              styles.dateSelector,
              { backgroundColor: isDarkMode ? "#232323" : "#fff" },
            ]}
          >
            <TouchableOpacity
              style={[
                styles.dateSelectorButton,
                { backgroundColor: isDarkMode ? "#181818" : "#f8f9fa" }
              ]}
              onPress={() => setShowDateSelector(!showDateSelector)}
            >
              <Icon name="date-range" size={20} color={isDarkMode ? "#fff" : "#000"} />
              <Text
                style={[
                  styles.dateSelectorText,
                  { color: isDarkMode ? "#fff" : "#000" }
                ]}
              >
                {mesAtual}
              </Text>
              <Icon 
                name={showDateSelector ? "keyboard-arrow-up" : "keyboard-arrow-down"} 
                size={20} 
                color={isDarkMode ? "#fff" : "#000"} 
              />
            </TouchableOpacity>

            {showDateSelector && (
              <View style={[
                styles.datePickerContainer,
                { backgroundColor: isDarkMode ? "#181818" : "#f8f9fa" }
              ]}>
                <View style={styles.pickerRow}>
                  <View style={styles.pickerColumn}>
                    <Text
                      style={[
                        styles.pickerLabel,
                        { color: isDarkMode ? "#fff" : "#000" }
                      ]}
                    >
                      Mês:
                    </Text>
                    <ListPicker
                      items={meses}
                      selected={meses.find(m => m.value === mesSelecionado)}
                      onSelect={(mes: number) => setMesSelecionado(mes)}
                      getLabel={(item) => item.label}
                      getValue={(item) => item.value}
                      backgroundColor={isDarkMode ? "#232323" : "#fff"}
                    />
                  </View>
                  
                  <View style={styles.pickerColumn}>
                    <Text
                      style={[
                        styles.pickerLabel,
                        { color: isDarkMode ? "#fff" : "#000" }
                      ]}
                    >
                      Ano:
                    </Text>
                    <ListPicker
                      items={anos}
                      selected={anos.find(a => a.value === anoSelecionado)}
                      onSelect={(ano: number) => setAnoSelecionado(ano)}
                      getLabel={(item) => item.label}
                      getValue={(item) => item.value}
                      backgroundColor={isDarkMode ? "#232323" : "#fff"}
                    />
                  </View>
                </View>

                <Button
                  mode="contained"
                  style={[styles.applyButton, { backgroundColor: "#007bff" }]}
                  labelStyle={{ color: "white" }}
                  onPress={() => setShowDateSelector(false)}
                >
                  Aplicar Filtro
                </Button>
              </View>
            )}
          </View>

          {/* Card com resumo do mês */}
          <View
            style={[
              styles.resumoCard,
              { backgroundColor: isDarkMode ? "#232323" : "#fff" },
            ]}
          >
            <Text
              style={[
                styles.resumoTitle,
                { color: isDarkMode ? "#fff" : "#000" },
              ]}
            >
              Resumo - {mesAtual}
            </Text>
            <View style={styles.resumoRow}>
              <Text
                style={[
                  styles.resumoText,
                  { color: isDarkMode ? "#ccc" : "#666" },
                ]}
              >
                Total de Horas: 
              </Text>
              <Text
                style={[
                  styles.resumoHoras,
                  { color: "#28a745" },
                ]}
              >
                {totalHorasMes}h
              </Text>
            </View>
            <View style={styles.resumoRow}>
              <Text
                style={[
                  styles.resumoText,
                  { color: isDarkMode ? "#ccc" : "#666" },
                ]}
              >
                Dias Trabalhados: 
              </Text>
              <Text
                style={[
                  styles.resumoHoras,
                  { color: "#007bff" },
                ]}
              >
                {registros.filter(r => r.status === "completo").length} dias
              </Text>
            </View>
          </View>

          <TextInput
            placeholder="Buscar por data ou dia da semana"
            placeholderTextColor={isDarkMode ? "#aaa" : "#888"}
            value={searchTerm}
            onChangeText={setSearchTerm}
            style={[
              TableStyle.input,
              {
                color: isDarkMode ? "#fff" : "#000",
                borderColor: isDarkMode ? "#444" : "#ccc",
              },
            ]}
          />

          <View style={TableStyle.cardList}>
            {isLoading ? (
              <ActivityIndicator size="large" />
            ) : registrosFiltrados.length === 0 ? (
              <Text
                style={[
                  TableStyle.emptyText,
                  { color: isDarkMode ? "#fff" : "#000" },
                ]}
              >
                Nenhum Registro Encontrado para {mesAtual}
              </Text>
            ) : (
              registrosFiltrados.map((registro) => (
                <View key={registro.id} style={TableStyle.cardContainer}>
                  <TouchableOpacity
                    onPress={() => toggleCardExpansion(registro.id)}
                    style={[
                      TableStyle.card,
                      { backgroundColor: isDarkMode ? "#232323" : "#fff" },
                    ]}
                  >
                    <View style={styles.cardHeader}>
                      <View style={styles.cardMainInfo}>
                        <Text
                          style={[
                            TableStyle.cardTitle,
                            { color: isDarkMode ? "#fff" : "#000" },
                          ]}
                        >
                          {registro.data} - {registro.diaSemana}
                        </Text>
                        <Text
                          style={[
                            TableStyle.cardSubtitle,
                            { color: isDarkMode ? "#ccc" : "#333" },
                          ]}
                        >
                          Entrada: {registro.entrada} | Saída: {registro.saida || "Não registrada"}
                        </Text>
                      </View>
                      <View style={styles.cardStatus}>
                        <View
                          style={[
                            styles.statusBadge,
                            { backgroundColor: getStatusColor(registro.status) },
                          ]}
                        >
                          <Text style={styles.statusText}>
                            {getStatusText(registro.status)}
                          </Text>
                        </View>
                        <Text
                          style={[
                            styles.horasText,
                            { color: isDarkMode ? "#fff" : "#000" },
                          ]}
                        >
                          {registro.totalHoras}h
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                  
                  {expandedCard === registro.id && (
                    <View style={TableStyle.cardActionsContainer}>
                      <TouchableOpacity
                        style={[TableStyle.actionButton, TableStyle.editButton]}
                        onPress={() => {
                          console.log("Editar registro", registro.id);
                        }}
                      >
                        <Icon name="edit" size={24} color="#fff" />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[
                          TableStyle.actionButton,
                          {
                            backgroundColor: "#007bff",
                            justifyContent: "center",
                            alignItems: "center",
                          },
                        ]}
                        onPress={() => {
                          console.log("Ver detalhes do registro", registro.id);
                        }}
                      >
                        <Icon name="visibility" size={24} color="#fff" />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[
                          TableStyle.actionButton,
                          TableStyle.deleteButton,
                        ]}
                        onPress={() => {
                          console.log("Deletar registro", registro.id);
                        }}
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

        {registrosFiltrados.length > 0 && (
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
          labels={{
            data: "Data",
            diaSemana: "Dia da Semana",
            entrada: "Entrada",
            saida: "Saída",
            totalHoras: "Total de Horas",
            status: "Status"
          }}
          loading={isLoading}
        />

        <Toast
          visible={toast.visible}
          message={toast.message}
          type={toast.type}
          onDismiss={hideToast}
        />
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  fabContainer: {
    position: "absolute",
    bottom: 16,
    right: 16,
    elevation: 2,
  },
  // ADICIONADO: Estilos para o seletor de data
  dateSelector: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  dateSelectorButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderRadius: 12,
  },
  dateSelectorText: {
    fontSize: 16,
    fontWeight: "600",
    flex: 1,
    marginLeft: 8,
  },
  datePickerContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  pickerRow: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 16,
  },
  pickerColumn: {
    flex: 1,
  },
  pickerLabel: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },
  applyButton: {
    borderRadius: 8,
  },
  resumoCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  resumoTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
  },
  resumoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  resumoText: {
    fontSize: 14,
    fontWeight: "600",
  },
  resumoHoras: {
    fontSize: 16,
    fontWeight: "bold",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardMainInfo: {
    flex: 1,
  },
  cardStatus: {
    alignItems: "flex-end",
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 4,
  },
  statusText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  horasText: {
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ListRegistrosPontoScreen;