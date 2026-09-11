import React, { useState, useEffect, useRef } from 'react';
import './animation.css';
import { generateRandomWord } from './RandomWords';

export default function GameArea({lives, score, setLives, setScore}) {

  const [inputValue, setInputValue] = useState('');
  const [charIndex, setCharIndex] = useState(0);
  const [correctWrong, setCorrectWrong] = useState([]); // array to keep track of correct and wrong characters
  const[randomWord, setRandomWord] = useState("");
  const inputRef = useRef(null); // keeping track of the input field

  const [falling, setFalling] = useState(false); // Whether the word is falling
  const [fallPosition, setFallPosition] = useState(0); // Track vertical position of the word
  const [leftPosition, setLeftPosition] = useState(0); // Track horizontal position of the word

  // falling animation
   // Handle falling word (fall every second if not typing)
   // falling and rising animation: Increase vertical position if the user isn't typing, rise a little when correct typing
  useEffect(() => {
    if (falling) {
      const interval = setInterval(() => {
        setFallPosition((prev) => prev + 1); // Increase fall position every 100ms
      }, 100);

      return () => clearInterval(interval); // Clean up interval when falling stops
    }
  }, [falling]);

  // move word horizontally
  useEffect(() => {
    if (charIndex < randomWord.length) {
      const interval = setInterval(() => {
        setLeftPosition((prev) => prev + 1); // Move word to the right by 1 pixel every 100ms
      }, 100);

      return () => clearInterval(interval); // Stop moving the word when the word is fully typed
    }
  }, [charIndex]);



  // generate ran word
  useEffect(() => {
    setRandomWord(generateRandomWord());
  }, []);



  // focus on input when new word is generated
  useEffect(() => {
    
    setCorrectWrong(Array(randomWord.length).fill('')); // reset styles when new word changes
    if(inputRef.current) inputRef.current.focus();
    setFalling(true); // Start falling when new word is generated
   setFallPosition(0); // Reset fall position when new word is generated
    setLeftPosition(0); // Start from the left side of the screen
  }, [randomWord]);

  const handleKeyDown = (event) => {
    if (lives === 0) return; // game over
    let userInput = event.key;
    let currentChar = randomWord[charIndex]; // character to match

    let updatedCorrectWrong = [...correctWrong]; 

    // handle backspaces to allow users to fix their mistakes
    if(userInput === 'Backspace'){
      if (charIndex > 0) {
        setCharIndex(charIndex - 1); // move back to prev character
        setCorrectWrong((prev) => { 
          const updated = [...prev];
          updated[charIndex - 1] = ''; // clear feedback for the last character
          return updated;
        });
      }
      return;
    }

    if(charIndex < randomWord.length){ // check if the user has typed the correct character
        if(userInput === currentChar){
          updatedCorrectWrong[charIndex] = 'correct'; // "correct style"
            setCharIndex(charIndex + 1);
            
            // Stop falling and rise slightly
        setFalling(false);
        setFallPosition((prev) => Math.max(prev - 10, 0)); // Rise a little (e.g., -10px)

        // After rising, start falling again
        setTimeout(() => setFalling(true), 500);
        } else{
           updatedCorrectWrong[charIndex] = 'wrong'; // "wrong style"
           setLives((prevLives) => Math.max(0, prevLives - 1));
        }
        
    }
    setCorrectWrong(updatedCorrectWrong);
    
    // check if the user has typed the correct word
    console.log('Char Index:', charIndex);
    console.log('Random Word Length:', randomWord.length);
    if(charIndex  === randomWord.length - 1){
      setInputValue('');
        setScore(score + 1);
        setCharIndex(0);
        setRandomWord(generateRandomWord());
        setFalling(true);
        
    } else{
        setInputValue(event.target.value);
    }
};

  return (
    <div className = "word-container">
      <div   className={`word-display ${falling ? 'falling' : ''}`} // Apply falling animation if word is falling
        style={{
          top: `${fallPosition}px`,
          left: `${leftPosition}px`, // Move word horizontally
        }} // Apply falling animation if word is falling
      >
        {randomWord.split('').map((char, index) => ( // split character
          <span
            key = {index}
            className = {`char ${correctWrong[index]} ${ // apply styles per character
              index === charIndex ? 'active' : ''}`} // highlight the current character
          >
            {char}
          </span>
        ))}
      </div>
      <input
        type="text"
        className="input-field"
        value={inputValue}
        ref={inputRef}
        onKeyDown={handleKeyDown}
        onChange = {(event) => setInputValue(event.target.value)}
      />
      {/* <div className="score-lives">
        <p>Score: {score}</p>
        <p>Lives: {lives}</p>
      </div> */}
    </div>
  );
}