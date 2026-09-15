import React, { useState, useEffect } from "react";
import { WordList } from "../public/WordList";

export const generateRandomWord = (difficulty = 'easy', prevWord = null) => {
    const pool = WordList[difficulty] || WordList.easy; 
    if (pool.length <= 1) return pool[0]; // return first word if pool is empty
    let word;
    do{
      const randomIndex = Math.floor(Math.random() * pool.length);
      word = pool[randomIndex];
    } while (word === prevWord); // ensure new word is different from previous
    return word;
  };
  
  export default function RandomWords({ randomWord, setRandomWord }) {
    useEffect(() => {
      setRandomWord(generateRandomWord());
    }, [setRandomWord]);
  
    return (
      <div className="random-words-container">
        <h2 className="random-word">{randomWord}</h2>
      </div>
    );
  }
  