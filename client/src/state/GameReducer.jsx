import {
  DEAL_CARDS,
  POST_BLINDS,
  BET,
  ROTATE_BLINDS,
  CALL,
  RAISE,
  FOLD,
  WIN_ROUND,
  PROCEED_TO_NEXT_ROUND,
  RESHUFFLE,
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
  console.log("Dispatched action:", action.type);
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
    //   const currentPlayer = { ...state.players[state.currentPlayerIndex] };
    //   const betAmount = action.payload;
    //   currentPlayer.chips -= betAmount;
    //   currentPlayer.amountInFront += betAmount;
    //   currentPlayer.currentBet = betAmount;

    //   const updatedPlayers = state.players.map((player, index) => {
    //     if (index === state.currentPlayerIndex) return currentPlayer;
    //     return player;
    //   });

    //   return {
    //     ...state,
    //     players: updatedPlayers,
    //     pot: state.pot + betAmount,
    //   };
    // }
    case FOLD: {
      const currentPlayer = { ...state.players[state.currentPlayerIndex] };
      currentPlayer.status = 'folded';

      let remainingPlayerIndex = state.currentPlayerIndex + 1;
      // Check if the player is already the last player
      if (remainingPlayerIndex >= state.players.length) {
        remainingPlayerIndex = 0;
      }
      const remainingPlayer = { ...state.players[remainingPlayerIndex] };
      remainingPlayer.chips += state.pot;

      let updatedPlayers = [...state.players];

      for (let i = 0; i < updatedPlayers.length; i += 1) {
        if (i === state.currentPlayerIndex) {
          updatedPlayers[i] = currentPlayer;
        } else if (i === remainingPlayerIndex) {
          updatedPlayers[i] = remainingPlayer;
        }
      }

      return {
        ...state,
        players: updatedPlayers,
        pot: 0,
      };
    }

    case ROTATE_BLINDS: {
      // Rotate the blinds and check the position
      let newSmallBlindIndex = state.blinds.smallBlindPlayerIndex + 1;
      if (newSmallBlindIndex >= state.players.length) {
        newSmallBlindIndex = 0;
      }
      let newBigBlindIndex = state.blinds.bigBlindPlayerIndex + 1;
      if (newBigBlindIndex >= state.players.length) {
        newBigBlindIndex = 0;
      }

      const updatedPlayers = [...state.players];

      //  Set the amount in front for blinds after - blinds
      updatedPlayers[newSmallBlindIndex].chips -= state.blinds.small;
      updatedPlayers[newSmallBlindIndex].amountInFront = state.blinds.small;

      updatedPlayers[newBigBlindIndex].chips -= state.blinds.big;
      updatedPlayers[newBigBlindIndex].amountInFront = state.blinds.big;

      // Reset the amountInFront for players
      for (let i = 0; i < updatedPlayers.length; i++) {
        if (i !== newSmallBlindIndex && i !== newBigBlindIndex) {
          updatedPlayers[i].amountInFront = 0;
        }
      }

      const newPot = state.blinds.small + state.blinds.big;
      // go to the next player
      let nextPlayerIndex = state.currentPlayerIndex + 1;
      if (nextPlayerIndex >= state.players.length) {
        nextPlayerIndex = 0;
      }

      return {
        ...state,
        pot: newPot,
        players: updatedPlayers,
        blinds: {
          ...state.blinds,
          smallBlindPlayerIndex: newSmallBlindIndex,
          bigBlindPlayerIndex: newBigBlindIndex,
        },
        currentPlayerIndex: nextPlayerIndex,
      };
    }




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
    case RESHUFFLE: {
      return {
        ...state,
        deck: initializeDeck(),
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

