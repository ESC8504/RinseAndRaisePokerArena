import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Player from '../components/Player.jsx';
import Table from '../components/Table.jsx';
import { useGameState } from '../contexts/GameStateContext.jsx';

function GameScreen() {
  const { gameState, dispatch } = useGameState();

  // This useEffect hook is used to dispatch the actions when the GameScreen component mounts.
  useEffect(() => {
    dispatch({ type: 'DEAL_CARDS' });
    dispatch({ type: 'POST_BLINDS' });
    return () => {
      dispatch({ type: 'RESTART_GAME' });
    };
  }, [dispatch]);

  return (
    <View style={styles.game}>
      <Player
        playerData={gameState.players[0]}
        isCurrentPlayer={gameState.currentPlayerIndex === 0}
      />
      <Table communityCards={gameState.communityCards} pot={gameState.pot} />
      <Player
        playerData={gameState.players[1]}
        isCurrentPlayer={gameState.currentPlayerIndex === 1}
      />
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
