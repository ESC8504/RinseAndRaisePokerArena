import { Player, GameState } from '../state/gameinitialstate';

export const CARD_VALUES: string[] = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
export const CARD_SUITS: string[] = ['S', 'H', 'D', 'C'];

export const fisherYatesShuffle = (deck: string[]): string[] => {
  let shuffled = [...deck];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export const initializeDeck = (): string[] => {
  let deck = [];
  for (let value of CARD_VALUES) {
    for (let suit of CARD_SUITS) {
      deck.push(value + suit);
    }
  }
  return fisherYatesShuffle(deck);
};

export const dealCardsFromDeck = (deck: string[], numberOfCards: number): { dealtCards: string[], remainingDeck: string[] } => {
  const dealtCards = deck.slice(0, numberOfCards);
  const remainingDeck = deck.slice(numberOfCards);
  return { dealtCards, remainingDeck };
};

export const handleAllIn = (state: GameState): void => {
  const allInPlayer = state.players.find(player => player.isAllIn);
  const otherPlayerIndex = state.players.indexOf(allInPlayer) === 0 ? 1 : 0;
  const otherPlayer = state.players[otherPlayerIndex];

  if (allInPlayer.amountInFront === otherPlayer.amountInFront || otherPlayer.isAllIn) {
    while (state.round !== 'showdown') {
      gameSlice.caseReducers.proceedToNextRound(state);
    }
  }
};

export const updatePlayerChips = (player: Player, amount: number): void => {
  player.chips -= amount;
  player.amountInFront += amount;
  if (player.chips === 0) player.isAllIn = true;
};

export const moveToNextPlayer = (state: GameState): void => {
  let nextPlayerIndex = (state.currentPlayerIndex + 1) % state.players.length;
  state.currentPlayerIndex = nextPlayerIndex;
};

export const deductBlindAndSetAmountInFront = (player: Player, blindAmount: number): void => {
  updatePlayerChips(player, blindAmount);
  player.amountInFront = blindAmount;
};