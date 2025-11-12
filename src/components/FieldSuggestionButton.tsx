import React from "react";
import { Button } from "react-native-paper";
import { StyleSheet, Image } from "react-native";

type Props = {
  onPress: () => void;
};

export const FieldSuggestionButton: React.FC<Props> = ({ onPress }) => (
  <Button
    mode="contained"
    compact
    onPress={onPress}
    style={styles.suggestionButtonCustom}
    labelStyle={styles.suggestionButtonLabel}
    contentStyle={styles.suggestionButtonContent}
  >
    <Image
      source={require("../../assets/check.png")}
      style={{ width: 20, height: 20, marginRight: -3 }}
      resizeMode="contain"
    />
  </Button>
);

const styles = StyleSheet.create({
  suggestionButtonCustom: {
    marginLeft: 8,
    height: 38,
    width: 38,
    borderRadius: 8,
    backgroundColor: "#D32719",
    alignItems: "center",
    justifyContent: "center",
    padding: 0,
    flexShrink: 0,
    marginBottom: 12,
  },
  suggestionButtonLabel: {
    fontSize: 0,
    padding: 0,
  },
  suggestionButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 0,
    paddingRight: 0,
  },
});