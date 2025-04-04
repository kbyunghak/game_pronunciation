// This version includes redesigned sections with distinct background colors
// and improved sensitivity selection layout

import React, { useState, useEffect, useRef } from 'react';
import sentences from './data/sentences.json';

function ProgressBar({ progress }) {
  return (
    <div style={{ width: '80%', backgroundColor: '#eee', borderRadius: '5px', margin: '20px auto' }}>
      <div
        style={{
          width: `${progress}%`,
          height: '20px',
          backgroundColor: '#4caf50',
          borderRadius: '5px',
          transition: 'width 0.3s ease'
        }}
      />
    </div>
  );
}

function Sentence() {
  const [progress, setProgress] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [difficulty, setDifficulty] = useState('beginner');
  const [currentSentence, setCurrentSentence] = useState('');
  const [transcript, setTranscript] = useState('');
  const [finalAccuracy, setFinalAccuracy] = useState(null);
  const [finalFeedback, setFinalFeedback] = useState([]);
  const [buttonState, setButtonState] = useState('Start Speaking');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [sensitivity, setSensitivity] = useState('Normal');
  const recognitionRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setLoaded(true);
          setRandomSentence(difficulty, 0);
          return 100;
        }
        return prev + 10;
      });
    }, 150);
  }, []);

  const setRandomSentence = (level, index) => {
    const list = sentences[level];
    const nextSentence = list[index % list.length];
    setCurrentSentence(nextSentence);
    setTranscript('');
    setFinalAccuracy(null);
    setFinalFeedback([]);
  };

  const handleLevelChange = (level) => {
    if (recognitionRef.current) {
      recognitionRef.current.abort();
      recognitionRef.current = null;
    }
    window.speechSynthesis.cancel();
    setDifficulty(level);
    setRandomSentence(level, 0);
  };

  const handleStartSpeaking = () => {
    if (isSpeaking) {
      recognitionRef.current?.stop();
      setButtonState('Start Speaking');
      setIsSpeaking(false);
      return;
    }

    setFinalAccuracy(null);
    setFinalFeedback([]);
    setTranscript('');

    if (recognitionRef.current) {
      recognitionRef.current.abort();
      recognitionRef.current = null;
    }
    window.speechSynthesis.cancel();

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech Recognition is not supported in this browser');
      return;
    }

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.continuous = true;

    let tempTranscript = '';

    setButtonState('Stop Speaking');
    setIsSpeaking(true);

    recognition.onresult = (event) => {
      const result = event.results[event.results.length - 1][0].transcript.trim();
      tempTranscript += ' ' + result;
      setTranscript(tempTranscript.trim());

      if (difficulty === 'beginner') {
        clearTimeout(recognitionRef.current._timeout);
        recognitionRef.current._timeout = setTimeout(() => recognition.stop(), 2000);
      }
    };

    recognition.onend = () => {
      setButtonState('Start Speaking');
      setIsSpeaking(false);

      if (tempTranscript) {
        const wordsCorrect = evaluateWords(currentSentence, tempTranscript.trim(), sensitivity);
        setFinalFeedback(wordsCorrect);
        const totalCorrect = wordsCorrect.filter(w => w.correct).length;
        const totalWords = wordsCorrect.filter(w => w.word.trim() !== '').length;
        const percent = Math.round((totalCorrect / totalWords) * 100);
        setFinalAccuracy(percent);
      }
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
    };

    recognition.start();
  };

  const isSimilar = (a, b, level = 'Normal') => {
    if (!a || !b) return false;
    const normalize = (str) => str.toLowerCase().replace(/[.,!?]/g, '');
    const w1 = normalize(a);
    const w2 = normalize(b);

    let matches = 0;
    const minLen = Math.min(w1.length, w2.length);
    for (let i = 0; i < minLen; i++) {
      if (w1[i] === w2[i]) matches++;
    }
    const similarity = matches / Math.max(w1.length, w2.length);

    const threshold = level === 'Strict' ? 0.98 : level === 'Normal' ? 0.75 : 0.1;
    return similarity >= threshold;
  };

  const evaluateWords = (correctSentence, spokenSentence, level) => {
    const normalize = (text) =>
      text.toLowerCase().replace(/[.,!?]/g, '').split(/\s+/);
    const originalWords = correctSentence.split(/\s+/);
    const spokenWords = normalize(spokenSentence);

    return originalWords.map((word, i) => {
      const normalized = word.toLowerCase().replace(/[.,!?]/g, '');
      const spoken = spokenWords[i] || '';
      return {
        word: spoken,
        correct: spoken === normalized || isSimilar(spoken, normalized, level)
      };
    });
  };

  const handleNextSentence = () => {
    const list = sentences[difficulty];
    const nextIndex = (currentIndex + 1) % list.length;
    setCurrentIndex(nextIndex);
    setRandomSentence(difficulty, nextIndex);
  };

  const handleReadSentence = () => {
    if (recognitionRef.current) {
      recognitionRef.current.abort();
      recognitionRef.current = null;
    }
    window.speechSynthesis.cancel();

    const speech = new SpeechSynthesisUtterance(currentSentence);
    speech.lang = 'en-US';
    window.speechSynthesis.speak(speech);
  };

  return (
    <div style={{ backgroundColor: '#f5f7fa', padding: '20px' }}>
      <div style={{
        maxWidth: '700px',
        margin: '0 auto',
        padding: '30px',
        borderRadius: '20px',
        backgroundColor: '#fff',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
      }}>
        {!loaded ? (
          <>
            <h1>⏳ Loading Sentences</h1>
            <ProgressBar progress={progress} />
          </>
        ) : (
          <>
            {/* Difficulty Section */}
            <div style={{ backgroundColor: '#e3f2fd', padding: '20px', borderRadius: '12px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <h3 style={{ marginBottom: '10px' }}>🧠 Difficulty</h3>
                {['beginner', 'intermediate', 'advanced'].map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => handleLevelChange(lvl)}
                    style={{
                      backgroundColor: difficulty === lvl ? '#1976d2' : '#fff',
                      color: difficulty === lvl ? '#fff' : '#1976d2',
                      border: '2px solid #1976d2',
                      padding: '10px 14px',
                      borderRadius: '10px',
                      fontWeight: 'bold',
                      margin: '0 6px',
                      cursor: 'pointer'
                    }}>
                    {lvl === 'beginner' ? '📘 Beginner' : lvl === 'intermediate' ? '📗 Intermediate' : '📕 Advanced'}
                  </button>
                ))}
              </div>
            </div>

            {/* Sensitivity Section */}
            <div style={{ backgroundColor: '#fff3e0', padding: '20px', borderRadius: '12px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <h3 style={{ marginBottom: '10px' }}>🎚️ Sensitivity</h3>
                {['Strict', 'Normal', 'Loose'].map((level) => (
                  <button
                    key={level}
                    onClick={() => setSensitivity(level)}
                    style={{
                      backgroundColor: sensitivity === level ? '#fb8c00' : '#fff',
                      color: sensitivity === level ? '#fff' : '#fb8c00',
                      border: '2px solid #fb8c00',
                      padding: '10px 14px',
                      borderRadius: '10px',
                      fontWeight: 'bold',
                      margin: '0 6px',
                      cursor: 'pointer'
                    }}>
                    {level === 'Strict' ? '🔒 Strict' : level === 'Normal' ? '⚖️ Normal' : '🎈 Loose'}
                  </button>
                ))}
              </div>
            </div>

            {/* Sentence Section */}
            <div style={{ backgroundColor: '#f1f8e9', padding: '20px', borderRadius: '12px', marginBottom: '20px' }}>
              <p style={{ fontSize: '20px', fontWeight: 'bold', color: 'black' }}>
                ✍️ Sentence:
                <button
                  onClick={handleNextSentence}
                  style={{
                    padding: '10px 20px',
                    color: 'white',
                    border: 'none',
                    borderRadius: '15px',
                    fontWeight: 'bold',
                    fontSize: '16px',
                    backgroundColor: '#9c27b0',
                    marginLeft: '10px',
                    float: "right"
                  }}>
                  👉 Next Sentence
                </button>
              </p>
              <p style={{ fontSize: '20px', fontWeight: 'bold', color: 'black' }}>{currentSentence}</p>
              <p style={{ fontSize: '20px', fontWeight: 'bold' }}>🎤 You said:</p>
              <div style={{ fontSize: '20px', whiteSpace: 'pre-wrap', wordBreak: 'break-word', overflowWrap: 'break-word' }}>
                {finalFeedback.map((item, index) => {
                  const color = item.correct === null ? '#888' : item.correct ? 'green' : 'red';
                  return <span key={index} style={{ color, marginRight: '4px' }}>{item.word}</span>;
                })}
              </div>
              <p style={{ fontSize: '20px', fontWeight: 'bold', color: '#2e7d32' }}>📊 Accuracy: {finalAccuracy !== null ? `${finalAccuracy}%` : '-'}</p>
            </div>

            {/* Controls */}
            <div>
              <button
                onClick={handleStartSpeaking}
                style={{
                  padding: '10px 20px',
                  color: 'white',
                  border: 'none',
                  borderRadius: '15px',
                  fontWeight: 'bold',
                  fontSize: '16px',
                  marginBottom: '20px',
                  marginRight: '10px',
                  backgroundColor: buttonState === 'Stop Speaking' ? '#e53935' : '#1976d2'
                }}>
                {buttonState === 'Stop Speaking' ? '🛑 Stop Speaking' : '🎙 Start Speaking'}
              </button>
              <button
                onClick={handleReadSentence}
                style={{
                  padding: '10px 20px',
                  color: 'white',
                  border: 'none',
                  borderRadius: '15px',
                  fontWeight: 'bold',
                  fontSize: '16px',
                  backgroundColor: '#4caf50'
                }}>📢 Read</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Sentence;
