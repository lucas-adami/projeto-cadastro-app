import React, { useEffect } from 'react';
import { TouchableWithoutFeedback, Animated } from 'react-native';
import { View, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';

const SWITCH_WIDTH = 60;
const SWITCH_HEIGHT = 30;
const CIRCLE_SIZE = 26;

type ThemeSwitchProps = {
  isDarkMode: boolean;
  toggleTheme: () => void;
};

const ThemeSwitch: React.FC<ThemeSwitchProps> = ({ isDarkMode, toggleTheme }) => {
  const position = React.useRef(new Animated.Value(isDarkMode ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(position, {
      toValue: isDarkMode ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [isDarkMode]);

  const circlePosition = position.interpolate({
    inputRange: [0, 1],
    outputRange: [2, SWITCH_WIDTH - CIRCLE_SIZE - 2],
  });

  const backgroundColor = position.interpolate({
    inputRange: [0, 1],
    outputRange: ['#D32719', '#4B5563'], 
  });

  const circleBgColor = isDarkMode ? '#22223b' : '#FFF';

  return (
    <TouchableWithoutFeedback onPress={toggleTheme}>
      <Animated.View style={[styles.switch, { backgroundColor }]}>
        <Animated.View style={[styles.circle, { left: circlePosition, backgroundColor: circleBgColor }]}>
          {isDarkMode ? (
            <Feather name="moon" size={18} color="#FFD700" />
          ) : (
            <Feather name="sun" size={18} color="#D32719" />
          )}
        </Animated.View>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  switch: {
    width: SWITCH_WIDTH,
    height: SWITCH_HEIGHT,
    borderRadius: SWITCH_HEIGHT / 2,
    justifyContent: 'center',
    padding: 2,
  },
  circle: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ThemeSwitch;