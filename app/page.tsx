"use client"

import Image from "next/image";
import NoThanksBoard from "./NoThanksBoard";
import { NoThanksGame, NoThanksState } from "./NoThanks";
import { mcts } from "./mcts";
import { useEffect, useState } from "react";

export default function App() {

  const game = new NoThanksGame();
  const [gameState, setGameState] = useState<NoThanksState>();

  useEffect(() => {
    setGameState(new NoThanksState(game));
  }, []);

  const handleAction = (action: number) => {
    if (!gameState)
      return;

    if (action === NoThanksState.ACTION_TAKE) {
      const newGameState = gameState.clone();
      newGameState.applyAction(NoThanksState.ACTION_TAKE);
      setGameState(newGameState);
      console.log(newGameState.toString());
    } else if (action === NoThanksState.ACTION_PASS) {
      const newGameState = gameState.clone();
      newGameState.applyAction(NoThanksState.ACTION_PASS);
      setGameState(newGameState);
      console.log(newGameState.toString());
    }
    
  }

  return (
    <div className="flex flex-col items-center gap-1">
      <div id="title">
        NoThanksBot
      </div>
      <div>
        {gameState && <NoThanksBoard gameState={gameState} actionHandler={handleAction} />}
      </div>
    </div>
  );
}
