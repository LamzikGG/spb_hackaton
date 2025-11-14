import React, { useState } from 'react';
import './MainWindow.css';

const MainWindow = ({ onLogout, onStartGame, userName }) => {
  const [chatMessage, setChatMessage] = useState('');
  const [messages, setMessages] = useState([
    { type: 'bot', text: 'Привет! Я нейросеть-помощник. Чем могу помочь?' }
  ]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;

    const userMsg = { type: 'user', text: chatMessage };
    setMessages(prev => [...prev, userMsg]);
    
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

  const quickActions = [
    { label: 'Учебные игры', action: onStartGame, icon: '🎮' },
    { label: 'База знаний', action: () => console.log('Open knowledge base'), icon: '📚' },
  ];

  return (
    <div className="main-menu-container">
      {/* Главный синий контейнер */}
      <div className="main-content-wrapper">
        {/* Header */}
        <header className="main-menu-header">
          <div className="app-title">Учебная платформа</div>
        </header>

        <div className="main-menu-content">
          {/* Левая панель */}
          <div className="left-panel">
            <div className="menu-container">
              <h3 className="menu-title">Меню</h3>
              <div className="quick-actions-grid">
                {quickActions.map((action, index) => (
                  <button
                    key={index}
                    className="action-btn"
                    onClick={action.action}
                  >
                    <span className="action-icon">{action.icon}</span>
                    <span className="action-label">{action.label}</span>
                  </button>
                ))}
              </div>

              {/* Профиль внизу */}
              <div className="profile-section">
                <div className="profile-card">
                  <div className="profile-avatar">
                    {userName?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div className="profile-info">
                    <div className="profile-name">{userName || 'Пользователь'}</div>
                    <div className="profile-rating">
                      <span className="rating-text">Рейтинг: </span>
                      <span className="rating-value">150 очков</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Центральная панель */}
          <div className="center-panel">
            {/* Маскот */}
            <div className="mascot-section">
              <div className="mascot-container">
                <img 
                  src="/images/mascot.png" 
                  alt="Учебный маскот"
                  className="mascot-image"
                />
              </div>
              <div className="mascot-status">
                <span className="status-text">Маскот готов к обучению! 💬</span>
              </div>
              <div className="mascot-description">
                <p>Маскот меняется в зависимости от ваших успехов в обучении и настроения</p>
              </div>
            </div>

            {/* Чат с нейросетью */}
            <div className="chat-section">
              <div className="chat-header">
                <h3>💬 Чат с нейросетью</h3>
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainWindow;