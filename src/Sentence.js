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
  const [accuracy, setAccuracy] = useState(null);
  const [feedbackWords, setFeedbackWords] = useState([]);
  const [buttonState, setButtonState] = useState('Start Speaking');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
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
    setAccuracy(null);
    setFeedbackWords(
      nextSentence.split(/(\s+|\n)/).map((word) => {
        if (word.trim() === '') return { word, correct: null };
        return { word, correct: null };
      })
    );
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
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;
    recognition.continuous = true;

    let finalTranscript = '';

    setButtonState('Speaking');
    setIsSpeaking(true);

    recognition.onresult = (event) => {
      let interim = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const result = event.results[i];
        if (result.isFinal) {
          finalTranscript += result[0].transcript + ' ';
        } else {
          interim += result[0].transcript;
        }
      }
      const fullText = finalTranscript.trim();
      setTranscript(fullText);
      evaluateAccuracy(currentSentence, fullText);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
    };

    recognition.onend = () => {
      setButtonState('Start Speaking');
      setIsSpeaking(false);
    };

    recognition.start();
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

  const evaluateAccuracy = (correctSentence, spokenText) => {
    const cleanAndSplit = (text) =>
      text
        .toLowerCase()
        .replace(/[^a-z.\s\n]/g, '')
        .split(/(\s+|\n)/);

    const correctWords = cleanAndSplit(correctSentence);
    const spokenWords = cleanAndSplit(spokenText);

    let matchCount = 0;
    let feedback = correctWords.map((word, i) => {
      if (word.trim() === '') return { word, correct: null };
      const spoken = spokenWords[i] || '';
      const isCorrect = spoken === word;
      if (isCorrect) matchCount++;
      return { word, correct: isCorrect };
    });

    const filteredCorrect = correctWords.filter(w => w.trim() !== '');
    const percent = Math.round((matchCount / filteredCorrect.length) * 100);
    setAccuracy(percent);
    setFeedbackWords(feedback);
  };

  const renderFeedback = () => {
    const mistakes = feedbackWords.filter(w => w.correct === false);
    if (mistakes.length === 0) return null;

    const uniqueMistakes = [...new Set(mistakes.map(w => w.word))];

    return (
      <div style={{ marginTop: '20px', background: '#fff3f3', padding: '15px', borderRadius: '10px', border: '1px solid #ffcdd2' }}>
        <h4 style={{ color: '#d32f2f', marginBottom: '10px' }}>⚠️ Mispronounced Words:</h4>
        <ul style={{ paddingLeft: '20px', margin: 0 }}>
          {uniqueMistakes.map((word, i) => (
            <li key={i} style={{ color: '#d32f2f', fontWeight: 'bold' }}>
              "{word}"
            </li>
          ))}
        </ul>
      </div>
    );
  };

  const handleNextSentence = () => {
  const list = sentences[difficulty];
  const nextIndex = (currentIndex + 1) % list.length;
  setCurrentIndex(nextIndex);
  setRandomSentence(difficulty, nextIndex);
};

  return (
    <div style={{ backgroundColor: '#f5f7fa', padding: '20px' }}>
      <div style={{ maxWidth: '700px', margin: '0 auto', padding: '30px', borderRadius: '20px', backgroundColor: '#fff', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
        {!loaded ? (
          <>
            <h1>📚 Loading Sentences</h1>
            <ProgressBar progress={progress} />
          </>
        ) : (
          <>
            <h2 style={{ marginBottom: '20px' }}>✅ Select Difficulty</h2>
            <div style={{ marginBottom: '20px' }}>
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

            <div style={{ marginBottom: '20px' }}>
              <p style={{ fontSize: '20px', fontWeight: 'bold', color: 'black', whiteSpace: 'pre-wrap' }}>📘 Sentence:
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
                ⏭ Next Sentence
              </button>
              </p>
         
              <p style={{ fontSize: '20px', fontWeight: 'bold', color: 'black', whiteSpace: 'pre-wrap', backgroundcolor: '#f0f8ff' }}>{currentSentence}</p>
              <p style={{ fontSize: '20px', fontWeight: 'bold', whiteSpace: 'pre-wrap' }}>
                {feedbackWords.map((item, index) => {
                  if (item.correct === null) {
                    return <span key={index} style={{ color: '#888', marginRight: '4px' }}>{item.word}</span>;
                  }
                  const color = item.correct ? 'green' : 'red';
                  return (
                    <span key={index} style={{ color, marginRight: '4px' }}>{item.word}</span>
                  );
                })}
              </p>
            </div>

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
                  backgroundColor: buttonState === 'Speaking' ? '#e53935' : '#1976d2'
                }}>
                {buttonState === 'Speaking' ? '🔴 Speaking' : '🎙 Start Speaking'}
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
                }}>🔊 Read</button>    
            </div>

            <div style={{ marginTop: '10px' }}>
              <p><strong>🗣 You said:</strong> {transcript}</p>
              <p><strong>🎯 Accuracy:</strong> {accuracy !== null ? `${accuracy}%` : '-'}</p>
              {renderFeedback()}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Sentence;
