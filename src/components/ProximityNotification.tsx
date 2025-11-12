import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

type Props = {
  unidadeNome: string;
};

const ProximityNotification: React.FC<Props> = ({ unidadeNome }) => (
  <View style={styles.container}>
    <Text style={styles.text}>
      Você está próximo da{'\n'}
      <Text style={styles.unitName}>{unidadeNome}</Text>
    </Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 45,
    right: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingVertical: 8, // reduzido
    paddingHorizontal: 14, // reduzido
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
    zIndex: 999,
    minWidth: 170, // reduzido
    alignItems: 'center',
  },
  text: {
    color: '#222', // preto
    fontSize: 13, // reduzido
    textAlign: 'center',
    marginBottom: 2,
    fontWeight: '600',
  },
  unitName: {
    fontWeight: 'bold',
    color: '#D32719',
    fontSize: 15, // reduzido
    textAlign: 'center',
    marginTop: 1,
  },
});

export default ProximityNotification;