import { MCTSGameState } from "./mcts";

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export class NoThanksGame {
  minCard: number;
  maxCard: number;
  numPlayers: number;
  numCoins: number;
  numOmittedCards: number;

  constructor(
    minCard: number         = 3,
    maxCard: number         = 35,
    numPlayers: number      = 3,
    numCoins: number        = 11,
    numOmittedCards: number = 9) {
    this.minCard = minCard;
    this.maxCard = maxCard;
    this.numPlayers = numPlayers;
    this.numCoins = numCoins;
    this.numOmittedCards = numOmittedCards;
  }
}

export class NoThanksState implements MCTSGameState {
  static ACTION_TAKE = 0;
  static ACTION_PASS = 1;

  // cards is an array of arrays
  game: NoThanksGame;
  currentPlayer: number;
  deck: boolean[];
  numCardsInDeck: number;
  playerCards: number[][];
  playerCardsGrouped: number[][][];
  playerCoins: number[];
  cardInPlay: number | null;
  coinsInPlay: number;
  gameOver: boolean;
  
  constructor(game: NoThanksGame, doRandomization: boolean = true, firstCard: number | null = null) {
    this.game = game;
    // initialize player cards to an array of empty arrays, one for each player
    this.deck = Array.from({ length: game.maxCard - game.minCard + 1 }, () => true);
    this.numCardsInDeck = game.maxCard - game.minCard + 1 - game.numOmittedCards;
    
    this.playerCards = Array.from({ length: game.numPlayers }, () => []);
    this.playerCardsGrouped = Array.from({ length: game.numPlayers }, () => []);
    // initialize player coins to an array of numCoins, one for each player
    this.playerCoins = Array.from({ length: game.numPlayers }, () => game.numCoins);
    this.cardInPlay = null;
    this.coinsInPlay = 0;
    this.currentPlayer = 0;
    this.gameOver = false;
    // initialize deck to a boolean array of length maxCard - minCard + 1, initially all true
    
    // deal first card
    if (firstCard) {
      this.cardInPlay = firstCard;
      this.deck[firstCard - game.minCard] = false;
      this.numCardsInDeck -= 1;
    } else if (doRandomization) {
      this.cardInPlay = this.drawCard();
      if (this.cardInPlay) {
        this.deck[this.cardInPlay - game.minCard] = false;
        this.numCardsInDeck -= 1;
      }
    } else {

    }
    

  }

  setFirstCard() {
    this.cardInPlay = this.drawCard();
    if (this.cardInPlay) {
      this.deck[this.cardInPlay - this.game.minCard] = false;
      this.numCardsInDeck -= 1;
    }
  }

  drawCard(): number {
    const cardIdx = randomInt(0, this.numCardsInDeck + this.game.numOmittedCards - 1);

    let cardCount = 0;
    for (let i = 0; i < this.deck.length; i++) {
      if (this.deck[i]) {
        if (cardCount === cardIdx) {
          return i + this.game.minCard;
        }
        cardCount += 1;
      }
    }
    return -1;
  }

  clone(): NoThanksState {
    const newState = new NoThanksState(this.game);
    newState.currentPlayer = this.currentPlayer;
    // newState.deck = this.deck.slice();
    newState.deck = this.deck.map(x => x);
    newState.numCardsInDeck = this.numCardsInDeck;
    // newState.playerCards = this.playerCards.map(cards => cards.slice());
    newState.playerCards = this.playerCards.map(cards => [...cards]);
    newState.playerCardsGrouped = this.playerCardsGrouped.map(groups => groups.map(group => group.slice()));
    newState.playerCoins = this.playerCoins.slice();
    newState.cardInPlay = this.cardInPlay;
    newState.coinsInPlay = this.coinsInPlay;
    newState.gameOver = this.gameOver;
    return newState;
  }

  isGameOver(): boolean {
    return this.gameOver;
  }

  getLegalActions(): number[] {
    if (this.gameOver) {
      return [];
    }
    if (this.playerCoins[this.currentPlayer] === 0) {
      return [NoThanksState.ACTION_TAKE];
    } else {
      return [NoThanksState.ACTION_TAKE, NoThanksState.ACTION_PASS];
    }
  }


  getNPlayers(): number {
    return this.game.numPlayers;
  }

  getCurrentPlayer(): number {
    return this.currentPlayer;
  }

