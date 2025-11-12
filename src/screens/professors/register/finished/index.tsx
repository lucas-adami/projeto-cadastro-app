import React from "react";
import { View, StyleSheet } from "react-native";
import SuccessScreen from "../../../../components/SucessScreen";
import { useNavigation } from "@react-navigation/native";
import HamburgerMenu from "../../../../components/HamburgerMenu";
import { useThemeMode } from "../../../../context/ThemeContext";

const FinishedProfessorScreen = () => {
  const navigation = useNavigation();
  const { isDarkMode } = useThemeMode();

  return (
    <View style={[
      styles.container,
      { backgroundColor: isDarkMode ? "#181818" : "#fff" }
    ]}>
      <HamburgerMenu />
      <SuccessScreen
        title="Professor Cadastrado com Sucesso!"
        description="Seu professor já está disponível para relatórios!"
        onPressFn={() => navigation.navigate("ListProfessors" as never)}
        isDarkMode={isDarkMode}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default FinishedProfessorScreen;