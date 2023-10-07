import React from 'react';
import { View, Alert, NativeModules, StyleSheet, ImageBackground } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import GradientButton from '../utils/GradientButton.jsx';

function PlayerVsPlayerScreen() {
  const navigation = useNavigation();

  const handleGameCenter = () => {
    // developing
  };

  const handleBluetooth = () => {
    // developing
  };

  const handleSharePhone = () => {
    navigation.navigate('Game');
  };

  return (
    <ImageBackground source={require('../../../assets/front_screen.jpg')} style={styles.container}>
      <View style={styles.buttonContainer}>
        <GradientButton
          onPress={handleGameCenter}
          title="GameCenter Multiplayer"
          style={styles.middleButton}
        />
      </View>
      <View style={styles.buttonContainer}>
        <GradientButton
          onPress={handleBluetooth}
          title="Bluetooth Local Multiplayer"
          style={styles.middleButton}
        />
      </View>
      <View style={styles.buttonContainer}>
        <GradientButton
          onPress={handleSharePhone}
          title="Sharing this iPhone"
          style={styles.middleButton}
        />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gameText: {
    fontSize: 24,
    marginBottom: 20,
  },
  buttonContainer: {
    justifyContent: 'center',
    width: '100%',
    alignItems: 'center',
  },
  middleButton: {
    width: '50%',
    marginBottom: 20,
  },
});

export default PlayerVsPlayerScreen;
