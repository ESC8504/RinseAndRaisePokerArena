import { createSlice } from '@reduxjs/toolkit';
import { Alert } from 'react-native';

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
    },
  ],
  currentPlayerIndex: 0,
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

const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    dealCards(state) {
      let updatedPlayers = [...state.players];
      let updatedDeck = [...state.deck];

      for (let player of updatedPlayers) {
        const { dealtCards, remainingDeck } = dealCardsFromDeck(updatedDeck, 2);
        player.cards = dealtCards;
        updatedDeck = remainingDeck;
      }
      let nextPlayerIndex = state.blinds.bigBlindPlayerIndex + 1;
      if (nextPlayerIndex >= state.players.length) {
        nextPlayerIndex = 0;
      }

      state.players = updatedPlayers;
      state.deck = updatedDeck;
      state.communityCards = [];
      state.currentPlayerIndex = nextPlayerIndex;
    },
    postBlinds(state) {
      const smallBlindPlayer = { ...state.players[state.blinds.smallBlindPlayerIndex] };
      const bigBlindPlayer = { ...state.players[state.blinds.bigBlindPlayerIndex] };

      smallBlindPlayer.chips -= state.blinds.small;
      smallBlindPlayer.amountInFront += state.blinds.small;

      bigBlindPlayer.chips -= state.blinds.big;
      bigBlindPlayer.amountInFront += state.blinds.big;

      state.players[state.blinds.smallBlindPlayerIndex] = smallBlindPlayer;
      state.players[state.blinds.bigBlindPlayerIndex] = bigBlindPlayer;
      state.pot += state.blinds.small + state.blinds.big;
    },
    bet(state, action) {
      const currentPlayer = { ...state.players[state.currentPlayerIndex] };
      const betAmount = action.payload;

      currentPlayer.chips -= betAmount;
      currentPlayer.amountInFront += betAmount;
      currentPlayer.currentBet = betAmount;

      state.players[state.currentPlayerIndex] = currentPlayer;
      state.pot += betAmount;
      state.lastActedPlayerIndex = state.currentPlayerIndex;
      state.currentPlayerIndex = state.currentPlayerIndex === 0 ? 1 : 0;
    },
    fold(state) {
      const currentPlayer = { ...state.players[state.currentPlayerIndex] };
      currentPlayer.status = 'folded';

      let remainingPlayerIndex = state.currentPlayerIndex + 1;
      if (remainingPlayerIndex >= state.players.length) {
        remainingPlayerIndex = 0;
      }
      const remainingPlayer = { ...state.players[remainingPlayerIndex] };
      remainingPlayer.chips += state.pot;

      state.players[state.currentPlayerIndex] = currentPlayer;
      state.players[remainingPlayerIndex] = remainingPlayer;
      state.pot = 0;
    },
    rotateBlinds(state) {
      let newSmallBlindIndex = state.blinds.smallBlindPlayerIndex + 1;
      if (newSmallBlindIndex >= state.players.length) {
        newSmallBlindIndex = 0;
      }
      let newBigBlindIndex = state.blinds.bigBlindPlayerIndex + 1;
      if (newBigBlindIndex >= state.players.length) {
        newBigBlindIndex = 0;
      }
      //  Set the amount in front for blinds after -(minus) blinds
      state.players[newSmallBlindIndex].chips -= state.blinds.small;
      state.players[newSmallBlindIndex].amountInFront = state.blinds.small;

      state.players[newBigBlindIndex].chips -= state.blinds.big;
      state.players[newBigBlindIndex].amountInFront = state.blinds.big;

      // Reset the amountInFront for players
      for (let i = 0; i < state.players.length; i++) {
        if (i !== newSmallBlindIndex && i !== newBigBlindIndex) {
          state.players[i].amountInFront = 0;
        }
      }

      state.pot = state.blinds.small + state.blinds.big;

      let nextPlayerIndex = state.currentPlayerIndex + 1;
      if (nextPlayerIndex >= state.players.length) {
        nextPlayerIndex = 0;
      }

      state.blinds.smallBlindPlayerIndex = newSmallBlindIndex;
      state.blinds.bigBlindPlayerIndex = newBigBlindIndex;
      state.currentPlayerIndex = nextPlayerIndex;
    },
    proceedToNextRound(state) {
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

      let nextPlayerIndex = state.blinds.bigBlindPlayerIndex;
      // Reset amountInFront to 0
      const updatedPlayers = state.players.map((player) => ({
        ...player,
        amountInFront: 0,
      }));

      state.communityCards = newCommunityCards;
      state.round = nextRound;
      state.deck = remainingDeck;
      state.currentPlayerIndex = nextPlayerIndex;
      state.lastActedPlayerIndex = null;
      state.players = updatedPlayers;
    },
    call(state) {
      const currentPlayer = { ...state.players[state.currentPlayerIndex] };
      const opponentIndex = state.currentPlayerIndex === 0 ? 1 : 0;
      const opponentPlayer = { ...state.players[opponentIndex] };

      // if (currentPlayer.amountInFront === opponentPlayer.amountInFront) {
      //   Alert.alert(
      //     'There Is No Bet To Call!',
      //     'Please choose another action',
      //     [{ text: 'OK', onPress: () => console.log('OK Pressed') }],
      //   );
      //   return;
      // }
      const amountToCall = opponentPlayer.amountInFront - currentPlayer.amountInFront;

      currentPlayer.chips -= amountToCall;
      currentPlayer.amountInFront += amountToCall;

      state.players[state.currentPlayerIndex] = currentPlayer;

      state.pot += amountToCall;
      state.lastActedPlayerIndex = state.currentPlayerIndex;
      state.currentPlayerIndex = opponentIndex;
      // If both players have acted, go to the next round
      if (state.lastActedPlayerIndex === opponentIndex) {
        gameSlice.caseReducers.proceedToNextRound(state);
      }
    },
    check(state) {
      // if (state.round === 'pre-flop' && state.currentPlayerIndex !== state.blinds.bigBlindPlayerIndex) {
      //   Alert.alert(
      //     "You Can't Check!",
      //     'Please choose another action',
      //     [{ text: 'OK', onPress: () => console.log('OK Pressed') }],
      //   );
      //   return;
      // }
      const opponentIndex = state.currentPlayerIndex === 0 ? 1 : 0;
      state.currentPlayerIndex = opponentIndex;
      // If both players have acted, go to the next round
      if (state.lastActedPlayerIndex === opponentIndex) {
        gameSlice.caseReducers.proceedToNextRound(state);
        state.lastActedPlayerIndex = state.currentPlayerIndex;
      }
    },
    raise(state, action) {
      const currentPlayer = { ...state.players[state.currentPlayerIndex] };
      const opponentIndex = state.currentPlayerIndex === 0 ? 1 : 0;

      const raiseAmount = action.payload;

      currentPlayer.chips -= raiseAmount;
      currentPlayer.amountInFront += raiseAmount;
      state.players[state.currentPlayerIndex] = currentPlayer;

      state.pot += raiseAmount;
      state.lastActedPlayerIndex = state.currentPlayerIndex;

      state.currentPlayerIndex = opponentIndex;
    },
    calWinner(state, action) {
      const { winners, players: resultPlayers } = action.payload;
      let updatedPlayers = [...state.players];

      for (let resultPlayer of resultPlayers) {
        const playerIndex = state.players.findIndex((player) => player.cards.join(',') === resultPlayer.cards);
        updatedPlayers[playerIndex] = {
          ...updatedPlayers[playerIndex],
          handResult: resultPlayer.result,
          bestHand: resultPlayer.hand,
        };
      }
      // If there is only one winner means no tie/chop pots
      if (winners.length === 1) {
        const winnerIndex = state.players.findIndex((player) => player.cards.join(',') === winners[0].cards);
        updatedPlayers[winnerIndex].chips += state.pot;
        // Chop pots
      } else if (winners.length > 1) {
        const potSplit = state.pot / winners.length;
        winners.forEach((winner) => {
          const winnerIndex = state.players.findIndex(player => player.cards.join(',') === winner.cards);
          updatedPlayers[winnerIndex].chips += potSplit;
        });
      }

      state.players = updatedPlayers;
      state.pot = 0;
    },
    resetToPreflop(state) {
      state.round = 'pre-flop';
      gameSlice.caseReducers.reshuffle(state);
      gameSlice.caseReducers.rotateBlinds(state);
      gameSlice.caseReducers.dealCards(state);
    },
    reshuffle(state) {
      state.deck = initializeDeck();
    },
    restartGame(state) {
      Object.assign(state, initialState);
      state.deck = initializeDeck();
    },
  },
});

export const {
  dealCards,
  postBlinds,
  bet,
  fold,
  rotateBlinds,
  proceedToNextRound,
  call,
  check,
  raise,
  calWinner,
  resetToPreflop,
  reshuffle,
  restartGame,
} = gameSlice.actions;

export default gameSlice.reducer;