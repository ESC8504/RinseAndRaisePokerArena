import React, { useRef, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Animated, PanResponder, Image, Modal, Button } from 'react-native';
import cards from '../../../assets/cards/index.js';
import Card from './Card.jsx';
import GameSlider from './GameSlider.jsx'
import GameControls from './GameControls.jsx';
import { useGameState } from '../contexts/GameStateContext.jsx';

function Player({ playerData, gameBlinds, position }) {
  const { gameState, dispatch, currentPlayerData, opponentData } = useGameState();
  const isCurrentPlayer = gameState.currentPlayerIndex === (position === 'top' ? 0 : 1);
  const [isSliderVisible, setSliderVisible] = useState(false);
  const [sliderValue, setSliderValue] = useState(0);
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
    // Reset animated values back to -100
    cardAnimationRefs.forEach((animation) => animation.setValue(-100));
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

  const handleCall = () => {
    dispatch({ type: 'CALL' });
  };

  const handleFold = () => {
    dispatch({ type: 'FOLD' });
    dispatch({ type: 'ROTATE_BLINDS' });
    dispatch({ type: 'RESHUFFLE' });
    dispatch({ type: 'DEAL_CARDS' });
  };

  const handleCheck = () => {
    dispatch({ type: 'CHECK' });
  };

  const handleRaise = () => {
    setSliderVisible(true);
  }

  const handleRaiseSliderConfirm = (value) => {
    dispatch({ type: 'RAISE', payload: value });
    setSliderVisible(false);
  };

  const handleSliderCancel = () => {
    setSliderVisible(false);
  };

  const handleBet = () => {
    setSliderVisible(true);
  };

  const handleBetSliderConfirm = (value) => {
    dispatch({ type: 'RAISE', payload: value });
    setSliderVisible(false);
  };

  const playerStyle = position === 'top' ? styles.topPlayer : styles.bottomPlayer;

  const opponentIndex = gameState.currentPlayerIndex === 0 ? 1 : 0;
  const opponentAmountInFront = gameState.players[opponentIndex].amountInFront;

  return (
    <>
      <View style={[styles.player, playerStyle]} {...panResponder.panHandlers}>
        <Text style={styles.indicator}>Amount In Front: {playerData.amountInFront}</Text>
        {/* conditional rendering */}
        {isCurrentPlayer && <Text style={styles.indicator}>Your Turn</Text>}

        <View style={styles.cardsAndControlsContainer}>
          <View style={styles.cardsContainer}>
            {playerData.cards.map((card, i) => (
              <Animated.View key={i} style={{ transform: [{ translateY: cardAnimationRefs[i] }] }}>
                <Card cardCode={card} animatedValue={animatedValues.x} />
              </Animated.View>
            ))}
          </View>

          {isCurrentPlayer && (
            <View style={styles.gameControls}>
              <GameControls
                onCall={handleCall}
                onFold={handleFold}
                onCheck={handleCheck}
                onRaise={handleRaise}
                onBet={handleBet}
              />
            </View>
          )}
        </View>

        <Text>Chips: {playerData.chips}</Text>
        <Text>Current Bet: {playerData.currentBet}</Text>
        <Text>Status: {playerData.status}</Text>
      </View>
      <GameSlider
        isVisible={isSliderVisible}
        onConfirm={handleRaiseSliderConfirm}
        onCancel={handleSliderCancel}
        maxChips={playerData.chips}
        bigBlind={gameBlinds.big}
        playerAmountInFront={playerData.amountInFront}
        opponentAmountInFront={opponentAmountInFront}
      />
      <GameSlider
        isVisible={isSliderVisible}
        onConfirm={handleBetSliderConfirm}
        onCancel={handleSliderCancel}
        maxChips={playerData.chips}
        bigBlind={gameBlinds.big}
        playerAmountInFront={playerData.amountInFront}
        opponentAmountInFront={opponentAmountInFront}
      />
    </>
  );
}

const styles = StyleSheet.create({
  topPlayer: {
    padding: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    width: '100%',
    alignSelf: 'center',
    transform: [{ rotate: '180deg' }],
  },
  bottomPlayer: {
    padding: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    width: '100%',
    alignSelf: 'center',
  },
  cardsContainer: {
    flex: 3,
    flexDirection: 'row',
  },
  indicator: {
    fontWeight: 'bold',
    backgroundColor: 'yellow',
    padding: 5,
    borderRadius: 5,
  },
  cardsAndControlsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});

export default Player;
