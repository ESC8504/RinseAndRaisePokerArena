import { initializeDeck } from '../utils/gameHelper';

export type Player = {
  name: string;
  chips: number;
  currentBet: number;
  amountInFront: number;
  status: any;
  cards: string[];
  handResult: null | string;
  bestHand: null | string;
  isAllIn: boolean;
};

export type Blinds = {
  small: number;
  big: number;
  smallBlindPlayerIndex: number;
  bigBlindPlayerIndex: number;
};

export type GameState = {
  players: Player[];
  currentPlayerIndex: number;
  actionsInRound: number;
  lastActedPlayerIndex: null | number;
  communityCards: string[];
  pot: number;
  round: 'pre-flop' | 'flop' | 'turn' | 'river' | 'showdown';
  blinds: Blinds;
  deck: string[];
};

const initialState: GameState = {
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