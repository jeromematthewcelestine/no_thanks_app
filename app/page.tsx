"use client"

import NoThanksBoard from "./NoThanksBoard";
import { mcts } from "./mcts";
import { NoThanksGame, NoThanksState } from "./NoThanks";
import { useEffect, useState } from "react";

export default function App() {
  const game = new NoThanksGame(
    3,
    20,
    3,
    6,
    4
  );
  const [gameState, setGameState] = useState<NoThanksState>();
  const [humanPlayer, setHumanPlayer] = useState(0);
  const [playerNames, setPlayerNames] = useState(["Player", "Alice", "Bob"]);
  const [isBotTurn, setIsBotTurn] = useState(false);

  useEffect(() => {
    setGameState(new NoThanksState(game));
  }, []);

  useEffect(() => {
    // console.log("gameState or isBotTurn changed");
    // console.log("isBotTurn", isBotTurn);
    if (gameState?.currentPlayer !== humanPlayer && !gameState?.isGameOver()) {
      handleBotTurn();
    }
  }, [gameState]);

  const handleBotTurn = async () => {
    console.log("handleBotTurn");

    if (!gameState)
      return;

    await new Promise(r => setTimeout(r, 50));

    const botAction = mcts(gameState, 1, true);

    const newGameState = gameState.clone();
    newGameState.applyAction(botAction);
    setGameState(newGameState);

    // setGameState(prevState => {
    //   const newState = prevState?.clone();
    //   newState?.applyAction(botAction);
    //   return newState;
    // });

    setIsBotTurn(newGameState.getCurrentPlayer() !== humanPlayer);
    // setIsBotTurn(prevIsBotTurn => {
    //   const currentPlayer = gameState.getCurrentPlayer();
    //   return currentPlayer !== humanPlayer && !gameState.isGameOver();
    // });
  }

  const handleAction = (action: number) => {
    if (!gameState)
      return;

    const newGameState = gameState.clone();
    if (action === NoThanksState.ACTION_TAKE) {
      newGameState.applyAction(NoThanksState.ACTION_TAKE);
      setGameState(newGameState);
    } else if (action === NoThanksState.ACTION_PASS) {
      newGameState.applyAction(NoThanksState.ACTION_PASS);
      setGameState(newGameState);
    }

    if (newGameState.getCurrentPlayer() !== humanPlayer) {
      setIsBotTurn(true);
    }
  }

  return (
    <div className="flex flex-col items-center gap-1">
      <div id="title">
        NoThanksBot
      </div>
      <div>
        {gameState && 
        <NoThanksBoard 
          gameState={gameState} 
          humanPlayer={humanPlayer} 
          playerNames={playerNames}
          actionHandler={handleAction} />}
      </div>
    </div>
  );
}
