
import { useState, useEffect } from 'react';
import { NoThanksGame, NoThanksState } from './NoThanks';



interface NoThanksBoardProps {
  gameState: NoThanksState;
  actionHandler: (action: number) => void;
}

export default function NoThanksBoard({gameState, actionHandler} : NoThanksBoardProps) {

  console.log(gameState.toString());

  return (
    <div className="border-2 border-black flex flex-col gap-2 p-2">
      <MessageArea message={`It is Player ${gameState.currentPlayer}'s turn.`} />

      <NoThanksActionArea gameState={gameState} actionHandler={actionHandler} />

      {gameState.cardInPlay !== null && (
        <div>
          Card in play: {gameState.cardInPlay}
        </div>
      )}
      {gameState && (
        <div>
          Coins in play: {gameState.coinsInPlay}
        </div>
      )}
      {Array.from({ length: gameState.game.numPlayers }).map((_, i) => (
        <PlayerInfoArea key={i} gameState={gameState} playerIndex={i} />
      ))}
    </div>
  );
}


interface PlayerInfoAreaProps {
  gameState: NoThanksState;
  playerIndex: number;
}
function PlayerInfoArea({ gameState, playerIndex }: PlayerInfoAreaProps) {
  return (
    <div className="border-black border-dashed border rounded-xl p-2 flex flex-row gap-1 items-start"> {/* overall player info */}
      <div className="flex flow-col justify-start grow-0 shrink-0">
        <div className="border border-black flex flex-col"> {}
          <div className="">Player {playerIndex}</div>
          <div className="">Coins: {gameState.playerCoins[playerIndex]}</div>
        </div>
      </div>
      
      <div className="flex flow-col justify-start">
        <div className="flex flow-row gap-2 flex-wrap">
          {gameState.playerCardsGrouped[playerIndex].map((cardGroup, i) => (
            <div key={i} className="flex ">
              {cardGroup.map((cardNumber, j) => (
                <div className="p-0">
                  <GameCard key={j} cardNumber={cardNumber} />
                </div>
              ))}
            </div>
          ))}
          {/* {gameState.playerCards[playerIndex].map((cardNumber, i) => (
            <GameCard key={i} cardNumber={cardNumber} />
          ))} */}
        </div>
      </div>
    </div>
    
  );
}

interface NoThanksActionAreaProps {
  gameState: NoThanksState;
  actionHandler: (action : number) => void;
}
function NoThanksActionArea({ gameState, actionHandler }: NoThanksActionAreaProps) {
  return (
    <div className="flex gap-2 flex-row justify-center">
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-xl"
        onClick={() => actionHandler(NoThanksState.ACTION_TAKE)}
      >
        Take Card
      </button>
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-xl"
        onClick={() => actionHandler(NoThanksState.ACTION_PASS)}
      >
        Pass
      </button>
    </div>
  );
}

function MessageArea({ message }: { message: string }) {
  return (
    <div className="rounded-xl p-2">
      {message}
    </div>
  );
}

function GameCard({ cardNumber }: { cardNumber: number }) {
  return (
    <div className="rounded-xl p-2 bg-amber-200 w-[40px] h-[60px]">
      {cardNumber}
    </div>
  );
}