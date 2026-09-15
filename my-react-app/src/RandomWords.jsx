import React, { useState, useEffect } from "react";
import { WordList } from "../WordList";

export const generateRandomWord = (difficulty = 'easy') => {
    const pool = WordList[difficulty] || WordList.easy; 
    const randomIndex = Math.floor(Math.random() * pool.length);
    return pool[randomIndex];
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
  