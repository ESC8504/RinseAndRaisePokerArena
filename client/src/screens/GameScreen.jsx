import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Player from '../components/Player.jsx';
import Table from '../components/Table.jsx';
import { useGameState } from '../contexts/GameStateContext.jsx';

function GameScreen() {
  const { gameState, dispatch } = useGameState();

  // This useEffect hook is used to dispatch the DEAL_CARDS action when the GameScreen component mounts. Without this it will have the same poker cards.
  useEffect(() => {
    dispatch({ type: 'DEAL_CARDS' });
  }, [dispatch]);

  return (
    <View style={styles.game}>
      <Player playerData={gameState.player1} />
      <Table communityCards={gameState.communityCards} pot={gameState.pot} />
      <Player playerData={gameState.player2} />
    </View>
  );
}

const styles = StyleSheet.create({
  game: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
});

export default GameScreen;
