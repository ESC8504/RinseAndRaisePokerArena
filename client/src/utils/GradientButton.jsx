import React from 'react';
import { Text, TouchableOpacity, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const GradientButton = ({ onPress, title, style }) => (
  <TouchableOpacity onPress={onPress} style={style}>
    <View style={styles.buttonParent}>
      {/* Blue and green */}
      <LinearGradient colors={['#007991', '#78FFD6']} style={styles.buttonGrad}>
        <Text style={styles.buttonText}>{title}</Text>
      </LinearGradient>
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  buttonGrad: {
    height: 50,
    width: '100%',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonParent: {
    height: 50,
    width: '100%',
    borderRadius: 10,
    backgroundColor: '#024e51',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
  },
});

export default GradientButton;
