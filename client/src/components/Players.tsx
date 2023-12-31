import React, { useRef, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Animated, PanResponder, Image, Modal, Button } from 'react-native';
import cards from '../../../assets/cards/index';
import dealerButton from '../../../assets/dealer_button.png';
import chipsImage from '../../../assets/chips.png';
import Card from './Card';
import GameSlider from './GameSlider'
import GameControls from './GameControls';
import { useDispatch, useSelector } from 'react-redux';
import { Player, GameState, Blinds } from '../state/gameinitialstate';
import {
  call,
  fold,
  resetToPreflop,
  dealCards,
  check,
  raise,
  postBlinds,
  restartGame,
} from '../state/gameSlice';

interface PlayersProps {
  playerData: Player;
  gameBlinds: Blinds;
  position: 'top' | 'bottom';
}

const Players: React.FC<PlayersProps> = ({ playerData, gameBlinds, position }) => {
  const dispatch = useDispatch();
  const gameState = useSelector((state: { game: GameState }) => state.game);
  const currentPlayerData = gameState.players[gameState.currentPlayerIndex];
  const opponentIndex = gameState.currentPlayerIndex === 0 ? 1 : 0;
  const opponentData = gameState.players[opponentIndex];

  const isCurrentPlayer = gameState.currentPlayerIndex === (position === 'top' ? 0 : 1);
  const [isSliderVisible, setSliderVisible] = useState<boolean>(false);
  const [sliderValue, setSliderValue] = useState<number>(0);
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
    dispatch(call());
  };

  const handleFold = () => {
    dispatch(fold());
    dispatch(resetToPreflop())
  };

  const handleCheck = () => {
    dispatch(check());
  };

  const handleRaise = () => {
    setSliderVisible(true);
  }

  const handleRaiseSliderConfirm = (value) => {
    dispatch(raise(value));
    setSliderVisible(false);
  };

  const handleSliderCancel = () => {
    setSliderVisible(false);
  };

  const handleBet = () => {
    setSliderVisible(true);
  };

  const handleBetSliderConfirm = (value) => {
    dispatch(raise(value));
    setSliderVisible(false);
  };

  const handleNextHand = () => {
    dispatch(resetToPreflop());
  };

  const handleRestartGame = () => {
    dispatch(restartGame());
    dispatch(dealCards());
    dispatch(postBlinds());
  };

  const playerStyle = position === 'top' ? styles.topPlayer : styles.bottomPlayer;

  // const opponentIndex = gameState.currentPlayerIndex === 0 ? 1 : 0;
  const opponentAmountInFront = gameState.players[opponentIndex].amountInFront;

  // Get the result for the current player from the gameState
  let playerResultHand = '';
  let playerBestHand = '';
  if (gameState.round === 'showdown' && gameState.players) {
    const playerResult = gameState.players.find((p) => p.cards.join(',') === playerData.cards.join(','));
    if (playerResult) {
      playerResultHand = playerResult.handResult || '';
      playerBestHand = playerResult.bestHand || '';
    }
  }

  const playerIndex = position === 'top' ? 0 : 1;

  const isSmallBlindPlayer = gameState.blinds.smallBlindPlayerIndex === playerIndex;
  return (
    <>
      <View style={[styles.player, playerStyle]} {...panResponder.panHandlers}>
        {/* conditional rendering */}
        {playerData.amountInFront > 0 && (
          <View style={styles.chipContainer}>
            <Image source={chipsImage} style={styles.chipsImage} />
            <Text style={styles.chipText}>{playerData.amountInFront}</Text>
          </View>
        )}

        <View style={styles.cardsAndControlsContainer}>
          <View style={styles.cardsContainer}>
            {playerData.cards.map((card, i) => (
              <Animated.View key={i} style={{ transform: [{ translateY: cardAnimationRefs[i] }] }}>
                <Card cardCode={card} animatedValue={animatedValues.x} />
              </Animated.View>
            ))}
          </View>

          {isSmallBlindPlayer && (
            <Image source={dealerButton} style={styles.dealerButton} />
          )}

          {isCurrentPlayer && (
            <View style={styles.gameControls}>
              <GameControls
                onCall={handleCall}
                onFold={handleFold}
                onCheck={handleCheck}
                onRaise={handleRaise}
                onBet={handleBet}
                onNextHand={handleNextHand}
                onRestartGame={handleRestartGame}
              />
            </View>
          )}
        </View>

        <Text style={styles.whiteText}>Chips: {playerData.chips}</Text>
        {/* <Text style={styles.whiteText}>Current Bet: {playerData.currentBet}</Text> */}
        {/* <Text style={styles.whiteText}>Status: {playerData.status}</Text> */}
        { gameState.round === 'showdown' && (
          <>
            <Text style={styles.whiteText}>Result Hand: {playerResultHand}</Text>
            <Text style={styles.whiteText}>Best Five Cards : {playerBestHand}</Text>
          </>
        )}

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
    width: '100%',
    alignSelf: 'center',
    transform: [{ rotate: '180deg' }],
  },
  bottomPlayer: {
    padding: 10,
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
  whiteText: {
    color: 'white',
  },
  dealerButton: {
    width: 40,
    height: 40,
  },
  chipContainer: {
    position: 'relative',
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft:20,
    marginRight: 20,
    marginBottom: 10,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: 'grey',
    overflow: 'hidden',
  },
  chipsImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  chipText: {
    position: 'absolute',
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
});

export default Players;
