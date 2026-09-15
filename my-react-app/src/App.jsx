import React, { useState, useEffect } from 'react';
import './App.css'
import GameArea from './GameArea'
import StatsPanel from './StatsPanel'


function App() {
  const [elapsedTime, setElapsedTime] = useState(0);
  const [lives, setLives] = useState(3);
  const [score, setScore] = useState(0);
  const [difficulty, setDifficulty] = useState(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameKey, setGameKey] = useState(0);

  useEffect(() => {

    // Timer 
    if (!gameStarted || lives === 0) return; 
    const timer = setInterval(() => {
      setElapsedTime((prevTime) => prevTime + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [gameStarted, lives]);

  // Start the game with the selected difficulty
  function startGame(level) { 
    setDifficulty(level);
    setGameStarted(true);
  }

  // Reset the game state to initial values
  function resetGame() {
    setElapsedTime(0);
    setLives(3);
    setScore(0);
    setDifficulty(null);
    setGameStarted(false);
    setGameKey((prevKey) => prevKey + 1);
  }

  return (
    <div>
      {/* Display stats only when the game has started */}
      {gameStarted && (
        <div className="stats-container">
          <div className="lives-display">Lives: {lives}</div>
          <div className="time-display">Time: {elapsedTime} seconds</div>
          <div className="score-display">Score: {score}</div>
        </div>
      )}
      {/* Game container: Show difficulty selection, game area, or restart button based on game state */}
      <div className="game-container">
        {!gameStarted ? ( 
          <div className="difficulty-select">
            <h1>Choose a difficulty</h1>
            <button className="reset-button" onClick={() => startGame('easy')}>Easy</button>
            <button className="reset-button" onClick={() => startGame('medium')}>Medium</button>
            <button className="reset-button" onClick={() => startGame('hard')}>Hard</button>
          </div>
        ) : lives > 0 ? (
          <GameArea
            key={gameKey}
            lives={lives}
            setLives={setLives}
            score={score}
            setScore={setScore}
            difficulty={difficulty}
          />
        ) : (
          // Game over state: Show final score and restart button
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