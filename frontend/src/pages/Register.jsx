// src/pages/Register.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';

export default function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Простая валидация паролей
    if (formData.password !== formData.confirmPassword) {
      alert('Пароли не совпадают!');
      return;
    }

    console.log('Регистрация:', formData);
    // Здесь можно отправить на FastAPI
    navigate('/');
  };

  return (
    <div className="container">
      <h1 className="register-title">Регистрация</h1>
      
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          placeholder="Введите ник"
          value={formData.username}
          onChange={handleChange}
          required
          className="input-field"
        />

        <input
          type="email"
          name="email"
          placeholder="Введите email"
          value={formData.email}
          onChange={handleChange}
          required
          className="input-field"
        />

        <input
          type="password"
          name="password"
          placeholder="Пароль"
          value={formData.password}
          onChange={handleChange}
          required
          className="input-field"
        />

        <input
          type="password"
          name="confirmPassword"
          placeholder="Повторите пароль"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
          className="input-field"
        />

        <button type="submit" className="submit-button">
          Подтвердить
        </button>
      </form>
    </div>
  );
}