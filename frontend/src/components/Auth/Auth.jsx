import React, { useState, useRef } from 'react';
import './Auth.css';

const Auth = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [showWelcomeVideo, setShowWelcomeVideo] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const videoRef = useRef(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    
    if (!isLogin) {
      // Регистрация - показываем видео
      console.log('Registration successful, showing welcome video');
      setIsRegistered(true);
      setShowWelcomeVideo(true);
    } else {
      // Логин - обычная авторизация
      console.log('Login successful, calling onLogin');
      onLogin(); // Вызываем функцию для перехода на MainWindow
    }
  };

  const handleVideoEnd = () => {
    console.log('Video ended, switching to login form');
    setShowWelcomeVideo(false);
    // После видео переключаем на логин
    setIsLogin(true);
    setFormData({ username: '', password: '' });
  };

  const handleCloseVideo = () => {
    console.log('Video closed, switching to login form');
    setShowWelcomeVideo(false);
    videoRef.current?.pause();
  };

  const handleSkipToMain = () => {
    console.log('Skipping to MainWindow after registration');
    setShowWelcomeVideo(false);
    onLogin(); // Переходим сразу в MainWindow после регистрации
  };

  if (showWelcomeVideo) {
    return (
      <div className="video-overlay">
        <div className="video-container">
          <button className="close-video-btn" onClick={handleCloseVideo}>
            ×
          </button>
          <video
            ref={videoRef}
            autoPlay
            muted
            onEnded={handleVideoEnd}
            className="welcome-video"
          >
            <source src="/videos/welcome-video.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <div className="video-text">
            <h2>Добро пожаловать, {formData.username}!</h2>
            <p>Ваша регистрация завершена успешно</p>
            <button className="skip-button" onClick={handleSkipToMain}>
              Перейти в приложение
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>{isLogin ? 'Login' : 'Register'}</h2>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="input-group">
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="auth-button">
            {isLogin ? 'Login' : 'Register'}
          </button>
        </form>

        <div className="auth-switch">
          <p>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <span 
              className="switch-link" 
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? 'Register' : 'Login'}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;