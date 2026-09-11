import React, {useState} from 'react'

function StatsPanel({score, elapsedTime}) {
    return (
        <>
        <h1>Game Over</h1>
        <h2>Words Correct: {score}</h2>
        <h2>Elapsed Time: {elapsedTime} seconds</h2>
        <h2>Words per Minute: {Math.round(score / elapsedTime * 60 )}</h2>
      </>
    )
}

export default StatsPanel;