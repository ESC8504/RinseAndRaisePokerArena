import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

function HomeScreen() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Welcome to Poker Heads Up</Text>

      <View style={styles.middleButtonsContainer}>
        <Button mode="contained" onPress={() => navigation.navigate('GameVsAiScreen')}>
          Play Poker
        </Button>
        <Button style={styles.playerVsPlayerButton} mode="outlined" onPress={() => navigation.navigate('PlayerVsPlayer')}>
          Player vs Player
        </Button>
      </View>

      <View style={styles.bottomButtonsContainer}>
        <Button mode="text" onPress={() => navigation.navigate('Rules')}>
          Rules
        </Button>
        <Button mode="text" onPress={() => navigation.navigate('Help')}>
          Help
        </Button>
        <Button mode="text" onPress={() => navigation.navigate('Settings')}>
          Settings
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 50,
  },
  welcomeText: {
    fontSize: 24,
    marginBottom: 20,
  },
  middleButtonsContainer: {
    flex: 1,
    justifyContent: 'center',
    width: '100%',
    alignItems: 'center'
  },
  playerVsPlayerButton: {
    marginTop: 10,
  },
  bottomButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
  },
});

export default HomeScreen;
