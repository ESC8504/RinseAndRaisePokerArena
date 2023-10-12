import React from 'react';
import { View, StyleSheet, Text, ImageBackground } from 'react-native';
import { Video } from 'expo-av';

const AboutScreen: React.FC = () => {
  return (
    <ImageBackground source={require('../../../assets/front_screen.jpg')} style={styles.backgroundImage}>
      <View style={styles.container}>
        <Text style={styles.header}>A Love and Poker Story</Text>
        <Video
            source={require('../../../assets/poker_realtion.mp4')}
            rate={1.0}
            volume={1.0}
            isMuted={false}
            resizeMode="cover"
            playsInSilentLockedModeIOS
            style={styles.video}
            useNativeControls
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
  video: {
    width: '95%',
    height: 250,
    marginBottom: 80,
  },
  backgroundImage: {
    flex: 1,
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'white',
    padding: 10,
  },
});

export default AboutScreen;
