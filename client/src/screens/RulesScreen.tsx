import React from 'react';
import { StyleSheet, View, Image } from 'react-native';

const RulesScreen: React.FC = () => {
  return (
    <View>
      <Image
        source={require('../../../assets/ranking.png')}
        style={styles.image}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: '100%',
  },
});

export default RulesScreen;