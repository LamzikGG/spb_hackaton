import React, { useState } from 'react';
import Auth from './components/Auth/Auth';
import MainWindow from './components/MainWindow/MainWindow';
import EducationalGame from './components/EducationalGame/EducationalGame';
import './App.css';

function App() {
  const [currentView, setCurrentView] = useState('auth');
  const [userName, setUserName] = useState('');

  const handleLogin = (username) => {
    console.log('Login/Registration successful for user:', username);
    setUserName(username || 'User');
    setCurrentView('main');
  };

  const handleStartGame = () => {
    setCurrentView('game');
  };

  const handleBackToMain = () => {
    setCurrentView('main');
  };

  const handleLogout = () => {
    setUserName('');
    setCurrentView('auth');
  };

  return (
    <div className="App">
      {currentView === 'auth' && <Auth onLogin={handleLogin} />}
      {currentView === 'main' && (
        <MainWindow 
          onLogout={handleLogout} 
          onStartGame={handleStartGame}
          userName={userName}
        />
      )}
      {currentView === 'game' && (
        <EducationalGame onBack={handleBackToMain} />
      )}
    </div>
  );
}

export default App;