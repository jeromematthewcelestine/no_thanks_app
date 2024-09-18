
// import { useState, useEffect } from 'react';
import { NoThanksState } from './NoThanks';

interface NoThanksBoardProps {
  gameState: NoThanksState;
  actionHandler: (action: number) => void;
}

export default function NoThanksBoard({gameState, actionHandler} : NoThanksBoardProps) {

  console.log(gameState.toString());

  return (
    <div className="flex flex-col gap-2 p-2 min-w-[24rem] max-w-[48rem]">
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
        <PlayerArea key={i} gameState={gameState} playerIndex={i} />
      ))}
    </div>
  );
}


interface PlayerAreaProps {
  gameState: NoThanksState;
  playerIndex: number;
}
function PlayerArea({ gameState, playerIndex }: PlayerAreaProps) {
  return (
    <div className={`border-black border-dashed border border-gray-500 rounded-xl p-2 flex flex-row gap-1 items-start ${gameState.currentPlayer == playerIndex ? ' bg-[beige] ' : ' bg-white '}`}> {/* overall player info */}
      <div className="flex flow-col justify-start grow-0 shrink-0">
        <div className="bg-white border border-gray-200 border-dashed rounded-xl p-2 flex flex-col"> {}
          <div className="">Player {playerIndex}</div>
          <div className="">Coins: {gameState.playerCoins[playerIndex]}</div>
        </div>
      </div>
      
      <div className="flex flow-col justify-start">
        <div className="flex flow-row gap-3 flex-wrap">
          {gameState.playerCardsGrouped[playerIndex].map((cardGroup, i) => (
            <div key={i} className="flex flex-row-reverse">
              {cardGroup.slice().reverse().map((cardNumber, j) => (
                <GameCard key={j} cardNumber={cardNumber} startOfGroup={j === cardGroup.length - 1} />                
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
    
  );
}

interface NoThanksActionAreaProps {
  gameState: NoThanksState;
  actionHandler: (action : number) => void;
}
function NoThanksActionArea({ actionHandler }: NoThanksActionAreaProps) {
  return (
    <div className="flex gap-2 flex-row justify-center">
      <button className="bg-[red] hover:bg-red-700 text-white font-bold py-2 px-4 rounded-xl"
        onClick={() => actionHandler(NoThanksState.ACTION_TAKE)}
      >
        TAKE CARD
      </button>
      <button className="bg-[red] hover:bg-red-700 text-white font-bold py-2 px-4 rounded-xl"
        onClick={() => actionHandler(NoThanksState.ACTION_PASS)}
      >
        PASS
      </button>
    </div>
  );
}

function MessageArea({ message }: { message: string }) {
  return (
    <div className="rounded-xl p-2 bg-[gold] flex flex-row justify-center font-bold">
      {message}
    </div>
  );
}

interface GameCardProps {
  cardNumber: number;
  startOfGroup: boolean;
}
function GameCard({ cardNumber, startOfGroup }: GameCardProps) {
  return (
    <div className={
      startOfGroup 
      ? `card-value-${cardNumber} relative rounded-md p-0.5 bg-white border border-2 w-[40px] h-[60px] flex flex-col justify-center items-center font-bold `
      : `card-value-${cardNumber} relative rounded-md p-0.5 bg-white border border-2 w-[40px] h-[60px] flex flex-col justify-start items-end text-sm ml-[-20px] font-bold`}>
        {cardNumber}
        
    </div>
  );
}
/*  - move left by 1rem */