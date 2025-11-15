// src/pages/Home.jsx
import { useState } from 'react';
import '../App.css';
import ProfileForm from '../components/ProfileForm';
import ArticleDisplay from '../components/ArticleDisplay';
import './Home.css';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

export default function Home() {
  const [article, setArticle] = useState(null);
  const [topics, setTopics] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleProfileSubmit = async (profileData) => {
    setIsLoading(true);
    setError(null);
    setArticle(null);
    setTopics(null);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 360000); // 6 minutes timeout (model loading can take time)

      const response = await fetch(`${API_BASE_URL}/api/v1/profile/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // Check if response is empty
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        if (response.status === 0 || response.statusText === '') {
          throw new Error('Пустой ответ от сервера. Бэкенд мог упасть. Проверьте логи бэкенда: docker-compose logs backend');
        }
      }

      if (!response.ok) {
        let errorMessage = `Ошибка HTTP! статус: ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.detail || errorMessage;
        } catch (e) {
          // If we can't parse JSON, try to get text
          try {
            const text = await response.text();
            if (text) errorMessage = text.substring(0, 200);
          } catch (e2) {
            // Ignore
          }
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      
      if (!data.article) {
        throw new Error('Сервер вернул пустую статью. Пожалуйста, попробуйте снова.');
      }

      setArticle(data.article);
      setTopics(data.topics || []);
    } catch (err) {
      let errorMessage = 'Не удалось сгенерировать статью. Пожалуйста, попробуйте снова.';
      
      if (err.name === 'AbortError' || err.message.includes('504') || err.message.includes('timeout')) {
        errorMessage = 'Превышено время ожидания. Mistral AI API слишком долго отвечает. Пожалуйста, подождите немного и попробуйте снова. Если проблема сохраняется, проверьте: docker-compose logs backend';
      } else if (err.message.includes('Failed to fetch') || err.message.includes('ERR_EMPTY_RESPONSE')) {
        errorMessage = 'Не удалось подключиться к серверу бэкенда. Убедитесь, что:\n1. Бэкенд запущен: docker-compose ps\n2. Проверьте логи бэкенда: docker-compose logs backend\n3. Убедитесь, что MISTRAL_API_KEY установлен в переменных окружения';
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      console.error('Error generating article:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setArticle(null);
    setTopics(null);
    setError(null);
  };

  return (
    <div className="home-page">
      <div className="home-header">
        <h1>AI Помощник по профилю</h1>
        <p className="subtitle">
          Получайте персонализированные статьи и открывайте темы, подобранные под ваши интересы
        </p>
      </div>

      <div className="home-content">
        {error && (
          <div className="error-message">
            <span className="error-icon">⚠️</span>
            <div>
              <strong>Ошибка:</strong> 
              <pre style={{ whiteSpace: 'pre-wrap', marginTop: '0.5rem' }}>{error}</pre>
              {(error.includes('Mistral') || error.includes('backend') || error.includes('Cannot connect') || error.includes('API key') || error.includes('бэкенд') || error.includes('подключиться')) && (
                <div className="error-hint">
                  <p><strong>Шаги по устранению неполадок:</strong></p>
                  <ol style={{ marginLeft: '1.5rem', marginTop: '0.5rem' }}>
                    <li>Проверьте, запущены ли контейнеры: <code>docker ps</code></li>
                    <li>Проверьте логи бэкенда: <code>docker-compose logs backend</code></li>
                    <li>Убедитесь, что MISTRAL_API_KEY установлен: <code>echo $MISTRAL_API_KEY</code></li>
                    <li>Установите API ключ в файле .env или docker-compose.yml: <code>MISTRAL_API_KEY=ваш_api_ключ</code></li>
                    <li>Получите API ключ на: <a href="https://console.mistral.ai/" target="_blank" rel="noopener noreferrer">Mistral AI Console</a></li>
                    <li>Перезапустите сервисы: <code>docker-compose restart</code></li>
                  </ol>
                </div>
              )}
            </div>
          </div>
        )}

        {!article ? (
          <ProfileForm onSubmit={handleProfileSubmit} isLoading={isLoading} />
        ) : (
          <ArticleDisplay 
            article={article} 
            topics={topics} 
            onReset={handleReset}
          />
        )}

        {isLoading && (
          <div className="loading-overlay">
            <div className="loading-spinner"></div>
            <p>Mistral AI анализирует ваш профиль и генерирует персонализированную статью...</p>
            <p style={{ fontSize: '0.9rem', opacity: 0.8, marginTop: '0.5rem' }}>
              Пожалуйста, подождите, пока Mistral AI обрабатывает ваш запрос.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}