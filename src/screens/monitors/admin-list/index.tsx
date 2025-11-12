import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { Card, IconButton, Searchbar } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialIcons";
import HamburgerMenu from "../../../components/HamburgerMenu";
import { useThemeMode } from "../../../context/ThemeContext";
import { useToast } from "../../../utils/useToast";
import Toast from "../../../components/atoms/Toast";
import { getAllMonitors } from "../../../services/monitors/monitorService";
import { MonitorResponse } from "../../../types/monitor";

const AdminMonitorsListScreen = () => {
  const navigation = useNavigation();
  const { isDarkMode, theme } = useThemeMode();
  const { toast, showError, hideToast } = useToast();

  const [monitors, setMonitors] = useState<MonitorResponse[]>([]);
  const [filteredMonitors, setFilteredMonitors] = useState<MonitorResponse[]>(
    []
  );
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    loadMonitors();
  }, []);

  useEffect(() => {
    filterMonitors();
  }, [searchQuery, monitors]);

  const loadMonitors = async () => {
    setLoading(true);
    try {
      const data = await getAllMonitors();
      if (Array.isArray(data)) {
        setMonitors(data);
        setFilteredMonitors(data);
      }
    } catch (error) {
      console.error("Erro ao carregar monitores:", error);
      showError("Erro ao carregar monitores");
    } finally {
      setLoading(false);
    }
  };

  const filterMonitors = () => {
    if (!searchQuery.trim()) {
      setFilteredMonitors(monitors);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = monitors.filter(
      (monitor) =>
        monitor.nome.toLowerCase().includes(query) ||
        monitor.email.toLowerCase().includes(query) ||
        monitor.nomePesquisaMonitoria.toLowerCase().includes(query) ||
        monitor.professor?.nome.toLowerCase().includes(query)
    );
    setFilteredMonitors(filtered);
  };

  const handleMonitorPress = (monitor: MonitorResponse) => {
    (navigation as any).navigate("MonitorDetails", { monitor });
  };

  const getTipoColor = (tipo: string) => {
    return tipo === "MONITOR" ? theme.colors.primary : "#9c27b0";
  };

  const getTipoLabel = (tipo: string) => {
    return tipo === "MONITOR" ? "Monitor" : "Pesquisador";
  };

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: isDarkMode ? "#181818" : "#f5f5f5" },
      ]}
    >
      <View style={styles.header}>
        <HamburgerMenu />
        <Text style={[styles.title, { color: isDarkMode ? "#fff" : "#000" }]}>
          Monitores
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Buscar monitor..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={[
            styles.searchBar,
            { backgroundColor: isDarkMode ? "#232323" : "#fff" },
          ]}
          iconColor={isDarkMode ? "#fff" : "#000"}
          inputStyle={{ color: isDarkMode ? "#fff" : "#000" }}
          placeholderTextColor={isDarkMode ? "#999" : "#666"}
        />
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text
            style={[
              styles.loadingText,
              { color: isDarkMode ? "#ccc" : "#666" },
            ]}
          >
            Carregando monitores...
          </Text>
        </View>
      ) : filteredMonitors.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Icon
            name="search-off"
            size={80}
            color={isDarkMode ? "#555" : "#ccc"}
          />
          <Text
            style={[styles.emptyText, { color: isDarkMode ? "#ccc" : "#666" }]}
          >
            {searchQuery
              ? "Nenhum monitor encontrado"
              : "Nenhum monitor cadastrado"}
          </Text>
        </View>
      ) : (
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
        >
          {filteredMonitors.map((monitor) => (
            <TouchableOpacity
              key={monitor.id}
              onPress={() => handleMonitorPress(monitor)}
              activeOpacity={0.7}
            >
              <Card
                style={[
                  styles.card,
                  { backgroundColor: isDarkMode ? "#232323" : "#fff" },
                ]}
              >
                <Card.Content>
                  <View style={styles.cardHeader}>
                    <View style={styles.cardHeaderLeft}>
                      <Text
                        style={[
                          styles.monitorName,
                          { color: isDarkMode ? "#fff" : "#000" },
                        ]}
                      >
                        {monitor.nome}
                      </Text>
                    </View>
                    <IconButton
                      icon="chevron-right"
                      size={24}
                      iconColor={isDarkMode ? "#fff" : "#000"}
                    />
                  </View>

                  <View style={styles.infoRow}>
                    <Icon
                      name="email"
                      size={16}
                      color={isDarkMode ? "#999" : "#666"}
                      style={styles.infoIcon}
                    />
                    <Text
                      style={[
                        styles.infoText,
                        { color: isDarkMode ? "#ccc" : "#666" },
                      ]}
                    >
                      {monitor.email}
                    </Text>
                  </View>

                  <View style={styles.infoRow}>
                    <Icon
                      name="school"
                      size={16}
                      color={isDarkMode ? "#999" : "#666"}
                      style={styles.infoIcon}
                    />
                    <Text
                      style={[
                        styles.infoText,
                        { color: isDarkMode ? "#ccc" : "#666" },
                      ]}
                    >
                      {monitor.nomePesquisaMonitoria}
                    </Text>
                  </View>

                  {monitor.professor && (
                    <View style={styles.infoRow}>
                      <Icon
                        name="person"
                        size={16}
                        color={isDarkMode ? "#999" : "#666"}
                        style={styles.infoIcon}
                      />
                      <Text
                        style={[
                          styles.infoText,
                          { color: isDarkMode ? "#ccc" : "#666" },
                        ]}
                      >
                        Prof. {monitor.professor.nome}
                      </Text>
                    </View>
                  )}

                  <View style={styles.infoRow}>
                    <Icon
                      name="schedule"
                      size={16}
                      color={isDarkMode ? "#999" : "#666"}
                      style={styles.infoIcon}
                    />
                    <Text
                      style={[
                        styles.infoText,
                        { color: isDarkMode ? "#ccc" : "#666" },
                      ]}
                    >
                      {monitor.cargaHorariaSemanal}h/semana
                    </Text>
                  </View>
                </Card.Content>
              </Card>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

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
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  searchBar: {
    elevation: 2,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    textAlign: "center",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  card: {
    marginBottom: 12,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  cardHeaderLeft: {
    flex: 1,
  },
  monitorName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  infoIcon: {
    marginRight: 8,
  },
  infoText: {
    fontSize: 14,
    flex: 1,
  },
});

export default AdminMonitorsListScreen;
