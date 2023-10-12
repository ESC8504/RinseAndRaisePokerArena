import React, { useEffect, useState } from 'react';
import { ImageBackground, View, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import axiosApi from '../../../config.js';
import Players from '../components/Players';
import Table from '../components/Table';
import { Player, GameState, Blinds } from '../state/gameinitialstate';
import { useDispatch, useSelector } from 'react-redux';
import {
  dealCards,
  postBlinds,
  restartGame,
  calWinner,
} from '../state/gameSlice';

const GameScreen: React.FC = () => {
  const dispatch = useDispatch();
  const gameState = useSelector((state: { game: GameState })=> state.game);
  // This useEffect hook is used to dispatch the actions when the GameScreen component mounts.
  useEffect(() => {
    dispatch(dealCards());
    dispatch(postBlinds());
    return () => {
      dispatch(restartGame());
    };
  }, [dispatch]);
  // To keep track if the showdown round has already triggered the API call
  const [hasShowdownHappend, setHasShowdownHappend] = useState<boolean>(false);
  useEffect(() => {
    async function determineWinner() {
      if (gameState.round === 'showdown' && !hasShowdownHappend) {
        setHasShowdownHappend(true);
        const communityCards = gameState.communityCards.join(',');
        const playerCardStrings = gameState.players.map((player) => player.cards.join(',')).join('&pc[]=');

        try {
          const { data: result } = await axiosApi.get('/determineWinner', {
            params: {
              communityCards,
              playerCards: playerCardStrings,
            },
          });
          dispatch(calWinner(result));
        } catch (error) {
          console.error("Error getting the winner data: ", error, error.message, error.config);
        }
      }
    }
    determineWinner();
  }, [gameState.round, gameState.communityCards, gameState.players, dispatch]);
  // reset  showdown trigger state to false to avoid repeat call
  useEffect(() => {
    if (gameState.round !== 'showdown') {
      setHasShowdownHappend(false);
    }
  }, [gameState.round]);
  return (
    <ImageBackground source={require('../../../assets/front_screen.jpg')} style={styles.game}>
      <Players
        playerData={gameState.players[0]}
        gameBlinds={gameState.blinds}
        isCurrentPlayer={gameState.currentPlayerIndex === 0}
        position="top"
      />
      <Table communityCards={gameState.communityCards} pot={gameState.pot} />
      <Players
        playerData={gameState.players[1]}
        gameBlinds={gameState.blinds}
        isCurrentPlayer={gameState.currentPlayerIndex === 1}
        position="bottom"
      />
    </ImageBackground>
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
