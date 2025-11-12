import React, { useState, useEffect } from "react";
import { View, Text, SafeAreaView, ScrollView, StyleSheet } from "react-native";
import { Button, Card } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import HamburgerMenu from "../../../components/HamburgerMenu";
import { TableStyle } from "../../../style/TableStyle";
import { NavigationProp } from "../../../routes/rootStackParamList ";
import { useThemeMode } from "../../../context/ThemeContext";
import { useAuth } from "../../../context/AuthContext";
import { useToast } from "../../../utils/useToast";
import Toast from "../../../components/atoms/Toast";

const DetailsMonitor = () => {
  const navigation = useNavigation<NavigationProp>();
  const { isDarkMode } = useThemeMode();
  const { user, userRole } = useAuth();
  const { toast, showError, showSuccess, hideToast } = useToast();

  const [entrada, setEntrada] = useState("Não definida");
  const [saida, setSaida] = useState("Não definida");

  const monitor = user?.monitor || {
    id: "1",
    nome: "Monitor Exemplo",
    tipo: "Acadêmico",
    cargaHorariaSemanal: 8,
  };

  useEffect(() => {
    if (userRole !== "MONITOR" && !user?.monitor) {
      showError("Acesso não autorizado");
      navigation.goBack();
    }
  }, []);

  const handleRegistrarPonto = () => {
    showSuccess("Funcionalidade em desenvolvimento");
  };

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: isDarkMode ? "#181818" : "#fff" },
      ]}
    >
      <View style={TableStyle.menuContainer}>
        <HamburgerMenu />
      </View>

      <ScrollView style={styles.content}>
        <Text style={[styles.title, { color: isDarkMode ? "#fff" : "#000" }]}>
          Painel do Monitor
        </Text>

        <Card
          style={[
            styles.card,
            { backgroundColor: isDarkMode ? "#232323" : "#fff" },
          ]}
        >
          <Card.Content>
            <Text
              style={[
                styles.monitorName,
                { color: isDarkMode ? "#fff" : "#000" },
              ]}
            >
              {monitor.nome}
            </Text>
            <Text
              style={[
                styles.monitorInfo,
                { color: isDarkMode ? "#ccc" : "#666" },
              ]}
            >
              Tipo: {monitor.tipo}
            </Text>
            <Text
              style={[
                styles.monitorInfo,
                { color: isDarkMode ? "#ccc" : "#666" },
              ]}
            >
              Carga Horária: {monitor.cargaHorariaSemanal}h/semana
            </Text>
          </Card.Content>
        </Card>

        <Card
          style={[
            styles.card,
            { backgroundColor: isDarkMode ? "#232323" : "#fff" },
          ]}
        >
          <Card.Content>
            <Text
              style={[
                styles.cardTitle,
                { color: isDarkMode ? "#fff" : "#000" },
              ]}
            >
              Ponto de Hoje
            </Text>

            <View style={styles.pontoInfo}>
              <Text
                style={[
                  styles.pontoLabel,
                  { color: isDarkMode ? "#fff" : "#000" },
                ]}
              >
                Entrada: {entrada}
              </Text>
              <Text
                style={[
                  styles.pontoLabel,
                  { color: isDarkMode ? "#fff" : "#000" },
                ]}
              >
                Saída: {saida}
              </Text>
            </View>

            <Button
              mode="contained"
              onPress={handleRegistrarPonto}
              style={styles.registerButton}
            >
              Registrar Ponto
            </Button>
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
  content: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    marginTop: 20,
  },
  card: {
    marginBottom: 16,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  monitorName: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
  },
  monitorInfo: {
    fontSize: 16,
    marginBottom: 4,
  },
  pontoInfo: {
    marginBottom: 16,
  },
  pontoLabel: {
    fontSize: 16,
    marginBottom: 8,
  },
  registerButton: {
    marginTop: 8,
  },
});

export default DetailsMonitor;
