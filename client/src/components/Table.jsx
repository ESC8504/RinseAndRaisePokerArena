import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

function Table({ communityCards, pot }) {
  return (
    <View style={styles.table}>
      <View style={styles.cardsContainer}>
        {communityCards.map((card, i) => (
          <Image key={i} source={cards[card]} style={styles.card} />
        ))}
      </View>
      <Text>Pot: {pot}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  table: {
    padding: 20,
    borderColor: '#ccc',
    borderWidth: 1,
    width: 300,
    alignItems: 'center',
  },
  card: {
    width: 50,
    height: 70,
    margin: 2,
  },
  cardsContainer: {
    flexDirection: 'row',
  },
});

export default Table;