  applyAction(action: number): void {
    if (!(action in this.getLegalActions())) {
      return;
    }

    if (action === NoThanksState.ACTION_TAKE) {
      this.playerCoins[this.currentPlayer] += this.coinsInPlay;
      this.coinsInPlay = 0;
      this.playerCards[this.currentPlayer].push(this.cardInPlay!);

      // update playerCardsGrouped
      this.playerCardsGrouped[this.currentPlayer] = [];
      const cardsSorted = this.playerCards[this.currentPlayer].slice().sort((a, b) => a - b);
      console.log("Player " + this.currentPlayer + " cards:");
      console.log(cardsSorted);

      let prevCard = -1;
      let currentGroup : number[] = [];
      for (let card of cardsSorted) {
        if (card == prevCard + 1) {
          currentGroup.push(card);
        } else {
          if (currentGroup.length > 0) {
            this.playerCardsGrouped[this.currentPlayer].push(currentGroup.slice());
          }
          currentGroup = [card];
        }
        prevCard = card;
      }
      if (currentGroup.length > 0) {
        this.playerCardsGrouped[this.currentPlayer].push(currentGroup);
      }

      // deal next card
      if (this.numCardsInDeck > 0) {
        this.cardInPlay = this.drawCard();
        if (this.cardInPlay) {
          this.deck[this.cardInPlay - this.game.minCard] = false;
          this.numCardsInDeck -= 1;
        }
      } else {
        this.cardInPlay = null;
        this.gameOver = true;
      }

    } else if (action === NoThanksState.ACTION_PASS) {
      this.playerCoins[this.currentPlayer] -= 1;
      this.coinsInPlay += 1;
      this.currentPlayer = (this.currentPlayer + 1) % this.game.numPlayers;
      
    }
    
  }

  getWinner(): number {
    if (!this.gameOver) {
      return -1;
    }

    const scores = this.calculateScores();

    let minScore = 1000;
    let minScorePlayers : number[] = [];
    for (let i = 0; i < this.game.numPlayers; i++) {
      if (scores[i] < minScore) {
        minScore = scores[i];
        minScorePlayers = [i];
      } else if (scores[i] === minScore) {
        minScorePlayers.push(i);
      }
    }

    if (minScorePlayers.length === 1) {
      return minScorePlayers[0];
    } else {

      // coins are tie breaker
      let maxCoins = -1;
      let maxCoinsPlayers : number[] = [];
      for (let player of minScorePlayers) {
        if (this.playerCoins[player] > maxCoins) {
          maxCoins = this.playerCoins[player];
          maxCoinsPlayers = [player];
        } else if (this.playerCoins[player] === maxCoins) {
          maxCoinsPlayers.push(player);
        }
      }

      if (maxCoinsPlayers.length === 1) {
        return maxCoinsPlayers[0];
      } else {
        // random tie breaker
        return maxCoinsPlayers[Math.floor(Math.random() * maxCoinsPlayers.length)];
      }
    }

  }

  calculateScores(): number[] {
    const scores = Array.from({ length: this.game.numPlayers }, () => 0);
    for (let i = 0; i < this.game.numPlayers; i++) {
      // make a sorted copy of the player's cards
      const sortedPlayerCards = this.playerCards[i].slice().sort((a, b) => a - b);
      // console.log("Player " + i + " cards:");
      // console.log(sortedPlayerCards);
      let score = 0;
      let prevCard = -1;
      for (let card of sortedPlayerCards) {
        if (card !== prevCard + 1) {
          score += card;
        }
        prevCard = card;
      }
      scores[i] = score;
      scores[i] -= this.playerCoins[i];
    }
    return scores;
  }

  getValues(): number[] {
    if (!this.gameOver) {
      return Array.from({ length: this.game.numPlayers }, () => 0);
    }

    const winner = this.getWinner();
    return Array.from({ length: this.game.numPlayers }, (_, i) => (i === winner ? 1 : -1));
  }

  toString(): string {
    let s = '';
    s += `Player ${this.currentPlayer}'s turn\n`;
    
    s += `Card in play: ${this.cardInPlay}\n`;
    s += `Coins in play: ${this.coinsInPlay}\n`;
    s += `Player cards:\n`;
    for (let i = 0; i < this.game.numPlayers; i++) {
      s += `Player ${i}: ${this.playerCards[i]}\n`;
    }
    s += `Player cards grouped:\n`;
    for (let i = 0; i < this.game.numPlayers; i++) {
      s += `Player ${i}:`;
      for (let j = 0; j < this.playerCardsGrouped[i].length; j++) {
        s += `${this.playerCardsGrouped[i][j]} | `;
    }
    s += `\n`;
    }
    s += `Player coins:\n`;
    for (let i = 0; i < this.game.numPlayers; i++) {
      s += `Player ${i}: ${this.playerCoins[i]}\n`;
    }
    return s;
  }
}