import React from "react";
import { View, Text, TouchableOpacity, SafeAreaView } from "react-native";
import { Button } from "react-native-paper";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import HamburgerMenu from "../../../components/HamburgerMenu";
import { useProfessor } from "../../../context/ProfessorContext";
import { TableStyle } from "../../../style/TableStyle";
import { FormStyles } from "../../../style/FormStyles";
import { NavigationProp } from "../../../routes/rootStackParamList ";
import { useThemeMode } from "../../../context/ThemeContext"; // Importa o contexto do tema

const DetailsProfessors = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProp<{ params: { id: string } }, "params">>();
  const { professors } = useProfessor();

  const { isDarkMode } = useThemeMode();

  const id = route.params?.id;
  const professor = professors.find((p) => p.id === id);

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: isDarkMode ? "#181818" : "#fff" }}
    >
      <View style={TableStyle.menuContainer}>
        <HamburgerMenu />
      </View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: 10,
          marginTop: 10,
        }}
      >
        <Button
          onPress={() => navigation.goBack()}
          style={FormStyles.goBackButton}
          labelStyle={{ color: "white" }}
        >
          Voltar
        </Button>
      </View>
      <Text
        style={[
          TableStyle.title,
          {
            marginBottom: 20,
            marginTop: 20,
            textAlign: "center",
            paddingHorizontal: 18,
            color: isDarkMode ? "#fff" : "#000",
          },
        ]}
      >
        Detalhes do Professor
      </Text>
      {professor ? (
        <View
          style={{
            marginTop: 10,
            marginHorizontal: 8,
            padding: 24,
            borderRadius: 20,
            backgroundColor: isDarkMode ? "#232323" : "#fff",
            elevation: 4,
            shadowColor: "#000",
            shadowOpacity: 0.08,
            shadowRadius: 8,
            shadowOffset: { width: 0, height: 2 },
          }}
        >
          <Text
            style={{
              fontSize: 24,
              fontWeight: "bold",
              color: isDarkMode ? "#fff" : "#22223b",
              marginBottom: 12,
              letterSpacing: 0.5,
            }}
          >
            {professor.nome}
          </Text>
          <View style={{ marginBottom: 16 }}>
            <InfoLine
              label="Email"
              value={professor.email}
              isDarkMode={isDarkMode}
            />
            <InfoLine
              label="Titulação"
              value={professor.titulacao}
              isDarkMode={isDarkMode}
            />
            <InfoLine
              label="Status"
              value={professor.statusAtividade}
              isDarkMode={isDarkMode}
            />
            <InfoLine
              label="Referência"
              value={professor.referencia}
              isDarkMode={isDarkMode}
            />
            <InfoLine
              label="ID Unidade"
              value={professor.idUnidade}
              isDarkMode={isDarkMode}
            />
            <InfoLine
              label="Lattes"
              value={professor.lattes}
              valueStyle={{
                color: "#007bff",
                textDecorationLine: "underline",
              }}
              isDarkMode={isDarkMode}
            />
            <InfoLine
              label="Observações"
              value={professor.observacoes || "Nenhuma"}
              valueStyle={{ fontStyle: "italic", color: "#6c757d" }}
              isDarkMode={isDarkMode}
            />
          </View>
          {professor.cursoCoordenado ? (
            <View
              style={{
                marginTop: 10,
                padding: 14,
                backgroundColor: isDarkMode ? "#181818" : "#f1f3f6",
                borderRadius: 12,
                borderLeftWidth: 4,
                borderLeftColor: "#007bff",
              }}
            >
              <Text
                style={{
                  fontWeight: "bold",
                  marginBottom: 6,
                  color: isDarkMode ? "#fff" : "#22223b",
                }}
              >
                Curso Coordenado
              </Text>
              <InfoLine
                label="Nome"
                value={professor.cursoCoordenado.nome}
                isDarkMode={isDarkMode}
              />
              <InfoLine
                label="Sigla"
                value={professor.cursoCoordenado.sigla}
                isDarkMode={isDarkMode}
              />
              <InfoLine
                label="Código"
                value={professor.cursoCoordenado.codigo}
                isDarkMode={isDarkMode}
              />
              <InfoLine
                label="Modelo"
                value={professor.cursoCoordenado.modelo}
                isDarkMode={isDarkMode}
              />
              <InfoLine
                label="ID"
                value={professor.cursoCoordenado.id?.toString()}
                isDarkMode={isDarkMode}
              />
            </View>
          ) : (
            <Text
              style={{
                marginTop: 10,
                color: "#888",
                textAlign: "center",
              }}
            >
              Não coordena nenhum curso.
            </Text>
          )}
        </View>
      ) : (
        <Text
          style={[
            TableStyle.emptyText,
            { color: isDarkMode ? "#fff" : "#000" },
          ]}
        >
          Professor não encontrado.
        </Text>
      )}

      <View style={{ margin: 16 }}>
        <Button
          mode="contained"
          onPress={() => {
            if (professor?.id)
              navigation.navigate("EditProfessors", {
                id: professor.id,
              });
          }}
          style={FormStyles.button}
          labelStyle={{ color: "white" }}
        >
          Editar Professor
        </Button>
      </View>
    </SafeAreaView>
  );
};

const InfoLine = ({
  label,
  value,
  valueStyle,
  isDarkMode,
}: {
  label: string;
  value: string;
  valueStyle?: any;
  isDarkMode?: boolean;
}) => (
  <View style={{ flexDirection: "row", marginBottom: 6 }}>
    <Text
      style={{
        fontWeight: "600",
        color: isDarkMode ? "#ccc" : "#495057",
        width: 110,
      }}
    >
      {label}:
    </Text>
    <Text
      style={[{ color: isDarkMode ? "#fff" : "#22223b", flex: 1 }, valueStyle]}
      numberOfLines={2}
      ellipsizeMode="tail"
    >
      {value}
    </Text>
  </View>
);

export default DetailsProfessors;
