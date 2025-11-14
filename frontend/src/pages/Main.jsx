import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Main.css';

export default function Main() {
  const navigate = useNavigate();

  return (
    <div className="main-page">
      <div className="main-container">
        <div className="mascot-container">
          <div className="mascot">
            <div className="mascot-face">
              <div className="mascot-eye left-eye"></div>
              <div className="mascot-eye right-eye"></div>
              <div className="mascot-mouth"></div>
            </div>
          </div>
        </div>
        
        <div className="main-buttons">
          <button 
            className="main-button primary-button"
            onClick={() => navigate('/articles')}
          >
            📰 Статьи
          </button>
          <button 
            className="main-button secondary-button"
            onClick={() => navigate('/profile')}
          >
            👤 Профиль
          </button>
          <button 
            className="main-button secondary-button"
            onClick={() => {
              localStorage.removeItem('isAuthenticated');
              navigate('/login');
            }}
          >
            🚪 Выйти
          </button>
        </div>
      </div>
    </div>
  );
}

