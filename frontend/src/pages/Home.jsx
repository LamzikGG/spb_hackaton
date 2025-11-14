// src/pages/Home.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Проверяем авторизацию при загрузке компонента
    const token = localStorage.getItem('access_token');
    const storedUsername = localStorage.getItem('username');
    
    if (!token) {
      navigate('/');
      return;
    }
    
    setUsername(storedUsername || 'Пользователь');
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('username');
    localStorage.removeItem('isAuthenticated');
    navigate('/');
  };

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>Добро пожаловать, {username}!</h1>
      <p>Вы успешно зарегистрировались и попали на главную страницу.</p>
      
      <button 
        onClick={handleLogout}
        style={{
          marginTop: '20px',
          padding: '10px 20px',
          backgroundColor: '#000',
          color: 'white',
          border: 'none',
          borderRadius: '12px',
          cursor: 'pointer'
        }}
      >
        Выйти
      </button>
      
      {/* Здесь может быть ваш маскот, чат и т.д. */}
    </div>
  );
}