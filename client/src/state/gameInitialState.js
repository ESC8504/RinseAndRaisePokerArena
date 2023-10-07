import { initializeDeck } from '../utils/gameHelper.js';

const initialState = {
  players: [
    {
      name: 'Player 1',
      chips: 1000,
      currentBet: 0,
      amountInFront: 0,
      status: 'active',
      cards: [],
      handResult: null,
      bestHand: null,
      isAllIn: false,
    },
    {
      name: 'Player 2',
      chips: 1000,
      currentBet: 0,
      amountInFront: 0,
      status: 'active',
      cards: [],
      handResult: null,
      bestHand: null,
      isAllIn: false,
    },
  ],
  currentPlayerIndex: 0,
  actionsInRound: 0,
  lastActedPlayerIndex: null,
  communityCards: [],
  pot: 0,
  round: 'pre-flop',
  blinds: {
    small: 10,
    big: 20,
    smallBlindPlayerIndex: 0,
    bigBlindPlayerIndex: 1,
  },
  deck: initializeDeck(),
};

export default initialState;