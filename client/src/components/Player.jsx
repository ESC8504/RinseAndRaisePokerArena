import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import cards from '../../../assets/cards/index.js';

function Player({ playerData }) {
  return (
    <View style={styles.player}>
      <View style={styles.cardsContainer}>
        {playerData.cards.map((card, i) => (
          <Image key={i} source={cards[card]} style={styles.card} />
        ))}
      </View>
      <Text>Chips: {playerData.chips}</Text>
      <Text>Current Bet: {playerData.currentBet}</Text>
      <Text>Status: {playerData.status}</Text>
      {/* Going to add action button here probably */}
    </View>
  );
}

const styles = StyleSheet.create({
  player: {
    padding: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    width: 200,
  },
  card: {
    width: 50,
    height: 70,
    margin: 2,
    backgroundColor: 'red',
  },
  cardsContainer: {
    flexDirection: 'row',
  }
});

export default Player;
