import React from 'react';
import { Link } from 'react-router-dom';

function HomePage() {
  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h1>Welcome to the Pronunciation Games!</h1>
      <div>
        <Link to="/sentence">
          <button
            style={{
              padding: '10px 20px',
              fontSize: '16px',
              cursor: 'pointer',
              backgroundColor: '#1976d2',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              margin: '10px'
            }}
          >
            Speaking Sentence
          </button>
        </Link>
        <Link to="/voca">
          <button
            style={{
              padding: '10px 20px',
              fontSize: '16px',
              cursor: 'pointer',
              backgroundColor: '#1976d2',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              margin: '10px'
            }}
          >
            Play Word Game
          </button>
        </Link>

        <Link to="/pronunciationResources">
          <button
            style={{
              padding: '10px 20px',
              fontSize: '16px',
              cursor: 'pointer',
              backgroundColor: '#1976d2',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              margin: '10px'
            }}
          >
            Pronunciation Resources
          </button>
        </Link>
      </div>
    </div>
  );
}

export default HomePage;
