import React from "react";
import {
  SafeAreaView,
  Text,
  StyleSheet,
  View,
  ScrollView,
  Linking,
} from "react-native";
import HamburgerMenu from "../../components/HamburgerMenu";
import { SUPPORT_EMAIL } from "@env";
import { Card } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";
import { useThemeMode } from "../../context/ThemeContext"; // Importa o contexto do tema
import { useToast } from "../../utils/useToast";
import Toast from "../../components/atoms/Toast";

const SupportPage = () => {
  const navigation = useNavigation();
  const { isDarkMode, toggleTheme } = useThemeMode();
  const { toast, showError, hideToast } = useToast();

  const sendEmail = async () => {
    const email = SUPPORT_EMAIL;
    const subject = "Chamado de Suporte";
    const url = `mailto:${email}?subject=${encodeURIComponent(subject)}`;

    const canOpen = await Linking.canOpenURL(url);

    if (canOpen) {
      Linking.openURL(url);
    } else {
      showError("Não foi possível abrir o app de E-mail");
    }
  };

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContent}
      keyboardShouldPersistTaps="handled"
      style={{ backgroundColor: isDarkMode ? "#181818" : "#fff" }}
    >
      <SafeAreaView
        style={[
          styles.container,
          { backgroundColor: isDarkMode ? "#181818" : "#fff" },
        ]}
      >
        {/* HamburgerMenu à esquerda */}
        <View style={styles.menuRow}>
          <View style={styles.menuWrapper}>
            <HamburgerMenu />
          </View>

          {/* Se quiser o switch aqui, descomente abaixo:
                    <Switch value={isDarkMode} onValueChange={toggleTheme} />
                    */}
        </View>

        <View style={styles.headerr}>
          <View
            style={[
              styles.header,
              { backgroundColor: isDarkMode ? "#232323" : "black" },
            ]}
          >
            <Text style={[styles.title, { color: "white" }]}>
              Central de Suporte
            </Text>
            <Text
              style={[styles.subtitle, { color: isDarkMode ? "#ccc" : "gray" }]}
            >
              Possui dúvidas ou notou algum bug? Nosso time está aqui para
              ajudar!
            </Text>
          </View>
        </View>
        <View style={styles.content}>
          <Text
            style={{
              fontSize: 20,
              fontWeight: "bold",
              marginBottom: 12,
              color: isDarkMode ? "#fff" : "#333",
            }}
          >
            Tópicos
          </Text>

          <Card
            style={[
              styles.card,
              { backgroundColor: isDarkMode ? "#232323" : "#fff" },
            ]}
            mode="elevated"
            onPress={sendEmail}
          >
            <Card.Content style={[{ alignItems: "center" }]}>
              <View
                style={[
                  styles.icon,
                  { backgroundColor: isDarkMode ? "#181818" : "#fff" },
                ]}
              >
                <Icon
                  name="email"
                  size={40}
                  color={isDarkMode ? "#fff" : "#000"}
                />
              </View>
              <Text
                style={[
                  styles.cardTitle,
                  { color: isDarkMode ? "#fff" : "#000" },
                ]}
              >
                E-mail
              </Text>
              <Text
                style={[
                  styles.cardSubtitle,
                  { color: isDarkMode ? "#ccc" : "#333" },
                ]}
              >
                Entre em contato através do e-mail
              </Text>
            </Card.Content>
          </Card>

          <Card
            style={[
              styles.card,
              { backgroundColor: isDarkMode ? "#232323" : "#fff" },
            ]}
            mode="elevated"
            onPress={() => console.log("Chatbox")}
          >
            <Card.Content style={[{ alignItems: "center" }]}>
              <View
                style={[
                  styles.icon,
                  { backgroundColor: isDarkMode ? "#181818" : "#fff" },
                ]}
              >
                <Icon
                  name="chat"
                  size={40}
                  color={isDarkMode ? "#fff" : "#000"}
                />
              </View>
              <Text
                style={[
                  styles.cardTitle,
                  { color: isDarkMode ? "#fff" : "#000" },
                ]}
              >
                Chatbox
              </Text>
              <Text
                style={[
                  styles.cardSubtitle,
                  { color: isDarkMode ? "#ccc" : "#333" },
                ]}
              >
                Tire suas dúvidas de forma instantânea com nosso chatbox!
              </Text>
            </Card.Content>
          </Card>
        </View>

        <Toast
          visible={toast.visible}
          message={toast.message}
          type={toast.type}
          onDismiss={hideToast}
        />
      </SafeAreaView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  header: {
    justifyContent: "center",
    backgroundColor: "black",
    padding: 30,
    height: 250,
    borderRadius: 25,
    marginBottom: 30,
  },
  headerr: {
    paddingHorizontal: 10,
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  menuRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start", // Hamburger à esquerda
    paddingTop: 10,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  menuWrapper: {
    paddingTop: 0,
    paddingHorizontal: 0,
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },
  content: {
    flex: 1,
    paddingHorizontal: 25,
  },
  title: {
    fontSize: 25,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "gray",
    marginTop: 20,
    textAlign: "center",
  },
  card: {
    display: "flex",
    justifyContent: "center",
    marginBottom: 16,
    backgroundColor: "#fff",
    padding: 10,
  },
  cardTitle: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 4,
    textAlign: "center",
  },
  cardSubtitle: {
    textAlign: "center",
  },
  icon: {
    padding: 8,
    marginBottom: 10,
    backgroundColor: "#fff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
});

export default SupportPage;
