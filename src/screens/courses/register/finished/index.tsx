import React from "react";
import SuccessScreen from "../../../../components/SucessScreen";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView, View } from "react-native";
import { FormStyles } from "../../../../style/FormStyles";
import HamburgerMenu from "../../../../components/HamburgerMenu";
import { useThemeMode } from "../../../../context/ThemeContext"; // Importa o contexto do tema

const Finished = () => {
  const navigation = useNavigation();
  const { isDarkMode } = useThemeMode();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: isDarkMode ? "#181818" : "#fff" }}>
      <HamburgerMenu />
      <SuccessScreen
        title="Curso Cadastrado com Sucesso!"
        description="Seu curso já está disponível para relatórios!"
        onPressFn={() => navigation.navigate("ListCourses" as never)}
        isDarkMode={isDarkMode}
      />
    </SafeAreaView>
  );
};

export default Finished;