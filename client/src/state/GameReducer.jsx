import {
  DEAL_CARDS,
  POST_BLINDS,
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

export const fisherYatesShuffle = (deck) => {
  let shuffled = [...deck];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const initializeDeck = () => {
  let deck = [];
  for (let value of CARD_VALUES) {
    for (let suit of CARD_SUITS) {
      deck.push(value + suit);
    }
  }
  return fisherYatesShuffle(deck);
};

const dealCardsFromDeck = (deck, numberOfCards) => {
  const dealtCards = deck.slice(0, numberOfCards);
  const remainingDeck = deck.slice(numberOfCards);
  return { dealtCards, remainingDeck };
};

export const initialState = {
  players: [
    {
      name: 'Player 1',
      chips: 1000,
      currentBet: 0,
      amountInFront: 0,
      status: 'active',
      cards: [],
    },
    {
      name: 'Player 2',
      chips: 1000,
      currentBet: 0,
      amountInFront: 0,
      status: 'active',
      cards: [],
    },
  ],
  currentPlayerIndex: 0,
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


export const gameReducer = (state, action) => {
  switch (action.type) {
    case DEAL_CARDS: {
      let updatedPlayers = [...state.players];
      let updatedDeck = [...state.deck];

      for (let player of updatedPlayers) {
        const { dealtCards, remainingDeck } = dealCardsFromDeck(updatedDeck, 2);
        player.cards = dealtCards;
        updatedDeck = remainingDeck;
      }

      return {
        ...state,
        players: updatedPlayers,
        deck: updatedDeck,
        communityCards: [],
      };
    }
    case POST_BLINDS: {
      const smallBlindPlayer = { ...state.players[state.blinds.smallBlindPlayerIndex] };
      const bigBlindPlayer = { ...state.players[state.blinds.bigBlindPlayerIndex] };

      smallBlindPlayer.chips -= state.blinds.small;
      smallBlindPlayer.amountInFront += state.blinds.small;

      bigBlindPlayer.chips -= state.blinds.big;
      bigBlindPlayer.amountInFront += state.blinds.big;

      const updatedPlayers = state.players.map((player) => {
        if (player.name === smallBlindPlayer.name) return smallBlindPlayer;
        if (player.name === bigBlindPlayer.name) return bigBlindPlayer;
        return player;
      });

      return {
        ...state,
        pot: state.pot + state.blinds.small + state.blinds.big,
        players: updatedPlayers,
      };
    }
    // case BET: {
    //   const currentPlayerData = state.players.find(player => player.id === action.playerId);
    //   const updatedPlayers = state.players.map(player => {
    //     if (player.id === action.playerId) {
    //       return {
    //         ...player,
    //         chips: player.chips - action.amount,
    //         currentBet: action.amount,
    //         moves: [...player.moves, { type: 'BET', amount: action.amount }],
    //       };
    //     }
    //     return player;
    //   });
    //   return {
    //     ...state,
    //     players: updatedPlayers,
    //     pot: state.pot + action.amount,
    //   };
    // }
    // case CALL: {
    //   const currentPlayerId = state.currentPlayer;
    //   const otherPlayerId = currentPlayerId === 'player1ID' ? 'player2ID' : 'player1ID';
    //   const highestBet = Math.max(state.player1.currentBet, state.player2.currentBet);
    //   const callAmount = highestBet - state[currentPlayerId].currentBet;

    //   return {
    //     ...state,
    //     [currentPlayerId]: {
    //       ...state[currentPlayerId],
    //       chips: state[currentPlayerId].chips - callAmount,
    //       currentBet: highestBet,
    //       moves: [...state[currentPlayerId].moves, 'call']
    //     },
    //     pot: state.pot + callAmount
    //   };
    // }

    // case PROCEED_TO_NEXT_ROUND: {
    //   let nextRound = '';
    //   let newCommunityCards = [...state.communityCards];
    //   let remainingDeck = [...state.deck];
    //   let dealtCards = [];

    //   switch (state.round) {
    //     case 'pre-flop':
    //       nextRound = 'flop';
    //       ({ dealtCards, remainingDeck } = dealCardsFromDeck(remainingDeck, 3));
    //       newCommunityCards = [...newCommunityCards, ...dealtCards];
    //       break;
    //     case 'flop':
    //       nextRound = 'turn';
    //       ({ dealtCards, remainingDeck } = dealCardsFromDeck(remainingDeck, 1));
    //       newCommunityCards = [...newCommunityCards, ...dealtCards];
    //       break;
    //     case 'turn':
    //       nextRound = 'river';
    //       ({ dealtCards, remainingDeck } = dealCardsFromDeck(remainingDeck, 1));
    //       newCommunityCards = [...newCommunityCards, ...dealtCards];
    //       break;
    //     case 'river':
    //       nextRound = 'showdown';
    //       break;
    //     default:
    //       break;
    //   }
    //   let isCardsFaceUp = state.round === 'river' ? true : false;
    //   const newSmallBlindIndex = (state.blinds.smallBlindPlayerIndex + 1) % state.players.length;
    //   const newBigBlindIndex = (state.blinds.bigBlindPlayerIndex + 1) % state.players.length;
    //   const newCurrentPlayerIndex = (state.currentPlayerIndex + 1) % state.players.length;
    //   return {
    //     ...state,
    //     communityCards: newCommunityCards,
    //     round: nextRound,
    //     deck: remainingDeck,
    //     currentPlayerIndex: newCurrentPlayerIndex,
    //     blinds: {
    //       ...state.blinds,
    //       smallBlindPlayerIndex: newSmallBlindIndex,
    //       bigBlindPlayerIndex: newBigBlindIndex,
    //     },
    //   };
    // }
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

