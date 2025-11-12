import React from "react";
import { SafeAreaView, StyleSheet, View } from "react-native";
import HamburgerMenu from "../../../components/HamburgerMenu";
import StepOne from "./stepOne";
import { useThemeMode } from "../../../context/ThemeContext"; // Importa o contexto do tema

const RegisterCoursesScreen = () => {
  const { isDarkMode } = useThemeMode();

  return (
    <SafeAreaView style={[
      styles.container,
      { backgroundColor: isDarkMode ? "#181818" : "#fff" }
    ]}>
      <View style={styles.menuContainer}>
        <HamburgerMenu />
      </View>
      <View style={styles.content}>
        <StepOne />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff", // será sobrescrito inline
  },
  menuContainer: {
    position: "absolute",
    top: 10,
    left: 10,
    zIndex: 10,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default RegisterCoursesScreen;