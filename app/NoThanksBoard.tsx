
// import { useState, useEffect } from 'react';
import { NoThanksState } from './NoThanks';
import Image from 'next/image';

interface NoThanksBoardProps {
  gameState: NoThanksState;
  humanPlayer: number;
  playerNames: string[];
  actionHandler: (action: number) => void;
}

export default function NoThanksBoard({gameState, humanPlayer, playerNames, actionHandler} : NoThanksBoardProps) {

  // console.log(gameState.toString());

  return (
    <div className="flex flex-col gap-2 p-2 min-w-[24rem] max-w-[48rem]">
      <MessageArea message={`It is ${playerNames[gameState.currentPlayer]}'s turn.`} />

      <ActionButtonArea gameState={gameState} actionHandler={actionHandler} />

      <div className="pt-4 pb-4">
        <CommonPlayArea gameState={gameState} humanPlayer={humanPlayer} />
      </div>
      
      
      {Array.from({ length: gameState.game.numPlayers }).map((_, i) => (
        <PlayerArea key={i} gameState={gameState} humanPlayer={humanPlayer} playerNames={playerNames} playerIndex={i} />
      ))}
    </div>
  );
}


interface CommonPlayAreaProps {
  gameState: NoThanksState;
  humanPlayer: number;
}
function CommonPlayArea({ gameState, humanPlayer }: CommonPlayAreaProps) {
  return (
    <div className="flex flex-col border border-gray-200 border-dashed p-4 rounded-xl">
      
      <div className="flex flex-row justify-center items-center gap-2">
        {/* deck */}
        <div>
          <div className="rounded-md p-0.5 bg-gray-300 text-gray-600 text-sm w-[40px] h-[60px] flex flex-col justify-center items-center italic">
            {gameState.numCardsInDeck}
          </div>
        </div>

        {/* card in play */}
        {gameState.cardInPlay ? (
          <div>
            <GameCard cardNumber={gameState.cardInPlay} startOfGroup={true}/>
          </div>
        ) : (
            <div className="rounded-md p-0.5 bg-white border-gray-400 border border-2 border-dashed text-sm w-[40px] h-[60px] flex flex-col justify-center items-center italic">

              </div>)
              }
        {gameState && (
          <div>
            <Coin text={""+gameState.coinsInPlay} />
          </div>
        )}
      </div>  
    </div>
  )
}

interface PlayerAreaProps {
  gameState: NoThanksState;
  humanPlayer: number;
  playerNames: string[];
  playerIndex: number;
}
function PlayerArea({ gameState, humanPlayer, playerNames, playerIndex }: PlayerAreaProps) {
  return (
    
    <div className={`border-black border-dashed border border-gray-500 rounded-xl p-2 flex flex-row gap-1 items-start ${gameState.currentPlayer == playerIndex ? ' bg-[beige] ' : ' bg-white '}`}>
        
      {/* status area container */}
      <div className="flex flow-col justify-start grow-0 shrink-0">
        {/* status area */}
        <div className="bg-white border border-gray-200 border-dashed rounded-xl p-4 gap-2 flex flex-col w-[8rem]"> 
          {/* top of status area */}
          <div className="flex flex-row items-center gap-1">

            {/* player icon */}
            <div className="rounded bg-gray-100 w-[30px] h-[30px] flex flex-row items-center justify-center">
              {humanPlayer === playerIndex 
              ? (<Image src="human.svg" alt="icon of human" width={20} height={20} />)
              : (<Image src="bot.svg" alt="coin" width={20} height={20} />)}
            </div>
            
            {/* player name */}
            <div className={(playerIndex === 0 ? 'text-player-0' : (playerIndex === 1 ? 'text-player-1' : (playerIndex === 2 ? 'text-player-2' : 'text-player-3'))) + ` font-bold`}>
              {playerNames[playerIndex]}
            </div>
          </div> {/* end of top of status area */}

          {/* bottom of status area */}
          <div className="flex flex-row gap-2">
            <Coin text={""+gameState.playerCoins[playerIndex]} />
            <div className="flex flex-row items-center justify-center w-[30px]">
              <div className="absolute p-0 w-[30px]">
                <Image src="star_gray30.svg" alt="star" width={30} height={30} />
              </div>
              <div className="absolute p-0 font-bold">{gameState.playerScores[playerIndex]}</div>
            </div>
            
            

          </div> {/* end of bottom of status area */}

        </div> {/* end of status area */}
      </div> {/* end of status area container */}
      
      {/* cards area container */}
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

function ActionButton({ active, text, onClick }: { active: boolean, text: string, onClick: () => void }) {
  const activeClass = active ? 'bg-blue-500 hover:bg-blue-700' : 'bg-gray-300';
  return (
    <button className={`text-white font-bold py-2 px-4 rounded-xl ` + activeClass}
      onClick={onClick} {...(active ? {} : { disabled: true })}
    >
      {text}
    </button>
  );

}

interface ActionButtonAreaProps {
  gameState: NoThanksState;
  actionHandler: (action : number) => void;
}
function ActionButtonArea({ gameState, actionHandler }: ActionButtonAreaProps) {
  const takeButtonActive = gameState.getLegalActions().includes(NoThanksState.ACTION_TAKE);
  const passButtonActive = gameState.getLegalActions().includes(NoThanksState.ACTION_PASS);
  return (
    <div className="flex gap-2 flex-row justify-center">
        <ActionButton 
          active={takeButtonActive} 
          text="TAKE CARD" 
          onClick={() => actionHandler(NoThanksState.ACTION_TAKE)} />
        <ActionButton 
          active={passButtonActive} 
          text="PASS" 
          onClick={() => actionHandler(NoThanksState.ACTION_PASS)} />
    </div>
  );
}

function MessageArea({ message }: { message: string }) {
  return (
    <div className=" p-2 bg-[gold] flex flex-row justify-center font-bold">
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

function Coin({ text }: { text: string }) {
  return (
    <div className="rounded-[100%] bg-[orangered] h-[30px] w-[30px] text-white font-bold border border-black flex items-center justify-center">
      {text}
    </div>
  );
}