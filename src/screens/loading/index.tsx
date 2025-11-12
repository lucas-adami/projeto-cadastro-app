import React, { useEffect } from "react";
import { View, Text, ActivityIndicator, StyleSheet, Image } from "react-native";
import { useThemeMode } from "../../context/ThemeContext";

const LoadingScreen = ({ navigation }: any) => {
  const { isDarkMode } = useThemeMode(); 

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.navigate("Login");
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={[
      styles.container,
      { backgroundColor: isDarkMode ? "#181818" : "#fff" }
    ]}>
      <Image
        source={require("../../../assets/logoFatecCapi.png")}
        style={styles.logo}
      />
      <Text style={[
        styles.title,
        { color: isDarkMode ? "#fff" : "#000" }
      ]}>
        Aguarde
      </Text>
      <ActivityIndicator size="large" color="#007BFF" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff", // será sobrescrito inline
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    // color será sobrescrito inline
  },
  logo: {
    width: 300,
    height: 300,
    marginBottom: 20,
    resizeMode: "contain",
  },
});

export default LoadingScreen;