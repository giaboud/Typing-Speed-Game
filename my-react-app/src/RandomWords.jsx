import React, { useState, useEffect } from "react";
import { WordList } from "../public/WordList";

export const generateRandomWord = () => {
    const randomIndex = Math.floor(Math.random() * WordList.length);
    return WordList[randomIndex];
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
  