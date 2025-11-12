import React from "react";
import { SafeAreaView, View, ScrollView, Text, StyleSheet } from "react-native";
import HamburgerMenu from "../../../components/HamburgerMenu";
import { FormStyles } from "../../../style/FormStyles";
import {
  Button,
  Card,
  Modal,
  Portal,
  ActivityIndicator,
} from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { NavigationProp } from "../../../routes/rootStackParamList ";
import { gerarProfessorIA } from "../../../services/ia/iaService";
import LottieView from "lottie-react-native";
import { AnimatedGradientButton } from "../../../components/atoms/AnimatedLinearGradient";
import ProximityNotification from "../../../components/ProximityNotification";
import { buscarOuCacheUnidadeProxima } from "../../../services/unit-location/unitService";
import { useThemeMode } from "../../../context/ThemeContext";
import { useToast } from "../../../utils/useToast";
import Toast from "../../../components/atoms/Toast";

const RegisterProfessorScreen = () => {
  const navigation = useNavigation<NavigationProp>();

  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);
  const [modalVisible, setModalVisible] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [loadingMsg, setLoadingMsg] = React.useState("Gerando professor...");
  const [unidadeNome, setUnidadeNome] = React.useState<string | null>(null);

  const { isDarkMode } = useThemeMode();
  const { toast, showError, hideToast } = useToast();

  React.useEffect(() => {
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

  const handleGerarIA = async () => {
    setLoading(true);
    setErrorMsg(null);
    setLoadingMsg("Gerando professor...");
    let timeout: NodeJS.Timeout | null = null;
    timeout = setTimeout(() => setLoadingMsg("Treinando IA..."), 2500);

    try {
      const resposta = await gerarProfessorIA();
      if (timeout) clearTimeout(timeout);
      setLoading(false);
      setModalVisible(false);

      navigation.navigate("RegisterProfessorsStepOne", {
        iaData: resposta,
      });
    } catch (e) {
      if (timeout) clearTimeout(timeout);
      setLoading(false);
      setLoadingMsg("Gerando professor...");
      setErrorMsg("Não foi possível gerar o professor. Tente novamente.");
      showError("Erro ao gerar professor com IA. Tente novamente.");
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
      {unidadeNome && <ProximityNotification unidadeNome={unidadeNome} />}
      <View style={FormStyles.container}>
        <ScrollView
          contentContainerStyle={FormStyles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <Card
              style={[
                FormStyles.card,
                {
                  width: "90%",
                  backgroundColor: isDarkMode ? "#232323" : "#fff",
                },
              ]}
              mode="elevated"
            >
              <Card.Content>
                <LottieView
                  source={require("../../../../assets/register.json")}
                  autoPlay
                  loop
                  speed={0.3}
                  style={{
                    width: "100%",
                    height: 150,
                  }}
                />
                <Text
                  style={[
                    FormStyles.title,
                    { color: isDarkMode ? "#fff" : "#000" },
                  ]}
                >
                  Cadastro de Professor
                </Text>
                <Text
                  style={[
                    FormStyles.description,
                    { color: isDarkMode ? "#fff" : "#000" },
                  ]}
                >
                  Escolha como deseja cadastrar.
                </Text>
              </Card.Content>
              <Card.Actions
                style={{ flexDirection: "column", gap: 10, marginTop: 10 }}
              >
                <Button
                  mode="contained"
                  labelStyle={{ color: "white" }}
                  style={FormStyles.button}
                  onPress={() =>
                    navigation.navigate("RegisterProfessorsStepOne" as never)
                  }
                >
                  Cadastrar Manualmente
                </Button>
                <Button
                  mode="contained"
                  labelStyle={{ color: "white" }}
                  style={[FormStyles.button]}
                  onPress={() =>
                    navigation.navigate("ImportProfessors" as never)
                  }
                >
                  Importar Planilha
                </Button>
                {/* <View style={{ alignItems: "center", width: "100%" }}>
                  <AnimatedGradientButton onPress={() => setModalVisible(true)}>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                        height: 48,
                        minWidth: 150,
                        paddingHorizontal: 16,
                      }}
                    >
                      <Text
                        style={{
                          color: "white",
                          fontWeight: "bold",
                        }}
                      >
                        Gerar com IA
                      </Text>
                      <LottieView
                        source={require("../../../../assets/bot.json")}
                        autoPlay
                        loop
                        style={{
                          width: 40,
                          height: 38,
                        }}
                      />
                    </View>
                  </AnimatedGradientButton>
                </View> */}
              </Card.Actions>
            </Card>
          </View>
        </ScrollView>
        <Portal>
          <Modal
            visible={modalVisible}
            onDismiss={() => {
              setModalVisible(false);
              setErrorMsg(null);
            }}
            contentContainerStyle={[
              styles.modalContainer,
              { backgroundColor: isDarkMode ? "#232323" : "white" },
            ]}
          >
            {loading ? (
              <View style={{ alignItems: "center" }}>
                <ActivityIndicator size="large" color="#D32719" />
                <Text
                  style={{ marginTop: 16, color: isDarkMode ? "#fff" : "#000" }}
                >
                  {loadingMsg}
                </Text>
              </View>
            ) : (
              <>
                <Text
                  style={[
                    styles.modalTitle,
                    { color: isDarkMode ? "#fff" : "#000" },
                  ]}
                >
                  Gerar Professor com IA
                </Text>
                <Text
                  style={[
                    styles.modalDescription,
                    { color: isDarkMode ? "#fff" : "#000" },
                  ]}
                >
                  A IA irá preencher automaticamente os campos:{" "}
                  <Text style={styles.bold}>Nome</Text>,{" "}
                  <Text style={styles.bold}>Titulação</Text>,{" "}
                  <Text style={styles.bold}>Referência</Text>,{" "}
                  <Text style={styles.bold}>Status de Atividade</Text> e{" "}
                  <Text style={styles.bold}>Lattes</Text>. Você poderá revisar e
                  completar os demais campos.
                </Text>
                {errorMsg && (
                  <Text style={{ color: "red", marginBottom: 10 }}>
                    {errorMsg}
                  </Text>
                )}
                <View style={styles.modalButtonRow}>
                  <Button
                    mode="outlined"
                    onPress={() => {
                      setModalVisible(false);
                      setErrorMsg(null);
                    }}
                    style={[
                      styles.cancelButton,
                      {
                        backgroundColor: isDarkMode ? "#444" : "transparent", // <-- cor igual à dos botões da tela de login
                        borderColor: isDarkMode ? "#444" : "black",
                      },
                    ]}
                    labelStyle={[
                      styles.cancelButtonLabel,
                      { color: isDarkMode ? "#fff" : "black" },
                    ]}
                  >
                    Cancelar
                  </Button>
                  <Button
                    mode="contained"
                    buttonColor={FormStyles.button.backgroundColor}
                    labelStyle={styles.confirmButtonLabel}
                    style={styles.confirmButton}
                    onPress={handleGerarIA}
                  >
                    Gerar com IA
                  </Button>
                </View>
              </>
            )}
          </Modal>
        </Portal>
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
  modalContainer: {
    backgroundColor: "white", // será sobrescrito inline
    padding: 20,
    margin: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 10,
    textAlign: "left",
    // color será sobrescrito inline
  },
  modalDescription: {
    marginBottom: 20,
    textAlign: "left",
    fontSize: 15,
    // color será sobrescrito inline
  },
  bold: {
    fontWeight: "bold",
  },
  modalButtonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  cancelButton: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "black", // será sobrescrito inline
    flex: 1,
    marginRight: 8,
  },
  cancelButtonLabel: {
    color: "black", // será sobrescrito inline
  },
  confirmButton: {
    borderRadius: 8,
    flex: 1,
    marginLeft: 8,
  },
  confirmButtonLabel: {
    color: "white",
  },
});

export default RegisterProfessorScreen;
