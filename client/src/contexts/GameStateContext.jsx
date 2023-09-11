import React, { createContext, useState, useContext, useReducer } from 'react';
import { gameReducer, initialState } from '../state/GameReducer.jsx';

const GameStateContext = createContext();

export const GameStateProvider = ({ children }) => {
  const [gameState, dispatch] = useReducer(gameReducer, initialState);

  return (
    <GameStateContext.Provider value={{ gameState, dispatch }}>
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
