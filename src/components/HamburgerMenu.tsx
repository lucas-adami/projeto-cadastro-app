import React, { useState } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  Modal,
  StyleSheet,
  ScrollView,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../context/AuthContext";
import { MaterialIcons } from "@expo/vector-icons";
import { useThemeMode } from "../context/ThemeContext";
import ThemeSwitch from "./ThemeSwitch";

export default function HamburgerMenu() {
  const [visible, setVisible] = useState(false);
  const navigation = useNavigation();
  const { logout, userRole } = useAuth();
  const { isDarkMode, toggleTheme, theme } = useThemeMode();

  const handleLogout = () => {
    setVisible(false);
    logout();
  };

  // Funções auxiliares para verificar permissões
  const shouldShowAdminFeatures = () => {
    return userRole === "ADMIN" || userRole === "SUPER_ADMIN";
  };

  const shouldShowSuperAdminFeatures = () => {
    return userRole === "SUPER_ADMIN";
  };

  const shouldShowMonitorFeatures = () => {
    return userRole === "MONITOR";
  };

  const isMonitor = () => {
    return userRole === "MONITOR";
  };

  return (
    <View>
      <TouchableOpacity onPress={() => setVisible(true)} style={styles.icon}>
        <Text style={{ fontSize: 40, color: theme.colors.onBackground }}>
          ☰
        </Text>
      </TouchableOpacity>

      <Modal
        transparent
        visible={visible}
        animationType="fade"
        onRequestClose={() => setVisible(false)}
      >
        <TouchableOpacity
          style={styles.overlay}
          onPress={() => setVisible(false)}
          activeOpacity={1}
        >
          <TouchableOpacity
            activeOpacity={1}
            style={[styles.menu, { backgroundColor: theme.colors.background }]}
            onPress={(e) => e.stopPropagation()}
          >
            <ScrollView
              contentContainerStyle={styles.menuItemsContainer}
              nestedScrollEnabled={true}
            >
              <View style={styles.logoContainer}>
                <Image
                  source={
                    isDarkMode
                      ? require("../../assets/logo_fatec_cor2.png")
                      : require("../../assets/logo_fatec_cor.png")
                  }
                  style={styles.logo}
                  resizeMode="contain"
                />
              </View>

              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => {
                  setVisible(false);
                  if (isMonitor()) {
                    navigation.navigate("MonitorsIndex" as never);
                  } else {
                    navigation.navigate("Home" as never);
                  }
                }}
              >
                <View style={styles.iconRow}>
                  <MaterialIcons
                    name="home"
                    size={20}
                    style={[
                      styles.iconItem,
                      { color: theme.colors.onBackground },
                    ]}
                  />
                  <Text
                    style={[
                      styles.menuText,
                      { color: theme.colors.onBackground },
                    ]}
                  >
                    {isMonitor() ? "Monitoria" : "Início"}
                  </Text>
                </View>
              </TouchableOpacity>

              <View
                style={[
                  styles.separator,
                  { backgroundColor: theme.colors.outline },
                ]}
              />

              {shouldShowSuperAdminFeatures() && (
                <>
                  <View style={styles.categoryContainer}>
                    <Text
                      style={[
                        styles.categoryLabel,
                        { color: theme.colors.onBackground },
                      ]}
                    >
                      Super Admin
                    </Text>

                    <TouchableOpacity
                      style={styles.menuItem}
                      onPress={() => {
                        setVisible(false);
                        navigation.navigate("SuperAdmin" as never);
                      }}
                    >
                      <View style={styles.iconRow}>
                        <MaterialIcons
                          name="admin-panel-settings"
                          size={20}
                          style={[
                            styles.iconItem,
                            { color: theme.colors.onBackground },
                          ]}
                        />
                        <Text
                          style={[
                            styles.menuText,
                            { color: theme.colors.onBackground },
                          ]}
                        >
                          Administração
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>

                  <View
                    style={[
                      styles.separator,
                      { backgroundColor: theme.colors.outline },
                    ]}
                  />
                </>
              )}

              {shouldShowAdminFeatures() && (
                <>
                  <View style={styles.categoryContainer}>
                    <Text
                      style={[
                        styles.categoryLabel,
                        { color: theme.colors.onBackground },
                      ]}
                    >
                      Professor
                    </Text>

                    <TouchableOpacity
                      style={styles.menuItem}
                      onPress={() => {
                        setVisible(false);
                        navigation.navigate("ListProfessors" as never);
                      }}
                    >
                      <View style={styles.iconRow}>
                        <MaterialIcons
                          name="list"
                          size={20}
                          style={[
                            styles.iconItem,
                            { color: theme.colors.onBackground },
                          ]}
                        />
                        <Text
                          style={[
                            styles.menuText,
                            { color: theme.colors.onBackground },
                          ]}
                        >
                          Lista
                        </Text>
                      </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.menuItem}
                      onPress={() => {
                        setVisible(false);
                        navigation.navigate("RegisterProfessorsIndex" as never);
                      }}
                    >
                      <View style={styles.iconRow}>
                        <MaterialIcons
                          name="person-add"
                          size={20}
                          style={[
                            styles.iconItem,
                            { color: theme.colors.onBackground },
                          ]}
                        />
                        <Text
                          style={[
                            styles.menuText,
                            { color: theme.colors.onBackground },
                          ]}
                        >
                          Cadastro
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>

                  <View
                    style={[
                      styles.separator,
                      { backgroundColor: theme.colors.outline },
                    ]}
                  />

                  <View style={styles.categoryContainer}>
                    <Text
                      style={[
                        styles.categoryLabel,
                        { color: theme.colors.onBackground },
                      ]}
                    >
                      Curso
                    </Text>

                    <TouchableOpacity
                      style={styles.menuItem}
                      onPress={() => {
                        setVisible(false);
                        navigation.navigate("ListCourses" as never);
                      }}
                    >
                      <View style={styles.iconRow}>
                        <MaterialIcons
                          name="list-alt"
                          size={20}
                          style={[
                            styles.iconItem,
                            { color: theme.colors.onBackground },
                          ]}
                        />
                        <Text
                          style={[
                            styles.menuText,
                            { color: theme.colors.onBackground },
                          ]}
                        >
                          Lista
                        </Text>
                      </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.menuItem}
                      onPress={() => {
                        setVisible(false);
                        navigation.navigate("RegisterCursosIndex" as never);
                      }}
                    >
                      <View style={styles.iconRow}>
                        <MaterialIcons
                          name="playlist-add"
                          size={20}
                          style={[
                            styles.iconItem,
                            { color: theme.colors.onBackground },
                          ]}
                        />
                        <Text
                          style={[
                            styles.menuText,
                            { color: theme.colors.onBackground },
                          ]}
                        >
                          Cadastro
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>

                  <View
                    style={[
                      styles.separator,
                      { backgroundColor: theme.colors.outline },
                    ]}
                  />

                  <View style={styles.categoryContainer}>
                    <Text
                      style={[
                        styles.categoryLabel,
                        { color: theme.colors.onBackground },
                      ]}
                    >
                      Monitores
                    </Text>

                    <TouchableOpacity
                      style={styles.menuItem}
                      onPress={() => {
                        setVisible(false);
                        navigation.navigate("AdminMonitorsList" as never);
                      }}
                    >
                      <View style={styles.iconRow}>
                        <MaterialIcons
                          name="list"
                          size={20}
                          style={[
                            styles.iconItem,
                            { color: theme.colors.onBackground },
                          ]}
                        />
                        <Text
                          style={[
                            styles.menuText,
                            { color: theme.colors.onBackground },
                          ]}
                        >
                          Lista
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>

                  <View
                    style={[
                      styles.separator,
                      { backgroundColor: theme.colors.outline },
                    ]}
                  />
                </>
              )}

              <View style={styles.categoryContainer}>
                <Text
                  style={[
                    styles.categoryLabel,
                    { color: theme.colors.onBackground },
                  ]}
                >
                  Visualização
                </Text>
                <View style={styles.themeRow}>
                  <TouchableOpacity
                    style={styles.menuItem}
                    onPress={toggleTheme}
                    activeOpacity={0.7}
                  >
                    <View style={styles.iconRow}>
                      <MaterialIcons
                        name="brightness-6"
                        size={20}
                        style={[
                          styles.iconItem,
                          { color: theme.colors.onBackground },
                        ]}
                      />
                      <Text
                        style={[
                          styles.menuText,
                          { color: theme.colors.onBackground },
                        ]}
                      >
                        Tema
                      </Text>
                    </View>
                  </TouchableOpacity>
                  <View style={styles.themeSwitch}>
                    <ThemeSwitch
                      isDarkMode={isDarkMode}
                      toggleTheme={toggleTheme}
                    />
                  </View>
                </View>
              </View>

              <View
                style={[
                  styles.separator,
                  { backgroundColor: theme.colors.outline },
                ]}
              />

              <View style={styles.categoryContainer}>
                <Text
                  style={[
                    styles.categoryLabel,
                    { color: theme.colors.onBackground },
                  ]}
                >
                  Conta
                </Text>

                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => {
                    setVisible(false);
                    navigation.navigate("Settings" as never);
                  }}
                >
                  <View style={styles.iconRow}>
                    <MaterialIcons
                      name="settings"
                      size={20}
                      style={[
                        styles.iconItem,
                        { color: theme.colors.onBackground },
                      ]}
                    />
                    <Text
                      style={[
                        styles.menuText,
                        { color: theme.colors.onBackground },
                      ]}
                    >
                      Configurações
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </ScrollView>

            <View
              style={[
                styles.logoutButton,
                { borderTopColor: theme.colors.outline },
              ]}
            >
              <TouchableOpacity
                onPress={() => {
                  setVisible(false);
                  navigation.navigate("SupportPage" as never);
                }}
              >
                <View style={[styles.iconRow, { marginBottom: 30 }]}>
                  <MaterialIcons
                    name="contact-support"
                    size={20}
                    style={[
                      styles.iconItem,
                      { color: theme.colors.onBackground },
                    ]}
                  />
                  <Text
                    style={[
                      styles.menuText,
                      { color: theme.colors.onBackground },
                    ]}
                  >
                    Falar com Suporte
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity onPress={handleLogout}>
                <View style={styles.iconRow}>
                  <MaterialIcons
                    name="logout"
                    size={20}
                    color="#d00"
                    style={styles.iconItem}
                  />
                  <Text style={styles.logoutText}>Sair</Text>
                </View>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  icon: {
    padding: 10,
    marginTop: 30,
  },
  overlay: {
    flex: 1,
    backgroundColor: "#00000088",
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  menu: {
    backgroundColor: "#fff",
    padding: 20,
    height: "100%",
    width: 250,
    justifyContent: "space-between",
  },
  menuItemsContainer: {
    paddingBottom: 20,
    paddingTop: 40,
  },
  separator: {
    height: 1,
    backgroundColor: "#ccc",
    marginVertical: 12,
  },
  categoryContainer: {
    marginBottom: 12,
  },
  categoryLabel: {
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 6,
  },
  menuItem: {
    paddingVertical: 8,
    paddingLeft: 12,
  },
  menuText: {
    fontSize: 16,
  },
  logoutButton: {
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  logoutText: {
    fontSize: 18,
    color: "#d00",
    fontWeight: "bold",
  },
  iconRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconItem: {
    marginRight: 8,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  logo: {
    width: 130,
    height: 50,
    marginTop: 10,
  },
  themeRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  themeSwitch: {
    marginRight: 16,
  },
  monitorsContainer: {
    marginTop: 12,
  },
});
