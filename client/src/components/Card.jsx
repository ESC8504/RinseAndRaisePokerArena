import React, { useRef, useState } from 'react';
import { Animated, Image, StyleSheet } from 'react-native';
import cards from '../../../assets/cards/index.js';

function Card({ cardCode, isFaceUp, animatedValue }) {
  // Define opacity transition for the back of the card,
  // depending on animatedValue (pan gesture's x coordinate).
  const cardOpacity = animatedValue.interpolate({
    inputRange: [-50, 0, 50],
    outputRange: [0, 1, 0],
    extrapolate: 'clamp'
});

  return (
    <Animated.View style={styles.container}>
      <Animated.Image
        source={cards[cardCode]}
        style={styles.card}
      />
      <Animated.View
        style={[styles.card, styles.cardBack, { opacity: cardOpacity }]}
      >
        <Image source={cards.BACK} style={styles.card} />
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 100,
    height: 140,
    margin: 2,
    overflow: 'hidden'
  },
  card: {
    // both front and back images take the full width and height
    ...StyleSheet.absoluteFillObject,
    width: undefined,
    height: undefined
  },
  cardBack: {
    // to absolute stack on top of front
    position: 'absolute',
    top: 0,
    left: 0
  }
});

export default Card;