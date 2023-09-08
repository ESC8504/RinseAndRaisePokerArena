import React from 'react';
import { View, Alert, NativeModules, StyleSheet } from 'react-native';
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
    <View style={styles.container}>
      <Text style={styles.gameText}>Select Multiplayer Mode</Text>
      <View style={styles.buttonContainer}>
        <Button mode="contained" onPress={handleGameCenter}>
          GameCenter Multiplayer
        </Button>
      </View>
      <View style={styles.buttonContainer}>
        <Button mode="outlined" onPress={handleBluetooth}>
          Bluetooth Local Multiplayer
        </Button>
      </View>
      <View style={styles.buttonContainer}>
        <Button mode="text" onPress={handleSharePhone}>
          Sharing this iPhone
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
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
