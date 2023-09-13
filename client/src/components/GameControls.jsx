import React from 'react';
import { StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import { useGameState } from '../contexts/GameStateContext.jsx';

function GameControls({ onCall, onFold, onCheck, onRaise }) {
  const { gameState } = useGameState();

  const currentPlayer = gameState.players[gameState.currentPlayerIndex];
  const opponentIndex = gameState.currentPlayerIndex === 0 ? 1 : 0;
  const opponentPlayer = gameState.players[opponentIndex];

  const canShowCall = currentPlayer.amountInFront < opponentPlayer.amountInFront;
  const canShowCheck = (
    currentPlayer.amountInFront === opponentPlayer.amountInFront
    && (gameState.round !== 'pre-flop'
    || gameState.currentPlayerIndex === gameState.blinds.bigBlindPlayerIndex)
  );
  return (
    <>
      {canShowCall && (
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
    marginBottom: '5%',
    transform: [{ scale: 1 }],
  },
  checkButton: {
    backgroundColor: '#2196F3',
    width: '100%',
    paddingVertical: 10,
    borderRadius: 10,
    marginBottom: '5%',
    transform: [{ scale: 1 }],
  },
  raiseButton: {
    backgroundColor: '#FFC107',
    width: '100%',
    paddingVertical: 10,
    borderRadius: 10,
    marginBottom: '5%',
    transform: [{ scale: 1 }],
  },
  buttonLabel: {
    fontSize: 12,
    color: 'white',
  },
});

export default GameControls;
