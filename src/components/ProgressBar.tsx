import React from 'react';
import { View, StyleSheet } from 'react-native';

type ProgressBarProps = {
  progress: number; // de 0 a 100
};

export const ProgressBar: React.FC<ProgressBarProps> = ({ progress }) => {
  return (
    <View style={styles.container}>
      <View style={[styles.progress, { width: `${progress}%` }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 4,
    backgroundColor: '#E5E5E5',
    borderRadius: 2,
    marginVertical: 10,
  },
  progress: {
    height: '100%',
    backgroundColor: '#4B3FFE',
    borderRadius: 2,
  },
});
