import React, { useState, useEffect } from 'react';
import './GamePage.css';

function GamePage() {
  const [words, setWords] = useState(["apple", "banana", "computer", "science", "knowledge"]);
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentWord, setCurrentWord] = useState("");
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(30);

  useEffect(() => {
    if (isPlaying && timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isPlaying, timer]);

  useEffect(() => {
    if (words.length > 0) {
      const randomWord = words[Math.floor(Math.random() * words.length)];
      setCurrentWord(randomWord);
    }
  }, [words]);

  const handleWordDisappearance = () => {
    setScore((prevScore) => prevScore + 10);
    setWords(words.filter((word) => word !== currentWord));
  };

  return (
    <div className="game-container">
      <h1>Word Pronunciation Game</h1>
      <div className="game-info">
        <div className="word">{currentWord}</div>
        <p>Time left: {timer}s</p>
        <p>Score: {score}</p>
        {timer > 0 && (
          <button onClick={handleWordDisappearance}>Pronounce & Remove Word</button>
        )}
        {timer === 0 && <p>Game Over! Final Score: {score}</p>}
      </div>
    </div>
  );
}

export default GamePage;
