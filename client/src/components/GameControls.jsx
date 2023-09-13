import React from 'react';
import { StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';

function GameControls({ onCall, onFold }) {
  return (
    <>
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
    </>
  );
}

const styles = StyleSheet.create({
  callButton: {
    backgroundColor: '#4CAF50',
    width: '50%',
    paddingVertical: 10,
    borderRadius: 10,
    marginBottom: '5%',
    transform: [{ scale: 1 }],
  },
  foldButton: {
    backgroundColor: '#f44336',
    width: '50%',
    paddingVertical: 10,
    borderRadius: 10,
    transform: [{ scale: 1 }],
  },
  buttonLabel: {
    fontSize: 7,
    color: 'white',
  },
});

export default GameControls;
