import React from "react";
import { SafeAreaView, Text, StyleSheet, View } from "react-native";
import { FormStyles } from "../style/FormStyles";
import { Button, Card, MD3Colors, ProgressBar } from "react-native-paper";

type Props = {
  title: string;
  description: string;
  onPressFn: () => void;
  isDarkMode?: boolean;
};

const SuccessScreen = ({ title, description, onPressFn, isDarkMode }: Props) => {
  return (
    <SafeAreaView style={FormStyles.safeArea}>
      <View style={FormStyles.container}>
        <Card
          style={[
            FormStyles.card,
            { height: "70%", backgroundColor: isDarkMode ? "#232323" : "#fff" }
          ]}
        >
          <Card.Content>
            <Text style={[
              FormStyles.title,
              { color: isDarkMode ? "#fff" : "#000" }
            ]}>{title}</Text>
            <Text style={[
              FormStyles.description,
              { color: isDarkMode ? "#fff" : "#000" }
            ]}>{description}</Text>
          </Card.Content>
          <Card.Actions style={{ paddingTop: "65%" }}>
            <Button
              onPress={onPressFn}
              style={[FormStyles.button]}
              labelStyle={{ color: "white" }}
            >
              Concluir
            </Button>
          </Card.Actions>
          <ProgressBar progress={1} color={MD3Colors.neutral40} />
        </Card>
      </View>
    </SafeAreaView>
  );
};

export default SuccessScreen;