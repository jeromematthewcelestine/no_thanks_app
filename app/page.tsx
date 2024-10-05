"use client"

import NoThanksBoard from "./NoThanksBoard";
import { mcts } from "./mcts";
import { NoThanksGame, NoThanksState } from "./NoThanks";
import { useEffect, useState } from "react";



export default function App() {
  

  
  const [gameState, setGameState] = useState<NoThanksState>();
  const [humanPlayer] = useState(0);
  const [playerNames] = useState(["Player", "Alice", "Bob", "Charles", "Delia"]);
  const [botType, setBotType] = useState("mcts01");
  const [newGameNumPlayers, setNewGameNumPlayers] = useState(3);  

  useEffect(() => {
    const game = new NoThanksGame(
      3,
      35,
      3,
      11,
      9
    );
    setGameState(new NoThanksState(game));
  }, []);


  const handleBotTurn = async () => {

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
  }


  useEffect(() => {
    if (gameState?.currentPlayer !== humanPlayer && !gameState?.isGameOver()) {
      handleBotTurn();  
    }
  }, [gameState, humanPlayer]);

  const handleNewGame = () => {
    console.log('newGameNumPlayers', newGameNumPlayers);
    const game = new NoThanksGame(
      3,
      35,
      newGameNumPlayers,
      11,
      9
    );
    setGameState(new NoThanksState(game));
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
  }

  const titleLetterGroups = [["N", "O"], ["T", "H", "A", "N", "K", "S"], ["B", "O", "T"]];

  return (
    <div className="flex flex-col items-center gap-2 pt-2">
      <div id="title" className="bg-white rounded-md text-black p-2 font-bold text-lg">
        <div className="flex flex-row gap-3 ">
          {/* title letters in reverse */}
          {titleLetterGroups.map((titleLetterGroup, groupIndex) => (
            <div key={`group` + groupIndex} className="flex flex-row-reverse gap-1">
              {titleLetterGroup.reverse().map((letter, index) => (
                <TitleCard key={index} cardText={letter} startOfGroup={index === titleLetterGroup.length-1} />
              ))}
            </div>
          ))}
        </div>

      </div>
      {gameState &&
      <div className="flex flex-col items-center gap-2">

        <div className="rounded-xl border border-gray-400 p-2 shadow-md shadow-gray-200  flex flex-col items-center" >
          
          <NoThanksBoard 
            gameState={gameState} 
            humanPlayer={humanPlayer} 
            playerNames={playerNames}
            actionHandler={handleAction} />
          
          <div className="h-[1rem]"></div>
          
          <BotTypeSelector botType={botType} setBotType={setBotType} />

        </div>
        
        <div className="h-[1rem]"></div>
        
        <NewGameSection newGameNumPlayers={newGameNumPlayers} setNewGameNumPlayers={setNewGameNumPlayers} 
          handleNewGame={handleNewGame} />
        
        <div className="h-[1rem]"></div>

        <div className="m-0 text-sm p-2">
          <ul>
            <li><i>NoThanksBot</i> is developed by <a href="https://www.jeromewilliams.net/">Jerome Williams</a>. </li>
            <li><a href="https://boardgamegeek.com/boardgame/12942/no-thanks"><i>No Thanks!</i></a> is a game by Thorsten Gimmler.</li>
            <li>NoThanksBot is unaffiliated with Thorsten Gimmler or any publishers of <i>No Thanks!</i></li>
            <li>Code for NoThanksBot is <a href="https://github.com/jeromematthewcelestine/no_thanks_app/">here</a>.</li>
            <li>&copy; Jerome Williams 2024</li>
          </ul>
            
        </div>
      
      </div>}
    </div>
  );
}

function BotTypeSelector({ botType, setBotType }: { botType : string, setBotType: (botType: string) => void }) {
  return (
    <div className="bg-white flex flex-col gap-0 border border-gray-500 border-dashed rounded-lg p-2 text-sm">
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
interface NewGameSectionProps {
  newGameNumPlayers: number;
  setNewGameNumPlayers: (numPlayers: number) => void;
  handleNewGame: () => void;
}
function NewGameSection({ newGameNumPlayers, setNewGameNumPlayers, handleNewGame } : NewGameSectionProps) {
  return (
    <div className="flex flex-col gap-2 border border-gray-500 border-dashed rounded-lg p-2 text-sm items-center">
      <div className="text-center font-bold">
        New Game
      </div>
      <div className="flex flex-col gap-0 items-left justify-start">
        <div className="flex flex-row gap-1 items-center justify-start">
          <input type="radio" id="numPlayers3" name="numPlayers" value="numPlayers3" onClick={() => setNewGameNumPlayers(3)} checked={newGameNumPlayers==3}/>
          <label htmlFor="numPlayers3">3 players</label>
        </div>
        <div className="flex flex-row gap-1 items-center justify-start">
          <input type="radio" id="numPlayers4" name="numPlayers" value="numPlayers4" onClick={() => setNewGameNumPlayers(4)} checked={newGameNumPlayers==4}/>
          <label htmlFor="numPlayers4">4 players</label>
        </div>
        <div className="flex flex-row gap-1 items-center justify-start">
          <input type="radio" id="numPlayers5" name="numPlayers" value="numPlayers5" onClick={() => setNewGameNumPlayers(5)} checked={newGameNumPlayers==5}/>
          <label htmlFor="numPlayers5">5 players</label>
        </div>
      </div>
      <div className="">
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded-xl" onClick={handleNewGame}>
          Start
        </button>
      </div>
    </div>
  )
}

function TitleCard({ cardText, startOfGroup }: { cardText: string, startOfGroup: boolean }) {
  return (
    <div className={
      startOfGroup 
      ? `relative rounded-md p-0.5 bg-white border border-black border-2 w-[40px] h-[60px] flex flex-col justify-center items-center font-bold `
      : `relative rounded-md p-0.5 bg-white border border-black border-2 w-[40px] h-[60px] flex flex-col justify-start items-end text-sm ml-[-25px] font-bold`}>
        {cardText}
        
    </div>
  );
}