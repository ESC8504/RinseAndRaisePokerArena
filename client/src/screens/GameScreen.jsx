import React, { useEffect, useState } from 'react';
import { ImageBackground, View, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import axiosApi from '../../../config.js';
import Player from '../components/Player.jsx';
import Table from '../components/Table.jsx';
import { useDispatch, useSelector } from 'react-redux';
import {
  dealCards,
  postBlinds,
  restartGame,
  calWinner,
} from '../state/gameSlice.js';

function GameScreen() {
  const dispatch = useDispatch();
  const gameState = useSelector(state => state.game);
  // This useEffect hook is used to dispatch the actions when the GameScreen component mounts.
  useEffect(() => {
    dispatch(dealCards());
    dispatch(postBlinds());
    return () => {
      dispatch(restartGame());
    };
  }, [dispatch]);
  // To keep track if the showdown round has already triggered the API call
  const [hasShowdownHappend, setHasShowdownHappend] = useState(false);
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
      <Player
        playerData={gameState.players[0]}
        gameBlinds={gameState.blinds}
        isCurrentPlayer={gameState.currentPlayerIndex === 0}
        position="top"
      />
      <Table communityCards={gameState.communityCards} pot={gameState.pot} />
      <Player
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
