import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import cards from '../../../assets/cards/index';

interface TableProps {
  communityCards: string[];
  pot: number;
}

const Table: React.FC<TableProps> = ({ communityCards, pot }) => {
  return (
    <View style={styles.table}>
      <View style={styles.cardsContainer}>
        {communityCards.map((card, i) => (
          <Image key={i} source={cards[card]} style={styles.card} />
        ))}
      </View>
      <Text style={styles.whiteText}>Pot: {pot}</Text>
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
    width: 55,
    height: 80,
    margin: 2,
  },
  cardsContainer: {
    flexDirection: 'row',
  },
  whiteText: {
    color: 'white',
  },
});

export default Table;
