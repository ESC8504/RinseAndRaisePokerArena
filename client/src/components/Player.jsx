import React, { useRef, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Animated, PanResponder, Image } from 'react-native';
import cards from '../../../assets/cards/index.js';
import Card from './Card.jsx';

function Player({ playerData, isCurrentPlayer }) {
  // Use a reference to store the Animated values for X and Y positions.
  const animatedValues = useRef(new Animated.ValueXY()).current;
  // Array of refs hold Value for each card, initially set to -200 (outside of the screen).
  const cardAnimationRefs = useRef([]).current;
  // Check if the ref for that card already exists. If it doesn't, create it
  for (let i = 0; i < playerData.cards.length; i += 1) {
    if (!cardAnimationRefs[i]) {
      cardAnimationRefs[i] = new Animated.Value(-200);
    }
  }

  useEffect(() => {
    // Add this to aviod bug with cards not coming down in the first render
    if (playerData.cards) {
      // Execute animations in a staggered mannser delay 200ms each card
      Animated.stagger(200, cardAnimationRefs.map((animation) =>
        // Spring to final postion
        Animated.spring(animation, {
          // -200 to 0
          toValue: 0,
          // how quick it bounce
          tension: 20,
          // how bounce it really is, lower = more bounce
          friction: 3,
          useNativeDriver: true,
        }),
      )).start();
    }
  }, [playerData.cards]);
  // Create a PanResponder to handle touch gestures.
  const panResponder = PanResponder.create({
    // Allow the responder to be the target.
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: Animated.event(
      // Update the x value of pan on movement.
      [null, { dx: animatedValues.x }],
      // set native value to false (dont use native driver for this animation)
      { useNativeDriver: false },
    ),
    onPanResponderRelease: () => {
      // When gesture ends, set pan value back to its initial state (front end of poker cards)
      Animated.spring(animatedValues, {
        toValue: { x: 0, y: 0 },
        useNativeDriver: false,
      }).start();
    },
  });
  return (
    <View style={styles.player} {...panResponder.panHandlers}>
      <Text style={styles.indicator}>Amount In Front: {playerData.amountInFront}</Text>
      {/* conditional redenring */}
      {isCurrentPlayer && <Text style={styles.indicator}>Your Turn</Text>}
      <View style={styles.cardsContainer}>
        {playerData.cards.map((card, i) => (
          <Animated.View key={i} style={{ transform: [{ translateY: cardAnimationRefs[i] }] }}>
            <Card cardCode={card} animatedValue={animatedValues.x} />
          </Animated.View>
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
    backgroundColor: 'red'
  },
  cardsContainer: {
    flexDirection: 'row',
  },
  indicator: {
    fontWeight: 'bold',
    backgroundColor: 'yellow',
    padding: 5,
    borderRadius: 5,
  },
});

export default Player;
