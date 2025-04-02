import React, { useState, useEffect, useRef } from 'react';
import sentences from './data/sentences.json';

function Voca() {
  const canvasRef = useRef(null);
  const recognitionRef = useRef(null);
  const spawnIntervalRef = useRef(null);
  const animationRef = useRef(null);

  const [fallingWords, setFallingWords] = useState([]);
  const [spokenWord, setSpokenWord] = useState('');
  const [spokenCorrectWords, setSpokenCorrectWords] = useState(new Set());
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [lives, setLives] = useState(20);
  const [isGameActive, setIsGameActive] = useState(false);
  const [missedWords, setMissedWords] = useState([]);
  const words = sentences.hardWords;

  const canvasHeight = 700;
  const wordFontSize = 20;
  const wordColor = '#1976d2';
  const hasStartedRef = useRef(false);

  const getFallSpeed = () => Math.max(250 - level * 10, 30); // slower
  const calculatePixelsPerFrame = () => canvasHeight / (getFallSpeed() * 60);
  const [pixelsPerFrame, setPixelsPerFrame] = useState(calculatePixelsPerFrame());

  useEffect(() => {
    setPixelsPerFrame(calculatePixelsPerFrame());
  }, [level]);

  useEffect(() => {
    if (!isGameActive) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvasHeight);
      ctx.font = `${wordFontSize}px Arial`;
      ctx.fillStyle = wordColor;

      fallingWords.forEach((word) => ctx.fillText(word.text, word.x, word.y));

      setFallingWords((prev) => {
        const updated = prev.map((w) => ({ ...w, y: w.y + pixelsPerFrame }));
        return updated.filter((w) => {
          if (w.y >= canvasHeight) {
            setLives((l) => l - 1);
            setMissedWords((m) => (m.includes(w.text) ? m : [...m, w.text]));
            return false;
          }
          return true;
        });
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationRef.current);
  }, [isGameActive, pixelsPerFrame, fallingWords]);

  const startRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return alert('Speech Recognition not supported');

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.continuous = true;
    recognition.interimResults = false;

    recognition.onresult = (e) => {
      const transcript = e.results[e.results.length - 1][0].transcript.trim().toLowerCase();
      setSpokenWord(transcript);
      const spokenWords = transcript.split(' ');

      setFallingWords((prev) => {
        let updated = [...prev];
        spokenWords.forEach((spoken) => {
          const index = updated.findIndex((w) => w.text.toLowerCase() === spoken);
          if (index !== -1) {
            const matchedWord = updated.splice(index, 1)[0].text;
            setSpokenCorrectWords((prevSet) => new Set(prevSet).add(matchedWord));
            setScore((prevScore) => {
              const newScore = prevScore + 10;
              if (newScore % 200 === 0 && level < 10) {
                setLevel((lvl) => lvl + 1);
              }
              return newScore;
            });
          }
        });
        return updated;
      });
    };

    // 🔄 Prevent mic auto-close
    recognition.onend = () => {
      if (isGameActive) recognition.start();
    };

    recognition.start();
    recognitionRef.current = recognition;
  };

  const stopRecognition = () => {
    recognitionRef.current?.stop();
    recognitionRef.current = null;
  };

  const getMaxWordsByLevel = (level) => {
    const limits = [5, 8, 10, 12, 14, 16, 18, 20, 22, 24];
    return limits[Math.min(level - 1, limits.length - 1)];
  };

  const handleStartGame = () => {
    setScore(0);
    setLevel(1);
    setLives(20);
    setMissedWords([]);
    setSpokenWord('');
    setSpokenCorrectWords(new Set());
    setFallingWords([]);
    setIsGameActive(true);
    hasStartedRef.current = true;
    setPixelsPerFrame(calculatePixelsPerFrame());
    startRecognition();

    // ⏱ First word immediately
    setFallingWords(() => {
      const word = words[Math.floor(Math.random() * words.length)];
      const x = Math.random() * (canvasRef.current.width - 80);
      return [{ text: word, x, y: 0 }];
    });

    // ⏱ Then interval
    spawnIntervalRef.current = setInterval(() => {
      setFallingWords((prev) => {
        if (prev.length >= getMaxWordsByLevel(level)) return prev;
        const word = words[Math.floor(Math.random() * words.length)];
        const x = Math.random() * (canvasRef.current.width - 80);
        return [...prev, { text: word, x, y: 0 }];
      });
    }, 2000); // slower interval
  };

  useEffect(() => {
    if (isGameActive && lives === 0) {
      setIsGameActive(false);
      stopRecognition();
      clearInterval(spawnIntervalRef.current);
      cancelAnimationFrame(animationRef.current);
    }
  }, [lives, isGameActive]);

  useEffect(() => {
    const resizeCanvas = () => {
      canvasRef.current.width = window.innerWidth * 0.9;
    };
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    return () => window.removeEventListener('resize', resizeCanvas);
  }, []);

  return (
    <div style={{ backgroundColor: '#f5f7fa', padding: '20px' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '20px', backgroundColor: '#fff', borderRadius: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
        <h1 style={{ textAlign: 'center' }}>🎤 Word Pronunciation Game</h1>

        <div style={{ padding: '10px 15px', border: '1px solid #ccc', borderRadius: '10px', backgroundColor: '#f0f8ff' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <p>📈 <strong>Level:</strong> {level}</p>
            <p>💯 <strong>Score:</strong> {score}</p>
            <p>❤️ <strong>Lives:</strong>{' '}
                <span style={{ display: 'inline-block', minWidth: '300px' }}>
                  {'❤️'.repeat(lives)}
                </span>
            </p>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <p>🗣️ <strong>You said:</strong> {spokenWord}</p>
            <p>🎯 <strong>Accuracy:</strong> {Math.round((spokenCorrectWords.size / (spokenCorrectWords.size + missedWords.length)) * 100)}%</p>
          </div>
        </div>

        <canvas
          ref={canvasRef}
          height={canvasHeight}
          style={{
            width: '100%',
            border: '2px solid #1976d2',
            borderRadius: '12px',
            backgroundColor: '#f9f9f9',
            display: 'block',
            margin: '20px auto',
          }}
        />

        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <button
            onClick={handleStartGame}
            disabled={isGameActive}
            style={{
              padding: '10px 20px',
              backgroundColor: isGameActive ? '#ccc' : '#1976d2',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              fontWeight: 'bold',
              fontSize: '16px',
              cursor: isGameActive ? 'not-allowed' : 'pointer',
            }}
          >
            ▶️ Start Game
          </button>
          <div style={{ fontWeight: 'bold', marginTop: '15px' }}>
            {isGameActive && '🎮 Game Start'}
            {!isGameActive && lives === 20 && !hasStartedRef.current && score === 0 && '🎮 Please click Start Game button.'}
            {!isGameActive && lives === 0 && hasStartedRef.current && `🎮 Game Over! Final Score: ${score}`}
            {!isGameActive && lives > 0 && level > 11 && '🎉 Game Result: Mission Complete!'}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
          {spokenCorrectWords.size > 0 && (
            <div style={{ color: 'green', width: '48%' }}>
              <h4>✅ Correct Words:</h4>
              <ul>{[...spokenCorrectWords].map((word, i) => <li key={i}>{word}</li>)}</ul>
            </div>
          )}
          {missedWords.length > 0 && (
            <div style={{ color: 'red', width: '48%' }}>
              <h4>❌ Missed Words:</h4>
              <ul>{missedWords.map((word, i) => <li key={i}>{word}</li>)}</ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Voca;
