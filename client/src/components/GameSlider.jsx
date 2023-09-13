import React, { useState, useEffect } from 'react';
import { View, Text, Modal, Button, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';
import { useGameState } from '../contexts/GameStateContext.jsx';

function GameSlider({ isVisible, onConfirm, onCancel, maxChips, bigBlind, playerAmountInFront,
  opponentAmountInFront }) {
  const { gameState, isPreFlop, isCurrentPlayerSmallBlind } = useGameState();

  const isSmallBlindPreFlop = isPreFlop && isCurrentPlayerSmallBlind;
  // Calculation for minimum raise value
  let minValue;
  if (isSmallBlindPreFlop) {
    // only for small blind preflop player
    minValue = bigBlind + playerAmountInFront;
  } else {
    // min raise increment
    minValue = (opponentAmountInFront - playerAmountInFront) * 2;
  }
  // Ensure min Raise Value is at least equal to bigBlind
  minValue = Math.max(minValue, bigBlind);

  const [sliderValue, setSliderValue] = useState(minValue);

  useEffect(() => {
    if (isVisible) {
      setSliderValue(minValue);
    }
  }, [isVisible]);

  return (
    <Modal
      animationType="slide"
      transparent
      visible={isVisible}
    >
      <View style={styles.container}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Choose Raise Amount</Text>
          <Slider
            maximumValue={maxChips}
            minimumValue={minValue}
            step={bigBlind}
            value={sliderValue}
            onValueChange={(value) => setSliderValue(Math.floor(value))}
          />
          <Text style={styles.selectedValue}>Selected Value: {sliderValue}</Text>
          <Button title="Confirm" onPress={() => onConfirm(sliderValue)} />
          <Button title="Cancel" onPress={onCancel} />
        </View>
      </View>
    </Modal>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: 300,
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  selectedValue: {
    marginTop: 10,
    marginBottom: 10,
  },
});
export default GameSlider;
