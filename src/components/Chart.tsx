import { BarChart, PieChart } from "react-native-chart-kit";
import { Dimensions, View, StyleSheet, Text, Animated } from "react-native";
import { getColorByIndex } from "../utils/getColorByIndex";
import React, { useRef, useEffect } from "react";

const screenWidth = Dimensions.get("window").width;

type Props = {
  label: string[];
  data: number[];
  chartType?: "bar" | "pie";
};

export default function BarsChart({ label, data, chartType = "bar" }: Props) {
  const total = data.reduce((sum, v) => sum + v, 0);
  const max = Math.max(...data);
  const min = Math.min(...data);

  const yLabels =
    max === min
      ? [min, min + 1, min + 2, min + 3, min + 4]
      : Array.from({ length: 5 }, (_, i) => min + ((max - min) * i) / 4);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    fadeAnim.setValue(0);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [chartType, label, data]);

  const colors = label.map((_, idx) => getColorByIndex(idx));

  return (
    <Animated.View style={[styles.card, { opacity: fadeAnim }]}>
      {chartType === "bar" ? (
        <BarChart
          data={{
            labels: label,
            datasets: [
              {
                data: data,
                colors: colors.map((color) => () => color),
              },
            ],
          }}
          width={Math.min(screenWidth * 0.8, 380)}
          height={230}
          segments={4}
          fromZero
          showValuesOnTopOfBars
          withInnerLines
          yAxisSuffix={""}
          yAxisLabel={""}
          style={{
            borderRadius: 12,
          }}
          chartConfig={{
            backgroundColor: "transparent",
            backgroundGradientFrom: "#FFFFFF",
            backgroundGradientTo: "#FFFFFF",
            decimalPlaces: 0,
            color: (opacity = 1, index) => getColorByIndex(index ?? 0),
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            propsForBackgroundLines: {
              strokeDasharray: "",
              stroke: "#e3e3e3",
            },
            propsForLabels: {
              fontSize: 13,
            },
            formatYLabel: (yValue) => {
              const y = Number(yValue);
              if (max <= 20) {
                return String(y);
              } else if (max <= 60) {
                return y % 10 === 0 ? String(y) : "";
              } else {
                return y % 20 === 0 ? String(y) : "";
              }
            },
          }}
        />
      ) : (
        <PieChart
          data={label.map((item, idx) => ({
            name: item,
            population: data[idx],
            color: getColorByIndex(idx),
            legendFontColor: "#333",
            legendFontSize: 14,
          }))}
          width={Math.min(screenWidth * 0.8, 320)}
          height={200}
          chartConfig={{
            color: () => "#F44336",
          }}
          accessor={"population"}
          backgroundColor={"transparent"}
          paddingLeft={"10"}
          absolute
        />
      )}
      <View style={styles.legendContainer}>
        {label.map((item, idx) => {
          const percent = total > 0 ? Math.round((data[idx] / total) * 100) : 0;
          const color = getColorByIndex(idx);
          return (
            <View
              key={item}
              style={[
                styles.legendCard,
                {
                  borderColor: color,
                  shadowColor: color,
                  backgroundColor: "#fff",
                },
              ]}
            >
              <View style={styles.legendRow}>
                <Text style={[styles.legendLabel, { color }]}>{item}</Text>
                <Text style={styles.legendSeparator}>|</Text>
                <Text style={styles.legendValue}>{data[idx]}</Text>
                <Text style={styles.legendSeparator}>|</Text>
                <Text style={styles.legendPercent}>{percent}%</Text>
              </View>
            </View>
          );
        })}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#1976D2",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 6,
    borderWidth: 2,
    borderColor: "black",
    alignItems: "center",
    marginBottom: 24,
  },
  legendContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginTop: 18,
    width: "100%",
  },
  legendCard: {
    backgroundColor: "#fff",
    borderWidth: 1.5,
    borderRadius: 10,
    paddingVertical: 6,
    paddingHorizontal: 14,
    marginRight: 12,
    marginBottom: 10,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 3,
  },
  legendRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  legendLabel: {
    fontSize: 15,
    fontWeight: "bold",
    marginRight: 4,
  },
  legendValue: {
    fontSize: 15,
    color: "#333",
    marginLeft: 4,
    marginRight: 4,
    fontWeight: "bold",
  },
  legendPercent: {
    fontSize: 15,
    color: "#888",
    marginLeft: 4,
    fontWeight: "bold",
  },
  legendSeparator: {
    fontSize: 15,
    color: "#bbb",
    marginHorizontal: 4,
    fontWeight: "bold",
  },
});
