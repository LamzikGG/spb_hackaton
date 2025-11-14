// src/pages/Home.jsx
import { useState } from 'react';
import '../App.css';

export default function Home() {
  const [activeFeature, setActiveFeature] = useState(null);
  const [isHovered, setIsHovered] = useState(false); // Для анимации

  const features = [
    { id: 'search', label: 'Поиск', icon: '🔍' },
    { id: 'schedule', label: 'Расписание', icon: '📅' },
    { id: 'advice', label: 'Совет', icon: '💡' },
    { id: 'support', label: 'Поддержка', icon: '🤗' },
    { id: 'chat', label: 'Чат', icon: '💬' },
    { id: 'settings', label: 'Настройки', icon: '⚙️' }
  ];

  return (
    <div className="container">
      <h1 className="page-title">Привет, друг!</h1>
      
      <div className="mascot-container">
        {/* Центральный маскот с анимацией */}
        <div
          className={`mascot-center ${isHovered ? 'hovered' : ''}`}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          🦉
        </div>

        {/* Кнопки вокруг маскота */}
        <div className="feature-buttons">
          {features.map((feature, index) => (
            <button
              key={feature.id}
              className="feature-button"
              onClick={() => setActiveFeature(feature.id)}
              style={{
                transform: `rotate(${index * 60}deg) translateY(${
                  isHovered ? '-100px' : '-80px'
                }) rotate(${-index * 60}deg)`
              }}
            >
              <span>{feature.icon}</span>
              <span className="feature-label">{feature.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Модальное окно */}
      {activeFeature && (
        <div className="modal-overlay" onClick={() => setActiveFeature(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Вы выбрали: {features.find(f => f.id === activeFeature)?.label}</h3>
            <p>Здесь будет логика функции "{features.find(f => f.id === activeFeature)?.label}"</p>
            <button onClick={() => setActiveFeature(null)}>Закрыть</button>
          </div>
        </div>
      )}
    </div>
  );
}