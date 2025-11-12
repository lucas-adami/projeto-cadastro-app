import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Switch } from "react-native-paper";
import { AnimatedGradientWrapper } from './atoms/AnimatedGradientWrapper';

type Props = {
  value: boolean;
  onValueChange: (value: boolean) => void;
  label?: string;
  labelColor?: string;
};

export const SuggestionSwitch: React.FC<Props> = ({
  value,
  onValueChange,
  label = "Sugestões de \n     Cadastro",
  labelColor = "#333"
}) => (
  <View style={styles.container}>
    <Text style={[styles.label, { color: labelColor }]}>{label}</Text>
    <AnimatedGradientWrapper style={styles.gradientWrapper} enabled={value}>
      <Switch
        value={value}
        onValueChange={onValueChange}
        color={value ? "#fff" : "#D32719"}
        trackColor={{ false: "#ccc", true: value ? "transparent" : "#D32719" }}
        thumbColor="#fff"
        style={styles.switch}
      />
    </AnimatedGradientWrapper>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-end",
    marginTop: 12,
    marginBottom: 8,
    marginRight: 8,
  },
  label: {
    marginRight: 8,
    fontSize: 10,
    fontWeight: "600",
  },
  gradientWrapper: {
    borderRadius: 20,
    padding: 2,
  },
  switch: {
    width: 48,
    height: 32,
    alignSelf: "center"
  },
});