import React from 'react';
import { View, Alert, NativeModules, StyleSheet, ImageBackground } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

function PlayerVsPlayerScreen() {
  const navigation = useNavigation();

  const handleGameCenter = () => {
    //developing
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
        <Button mode="contained" onPress={handleGameCenter}>
          GameCenter Multiplayer
        </Button>
      </View>
      <View style={styles.buttonContainer}>
        <Button mode="contained" onPress={handleBluetooth}>
          Bluetooth Local Multiplayer
        </Button>
      </View>
      <View style={styles.buttonContainer}>
        <Button mode="contained" onPress={handleSharePhone}>
          Sharing this iPhone
        </Button>
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
    marginBottom: 20,
  },
});

export default PlayerVsPlayerScreen;
