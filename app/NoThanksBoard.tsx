
// import { useState, useEffect } from 'react';
import { NoThanksState } from './NoThanks';

interface NoThanksBoardProps {
  gameState: NoThanksState;
  actionHandler: (action: number) => void;
}

export default function NoThanksBoard({gameState, actionHandler} : NoThanksBoardProps) {

  console.log(gameState.toString());

  return (
    <div className="border-2 border-black flex flex-col gap-2 p-2 max-w-2xl">
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
            <div key={i} className="flex flex-row-reverse">
              {/* iterate through each card in reverse order */}
              {}

              {cardGroup.slice().reverse().map((cardNumber, j) => (
                /* set startOfGroup to true for last card in group */
                <GameCard key={j} cardNumber={cardNumber} startOfGroup={j === cardGroup.length - 1} />                

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
function NoThanksActionArea({ actionHandler }: NoThanksActionAreaProps) {
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

interface GameCardProps {
  cardNumber: number;
  startOfGroup: boolean;
}
function GameCard({ cardNumber, startOfGroup }: GameCardProps) {
  return (
    <div className={
      startOfGroup 
      ? `relative rounded-md p-0.5 border border-black w-[40px] h-[60px] flex flex-col justify-center items-center font-bold bg-white`
      : `relative rounded-md p-0.5 bg-white border border-black w-[40px] h-[60px] flex flex-col justify-start items-end text-sm ml-[-20px]`}>
      {cardNumber}
      {/*<div className="text-xs self-end">{cardNumber}</div>*/}
      
      {/*<div className="text-xs self-start">&nbsp;</div>*/}
    </div>
  );
}
/*  - move left by 1rem */