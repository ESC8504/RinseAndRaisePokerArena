import React from 'react';
import { StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import { useGameState } from '../contexts/GameStateContext.jsx';


function GameControls({ onCall, onFold, onCheck, onRaise, onBet, onNextHand, onRestartGame }) {
  const { gameState } = useGameState();

  const currentPlayer = gameState.players[gameState.currentPlayerIndex];
  const opponentIndex = gameState.currentPlayerIndex === 0 ? 1 : 0;
  const opponentPlayer = gameState.players[opponentIndex];

  const canShowCallAndRaise = currentPlayer.amountInFront < opponentPlayer.amountInFront;
  const canShowCheck = (
    currentPlayer.amountInFront === opponentPlayer.amountInFront
    && (gameState.round !== 'pre-flop'
    || gameState.currentPlayerIndex === gameState.blinds.bigBlindPlayerIndex)
  );
  const isBigBlindPreFlop = (
    gameState.round === 'pre-flop'
    && gameState.currentPlayerIndex === gameState.blinds.bigBlindPlayerIndex
  );
  // If it can't show call and raise it means the player can bet
  const canShowBet = !canShowCallAndRaise && !isBigBlindPreFlop;

  const isPlayerOutOfChips = gameState.players.some((player) => player.chips <= 0);
  // The is a bug right now, might introduce a new round or something else
  // if they chop at showdown and get money back it's going to be a problem
  if (gameState.round === 'showdown' && isPlayerOutOfChips) {
    return (
      <Button
        mode="elevated"
        dark
        useForeground
        onPress={onRestartGame}
        style={styles.restartGameButton}
        labelStyle={styles.buttonLabel}
      >
        Restart Game
      </Button>
    );
  }

  if (gameState.round === 'showdown') {
    return (
      <Button
        mode="elevated"
        dark
        useForeground
        onPress={onNextHand}
        style={styles.nextHandButton}
        labelStyle={styles.buttonLabel}
      >
        Next Hand
      </Button>
    );
  }
  return (
    <>
      {canShowCallAndRaise && !isBigBlindPreFlop && (
        <Button
          mode="elevated"
          dark
          useForeground
          onPress={onCall}
          style={styles.callButton}
          labelStyle={styles.buttonLabel}
        >
          Call
        </Button>
      )}
      <Button
        mode="elevated"
        dark
        useForeground
        onPress={onFold}
        style={styles.foldButton}
        labelStyle={styles.buttonLabel}
      >
        Fold
      </Button>
      {canShowCheck && (
        <Button
          mode="elevated"
          dark
          useForeground
          onPress={onCheck}
          style={styles.checkButton}
          labelStyle={styles.buttonLabel}
        >
          Check
        </Button>
      )}
      {canShowBet && (
        <Button
          mode="elevated"
          dark
          useForeground
          onPress={onBet}
          style={styles.betButton}
          labelStyle={styles.buttonLabel}
        >
          Bet
        </Button>
      )}
      {(canShowCallAndRaise || isBigBlindPreFlop) && (
        <Button
          mode="elevated"
          dark
          useForeground
          onPress={onRaise}
          style={styles.raiseButton}
          labelStyle={styles.buttonLabel}
        >
          Raise
        </Button>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  callButton: {
    backgroundColor: '#4CAF50',
    width: '100%',
    paddingVertical: 10,
    borderRadius: 10,
    marginBottom: '5%',
    transform: [{ scale: 1 }],
  },
  foldButton: {
    backgroundColor: '#f44336',
    width: '100%',
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: '5%',
    transform: [{ scale: 1 }],
  },
  checkButton: {
    backgroundColor: '#2196F3',
    width: '100%',
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: '5%',
    transform: [{ scale: 1 }],
  },
  raiseButton: {
    backgroundColor: '#FFC107',
    width: '100%',
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: '5%',
    transform: [{ scale: 1 }],
  },
  betButton: {
    backgroundColor: '#9C27B0',
    width: '100%',
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: '5%',
    transform: [{ scale: 1 }],
  },
  nextHandButton: {
    backgroundColor: '#00BCD4',
    width: '100%',
    height: '45%',
    borderRadius: '70%',
    marginTop: '5%',
    transform: [{ scale: 1.1 }],
    justifyContent: 'center',
  },
  restartGameButton: {
    backgroundColor: '#3F51B5',
    width: '100%',
    height: '45%',
    borderRadius: '70%',
    marginTop: '5%',
    transform: [{ scale: 1.1 }],
    justifyContent: 'center',
  },
  buttonLabel: {
    fontSize: 12,
    color: 'white',
  },
});

export default GameControls;
