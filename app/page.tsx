"use client"

import NoThanksBoard from "./NoThanksBoard";
import { mcts } from "./mcts";
import { NoThanksGame, NoThanksState } from "./NoThanks";
import { useEffect, useState } from "react";



export default function App() {

  const game = new NoThanksGame(
    3,
    35,
    3,
    11,
    9
  );

  const [gameState, setGameState] = useState<NoThanksState>();
  const [humanPlayer, setHumanPlayer] = useState(0);
  const [playerNames, setPlayerNames] = useState(["Player", "Alice", "Bob"]);
  const [botType, setBotType] = useState("mcts01");
  const [isBotTurn, setIsBotTurn] = useState(false);

  useEffect(() => {
    setGameState(new NoThanksState(game));
  }, []);

  useEffect(() => {
    if (gameState?.currentPlayer !== humanPlayer && !gameState?.isGameOver()) {
      handleBotTurn();
    }
  }, [gameState]);

  const handleBotTurn = async () => {
    console.log("handleBotTurn");

    if (!gameState)
      return;

    await new Promise(r => setTimeout(r, 50));

    let botTime = 1;
    if (botType === "mcts01") {
      botTime = 1;
    } else if (botType === "mcts02") {
      botTime = 2;
    } else if (botType === "mcts05") {
      botTime = 5;
    }
    const botAction = mcts(gameState, botTime, true);

    const newGameState = gameState.clone();
    newGameState.applyAction(botAction);
    setGameState(newGameState);

    setIsBotTurn(newGameState.getCurrentPlayer() !== humanPlayer);
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
    <div className="flex flex-col items-center gap-2">
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
      <div className="h-[2rem]">

      </div>
      {gameState &&
        <BotTypeSelector botType={botType} setBotType={setBotType} />
      }
    </div>
  );
}

function BotTypeSelector({ botType, setBotType }: { botType : string, setBotType: (botType: string) => void }) {
  return (
    <div className="flex flex-col gap-0 border border-gray-500 border-dashed rounded-lg p-2 text-sm">
      <div className="text-center font-bold pb-2">
        Bot Type
      </div>
      <div className="flex flex-row gap-1 items-center justify-start">
        <input type="radio" id="mcts01" name="bot-type" value="mcts01" onClick={() => setBotType("mcts01")} checked={botType=="mcts01"}/>
        <label htmlFor="mcts01">MCTS (1 second)</label>
      </div>
      <div className="flex flex-row gap-1 items-center justify-start">
        <input type="radio" id="mcts02" name="bot-type" value="mcts02" onClick={() => setBotType("mcts02")} checked={botType=="mcts02"}/>
        <label htmlFor="mcts02">MCTS (2 seconds)</label>
      </div>
      <div className="flex flex-row gap-1 items-center justify-start">
        <input type="radio" id="mcts05" name="bot-type" value="mcts05" onClick={() => setBotType("mcts05")} checked={botType=="mcts05"} />
        <label htmlFor="mcts05">MCTS (5 seconds)</label>
      </div>
    </div>
  );
}