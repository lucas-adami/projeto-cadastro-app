import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import {
  Card,
  Button,
  DataTable,
  Chip,
  IconButton,
  Divider,
} from "react-native-paper";
import { useRoute, useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useThemeMode } from "../../../context/ThemeContext";
import { useToast } from "../../../utils/useToast";
import Toast from "../../../components/atoms/Toast";
import { getPontosByMonitor } from "../../../services/pontos/pontoService";
import { Ponto } from "../../../types/ponto";
import { MonitorResponse } from "../../../types/monitor";
import { shareAsync } from "expo-sharing";
import { printToFileAsync } from "expo-print";

const MonitorDetailsScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { isDarkMode, theme } = useThemeMode();
  const { toast, showSuccess, showError, hideToast } = useToast();

  const monitor = (route.params as any)?.monitor as MonitorResponse;

  const [pontos, setPontos] = useState<Ponto[]>([]);
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    if (monitor?.id) {
      loadPontos();
    }
  }, [monitor]);

  const loadPontos = async () => {
    setLoading(true);
    try {
      // Verifica se o monitor tem um usuário vinculado
      if (!monitor.usuario?.id) {
        console.log("Monitor não possui usuário vinculado");
        setPontos([]);
        return;
      }

      const data = await getPontosByMonitor(monitor.usuario.id);
      setPontos(data || []);
    } catch (error) {
      console.error("Erro ao carregar pontos:", error);
      showError("Erro ao carregar pontos do monitor");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR");
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const calculateHours = (ponto: Ponto) => {
    if (!ponto.saida) return "Em aberto";

    const entrada = new Date(ponto.entrada);
    const saida = new Date(ponto.saida);
    const diff = saida.getTime() - entrada.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    return `${hours}h ${minutes}min`;
  };

  const getTotalHours = () => {
    let totalMinutes = 0;

    pontos.forEach((ponto) => {
      if (ponto.saida) {
        const entrada = new Date(ponto.entrada);
        const saida = new Date(ponto.saida);
        const diff = saida.getTime() - entrada.getTime();
        totalMinutes += diff / (1000 * 60);
      }
    });

    const hours = Math.floor(totalMinutes / 60);
    const minutes = Math.floor(totalMinutes % 60);

    return `${hours}h ${minutes}min`;
  };

  const exportToPDF = async () => {
    try {
      setExporting(true);

      // Preparar dados para o PDF
      const tableRows = pontos
        .map(
          (ponto) => `
        <tr>
          <td>${formatDate(ponto.entrada)}</td>
          <td>${formatTime(ponto.entrada)}</td>
          <td>${ponto.saida ? formatTime(ponto.saida) : "Em aberto"}</td>
          <td>${calculateHours(ponto)}</td>
        </tr>
      `
        )
        .join("");

      const htmlContent = `
        <html>
          <head>
            <meta charset="utf-8" />
            <style>
              @page {
                size: A4;
                margin: 20px;
              }
              body {
                font-family: Arial, sans-serif;
                padding: 20px;
              }
              h1 {
                color: #333;
                margin-bottom: 10px;
              }
              .subtitle {
                color: #666;
                margin-bottom: 20px;
              }
              .info {
                margin-bottom: 20px;
                padding: 10px;
                background-color: #f5f5f5;
                border-radius: 5px;
              }
              table {
                width: 100%;
                border-collapse: collapse;
                margin-top: 20px;
              }
              th, td {
                border: 1px solid #ddd;
                padding: 12px;
                text-align: left;
              }
              th {
                background-color: #4CAF50;
                color: white;
                font-weight: bold;
              }
              tr:nth-child(even) {
                background-color: #f2f2f2;
              }
              .summary {
                margin-top: 20px;
                padding: 10px;
                background-color: #e3f2fd;
                border-radius: 5px;
              }
            </style>
          </head>
          <body>
            <h1>Registro de Pontos</h1>
            <div class="subtitle">Monitor: ${monitor.nome}</div>
            <div class="info">
              <p><strong>Email:</strong> ${monitor.email}</p>
              <p><strong>Projeto:</strong> ${monitor.nomePesquisaMonitoria}</p>
              <p><strong>Professor:</strong> ${
                monitor.professor?.nome || "N/A"
              }</p>
              <p><strong>Carga Horária:</strong> ${
                monitor.cargaHorariaSemanal
              }h/semana</p>
            </div>
            
            <table>
              <thead>
                <tr>
                  <th>Data</th>
                  <th>Entrada</th>
                  <th>Saída</th>
                  <th>Horas Trabalhadas</th>
                </tr>
              </thead>
              <tbody>
                ${tableRows}
              </tbody>
            </table>
            
            <div class="summary">
              <p><strong>Total de Registros:</strong> ${pontos.length}</p>
              <p><strong>Total de Horas:</strong> ${getTotalHours()}</p>
              <p><strong>Período:</strong> ${
                pontos.length > 0
                  ? `${formatDate(
                      pontos[pontos.length - 1].entrada
                    )} até ${formatDate(pontos[0].entrada)}`
                  : "N/A"
              }</p>
            </div>
          </body>
        </html>
      `;

      const { uri } = await printToFileAsync({ html: htmlContent });
      await shareAsync(uri);
      showSuccess("PDF exportado com sucesso!");
    } catch (error) {
      console.error("Erro ao exportar PDF:", error);
      showError("Erro ao exportar PDF");
    } finally {
      setExporting(false);
    }
  };

  const confirmExport = () => {
    if (pontos.length === 0) {
      Alert.alert("Aviso", "Não há pontos registrados para exportar.");
      return;
    }

    Alert.alert(
      "Exportar PDF",
      `Deseja exportar os ${pontos.length} registro(s) de ponto de ${monitor.nome}?`,
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Exportar", onPress: exportToPDF },
      ]
    );
  };

  if (!monitor) {
    return (
      <SafeAreaView
        style={[
          styles.container,
          { backgroundColor: isDarkMode ? "#181818" : "#f5f5f5" },
        ]}
      >
        <View style={styles.errorContainer}>
          <Text style={{ color: isDarkMode ? "#fff" : "#000" }}>
            Monitor não encontrado
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: isDarkMode ? "#181818" : "#f5f5f5" },
      ]}
    >
      <View style={styles.header}>
        <IconButton
          icon="arrow-left"
          size={24}
          onPress={() => navigation.goBack()}
          iconColor={isDarkMode ? "#fff" : "#000"}
        />
        <Text style={[styles.title, { color: isDarkMode ? "#fff" : "#000" }]}>
          Detalhes do Monitor
        </Text>
        <IconButton
          icon="file-pdf-box"
          size={24}
          onPress={confirmExport}
          iconColor={exporting ? "#999" : theme.colors.primary}
          disabled={exporting}
        />
      </View>

      <ScrollView style={styles.scrollView}>
        {/* Card de Informações do Monitor */}
        <Card
          style={[
            styles.card,
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
              <Chip
                mode="flat"
                style={{
                  backgroundColor:
                    monitor.tipo === "MONITOR"
                      ? theme.colors.primary
                      : "#9c27b0",
                }}
                textStyle={{ color: "#fff" }}
              >
                {monitor.tipo === "MONITOR" ? "Monitor" : "Pesquisador"}
              </Chip>
            </View>

            <Divider style={{ marginVertical: 12 }} />

            <View style={styles.infoRow}>
              <Icon
                name="email"
                size={18}
                color={isDarkMode ? "#999" : "#666"}
                style={styles.infoIcon}
              />
              <Text
                style={[
                  styles.infoLabel,
                  { color: isDarkMode ? "#999" : "#666" },
                ]}
              >
                Email:
              </Text>
              <Text
                style={[
                  styles.infoValue,
                  { color: isDarkMode ? "#fff" : "#000" },
                ]}
              >
                {monitor.email}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Icon
                name="school"
                size={18}
                color={isDarkMode ? "#999" : "#666"}
                style={styles.infoIcon}
              />
              <Text
                style={[
                  styles.infoLabel,
                  { color: isDarkMode ? "#999" : "#666" },
                ]}
              >
                Projeto:
              </Text>
              <Text
                style={[
                  styles.infoValue,
                  { color: isDarkMode ? "#fff" : "#000" },
                ]}
              >
                {monitor.nomePesquisaMonitoria}
              </Text>
            </View>

            {monitor.professor && (
              <View style={styles.infoRow}>
                <Icon
                  name="person"
                  size={18}
                  color={isDarkMode ? "#999" : "#666"}
                  style={styles.infoIcon}
                />
                <Text
                  style={[
                    styles.infoLabel,
                    { color: isDarkMode ? "#999" : "#666" },
                  ]}
                >
                  Professor:
                </Text>
                <Text
                  style={[
                    styles.infoValue,
                    { color: isDarkMode ? "#fff" : "#000" },
                  ]}
                >
                  {monitor.professor.nome}
                </Text>
              </View>
            )}

            <View style={styles.infoRow}>
              <Icon
                name="schedule"
                size={18}
                color={isDarkMode ? "#999" : "#666"}
                style={styles.infoIcon}
              />
              <Text
                style={[
                  styles.infoLabel,
                  { color: isDarkMode ? "#999" : "#666" },
                ]}
              >
                Carga Horária:
              </Text>
              <Text
                style={[
                  styles.infoValue,
                  { color: isDarkMode ? "#fff" : "#000" },
                ]}
              >
                {monitor.cargaHorariaSemanal}h/semana
              </Text>
            </View>
          </Card.Content>
        </Card>

        {/* Card de Estatísticas */}
        <Card
          style={[
            styles.card,
            { backgroundColor: isDarkMode ? "#232323" : "#fff" },
          ]}
        >
          <Card.Content>
            <Text
              style={[
                styles.sectionTitle,
                { color: isDarkMode ? "#fff" : "#000" },
              ]}
            >
              Estatísticas
            </Text>
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text
                  style={[styles.statValue, { color: theme.colors.primary }]}
                >
                  {pontos.length}
                </Text>
                <Text
                  style={[
                    styles.statLabel,
                    { color: isDarkMode ? "#999" : "#666" },
                  ]}
                >
                  Registros
                </Text>
              </View>
              <View style={styles.statItem}>
                <Text
                  style={[styles.statValue, { color: theme.colors.primary }]}
                >
                  {getTotalHours()}
                </Text>
                <Text
                  style={[
                    styles.statLabel,
                    { color: isDarkMode ? "#999" : "#666" },
                  ]}
                >
                  Total de Horas
                </Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Card de Pontos */}
        <Card
          style={[
            styles.card,
            { backgroundColor: isDarkMode ? "#232323" : "#fff" },
          ]}
        >
          <Card.Content>
            <View style={styles.pontosHeader}>
              <Text
                style={[
                  styles.sectionTitle,
                  { color: isDarkMode ? "#fff" : "#000" },
                ]}
              >
                Registro de Pontos
              </Text>
              <Button
                mode="contained"
                onPress={confirmExport}
                loading={exporting}
                disabled={exporting || pontos.length === 0}
                icon="file-pdf-box"
                compact
              >
                Exportar
              </Button>
            </View>

            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
              </View>
            ) : pontos.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Icon
                  name="event-busy"
                  size={60}
                  color={isDarkMode ? "#555" : "#ccc"}
                />
                <Text
                  style={[
                    styles.emptyText,
                    { color: isDarkMode ? "#ccc" : "#666" },
                  ]}
                >
                  {!monitor.usuario?.id
                    ? "Monitor não possui usuário vinculado"
                    : "Nenhum ponto registrado"}
                </Text>
              </View>
            ) : (
              <DataTable>
                <DataTable.Header>
                  <DataTable.Title>
                    <Text style={{ color: isDarkMode ? "#fff" : "#000" }}>
                      Data
                    </Text>
                  </DataTable.Title>
                  <DataTable.Title>
                    <Text style={{ color: isDarkMode ? "#fff" : "#000" }}>
                      Entrada
                    </Text>
                  </DataTable.Title>
                  <DataTable.Title>
                    <Text style={{ color: isDarkMode ? "#fff" : "#000" }}>
                      Saída
                    </Text>
                  </DataTable.Title>
                  <DataTable.Title>
                    <Text style={{ color: isDarkMode ? "#fff" : "#000" }}>
                      Horas
                    </Text>
                  </DataTable.Title>
                </DataTable.Header>

                {pontos.map((ponto) => (
                  <DataTable.Row key={ponto.id}>
                    <DataTable.Cell>
                      <Text style={{ color: isDarkMode ? "#fff" : "#000" }}>
                        {formatDate(ponto.entrada)}
                      </Text>
                    </DataTable.Cell>
                    <DataTable.Cell>
                      <Text style={{ color: isDarkMode ? "#fff" : "#000" }}>
                        {formatTime(ponto.entrada)}
                      </Text>
                    </DataTable.Cell>
                    <DataTable.Cell>
                      <Text style={{ color: isDarkMode ? "#fff" : "#000" }}>
                        {ponto.saida ? formatTime(ponto.saida) : "-"}
                      </Text>
                    </DataTable.Cell>
                    <DataTable.Cell>
                      <Text
                        style={{
                          color: ponto.saida
                            ? isDarkMode
                              ? "#fff"
                              : "#000"
                            : "#ff9800",
                        }}
                      >
                        {calculateHours(ponto)}
                      </Text>
                    </DataTable.Cell>
                  </DataTable.Row>
                ))}
              </DataTable>
            )}
          </Card.Content>
        </Card>
      </ScrollView>

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
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 8,
    paddingTop: 16,
    paddingBottom: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    flex: 1,
    textAlign: "center",
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  card: {
    marginBottom: 16,
    elevation: 2,
  },
  monitorHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  monitorName: {
    fontSize: 20,
    fontWeight: "bold",
    flex: 1,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
  },
  infoIcon: {
    marginRight: 8,
  },
  infoLabel: {
    fontSize: 14,
    marginRight: 4,
    fontWeight: "500",
  },
  infoValue: {
    fontSize: 14,
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 8,
  },
  statItem: {
    alignItems: "center",
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
  },
  statLabel: {
    fontSize: 14,
    marginTop: 4,
  },
  pontosHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  loadingContainer: {
    padding: 40,
    alignItems: "center",
  },
  emptyContainer: {
    padding: 40,
    alignItems: "center",
  },
  emptyText: {
    marginTop: 12,
    fontSize: 14,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default MonitorDetailsScreen;
