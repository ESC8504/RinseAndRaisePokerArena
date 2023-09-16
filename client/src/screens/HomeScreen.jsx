import React, { useEffect } from 'react';
import { View, StyleSheet, ImageBackground, Image } from 'react-native';
import { Asset } from 'expo-asset';
import { Button, Text } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

const background = require('../../../assets/front_screen.jpg');

function HomeScreen() {
  const navigation = useNavigation();
  // Preload background image
  const preload = async () => {
    await Asset.loadAsync([
      background,
    ]);
  };
  useEffect(() => {
    preload();
  }, []);

  return (
    <ImageBackground source={background} style={styles.container}>
      <Image source={require('../../../assets/front_poker.png')} style={styles.welcomeImage} />

      <View style={styles.middleButtonsContainer}>
        <Button
          mode="contained"
          style={[styles.middleButton, styles.transparentButton]}
          onPress={() => navigation.navigate('GameVsAiScreen')}
        >
          Play Poker
        </Button>
        <Button
          mode="contained"
          style={[styles.middleButton, styles.transparentButton]}
          onPress={() => navigation.navigate('PlayerVsPlayer')}
        >
          Player vs Player
        </Button>
      </View>

      <View style={styles.bottomButtonsContainer}>
        <Button mode="contained" onPress={() => navigation.navigate('Rules')}>
          Rules
        </Button>
        <Button mode="contained" onPress={() => navigation.navigate('Help')}>
          Help
        </Button>
        <Button mode="contained" onPress={() => navigation.navigate('Settings')}>
          Settings
        </Button>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingBottom: 50,
  },
  welcomeImage: {
    width: 250,
    height: 200,
    marginTop: 50,
  },
  middleButtonsContainer: {
    justifyContent: 'center',
    width: '100%',
    marginTop: 100,
    alignItems: 'center',
  },
  playerVsPlayerButton: {
    marginTop: 10,
  },
  bottomButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
  },
  middleButton: {
    marginTop: 30,
    width: '60%',
    paddingVertical: 10,
  },
});

export default HomeScreen;
