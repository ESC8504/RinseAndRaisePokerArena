import React, { useEffect } from 'react';
import { View, StyleSheet, ImageBackground, Image } from 'react-native';
import { Asset } from 'expo-asset';
import { Button, Text } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import GradientButton from '../utils/GradientButton.jsx';

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
      <Image source={require('../../../assets/rinse_raise.png')} style={styles.welcomeImage} />

      <View style={styles.middleButtonsContainer}>
        <GradientButton
          onPress={() => navigation.navigate('GameVsAiScreen')}
          title="Play Poker"
          style={styles.middleButton}
        />
        <GradientButton
          onPress={() => navigation.navigate('PlayerVsPlayer')}
          title="Player vs Player"
          style={styles.middleButton}
        />
      </View>

      <View style={styles.bottomButtonsContainer}>
        <GradientButton
          onPress={() => navigation.navigate('About')}
          title="About"
          style={styles.bottomButton}
        />
        <GradientButton
          onPress={() => navigation.navigate('Rules')}
          title="Rules"
          style={styles.bottomButton}
        />
        <GradientButton
          onPress={() => navigation.navigate('Settings')}
          title="Settings"
          style={styles.bottomButton}
        />
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
  middleButton: {
    marginTop: 30,
    width: '50%',
  },
  bottomButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '85%',
    marginTop: 30,
  },
  bottomButton: {
    width: '25%',
    marginHorizontal: 10,
    height: 40,
  },
});

export default HomeScreen;
