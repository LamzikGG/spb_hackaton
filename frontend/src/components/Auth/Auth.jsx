import React, { useState, useRef, useEffect } from 'react';
import './Auth.css';

const Auth = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [showWelcomeVideo, setShowWelcomeVideo] = useState(false);
  const videoRef = useRef(null);

  // Таймер для автоматического перехода после 5 секунд
  useEffect(() => {
    if (showWelcomeVideo) {
      const timer = setTimeout(() => {
        console.log('5 seconds passed, auto navigating to MainWindow');
        handleNavigateToMain();
      }, 5000); // 5 секунд

      return () => clearTimeout(timer);
    }
  }, [showWelcomeVideo]);

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
      // РЕГИСТРАЦИЯ - показываем видео
      console.log('Registration successful, showing welcome video');
      setShowWelcomeVideo(true);
    } else {
      // ЛОГИН - сразу переходим в MainWindow
      console.log('Login successful, calling onLogin');
      onLogin(formData.username);
    }
  };

  const handleNavigateToMain = () => {
    setShowWelcomeVideo(false);
    videoRef.current?.pause();
    onLogin(formData.username);
  };

  const handleVideoEnd = () => {
    console.log('Video ended, navigating to MainWindow');
    handleNavigateToMain();
  };

  const handleCloseVideo = () => {
    console.log('Video closed manually, navigating to MainWindow');
    handleNavigateToMain();
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
            <div className="video-timer">
              Автоматический переход через: <span className="timer-count">5</span> сек
            </div>
            <button className="skip-button" onClick={handleCloseVideo}>
              Перейти сейчас
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