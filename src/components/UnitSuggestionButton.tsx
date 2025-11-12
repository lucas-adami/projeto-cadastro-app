import React from "react";
import { Button } from "react-native-paper";
import { StyleSheet } from "react-native";
import LottieView from "lottie-react-native";

type Props = {
  onPress: () => void;
  lottieSource: any;
};

export const UnitSuggestionButton: React.FC<Props> = ({ onPress, lottieSource }) => (
  <Button
    mode="contained"
    compact
    onPress={onPress}
    style={styles.suggestionButtonCustom}
    labelStyle={styles.suggestionButtonLabel}
    contentStyle={styles.suggestionButtonContent}
  >
    <LottieView
      source={lottieSource}
      autoPlay
      loop
      style={styles.suggestionLottieLarge}
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
  },
  suggestionLottieLarge: {
    width: 26,
    height: 26,
  },
});