import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import HomePage from './HomePage';
import Sentence from './Sentence';
import Voca from './Voca';
import Header from './Header'; 
import PronunciationResources from './PronunciationResources'; 
import Footer from './Footer';

function App() {
  return (
    <Router>
      <div>
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/game_pronunciation" element={<Navigate to="/" replace />} />
          <Route path="/sentence" element={<Sentence />} />
          <Route path="/voca" element={<Voca />} />
          <Route path="/pronunciationResources" element={<PronunciationResources />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
