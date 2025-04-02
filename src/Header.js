import React from 'react';
import { Link } from 'react-router-dom';

const headerStyle = {
  backgroundColor: '#1976d2',
  padding: '10px 20px',
  display: 'flex',
  justifyContent: 'center',
  gap: '20px',
  borderBottom: '2px solid #ccc',
};

const linkStyle = {
  color: 'white',
  textDecoration: 'none',
  fontWeight: 'bold',
  fontSize: '18px',
};

function Header() {
  return (
    <div style={headerStyle}>
      <Link to="/" style={linkStyle}>🏠 Home</Link>
      <Link to="/sentence" style={linkStyle}>🗣 Sentence</Link>
      <Link to="/voca" style={linkStyle}>🎮 Word Game</Link>
      <Link to="/pronunciationResources" style={linkStyle}>🧠 Pronunciation Resources</Link>
    </div>
  );
}

export default Header;
