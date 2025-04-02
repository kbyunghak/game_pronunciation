import React from 'react';

function PronunciationResources() {
  return (
    <div style={{ backgroundColor: '#f5f7fa', padding: '40px 20px' }}>
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        padding: '30px',
        backgroundColor: '#fff',
        borderRadius: '20px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>🔊 Pronunciation Resources</h2>

        <h3>🎯 Practice Tools</h3>
        <ul>
          <li>
            <a href="https://elsaspeak.com/en/" target="_blank" rel="noopener noreferrer">
              Elsa Speak
            </a> – AI feedback on pronunciation.
          </li>
          <li>
            <a href="https://goldenspeaker.engl.iastate.edu/speech/" target="_blank" rel="noopener noreferrer">
              Golden Speaker Builder
            </a> – Create a custom pronunciation model.
          </li>
          <li>
            Google Speech-to-Text – Use to test how understandable your speech is.
          </li>
        </ul>

        <h3>🎧 Listening Resources</h3>
        <ul>
          <li>
            <a href="https://soundsofspeech.uiowa.edu/index.html#english" target="_blank" rel="noopener noreferrer">
              Sounds of Speech
            </a> – Learn English sounds (app).
          </li>
          <li>
            <a href="https://www.englishaccentcoach.com/" target="_blank" rel="noopener noreferrer">
              English Accent Coach
            </a> – Train your listening accuracy.
          </li>
          <li>
            <a href="https://apps.apple.com/ca/app/english-accent-coach-asteroids/id1607018351" target="_blank" rel="noopener noreferrer">
              English Accent Coach: Asteroids (iOS)
            </a>
          </li>
        </ul>

        <h3>📚 Dictionaries & Tools</h3>
        <ul>
          <li>
            <a href="https://www.dictionary.com" target="_blank" rel="noopener noreferrer">
              Dictionary.com
            </a>
          </li>
          <li>
            <a href="https://forvo.com/languages/en/" target="_blank" rel="noopener noreferrer">
              Forvo
            </a> – Native pronunciation clips.
          </li>
          <li>
            <a href="https://youglish.com/" target="_blank" rel="noopener noreferrer">
              Youglish
            </a> – Hear real usage in videos.
          </li>
          <li>
            <a href="https://www.naturalreaders.com/online/" target="_blank" rel="noopener noreferrer">
              Natural Readers
            </a> – Text-to-speech online reader.
          </li>
        </ul>

        <p style={{ marginTop: '30px' }}>
          🗨️ <strong>Tip:</strong> Practice regularly and listen carefully. If you'd like to practice together, let us know!
        </p>
      </div>
    </div>
  );
}

export default PronunciationResources;
