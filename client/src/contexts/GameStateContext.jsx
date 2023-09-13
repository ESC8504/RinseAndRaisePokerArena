import React, { createContext, useState, useContext, useReducer } from 'react';
import { gameReducer, initialState } from '../state/GameReducer.jsx';

const GameStateContext = createContext();

export const GameStateProvider = ({ children }) => {
  const [gameState, dispatch] = useReducer(gameReducer, initialState);
  const isPreFlop = () => gameState.round === 'pre-flop';
  const isCurrentPlayerSmallBlind = () => gameState.currentPlayerIndex === gameState.blinds.smallBlindPlayerIndex;
  const isSmallBlindPreFlop = () => isPreFlop() && isCurrentPlayerSmallBlind();

  const currentPlayerData = gameState.players[gameState.currentPlayerIndex];
  const opponentIndex = gameState.currentPlayerIndex === 0 ? 1 : 0;
  const opponentData = gameState.players[opponentIndex];

  return (
    <GameStateContext.Provider value={{
      gameState,
      dispatch,
      isPreFlop,
      isCurrentPlayerSmallBlind,
      isSmallBlindPreFlop,
      currentPlayerData,
      opponentData
    }}>
      {children}
    </GameStateContext.Provider>
  );
};

export const useGameState = () => {
  const context = useContext(GameStateContext);
  if (context === undefined) {
    throw new Error('Error: useGameState ');
  }
  return context;
};
