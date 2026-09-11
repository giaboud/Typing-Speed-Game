import React, { useState, useEffect } from 'react';
import './App.css'
import GameArea from './GameArea'
import StatsPanel from './StatsPanel'


function App() {
  const [elapsedTime, setElapsedTime] = useState(0);
  const [lives, setLives] = useState(3);  
  const [score, setScore] = useState(0);

  // let letter = 0; // tracks the number of correct letters

  /** Timer when game starts*/ 
  useEffect(() => {
        // if (index >= WordList.length) return; // stop the timer when the game is over
        const timer = setInterval(() => {
          if( lives == 0) return;
          setElapsedTime((prevTime) => prevTime + 1);
        }, 1000);
      
        return () => clearInterval(timer);
      }, [lives]); 

      function resetGame(){
        setElapsedTime(0);
        setLives(3);
        setScore(0);
      }

  return (
    <div>
      <div className = "stats-container">
        <div className="lives-display">Lives: {lives}</div>
        <div className="time-display">Time: {elapsedTime} seconds</div>
        <div className="score-display">Score: {score}</div>
      </div>
      <div className = "game-container">
        {/** Scores and lives display */}
        {lives > 0 ? (
          <GameArea lives={lives} setLives={setLives} score={score} setScore={setScore}/>
        ) : (
          <>
            <StatsPanel score={score} elapsedTime={elapsedTime} lives={lives} />
            <button className="reset-button" onClick={resetGame}>Restart Game</button>
          </>
        )}
      </div>
    </div>
  );
}

export default App