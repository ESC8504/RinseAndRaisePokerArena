import {
  DEAL_CARDS,
  BET,
  CALL,
  RAISE,
  FOLD,
  WIN_ROUND,
  PROCEED_TO_NEXT_ROUND,
  RESTART_GAME,
} from './GameActions.jsx';

const CARD_VALUES = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
const CARD_SUITS = ['S', 'H', 'D', 'C'];

const initializeDeck = () => {
  let deck = [];
  for (let value of CARD_VALUES) {
    for (let suit of CARD_SUITS) {
      deck.push(value + suit);
    }
  }
  return deck;
};

export const fisherYatesShuffle = (deck) => {
  let shuffled = [...deck];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const dealCardsFromDeck = (deck, numberOfCards) => {
  const dealtCards = deck.slice(0, numberOfCards);
  const remainingDeck = deck.slice(numberOfCards);
  return { dealtCards, remainingDeck };
};

export const initialState = {
  currentPlayer: 'player1ID',
  player1: {
    id: 'player1ID',
    cards: [],
    chips: 1000,
    currentBet: 0,
    moves: [],
    status: 'active',
    isCardsFaceUp: false,
  },
  player2: {
    id: 'player2ID',
    cards: [],
    chips: 1000,
    currentBet: 0,
    moves: [],
    status: 'active',
    isCardsFaceUp: false,
  },
  communityCards: [],
  pot: 0,
  round: 'pre-flop',
  blinds: {
    small: 10,
    big: 20,
    current: 'player1ID'
  },
  deck: initializeDeck(),
};

export const gameReducer = (state, action) => {
  switch (action.type) {
    case DEAL_CARDS: {
      let shuffledDeck = fisherYatesShuffle(state.deck);
      let player1Deal = dealCardsFromDeck(shuffledDeck, 2);
      let player2Deal = dealCardsFromDeck(player1Deal.remainingDeck, 2);

      return {
        ...state,
        player1: {
          ...state.player1,
          cards: player1Deal.dealtCards
        },
        player2: {
          ...state.player2,
          cards: player2Deal.dealtCards
        },
        deck: player2Deal.remainingDeck,
        communityCards: [],
      };
    }
    case BET: {
      const currentPlayerData = state[action.playerId];
      if (currentPlayerData.chips < action.amount) {
        console.error("Player doesn't have enough chips to bet this amount.");
        return state;
      }

      return {
        ...state,
        pot: state.pot + action.amount,
        [action.playerId]: {
          ...currentPlayerData,
          chips: currentPlayerData.chips - action.amount,
          currentBet: action.amount,
          moves: [...currentPlayerData.moves, { type: 'BET', amount: action.amount }]
        }
      };
    }
    case CALL: {
      const currentPlayerId = state.currentPlayer;
      const otherPlayerId = currentPlayerId === 'player1ID' ? 'player2ID' : 'player1ID';
      const highestBet = Math.max(state.player1.currentBet, state.player2.currentBet);
      const callAmount = highestBet - state[currentPlayerId].currentBet;

      return {
        ...state,
        [currentPlayerId]: {
          ...state[currentPlayerId],
          chips: state[currentPlayerId].chips - callAmount,
          currentBet: highestBet,
          moves: [...state[currentPlayerId].moves, 'call']
        },
        pot: state.pot + callAmount
      };
    }

    case PROCEED_TO_NEXT_ROUND: {
      let nextRound = '';
      let newCommunityCards = [...state.communityCards];
      let remainingDeck = [...state.deck];
      let dealtCards = [];

      switch (state.round) {
        case 'pre-flop':
          nextRound = 'flop';
          ({ dealtCards, remainingDeck } = dealCardsFromDeck(remainingDeck, 3));
          newCommunityCards = [...newCommunityCards, ...dealtCards];
          break;
        case 'flop':
          nextRound = 'turn';
          ({ dealtCards, remainingDeck } = dealCardsFromDeck(remainingDeck, 1));
          newCommunityCards = [...newCommunityCards, ...dealtCards];
          break;
        case 'turn':
          nextRound = 'river';
          ({ dealtCards, remainingDeck } = dealCardsFromDeck(remainingDeck, 1));
          newCommunityCards = [...newCommunityCards, ...dealtCards];
          break;
        case 'river':
          nextRound = 'showdown';
          break;
        default:
          break;
      }
      let isCardsFaceUp = state.round === 'river' ? true : false;
      return {
        ...state,
        communityCards: newCommunityCards,
        round: nextRound,
        deck: remainingDeck,
        currentPlayer: state.currentPlayer === 'player1ID' ? 'player2ID' : 'player1ID',
        player1: {
          ...state.player1,
          currentBet: 0,
          isCardsFaceUp,
        },
        player2: {
          ...state.player2,
          currentBet: 0,
          isCardsFaceUp,
        },
      };
    }
    case RESTART_GAME: {
      return {
        ...initialState,
        deck: initializeDeck(),
      };
    }
    default:
      return state;
  }
};

