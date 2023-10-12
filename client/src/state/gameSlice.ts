import { createSlice } from '@reduxjs/toolkit';
import { Alert } from 'react-native';
import initialState, { GameState, Player } from './gameInitialState';
import {
  initializeDeck,
  dealCardsFromDeck,
  handleAllIn,
  updatePlayerChips,
  moveToNextPlayer,
  deductBlindAndSetAmountInFront,
} from '../utils/gameHelper';

interface BetAction {
  payload: number;
}

interface RaiseAction {
  payload: number;
}

interface CalWinnerAction {
  payload: {
    winners: Player[];
    players: Player[];
  };
}

const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    // Game Flow Reducers
    dealCards(state: GameState) {
      for (let player of state.players) {
        const { dealtCards, remainingDeck } = dealCardsFromDeck(state.deck, 2);
        player.cards = dealtCards;
        state.deck = remainingDeck;
      }
      state.communityCards = [];
      // Move to the player right after the big blind
      state.currentPlayerIndex = state.blinds.bigBlindPlayerIndex;
      moveToNextPlayer(state);
    },
    postBlinds(state: GameState) {
      const smallBlindPlayer = state.players[state.blinds.smallBlindPlayerIndex];
      const bigBlindPlayer = state.players[state.blinds.bigBlindPlayerIndex];

      updatePlayerChips(smallBlindPlayer, state.blinds.small);
      updatePlayerChips(bigBlindPlayer, state.blinds.big);

      state.pot += state.blinds.small + state.blinds.big;
    },
    rotateBlinds(state: GameState) {
      let newSmallBlindIndex = (state.blinds.smallBlindPlayerIndex + 1) % state.players.length;
      let newBigBlindIndex = (state.blinds.bigBlindPlayerIndex + 1) % state.players.length;

      //  Set the amount in front for blinds after -(minus) blinds
      deductBlindAndSetAmountInFront(state.players[newSmallBlindIndex], state.blinds.small);
      deductBlindAndSetAmountInFront(state.players[newBigBlindIndex], state.blinds.big);
      // Reset the amountInFront for players
      for (let i = 0; i < state.players.length; i++) {
        if (i !== newSmallBlindIndex && i !== newBigBlindIndex) {
          state.players[i].amountInFront = 0;
        }
      }

      state.pot = state.blinds.small + state.blinds.big;

      // Update blinds indices
      state.blinds.smallBlindPlayerIndex = newSmallBlindIndex;
      state.blinds.bigBlindPlayerIndex = newBigBlindIndex;

      moveToNextPlayer(state);
    },
    proceedToNextRound(state: GameState) {
      let dealtCards = [];
      switch (state.round) {
        case 'pre-flop':
          state.round = 'flop';
          ({ dealtCards, remainingDeck: state.deck } = dealCardsFromDeck(state.deck, 3));
          state.communityCards.push(...dealtCards);
          break;
        case 'flop':
          state.round = 'turn';
          ({ dealtCards, remainingDeck: state.deck } = dealCardsFromDeck(state.deck, 1));
          state.communityCards.push(...dealtCards);
          break;
        case 'turn':
          state.round = 'river';
          ({ dealtCards, remainingDeck: state.deck } = dealCardsFromDeck(state.deck, 1));
          state.communityCards.push(...dealtCards);
          break;
        case 'river':
          state.round = 'showdown';
          break;
        default:
          break;
      }
      // Set the currentPlayerIndex to bigBlindPlayerIndex
      state.currentPlayerIndex = state.blinds.bigBlindPlayerIndex;
      state.lastActedPlayerIndex = null;

      // Reset amountInFront for all players
      for (let player of state.players) {
        player.amountInFront = 0;
      }
      state.actionsInRound = 0;
    },
    // Player Actions Reducers
    bet(state: GameState, action: PayloadAction<BetAction>) {
      const betAmount = action.payload;
      const currentPlayer = state.players[state.currentPlayerIndex];

      updatePlayerChips(currentPlayer, betAmount);
      currentPlayer.currentBet = betAmount;

      if (currentPlayer.isAllIn) {
        handleAllIn(state);
      }

      state.pot += betAmount;
      state.lastActedPlayerIndex = state.currentPlayerIndex;
      moveToNextPlayer(state);
    },
    fold(state: GameState) {
      const currentPlayer = state.players[state.currentPlayerIndex];
      currentPlayer.status = 'folded';

      moveToNextPlayer(state);
      // Get the index of the remaining player
      const remainingPlayer = state.players[state.currentPlayerIndex];

      // Add the pot to the remaining (winning) player's chips
      remainingPlayer.chips += state.pot;
      state.pot = 0;
    },
    call(state: GameState) {
      const currentPlayer = state.players[state.currentPlayerIndex];
      const opponentIndex = state.currentPlayerIndex === 0 ? 1 : 0;
      const opponentPlayer = state.players[opponentIndex];

      const amountToCall = opponentPlayer.amountInFront - currentPlayer.amountInFront;
      updatePlayerChips(currentPlayer, amountToCall);
      state.pot += amountToCall;
      state.lastActedPlayerIndex = state.currentPlayerIndex;

      if (opponentPlayer.isAllIn) {
        handleAllIn(state);
        return;
      }
      state.actionsInRound += 1;
      // If both players have acted and their bet amounts are equal, move to the next round
      if (state.actionsInRound >= 2 && state.players[0].amountInFront
        === state.players[1].amountInFront) {
        gameSlice.caseReducers.proceedToNextRound(state);
        return;
      }
      // Determine the next player
      if (state.round === 'pre-flop' && state.currentPlayerIndex === state.blinds.smallBlindPlayerIndex) {
        state.currentPlayerIndex = state.blinds.bigBlindPlayerIndex;
      } else {
        moveToNextPlayer(state);
      }
    },
    check(state: GameState) {
      state.lastActedPlayerIndex = state.currentPlayerIndex;
      state.actionsInRound += 1;
      // If both players have acted and their bet amounts are equal, move to the next round
      if (state.actionsInRound >= 2 && state.players[0].amountInFront
        === state.players[1].amountInFront) {
        gameSlice.caseReducers.proceedToNextRound(state);
        return;
      }
      // Determine the next player
      if (state.round === 'pre-flop' && state.currentPlayerIndex === state.blinds.smallBlindPlayerIndex) {
        state.currentPlayerIndex = state.blinds.bigBlindPlayerIndex;
      } else {
        moveToNextPlayer(state);
      }
    },
    raise(state: GameState, action: PayloadAction<RaiseAction>) {
      const amount = action.payload;
      const currentPlayer = state.players[state.currentPlayerIndex];

      updatePlayerChips(currentPlayer, amount);
      state.pot += amount;

      if (currentPlayer.chips === 0) {
        handleAllIn(state);
      }

      state.lastActedPlayerIndex = state.currentPlayerIndex;
      state.actionsInRound = 1;

      // Determine the next player
      if (state.round === 'pre-flop' && state.currentPlayerIndex === state.blinds.smallBlindPlayerIndex) {
        state.currentPlayerIndex = state.blinds.bigBlindPlayerIndex;
      } else {
        moveToNextPlayer(state);
      }
    },
    // Setup Reducers
    resetToPreflop(state: GameState) {
      state.round = 'pre-flop';
      gameSlice.caseReducers.reshuffle(state);
      gameSlice.caseReducers.rotateBlinds(state);
      gameSlice.caseReducers.dealCards(state);
    },
    reshuffle(state: GameState) {
      state.deck = initializeDeck();
    },
    restartGame(state: GameState) {
      Object.assign(state, initialState);
      state.deck = initializeDeck();
    },
  },
  // Game Result Reducers
  calWinner(state: GameState, action: PayloadAction<CalWinnerAction>) {
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
        const winnerIndex = state.players.findIndex((player) => player.cards.join(',') === winner.cards);
        updatedPlayers[winnerIndex].chips += potSplit;
      });
    }
    state.players = updatedPlayers;
    state.pot = 0;
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