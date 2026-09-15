import React, { useState, useEffect, useRef } from 'react';
import { generateRandomWord } from './RandomWords';

const BOTTOM_BUFFER = 60;
const DIFFICULTY_SETTINGS = {
  easy: {fallSpeed:150, moveSpeed: 150},
  medium: {fallSpeed: 100, moveSpeed: 100},
  hard: {fallSpeed: 50, moveSpeed: 50},
};

export default function GameArea({lives, score, setLives, setScore, difficulty}) {

  const { fallSpeed, moveSpeed } = DIFFICULTY_SETTINGS[difficulty] || DIFFICULTY_SETTINGS.easy;

  const [inputValue, setInputValue] = useState('');
  const [charIndex, setCharIndex] = useState(0);
  const [correctWrong, setCorrectWrong] = useState([]); // array to keep track of correct and wrong characters
  const[randomWord, setRandomWord] = useState("");
  const inputRef = useRef(null); // keeping track of the input field

  const [falling, setFalling] = useState(false); // Whether the word is falling
  const [fallPosition, setFallPosition] = useState(0); // Track vertical position of the word

  // falling animation
   // Handle falling word (fall every second if not typing)
   // falling and rising animation: Increase vertical position if the user isn't typing, rise a little when correct typing
  useEffect(() => {
    if (falling) {
      const interval = setInterval(() => {
        setFallPosition((prev) => prev + 1); 
      }, fallSpeed);

      return () => clearInterval(interval); // Clean up interval when falling stops
    }
  }, [falling, fallSpeed]);

  useEffect(() => {
    if (charIndex < randomWord.length) { 
      const interval = setInterval(() => {
        setLeftPosition((prev) => prev + 1);
      }, moveSpeed);
      return () => clearInterval(interval);
    }
  }, [charIndex, moveSpeed]);

  // detect when the word reaches the bottom of the screen, reset the word and lose a life
  useEffect(() => {
    if (lives == 0) return;
    const absoluteTop = window.innerHeight / 2 + fallPosition; // word's real position from the top of the screen since starting offset
    if (absoluteTop >= window.innerHeight - BOTTOM_BUFFER) {
      setFalling(false);
      setLives((prevLives) => Math.max(0, prevLives - 1));
      setInputValue('');
      setCharIndex(0);
      setRandomWord(generateRandomWord());
    }
  }, [fallPosition]);



  // generate ran word
 useEffect(() => {
    setRandomWord(generateRandomWord(difficulty));
  }, [difficulty]);




  // focus on input when new word is generated
  useEffect(() => {
    
    setCorrectWrong(Array(randomWord.length).fill('')); // reset styles when new word changes
    if(inputRef.current) inputRef.current.focus();
    setFalling(true); // Start falling when new word is generated
   setFallPosition(0); // Reset fall position when new word is generated

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
        setFallPosition((prev) => Math.max(prev - 5, 0)); // Rise a little (e.g., -10px)

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
        setRandomWord(generateRandomWord(difficulty));
        setFalling(true);
        
    } else{
        setInputValue(event.target.value);
    }
};

  return (
        <div className="word-container">
      <div
        className={`word-display ${falling ? 'falling' : ''}`}
        style={{ top: `${fallPosition}px`, left: `${leftPosition}px` }}
      >
        {randomWord.split('').map((char, index) => (
          <span
            key={index}
            className={`char ${correctWrong[index]} ${index === charIndex ? 'active' : ''}`}
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
        onChange={(event) => setInputValue(event.target.value)}
      />
    </div>
  );

}