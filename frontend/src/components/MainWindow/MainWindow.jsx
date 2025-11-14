import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './MainWindow.css';

const MainWindow = ({ onLogout, onStartGame, userName: propUserName }) => {
  const navigate = useNavigate();
  // Get username from prop, localStorage, or default
  const userName = propUserName || localStorage.getItem('username') || 'Пользователь';
  const [chatMessage, setChatMessage] = useState('');
  const [messages, setMessages] = useState([
    { type: 'bot', text: 'Привет! Я нейросеть-помощник. Чем могу помочь?' }
  ]);
  const [userRating, setUserRating] = useState(150);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;

    // Добавляем сообщение пользователя
    const userMsg = { type: 'user', text: chatMessage };
    setMessages(prev => [...prev, userMsg]);
    
    // Имитируем ответ нейросети
    setTimeout(() => {
      const botResponses = [
        "Интересный вопрос! Давайте подумаем вместе...",
        "Отличное наблюдение! Вот что я могу посоветовать...",
        "По моим данным, это связано с...",
        "Рекомендую изучить этот вопрос подробнее в учебных материалах",
        "Ваш прогресс впечатляет! Продолжайте в том же духе!"
      ];
      const randomResponse = botResponses[Math.floor(Math.random() * botResponses.length)];
      setMessages(prev => [...prev, { type: 'bot', text: randomResponse }]);
    }, 1000);

    setChatMessage('');
  };

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('access_token');
    if (onLogout) {
      onLogout();
    } else {
      navigate('/login');
    }
  };

  const handleStartGame = () => {
    if (onStartGame) {
      onStartGame();
    } else {
      navigate('/game');
    }
  };

  const quickActions = [
    { label: 'Учебные игры', action: handleStartGame },
    { label: 'База знаний', action: () => navigate('/articles') },
    { label: 'Статистика', action: () => console.log('Open statistics') },
    { label: 'Настройки', action: () => console.log('Open settings') }
  ];

  return (
    <div className="main-menu-container">
      {/* Header */}
      <header className="main-menu-header">
        <div className="app-title">Учебная платформа</div>
        <button className="logout-btn" onClick={handleLogout}>
          Выйти
        </button>
      </header>

      <div className="main-menu-content">
        {/* Левая панель - Кнопки и информация */}
        <div className="left-panel">
          <div className="quick-actions">
            <h3>Быстрые действия</h3>
            {quickActions.map((action, index) => (
              <button
                key={index}
                className="action-btn"
                onClick={action.action}
              >
                {action.label}
              </button>
            ))}
          </div>

          <div className="user-info-card">
            <div className="user-avatar">
              {userName?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="user-details">
              <div className="user-name">{userName || 'Пользователь'}</div>
              <div className="user-rating">
                <span className="rating-label">Рейтинг:</span>
                <span className="rating-value">{userRating}</span>
              </div>
            </div>
          </div>

          <div className="info-section">
            <h3>Полезная информация</h3>
            <div className="info-cards">
              <div className="info-card">
                <h4>Советы по обучению</h4>
                <p>• Регулярно занимайтесь</p>
                <p>• Используйте игры для практики</p>
                <p>• Отслеживайте прогресс</p>
              </div>
              <div className="info-card">
                <h4>Ваш прогресс</h4>
                <p>• Пройдено игр: 12</p>
                <p>• Средний балл: 85%</p>
                <p>• Активные дни: 15</p>
              </div>
            </div>
          </div>
        </div>

        {/* Центральная панель - Маскот */}
        <div className="center-panel">
          <div className="mascot-section">
            <div className="mascot-container">
              <img 
                src="/images/mascot.png" 
                alt="Учебный маскот"
                className="mascot-image"
              />
              <div className="mascot-status">
                <span className="status-text">Маскот готов помочь!</span>
              </div>
            </div>
            <div className="mascot-description">
              <p>Маскот меняется в зависимости от ваших успехов в обучении и настроения</p>
            </div>
          </div>
        </div>

        {/* Правая панель - Чат с нейросетью */}
        <div className="right-panel">
          <div className="chat-section">
            <div className="chat-header">
              <h3>Чат с нейросетью</h3>
              <div className="chat-status online">Online</div>
            </div>
            
            <div className="chat-messages">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`message ${message.type === 'user' ? 'user-message' : 'bot-message'}`}
                >
                  <div className="message-avatar">
                    {message.type === 'user' ? '👤' : '🤖'}
                  </div>
                  <div className="message-content">
                    <div className="message-text">{message.text}</div>
                    <div className="message-time">
                      {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <form className="chat-input-form" onSubmit={handleSendMessage}>
              <div className="input-container">
                <input
                  type="text"
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  placeholder="Задайте вопрос нейросети..."
                  className="message-input"
                />
                <button type="submit" className="send-button">
                  📤
                </button>
              </div>
            </form>
          </div>

          <div className="leaderboard-section">
            <h3>Топ игроков</h3>
            <div className="leaderboard">
              <div className="leaderboard-item current">
                <span className="rank">1</span>
                <span className="name">{userName || 'Вы'}</span>
                <span className="score">{userRating}</span>
              </div>
              <div className="leaderboard-item">
                <span className="rank">2</span>
                <span className="name">Alex</span>
                <span className="score">145</span>
              </div>
              <div className="leaderboard-item">
                <span className="rank">3</span>
                <span className="name">Maria</span>
                <span className="score">132</span>
              </div>
              <div className="leaderboard-item">
                <span className="rank">4</span>
                <span className="name">John</span>
                <span className="score">128</span>
              </div>
              <div className="leaderboard-item">
                <span className="rank">5</span>
                <span className="name">Anna</span>
                <span className="score">115</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainWindow;

