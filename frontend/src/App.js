import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Auth from './components/Auth/Auth';
import MainWindow from './components/MainWindow/MainWindow';
import EducationalGame from './components/EducationalGame/EducationalGame';
import Home from './pages/Home';
import Register from './pages/Register';
import './App.css';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/auth" element={<Auth />} />
        <Route path="/register" element={<Register />} />
        <Route path="/main" element={<MainWindow />} />
        <Route path="/game" element={<EducationalGame />} />
        <Route path="/articles" element={<Home />} />
        <Route path="/" element={<Navigate to="/main" replace />} />
        <Route path="*" element={<Navigate to="/main" replace />} />
      </Routes>
    </div>
  );
}

export default App;
